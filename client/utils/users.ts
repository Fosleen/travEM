import { notifyFailure, notifySuccess } from "../components/atoms/Toast/Toast";
import { apiUrl } from "./api";

export type ManagedUser = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_admin: number;
};

export type NewAuthor = Pick<ManagedUser, "username" | "first_name" | "last_name"> & { password: string };

async function usersRequest(method: "GET" | "POST", body?: NewAuthor) {
  const response = await fetch(`${apiUrl}/users`, {
    method,
    cache: "no-store",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Korisnike nije moguće dohvatiti ili spremiti.");
  return data;
}

export const getUsers = async (): Promise<ManagedUser[]> => usersRequest("GET");
export const addAuthor = async (values: NewAuthor): Promise<ManagedUser> => (await usersRequest("POST", values)).user;

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
      router.replace(Number(decodedPayload.is_admin) === 1 ? "/admin/deal-finder" : "/admin/clanci");
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
