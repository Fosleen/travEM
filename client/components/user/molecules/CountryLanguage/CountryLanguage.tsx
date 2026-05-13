// @ts-nocheck
"use client";

import { FC, useEffect, useMemo, useState } from "react";
import "./CountryLanguage.scss";
import { getCountryLanguage } from "../../../../utils/countryLanguage";

interface CountryLanguageProps {
  countryId: number;
}

const PHRASE_LABELS: Record<number, string> = {
  1: "Bok / pozdrav",
  2: "Hvala",
  3: "Molim",
  4: "Oprostite",
  5: "Da",
  6: "Ne",
};

const CountryLanguage: FC<CountryLanguageProps> = ({ countryId }) => {
  const [languageData, setLanguageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const sortedPhrases = useMemo(() => {
    if (!languageData?.phrases) return [];

    return [...languageData.phrases]
      .filter((phraseItem) => PHRASE_LABELS[phraseItem.order_index])
      .sort((a, b) => a.order_index - b.order_index);
  }, [languageData]);

  const fetchCountryLanguage = async () => {
    try {
      setIsLoading(true);

      const response = await getCountryLanguage(countryId);

      if (!response || !response?.phrases?.length) {
        setLanguageData(null);
        return;
      }

      setLanguageData(response);
    } catch (error) {
      console.error("Error occured while fetching country language:", error);
      setLanguageData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!countryId) return;

    fetchCountryLanguage();
  }, [countryId]);

  if (isLoading || !languageData || sortedPhrases.length === 0) {
    return null;
  }

  return (
    <section className="country-language-container">
      <div className="country-language-intro">
        <div className="country-language-kicker">Jezik na putu</div>

        <div className="country-language-text">
          <h2>{languageData.language_name} za putnike</h2>

          <p>
            6 osnovnih riječi koje će ti pomoći u svakodnevnim situacijama.
          </p>
        </div>

        <div className="country-language-side-note">
          <span className="country-language-side-note-dot" />
          <p>Lokalci cijene svaki trud, čak i kad znaš samo par riječi!</p>
        </div>
      </div>

      <div className="country-language-content">
        <div className="country-language-phrases">
          {sortedPhrases.map((phraseItem) => (
            <article
              className="country-language-card"
              key={phraseItem.id || phraseItem.order_index}
              tabIndex={0}
            >
              <div className="country-language-card-number">
                {phraseItem.order_index}
              </div>

              <div className="country-language-card-body">
                <p className="country-language-card-label">
                  {PHRASE_LABELS[phraseItem.order_index]}
                </p>

                <h3>{phraseItem.phrase}</h3>

                {phraseItem.pronunciation && (
                  <p className="country-language-card-pronunciation">
                    [{phraseItem.pronunciation}]
                  </p>
                )}
              </div>

              <div className="country-language-card-line" />
            </article>
          ))}
        </div>

        <div className="country-language-note">
          Izgovor je napisan onako kako se otprilike čita, ne mora biti
          savršeno!
        </div>
      </div>
    </section>
  );
};

export default CountryLanguage;