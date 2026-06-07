import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .min(10, "Enter a valid Nigerian phone number")
    .max(20),
  email: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.string().email("Enter a valid email").optional(),
  ),
  message: z.string().min(10, "Message must be at least 10 characters"),
  propertyId: z.string().optional(),
  propertySlug: z.string().optional(),
  source: z.enum(["contact", "property_detail"]).default("contact"),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
