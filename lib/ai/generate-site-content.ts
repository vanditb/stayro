import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import type { PropertyInput } from "@/lib/validators/property";

const outputSchema = z.object({
  heroHeadline: z.string(),
  heroIntro: z.string(),
  stayDescription: z.string(),
  amenitiesCopy: z.string(),
  neighborhoodHighlights: z.string(),
  faqIntro: z.string(),
  houseRulesSummary: z.string(),
  seoTitle: z.string(),
  metaDescription: z.string(),
  ctaCopy: z.string(),
  sectionHeadings: z.object({
    details: z.string(),
    gallery: z.string(),
    location: z.string(),
    reviews: z.string(),
  }),
  testimonialPlaceholders: z.object({
    lead: z.string(),
  }),
});

export type GeneratedContentDraft = z.infer<typeof outputSchema>;

function buildFallback(data: PropertyInput): GeneratedContentDraft {
  return {
    heroHeadline: `Stay close to ${data.location.split(",")[0]} in a ${data.theme.toLowerCase()} home built for easy arrivals.`,
    heroIntro: `${data.name} gives guests a polished direct-booking experience with clear details, warm hospitality, and fast request handling.`,
    stayDescription: `${data.shortDescription} Guests can expect ${data.bedrooms} bedrooms, room for ${data.guestCapacity}, and the kind of thoughtful setup that makes a short stay feel settled from the first night.`,
    amenitiesCopy: `Guests will have quick answers before they ask, with clear callouts for ${data.amenities.slice(0, 3).join(", ")} and the everyday essentials already covered.`,
    neighborhoodHighlights: `Use the site to highlight what makes ${data.location} easy to choose: arrival simplicity, local favorites, and the pace of the surrounding area.`,
    faqIntro: "Common guest questions, already answered clearly.",
    houseRulesSummary: data.houseRules,
    seoTitle: `${data.name} | Direct Booking with Stayro`,
    metaDescription: `Book ${data.name} direct. View amenities, policies, availability, and request your stay online.`,
    ctaCopy: "Check availability",
    sectionHeadings: {
      details: "Everything guests need before they request",
      gallery: "A closer look at the stay",
      location: "Local notes",
      reviews: "Guest highlights",
    },
    testimonialPlaceholders: {
      lead: "Guests typically call out the design, the arrival experience, and how easy the stay felt from booking to checkout.",
    },
  };
}

export async function generateSiteContent(
  data: PropertyInput,
): Promise<GeneratedContentDraft> {
  if (!process.env.OPENAI_API_KEY) {
    return buildFallback(data);
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.responses.parse({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You write premium but restrained short-term rental site copy. Return concise, conversion-friendly JSON only.",
      },
      {
        role: "user",
        content: JSON.stringify(data),
      },
    ],
    text: {
      format: zodResponseFormat(outputSchema, "stayro_generated_content") as never,
    },
  });

  const parsed = outputSchema.safeParse(response.output_parsed);
  return parsed.success ? parsed.data : buildFallback(data);
}
