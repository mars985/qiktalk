import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import api from "@/lib/axios";
import type { User } from "@/types/user";

const SearchBar: React.FC<{
  setConversationId: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ setConversationId }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [skipSearch, setSkipSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    if (skipSearch) {
      setSkipSearch(false);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      searchUsernames(query);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, skipSearch]);

  const searchUsernames = async (searchString: string) => {
    try {
      setLoading(true);
      const res = await api.get("/searchUsernames", {
        params: { searchString },
      });
      setResults(res.data.data);
      setOpen(res.data.data.length > 0);
    } catch (error) {
      console.error("Error searching usernames:", error);
      setResults([]);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (_id: string) => {
    setSkipSearch(true);
    setQuery("");
    setOpen(false);
    try {
      const convRes = await api.post("/createDM", { targetUserId: _id });
      // console.log(convRes);
      const conversationId = convRes.data.data._id;
      setConversationId(conversationId);
      
    } catch (err) {
      console.error("Error loading conversation:", err);
    }
  };

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "300px" }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search usernames..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: loading && (
            <CircularProgress size={18} style={{ marginRight: 4 }} />
          ),
        }}
      />

      {open && (
        <Paper
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 10,
            maxHeight: 200,
            overflowY: "auto",
          }}
          elevation={3}
        >
          <List dense>
            {results.map((user) => (
              <ListItem key={user._id} disablePadding>
                <ListItemButton onClick={() => handleSelect(user._id)}>
                  <ListItemText primary={user.username} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
};

export default SearchBar;

// TODO: works only for DMs. add searching and selecting for group chats
