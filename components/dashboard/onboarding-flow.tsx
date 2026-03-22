"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, MoveDown, MoveUp, Sparkles } from "lucide-react";
import { savePropertyAction } from "@/lib/actions/property";
import { onboardingThemes } from "@/lib/data/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ExistingProperty = {
  name?: string;
  propertyType?: string;
  location?: string;
  guestCapacity?: number;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  shortDescription?: string;
  amenities?: { label: string }[];
  checkInTime?: string;
  checkOutTime?: string;
  minimumStay?: number;
  houseRules?: string;
  petPolicy?: string;
  parkingInfo?: string;
  wifiInfo?: string;
  baseNightlyRate?: number;
  cleaningFee?: number;
  extraGuestFee?: number | null;
  petFee?: number | null;
  taxNotes?: string | null;
  hostEmail?: string;
  availabilityBuffer?: number | null;
  cancellationPolicy?: string;
  maxAdvanceBookingWindow?: number | null;
  importSourceUrl?: string | null;
  importMethod?: string;
  themeSettings?: { theme?: string; brandColor?: string | null; logoUrl?: string | null } | null;
  domains?: { subdomain?: string | null; isCustom?: boolean }[];
  photos?: { url: string; altText: string; sortOrder: number; isCover: boolean }[];
} | null;

const steps = [
  "Import",
  "Basics",
  "Details",
  "Pricing",
  "Photos",
  "Style",
  "Domain",
  "Generate",
];

const defaultPhotos = [
  {
    url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    altText: "Exterior view",
    sortOrder: 0,
    isCover: true,
  },
];

export function OnboardingFlow({ property }: { property: ExistingProperty }) {
  const [step, setStep] = useState(0);
  const [importMethod, setImportMethod] = useState(property?.importMethod === "airbnb" ? "url" : "manual");
  const [photos, setPhotos] = useState(
    property?.photos?.length ? property.photos : defaultPhotos,
  );

  const defaultAmenities = useMemo(
    () => property?.amenities?.map((item) => item.label).join(", ") ?? "Wi-Fi, chef's kitchen, dedicated parking",
    [property],
  );

  const defaultSubdomain =
    property?.domains?.find((domain) => !domain.isCustom)?.subdomain ?? "my-stay";

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList?.length) {
      return;
    }

    const uploaded = await Promise.all(
      Array.from(fileList).map(
        (file) =>
          new Promise<{ url: string; altText: string; sortOrder: number; isCover: boolean }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                url: String(reader.result),
                altText: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
                sortOrder: photos.length,
                isCover: photos.length === 0,
              });
            };
            reader.readAsDataURL(file);
          }),
      ),
    );

    setPhotos((current) =>
      [...current, ...uploaded].map((photo, index) => ({ ...photo, sortOrder: index })),
    );
  }

  function shiftPhoto(index: number, direction: "up" | "down") {
    setPhotos((current) => {
      const next = [...current];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) {
        return current;
      }
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next.map((photo, order) => ({ ...photo, sortOrder: order }));
    });
  }

  function setCover(index: number) {
    setPhotos((current) => current.map((photo, order) => ({ ...photo, isCover: order === index })));
  }

  const isFirstStep = step === 0;
  const isLastStep = step === steps.length - 1;

  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="panel p-5 md:p-7">
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-2 text-xs">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                  index <= step ? "border-accent bg-accent text-accent-foreground" : "border-line bg-white text-muted"
                }`}
              >
                {index + 1}
              </span>
              <span className={index === step ? "text-ink" : "text-muted"}>{label}</span>
            </div>
          ))}
        </div>

        <form action={savePropertyAction} className="mt-8 space-y-8">
          <input type="hidden" name="amenities" value={JSON.stringify(defaultAmenities.split(",").map((item) => item.trim()).filter(Boolean))} />
          <input type="hidden" name="photos" value={JSON.stringify(photos)} />

          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl">Start with your listing or build it by hand.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                  Stayro turns structured property details into a branded direct-booking site. Start with a URL if you already list on Airbnb or Vrbo.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setImportMethod("url")}
                  className={`rounded-xl border p-5 text-left ${importMethod === "url" ? "border-accent bg-[#fbf4ec]" : "border-line bg-white"}`}
                >
                  <p className="font-semibold text-ink">Airbnb or Vrbo URL</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Pull your existing listing details into a fast first draft.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => setImportMethod("manual")}
                  className={`rounded-xl border p-5 text-left ${importMethod === "manual" ? "border-accent bg-[#fbf4ec]" : "border-line bg-white"}`}
                >
                  <p className="font-semibold text-ink">Manual setup</p>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    Enter your property details directly and shape the draft yourself.
                  </p>
                </button>
              </div>
              <input type="hidden" name="importMethod" value={importMethod} />
              {importMethod === "url" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Listing URL</label>
                  <Input
                    name="importSourceUrl"
                    defaultValue={property?.importSourceUrl ?? ""}
                    placeholder="https://www.airbnb.com/rooms/..."
                  />
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Property name</label>
                <Input name="name" defaultValue={property?.name ?? ""} placeholder="Oceancrest House" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Property type</label>
                <Input name="propertyType" defaultValue={property?.propertyType ?? ""} placeholder="Coastal villa" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input name="location" defaultValue={property?.location ?? ""} placeholder="Carmel-by-the-Sea, California" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Guest capacity</label>
                <Input name="guestCapacity" type="number" defaultValue={property?.guestCapacity ?? 6} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bedrooms</label>
                <Input name="bedrooms" type="number" defaultValue={property?.bedrooms ?? 3} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Beds</label>
                <Input name="beds" type="number" defaultValue={property?.beds ?? 4} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bathrooms</label>
                <Input name="bathrooms" type="number" step="0.5" defaultValue={property?.bathrooms ?? 2.5} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Short description</label>
                <Textarea name="shortDescription" defaultValue={property?.shortDescription ?? ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Amenities</label>
                <Textarea
                  key={defaultAmenities}
                  defaultValue={defaultAmenities}
                  onChange={(event) => {
                    const hidden = document.querySelector<HTMLInputElement>("input[name='amenities']");
                    if (hidden) {
                      hidden.value = JSON.stringify(
                        event.target.value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      );
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-in time</label>
                <Input name="checkInTime" defaultValue={property?.checkInTime ?? "4:00 PM"} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Check-out time</label>
                <Input name="checkOutTime" defaultValue={property?.checkOutTime ?? "10:00 AM"} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum stay</label>
                <Input name="minimumStay" type="number" defaultValue={property?.minimumStay ?? 2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Host email</label>
                <Input name="hostEmail" type="email" defaultValue={property?.hostEmail ?? ""} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">House rules</label>
                <Textarea name="houseRules" defaultValue={property?.houseRules ?? ""} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pet policy</label>
                <Textarea name="petPolicy" defaultValue={property?.petPolicy ?? "No pets"} className="min-h-24" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Parking info</label>
                <Textarea name="parkingInfo" defaultValue={property?.parkingInfo ?? ""} className="min-h-24" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Wi-Fi availability</label>
                <Input name="wifiInfo" defaultValue={property?.wifiInfo ?? "Fast Wi-Fi throughout the property"} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Base nightly rate</label>
                <Input name="baseNightlyRate" type="number" defaultValue={property?.baseNightlyRate ?? 295} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cleaning fee</label>
                <Input name="cleaningFee" type="number" defaultValue={property?.cleaningFee ?? 120} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Extra guest fee</label>
                <Input name="extraGuestFee" type="number" defaultValue={property?.extraGuestFee ?? 0} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pet fee</label>
                <Input name="petFee" type="number" defaultValue={property?.petFee ?? 0} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Availability buffer (days)</label>
                <Input name="availabilityBuffer" type="number" defaultValue={property?.availabilityBuffer ?? 1} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Max advance booking window</label>
                <Input name="maxAdvanceBookingWindow" type="number" defaultValue={property?.maxAdvanceBookingWindow ?? 365} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Taxes and fees note</label>
                <Textarea name="taxNotes" defaultValue={property?.taxNotes ?? ""} className="min-h-24" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Cancellation policy</label>
                <Textarea name="cancellationPolicy" defaultValue={property?.cancellationPolicy ?? ""} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl">Add the photos that will carry the first impression.</h2>
                  <p className="mt-2 text-sm text-muted">Use direct image URLs, upload files for a quick draft, and choose one cover image.</p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
                  <ImagePlus className="h-4 w-4" />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(event) => void handleFileUpload(event.target.files)}
                  />
                </label>
              </div>

              <div className="grid gap-4">
                {photos.map((photo, index) => (
                  <div key={`${photo.url}-${index}`} className="grid gap-3 rounded-xl border border-line bg-white p-4 md:grid-cols-[1.5fr_2fr_auto]">
                    <Input
                      defaultValue={photo.url}
                      onChange={(event) =>
                        setPhotos((current) =>
                          current.map((item, photoIndex) =>
                            photoIndex === index ? { ...item, url: event.target.value } : item,
                          ),
                        )
                      }
                    />
                    <Input
                      defaultValue={photo.altText}
                      onChange={(event) =>
                        setPhotos((current) =>
                          current.map((item, photoIndex) =>
                            photoIndex === index ? { ...item, altText: event.target.value } : item,
                          ),
                        )
                      }
                    />
                    <div className="flex items-center gap-2">
                      <button type="button" className="rounded-md border border-line p-2" onClick={() => shiftPhoto(index, "up")}>
                        <MoveUp className="h-4 w-4" />
                      </button>
                      <button type="button" className="rounded-md border border-line p-2" onClick={() => shiftPhoto(index, "down")}>
                        <MoveDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className={`rounded-md border px-3 py-2 text-xs font-semibold ${photo.isCover ? "border-accent bg-[#fbf4ec] text-accent" : "border-line text-muted"}`}
                        onClick={() => setCover(index)}
                      >
                        Cover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Theme direction</label>
                <Select name="theme" defaultValue={property?.themeSettings?.theme ?? "Luxury"}>
                  {onboardingThemes.map((theme) => (
                    <option key={theme} value={theme}>
                      {theme}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand color</label>
                <Input name="brandColor" defaultValue={property?.themeSettings?.brandColor ?? "#8f5a2c"} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Logo URL</label>
                <Input name="logoUrl" defaultValue={property?.themeSettings?.logoUrl ?? ""} placeholder="Optional logo image URL" />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stayro subdomain</label>
                <div className="flex items-center rounded-lg border border-line bg-white pl-3">
                  <input
                    name="subdomain"
                    className="h-11 flex-1 border-0 bg-transparent text-sm outline-none"
                    defaultValue={defaultSubdomain}
                  />
                  <span className="pr-3 text-sm text-muted">.stayro.co</span>
                </div>
              </div>
              <div className="rounded-xl border border-line bg-[#fbf4ec] p-5">
                <p className="font-semibold text-ink">Custom domain on Pro</p>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Stayro Pro lets you connect your own domain, remove the footer badge, and publish your site live for guests.
                </p>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-line bg-[#fbf4ec] p-6">
                <div className="flex items-center gap-3 text-accent">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold">Stayro will generate</span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-muted md:grid-cols-2">
                  <p>Homepage hero headline and intro</p>
                  <p>Stay description and amenities copy</p>
                  <p>Neighborhood highlights and FAQs</p>
                  <p>SEO title, meta description, and CTA copy</p>
                </div>
              </div>
              <div className="rounded-xl border border-line bg-white p-6">
                <p className="text-sm text-muted">
                  When you generate the site, Stayro will save your property, create a polished first draft, and open your dashboard so you can preview and publish.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-line pt-6">
            <Button
              type="button"
              variant="ghost"
              className="gap-2"
              disabled={isFirstStep}
              onClick={() => setStep((current) => Math.max(0, current - 1))}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {isLastStep ? (
              <Button type="submit">Generate and save site</Button>
            ) : (
              <Button type="button" className="gap-2" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
      </div>

      <aside className="space-y-5">
        <div className="panel overflow-hidden">
          <div className="aspect-[4/5] bg-[#e7d8c5]">
            <img
              src={photos.find((photo) => photo.isCover)?.url ?? photos[0]?.url}
              alt="Property cover preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="space-y-3 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted">Preview direction</p>
            <h3 className="text-2xl">{property?.name ?? "Your property preview"}</h3>
            <p className="text-sm leading-6 text-muted">
              Large imagery, a clear booking path, and editable AI-generated copy tuned for a premium hospitality feel.
            </p>
          </div>
        </div>
        <div className="panel p-5">
          <p className="font-semibold text-ink">MVP guardrails</p>
          <ul className="mt-3 space-y-3 text-sm leading-6 text-muted">
            <li>Request-to-book only in v1</li>
            <li>1 property on Free and Pro</li>
            <li>Custom domain reserved for Pro</li>
            <li>Section-based editing, not drag-and-drop</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
