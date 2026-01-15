/*
"use client";

import "./loading.scss";
import { useEffect, useState } from "react";

const funFacts = [
  "Ema je vjerojatno jedina osoba koja može napraviti savršenu fotku na +40°C ili -40°C.",
  "Istražili smo skupa preko 20 država i još nismo izgubili niti jedan kofer 😁",
  "Uvijek isprobavamo lokalnu hranu, čak i ako nam izgleda sumnjivo (i većinom preživimo).",
  "2022. smo u 40 dana obišli 7 država i 9 gradova.",
  "2024. smo otključali dva nova kontinenta: Afriku 🇿🇦 i Sj. Ameriku",
  "Proveli smo 4 i pol mjeseca živeći i radeći u SAD-u - preživjeli smo sve izazove, uključujući i američku hranu.",
  "Češka je dom piva, s više pivovara po glavi stanovnika nego bilo koja druga zemlja.",
  "Cipar ima najstarije poznate masline na svijetu, stare više od 4.000 godina.",
  "Eiffelov toranj je izvorno trebao biti privremena struktura za Svjetsku izložbu 1889.",
  "Hrvatska ima više od 1.200 otoka, a mnogi su nenaseljeni.",
  "Rim je dom najviše UNESCO-vih lokaliteta u jednoj zemlji u svijetu.",
  "Italija je domovine pizze, ali i preko 400 vrsti tjestenine.",
  "Venecija se sastoji od 118 malih otoka povezanih kanalima i mostovima.",
  "Malta ima više nego 300 sunčanih dana godišnje.",
  "Nizozemska ima više bicikala nego stanovnika.",
  "La Tomatina u Buñolu (Španjolska) je najveći svjetski festival bacanja rajčica.",
  "Novi Sad je dom EXIT festivala, jednog od najvećih glazbenih festivala u Europi.",
  "Stonehenge je misteriozni prapovijesni spomenik izgrađen prije više od 4.000 godina.",
  "Istanbul je jedini grad na svijetu koji se prostire na dva kontinenta: Europu i Aziju.",
  "SAD ima 50 saveznih država i preko 300 nacionalnih parkova.",
  "Godišnja ulaznica za 300 nacionalnih parkova SAD-a košta $85 za automobil pun ljudi.",
  "Kip Slobode (New York) je dar Francuske SAD-u i simbol slobode.",
  "Los Angeles ima najveću koncentraciju etničkih kuhinja u SAD-u.",
  "Golden Gate Bridge je jedan od najfotografiranijih mostova na svijetu.",
  "Grčka ima više od 6.000 otoka, od kojih je 227 naseljeno.",
  "Beč je kulturni centar s jednim od najvećih kompozitora klasične glazbe na svijetu: Beethoven, Mozart i Strauss.",
  "Bosnu i Hercegovinu krasi više od 200 vodopada.",
  "Budimpešta je poznata po termalnim kupalištima koja datiraju još iz rimskog i osmanskog razdoblja.",
  "U Njemačkoj danas živi preko 2,7 milijuna ljudi koji potječu s prostora bivše Jugoslavije.",
  "Na svim današnjim južnoafričkim novčanicama nalazi se lik Nelsona Mandele, prvog demokratski izabranog predsjednika zemlje.",
  "Na poleđini južnoafričkih novčanica prikazani su članovi Velikih 5: slon, nosorog, lav, leopard i bivol.",
  "Južna Afrika je jedno od najboljih mjesta na svijetu gdje možete vidjeti Big 5 (Velikih 5) u njihovom prirodnom staništu.",
  "U Bukureštu se nalazi Palača parlamenta, druga najveća administrativna građevina na svijetu (nakon Pentagona) i jedna od najtežih zgrada na svijetu. Teža je od 4 MILIJARDE kilograma.",
  "Kad smo u velikim gradovima, ustajemo u zoru da istražimo ulice dok još nema nikoga. Grad je tada potpuno naš.",
  "Dok smo se vozili u Južnoj Africi, iza jednog zavoja naišli smo na noja s mladuncima. Nismo mogli vjerovati svojim očima.",
  "U Južnoj Africi smo kušali egzotične delicije: antilopu i noja - jer volimo iskušavati lokalne okuse.",
  "U Veneciji, u cik zore, hodali smo sami prema centru grada, a jedina osoba koju smo sretali bila je Srpkinja koja tamo radi.",
  "Bilo gdje da odemo - Južna Afrika, SAD, Europa - uvijek uspijevamo naići na nekoga tko priča naš jezik.",
  "Ema ima nevjerojatan talent za fotografiju, a Matija obožava snimati YouTube videa - zajedno bilježimo svijet kroz fotke i videe.",
  "Najbolje modne kombinacije za putovanja obično su improvizirane, praktične, ali i dovoljno fotogenične za Instagram story. (Ema)",
  "Nije važno gdje putujemo - bitno je da smo zajedno, jer svaka destinacija postaje posebna kad smo skupa.",
  "Svaki grad ima svoju malu “skrivenu priču” koju pronađemo - tajna ulica, lokalni kafić ili neobična dogodovština.",
];

export default function Loading() {
  const TIP_INTERVAL = 4000;
  const FIRST_TIP_DELAY = 5000;

  const [currentTipIndex, setCurrentTipIndex] = useState<number | null>(null);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setCurrentTipIndex(0);
    }, FIRST_TIP_DELAY);

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => {
        if (prev === null) return null;
        return (prev + 1) % funFacts.length;
      });
    }, TIP_INTERVAL);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <div className="loading-spinner-inner"></div>
        </div>

        <h2>Učitavanje...</h2>
        <p>Molimo pričekajte</p>

        {currentTipIndex !== null && (
          <div className="loading-tip">
            <span className="tip-icon">💡</span>
            <p>{funFacts[currentTipIndex]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
*/

"use client";

import "./loading.scss";
import { useEffect, useMemo, useState } from "react";

const funFacts = [
  "Ema je vjerojatno jedina osoba koja može napraviti savršenu fotku na +40°C ili -40°C.",
  "Istražili smo skupa preko 20 država i još nismo izgubili niti jedan kofer 😁",
  "Uvijek isprobavamo lokalnu hranu, čak i ako nam izgleda sumnjivo (i većinom preživimo).",
  "2022. smo u 40 dana obišli 7 država i 9 gradova.",
  '2024. smo "otključali" dva nova kontinenta: Afriku 🇿🇦 i Sj. Ameriku',
  "Proveli smo 4 i pol mjeseca živeći i radeći u SAD-u - preživjeli smo sve izazove, uključujući i američku hranu.",
  "Češka je dom piva, s više pivovara po glavi stanovnika nego bilo koja druga zemlja.",
  "Cipar ima najstarije poznate masline na svijetu, stare više od 4.000 godina.",
  "Eiffelov toranj je izvorno trebao biti privremena struktura za Svjetsku izložbu 1889.",
  "Hrvatska ima više od 1.200 otoka, a mnogi su nenaseljeni.",
  "Rim je dom najviše UNESCO-vih lokaliteta u jednoj zemlji u svijetu.",
  "Italija je domovine pizze, ali i preko 400 vrsti tjestenine.",
  "Venecija se sastoji od 118 malih otoka povezanih kanalima i mostovima.",
  "Malta ima više nego 300 sunčanih dana godišnje.",
  "Nizozemska ima više bicikala nego stanovnika.",
  "La Tomatina u Buñolu (Španjolska) je najveći svjetski festival bacanja rajčica.",
  "Novi Sad je dom EXIT festivala, jednog od najvećih glazbenih festivala u Europi.",
  "Stonehenge je misteriozni prapovijesni spomenik izgrađen prije više od 4.000 godina.",
  "Istanbul je jedini grad na svijetu koji se prostire na dva kontinenta: Europu i Aziju.",
  "SAD ima 50 saveznih država i preko 300 nacionalnih parkova.",
  "Godišnja ulaznica za 300 nacionalnih parkova SAD-a košta $85 za automobil pun ljudi.",
  "Kip Slobode (New York) je dar Francuske SAD-u i simbol slobode.",
  "Los Angeles ima najveću koncentraciju etničkih kuhinja u SAD-u.",
  "Golden Gate Bridge je jedan od najfotografiranijih mostova na svijetu.",
  "Grčka ima više od 6.000 otoka, od kojih je 227 naseljeno.",
  "Beč je kulturni centar s jednim od najvećih kompozitora klasične glazbe na svijetu: Beethoven, Mozart i Strauss.",
  "Bosnu i Hercegovinu krasi više od 200 vodopada.",
  "Budimpešta je poznata po termalnim kupalištima koja datiraju još iz rimskog i osmanskog razdoblja.",
  "U Njemačkoj danas živi preko 2,7 milijuna ljudi koji potječu s prostora bivše Jugoslavije.",
  "Na svim današnjim južnoafričkim novčanicama nalazi se lik Nelsona Mandele, prvog demokratski izabranog predsjednika zemlje.",
  "Na poleđini južnoafričkih novčanica prikazani su članovi Velikih 5: slon, nosorog, lav, leopard i bivol.",
  "Južna Afrika je jedno od najboljih mjesta na svijetu gdje možete vidjeti Big 5 (Velikih 5) u njihovom prirodnom staništu.",
  "U Bukureštu se nalazi Palača parlamenta, druga najveća administrativna građevina na svijetu (nakon Pentagona) i jedna od najtežih zgrada na svijetu. Teža je od 4 MILIJARDE kilograma.",
  "Kad smo u velikim gradovima, ustajemo u zoru da istražimo ulice dok još nema nikoga. Grad je tada potpuno naš.",
  "Dok smo se vozili u Južnoj Africi, iza jednog zavoja naišli smo na noja s mladuncima. Nismo mogli vjerovati svojim očima.",
  "U Južnoj Africi smo kušali egzotične delicije: antilopu i noja - jer volimo iskušavati lokalne okuse.",
  "U Veneciji, u cik zore, hodali smo sami prema centru grada, a jedina osoba koju smo sretali bila je Srpkinja koja tamo radi.",
  "Bilo gdje da odemo - Južna Afrika, SAD, Europa - uvijek uspijevamo naići na nekoga tko priča naš jezik.",
  "Ema ima nevjerojatan talent za fotografiju, a Matija obožava snimati YouTube videa - zajedno bilježimo svijet kroz fotke i videe.",
  "Najbolje modne kombinacije za putovanja obično su improvizirane, praktične, ali i dovoljno fotogenične za Instagram story. (Ema)",
  "Nije važno gdje putujemo - bitno je da smo zajedno, jer svaka destinacija postaje posebna kad smo skupa.",
  "Svaki grad ima svoju malu “skrivenu priču” koju pronađemo - tajna ulica, lokalni kafić ili neobična dogodovština.",
];

// Fisher–Yates shuffle (stabilno i ravnomjerno)
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Loading() {
  const TIP_INTERVAL = 4000;     //4 sekunde
  const FIRST_TIP_DELAY = 1200;  // ranije nego 5000

  // jednom po mountu napravimo random redoslijed
  const shuffledFacts = useMemo(() => shuffleArray(funFacts), []);

  // počni od null da se ne vidi odmah (ali brzo nakon delay-a)
  const [currentTipIndex, setCurrentTipIndex] = useState<number | null>(null);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setCurrentTipIndex(0);
    }, FIRST_TIP_DELAY);

    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => {
        if (prev === null) return null;
        return (prev + 1) % shuffledFacts.length;
      });
    }, TIP_INTERVAL);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [shuffledFacts.length]);

  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
          <div className="loading-spinner-inner"></div>
        </div>

        <h2>Učitavanje...</h2>
        <p>Molimo pričekajte</p>

        {currentTipIndex !== null && (
          <div className="loading-tip">
            <span className="tip-icon">💡</span>
            <p>{shuffledFacts[currentTipIndex]}</p>
          </div>
        )}
      </div>
    </div>
  );
}
