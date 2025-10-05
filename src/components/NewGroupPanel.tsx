import React, { useState } from "react";
import SearchBar from "./SearchUsers";
import api from "@/lib/axios";
import type { User } from "@/types/user";

interface NewGroupPanelProps {
  onNewGroup: (conversationId: string) => void;
  onClose: () => void;
}

const NewGroupPanel: React.FC<NewGroupPanelProps> = ({
  onNewGroup,
  onClose,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [step, setStep] = useState<"select" | "name">("select");
  const [groupName, setGroupName] = useState("");

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleCreateGroup = async () => {
    try {
      const ids = selectedUsers.map((u) => u._id);
      const res = await api.post("/createGroup", {
        participantIds: ids,
        groupName,
      });
      onNewGroup(res.data.data._id);
      onClose();
    } catch (err) {
      console.error("Error creating group:", err);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-md shadow-lg p-3 z-50">
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center gap-1 bg-base-200 text-sm rounded-full px-2 py-1"
            >
              <span>{user.username}</span>
              <button
                className="text-error"
                onClick={() => handleRemoveUser(user._id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
      {/* Step 1: Select Users */}
      {step === "select" && (
        <>
          <SearchBar
            placeholder="Add users to group..."
            onSelectUser={handleAddUser}
          />
          <button
            className="btn btn-primary w-full mt-3"
            disabled={selectedUsers.length < 2}
            onClick={() => setStep("name")}
          >
            Next
          </button>
        </>
      )}

      {/* Step 2: Group Name */}
      {step === "name" && (
        <div className="flex flex-col gap-3">
          {/* Styled Input */}
          <div
            className="
                flex items-center px-3 py-2 rounded-md shadow
                bg-base-200 hover:bg-base-300 transition-all
                focus-within:ring-2 focus-within:ring-secondary
            "
          >
            <input
              type="text"
              placeholder="Enter group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="
                flex-1 bg-transparent outline-none text-sm
                placeholder:text-base-content/50
                text-base-content
              "
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button className="btn" onClick={() => setStep("select")}>
              Back
            </button>
            <button
              className="btn btn-primary"
              disabled={!groupName.trim()}
              onClick={handleCreateGroup}
            >
              Create Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewGroupPanel;
