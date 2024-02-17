// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, useEffect, useState } from "react";
import "./FeaturedPlaces.scss";
import { PlacesData } from "../../../../common/types";
import {
  addPlaceAboveMap,
  addPlaceOnMap,
  getPlaces,
  getPlacesWithImage,
  removePlaceAboveMap,
  removePlaceOnMap,
} from "../../../../api/places";
import { Trash } from "@phosphor-icons/react";
import Button from "../../../atoms/Button";
import AdvancedDropdown from "../../atoms/AdvancedDropdown";
import { FieldArray, FieldArrayRenderProps, Form, Formik } from "formik";
import { getAboveMapPlaces, getOnMapPlaces } from "../../../../api/map";

const FeaturedPlaces: FC<{ isOnMapSelected: boolean }> = ({
  isOnMapSelected,
}) => {
  const [onMapPlaces, setOnMapPlaces] = useState<Array<PlacesData>>([]);
  const [aboveMapPlaces, setAboveMapPlaces] = useState<Array<PlacesData>>([]);

  const [allPlaces, setAllPlaces] = useState<Array<PlacesData>>([]);
  const [placesWithImage, setPlacesWithImage] = useState([]);

  const fetchData = async () => {
    const _allPlaces = await getPlaces(1, 1000);
    const _placesWithImage = await getPlacesWithImage();
    const _onMapPlaces = await getOnMapPlaces();
    const _aboveMapPlaces = await getAboveMapPlaces();

    setAllPlaces(_allPlaces.data);
    setPlacesWithImage(_placesWithImage);
    setOnMapPlaces(_onMapPlaces);
    setAboveMapPlaces(_aboveMapPlaces);
  };

  const handleAdd = (
    arrayHelpers: FieldArrayRenderProps | { id: number; name: string }[]
  ) => {
    arrayHelpers.push({
      id: 0,
      name: "",
    });
  };

  const handleDelete = (arrayHelpers: FieldArrayRenderProps, index: number) => {
    arrayHelpers.remove(index);
  };

  const handleSave = async (values: {
    favorite: number[];
    featured: number[];
  }) => {
    let addedValues;
    let removedValues;

    if (isOnMapSelected) {
      // update places on map
      addedValues = values.favorite.filter(
        (item) => !onMapPlaces.some((place) => place.id === item)
      );
      removedValues = onMapPlaces.filter(
        (item) => !values.favorite.includes(item.id)
      );

      addedValues.map(async (el: number) => {
        await addPlaceOnMap(el);
      });
      removedValues.map(async (el) => {
        await removePlaceOnMap(el.id);
      });
    } else {
      // update places above map
      addedValues = values.featured.filter(
        (item) => !aboveMapPlaces.some((place) => place.id === item)
      );
      removedValues = aboveMapPlaces.filter(
        (item) => !values.featured.includes(item.id)
      );

      addedValues.map(async (el: number) => {
        await addPlaceAboveMap(el);
      });
      removedValues.map(async (el) => {
        await removePlaceAboveMap(el.id);
      });
    }

    addedValues = [];
    removedValues = [];
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {allPlaces && onMapPlaces && aboveMapPlaces && (
        <div className="featured-places-container">
          <Formik
            initialValues={{
              favorite: onMapPlaces,
              featured: aboveMapPlaces,
            }}
            onSubmit={handleSave}
            enableReinitialize={true}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <FieldArray
                  name={isOnMapSelected ? "favorite" : "featured"} // connect to formik field values to add/remove array items
                  render={(arrayHelpers) => {
                    const favorite = values.favorite;
                    const featured = values.featured;

                    return (
                      <div className="featured-places-content">
                        <div className="featured-places-header">
                          <h3>
                            {isOnMapSelected
                              ? "Istaknuta mjesta na karti"
                              : "Istaknuto iznad karte (max. 6, dopušteno samo mjestima s ikonom)"}
                          </h3>
                          {!isOnMapSelected && featured.length < 6 && (
                            <Button
                              circle
                              onClick={() => {
                                handleAdd(arrayHelpers);
                              }}
                            >
                              +
                            </Button>
                          )}
                          {isOnMapSelected && (
                            <Button
                              circle
                              onClick={() => {
                                handleAdd(arrayHelpers);
                              }}
                            >
                              +
                            </Button>
                          )}
                        </div>
                        <div
                          className={`favorite-places-dropdowns-container ${
                            !isOnMapSelected && "hidden"
                          }`}
                        >
                          {favorite.map((_el, index) => (
                            <div
                              className="featured-places-dropdown"
                              key={index}
                            >
                              <AdvancedDropdown
                                filter
                                hardcodedValue={"Odaberi mjesto..."}
                                options={allPlaces}
                                value={favorite[index]}
                                selectedValue={favorite[index]}
                                defaultValue={favorite[index]}
                                onChange={(value) => {
                                  setFieldValue(`favorite.${index}`, value.id);
                                }}
                                isDisabled={false}
                              />
                              <div
                                onClick={() => {
                                  handleDelete(arrayHelpers, index);
                                }}
                              >
                                <Trash color="#AC2B2B" size={32} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div
                          className={`favorite-places-dropdowns-container ${
                            isOnMapSelected && "hidden"
                          }`}
                        >
                          {featured.map((_el, index) => (
                            <div
                              className="featured-places-dropdown"
                              key={index}
                            >
                              <AdvancedDropdown
                                filter
                                hardcodedValue={"Odaberi mjesto..."}
                                options={placesWithImage}
                                value={featured[index]}
                                selectedValue={featured[index]}
                                defaultValue={featured[index]}
                                onChange={(value) => {
                                  setFieldValue(`featured.${index}`, value.id);
                                }}
                                isDisabled={false}
                              />
                              <div
                                onClick={() => {
                                  handleDelete(arrayHelpers, index);
                                }}
                              >
                                <Trash color="#AC2B2B" size={32} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }}
                />

                <div className="featured-places-buttons">
                  <Button type="submit" adminPrimary>
                    spremi
                  </Button>
                  <Button type="button" white onClick={() => {}}>
                    Odustani
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </>
  );
};

export default FeaturedPlaces;
