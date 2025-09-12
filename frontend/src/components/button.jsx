// src/components/ui/button.jsx
export const Button = ({ children, ...props }) => (
  <button className="px-4 py-2 bg-red-600 text-white rounded" {...props}>
    {children}
  </button>
);
