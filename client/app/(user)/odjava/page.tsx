import Unsubscribe from "@/components/user/pages/unsubscribe/Unsubscribe";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Odjava s newslettera - putujEM s travEM",
  description: "Odjava s mailing liste. Više nećete primati naš newsletter.",
  robots: {
    index: false,
    follow: false,
  },
};

type Props = {
  searchParams: Promise<{ userToken?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const userToken = params.userToken || null;

  return <Unsubscribe userToken={userToken} />;
}
