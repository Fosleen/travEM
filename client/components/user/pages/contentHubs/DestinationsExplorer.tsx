"use client";

import { useState } from "react";
import HorizontalPostItemBig from "@/components/user/atoms/HorizontalPostItemBig";

type Country = {
  id: number;
  name: string;
  main_image_url: string;
  subtitle?: string;
  description?: string;
  flag_image_url?: string;
};

type ContinentGroup = {
  continent: { id: number; name: string };
  countries: Country[];
};

const DestinationsExplorer = ({ groups }: { groups: ContinentGroup[] }) => {
  const defaultGroup =
    groups.find(
      ({ continent }) => continent.name.trim().toLowerCase() === "europa"
    ) || groups[0];
  const [selectedId, setSelectedId] = useState(defaultGroup?.continent.id);

  if (!defaultGroup) return null;

  return (
    <>
      <nav
        className="content-hub__continent-nav"
        aria-label="Odabir kontinenta"
      >
        <span>Odaberi kontinent</span>
        <div className="content-hub__continent-nav-links">
          {groups.map(({ continent }) => {
            const isActive = continent.id === selectedId;
            return (
              <button
                key={continent.id}
                type="button"
                className={isActive ? "active" : ""}
                onClick={() => setSelectedId(continent.id)}
                aria-pressed={isActive}
              >
                {continent.name}
              </button>
            );
          })}
        </div>
      </nav>

      {groups.map(({ continent, countries }) => {
        const isActive = continent.id === selectedId;
        return (
          <section
            className={`content-hub__section content-hub__continent ${
              isActive ? "is-active" : ""
            }`}
            key={continent.id}
            hidden={!isActive}
          >
            <h2 className="content-hub__continent-title">
              <span className="bold-grey" aria-hidden="true">
                {continent.name.toUpperCase()}
              </span>
              <span className="bold-color" aria-hidden="true">
                {continent.name.toUpperCase()}
              </span>
              <span className="cursive-black">{continent.name}</span>
            </h2>
            <div className="content-hub__grid">
              {countries.map((country) => (
                <HorizontalPostItemBig
                  key={country.id}
                  thin
                  hasDate={false}
                  data={country}
                  type="country"
                />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
};

export default DestinationsExplorer;
