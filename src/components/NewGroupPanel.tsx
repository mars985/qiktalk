import React, { useState } from "react";
import { ArrowLeft, X, Users } from "lucide-react";
import SearchBar from "./SearchUsers";
import socket from "@/lib/socket";
import type { User } from "@/types/user";
import type { Conversation } from "@/types/conversation";

interface NewGroupPanelProps {
  onNewGroup: (conversationId: string) => void;
  onClose: () => void;
  onBack: () => void;
}

const NewGroupPanel: React.FC<NewGroupPanelProps> = ({
  onNewGroup,
  onClose,
  onBack,
}) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [step, setStep] = useState<"select" | "name">("select");
  const [groupName, setGroupName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddUser = (user: User) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleRemoveUser = (id: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleCreateGroup = () => {
    if (!groupName.trim() || selectedUsers.length < 2) return;

    setCreating(true);
    setError(null);

    socket.emit(
      "createConversation",
      {
        conversationType: "group",
        participantIds: selectedUsers.map((u) => u._id),
        groupName: groupName.trim(),
      },
      (response: {
        success: boolean;
        data?: Conversation;
        message?: string;
      }) => {
        setCreating(false);
        if (response.success && response.data) {
          onNewGroup(response.data._id);
          onClose();
        } else {
          setError(response.message || "Couldn't create group. Try again.");
        }
      }
    );
  };

  // Back steps through the flow: name -> select -> close menu.
  const headerBack = step === "name" ? () => setStep("select") : onBack;
  const title = step === "name" ? "Name your group" : "New group";

  return (
    <div className="absolute right-0 z-50 mt-2 w-80 origin-top-right rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <button
          onClick={headerBack}
          className="rounded-lg p-1 transition-colors hover:bg-base-200"
          aria-label="Back"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <button
          onClick={onClose}
          className="rounded-lg p-1 transition-colors hover:bg-base-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Selected members */}
      {selectedUsers.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedUsers.map((u) => (
            <span
              key={u._id}
              className="flex items-center gap-1.5 rounded-full bg-base-200 py-1 pl-1 pr-2 text-sm"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral text-[10px] font-semibold text-neutral-content">
                {u.username.charAt(0).toUpperCase()}
              </span>
              {u.username}
              <button
                onClick={() => handleRemoveUser(u._id)}
                className="text-base-content/50 transition-colors hover:text-error"
                aria-label={`Remove ${u.username}`}
              >
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Step 1: pick people */}
      {step === "select" && (
        <>
          <SearchBar placeholder="Add people..." onSelectUser={handleAddUser} />
          <button
            className="btn btn-primary btn-sm mt-3 w-full"
            disabled={selectedUsers.length < 2}
            onClick={() => setStep("name")}
          >
            Next{selectedUsers.length > 0 ? ` · ${selectedUsers.length} selected` : ""}
          </button>
          {selectedUsers.length < 2 && (
            <p className="mt-2 text-center text-xs text-base-content/50">
              Add at least 2 people to start a group
            </p>
          )}
        </>
      )}

      {/* Step 2: name the group */}
      {step === "name" && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary">
            <Users size={16} className="shrink-0 text-base-content/50" />
            <input
              autoFocus
              type="text"
              placeholder="Group name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateGroup();
              }}
              className="flex-1 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/50"
            />
          </div>

          {error && <p className="text-xs text-error">{error}</p>}

          <button
            className="btn btn-primary btn-sm w-full"
            disabled={!groupName.trim() || creating}
            onClick={handleCreateGroup}
          >
            {creating ? "Creating..." : "Create group"}
          </button>
        </div>
      )}
    </div>
  );
};

export default NewGroupPanel;
