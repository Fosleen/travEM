// @ts-nocheck
"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
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

const getPhraseKey = (phraseItem: any) =>
  `${phraseItem.id || "phrase"}-${phraseItem.order_index}`;

const CountryLanguage: FC<CountryLanguageProps> = ({ countryId }) => {
  const [languageData, setLanguageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phraseFontSizes, setPhraseFontSizes] = useState<Record<string, number>>(
    {}
  );
  const [pronunciationFontSizes, setPronunciationFontSizes] = useState<
    Record<string, number>
  >({});

  const phraseRefs = useRef<Record<string, HTMLHeadingElement | null>>({});
  const pronunciationRefs = useRef<Record<string, HTMLParagraphElement | null>>(
    {}
  );

  const sortedPhrases = useMemo(() => {
    if (!languageData?.phrases) return [];

    return [...languageData.phrases]
      .filter((phraseItem) => PHRASE_LABELS[phraseItem.order_index])
      .sort((a, b) => a.order_index - b.order_index);
  }, [languageData]);

  const getMaxPhraseFontSize = () => {
    if (typeof window === "undefined") return 25;

    if (window.innerWidth >= 1300) return 31;
    if (window.innerWidth >= 1024) return 29;
    if (window.innerWidth >= 580) return 28;

    return 25;
  };

  const getMaxPronunciationFontSize = () => {
    if (typeof window === "undefined") return 15;

    if (window.innerWidth >= 1024) return 16;

    return 15;
  };

  const fitTextElement = (
    element: HTMLElement | null,
    maxFontSize: number,
    minFontSize: number,
    widthOffset = 8
  ) => {
    if (!element || !element.parentElement) return maxFontSize;

    const availableWidth = element.parentElement.clientWidth - widthOffset;
    let fontSize = maxFontSize;

    element.style.fontSize = `${fontSize}px`;

    while (element.scrollWidth > availableWidth && fontSize > minFontSize) {
      fontSize -= 0.5;
      element.style.fontSize = `${fontSize}px`;
    }

    return fontSize;
  };

  const fitCardText = () => {
    if (!sortedPhrases.length) return;

    const nextPhraseFontSizes: Record<string, number> = {};
    const nextPronunciationFontSizes: Record<string, number> = {};

    const maxPhraseFontSize = getMaxPhraseFontSize();
    const maxPronunciationFontSize = getMaxPronunciationFontSize();

    sortedPhrases.forEach((phraseItem) => {
      const key = getPhraseKey(phraseItem);

      nextPhraseFontSizes[key] = fitTextElement(
        phraseRefs.current[key],
        maxPhraseFontSize,
        12,
        8
      );

      nextPronunciationFontSizes[key] = fitTextElement(
        pronunciationRefs.current[key],
        maxPronunciationFontSize,
        11,
        8
      );
    });

    setPhraseFontSizes(nextPhraseFontSizes);
    setPronunciationFontSizes(nextPronunciationFontSizes);
  };

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

  useEffect(() => {
    if (!sortedPhrases.length) return;

    const timeout = setTimeout(() => {
      fitCardText();
    }, 0);

    const handleResize = () => {
      fitCardText();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [sortedPhrases]);

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
          {sortedPhrases.map((phraseItem) => {
            const phraseKey = getPhraseKey(phraseItem);

            return (
              <article
                className="country-language-card"
                key={phraseKey}
                tabIndex={0}
              >
                <div className="country-language-card-number">
                  {phraseItem.order_index}
                </div>

                <div className="country-language-card-body">
                  <p className="country-language-card-label">
                    {PHRASE_LABELS[phraseItem.order_index]}
                  </p>

                  <div className="country-language-card-phrase-wrap">
                    <h3
                      ref={(element) => {
                        phraseRefs.current[phraseKey] = element;
                      }}
                      style={
                        phraseFontSizes[phraseKey]
                          ? { fontSize: `${phraseFontSizes[phraseKey]}px` }
                          : undefined
                      }
                      title={phraseItem.phrase}
                    >
                      {phraseItem.phrase}
                    </h3>
                  </div>

                  {phraseItem.pronunciation && (
                    <div className="country-language-card-pronunciation-wrap">
                      <p
                        ref={(element) => {
                          pronunciationRefs.current[phraseKey] = element;
                        }}
                        className="country-language-card-pronunciation"
                        style={
                          pronunciationFontSizes[phraseKey]
                            ? {
                                fontSize: `${pronunciationFontSizes[phraseKey]}px`,
                              }
                            : undefined
                        }
                        title={phraseItem.pronunciation}
                      >
                        [{phraseItem.pronunciation}]
                      </p>
                    </div>
                  )}
                </div>

                <div className="country-language-card-line" />
              </article>
            );
          })}
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