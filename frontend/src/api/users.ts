import { notifyFailure, notifySuccess } from "../components/atoms/Toast/Toast";
import { apiUrl } from "./api";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignoreS
// eslint-disable-next-line

export const loginUser = async (values, navigate, { setSubmitting }) => {
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
      localStorage.setItem("jwt", data.token);
      notifySuccess("Uspješna prijava!");
      navigate("/admin/sadržaj");
    } else {
      notifyFailure("Neispravni podaci.");
      console.log("Authentication failed");
    }
  } catch (error) {
    notifyFailure("Greška pri loginu.");
    console.error("Error during authentication", error);
  } finally {
    setSubmitting(false);
  }
};
