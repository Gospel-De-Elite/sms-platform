const prisma = require("../config/db");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

// ─── Contact Groups ───────────────────────────────────
const createGroupController = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        if (!name) return next(new ApiError(400, "Group name is required"));

        const group = await prisma.contactGroup.create({
            data: { userId: req.user.id, name, description },
        });

        res.status(201).json(new ApiResponse(201, "Group created successfully", group));
    } catch (error) {
        next(error);
    }
};

const getGroupsController = async (req, res, next) => {
    try {
        const groups = await prisma.contactGroup.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
            include: { _count: { select: { contacts: true } } },
        });

        res.status(200).json(new ApiResponse(200, "Groups fetched successfully", groups));
    } catch (error) {
        next(error);
    }
};

const deleteGroupController = async (req, res, next) => {
    try {
        await prisma.contactGroup.delete({
            where: { id: req.params.groupId, userId: req.user.id },
        });
        res.status(200).json(new ApiResponse(200, "Group deleted successfully"));
    } catch (error) {
        next(error);
    }
};

// ─── Contacts ─────────────────────────────────────────
const createContactController = async (req, res, next) => {
    try {
        const { firstName, lastName, phone, email, groupId } = req.body;
        if (!phone) return next(new ApiError(400, "Phone number is required"));

        const contact = await prisma.contact.create({
            data: {
                userId: req.user.id,
                firstName,
                lastName,
                phone,
                email,
                groupId: groupId || null,
            },
        });

        // Update group count
        if (groupId) {
            await prisma.contactGroup.update({
                where: { id: groupId },
                data: { totalCount: { increment: 1 } },
            });
        }

        res.status(201).json(new ApiResponse(201, "Contact created successfully", contact));
    } catch (error) {
        if (error.code === "P2002") {
            return next(new ApiError(409, "This phone number already exists in your contacts"));
        }
        next(error);
    }
};

const getContactsController = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const groupId = req.query.groupId;

        const where = {
            userId: req.user.id,
            ...(groupId && { groupId }),
        };

        const [contacts, total] = await Promise.all([
            prisma.contact.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.contact.count({ where }),
        ]);

        res.status(200).json(
            new ApiResponse(200, "Contacts fetched successfully", {
                contacts,
                pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            })
        );
    } catch (error) {
        next(error);
    }
};

const deleteContactController = async (req, res, next) => {
    try {
        const contact = await prisma.contact.findFirst({
            where: { id: req.params.contactId, userId: req.user.id },
        });

        if (!contact) throw new ApiError(404, "Contact not found");

        await prisma.contact.delete({ where: { id: req.params.contactId } });

        if (contact.groupId) {
            await prisma.contactGroup.update({
                where: { id: contact.groupId },
                data: { totalCount: { decrement: 1 } },
            });
        }

        res.status(200).json(new ApiResponse(200, "Contact deleted successfully"));
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createGroupController,
    getGroupsController,
    deleteGroupController,
    createContactController,
    getContactsController,
    deleteContactController,
};