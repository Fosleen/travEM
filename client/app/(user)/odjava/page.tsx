import { Metadata } from "next";
import Unsubscribe from "@/components/user/pages/unsubscribe/Unsubscribe";

export const metadata: Metadata = {
  title: "Odjava s newslettera - putujEM s travEM",
  description: "Odjava s mailing liste. Više nećete primati naš newsletter.",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-static";

export default function Page() {
  return <Unsubscribe />;
}
