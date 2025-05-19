import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

// Flexible Card component with optional motion and variant support
const Card = ({
  title,
  content,
  footer,
  className,
  children,
  variant,
  animate = true, // Allow disabling motion if needed
}) => {
  const isStructured = title || content || footer;

  const baseClasses = clsx(
    "rounded-2xl shadow-md bg-white dark:bg-gray-800 transition-colors duration-300 border border-gray-200 dark:border-gray-700",
    "w-full",
    {
      "h-96": variant === "institution", // Custom height for institution cards
    },
    className
  );

  const MotionWrapper = animate ? motion.div : "div";

  return (
    <MotionWrapper
      className={baseClasses}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={animate ? { duration: 0.4 } : undefined}
    >
      {children ? (
        children // Custom layout (e.g. chart)
      ) : (
        <div className="p-6 space-y-4 max-w-xl">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {content && (
            <p className="text-gray-700 dark:text-gray-300">{content}</p>
          )}
          {footer && (
            <div className="pt-2 border-t text-sm text-gray-500 dark:text-gray-400">
              {footer}
            </div>
          )}
        </div>
      )}
    </MotionWrapper>
  );
};

// CardContent for inner layout
export const CardContent = ({ className, children }) => (
  <div className={clsx("p-4 md:p-6", className)}>{children}</div>
);

export default Card;
