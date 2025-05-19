import React from "react";
import clsx from "clsx";

const Card = ({ className, children }) => {
  return (
    <div
      className={clsx(
        "rounded-2xl shadow-md bg-white dark:bg-gray-800 transition-colors duration-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ className, children }) => {
  return (
    <div className={clsx("p-4", className)}>
      {children}
    </div>
  );
};

export default Card;
