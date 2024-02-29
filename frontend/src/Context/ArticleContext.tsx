import { FC, ReactNode, createContext, useState } from "react";
import { Article } from "../common/types";

interface ArticleContextType {
  homepageArticles: Array<Article> | null;
  setHomepageArticles: React.Dispatch<
    React.SetStateAction<Array<Article> | null>
  >;
}

interface Props {
  children: ReactNode;
}

const ArticleContext = createContext<ArticleContextType>({
  homepageArticles: null,
  setHomepageArticles: () => {},
});

const ArticleProvider: FC<Props> = ({ children }) => {
  const [homepageArticles, setHomepageArticles] =
    useState<Array<Article> | null>(null);

  return (
    <ArticleContext.Provider value={{ homepageArticles, setHomepageArticles }}>
      {children}
    </ArticleContext.Provider>
  );
};

const ArticleConsumer = ArticleContext.Consumer;

export { ArticleConsumer, ArticleContext, ArticleProvider };
