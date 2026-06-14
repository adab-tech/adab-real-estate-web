type ResponsiveTableProps = {
  children: React.ReactNode;
  className?: string;
  /** Minimum table width before horizontal scroll kicks in */
  minWidth?: string;
};

export function ResponsiveTable({
  children,
  className = "",
  minWidth = "36rem",
}: ResponsiveTableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-2xl border border-adab-gray-300 bg-white shadow-[0_4px_24px_rgba(27,42,74,0.08)] [-webkit-overflow-scrolling:touch] ${className}`}
    >
      <table
        className="w-full text-left text-sm"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}
