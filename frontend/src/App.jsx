import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";

import Navbar from "./components/navbar/navbar";
import Footer from "./components/footer/footer";
import Home from "./pages/homepage/home";
import Menu from "./pages/menupage/menu";
// Placeholder imports for future pages
import Gallery from "./pages/gallery/gallery";
import KitchenPage from "./pages/kitchenpage/kitchenpage";
import PartyProps from "./pages/partyprops/partyprops";
import FAQ from "./pages/FAQ/FAQ";
import SignUp from "./pages/signup/signup";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import ParticipationForm from "./pages/participationform/participationform";
// import Checkout from "./pages/checkout/checkout";
// etc.

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/Homepage" element={<Home />} />
                <Route path="/Menu" element={<Menu />} />
                <Route path="/Cakes" element={<Menu />} />
                <Route path="/Pastries" element={<Menu />} />
                <Route path="/Cupcakes" element={<Menu />} />
                <Route path="/BiscuitsAndCookies" element={<Menu />} />
                <Route path="/Donut" element={<Menu />} />
                <Route path="/Waffles" element={<Menu />} />
                <Route path="/Breads" element={<Menu />} />
                <Route path="/Others" element={<Menu />} />\
                <Route path="/Gallery" element={<Gallery />} />
                <Route path="/KitchenPage" element={<KitchenPage />} />
                <Route path="/PartyProps" element={<PartyProps />} />
                <Route path="/FAQ" element={<FAQ />} />
                <Route path="/SignUp Page" element={<SignUp />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/Profile" element={<Profile />} />
                <Route
                    path="/ParticipationForm"
                    element={<ParticipationForm />}
                />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;
