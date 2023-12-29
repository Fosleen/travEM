import { Outlet } from "react-router";
import Header from "../molecules/Header";

const UserViewLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default UserViewLayout;
