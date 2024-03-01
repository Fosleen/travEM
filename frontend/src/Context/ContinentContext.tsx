import { FC, createContext, useState } from "react";
import { ContinentsData, Props } from "../common/types";

interface ContinentContextType {
  continentsContextData: Array<ContinentsData> | null;
  setContinentsContextData: React.Dispatch<
    React.SetStateAction<Array<ContinentsData> | null>
  >;
}

const ContinentContext = createContext<ContinentContextType>({
  continentsContextData: null,
  setContinentsContextData: () => {},
});

const ContinentProvider: FC<Props> = ({ children }) => {
  const [continentsContextData, setContinentsContextData] =
    useState<Array<ContinentsData> | null>(null);

  return (
    <ContinentContext.Provider
      value={{ continentsContextData, setContinentsContextData }}
    >
      {children}
    </ContinentContext.Provider>
  );
};

const ContinentConsumer = ContinentContext.Consumer;

export { ContinentConsumer, ContinentContext, ContinentProvider };
