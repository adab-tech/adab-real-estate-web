import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";

type ProfileUsernamePromptProps = {
  hasUsername: boolean;
};

export function ProfileUsernamePrompt({ hasUsername }: ProfileUsernamePromptProps) {
  if (hasUsername) return null;

  return (
    <div className="portal-alert portal-alert-success mb-6 flex flex-col gap-3 phone:flex-row phone:items-center phone:justify-between">
      <div>
        <p className="font-semibold text-adab-navy-800">
          Claim your public profile link
        </p>
        <p className="mt-1 text-sm text-adab-navy-700">
          Choose a username so buyers can find all your listings at one
          shareable link — e.g. {absoluteUrl("/l/your-name").replace(/^https?:\/\//, "")}.
        </p>
      </div>
      <Link href="/portal/settings" className="portal-btn portal-btn-primary shrink-0">
        Set username
      </Link>
    </div>
  );
}
