import { Route, Routes } from "react-router-dom";
import AirplaneTickets from "./Pages/UserViewPages/AirplaneTickets/AirplaneTickets";
import UserViewLayout from "./components/user/templates/UserViewLayout";

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
