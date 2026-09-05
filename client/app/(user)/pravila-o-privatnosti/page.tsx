import "./PrivacyPolicy.scss";
import type { Metadata } from "next";
import { SITE_URL } from "@/utils/site";

export const metadata: Metadata = {
  title: "Pravila o privatnosti - putujEM s travEM",
  description:
    "Pravila o privatnosti web stranice putujEM s travEM i informacije o obradi osobnih podataka.",
  alternates: { canonical: `${SITE_URL}/pravila-o-privatnosti` },
  openGraph: {
    title: "Pravila o privatnosti - putujEM s travEM",
    description:
      "Pravila o privatnosti web stranice putujEM s travEM i informacije o obradi osobnih podataka.",
    type: "website",
    url: `${SITE_URL}/pravila-o-privatnosti`,
    images: [`${SITE_URL}/default-og-image.jpg`],
  },
};

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-container">
      <h3>Pravila o privatnosti</h3>
      <p>
        Dobrodošli na web stranicu putujEM s travEM. Ova web stranica poštuje
        Vašu privatnost i obvezuje se na zaštitu Vaših osobnih podataka. Ova
        Pravila o privatnosti opisuju način na koji prikupljamo, koristimo,
        otkrivamo i štitimo Vaše osobne podatke prilikom korištenja naše web
        stranice.
      </p>

      <h4> Osobni podaci koje prikupljamo</h4>
      <p>
        Prilikom posjete naše web stranice, možemo automatski prikupljati
        određene informacije o vašem uređaju, uključujući IP adresu, podatke o
        pregledniku, vrijeme pristupa i referentne stranice. Osim toga, ako se
        odlučite koristiti naše usluge, možemo prikupiti određene osobne podatke
        poput imena, adrese e-pošte, lokacije i drugih informacija koje nam
        dobrovoljno pružite.
      </p>

      <h4>Kolačići i tehnologije praćenja</h4>
      <p>
        Koristimo kolačiće i slične tehnologije za prikupljanje informacija i
        praćenje vašeg ponašanja na našoj web stranici. Kad prvi put pristupite
        web stranici, pojavljuje se natipis koji upozorava na postojanje
        kolačića i zatražiti Vašu suglasnost za njegovo prihvaćanje. Nastavkom
        pregledavanja stranice prihvaćate korištenje kolačića. Korisnik može
        samostalno regulirati primanje kolačića (omogućiti/onemogućiti).
        Korištenjem ove web stranice korisnik je u svakom trenu suglasan i
        upoznat s uvjetima korištenja, uključujući odredbe o obradi i zaštiti
        osobnih podataka i mogućnostima vezanih uz kolačiće. Ove tehnologije
        omogućuju nam pružanje personaliziranog iskustva, analizu korištenja web
        stranice (primjerice praćenje kliknute stranice ili elementa na njoj
        putem Google Analyticsa) i pružanje relevantnih oglasa trećih strana,
        uključujući Google AdSense.
      </p>

      <h4>Korištenje osobnih podataka</h4>
      <p>
        Osobne podatke koje prikupljamo koristimo kako bismo vam pružili usluge
        koje tražite, poboljšali našu web stranicu, analizirali upotrebu,
        prilagodili sadržaj i oglase, te vam pružili relevantne marketinške
        informacije. Vaše osobne podatke nećemo dijeliti s trećim stranama osim
        ako to nije nužno radi pružanja usluga ili ako to zahtijeva zakon.
      </p>

      <h4>Upiti za organizaciju medenog mjeseca</h4>
      <p>
        Kada pošaljete upit putem stranice za organizaciju medenog mjeseca,
        obrađujemo ime i prezime, adresu e-pošte, broj putnika, odabrani program
        te ostale podatke koje nam dobrovoljno navedete, poput telefonskog
        broja, okvirnog datuma, budžeta, željenih destinacija, polaznog
        aerodroma i poruke. Podatke koristimo isključivo kako bismo pregledali
        vaš zahtjev, kontaktirali vas i poduzeli radnje na vaš zahtjev prije
        mogućeg ugovaranja usluge planiranja putovanja. Pravna osnova obrade je
        poduzimanje radnji na zahtjev ispitanika prije sklapanja ugovora.
      </p>
      <p>
        Upit se šalje na našu službenu adresu e-pošte i privremeno prikazuje
        ovlaštenim administratorima. Nakon obrade administrator ga uklanja s
        nadzorne ploče, a kopiju u sustavu e-pošte čuvamo samo onoliko dugo
        koliko je potrebno za komunikaciju, mogući poslovni odnos i ispunjenje
        zakonskih obveza. Podatke iz upita ne koristimo za newsletter ili drugo
        izravno oglašavanje bez zasebne pravne osnove. Radi zaštite obrasca od
        zlouporabe privremeno obrađujemo IP adresu i vrijeme slanja za potrebe
        ograničenja prekomjernih pokušaja.
      </p>

      <h4>Google AdSense i Google Analytics</h4>
      <p>
        Naša web stranica koristi Google AdSense za prikazivanje oglasa. Google
        može koristiti kolačiće za prikupljanje informacija o vašoj posjeti
        našoj web stranici i drugim web lokacijama radi prikazivanja oglasa
        prilagođenih vašim interesima. Također koristimo Google Analytics za
        analizu korištenja web stranice, što nam pomaže razumjeti kako korisnici
        rukuju s našom web lokacijom i poboljšati njeno korisničko iskustvo.
      </p>

      <h4>Vaša prava</h4>
      <p>
        Imate pravo zatražiti pristup, ispravak, brisanje ili ograničenje obrade
        vaših osobnih podataka, pravo na prenosivost kada je primjenjivo te
        pravo podnijeti pritužbu Agenciji za zaštitu osobnih podataka. U roku od 30 dana od Vašeg zahtjeva po
        potrebi ažurirati Vaši podaci. Ukoliko zbog određenog razloga nije
        moguće ispoštovati Vaš zahtjev u roku od 30 dana, obavijestit ćemo Vas o
        tome. Ako želite ostvariti bilo koje od ovih prava ili imate bilo kakvih
        pitanja ili pritužbi u vezi s našim postupcima obrade podataka, molimo
        kontaktirajte nas putem hello@putujemstravem.com.
      </p>

      <h4>Izmjene ovih Pravila o privatnosti</h4>
      <p>
        Ova Pravila o privatnosti mogu se povremeno mijenjati radi ažuriranja
        ili prilagodbe zakonodavstvu. Sve promjene bit će objavljene na ovoj web
        stranici, stoga vas molimo da redovito provjeravate izmjene. Vaša
        upotreba naše web stranice nakon objave izmjena ovih Pravila o
        privatnosti predstavlja vašu suglasnost s tim promjenama.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
