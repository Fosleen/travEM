export const AIRPORT_HERO_IMAGES: Record<string, string> = {
  Zagreb: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Zagreb%20Airport.jpg?updatedAt=1777029689876",
  Split: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Split%20Airport.jpg?updatedAt=1777029690103",
  Dubrovnik: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Dubrovnik%20Airport.jpg?updatedAt=1777029690416",
  Zadar: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Zadar%20Airport.jpg?updatedAt=1777029689938",
  Pula: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Pula%20Airport.jpg?updatedAt=1777029690253",
  Rijeka: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Rijeka%20Airport.jpg?updatedAt=1777029690715",
  Osijek: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Osijek%20Airport.jpg?updatedAt=1777029689934",
  Beograd: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Beograd%20Airport.jpg?updatedAt=1777029689995",
  Sarajevo: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Sarajevo%20Airport.jpg?updatedAt=1777029690351",
  Trst: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Trst%20Airport.jpg?updatedAt=1777029690065",
  Beč: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Bec%20Airport.jpg?updatedAt=1777029690240",
  Budimpešta: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Budapest%20Airport.jpg?updatedAt=1777029690232",
  Venecija: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Venecija%20Airport.jpg?updatedAt=1777029690022",
  Tuzla: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Tuzla%20Airport.jpg?updatedAt=1777029690426",
  "Banja Luka": "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Banja%20Luka%20Airport.jpg?updatedAt=1777029689385",
  Ljubljana: "https://ik.imagekit.io/travEM/Aviokarte%20redizajn/Ljubljana%20Airport.jpg",
};

export const DEFAULT_AIRPORT_HERO_IMAGE =
  AIRPORT_HERO_IMAGES.Zagreb ||
  "https://divovzeyblkexoqlwiqy.supabase.co/storage/v1/object/public/Aviokarte%20redizajn/Zagreb%20Airport.jpg";

export const getAirportHeroImage = (name: string) =>
  AIRPORT_HERO_IMAGES[name] ?? DEFAULT_AIRPORT_HERO_IMAGE;
