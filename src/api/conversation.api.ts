import api from "@/lib/axios";

const conversationRoute = (route: string = "") => `/conversations${route}`;

const getConversations = async function () {
  return api.get(conversationRoute("/"));
};

const createDM = async function (targetUserId: string) {
  return api.post(conversationRoute("/createDM"), { targetUserId });
};

const createGroup = async function ({
  groupName,
  participantIds,
}: {
  groupName: string;
  participantIds: [string];
}) {
  return api.post(conversationRoute("/createGroup"), {
    groupName,
    participantIds,
  });
};

const getConversationById = async function (conversationId: string) {
  return api.get(conversationRoute(`/${conversationId}`));
};

const getConversationUsers = async function (conversationId: string) {
  return api.get(conversationRoute(`/${conversationId}/users`));
};

const getConversationMessages = async function (conversationId: string) {
  return api.get(conversationRoute(`/${conversationId}/messages`));
};

const uploadGroupAvatar = async function (conversationId: string, file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  return api.post(
    conversationRoute(`/${conversationId}/uploadAvatar`),
    formData,
  );
};

const removeGroupAvatar = async function (conversationId: string) {
  return api.delete(conversationRoute(`/${conversationId}/removeAvatar`));
};

export const ConversationRequest = {
  getConversations,
  createDM,
  createGroup,
  getConversationById,
  getConversationUsers,
  getConversationMessages,
  uploadGroupAvatar,
  removeGroupAvatar,
};
