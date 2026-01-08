import React from "react";

interface GameLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  layoutMode?: "fixed" | "scrollable"; // fixed = no scroll. scrollable = scrollable on all devices with hidden bar
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  header,
  footer,
  layoutMode = "fixed",
}) => {
  const containerClasses =
    layoutMode === "fixed"
      ? "h-screen fixed inset-0 overflow-hidden"
      : "h-screen fixed inset-0 overflow-y-auto custom-scrollbar";

  return (
    <div
      className={`${containerClasses} w-full bg-white text-black flex flex-col items-center justify-between p-4 font-sans`}
    >
      {/* Background effects could go here (e.g. subtle gradient blobs) */}
      <div className="fixed inset-0 bg-linear-to-br from-white to-gray-100 -z-10" />

      <header className="w-full max-w-4xl flex items-center justify-between py-4 shrink-0">
        {header}
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative">
        {children}
      </main>

      <footer className="w-full max-w-4xl py-4 flex flex-col items-center shrink-0">
        {footer}
      </footer>
    </div>
  );
};
