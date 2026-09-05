// app/kontakt/page.tsx
import Contact from "@/components/user/pages/contact/Contact";
import { Metadata } from "next";
import { SITE_URL } from "@/utils/site";

export const metadata: Metadata = {
  title: "Kontakt - putujEM s travEM",
  description:
    "Želite surađivati s nama? Kontaktirajte nas putem kontakt forme. Radujemo se Vašoj poruci i budućoj suradnji.",
  keywords: "kontakt, suradnja, putujemstravem, email, poruka",
  alternates: { canonical: `${SITE_URL}/kontakt` },
  openGraph: {
    title: "Kontakt - putujEM s travEM",
    description:
      "Želite surađivati s nama? Kontaktirajte nas putem kontakt forme. Radujemo se Vašoj poruci i budućoj suradnji.",
    type: "website",
    url: `${SITE_URL}/kontakt`,
    images: [
      {
        url: `${SITE_URL}/default-og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Kontakt - putujEM s travEM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontakt - putujEM s travEM",
    description:
      "Želite surađivati s nama? Kontaktirajte nas putem kontakt forme. Radujemo se Vašoj poruci i budućoj suradnji.",
    images: [`${SITE_URL}/default-og-image.jpg`],
  },
};

export default function Page() {
  return <Contact />;
}
