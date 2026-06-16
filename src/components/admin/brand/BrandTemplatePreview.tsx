"use client";

import Image from "next/image";
import type { BrandTemplateData, BrandTemplateType } from "@/lib/brand/types";
import { BRAND_COLORS } from "@/lib/brand/templates";

type BrandTemplatePreviewProps = {
  templateType: BrandTemplateType;
  data: BrandTemplateData;
  width: number;
  height: number;
  exportRef?: React.RefObject<HTMLDivElement | null>;
};

function Logo({ height = 56 }: { height?: number }) {
  return (
    <Image
      src="/brand/logo.png"
      alt="Adab Real Estate Agency"
      width={Math.round(height * 3.2)}
      height={height}
      className="object-contain brightness-0 invert"
      unoptimized
    />
  );
}

function HeroPhoto({ url, rounded = true }: { url: string; rounded?: boolean }) {
  return (
    <div
      className={`relative min-h-0 flex-1 overflow-hidden bg-[#F8F6F1] ${rounded ? "mx-14 rounded-2xl" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        className="h-full w-full object-cover"
        crossOrigin="anonymous"
      />
    </div>
  );
}

function SocialPostPreview({
  data,
  vertical,
}: {
  data: BrandTemplateData;
  vertical: boolean;
}) {
  return (
    <div
      className="grid h-full overflow-hidden"
      style={{
        background: BRAND_COLORS.navy,
        gridTemplateRows: "auto 1fr auto",
      }}
    >
      <header className="flex items-center justify-between px-14 pb-8 pt-12">
        <Logo />
        <span
          className="rounded-full px-7 py-3 text-[22px] font-extrabold uppercase tracking-wider"
          style={{ background: BRAND_COLORS.gold, color: BRAND_COLORS.navy }}
        >
          {data.badge}
        </span>
      </header>

      <HeroPhoto url={data.photoUrl} />

      <footer
        className="relative z-10 px-14 pb-14 pt-10"
        style={{
          marginTop: vertical ? -140 : -120,
          background:
            "linear-gradient(transparent, rgba(15, 26, 46, 0.88))",
        }}
      >
        <p
          className="mb-2 text-[52px] font-extrabold leading-none"
          style={{ color: BRAND_COLORS.gold }}
        >
          {data.price}
        </p>
        <h1
          className="mb-3 text-[38px] font-bold leading-tight"
          style={{ color: BRAND_COLORS.cream }}
        >
          {data.title}
        </h1>
        <p
          className="text-[26px]"
          style={{ color: "rgba(248, 246, 241, 0.85)" }}
        >
          {data.subtitle || data.location}
        </p>
        <span
          className="mt-7 inline-block rounded-full px-9 py-4 text-2xl font-bold"
          style={{ background: BRAND_COLORS.gold, color: BRAND_COLORS.navy }}
        >
          {data.ctaLabel}
        </span>
      </footer>

      <p
        className="px-14 pb-8 text-center text-lg"
        style={{ color: "rgba(248, 246, 241, 0.5)" }}
      >
        Adab Real Estate Agency · CAC RC 9590252
      </p>
    </div>
  );
}

function LinkedInCoverPreview({ data }: { data: BrandTemplateData }) {
  return (
    <div
      className="flex h-full items-center justify-between px-20"
      style={{
        background: `linear-gradient(135deg, ${BRAND_COLORS.navy} 0%, ${BRAND_COLORS.navyDark} 100%)`,
        color: BRAND_COLORS.cream,
      }}
    >
      <div>
        <h1 className="max-w-4xl text-5xl font-extrabold">{data.title}</h1>
        <p className="mt-3 text-2xl" style={{ color: BRAND_COLORS.gold }}>
          {data.subtitle}
        </p>
      </div>
      <Logo height={72} />
    </div>
  );
}

function BusinessCardPreview({ data }: { data: BrandTemplateData }) {
  return (
    <div className="flex h-full items-center justify-center bg-[#e8e6e1] p-8">
      <div
        className="flex h-[55mm] w-[85mm] flex-col justify-between rounded-md p-6 shadow-lg"
        style={{ background: BRAND_COLORS.cream }}
      >
        <Logo height={32} />
        <div>
          <p className="text-lg font-bold" style={{ color: BRAND_COLORS.navy }}>
            {data.agentName}
          </p>
          <p className="text-xs font-semibold" style={{ color: BRAND_COLORS.gold }}>
            {data.agentTitle}
          </p>
          <p className="mt-2 text-[10px] leading-relaxed text-gray-600">
            {data.agentPhone}
            <br />
            {data.agentEmail}
            <br />
            adab.ng
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailSignaturePreview({ data }: { data: BrandTemplateData }) {
  return (
    <div className="flex h-full items-center bg-white p-8">
      <div className="flex gap-4">
        <Logo height={48} />
        <div className="text-sm" style={{ color: BRAND_COLORS.navy }}>
          <p className="font-bold">{data.agentName}</p>
          <p className="text-xs font-semibold" style={{ color: BRAND_COLORS.gold }}>
            {data.agentTitle}
          </p>
          <p className="mt-1 text-xs text-gray-600">
            {data.agentPhone} · {data.agentEmail}
            <br />
            <a href={data.ctaLink}>{data.ctaLink.replace(/^https?:\/\//, "")}</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function LetterheadPreview({ data }: { data: BrandTemplateData }) {
  return (
    <div className="flex h-full flex-col bg-white">
      <header
        className="flex items-center justify-between px-12 py-10"
        style={{ background: BRAND_COLORS.navy }}
      >
        <Logo />
        <div className="text-right text-sm text-white/80">
          <p>{data.agentPhone}</p>
          <p>{data.agentEmail}</p>
          <p>adab.ng</p>
        </div>
      </header>
      <div className="flex-1 px-12 py-10 text-sm text-gray-700">
        <p className="mb-6 text-gray-500">{new Date().toLocaleDateString("en-NG")}</p>
        <p className="whitespace-pre-wrap leading-relaxed">{data.description}</p>
        <p className="mt-8 font-semibold" style={{ color: BRAND_COLORS.navy }}>
          {data.agentName}
        </p>
        <p className="text-xs text-gray-500">{data.agentTitle}</p>
      </div>
      <footer
        className="border-t-4 px-12 py-4 text-center text-xs text-gray-500"
        style={{ borderColor: BRAND_COLORS.gold }}
      >
        Adab Real Estate Agency · CAC Reg. No. RC 9590252
      </footer>
    </div>
  );
}

function FlyerPreview({
  data,
  compact,
}: {
  data: BrandTemplateData;
  compact?: boolean;
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      <header
        className="flex items-center justify-between px-10 py-8"
        style={{ background: BRAND_COLORS.navy }}
      >
        <Logo height={compact ? 32 : 40} />
        <span
          className="rounded-full px-4 py-1 text-xs font-bold uppercase tracking-wide"
          style={{ background: BRAND_COLORS.gold, color: BRAND_COLORS.navy }}
        >
          {data.badge}
        </span>
      </header>
      <div className="relative h-48 overflow-hidden bg-[#F8F6F1]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.photoUrl} alt="" className="h-full w-full object-cover" />
      </div>
      <div className={`flex-1 ${compact ? "p-6" : "p-10"}`}>
        <p
          className={`font-extrabold ${compact ? "text-xl" : "text-2xl"}`}
          style={{ color: BRAND_COLORS.gold }}
        >
          {data.price}
        </p>
        <h1
          className={`mt-1 font-bold leading-snug ${compact ? "text-base" : "text-xl"}`}
          style={{ color: BRAND_COLORS.navy }}
        >
          {data.title}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{data.location}</p>
        {!compact && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            {[
              { label: "Beds", value: data.bedrooms },
              { label: "Baths", value: data.bathrooms },
              { label: "sqm", value: data.sqm },
            ].map((f) => (
              <div key={f.label} className="rounded bg-[#F8F6F1] p-2">
                <strong className="block text-base">{f.value}</strong>
                {f.label}
              </div>
            ))}
          </div>
        )}
        <p className={`text-gray-600 ${compact ? "mt-3 text-xs" : "mt-4 text-sm"} line-clamp-4`}>
          {data.description}
        </p>
      </div>
      <footer
        className="grid grid-cols-2 gap-4 border-t-4 px-8 py-6 text-xs"
        style={{ borderColor: BRAND_COLORS.gold, background: BRAND_COLORS.cream }}
      >
        <div>
          <p className="font-bold">{data.agentName}</p>
          <p className="text-[10px] font-semibold" style={{ color: BRAND_COLORS.gold }}>
            {data.agentTitle}
          </p>
          <p className="mt-1 text-gray-600">{data.agentPhone}</p>
          <p className="text-gray-600">{data.agentEmail}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold" style={{ color: BRAND_COLORS.navy }}>
            WhatsApp
          </p>
          <p className="text-gray-600">{data.ctaLabel}</p>
        </div>
      </footer>
    </div>
  );
}

export function BrandTemplatePreview({
  templateType,
  data,
  width,
  height,
  exportRef,
}: BrandTemplatePreviewProps) {
  let content: React.ReactNode;

  switch (templateType) {
    case "instagram-story":
    case "whatsapp-status":
      content = <SocialPostPreview data={data} vertical />;
      break;
    case "linkedin-cover":
      content = <LinkedInCoverPreview data={data} />;
      break;
    case "business-card":
      content = <BusinessCardPreview data={data} />;
      break;
    case "email-signature":
      content = <EmailSignaturePreview data={data} />;
      break;
    case "letterhead":
      content = <LetterheadPreview data={data} />;
      break;
    case "flyer-a5":
      content = <FlyerPreview data={data} compact />;
      break;
    case "property-flyer":
      content = <FlyerPreview data={data} />;
      break;
    case "linkedin-post":
    case "instagram-post":
    case "property-promo":
    default:
      content = <SocialPostPreview data={data} vertical={false} />;
      break;
  }

  return (
    <div
      ref={exportRef}
      className="origin-top-left overflow-hidden shadow-xl"
      style={{ width, height }}
    >
      {content}
    </div>
  );
}
