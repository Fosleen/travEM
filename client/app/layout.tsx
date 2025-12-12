import {
  montserrat,
  archivoBlack,
  sacramento,
  testimonia,
  theBoldFont,
} from "./fonts";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import GoogleAnalytics from "@/components/atoms/GoogleAnalytics/GoogleAnalytics";

export const metadata = {
  verification: {
    google: "PHVKpg8LweUjIPPjYVVs6RRymMs9DmxBN4q99VM_L2k",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="hr"
      className={`
        ${montserrat.variable} 
        ${archivoBlack.variable} 
        ${sacramento.variable}
        ${testimonia.variable}
        ${theBoldFont.variable}
      `}
    >
      <body className={montserrat.className}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
