// utils/bestTimeToVisitPlacesData.ts
export type MonthKey =
  | "jan" | "feb" | "mar" | "apr" | "may" | "jun"
  | "jul" | "aug" | "sep" | "oct" | "nov" | "dec";

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
  icon?: WeatherIconKey; // opcionalno
};

export type PlaceClimate = {
  // slug treba matchati URL segment (placeName) koji šalješ u komponentu
  slug: string; // npr. "budimpesta" ili "pariz"
  title?: string; // npr. "Najbolje vrijeme za posjet Budimpešti"
  subtitle?: string; // opcionalno
  note?: string; // opcionalno
  months: PlaceMonth[];
};

export const BEST_TIME_PLACES_DATA: PlaceClimate[] = [
    {
    slug: "budimpesta",
    title: "Najbolje vrijeme za posjet Budimpešti",
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
    title: "Najbolje vrijeme za posjet Istanbulu",
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
    title: "Najbolje vrijeme za posjet Londonu",
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
    title: "Najbolje vrijeme za posjet Parizu",
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
    title: "Najbolje vrijeme za posjet Sarajevu",
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
    title: "Najbolje vrijeme za posjet Varaždinu",
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
    title: "Najbolje vrijeme za posjet Rimu",
    subtitle: "Mediteranska klima s vrućim ljetima i blagim zimama",
    note: "Travanj–lipanj i rujan–listopad idealni su za razgledavanje bez ekstremnih vrućina.",
    months: [
        { month: "jan", tempC: 8,  rainMm: 70 },
        { month: "feb", tempC: 9,  rainMm: 65 },
        { month: "mar", tempC: 11, rainMm: 60 },
        { month: "apr", tempC: 14, rainMm: 65 },
        { month: "may", tempC: 18, rainMm: 55 },
        { month: "jun", tempC: 22, rainMm: 35 },
        { month: "jul", tempC: 25, rainMm: 20 },
        { month: "aug", tempC: 25, rainMm: 30 },
        { month: "sep", tempC: 21, rainMm: 65 },
        { month: "oct", tempC: 17, rainMm: 90 },
        { month: "nov", tempC: 12, rainMm: 110 },
        { month: "dec", tempC: 9,  rainMm: 80 },
    ],
  },

  {
    slug: "ljubljana",
    title: "Najbolje vrijeme za posjet Ljubljani",
    subtitle: "Umjerena kontinentalna klima s više kiše u proljeće i jesen",
    note: "Svibanj, lipanj i rujan nude najbolji balans ugodne temperature i manjih gužvi.",
    months: [
        { month: "jan", tempC: 1,  rainMm: 70 },
        { month: "feb", tempC: 3,  rainMm: 65 },
        { month: "mar", tempC: 8,  rainMm: 80 },
        { month: "apr", tempC: 13, rainMm: 105 },
        { month: "may", tempC: 17, rainMm: 120 },
        { month: "jun", tempC: 20, rainMm: 140 },
        { month: "jul", tempC: 22, rainMm: 115 },
        { month: "aug", tempC: 22, rainMm: 120 },
        { month: "sep", tempC: 17, rainMm: 140 },
        { month: "oct", tempC: 12, rainMm: 135 },
        { month: "nov", tempC: 7,  rainMm: 120 },
        { month: "dec", tempC: 2,  rainMm: 95 },
    ],
  },

  {
  slug: "prag",
  title: "Najbolje vrijeme za posjet Pragu",
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
  
  // Dodavanje dalje gradova ovako:
  // {
  //   slug: "pariz",
  //   title: "Najbolje vrijeme za posjet Parizu",
  //   months: [...12 mjeseci...]
  // }
];
