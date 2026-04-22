// utils/countryGrammar.ts

export type CountryGrammar = {
  nominative: string;
  accusative: string;
};

export const countryGrammarMap: Record<string, CountryGrammar> = {
  // EUROPA
  Albanija: { nominative: "Albanija", accusative: "Albaniju" },
  Andora: { nominative: "Andora", accusative: "Andoru" },
  Austrija: { nominative: "Austrija", accusative: "Austriju" },
  Belgija: { nominative: "Belgija", accusative: "Belgiju" },
  Bjelorusija: { nominative: "Bjelorusija", accusative: "Bjelorusiju" },
  "Bosna i Hercegovina": {
    nominative: "Bosna i Hercegovina",
    accusative: "Bosnu i Hercegovinu",
  },
  Bugarska: { nominative: "Bugarska", accusative: "Bugarsku" },
  Cipar: { nominative: "Cipar", accusative: "Cipar" },
  "Crna Gora": { nominative: "Crna Gora", accusative: "Crnu Goru" },
  Češka: { nominative: "Češka", accusative: "Češku" },
  Danska: { nominative: "Danska", accusative: "Dansku" },
  Estonija: { nominative: "Estonija", accusative: "Estoniju" },
  Finska: { nominative: "Finska", accusative: "Finsku" },
  Francuska: { nominative: "Francuska", accusative: "Francusku" },
  Grčka: { nominative: "Grčka", accusative: "Grčku" },
  Hrvatska: { nominative: "Hrvatska", accusative: "Hrvatsku" },
  Irska: { nominative: "Irska", accusative: "Irsku" },
  Island: { nominative: "Island", accusative: "Island" },
  Italija: { nominative: "Italija", accusative: "Italiju" },
  Kosovo: { nominative: "Kosovo", accusative: "Kosovo" },
  Latvija: { nominative: "Latvija", accusative: "Latviju" },
  Lihtenštajn: { nominative: "Lihtenštajn", accusative: "Lihtenštajn" },
  Litva: { nominative: "Litva", accusative: "Litvu" },
  Luksemburg: { nominative: "Luksemburg", accusative: "Luksemburg" },
  Mađarska: { nominative: "Mađarska", accusative: "Mađarsku" },
  Malta: { nominative: "Malta", accusative: "Maltu" },
  Moldavija: { nominative: "Moldavija", accusative: "Moldaviju" },
  Monako: { nominative: "Monako", accusative: "Monako" },
  Nizozemska: { nominative: "Nizozemska", accusative: "Nizozemsku" },
  Njemačka: { nominative: "Njemačka", accusative: "Njemačku" },
  Norveška: { nominative: "Norveška", accusative: "Norvešku" },
  Poljska: { nominative: "Poljska", accusative: "Poljsku" },
  Portugal: { nominative: "Portugal", accusative: "Portugal" },
  Rumunjska: { nominative: "Rumunjska", accusative: "Rumunjsku" },
  "San Marino": { nominative: "San Marino", accusative: "San Marino" },
  Slovačka: { nominative: "Slovačka", accusative: "Slovačku" },
  Slovenija: { nominative: "Slovenija", accusative: "Sloveniju" },
  Srbija: { nominative: "Srbija", accusative: "Srbiju" },
  Španjolska: { nominative: "Španjolska", accusative: "Španjolsku" },
  Švedska: { nominative: "Švedska", accusative: "Švedsku" },
  Švicarska: { nominative: "Švicarska", accusative: "Švicarsku" },
  Ukrajina: { nominative: "Ukrajina", accusative: "Ukrajinu" },
  Vatikan: { nominative: "Vatikan", accusative: "Vatikan" },
  "Ujedinjeno Kraljevstvo": {
    nominative: "Ujedinjeno Kraljevstvo",
    accusative: "Ujedinjeno Kraljevstvo",
  },

  // AZIJA
  Afganistan: { nominative: "Afganistan", accusative: "Afganistan" },
  Armenija: { nominative: "Armenija", accusative: "Armeniju" },
  Azerbajdžan: { nominative: "Azerbajdžan", accusative: "Azerbajdžan" },
  Bahrein: { nominative: "Bahrein", accusative: "Bahrein" },
  Bangladeš: { nominative: "Bangladeš", accusative: "Bangladeš" },
  Butan: { nominative: "Butan", accusative: "Butan" },
  Brunej: { nominative: "Brunej", accusative: "Brunej" },
  Filipini: { nominative: "Filipini", accusative: "Filipine" },
  Gruzija: { nominative: "Gruzija", accusative: "Gruziju" },
  Indija: { nominative: "Indija", accusative: "Indiju" },
  Indonezija: { nominative: "Indonezija", accusative: "Indoneziju" },
  Irak: { nominative: "Irak", accusative: "Irak" },
  Iran: { nominative: "Iran", accusative: "Iran" },
  Izrael: { nominative: "Izrael", accusative: "Izrael" },
  Japan: { nominative: "Japan", accusative: "Japan" },
  Jordan: { nominative: "Jordan", accusative: "Jordan" },
  Kambodža: { nominative: "Kambodža", accusative: "Kambodžu" },
  Katar: { nominative: "Katar", accusative: "Katar" },
  Kazahstan: { nominative: "Kazahstan", accusative: "Kazahstan" },
  Kina: { nominative: "Kina", accusative: "Kinu" },
  Kirgistan: { nominative: "Kirgistan", accusative: "Kirgistan" },
  Kuvajt: { nominative: "Kuvajt", accusative: "Kuvajt" },
  Laos: { nominative: "Laos", accusative: "Laos" },
  Libanon: { nominative: "Libanon", accusative: "Libanon" },
  Malezija: { nominative: "Malezija", accusative: "Maleziju" },
  Maldivi: { nominative: "Maldivi", accusative: "Maldive" },
  Mjanmar: { nominative: "Mjanmar", accusative: "Mjanmar" },
  Mongolija: { nominative: "Mongolija", accusative: "Mongoliju" },
  Nepal: { nominative: "Nepal", accusative: "Nepal" },
  Oman: { nominative: "Oman", accusative: "Oman" },
  Pakistan: { nominative: "Pakistan", accusative: "Pakistan" },
  Palestina: { nominative: "Palestina", accusative: "Palestinu" },
  "Saudijska Arabija": {
    nominative: "Saudijska Arabija",
    accusative: "Saudijsku Arabiju",
  },
  Singapur: { nominative: "Singapur", accusative: "Singapur" },
  Sirija: { nominative: "Sirija", accusative: "Siriju" },
  "Sjeverna Koreja": {
    nominative: "Sjeverna Koreja",
    accusative: "Sjevernu Koreju",
  },
  "Južna Koreja": {
    nominative: "Južna Koreja",
    accusative: "Južnu Koreju",
  },
  "Šri Lanka": { nominative: "Šri Lanka", accusative: "Šri Lanku" },
  Tadžikistan: { nominative: "Tadžikistan", accusative: "Tadžikistan" },
  Tajland: { nominative: "Tajland", accusative: "Tajland" },
  Tajvan: { nominative: "Tajvan", accusative: "Tajvan" },
  Turkmenistan: { nominative: "Turkmenistan", accusative: "Turkmenistan" },
  Turska: { nominative: "Turska", accusative: "Tursku" },
  Uzbekistan: { nominative: "Uzbekistan", accusative: "Uzbekistan" },
  Vijetnam: { nominative: "Vijetnam", accusative: "Vijetnam" },
  "Ujedinjeni Arapski Emirati": {
    nominative: "Ujedinjeni Arapski Emirati",
    accusative: "Ujedinjene Arapske Emirate",
  },
  Jemen: { nominative: "Jemen", accusative: "Jemen" },

  // AFRIKA
  Alžir: { nominative: "Alžir", accusative: "Alžir" },
  Angola: { nominative: "Angola", accusative: "Angolu" },
  Bocvana: { nominative: "Bocvana", accusative: "Bocvanu" },
  Egipat: { nominative: "Egipat", accusative: "Egipat" },
  Etiopija: { nominative: "Etiopija", accusative: "Etiopiju" },
  Gana: { nominative: "Gana", accusative: "Ganu" },
  Kenija: { nominative: "Kenija", accusative: "Keniju" },
  Libija: { nominative: "Libija", accusative: "Libiju" },
  Madagaskar: { nominative: "Madagaskar", accusative: "Madagaskar" },
  Maroko: { nominative: "Maroko", accusative: "Maroko" },
  Nigerija: { nominative: "Nigerija", accusative: "Nigeriju" },
  Ruanda: { nominative: "Ruanda", accusative: "Ruandu" },
  Senegal: { nominative: "Senegal", accusative: "Senegal" },
  Tunis: { nominative: "Tunis", accusative: "Tunis" },
  Uganda: { nominative: "Uganda", accusative: "Ugandu" },
  Zambija: { nominative: "Zambija", accusative: "Zambiju" },
  Zimbabve: { nominative: "Zimbabve", accusative: "Zimbabve" },
  "Južnoafrička Republika": {
    nominative: "Južnoafrička Republika",
    accusative: "Južnoafričku Republiku",
  },

  // SJEVERNA AMERIKA
  Kanada: { nominative: "Kanada", accusative: "Kanadu" },
  Meksiko: { nominative: "Meksiko", accusative: "Meksiko" },
  SAD: { nominative: "SAD", accusative: "SAD" },
  Grenada: { nominative: "Grenada", accusative: "Grenadu" },
  Kuba: { nominative: "Kuba", accusative: "Kubu" },
  Jamajka: { nominative: "Jamajka", accusative: "Jamajku" },
  Panama: { nominative: "Panama", accusative: "Panamu" },
  Kostarika: { nominative: "Kostarika", accusative: "Kostariku" },

  // JUŽNA AMERIKA
  Argentina: { nominative: "Argentina", accusative: "Argentinu" },
  Bolivija: { nominative: "Bolivija", accusative: "Boliviju" },
  Brazil: { nominative: "Brazil", accusative: "Brazil" },
  Čile: { nominative: "Čile", accusative: "Čile" },
  Ekvador: { nominative: "Ekvador", accusative: "Ekvador" },
  Gvajana: { nominative: "Gvajana", accusative: "Gvajanu" },
  Kolumbija: { nominative: "Kolumbija", accusative: "Kolumbiju" },
  Paragvaj: { nominative: "Paragvaj", accusative: "Paragvaj" },
  Peru: { nominative: "Peru", accusative: "Peru" },
  Surinam: { nominative: "Surinam", accusative: "Surinam" },
  Urugvaj: { nominative: "Urugvaj", accusative: "Urugvaj" },
  Venezuela: { nominative: "Venezuela", accusative: "Venezuelu" },

  // OCEANIJA
  Australija: { nominative: "Australija", accusative: "Australiju" },
  Fidži: { nominative: "Fidži", accusative: "Fidži" },
  Kiribati: { nominative: "Kiribati", accusative: "Kiribati" },
  "Novi Zeland": {
    nominative: "Novi Zeland",
    accusative: "Novi Zeland",
  },
  Palau: { nominative: "Palau", accusative: "Palau" },
  Samoa: { nominative: "Samoa", accusative: "Samou" },
  Tonga: { nominative: "Tonga", accusative: "Tongu" },
  Tuvalu: { nominative: "Tuvalu", accusative: "Tuvalu" },
  Vanuatu: { nominative: "Vanuatu", accusative: "Vanuatu" },
};

export const getCountryAccusative = (countryName: string): string => {
  return countryGrammarMap[countryName]?.accusative || countryName;
};

export const getCountryGrammar = (
  countryName: string
): CountryGrammar | null => {
  return countryGrammarMap[countryName] || null;
};