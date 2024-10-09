import { forwardRef } from "react";
import { NavLink } from "react-router-dom";

export const CustomNavLink: typeof NavLink = forwardRef(
  ({ to, children, ...props }, _) => {
    return (
      <NavLink
        to={to}
        {...props}
        className={({ isActive }) =>
          `${
            props.className
          } block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
            isActive
              ? "text-white bg-blue-600"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } `
        }
      >
        {children}
      </NavLink>
    );
  }
);
