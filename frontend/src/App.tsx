import { Route, Routes } from "react-router-dom";
import UserViewLayout from "./components/user/templates/UserViewLayout";
import Homepage from "./pages/UserViewPages/Homepage/Homepage";
import About from "./pages/UserViewPages/About/About";
import AirplaneTickets from "./pages/UserViewPages/AirplaneTickets/AirplaneTickets";
import SearchResults from "./pages/UserViewPages/SearchResults/SearchResults";
import TipsAndTricks from "./pages/UserViewPages/TipsAndTricks/TipsAndTricks";
import "./App.scss";
import DestinationCountry from "./pages/UserViewPages/DestinationCountry/DestinationCountry";
import Login from "./pages/AdminViewPages/Login/Login";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<UserViewLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/o-nama" element={<About />} />
          <Route path="/aviokarte" element={<AirplaneTickets />} />
          <Route path="/pretrazivanje" element={<SearchResults />} />
          <Route path="/savjeti/let-avionom" element={<TipsAndTricks />} />
          <Route path="/destinacija/:id" element={<DestinationCountry />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
