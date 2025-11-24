import {
  montserrat,
  archivoBlack,
  sacramento,
  testimonia,
  theBoldFont,
} from "./fonts";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`
        ${montserrat.variable} 
        ${archivoBlack.variable} 
        ${sacramento.variable}
        ${testimonia.variable}
        ${theBoldFont.variable}
      `}
    >
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
