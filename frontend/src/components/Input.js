import React from "react";
import PropTypes from "prop-types";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});

// Set the display name
Input.displayName = "Input";

// Define prop types
Input.propTypes = {
  className: PropTypes.string, // Validate className as a string
  type: PropTypes.string, // Validate type as a string
};

export default Input;