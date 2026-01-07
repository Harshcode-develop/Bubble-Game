import React from "react";

interface GameLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  header,
  footer,
}) => {
  return (
    <div className="h-screen w-full bg-white text-black flex flex-col items-center justify-between p-4 overflow-hidden font-sans fixed inset-0">
      {/* Background effects could go here (e.g. subtle gradient blobs) */}
      <div className="fixed inset-0 bg-linear-to-br from-white to-gray-100 -z-10" />

      <header className="w-full max-w-4xl flex items-center justify-between py-4">
        {header}
      </header>

      <main className="flex-1 w-full max-w-4xl flex flex-col items-center justify-center relative">
        {children}
      </main>

      <footer className="w-full max-w-4xl py-4 flex flex-col items-center">
        {footer}
      </footer>
    </div>
  );
};
