import * as Yup from "yup";

export const bestTimeMonths = [
  { month_key: "jan", label: "Siječanj" },
  { month_key: "feb", label: "Veljača" },
  { month_key: "mar", label: "Ožujak" },
  { month_key: "apr", label: "Travanj" },
  { month_key: "may", label: "Svibanj" },
  { month_key: "jun", label: "Lipanj" },
  { month_key: "jul", label: "Srpanj" },
  { month_key: "aug", label: "Kolovoz" },
  { month_key: "sep", label: "Rujan" },
  { month_key: "oct", label: "Listopad" },
  { month_key: "nov", label: "Studeni" },
  { month_key: "dec", label: "Prosinac" },
];

export const getDefaultBestTimeMonths = () =>
  bestTimeMonths.map((month) => ({
    month_key: month.month_key,
    avg_temp_c: "",
    avg_rain_mm: "",
  }));

export const normalizeNumberForInput = (value: unknown) => {
  if (value === null || value === undefined) return "";
  return String(value).replace(".", ",");
};

export const numberValidation = Yup.string()
  .required("Obavezno polje!")
  .test("is-valid-number", "Vrijednost mora biti validan broj!", (value) => {
    if (value === undefined || value === null || value === "") return false;
    return !Number.isNaN(Number(value.toString().replace(",", ".")));
  });
