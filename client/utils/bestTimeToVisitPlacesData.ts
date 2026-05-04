// utils/bestTimeToVisitPlacesData.ts

export type MonthKey =
  | "jan"
  | "feb"
  | "mar"
  | "apr"
  | "may"
  | "jun"
  | "jul"
  | "aug"
  | "sep"
  | "oct"
  | "nov"
  | "dec";

export type WeatherIconKey =
  | "sunny"
  | "partly_cloudy"
  | "cloudy"
  | "rain"
  | "showers"
  | "snow"
  | "wind"
  | "fog";

export type PlaceMonth = {
  month: MonthKey;
  tempC: number;
  rainMm: number;
  icon?: WeatherIconKey;
};

export type PlaceClimate = {
  // slug treba matchati URL segment (placeName) koji šalješ u komponentu
  slug: string; // npr. "budimpešta", "pariz", "istanbul"
  subtitle?: string;
  note?: string;
  months: PlaceMonth[];
};

export const BEST_TIME_PLACES_DATA: PlaceClimate[] = [
  {
    slug: "budimpešta",
    subtitle: "Prosjeci temperature i oborine po mjesecima",
    note: "Najugodnije vrijeme za posjet: proljeće i jesen",
    months: [
      { month: "jan", tempC: 0.6, rainMm: 40 },
      { month: "feb", tempC: 1.0, rainMm: 38 },
      { month: "mar", tempC: 5.7, rainMm: 44 },
      { month: "apr", tempC: 11.7, rainMm: 50 },
      { month: "may", tempC: 16.4, rainMm: 70 },
      { month: "jun", tempC: 20.2, rainMm: 72 },
      { month: "jul", tempC: 22.1, rainMm: 71 },
      { month: "aug", tempC: 21.7, rainMm: 59 },
      { month: "sep", tempC: 16.7, rainMm: 60 },
      { month: "oct", tempC: 11.3, rainMm: 54 },
      { month: "nov", tempC: 6.0, rainMm: 55 },
      { month: "dec", tempC: 0.6, rainMm: 48 },
    ],
  },

  {
    slug: "istanbul",
    subtitle: "Topla ljeta i blage zime",
    note: "Proljeće i jesen su posebno ugodni za gradsku šetnju",
    months: [
      { month: "jan", tempC: 8, rainMm: 120 },
      { month: "feb", tempC: 8, rainMm: 110 },
      { month: "mar", tempC: 10, rainMm: 100 },
      { month: "apr", tempC: 14, rainMm: 80 },
      { month: "may", tempC: 18, rainMm: 60 },
      { month: "jun", tempC: 22, rainMm: 30 },
      { month: "jul", tempC: 25, rainMm: 20 },
      { month: "aug", tempC: 25, rainMm: 25 },
      { month: "sep", tempC: 21, rainMm: 40 },
      { month: "oct", tempC: 17, rainMm: 70 },
      { month: "nov", tempC: 13, rainMm: 90 },
      { month: "dec", tempC: 10, rainMm: 110 },
    ],
  },

  {
    slug: "london",
    subtitle: "Umjereno ljeto i blage zime",
    note: "Ljeto je najugodnije za razgledavanje",
    months: [
      { month: "jan", tempC: 7, rainMm: 55 },
      { month: "feb", tempC: 7, rainMm: 45 },
      { month: "mar", tempC: 9, rainMm: 50 },
      { month: "apr", tempC: 11, rainMm: 45 },
      { month: "may", tempC: 14, rainMm: 55 },
      { month: "jun", tempC: 17, rainMm: 50 },
      { month: "jul", tempC: 19, rainMm: 45 },
      { month: "aug", tempC: 19, rainMm: 50 },
      { month: "sep", tempC: 17, rainMm: 55 },
      { month: "oct", tempC: 13, rainMm: 60 },
      { month: "nov", tempC: 10, rainMm: 65 },
      { month: "dec", tempC: 8, rainMm: 70 },
    ],
  },

  {
    slug: "pariz",
    subtitle: "Klasika umjerene europske klime",
    note: "Proljeće i ljeto najugodniji za razgledavanje",
    months: [
      { month: "jan", tempC: 5, rainMm: 55 },
      { month: "feb", tempC: 6, rainMm: 45 },
      { month: "mar", tempC: 9, rainMm: 50 },
      { month: "apr", tempC: 11, rainMm: 55 },
      { month: "may", tempC: 15, rainMm: 55 },
      { month: "jun", tempC: 18, rainMm: 55 },
      { month: "jul", tempC: 20, rainMm: 50 },
      { month: "aug", tempC: 20, rainMm: 55 },
      { month: "sep", tempC: 17, rainMm: 60 },
      { month: "oct", tempC: 13, rainMm: 65 },
      { month: "nov", tempC: 8, rainMm: 60 },
      { month: "dec", tempC: 6, rainMm: 60 },
    ],
  },

  {
    slug: "sarajevo",
    subtitle: "Umjerene do hladne zime i toplog ljeta",
    note: "Ljeto je najugodnije za posjet",
    months: [
      { month: "jan", tempC: -1, rainMm: 75 },
      { month: "feb", tempC: 0, rainMm: 70 },
      { month: "mar", tempC: 5, rainMm: 85 },
      { month: "apr", tempC: 10, rainMm: 85 },
      { month: "may", tempC: 14, rainMm: 90 },
      { month: "jun", tempC: 18, rainMm: 95 },
      { month: "jul", tempC: 20, rainMm: 90 },
      { month: "aug", tempC: 20, rainMm: 85 },
      { month: "sep", tempC: 16, rainMm: 85 },
      { month: "oct", tempC: 10, rainMm: 90 },
      { month: "nov", tempC: 5, rainMm: 85 },
      { month: "dec", tempC: 0, rainMm: 80 },
    ],
  },

  {
    slug: "varazdin",
    subtitle: "Umjereno toplo ljeto i hladne zime",
    note: "Proljeće i jesen su vrlo ugodni mjeseci",
    months: [
      { month: "jan", tempC: 1, rainMm: 60 },
      { month: "feb", tempC: 3, rainMm: 55 },
      { month: "mar", tempC: 7, rainMm: 60 },
      { month: "apr", tempC: 12, rainMm: 65 },
      { month: "may", tempC: 16, rainMm: 75 },
      { month: "jun", tempC: 19, rainMm: 80 },
      { month: "jul", tempC: 21, rainMm: 75 },
      { month: "aug", tempC: 21, rainMm: 70 },
      { month: "sep", tempC: 17, rainMm: 75 },
      { month: "oct", tempC: 12, rainMm: 70 },
      { month: "nov", tempC: 7, rainMm: 65 },
      { month: "dec", tempC: 2, rainMm: 60 },
    ],
  },

  {
    slug: "rim",
    subtitle: "Mediteranska klima s vrućim ljetima i blagim zimama",
    note: "Travanj–lipanj i rujan–listopad idealni su za razgledavanje bez ekstremnih vrućina.",
    months: [
      { month: "jan", tempC: 8, rainMm: 70 },
      { month: "feb", tempC: 9, rainMm: 65 },
      { month: "mar", tempC: 11, rainMm: 60 },
      { month: "apr", tempC: 14, rainMm: 65 },
      { month: "may", tempC: 18, rainMm: 55 },
      { month: "jun", tempC: 22, rainMm: 35 },
      { month: "jul", tempC: 25, rainMm: 20 },
      { month: "aug", tempC: 25, rainMm: 30 },
      { month: "sep", tempC: 21, rainMm: 65 },
      { month: "oct", tempC: 17, rainMm: 90 },
      { month: "nov", tempC: 12, rainMm: 110 },
      { month: "dec", tempC: 9, rainMm: 80 },
    ],
  },

  {
    slug: "ljubljana",
    subtitle: "Umjerena kontinentalna klima s više kiše u proljeće i jesen",
    note: "Svibanj, lipanj i rujan nude najbolji balans ugodne temperature i manjih gužvi.",
    months: [
      { month: "jan", tempC: 1, rainMm: 70 },
      { month: "feb", tempC: 3, rainMm: 65 },
      { month: "mar", tempC: 8, rainMm: 80 },
      { month: "apr", tempC: 13, rainMm: 105 },
      { month: "may", tempC: 17, rainMm: 120 },
      { month: "jun", tempC: 20, rainMm: 140 },
      { month: "jul", tempC: 22, rainMm: 115 },
      { month: "aug", tempC: 22, rainMm: 120 },
      { month: "sep", tempC: 17, rainMm: 140 },
      { month: "oct", tempC: 12, rainMm: 135 },
      { month: "nov", tempC: 7, rainMm: 120 },
      { month: "dec", tempC: 2, rainMm: 95 },
    ],
  },

  {
    slug: "prag",
    subtitle: "Umjerena klima s toplim ljetima i hladnim zimama",
    note: "Proljeće i rana jesen idealni su za istraživanje grada.",
    months: [
      { month: "jan", tempC: 1, rainMm: 25 },
      { month: "feb", tempC: 2, rainMm: 30 },
      { month: "mar", tempC: 6, rainMm: 35 },
      { month: "apr", tempC: 10, rainMm: 40 },
      { month: "may", tempC: 15, rainMm: 70 },
      { month: "jun", tempC: 18, rainMm: 75 },
      { month: "jul", tempC: 20, rainMm: 85 },
      { month: "aug", tempC: 20, rainMm: 70 },
      { month: "sep", tempC: 16, rainMm: 40 },
      { month: "oct", tempC: 11, rainMm: 35 },
      { month: "nov", tempC: 6, rainMm: 30 },
      { month: "dec", tempC: 2, rainMm: 25 },
    ],
  },

  {
    slug: "venecija",
    subtitle: "Blaga zima i topla, sparna ljeta uz more",
    note: "Travanj–lipanj i rujan idealni su za šetnje kanalima i manje gužve.",
    months: [
      { month: "jan", tempC: 4, rainMm: 38 },
      { month: "feb", tempC: 5, rainMm: 43 },
      { month: "mar", tempC: 8, rainMm: 48 },
      { month: "apr", tempC: 12, rainMm: 58 },
      { month: "may", tempC: 17, rainMm: 64 },
      { month: "jun", tempC: 21, rainMm: 64 },
      { month: "jul", tempC: 24, rainMm: 48 },
      { month: "aug", tempC: 24, rainMm: 53 },
      { month: "sep", tempC: 20, rainMm: 71 },
      { month: "oct", tempC: 15, rainMm: 74 },
      { month: "nov", tempC: 9, rainMm: 71 },
      { month: "dec", tempC: 5, rainMm: 53 },
    ],
  },

  {
    slug: "firenca",
    subtitle: "Topla ljeta i blage zime u srcu Toskane",
    note: "Svibanj, lipanj i rujan najbolji su za razgledavanje bez ekstremnih vrućina.",
    months: [
      { month: "jan", tempC: 6, rainMm: 41 },
      { month: "feb", tempC: 7, rainMm: 43 },
      { month: "mar", tempC: 10, rainMm: 43 },
      { month: "apr", tempC: 13, rainMm: 51 },
      { month: "may", tempC: 17, rainMm: 46 },
      { month: "jun", tempC: 22, rainMm: 38 },
      { month: "jul", tempC: 26, rainMm: 25 },
      { month: "aug", tempC: 26, rainMm: 33 },
      { month: "sep", tempC: 21, rainMm: 61 },
      { month: "oct", tempC: 16, rainMm: 79 },
      { month: "nov", tempC: 10, rainMm: 81 },
      { month: "dec", tempC: 6, rainMm: 53 },
    ],
  },

  {
    slug: "milan",
    subtitle: "Topla ljeta i hladnije, maglovite zime",
    note: "Travanj–lipanj i rujan–listopad nude najbolji omjer vremena i gužvi.",
    months: [
      { month: "jan", tempC: 4, rainMm: 38 },
      { month: "feb", tempC: 6, rainMm: 43 },
      { month: "mar", tempC: 9, rainMm: 53 },
      { month: "apr", tempC: 14, rainMm: 79 },
      { month: "may", tempC: 18, rainMm: 86 },
      { month: "jun", tempC: 22, rainMm: 71 },
      { month: "jul", tempC: 25, rainMm: 53 },
      { month: "aug", tempC: 24, rainMm: 61 },
      { month: "sep", tempC: 19, rainMm: 79 },
      { month: "oct", tempC: 14, rainMm: 94 },
      { month: "nov", tempC: 8, rainMm: 89 },
      { month: "dec", tempC: 5, rainMm: 48 },
    ],
  },

  // Dodavanje dalje gradova ovako:
  // {
  //   slug: "pariz",
  //   subtitle: "Kratak opis klime",
  //   note: "Najbolji period za posjet...",
  //   months: [...12 mjeseci...],
  // }
];