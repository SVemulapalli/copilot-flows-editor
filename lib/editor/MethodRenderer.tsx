import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { Method } from "../types/Swagger";
import { cn } from "../utils";
// BG colors for method buttons
const methodStyles = (method: Method) => {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-green-400";
    case "POST":
      return "bg-blue-400";
    case "PUT":
      return "bg-yellow-400";
    case "DELETE":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
};
export const MethodBtn = forwardRef<
  ElementRef<"button">,
  { method: Method } & ComponentPropsWithoutRef<"button">
>(({ method, className, ...props }, _ref) => (
  <button
    {...props}
    ref={_ref}
    className={cn(
      "rounded-sm px-2 py-1 flex items-center justify-center font-medium text-white text-sm",
      methodStyles(method),
      className
    )}
  />
));

MethodBtn.displayName = "MethodBtn";
