import React, { useRef, useState } from "react";
import axios from "axios";
import { Folder, Maximize2, Trash2, X } from "lucide-react";

import { ConversationRequest } from "@/api/conversation.api";
import { UserRequest } from "@/api/user.api";
import Avatar from "@/components/avatar/Avatar";
import useUser from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/types/conversation";
import type { User } from "@/types/user";

const acceptedTypes = "image/jpeg,image/png,image/webp,image/gif";

type ImageViewerProps = { className?: string; online?: boolean } & (
  | { user: User; group?: never; onGroupAvatarChange?: never }
  | {
      user?: never;
      group: Conversation;
      onGroupAvatarChange: (avatar: string | null) => void;
    }
);

export const ImageViewer: React.FC<ImageViewerProps> = ({
  user,
  group,
  onGroupAvatarChange,
  className,
  online,
}) => {
  const { user: loggedInUser, setUser } = useUser();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnAvatar = !!user && loggedInUser?._id === user._id;
  const shownUser = isOwnAvatar && loggedInUser ? loggedInUser : user;
  const isParticipant = !!group?.participants.some(
    (participant) => participant._id === loggedInUser?._id,
  );
  const canEdit = isOwnAvatar || isParticipant;

  const isGroup = !!group;
  const name = group
    ? group.groupName || "Unnamed Group"
    : (shownUser?.username ?? "");
  const src = group ? group.groupAvatar : shownUser?.avatar;

  const openViewer = () => {
    setError(null);
    dialogRef.current?.showModal();
  };

  const updateAvatar = async (
    request: () => Promise<string | null>,
    failureMessage: string,
  ) => {
    setPending(true);
    setError(null);

    try {
      const avatar = await request();
      if (group) {
        onGroupAvatarChange(avatar);
      } else {
        setUser((prev) => prev && { ...prev, avatar });
      }
    } catch (err) {
      const serverMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : undefined;
      setError(serverMessage ?? failureMessage);
    } finally {
      setPending(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    updateAvatar(async () => {
      const response = group
        ? await ConversationRequest.uploadGroupAvatar(group._id, file)
        : await UserRequest.uploadAvatar(file);
      return response.data.data;
    }, "Failed to upload avatar");
  };

  const handleRemove = () => {
    updateAvatar(async () => {
      if (group) {
        await ConversationRequest.removeGroupAvatar(group._id);
      } else {
        await UserRequest.removeAvatar();
      }
      return null;
    }, "Failed to remove avatar");
  };

  return (
    <>
      <button
        type="button"
        onClick={openViewer}
        className={cn(
          "group relative cursor-pointer rounded-full ring-2 ring-base-300 ring-offset-2 ring-offset-base-100 transition-shadow duration-200 hover:ring-primary focus-visible:outline-none focus-visible:ring-primary",
          className,
        )}
        aria-label={`View ${name}'s avatar`}
      >
        <Avatar name={name} src={src} isGroup={isGroup} online={online} />
        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-neutral/60 text-neutral-content opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 size={16} aria-hidden="true" />
        </span>
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-11/12 max-w-[clamp(18rem,calc(100dvh-9rem),32rem)] rounded-xl border border-base-300 bg-base-100 p-3 shadow-xl">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="min-w-0 flex-1 truncate px-1 font-semibold">
              {name}
            </h3>
            <button
              type="button"
              className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-base-200"
              onClick={() => dialogRef.current?.close()}
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-base-300 bg-base-200">
            <Avatar
              name={name}
              src={src}
              isGroup={isGroup}
              className="size-auto w-full rounded-none text-9xl"
            />
            {pending && (
              <div
                role="status"
                aria-label="Updating avatar"
                className="absolute inset-0 flex items-center justify-center bg-base-100/70"
              >
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg bg-error/10 px-3 py-2 text-center text-sm text-error"
            >
              {error}
            </p>
          )}

          {canEdit && (
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="btn btn-primary btn-sm flex-1 text-[0.8125rem]"
                onClick={() => inputRef.current?.click()}
                disabled={pending}
              >
                <Folder size={16} aria-hidden="true" />
                Upload new photo
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-sm text-[0.8125rem] text-error"
                onClick={handleRemove}
                disabled={pending || !src}
              >
                <Trash2 size={16} aria-hidden="true" />
                Remove
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={acceptedTypes}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        <form method="dialog" className="modal-backdrop">
          <button className="cursor-default!" aria-label="Close">
            close
          </button>
        </form>
      </dialog>
    </>
  );
};
