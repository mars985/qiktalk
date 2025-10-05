import React, { useState, useEffect, useRef } from "react";
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
      const res = await api.get("/searchUsernames", { params: { searchString } });
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

  const handleSelect = (user: User) => {
    setSkipSearch(true);
    setQuery("");
    setOpen(false);
    onSelectUser(user);
  };

  return (
    <div ref={wrapperRef} className="relative w-72">
      {/* Input wrapper */}
      <div
        className="
          flex items-center px-3 py-2 rounded-md shadow
          bg-base-200 hover:bg-base-300 transition-all
          focus-within:ring-2 focus-within:ring-secondary
        "
      >
        <input
          type="text"
          placeholder={placeholder || "Search..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            flex-1 bg-transparent outline-none text-sm
            placeholder:text-base-content/50
            text-base-content
          "
        />
        {loading && (
          <div className="w-4 h-4 border-2 border-base-300 border-t-base-content rounded-full animate-spin ml-2" />
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <ul
          className="
            absolute left-0 right-0 mt-1 rounded-md shadow-md z-10
            max-h-52 overflow-y-auto border border-base-300
            bg-base-100
          "
        >
          {results.map((user) => (
            <li
              key={user._id}
              onClick={() => handleSelect(user)}
              className="
                px-3 py-2 text-sm cursor-pointer transition-colors
                hover:bg-base-200
                text-base-content
              "
            >
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
