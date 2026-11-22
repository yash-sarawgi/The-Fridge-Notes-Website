import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — The Fridge Notes CMS",
  description: "Manage recipes, categories, fridge layout, and note arrangements for The Fridge Notes.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans antialiased">
      {children}
    </div>
  );
}
