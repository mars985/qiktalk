import React from "react";

const DateDivider: React.FC<{ date: string }> = ({ date }) => {
  return (
    <div className="date-divider text-center text-base-content/50 my-2">
      <span className="text-xs px-3 py-1 rounded-full">{date}</span>
    </div>
  );
};

export default DateDivider;
