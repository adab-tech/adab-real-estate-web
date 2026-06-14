# Adab Real Estate — Phase 1 AI Roadmap

## Shipped (Phase 1)

| Feature | Route / UI | Auth | Description |
|---------|-----------|------|-------------|
| Listing description | `POST /api/ai/listing-description` | Portal session | Generates professional property copy from listing fields |
| NL property search | `POST /api/ai/property-search` | Public (rate-limited) | Converts plain-English queries to filter params on `/properties` |
| Inquiry triage + draft reply | `POST /api/ai/inquiry-triage` | Admin session | Priority, category, summary, suggested action, draft WhatsApp reply |
| Application summary | `POST /api/ai/application-summary` | Admin session | Strengths, concerns, recommended status, review notes |

**Stack:** Vercel AI SDK (`ai`) + `@ai-sdk/google` (Gemini 2.0 Flash)  
**Env:** `GOOGLE_GENERATIVE_AI_API_KEY`  
**Rate limits:** Upstash Redis when configured (`UPSTASH_REDIS_REST_*`)

## UI integration points

- **Portal listing form** (`ListingForm`) — "Generate with AI" on description field
- **Properties page** — natural-language search bar above filter form
- **Admin inquiries** — per-inquiry "AI triage & draft reply" panel
- **Admin PM applications** — per-row "AI summary" with recommended status

## Phase 2 (planned)

- [ ] Auto-tag inquiries on insert (priority/category stored in Supabase)
- [ ] Semantic property search (embeddings + Vectorize or pgvector)
- [ ] AI-assisted admin listing approval notes
- [ ] Tenant chatbot grounded on FAQ + property catalog
- [ ] Multilingual search (Hausa, Yoruba, Igbo query support)

## Phase 3 (planned)

- [ ] Automated lead scoring and CRM-style pipeline
- [ ] Document OCR for rental KYC (ID, payslip)
- [ ] Price suggestion model from comparable listings
- [ ] Admin digest emails with AI weekly summary

## Operational notes

- AI routes fail gracefully when `GOOGLE_GENERATIVE_AI_API_KEY` is unset (500 with clear message)
- Turnstile and Upstash are optional — features degrade gracefully without them
- No Zoho CRM — leads stay in Supabase `inquiries` and `pm_applications`
- Production deploy: Vercel project under `adab-techs-projects` scope
