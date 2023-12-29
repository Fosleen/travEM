import { Route, Routes } from "react-router";
import Header from "./components/user/molecules/Header";
import UserViewLayout from "./components/user/templates/UserViewLayout";
import Homepage from "./pages/Homepage/Homepage";
import About from "./pages/About/About";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserViewLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/o-nama" element={<About />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
