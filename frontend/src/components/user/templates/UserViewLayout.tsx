import { Outlet } from "react-router";
import Header from "../molecules/Header";
import Footer from "../molecules/Footer";

const UserViewLayout = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default UserViewLayout;
