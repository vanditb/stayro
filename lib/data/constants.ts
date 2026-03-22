export const planDetails = {
  FREE: {
    name: "Free",
    price: "$0",
    description: "Launch a draft direct-booking site on a Stayro subdomain.",
    features: [
      "1 property",
      "Generated site draft",
      "Stayro subdomain only",
      "Basic editor",
      "Booking request form",
      "Email notifications",
      "Stayro branding badge",
      "Limited analytics",
    ],
  },
  PRO: {
    name: "Pro",
    price: "$29/mo",
    description: "Publish a polished site and run direct booking requests with more control.",
    features: [
      "1 live property site",
      "Subdomain or custom domain",
      "Full site editing",
      "Booking inbox",
      "iCal import",
      "Approval workflow",
      "Auto-block dates",
      "SEO settings",
    ],
  },
} as const;

export const onboardingThemes = [
  "Modern",
  "Cozy",
  "Luxury",
  "Beach",
  "Cabin",
  "Urban",
] as const;
