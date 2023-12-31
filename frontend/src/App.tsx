import { Route, Routes } from "react-router-dom";
import UserViewLayout from "./components/user/templates/UserViewLayout";
import Homepage from "./Pages/UserViewPages/Homepage/Homepage";
import About from "./Pages/UserViewPages/About/About";
import AirplaneTickets from "./Pages/UserViewPages/AirplaneTickets/AirplaneTickets";
import SearchResults from "./Pages/UserViewPages/SearchResults/SearchResults";
import TipsAndTricks from "./Pages/UserViewPages/TipsAndTricks/TipsAndTricks";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<UserViewLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/o-nama" element={<About />} />
          <Route path="/avio-karte" element={<AirplaneTickets />} />
          <Route path="/pretrazivanje" element={<SearchResults />} />
          <Route path="/tips-and-tricks" element={<TipsAndTricks />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
