export const apiUrl: string = `http://localhost:${
  import.meta.env.VITE_PORT
}/api/v1`;
export const token: string | null = localStorage.getItem("token");
