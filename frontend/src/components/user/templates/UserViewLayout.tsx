import { Outlet } from "react-router";
import Header from "../molecules/Header";

const UserViewLayout = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <Outlet />
    </div>
  );
};

export default UserViewLayout;
