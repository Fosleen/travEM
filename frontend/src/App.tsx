import { Route, Routes } from "react-router-dom";
import UserViewLayout from "./components/user/templates/UserViewLayout";
import Homepage from "./Pages/UserViewPages/Homepage/Homepage";
import About from "./Pages/UserViewPages/About/About";
import AirplaneTickets from "./Pages/UserViewPages/AirplaneTickets/AirplaneTickets";
import SearchResults from "./Pages/UserViewPages/SearchResults/SearchResults";
import TipsAndTricks from "./Pages/UserViewPages/TipsAndTricks/TipsAndTricks";
import "./App.scss";
import DestinationCountry from "./Pages/UserViewPages/DestinationCountry/DestinationCountry";
import Login from "./Pages/AdminViewPages/Login/Login";
import Article from "./Pages/UserViewPages/Article/Article";
import DestinationPlace from "./Pages/UserViewPages/DestinationPlace";
import NotFound from "./Pages/UserViewPages/NotFound/NotFound";

import AdminViewLayout from "./components/admin/templates/AdminViewLayout";
import Continent from "./Pages/UserViewPages/Continent/Continent";
import EditHomepageMenu from "./Pages/AdminViewPages/EditHomepageMenu/EditHomepageMenu";
import EditHero from "./Pages/AdminViewPages/EditHero/EditHero";
import EditBanner from "./Pages/AdminViewPages/EditBanner/EditBanner";
import EditStats from "./Pages/AdminViewPages/EditStats/EditStats";
import AddArticle from "./Pages/AdminViewPages/AddArticle/AddArticle";
import PlacesList from "./Pages/AdminViewPages/PlacesList/PlacesList";
import CountriesList from "./Pages/AdminViewPages/CountriesList/CountriesList";
import ArticlesList from "./Pages/AdminViewPages/ArticlesList/ArticlesList";
import AddPlace from "./Pages/AdminViewPages/AddPlace/AddPlace";

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
          <Route path="/clanak/:id" element={<Article />} />
          <Route path="/nema-drzave" element={<NotFound />} />
          <Route path="/kontinent" element={<Continent />} />
          <Route
            path="/destinacija/:idDrzave"
            element={<DestinationCountry />}
          />
          <Route
            path="/destinacija/:idDrzave/:idGrada"
            element={<DestinationPlace />}
          />
        </Route>
        <Route path="/admin" element={<AdminViewLayout />}>
          <Route path="/admin/sadržaj" element={<EditHomepageMenu />} />
          <Route path="/admin/mjesta" element={<PlacesList />} />
          <Route path="/admin/mjesta/dodaj" element={<AddPlace />} />
          <Route path="/admin/države" element={<CountriesList />} />
          <Route path="/admin/članci" element={<ArticlesList />} />
          <Route path="/admin/članci/dodaj" element={<AddArticle />} />
          <Route path="/admin/uredi-hero" element={<EditHero />} />
          <Route path="/admin/uredi-banner" element={<EditBanner />} />
          <Route path="/admin/uredi-statistiku" element={<EditStats />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
