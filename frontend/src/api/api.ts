export const apiUrl: string = `${import.meta.env.VITE_DROPLET_IP}${
  import.meta.env.VITE_DROPLET_PORT
}/api/v1`;
export const token: string | null = localStorage.getItem("token");
