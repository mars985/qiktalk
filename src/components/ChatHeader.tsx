import { useEffect, useState } from "react";
import api from "@/lib/axios";
import type { User } from "@/types/user";
import useUser from "@/hooks/useUser";

const ChatHeader: React.FC<{
  conversationId: string | null;
}> = ({ conversationId }) => {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/${conversationId}/user`);
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [conversationId]);

  // exclude current user
  const otherUsers = users.filter((u) => u._id !== user?._id);

  return (
    <div className="flex flex-row items-center px-4 gap-2 h-16 w-full border-b border-gray-200 dark:border-neutral-700">
      {loading ? (
        <span className="text-gray-500">Loading...</span>
      ) : otherUsers.length > 0 ? (
        <>
          {otherUsers.length > 2 ? (
            otherUsers.map((u) => (
              <div key={u._id} className="flex items-center gap-2">
                {/* <img
                  src={u.avatarUrl}
                  alt={u.username}
                  className="w-10 h-10 rounded-full object-cover"
                /> */}
                <span className="font-medium">{u.username}</span>
              </div>
            ))
          ) : (
            <div className="flex flex-col h-full justify-center">
              <span>{otherUsers[0].username}</span>
              <span className="text-gray-600 text-sm dark:text-gray-400">
                last seen yesterday
              </span>
            </div>
          )}
        </>
      ) : (
        <span className="text-gray-500">No users</span>
      )}
    </div>
  );
};

export default ChatHeader;
