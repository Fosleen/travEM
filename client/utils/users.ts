import { notifyFailure, notifySuccess } from "../components/atoms/Toast/Toast";
import { apiUrl } from "./api";

export const loginUser = async (
  values: any,
  router: any,
  { setSubmitting, setUser }: any
) => {
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
      document.cookie = `jwt=${data.token}; path=/; max-age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict`;
      const decodedPayload = JSON.parse(atob(data.token.split(".")[1]));
      localStorage.setItem("jwtExpiration", decodedPayload.exp);
      if (setUser) {
        setUser({
          id: decodedPayload.id,
          username: decodedPayload.username,
        });
      }
      notifySuccess("Uspješna prijava!");
      router.push("/admin/sadrzaj");
    } else {
      notifyFailure("Neispravni podaci.");
    }
  } catch (error) {
    notifyFailure("Greška pri loginu.");
    console.error("Error during authentication", error);
  } finally {
    setSubmitting(false);
  }
};
