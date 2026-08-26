import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import api from "@/lib/axios";
import type { User } from "@/types/user";

interface SearchBarProps {
  onSelectUser: (user: User) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelectUser, placeholder }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [skipSearch, setSkipSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (skipSearch) {
      setSkipSearch(false);
      return;
    }

    if (!query.trim() || query.length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }

    const delayDebounce = setTimeout(() => searchUsernames(query), 350);
    return () => clearTimeout(delayDebounce);
  }, [query, skipSearch]);

  const searchUsernames = async (searchString: string) => {
    try {
      setLoading(true);
      const res = await api.get("/searchUsernames", { params: { searchString } });
      setResults(res.data.data);
      setOpen(true);
    } catch (error) {
      console.error("Error searching usernames:", error);
      setResults([]);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (user: User) => {
    setSkipSearch(true);
    setQuery("");
    setResults([]);
    setOpen(false);
    onSelectUser(user);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input */}
      <div className="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-2 transition-all focus-within:ring-2 focus-within:ring-primary">
        <Search size={16} className="shrink-0 text-base-content/50" />
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-base-content outline-none placeholder:text-base-content/50"
        />
        {loading && (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-base-300 border-t-base-content" />
        )}
      </div>

      {/* Results */}
      {open && (
        <ul className="absolute left-0 right-0 z-10 mt-1 max-h-56 overflow-y-auto rounded-lg border border-base-300 bg-base-100 p-1 shadow-lg">
          {results.length > 0 ? (
            results.map((user) => (
              <li
                key={user._id}
                onClick={() => handleSelect(user)}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-2 text-sm text-base-content transition-colors hover:bg-base-200"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral text-xs font-semibold text-neutral-content">
                  {user.username.charAt(0).toUpperCase()}
                </span>
                <span className="truncate">{user.username}</span>
              </li>
            ))
          ) : (
            !loading && (
              <li className="px-3 py-3 text-center text-sm text-base-content/50">
                No users found
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
