import type { Metadata } from "next";
import Image from "next/image";
import SocialMediaLinks from "@/components/user/atoms/SocialMediaLinks";
import "./maintenance.scss";

export const metadata: Metadata = {
  title: "Planirano održavanje | putujEM s travEM",
  description: "Unapređujemo putujEM s travEM. Uskoro ponovno putujemo zajedno!",
};

export default function MaintenancePage() {
  return (
    <main className="maintenance-page" data-site-mode="maintenance">
      <section className="maintenance-page__content" aria-labelledby="maintenance-title">
        <h1 id="maintenance-title">
          <span>Unapređujemo</span>
          <Image
            src="/images/travem-logo-hero.webp"
            alt="putujEM s travEM"
            width={640}
            height={200}
            priority
          />
        </h1>
        <p className="maintenance-page__message">
          U tijeku je planirano održavanje pa je stranica privremeno nedostupna.
          Hvala na strpljenju. Uskoro ponovno putujemo zajedno!
        </p>
        <div className="maintenance-page__socials">
          <p>Za to vrijeme možete baciti oko i na naše druge društvene mreže.</p>
          <SocialMediaLinks />
        </div>
      </section>
    </main>
  );
}
