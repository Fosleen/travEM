import { FC, createContext, useState } from "react";
import { CountriesData, Props } from "../common/types";

interface CountryContextType {
  countriesByContinentContextData: Array<{
    id: number;
    data: Array<CountriesData>;
  }> | null;
  setCountriesByContinentContextData: React.Dispatch<
    React.SetStateAction<Array<{
      id: number;
      data: Array<CountriesData>;
    }> | null>
  >;
}

const CountryContext = createContext<CountryContextType>({
  countriesByContinentContextData: null,
  setCountriesByContinentContextData: () => {},
});

const CountryProvider: FC<Props> = ({ children }) => {
  const [countriesByContinentContextData, setCountriesByContinentContextData] =
    useState<Array<{
      id: number;
      data: Array<CountriesData>;
    }> | null>(null);

  return (
    <CountryContext.Provider
      value={{
        countriesByContinentContextData,
        setCountriesByContinentContextData,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

const CountryConsumer = CountryContext.Consumer;

export { CountryConsumer, CountryContext, CountryProvider };
