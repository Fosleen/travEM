// utils/countryGrammar.ts

export type CountryGrammar = {
  nominative: string;
  accusative: string;
  genitive: string;
  locative: string;
};

const makeForms = (
  nominative: string,
  accusative: string,
  genitive: string,
  locative: string
): CountryGrammar => ({
  nominative,
  accusative,
  genitive,
  locative,
});

export const countryGrammarMap: Record<string, CountryGrammar> = {
  // EUROPA
  Albanija: makeForms("Albanija", "Albaniju", "Albanije", "Albaniji"),
  Andora: makeForms("Andora", "Andoru", "Andore", "Andori"),
  Armenija: makeForms("Armenija", "Armeniju", "Armenije", "Armeniji"),
  Austrija: makeForms("Austrija", "Austriju", "Austrije", "Austriji"),
  Azerbajdžan: makeForms(
    "Azerbajdžan",
    "Azerbajdžan",
    "Azerbajdžana",
    "Azerbajdžanu"
  ),
  Belgija: makeForms("Belgija", "Belgiju", "Belgije", "Belgiji"),
  Bjelorusija: makeForms(
    "Bjelorusija",
    "Bjelorusiju",
    "Bjelorusije",
    "Bjelorusiji"
  ),
  "Bosna i Hercegovina": makeForms(
    "Bosna i Hercegovina",
    "Bosnu i Hercegovinu",
    "Bosne i Hercegovine",
    "Bosni i Hercegovini"
  ),
  Bugarska: makeForms("Bugarska", "Bugarsku", "Bugarske", "Bugarskoj"),
  Cipar: makeForms("Cipar", "Cipar", "Cipra", "Cipru"),
  "Crna Gora": makeForms("Crna Gora", "Crnu Goru", "Crne Gore", "Crnoj Gori"),
  Češka: makeForms("Češka", "Češku", "Češke", "Češkoj"),
  Danska: makeForms("Danska", "Dansku", "Danske", "Danskoj"),
  Estonija: makeForms("Estonija", "Estoniju", "Estonije", "Estoniji"),
  Finska: makeForms("Finska", "Finsku", "Finske", "Finskoj"),
  Francuska: makeForms("Francuska", "Francusku", "Francuske", "Francuskoj"),
  Gruzija: makeForms("Gruzija", "Gruziju", "Gruzije", "Gruziji"),
  Grčka: makeForms("Grčka", "Grčku", "Grčke", "Grčkoj"),
  Hrvatska: makeForms("Hrvatska", "Hrvatsku", "Hrvatske", "Hrvatskoj"),
  Irska: makeForms("Irska", "Irsku", "Irske", "Irskoj"),
  Island: makeForms("Island", "Island", "Islanda", "Islandu"),
  Italija: makeForms("Italija", "Italiju", "Italije", "Italiji"),
  Kazahstan: makeForms("Kazahstan", "Kazahstan", "Kazahstana", "Kazahstanu"),
  Kosovo: makeForms("Kosovo", "Kosovo", "Kosova", "Kosovu"),
  Latvija: makeForms("Latvija", "Latviju", "Latvije", "Latviji"),
  Lihtenštajn: makeForms(
    "Lihtenštajn",
    "Lihtenštajn",
    "Lihtenštajna",
    "Lihtenštajnu"
  ),
  Litva: makeForms("Litva", "Litvu", "Litve", "Litvi"),
  Luksemburg: makeForms("Luksemburg", "Luksemburg", "Luksemburga", "Luksemburgu"),
  Mađarska: makeForms("Mađarska", "Mađarsku", "Mađarske", "Mađarskoj"),
  Malta: makeForms("Malta", "Maltu", "Malte", "Malti"),
  Moldavija: makeForms("Moldavija", "Moldaviju", "Moldavije", "Moldaviji"),
  Monako: makeForms("Monako", "Monako", "Monaka", "Monaku"),
  Nizozemska: makeForms(
    "Nizozemska",
    "Nizozemsku",
    "Nizozemske",
    "Nizozemskoj"
  ),
  Njemačka: makeForms("Njemačka", "Njemačku", "Njemačke", "Njemačkoj"),
  Norveška: makeForms("Norveška", "Norvešku", "Norveške", "Norveškoj"),
  Poljska: makeForms("Poljska", "Poljsku", "Poljske", "Poljskoj"),
  Portugal: makeForms("Portugal", "Portugal", "Portugala", "Portugalu"),
  Rumunjska: makeForms("Rumunjska", "Rumunjsku", "Rumunjske", "Rumunjskoj"),
  Rusija: makeForms("Rusija", "Rusiju", "Rusije", "Rusiji"),
  "San Marino": makeForms("San Marino", "San Marino", "San Marina", "San Marinu"),
  Slovačka: makeForms("Slovačka", "Slovačku", "Slovačke", "Slovačkoj"),
  Slovenija: makeForms("Slovenija", "Sloveniju", "Slovenije", "Sloveniji"),
  Srbija: makeForms("Srbija", "Srbiju", "Srbije", "Srbiji"),
  "Sjeverna Makedonija": makeForms(
    "Sjeverna Makedonija",
    "Sjevernu Makedoniju",
    "Sjeverne Makedonije",
    "Sjevernoj Makedoniji"
  ),
  Španjolska: makeForms(
    "Španjolska",
    "Španjolsku",
    "Španjolske",
    "Španjolskoj"
  ),
  Švedska: makeForms("Švedska", "Švedsku", "Švedske", "Švedskoj"),
  Švicarska: makeForms("Švicarska", "Švicarsku", "Švicarske", "Švicarskoj"),
  Turska: makeForms("Turska", "Tursku", "Turske", "Turskoj"),
  Ukrajina: makeForms("Ukrajina", "Ukrajinu", "Ukrajine", "Ukrajini"),
  Vatikan: makeForms("Vatikan", "Vatikan", "Vatikana", "Vatikanu"),
  "Ujedinjeno Kraljevstvo": makeForms(
    "Ujedinjeno Kraljevstvo",
    "Ujedinjeno Kraljevstvo",
    "Ujedinjenog Kraljevstva",
    "Ujedinjenom Kraljevstvu"
  ),

  // AZIJA
  Afganistan: makeForms("Afganistan", "Afganistan", "Afganistana", "Afganistanu"),
  Bahrein: makeForms("Bahrein", "Bahrein", "Bahreina", "Bahreinu"),
  Bangladeš: makeForms("Bangladeš", "Bangladeš", "Bangladeša", "Bangladešu"),
  Butan: makeForms("Butan", "Butan", "Butana", "Butanu"),
  Brunej: makeForms("Brunej", "Brunej", "Bruneja", "Bruneju"),
  Filipini: makeForms("Filipini", "Filipine", "Filipina", "Filipinima"),
  Indija: makeForms("Indija", "Indiju", "Indije", "Indiji"),
  Indonezija: makeForms("Indonezija", "Indoneziju", "Indonezije", "Indoneziji"),
  Irak: makeForms("Irak", "Irak", "Iraka", "Iraku"),
  Iran: makeForms("Iran", "Iran", "Irana", "Iranu"),
  Izrael: makeForms("Izrael", "Izrael", "Izraela", "Izraelu"),
  Japan: makeForms("Japan", "Japan", "Japana", "Japanu"),
  Jemen: makeForms("Jemen", "Jemen", "Jemena", "Jemenu"),
  Jordan: makeForms("Jordan", "Jordan", "Jordana", "Jordanu"),
  Kambodža: makeForms("Kambodža", "Kambodžu", "Kambodže", "Kambodži"),
  Katar: makeForms("Katar", "Katar", "Katara", "Kataru"),
  Kina: makeForms("Kina", "Kinu", "Kine", "Kini"),
  Kirgistan: makeForms("Kirgistan", "Kirgistan", "Kirgistana", "Kirgistanu"),
  Kuvajt: makeForms("Kuvajt", "Kuvajt", "Kuvajta", "Kuvajtu"),
  Laos: makeForms("Laos", "Laos", "Laosa", "Laosu"),
  Libanon: makeForms("Libanon", "Libanon", "Libanona", "Libanonu"),
  Malezija: makeForms("Malezija", "Maleziju", "Malezije", "Maleziji"),
  Maldivi: makeForms("Maldivi", "Maldive", "Maldiva", "Maldivima"),
  Mongolija: makeForms("Mongolija", "Mongoliju", "Mongolije", "Mongoliji"),
  Mjanmar: makeForms("Mjanmar", "Mjanmar", "Mjanmara", "Mjanmaru"),
  Nepal: makeForms("Nepal", "Nepal", "Nepala", "Nepalu"),
  Oman: makeForms("Oman", "Oman", "Omana", "Omanu"),
  Pakistan: makeForms("Pakistan", "Pakistan", "Pakistana", "Pakistanu"),
  Palestina: makeForms("Palestina", "Palestinu", "Palestine", "Palestini"),
  "Saudijska Arabija": makeForms(
    "Saudijska Arabija",
    "Saudijsku Arabiju",
    "Saudijske Arabije",
    "Saudijskoj Arabiji"
  ),
  Singapur: makeForms("Singapur", "Singapur", "Singapura", "Singapuru"),
  Sirija: makeForms("Sirija", "Siriju", "Sirije", "Siriji"),
  "Sjeverna Koreja": makeForms(
    "Sjeverna Koreja",
    "Sjevernu Koreju",
    "Sjeverne Koreje",
    "Sjevernoj Koreji"
  ),
  "Južna Koreja": makeForms(
    "Južna Koreja",
    "Južnu Koreju",
    "Južne Koreje",
    "Južnoj Koreji"
  ),
  "Šri Lanka": makeForms("Šri Lanka", "Šri Lanku", "Šri Lanke", "Šri Lanki"),
  Tadžikistan: makeForms(
    "Tadžikistan",
    "Tadžikistan",
    "Tadžikistana",
    "Tadžikistanu"
  ),
  Tajland: makeForms("Tajland", "Tajland", "Tajlanda", "Tajlandu"),
  Tajvan: makeForms("Tajvan", "Tajvan", "Tajvana", "Tajvanu"),
  Turkmenistan: makeForms(
    "Turkmenistan",
    "Turkmenistan",
    "Turkmenistana",
    "Turkmenistanu"
  ),
  "Ujedinjeni Arapski Emirati": makeForms(
    "Ujedinjeni Arapski Emirati",
    "Ujedinjene Arapske Emirate",
    "Ujedinjenih Arapskih Emirata",
    "Ujedinjenim Arapskim Emiratima"
  ),
  Uzbekistan: makeForms("Uzbekistan", "Uzbekistan", "Uzbekistana", "Uzbekistanu"),
  Vijetnam: makeForms("Vijetnam", "Vijetnam", "Vijetnama", "Vijetnamu"),

  // AFRIKA
  Alžir: makeForms("Alžir", "Alžir", "Alžira", "Alžiru"),
  Angola: makeForms("Angola", "Angolu", "Angole", "Angoli"),
  Benin: makeForms("Benin", "Benin", "Benina", "Beninu"),
  Bocvana: makeForms("Bocvana", "Bocvanu", "Bocvane", "Bocvani"),
  "Burkina Faso": makeForms(
    "Burkina Faso",
    "Burkina Faso",
    "Burkine Faso",
    "Burkini Faso"
  ),
  Burundi: makeForms("Burundi", "Burundi", "Burundija", "Burundiju"),
  Čad: makeForms("Čad", "Čad", "Čada", "Čadu"),
  Džibuti: makeForms("Džibuti", "Džibuti", "Džibutija", "Džibutiju"),
  Egipat: makeForms("Egipat", "Egipat", "Egipta", "Egiptu"),
  Eritreja: makeForms("Eritreja", "Eritreju", "Eritreje", "Eritreji"),
  Esvatini: makeForms("Esvatini", "Esvatini", "Esvatinija", "Esvatiniju"),
  Etiopija: makeForms("Etiopija", "Etiopiju", "Etiopije", "Etiopiji"),
  Gabon: makeForms("Gabon", "Gabon", "Gabona", "Gabonu"),
  Gambija: makeForms("Gambija", "Gambiju", "Gambije", "Gambiji"),
  Gana: makeForms("Gana", "Ganu", "Gane", "Gani"),
  Gvineja: makeForms("Gvineja", "Gvineju", "Gvineje", "Gvineji"),
  "Gvineja Bisau": makeForms(
    "Gvineja Bisau",
    "Gvineju Bisau",
    "Gvineje Bisau",
    "Gvineji Bisau"
  ),
  Kamerun: makeForms("Kamerun", "Kamerun", "Kameruna", "Kamerunu"),
  Kenija: makeForms("Kenija", "Keniju", "Kenije", "Keniji"),
  Komori: makeForms("Komori", "Komore", "Komora", "Komorima"),
  Kongo: makeForms("Kongo", "Kongo", "Konga", "Kongu"),
  Lesoto: makeForms("Lesoto", "Lesoto", "Lesota", "Lesotu"),
  Liberija: makeForms("Liberija", "Liberiju", "Liberije", "Liberiji"),
  Libija: makeForms("Libija", "Libiju", "Libije", "Libiji"),
  Madagaskar: makeForms("Madagaskar", "Madagaskar", "Madagaskara", "Madagaskaru"),
  Malavi: makeForms("Malavi", "Malavi", "Malavija", "Malaviju"),
  Mali: makeForms("Mali", "Mali", "Malija", "Maliju"),
  Maroko: makeForms("Maroko", "Maroko", "Maroka", "Maroku"),
  Mauricijus: makeForms("Mauricijus", "Mauricijus", "Mauricijusa", "Mauricijusu"),
  Mauritanija: makeForms(
    "Mauritanija",
    "Mauritaniju",
    "Mauritanije",
    "Mauritaniji"
  ),
  Mozambik: makeForms("Mozambik", "Mozambik", "Mozambika", "Mozambiku"),
  Namibija: makeForms("Namibija", "Namibiju", "Namibije", "Namibiji"),
  Niger: makeForms("Niger", "Niger", "Nigera", "Nigeru"),
  Nigerija: makeForms("Nigerija", "Nigeriju", "Nigerije", "Nigeriji"),
  "Obala Bjelokosti": makeForms(
    "Obala Bjelokosti",
    "Obalu Bjelokosti",
    "Obale Bjelokosti",
    "Obali Bjelokosti"
  ),
  Ruanda: makeForms("Ruanda", "Ruandu", "Ruande", "Ruandi"),
  "Sao Tome i Principe": makeForms(
    "Sao Tome i Principe",
    "Sao Tome i Principe",
    "Sao Tome i Principa",
    "Sao Tomeu i Principeu"
  ),
  Senegal: makeForms("Senegal", "Senegal", "Senegala", "Senegalu"),
  Sejšeli: makeForms("Sejšeli", "Sejšele", "Sejšela", "Sejšelima"),
  "Sierra Leone": makeForms(
    "Sierra Leone",
    "Sierra Leone",
    "Sierre Leone",
    "Sierri Leone"
  ),
  Somalija: makeForms("Somalija", "Somaliju", "Somalije", "Somaliji"),
  "Srednjoafrička Republika": makeForms(
    "Srednjoafrička Republika",
    "Srednjoafričku Republiku",
    "Srednjoafričke Republike",
    "Srednjoafričkoj Republici"
  ),
  Sudan: makeForms("Sudan", "Sudan", "Sudana", "Sudanu"),
  Tanzanija: makeForms("Tanzanija", "Tanzaniju", "Tanzanije", "Tanzaniji"),
  Togo: makeForms("Togo", "Togo", "Toga", "Togu"),
  Tunis: makeForms("Tunis", "Tunis", "Tunisa", "Tunisu"),
  Uganda: makeForms("Uganda", "Ugandu", "Ugande", "Ugandi"),
  Zambija: makeForms("Zambija", "Zambiju", "Zambije", "Zambiji"),
  Zimbabve: makeForms("Zimbabve", "Zimbabve", "Zimbabvea", "Zimbabveu"),
  "Južni Sudan": makeForms(
    "Južni Sudan",
    "Južni Sudan",
    "Južnog Sudana",
    "Južnom Sudanu"
  ),
  "Južnoafrička Republika": makeForms(
    "Južnoafrička Republika",
    "Južnoafričku Republiku",
    "Južnoafričke Republike",
    "Južnoafričkoj Republici"
  ),
  "Demokratska Republika Kongo": makeForms(
    "Demokratska Republika Kongo",
    "Demokratsku Republiku Kongo",
    "Demokratske Republike Kongo",
    "Demokratskoj Republici Kongo"
  ),
  "Ekvatorska Gvineja": makeForms(
    "Ekvatorska Gvineja",
    "Ekvatorsku Gvineju",
    "Ekvatorske Gvineje",
    "Ekvatorskoj Gvineji"
  ),

  // SJEVERNA AMERIKA
  "Antigua i Barbuda": makeForms(
    "Antigua i Barbuda",
    "Antiguu i Barbudu",
    "Antigue i Barbude",
    "Antigvi i Barbudi"
  ),
  Bahami: makeForms("Bahami", "Bahame", "Bahama", "Bahamima"),
  Barbados: makeForms("Barbados", "Barbados", "Barbadosa", "Barbadosu"),
  Belize: makeForms("Belize", "Belize", "Belizea", "Belizeu"),
  Kanada: makeForms("Kanada", "Kanadu", "Kanade", "Kanadi"),
  Kostarika: makeForms("Kostarika", "Kostariku", "Kostarike", "Kostariki"),
  Kuba: makeForms("Kuba", "Kubu", "Kube", "Kubi"),
  Dominika: makeForms("Dominika", "Dominiku", "Dominike", "Dominiki"),
  "Dominikanska Republika": makeForms(
    "Dominikanska Republika",
    "Dominikansku Republiku",
    "Dominikanske Republike",
    "Dominikanskoj Republici"
  ),
  Salvador: makeForms("Salvador", "Salvador", "Salvadora", "Salvadoru"),
  Grenada: makeForms("Grenada", "Grenadu", "Grenade", "Grenadi"),
  Gvatemala: makeForms("Gvatemala", "Gvatemalu", "Gvatemale", "Gvatemali"),
  Haiti: makeForms("Haiti", "Haiti", "Haitija", "Haitiju"),
  Honduras: makeForms("Honduras", "Honduras", "Hondurasa", "Hondurasu"),
  Jamajka: makeForms("Jamajka", "Jamajku", "Jamajke", "Jamajci"),
  Meksiko: makeForms("Meksiko", "Meksiko", "Meksika", "Meksiku"),
  Nikaragva: makeForms("Nikaragva", "Nikaragvu", "Nikaragve", "Nikaragvi"),
  Panama: makeForms("Panama", "Panamu", "Paname", "Panami"),
  SAD: makeForms("SAD", "SAD", "SAD-a", "SAD-u"),
  "Sveti Kristofor i Nevis": makeForms(
    "Sveti Kristofor i Nevis",
    "Sveti Kristofor i Nevis",
    "Svetog Kristofora i Nevisa",
    "Svetom Kristoforu i Nevisu"
  ),
  "Sveta Lucija": makeForms(
    "Sveta Lucija",
    "Svetu Luciju",
    "Svete Lucije",
    "Svetoj Luciji"
  ),
  "Sveti Vincent i Grenadini": makeForms(
    "Sveti Vincent i Grenadini",
    "Sveti Vincent i Grenadine",
    "Svetog Vincenta i Grenadina",
    "Svetom Vincentu i Grenadinima"
  ),
  "Trinidad i Tobago": makeForms(
    "Trinidad i Tobago",
    "Trinidad i Tobago",
    "Trinidada i Tobaga",
    "Trinidadu i Tobagu"
  ),

  // JUŽNA AMERIKA
  Argentina: makeForms("Argentina", "Argentinu", "Argentine", "Argentini"),
  Bolivija: makeForms("Bolivija", "Boliviju", "Bolivije", "Boliviji"),
  Brazil: makeForms("Brazil", "Brazil", "Brazila", "Brazilu"),
  Čile: makeForms("Čile", "Čile", "Čilea", "Čileu"),
  Ekvador: makeForms("Ekvador", "Ekvador", "Ekvadora", "Ekvadoru"),
  Gvajana: makeForms("Gvajana", "Gvajanu", "Gvajane", "Gvajani"),
  Kolumbija: makeForms("Kolumbija", "Kolumbiju", "Kolumbije", "Kolumbiji"),
  Paragvaj: makeForms("Paragvaj", "Paragvaj", "Paragvaja", "Paragvaju"),
  Peru: makeForms("Peru", "Peru", "Perua", "Peruu"),
  Surinam: makeForms("Surinam", "Surinam", "Surinama", "Surinamu"),
  Urugvaj: makeForms("Urugvaj", "Urugvaj", "Urugvaja", "Urugvaju"),
  Venezuela: makeForms("Venezuela", "Venezuelu", "Venezuele", "Venezueli"),

  // OCEANIJA
  Australija: makeForms("Australija", "Australiju", "Australije", "Australiji"),
  Fidži: makeForms("Fidži", "Fidži", "Fidžija", "Fidžiju"),
  Kiribati: makeForms("Kiribati", "Kiribati", "Kiribatija", "Kiribatiju"),
  "Maršalovi Otoci": makeForms(
    "Maršalovi Otoci",
    "Maršalove Otoke",
    "Maršalovih Otoka",
    "Maršalovim Otocima"
  ),
  Mikronezija: makeForms("Mikronezija", "Mikroneziju", "Mikronezije", "Mikroneziji"),
  Nauru: makeForms("Nauru", "Nauru", "Naurua", "Nauruu"),
  "Novi Zeland": makeForms(
    "Novi Zeland",
    "Novi Zeland",
    "Novog Zelanda",
    "Novom Zelandu"
  ),
  Palau: makeForms("Palau", "Palau", "Palaua", "Palauu"),
  "Papua Nova Gvineja": makeForms(
    "Papua Nova Gvineja",
    "Papuu Novu Gvineju",
    "Papue Nove Gvineje",
    "Papui Novoj Gvineji"
  ),
  Samoa: makeForms("Samoa", "Samou", "Samoe", "Samoi"),
  "Solomonovi Otoci": makeForms(
    "Solomonovi Otoci",
    "Solomonove Otoke",
    "Solomonovih Otoka",
    "Solomonovim Otocima"
  ),
  Tonga: makeForms("Tonga", "Tongu", "Tonge", "Tongi"),
  Tuvalu: makeForms("Tuvalu", "Tuvalu", "Tuvalua", "Tuvaluu"),
  Vanuatu: makeForms("Vanuatu", "Vanuatu", "Vanuatua", "Vanuatuu"),
};

const countryAliases: Record<string, string> = {
  // lowercase / slug friendly
  afganistan: "Afganistan",
  albanija: "Albanija",
  alžir: "Alžir",
  alzir: "Alžir",
  andora: "Andora",
  angola: "Angola",
  "antigua i barbuda": "Antigua i Barbuda",
  argentina: "Argentina",
  armenija: "Armenija",
  australija: "Australija",
  austrija: "Austrija",
  azerbajdžan: "Azerbajdžan",
  azerbajdzan: "Azerbajdžan",
  bahami: "Bahami",
  bahrein: "Bahrein",
  bangladeš: "Bangladeš",
  banglades: "Bangladeš",
  barbados: "Barbados",
  belgija: "Belgija",
  belize: "Belize",
  bjelorusija: "Bjelorusija",
  benin: "Benin",
  "bosna i hercegovina": "Bosna i Hercegovina",
  bocvana: "Bocvana",
  bolivija: "Bolivija",
  brazil: "Brazil",
  brunej: "Brunej",
  bugarska: "Bugarska",
  "burkina faso": "Burkina Faso",
  burundi: "Burundi",
  butan: "Butan",
  čad: "Čad",
  cad: "Čad",
  "crna gora": "Crna Gora",
  cipar: "Cipar",
  češka: "Češka",
  ceska: "Češka",
  čile: "Čile",
  cile: "Čile",
  danska: "Danska",
  "demokratska republika kongo": "Demokratska Republika Kongo",
  dominika: "Dominika",
  "dominikanska republika": "Dominikanska Republika",
  džibuti: "Džibuti",
  dzibuti: "Džibuti",
  egipat: "Egipat",
  ekvador: "Ekvador",
  "ekvatorska gvineja": "Ekvatorska Gvineja",
  eritreja: "Eritreja",
  estonija: "Estonija",
  esvatini: "Esvatini",
  etiopija: "Etiopija",
  fidži: "Fidži",
  fidzi: "Fidži",
  filipini: "Filipini",
  finska: "Finska",
  francuska: "Francuska",
  gabon: "Gabon",
  gambija: "Gambija",
  gana: "Gana",
  grčka: "Grčka",
  grcka: "Grčka",
  grenada: "Grenada",
  gruzija: "Gruzija",
  gvajana: "Gvajana",
  gvatemala: "Gvatemala",
  gvineja: "Gvineja",
  "gvineja bisau": "Gvineja Bisau",
  haiti: "Haiti",
  honduras: "Honduras",
  hrvatska: "Hrvatska",
  indija: "Indija",
  indonezija: "Indonezija",
  irak: "Irak",
  iran: "Iran",
  irska: "Irska",
  island: "Island",
  italija: "Italija",
  izrael: "Izrael",
  jamajka: "Jamajka",
  japan: "Japan",
  jemen: "Jemen",
  jordan: "Jordan",
  "južna afrika": "Južnoafrička Republika",
  "juzna afrika": "Južnoafrička Republika",
  "južna koreja": "Južna Koreja",
  "juzna koreja": "Južna Koreja",
  "južni sudan": "Južni Sudan",
  "juzni sudan": "Južni Sudan",
  "južnoafrička republika": "Južnoafrička Republika",
  "juznoafricka republika": "Južnoafrička Republika",
  kambodža: "Kambodža",
  kambodza: "Kambodža",
  kamerun: "Kamerun",
  kanada: "Kanada",
  katar: "Katar",
  kazahstan: "Kazahstan",
  kenija: "Kenija",
  kina: "Kina",
  kirgistan: "Kirgistan",
  kiribati: "Kiribati",
  kolumbija: "Kolumbija",
  komori: "Komori",
  kongo: "Kongo",
  kosovo: "Kosovo",
  kostarika: "Kostarika",
  kuba: "Kuba",
  kuvajt: "Kuvajt",
  laos: "Laos",
  latvija: "Latvija",
  lesoto: "Lesoto",
  libanon: "Libanon",
  liberija: "Liberija",
  libija: "Libija",
  lihtenštajn: "Lihtenštajn",
  lihtenstajn: "Lihtenštajn",
  litva: "Litva",
  luksemburg: "Luksemburg",
  mađarska: "Mađarska",
  madagaskar: "Madagaskar",
  malavi: "Malavi",
  malezija: "Malezija",
  maldivi: "Maldivi",
  mali: "Mali",
  malta: "Malta",
  maroko: "Maroko",
  "maršalovi otoci": "Maršalovi Otoci",
  "marsalovi otoci": "Maršalovi Otoci",
  mauricijus: "Mauricijus",
  mauritanija: "Mauritanija",
  meksiko: "Meksiko",
  mikronezija: "Mikronezija",
  mjanmar: "Mjanmar",
  moldavija: "Moldavija",
  monako: "Monako",
  mongolija: "Mongolija",
  mozambik: "Mozambik",
  namibija: "Namibija",
  nauru: "Nauru",
  nepal: "Nepal",
  niger: "Niger",
  nigerija: "Nigerija",
  nikaragva: "Nikaragva",
  nizozemska: "Nizozemska",
  njemačka: "Njemačka",
  njemacka: "Njemačka",
  norveška: "Norveška",
  norveska: "Norveška",
  "novi zeland": "Novi Zeland",
  "obala bjelokosti": "Obala Bjelokosti",
  oman: "Oman",
  pakistan: "Pakistan",
  palau: "Palau",
  palestina: "Palestina",
  panama: "Panama",
  "papua nova gvineja": "Papua Nova Gvineja",
  paragvaj: "Paragvaj",
  peru: "Peru",
  poljska: "Poljska",
  portugal: "Portugal",
  rumunjska: "Rumunjska",
  ruanda: "Ruanda",
  rusija: "Rusija",
  "san marino": "San Marino",
  "sao tome i principe": "Sao Tome i Principe",
  "saudijska arabija": "Saudijska Arabija",
  "sierra leone": "Sierra Leone",
  singapur: "Singapur",
  sirija: "Sirija",
  slovačka: "Slovačka",
  slovacka: "Slovačka",
  slovenija: "Slovenija",
  "solomonovi otoci": "Solomonovi Otoci",
  somalija: "Somalija",
  srbija: "Srbija",
  "srednjoafrička republika": "Srednjoafrička Republika",
  "srednjoafricka republika": "Srednjoafrička Republika",
  sudan: "Sudan",
  surinam: "Surinam",
  "sveta lucija": "Sveta Lucija",
  "sveti kristofor i nevis": "Sveti Kristofor i Nevis",
  "sveti vincent i grenadini": "Sveti Vincent i Grenadini",
  španjolska: "Španjolska",
  spanjolska: "Španjolska",
  "sjeverna koreja": "Sjeverna Koreja",
  "sjeverna makedonija": "Sjeverna Makedonija",
  "sri lanka": "Šri Lanka",
  "šri lanka": "Šri Lanka",
  švedska: "Švedska",
  svedska: "Švedska",
  švicarska: "Švicarska",
  svicarska: "Švicarska",
  tadžikistan: "Tadžikistan",
  tadzikistan: "Tadžikistan",
  tajland: "Tajland",
  tajvan: "Tajvan",
  tanzanija: "Tanzanija",
  togo: "Togo",
  tonga: "Tonga",
  "trinidad i tobago": "Trinidad i Tobago",
  تونس: "Tunis",
  tunis: "Tunis",
  turska: "Turska",
  turkmenistan: "Turkmenistan",
  tuvalu: "Tuvalu",
  uganda: "Uganda",
  ukrajina: "Ukrajina",
  "ujedinjeni arapski emirati": "Ujedinjeni Arapski Emirati",
  "ujedinjeno kraljevstvo": "Ujedinjeno Kraljevstvo",
  urugvaj: "Urugvaj",
  uzbekistan: "Uzbekistan",
  vanuatu: "Vanuatu",
  vatikan: "Vatikan",
  venezuela: "Venezuela",
  vijetnam: "Vijetnam",
  zambija: "Zambija",
  zimbabve: "Zimbabve",
};

const normalizeCountryName = (countryName: string): string => {
  if (!countryName) return "";

  const trimmed = countryName.trim().replace(/\s+/g, " ");
  return countryAliases[trimmed] || countryAliases[trimmed.toLowerCase()] || trimmed;
};

export const getCountryAccusative = (countryName: string): string => {
  const normalized = normalizeCountryName(countryName);
  return countryGrammarMap[normalized]?.accusative || normalized || countryName;
};

export const getCountryGenitive = (countryName: string): string => {
  const normalized = normalizeCountryName(countryName);
  return countryGrammarMap[normalized]?.genitive || normalized || countryName;
};

export const getCountryLocative = (countryName: string): string => {
  const normalized = normalizeCountryName(countryName);
  return countryGrammarMap[normalized]?.locative || normalized || countryName;
};

export const getCountryGrammar = (
  countryName: string
): CountryGrammar | null => {
  const normalized = normalizeCountryName(countryName);
  return countryGrammarMap[normalized] || null;
};