import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { CartProvider } from "./CartContext";
import { AdminProvider } from "./AdminContext";

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
import CartPage from "./pages/cart/CartPage";
import CheckoutPage from "./pages/checkout/CheckoutPage";
import SearchResultPage from "./pages/search/SearchResultPage";
import AdminProtectedRoute from "./admin/AdminProtectedRoute";
import ItemsAdminPage from "./admin/items/ItemsAdminPage";
import OrdersAdminPage from "./admin/orders/OrdersAdminPage";
import UsersAdminPage from "./admin/users/UsersAdminPage";
import GeneralAdminPage from "./admin/general/GeneralAdminPage";
import StaffAdminPage from "./admin/staff/StaffAdminPage";
import GalleryAdminPage from "./admin/gallery/GalleryAdminPage";
import CookingVideosAdminPage from "./admin/cookingVideos/CookingVideosAdminPage";
import ContestsAdminPage from "./admin/contests/ContestsAdminPage";

function App() {
    return (
        <AdminProvider>
            <CartProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
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
                        <Route path="/Cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/search" element={<SearchResultPage />} />
                        <Route
                            path="/admin/items"
                            element={
                                <AdminProtectedRoute>
                                    <ItemsAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/orders"
                            element={
                                <AdminProtectedRoute>
                                    <OrdersAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/users"
                            element={
                                <AdminProtectedRoute>
                                    <UsersAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/general"
                            element={
                                <AdminProtectedRoute>
                                    <GeneralAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/staff"
                            element={
                                <AdminProtectedRoute>
                                    <StaffAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/gallery"
                            element={
                                <AdminProtectedRoute>
                                    <GalleryAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/cooking-videos"
                            element={
                                <AdminProtectedRoute>
                                    <CookingVideosAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                        <Route
                            path="/admin/contests"
                            element={
                                <AdminProtectedRoute>
                                    <ContestsAdminPage />
                                </AdminProtectedRoute>
                            }
                        />
                    </Routes>
                    <Footer />
                </Router>
            </CartProvider>
        </AdminProvider>
    );
}

export default App;
