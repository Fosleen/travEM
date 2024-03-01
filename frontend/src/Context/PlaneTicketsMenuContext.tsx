import { FC, createContext, useState } from "react";
import { PlaneTickets, Props } from "../common/types";

interface PlaneTicketsContextType {
  homepagePlaneTicketsContextData: Array<PlaneTickets> | null;
  setHomepagePlaneTicketsContextData: React.Dispatch<
    React.SetStateAction<Array<PlaneTickets> | null>
  >;
}

const PlaneTicketsContext = createContext<PlaneTicketsContextType>({
  homepagePlaneTicketsContextData: null,
  setHomepagePlaneTicketsContextData: () => {},
});

const PlaneTicketsProvider: FC<Props> = ({ children }) => {
  const [homepagePlaneTicketsContextData, setHomepagePlaneTicketsContextData] =
    useState<Array<PlaneTickets> | null>(null);

  return (
    <PlaneTicketsContext.Provider
      value={{
        homepagePlaneTicketsContextData,
        setHomepagePlaneTicketsContextData,
      }}
    >
      {children}
    </PlaneTicketsContext.Provider>
  );
};

const PlaneTicketsConsumer = PlaneTicketsContext.Consumer;

export { PlaneTicketsConsumer, PlaneTicketsContext, PlaneTicketsProvider };
