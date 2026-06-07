import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-adab-gray-300 bg-white p-8 shadow-[0_4px_24px_rgba(27,42,74,0.08)]">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-adab-navy-800">
          Adab Admin
        </h1>
        <p className="mt-2 text-sm text-adab-gray-500">
          Sign in to manage property listings
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-adab-gray-500">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
