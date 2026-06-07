import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin login",
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-adab-cream px-4">
      {children}
    </div>
  );
}
