//@ts-nocheck

import { Route, Routes, useNavigate } from "react-router-dom";
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
import EditVisaInfo from "./Pages/AdminViewPages/EditVisaInfo/EditVisaInfo";
import AddCountry from "./Pages/AdminViewPages/AddCountry/AddCountry";
import EditMap from "./Pages/AdminViewPages/EditMap/EditMap";
import EditPlace from "./Pages/AdminViewPages/EditPlace/EditPlace";
import EditTopArticles from "./Pages/AdminViewPages/EditTopArticles/EditTopArticles";
import EditFavoriteArticles from "./Pages/AdminViewPages/EditFavoriteArticles/EditFavoriteArticles";
import EditFooter from "./Pages/AdminViewPages/EditFooter/EditFooter";
import EditCountry from "./Pages/AdminViewPages/EditCountry/EditCountry";
import EditArticle from "./Pages/AdminViewPages/EditArticle/EditArticle";
import Contact from "./Pages/UserViewPages/Contact/Contact";
import ProtectedRoute from "./components/atoms/ProtectedRoute";
import { useEffect } from "react";
import PrivacyPolicy from "./Pages/UserViewPages/PrivacyPolicy/PrivacyPolicy";
import CookieConsent from "./components/atoms/CookieConsent/CookieConsent";
import { Helmet } from "react-helmet";
import Subsrcibers from "./Pages/AdminViewPages/Subscribers/Subscribers";
import TermsAndConditions from "./Pages/UserViewPages/TermsAndConditions/TermsAndConditions";
import PopUp from "./components/user/molecules/PopUp";

function App() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("jwt");

  function isTokenExpired(token) {
    if (!token) {
      return true;
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const expirationTime = decodedToken.exp * 1000;
    return Date.now() >= expirationTime;
  }

  useEffect(() => {
    if (isLoggedIn && isTokenExpired(isLoggedIn)) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <>
      <Helmet>
        <title>putujEM s travEM</title>
        <meta
          name="keywords"
          content="putujem s travem, putujemstravem, travem, putujem travem, travem putovanja, putovanja, putovanja iz hrvatske, travel blog, studentska putovanja, budget putovanja, jeftina putovanja, putovanja po europi, hrvatska putovanje, croatian travel blog, travel bloggers, croatian blog, hrvatska blog, studentska putovanja blog, jeftina studentska putovanja, travem youtube, matija dokmanović, ema pavrlišak, putovanje travem, balkanska jeftina putovanja, hrvatska jeftina putovanja, putovanje iz hrvatske, kako organizirati putovanje, savjeti za putovanja"
        />
      </Helmet>
      <PopUp />
      <CookieConsent />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<UserViewLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/o-nama" element={<About />} />
          <Route path="/aviokarte/:name" element={<AirplaneTickets />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/pravila-o-privatnosti" element={<PrivacyPolicy />} />
          <Route path="/uvjeti-koristenja" element={<TermsAndConditions />} />
          <Route path="/pretrazivanje" element={<SearchResults />} />
          <Route path="/savjeti/:tip" element={<TipsAndTricks />} />
          <Route path="/clanak/:id" element={<Article />} />
          <Route path="/nema-drzave" element={<NotFound />} />
          <Route path="/kontinent/:id" element={<Continent />} />
          <Route
            path="/destinacija/:countryName"
            element={<DestinationCountry />}
          />
          <Route
            path="/destinacija/:countryName/:placeName"
            element={<DestinationPlace />}
          />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute redirectPath="/login" isAllowed={isLoggedIn}>
              <AdminViewLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/sadržaj" element={<EditHomepageMenu />} />
          <Route path="/admin/mjesta" element={<PlacesList />} />
          <Route path="/admin/mjesta/dodaj" element={<AddPlace />} />
          <Route path="/admin/mjesta/uredi/:name" element={<EditPlace />} />
          <Route path="/admin/države" element={<CountriesList />} />
          <Route path="/admin/države/dodaj" element={<AddCountry />} />
          <Route path="/admin/države/uredi/:name" element={<EditCountry />} />
          <Route path="/admin/članci" element={<ArticlesList />} />
          <Route path="/admin/članci/uredi/:id" element={<EditArticle />} />
          <Route path="/admin/članci/dodaj" element={<AddArticle />} />
          <Route path="/admin/uredi-hero" element={<EditHero />} />
          <Route path="/admin/uredi-banner" element={<EditBanner />} />
          <Route path="/admin/uredi-statistiku" element={<EditStats />} />
          <Route path="/admin/uredi-top-tri" element={<EditTopArticles />} />
          <Route
            path="/admin/uredi-omiljene-clanke"
            element={<EditFavoriteArticles />}
          />
          <Route path="/admin/uredi-vize" element={<EditVisaInfo />} />
          <Route path="/admin/uredi-kartu" element={<EditMap />} />
          <Route path="/admin/uredi-footer" element={<EditFooter />} />
          <Route path="/admin/newsletter" element={<Subsrcibers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
