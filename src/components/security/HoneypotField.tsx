import { HONEYPOT_FIELD_NAME } from "@/lib/security/honeypot";

export function HoneypotField() {
  return (
    <div
      className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
      aria-hidden
    >
      <label htmlFor={HONEYPOT_FIELD_NAME}>Website</label>
      <input
        id={HONEYPOT_FIELD_NAME}
        name={HONEYPOT_FIELD_NAME}
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}
