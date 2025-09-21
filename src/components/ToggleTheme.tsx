import React from "react";

type Theme = {
  label: string;
  value: string;
};

const themes: Theme[] = [
  { label: "Default", value: "default" },
  { label: "Retro", value: "retro" },
  { label: "Retro", value: "" },
  { label: "Valentine", value: "valentine" },
  { label: "Aqua", value: "aqua" },
];

const ThemeList: React.FC<{ themes: Theme[] }> = ({ themes }) => {
  return (
    <ul className="dropdown-content bg-base-300 rounded-box z-1 w-52 p-2 shadow-2xl">
      {themes.map((theme) => (
        <li key={theme.value}>
          <input
            type="radio"
            name="theme-dropdown"
            className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
            aria-label={theme.label}
            value={theme.value}
          />
        </li>
      ))}
    </ul>
  );
};

const ToggleTheme: React.FC = () => {
  return (
    <div className="dropdown ">
      <div tabIndex={0} role="button" className="btn m-1">
        Theme
        <svg
          width="12px"
          height="12px"
          className="inline-block h-2 w-2 fill-current opacity-60"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 2048 2048"
        >
          <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
        </svg>
      </div>
      <ThemeList themes={themes} />
    </div>
  );
};

export default ToggleTheme;
