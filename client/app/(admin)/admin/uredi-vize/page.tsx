// @ts-nocheck
"use client";

import "./EditVisaInfo.scss";
import { getVisitedCountries } from "@/api/map";
import { useEffect, useState } from "react";
import { CountriesData } from "@/common/types";
import { notifySuccess } from "@/components/atoms/Toast/Toast";
import Swal from "sweetalert2";
import { addVisaInfo, checkIfInfoExists, patchVisaInfo } from "@/api/visaInfo";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Input from "@/components/atoms/Input";
import * as Yup from "yup";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import Button from "@/components/atoms/Button";
import Dropdown from "@/components/atoms/Dropdown";
import { useRouter } from "next/navigation";

const EditVisaInfo = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<Array<CountriesData>>([]);
  const [visaCountries, setVisaCountries] = useState([
    "Hrvatska",
    "Bosna i Hercegovina",
    "Srbija",
    "Slovenija",
    "Crna Gora",
  ]);
  const yesNoValues = [
    { id: 0, name: "Ne" },
    { id: 1, name: "Da" },
  ];
  const [checkedInfo, setCheckedInfo] = useState(null);

  const [selectedCountry1Id, setSelectedCountry1Id] = useState("");
  const [selectedCountry2Id, setSelectedCountry2Id] = useState("");

  const fetchData = async () => {
    try {
      const countriesData = await getVisitedCountries();
      const filteredAllCountries = countriesData.map(
        (el: { id: number; flag_image_url: string; name: string }) => ({
          id: el.id,
          url: el.flag_image_url, // because of this new array is needed (for image display in dropdown)
          name: el.name,
        })
      );

      // returns only 5 wanted countries (Croatia, BiH, Serbia, Montenegro, Slovenia) with their ID from the database
      const filteredVisaCountries = filteredAllCountries.filter((i) =>
        visaCountries.includes(i.name)
      );

      setCountries(filteredAllCountries);
      setVisaCountries(filteredVisaCountries);
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  const checkInfo = async () => {
    if (selectedCountry1Id !== "" && selectedCountry2Id !== "") {
      const info = await checkIfInfoExists(
        parseInt(selectedCountry1Id),
        parseInt(selectedCountry2Id)
      );
      setCheckedInfo(info); // to update formik data and know if method will be POST or PATCH
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCountry1Id !== "" && selectedCountry2Id !== "") {
      checkInfo();
    }
  }, [selectedCountry1Id, selectedCountry2Id]);

  const handleSave = async (values) => {
    console.log(values);

    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Uredit ćete ove informacije o vizama!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // decide whether to add or update data
        if (checkedInfo && checkedInfo.hasOwnProperty("id")) {
          await patchVisaInfo(
            checkedInfo.id,
            values.country_2.id,
            values.country_2.documentation,
            values.country_2.visa_needed,
            values.country_2.additional_info,
            values.country_1_id
          );
        } else {
          await addVisaInfo(
            values.country_2.id,
            values.country_2.documentation,
            values.country_2.visa_needed,
            values.country_2.additional_info,
            values.country_1_id
          );
        }

        router.push("/admin/sadrzaj");
        notifySuccess("Uspješno dodane informacije o vizi!");
      }
    });
  };

  const handleCancel = () => {
    router.push("/admin/sadrzaj");
  };

  return (
    <div className="edit-visa-info-container">
      <h2>Informacije o vizama</h2>

      {countries ? (
        <Formik
          initialValues={{
            country_1_id: selectedCountry1Id,
            country_2: {
              id: selectedCountry2Id,
              documentation: checkedInfo?.documentation
                ? checkedInfo?.documentation
                : "",
              visa_needed:
                checkedInfo?.visa_needed == true
                  ? 1
                  : checkedInfo?.visa_needed == false
                  ? 0
                  : "",
              additional_info: checkedInfo?.additional_info
                ? checkedInfo?.additional_info
                : "",
            },
          }}
          enableReinitialize={true} // dynamic changes based on dropdowns
          onSubmit={handleSave}
        >
          {({ values, setFieldValue }) => (
            <Form className="add-visa-info-form">
              <div className="add-visa-info-inputs">
                <AdvancedDropdown
                  filter
                  images
                  label="Država u koju se ulazi *"
                  hardcodedValue={"Odaberi državu..."}
                  options={countries}
                  value={values.country_1_id}
                  selectedValue={values.country_1_id}
                  onChange={(value) => {
                    setFieldValue("country_1_id", value.id);
                    setSelectedCountry1Id(value.id);
                  }}
                  isDisabled={false}
                />
                <AdvancedDropdown
                  images
                  label="Država iz koje se dolazi *"
                  hardcodedValue={"Odaberi državu..."}
                  options={visaCountries}
                  value={values.country_2.id}
                  selectedValue={values.country_2.id}
                  onChange={(value) => {
                    setFieldValue("country_2.id", value.id);
                    setSelectedCountry2Id(value.id);
                  }}
                  isDisabled={false}
                />
                {values.country_2.id && checkedInfo && (
                  <div className="add-visa-info-section">
                    <div className="add-visa-info-item">
                      <Field
                        name="country_2.documentation"
                        as={Input}
                        label="Putna isprava *"
                        placeholder="Unesi..."
                      />
                      <ErrorMessage
                        name="country_2.documentation"
                        component="div"
                      />
                    </div>
                    <div className="add-visa-info-item">
                      <Dropdown
                        label="Potrebna viza *"
                        hardcodedValue={"Odaberi naziv..."}
                        options={yesNoValues}
                        value={values.country_2.visa_needed}
                        onChange={(value) => {
                          setFieldValue("country_2.visa_needed", value);
                        }}
                        isDisabled={false}
                      />
                      <ErrorMessage name="country_1_id" component="div" />
                    </div>
                    <div className="add-visa-info-item">
                      <Field
                        name="country_2.additional_info"
                        as={Input}
                        label="Napomena"
                        placeholder="Unesi..."
                      />
                      <ErrorMessage
                        name="country_2.additional_info"
                        component="div"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="add-visa-info-buttons">
                <Button type="submit" adminPrimary>
                  spremi
                </Button>
                <Button type="button" white onClick={handleCancel}>
                  Odustani
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditVisaInfo;
