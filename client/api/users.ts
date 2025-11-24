//@ts-nocheck

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
      localStorage.setItem("jwt", data.token);

      const jwtToken = localStorage.getItem("jwt");
      const tokenParts = jwtToken?.split(".");
      const base64Url = tokenParts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const decodedPayload = JSON.parse(atob(base64));

      const exp_time = decodedPayload.exp;
      localStorage.setItem("jwtExpiration", exp_time);
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
