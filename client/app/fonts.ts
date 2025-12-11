import { Montserrat, Archivo_Black, Sacramento } from "next/font/google";
import localFont from "next/font/local";

export const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-montserrat",
});

export const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-archivo-black",
});

export const sacramento = Sacramento({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-sacramento",
});

export const testimonia = localFont({
  src: "../public/fonts/Testimonia.ttf",
  variable: "--font-testimonia",
});

export const theBoldFont = localFont({
  src: "../public/fonts/TheBoldFont.ttf",
  variable: "--font-bold",
});
