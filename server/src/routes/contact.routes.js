const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
    createGroupController,
    getGroupsController,
    deleteGroupController,
    createContactController,
    getContactsController,
    deleteContactController,
} = require("../controllers/contact.controller");

router.post("/groups", protect, createGroupController);
router.get("/groups", protect, getGroupsController);
router.delete("/groups/:groupId", protect, deleteGroupController);

router.post("/", protect, createContactController);
router.get("/", protect, getContactsController);
router.delete("/:contactId", protect, deleteContactController);

module.exports = router;