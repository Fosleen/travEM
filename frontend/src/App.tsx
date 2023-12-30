import { Route, Routes } from "react-router-dom";
import AirplaneTickets from "./Pages/UserViewPages/AirplaneTickets/AirplaneTickets";

function App() {
  return (
    <>
      <Routes>
        <Route path="/avio-karte" element={<AirplaneTickets />} />
        <Route path="/" element={<h1>Početna</h1>} />
      </Routes>
    </>
  );
}

export default App;
