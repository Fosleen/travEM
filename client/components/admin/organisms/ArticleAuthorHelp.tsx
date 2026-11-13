export default function ArticleAuthorHelp({ field }: { field: "title" | "subtitle" | "description" | "video" | "sections" }) {
  const help = {
    title: "Naslov smije imati najviše 100 znakova.",
    subtitle: "1 do max 3 pojma ispod naslova na karticama članaka - kratak poziv na čitanje (CTA).",
    description: "Opis je prvo što čitatelj vidi u članku i jedini tekst opisa koji vidi u newsletteru. Ukratko uvedite temu i pozovite na čitanje članka (CTA). Najviše 100 znakova.",
    video: "Unesite YouTube poveznicu za ugrađivanje (embed), npr. https://www.youtube.com/embed/VIDEO_ID.",
    sections: "Ako ne odaberete ikonicu, podnaslov odlomka neće biti prikazan u sadržaju članka. Ako je odaberete, podnaslov će se u sadržaju prikazati s tom ikonicom. Ikonice ne koristimo svugdje - primjerice, za uvod ih ne stavljamo. Ako ispod nekog odlomka želite više slika, dodajte odlomak bez teksta, samo sa slikama.",
  };
  return <p className="article-author-help">{help[field]}</p>;
}
