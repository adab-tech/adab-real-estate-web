type SupabaseLikeError = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

const SCHEMA_HINT =
  "Ask your admin to run supabase/fix-all.sql in the Supabase SQL Editor.";

export function formatSupabaseError(
  err: unknown,
  fallback = "Something went wrong.",
): string {
  if (!err || typeof err !== "object") {
    return err instanceof Error ? err.message : fallback;
  }

  const error = err as SupabaseLikeError;
  const message = error.message?.trim();
  if (!message) {
    return err instanceof Error ? err.message : fallback;
  }

  if (
    error.code === "23502" &&
    message.includes('column "id"')
  ) {
    return [
      "We could not save your listing because listing IDs are not configured in the database.",
      "Ask your admin to run supabase/fix-properties-id.sql in the Supabase SQL Editor.",
    ].join(" ");
  }

  const parts =
    error.code === "23502"
      ? ["A required field is missing. Check all fields and try again."]
      : [message];

  if (error.code === "23514") {
    parts.push(
      "The listing status or type is not allowed by the database.",
      SCHEMA_HINT,
    );
  } else if (error.code === "23503") {
    parts.push(
      "Your lister profile is missing or invalid.",
      "Try signing out and back in, or contact support.",
    );
  } else if (error.code === "42501") {
    parts.push(
      "You do not have permission to save this listing.",
      SCHEMA_HINT,
    );
  } else if (error.code === "23505") {
    parts.push(
      "A listing with a similar title already exists. Change the title and try again.",
    );
  } else if (
    message.includes("Bucket not found") ||
    message.includes("property-images")
  ) {
    parts.push(
      "Image storage is not configured.",
      "Ask your admin to run supabase/fix-all.sql to create the property-images bucket.",
    );
  } else if (
    message.includes("new row violates row-level security") ||
    message.includes("permission denied")
  ) {
    parts.push(
      "Your account may not have lister permissions.",
      SCHEMA_HINT,
    );
  } else if (error.code !== "23502" && error.details) {
    parts.push(error.details);
  }

  if (error.hint && !parts.includes(error.hint)) {
    parts.push(error.hint);
  }

  return parts.join(" ");
}
