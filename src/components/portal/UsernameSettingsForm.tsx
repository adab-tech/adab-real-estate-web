"use client";

import { useActionState } from "react";
import {
  updatePublicUsername,
  type UsernameFormState,
} from "@/app/portal/settings-actions";
import {
  USERNAME_MAX,
  USERNAME_MIN,
  usernameCooldownEnds,
} from "@/lib/lister/username";
import { absoluteUrl } from "@/lib/seo";

type UsernameSettingsFormProps = {
  currentUsername: string | null;
  usernameChangedAt: string | null;
};

export function UsernameSettingsForm({
  currentUsername,
  usernameChangedAt,
}: UsernameSettingsFormProps) {
  const [state, formAction, pending] = useActionState<
    UsernameFormState,
    FormData
  >(updatePublicUsername, null);

  const cooldownEnds = usernameCooldownEnds(usernameChangedAt);
  const profileUrl = currentUsername
    ? absoluteUrl(`/l/${currentUsername}`)
    : null;

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="portal-alert portal-alert-error">{state.error}</div>
      )}
      {state?.success && (
        <div className="portal-alert portal-alert-success">{state.success}</div>
      )}

      <div>
        <label className="portal-label" htmlFor="public_username">
          Public username
        </label>
        <div className="mt-1 flex items-center gap-1 text-sm text-adab-gray-500">
          <span>adab.ng/l/</span>
          <input
            className="portal-input flex-1"
            id="public_username"
            name="public_username"
            defaultValue={currentUsername ?? ""}
            placeholder="your-name"
            minLength={USERNAME_MIN}
            maxLength={USERNAME_MAX}
            pattern="[a-z0-9]([a-z0-9-]{1,28}[a-z0-9])?"
            autoComplete="off"
            spellCheck={false}
            required
          />
        </div>
        <p className="mt-2 text-xs text-adab-gray-500">
          {USERNAME_MIN}–{USERNAME_MAX} characters. Lowercase letters, numbers,
          and hyphens only.
        </p>
        {cooldownEnds && currentUsername ? (
          <p className="mt-2 text-xs text-amber-700">
            Username changes are limited to once every 30 days. Next change
            available after{" "}
            {cooldownEnds.toLocaleDateString("en-NG", {
              dateStyle: "medium",
            })}
            .
          </p>
        ) : null}
      </div>

      {profileUrl ? (
        <p className="text-sm text-adab-navy-700">
          Your public profile:{" "}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-adab-gold-600 hover:underline"
          >
            {profileUrl.replace(/^https?:\/\//, "")}
          </a>
        </p>
      ) : null}

      <button
        type="submit"
        className="portal-btn portal-btn-primary"
        disabled={pending}
      >
        {pending ? "Saving…" : currentUsername ? "Update username" : "Claim username"}
      </button>
    </form>
  );
}
