"use client";

import { FC, createContext, useState } from "react";
import { Article, Props } from "../common/types";

interface ArticleContextType {
  homepageArticlesContextData: Array<Article> | null;
  setHomepageArticlesContextData: React.Dispatch<
    React.SetStateAction<Array<Article> | null>
  >;
}

const ArticleContext = createContext<ArticleContextType>({
  homepageArticlesContextData: null,
  setHomepageArticlesContextData: () => {},
});

const ArticleProvider: FC<Props> = ({ children }) => {
  const [homepageArticlesContextData, setHomepageArticlesContextData] =
    useState<Array<Article> | null>(null);

  return (
    <ArticleContext.Provider
      value={{ homepageArticlesContextData, setHomepageArticlesContextData }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

const ArticleConsumer = ArticleContext.Consumer;

export { ArticleConsumer, ArticleContext, ArticleProvider };
