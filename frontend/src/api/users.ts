import { notifySuccess } from "../components/atoms/Toast/Toast";
import { apiUrl } from "./api";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignoreS
// eslint-disable-next-line

export const loginUser = async (values, { setSubmitting }) => {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
      credentials: "include",
    });

    const data = await response.json();

    if (data.success) {
      console.log("Authentication succeeded");
      //console.log("Podaci su", data);
      localStorage.setItem("jwt", data.token);
      // sessionStorage.setItem("first_name",data.first_name)
      // sessionStorage.setItem("last_name",data.first_name)

      notifySuccess("Uspjesna prijava!");
    } else {
      console.log("Authentication failed");
    }
  } catch (error) {
    console.error("Error during authentication", error);
  } finally {
    setSubmitting(false);
  }
};
