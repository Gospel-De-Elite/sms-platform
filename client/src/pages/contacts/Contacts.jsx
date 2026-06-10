import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2, Users } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getGroups,
  getContacts,
  createGroup,
  createContact,
  deleteContact,
  deleteGroup,
} from "../../services/contactService";

export default function Contacts() {
  const queryClient = useQueryClient();
  const [activeGroup, setActiveGroup] = useState(null);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [contactForm, setContactForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
  });

  const { data: groupsData } = useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });

  const { data: contactsData } = useQuery({
    queryKey: ["contacts", activeGroup],
    queryFn: () => getContacts(1, 50, activeGroup),
  });

  const groups = groupsData?.data || [];
  const contacts = contactsData?.data?.contacts || [];

  const createGroupMutation = useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Group created");
      setGroupName("");
      setShowAddGroup(false);
    },
    onError: () => toast.error("Failed to create group"),
  });

  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Contact added");
      setContactForm({ firstName: "", lastName: "", phone: "", email: "" });
      setShowAddContact(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add contact");
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast.success("Contact deleted");
    },
    onError: () => toast.error("Failed to delete contact"),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setActiveGroup(null);
      toast.success("Group deleted");
    },
    onError: () => toast.error("Failed to delete group"),
  });

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6">Contacts</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Groups Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                <p className="text-white text-sm font-medium">Groups</p>
                <button
                  onClick={() => setShowAddGroup(true)}
                  className="text-blue-500 hover:text-blue-400"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="p-2">
                <button
                  onClick={() => setActiveGroup(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                    !activeGroup
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  All Contacts
                </button>
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer ${
                      activeGroup === group.id
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                    onClick={() => setActiveGroup(group.id)}
                  >
                    <span className="text-sm truncate">{group.name}</span>
                    <span className="text-xs opacity-70 ml-2">
                      {group._count?.contacts || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contacts Table */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                <p className="text-white font-medium">
                  {activeGroup
                    ? groups.find((g) => g.id === activeGroup)?.name
                    : "All Contacts"}
                  <span className="text-slate-500 text-sm ml-2">
                    ({contacts.length})
                  </span>
                </p>
                <div className="flex items-center gap-2">
                  {activeGroup && (
                    <button
                      onClick={() => deleteGroupMutation.mutate(activeGroup)}
                      className="text-red-500 hover:text-red-400 text-sm flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete Group
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddContact(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Add Contact
                  </button>
                </div>
              </div>

              {contacts.length === 0 ? (
                <div className="p-8 text-center">
                  <Users size={32} className="text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No contacts yet</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Name</th>
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Phone</th>
                      <th className="text-left text-slate-400 text-sm font-medium px-6 py-3">Email</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition"
                      >
                        <td className="px-6 py-3">
                          <span className="text-white text-sm">
                            {contact.firstName} {contact.lastName}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-slate-300 text-sm">{contact.phone}</span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-slate-500 text-sm">{contact.email || "—"}</span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <button
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                            className="text-slate-600 hover:text-red-500 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Group Modal */}
      {showAddGroup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white font-semibold mb-4">Create Group</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddGroup(false)}
                className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => createGroupMutation.mutate({ name: groupName })}
                disabled={createGroupMutation.isPending}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm hover:bg-blue-700 transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <h2 className="text-white font-semibold mb-4">Add Contact</h2>
            <div className="space-y-3">
              <input
                type="text"
                value={contactForm.firstName}
                onChange={(e) => setContactForm({ ...contactForm, firstName: e.target.value })}
                placeholder="First name"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              />
              <input
                type="text"
                value={contactForm.lastName}
                onChange={(e) => setContactForm({ ...contactForm, lastName: e.target.value })}
                placeholder="Last name"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              />
              <input
                type="tel"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                placeholder="Phone number *"
                required
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              />
              <input
                type="email"
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                placeholder="Email (optional)"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition"
              />
              {activeGroup && (
                <p className="text-slate-500 text-xs">
                  Will be added to: {groups.find((g) => g.id === activeGroup)?.name}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAddContact(false)}
                className="flex-1 bg-slate-800 text-white rounded-lg py-2.5 text-sm hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => createContactMutation.mutate({
                  ...contactForm,
                  groupId: activeGroup,
                })}
                disabled={createContactMutation.isPending}
                className="flex-1 bg-blue-600 text-white rounded-lg py-2.5 text-sm hover:bg-blue-700 transition"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}