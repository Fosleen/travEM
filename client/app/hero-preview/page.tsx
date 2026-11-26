import type { Metadata } from "next";
import HeroPreview from "./HeroPreview";

export const metadata: Metadata = {
  title: "Pregled naslovne fotografije",
  robots: { index: false, follow: false },
};

export default function HeroPreviewPage() {
  return <HeroPreview />;
}
