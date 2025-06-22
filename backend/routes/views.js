// routes/views.js
const express = require("express");
const Config = require("../models/General");
const axios = require("axios");
const Category = require("../models/Category");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FormData = require("form-data");
const router = express.Router();
const API_BASE_URL = "http://localhost:5000";
const uploadGallery = multer({ dest: "uploads/gallery/" });
const uploadContest = multer({ dest: "uploads/contests/" });
const { authenticateTokenOptional, authenticateTokenRequired, requireAdmin } = require("../middlewares/auth");

const SLIDES = [
    "/images/static/p1.jpg",
    "/images/static/p2.jpg",
    "/images/static/p3.jpg",
    "/images/static/p4.jpg",
    "/images/static/p5.jpg",
    "/images/static/p6.jpg",
];

async function commonViewData(req, res, next) {
    try {
        const cats = await Category.aggregate([
            {
                $match: { name: { $ne: "PartyProps" } },
            },
            {
                $lookup: {
                    from: "items",
                    localField: "_id",
                    foreignField: "category",
                    as: "items",
                },
            },
            {
                $project: {
                    name: 1,
                    image: 1,
                    description: 1,
                    itemsCount: { $size: "$items" },
                },
            },
        ]);

        let userLoggedIn = false;
        if (req.user) {
            userLoggedIn = true;
        }

        let isAdmin = false;
        if (req.user && req.user.role === "admin") {
            isAdmin = true;
        }

        const partprop = await Category.findOne({ name: "PartyProps" });
        let partpropId = null;
        if (partprop) {
            partpropId = partprop._id;
        }

        const cfg = await Config.findOne();

        res.locals.categories = cats;
        res.locals.userLoggedIn = userLoggedIn;
        res.locals.isAdmin = isAdmin;
        res.locals.propsId = partpropId;
        res.locals.footerdata = cfg;

        res.locals.navbarColor = res.locals.navbarColor || "#e8a49e";
        res.locals.bodyColor = res.locals.bodyColor || "#f5deda";

        next();
    } catch (error) {
        console.error("Error fetching common view data:", error);
        next(error);
    }
}

router.use(authenticateTokenOptional, commonViewData);


router.get(["/", "/Homepage"], async (req, res) => {
    let categories = [];
    let propsCategory = null;
    let poll = [];
    let specials = [];
    let gallery = [];
    let analytics = null;
    let mapUrl = "";

    try {
        const categoriesRes = await axios.get(`${API_BASE_URL}/categories/all`);
        categories = categoriesRes.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error.message);
    }

    try {
        const propsCategoryRes = await axios.get(
            `${API_BASE_URL}/categories/partyprops`
        );
        propsCategory = propsCategoryRes.data;
    } catch (error) {
        console.error("Error fetching props category:", error.message);
    }

    try {
        const pollRes = await axios.get(`${API_BASE_URL}/categories/stats/today`);
        poll = pollRes.data || [];
    } catch (error) {
        console.error("Error fetching poll data:", error.message);
    }

    try {
        const specialsRes = await axios.get(`${API_BASE_URL}/items/random2`);
        specials = specialsRes.data || [];
    } catch (error) {
        console.error("Error fetching specials:", error.message);
    }

    try {
        const galleryRes = await axios.get(`${API_BASE_URL}/gallery/limited`);
        gallery = galleryRes.data || [];
    } catch (error) {
        console.error("Error fetching gallery:", error.message);
    }

    try {
        const generalRes = await axios.get(`${API_BASE_URL}/general`);
        analytics = generalRes.data.analytics || null;
        mapUrl = generalRes.data.mapEmbedUrl || "";
    } catch (error) {
        console.error("Error fetching general data:", error.message);
    }

    res.render("pages/home", {
        title: "Home",
        bodyColor: res.locals.bodyColor,

        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: 0,
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,

        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,

        SLIDES,
        categories: categories,
        propsCategory,
        poll,
        specials,
        gallery,
        analytics,
        mapUrl,
        slide: 0,
        pageTitle: "Welcome to Our Bakery!",
    });
});

router.get("/SignUp%20Page", async (req, res) => {
    res.render("pages/signup", {
        title: "Home",
        bodyColor: res.locals.bodyColor,

        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: 0,
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,

        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,

        messages: req.flash(),
        formData: req.flash("formData")[0] || {},
    });
});

router.post("/SignUp%20Page", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
            name,
            email,
            password,
        });

        req.flash(
            "success",
            response.data.message || "Signup successful! Please log in."
        );
        res.redirect("/views/SignUp%20Page");
    } catch (err) {
        const errorMessage =
            err.response?.data?.message || "Signup failed. Please try again.";
        req.flash("error", errorMessage);
        req.flash("formData", { name, email });
        res.redirect("/views/SignUp%20Page");
    }
});

router.get("/login", async (req, res) => {
    res.render("pages/login", {
        title: "Home",
        bodyColor: res.locals.bodyColor,

        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: 0,
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,

        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,

        messages: req.flash(),
        formData: req.flash("formData")[0] || {},
    });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
        });

        const token = response.data.token;

        if (token) {
            req.session.token = token;

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            req.flash("success", "Login successful!");
            res.redirect("/views/Profile");
        } else {
            req.flash("error", "Login failed: No token received.");
            req.flash("formData", { email });
            res.redirect("/views/login");
        }
    } catch (err) {
        const errorMessage =
            err.response?.data?.message ||
            "Login failed. Please check your credentials.";
        req.flash("error", errorMessage);
        req.flash("formData", { email });
        res.redirect("/views/login");
    }
});

// New route for the Kitchen Page
router.get("/kitchen", async (req, res) => {
    let chefs = [];
    let videos = [];

    try {
        const chefsRes = await axios.get(`${API_BASE_URL}/staff/all`);
        chefs = chefsRes.data || [];
    } catch (error) {
        console.error("Error fetching chefs:", error.message);
    }

    try {
        const videosRes = await axios.get(`${API_BASE_URL}/cooking-videos/all`);
        videos = videosRes.data || [];
    } catch (error) {
        console.error("Error fetching videos:", error.message);
    }

    res.render("pages/kitchen", {
        title: "Our Kitchen", // Specific title for this page
        bodyColor: res.locals.bodyColor, // Use from commonViewData

        showNavInitially: false,
        categories: res.locals.categories, // Use from commonViewData
        propsId: res.locals.propsId, // Use from commonViewData
        totalCartItems: 0, // You might want to dynamically calculate this
        isAdmin: res.locals.isAdmin, // Use from commonViewData
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn, // Use from commonViewData

        footerColor: res.locals.navbarColor, // Use from commonViewData
        footerdata: res.locals.footerdata, // Use from commonViewData

        // Data specific to Kitchen Page
        chefs,
        videos,

        // No need for SLIDES, poll, specials, gallery, analytics, mapUrl on this page unless your layout uses them
        // If your layout depends on these, you'd need to fetch them here or make them part of commonViewData if universally required.
        // For now, assuming they are only for the home page.
    });
});

router.get("/cart", async (req, res) => {
    // Get cart items from session (or database)
    const cartItems = req.session.cart || [];
    const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.render("pages/cart", {
        title: "Your Shopping Cart",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: cartItems.length, // Update total cart items based on session
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,
        cartItems: cartItems, // Pass cart items to the EJS template
        cartTotal: cartTotal, // Pass total to the EJS template
        messages: req.flash() // Pass flash messages for notifications
    });
});

// Helper function to update cart in session (you might move this to a separate cart utility)
const updateCartItemQuantity = (cart, itemId, change) => {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1); // Remove if quantity drops to 0 or below
        }
    }
    return cart;
};

// POST route to increase item quantity
router.post("/cart/increase", (req, res) => {
    const { itemId } = req.body;
    req.session.cart = updateCartItemQuantity(req.session.cart || [], itemId, 1);
    req.flash('success', 'Item quantity increased.');
    res.redirect("/views/cart");
});

// POST route to decrease item quantity
router.post("/cart/decrease", (req, res) => {
    const { itemId } = req.body;
    req.session.cart = updateCartItemQuantity(req.session.cart || [], itemId, -1);
    req.flash('success', 'Item quantity decreased.');
    res.redirect("/views/cart");
});

// POST route to remove item from cart
router.post("/cart/remove", (req, res) => {
    const { itemId } = req.body;
    req.session.cart = (req.session.cart || []).filter(item => item.id !== itemId);
    req.flash('success', 'Item removed from cart.');
    res.redirect("/views/cart");
});

// POST route to clear the entire cart
router.post("/cart/clear", (req, res) => {
    req.session.cart = []; // Empty the cart
    req.flash('success', 'Your cart has been cleared.');
    res.redirect("/views/cart");
});

// GET /views/checkout
router.get("/checkout", async (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please log in to proceed to checkout.');
        return res.redirect("/views/login");
    }

    const cartItems = req.session.cart || [];
    const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    let addresses = [];
    let selectedAddressId = "";
    try {
        const token = req.session.token;
        const resp = await axios.get(`${API_BASE_URL}/users/me/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        addresses = Array.isArray(resp.data) ? resp.data : [];
        if (addresses.length) selectedAddressId = addresses[0]._id.toString();
    } catch (err) {
        console.error("Error loading addresses:", err.message);
        req.flash('error', 'Could not load your addresses. You can still add one below.');
    }

    res.render("pages/checkout", {
        title: "Checkout",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: cartItems.length,
        isAdmin: res.locals.isAdmin,
        userLoggedIn: req.user,
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,
        initialSearch: "",

        // page-specific
        cartItems,
        cartTotal,
        addresses,
        selectedAddressId,
        paymentMethod: 'cash',
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    });
});

// POST /views/place-order
router.post("/place-order", async (req, res) => {
    if (!req.user) {
        req.flash('error', 'Please log in to place an order.');
        return res.redirect("/views/login");
    }

    const { selectedAddressId, paymentMethod } = req.body;
    const cartItems = req.session.cart || [];
    if (cartItems.length === 0) {
        req.flash('error', 'Your cart is empty. Add items to proceed.');
        return res.redirect("/views/checkout");
    }

    // build the deliveryLocation object
    let deliveryLocation;
    try {
        const token = req.session.token;
        const addrsRes = await axios.get(`${API_BASE_URL}/users/me/addresses`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const allAddrs = Array.isArray(addrsRes.data) ? addrsRes.data : [];
        deliveryLocation = allAddrs.find(a => String(a._id) === selectedAddressId);
        if (!deliveryLocation) throw new Error("Selected address not found");
    } catch (err) {
        console.error("Error fetching addresses:", err.message);
        req.flash('error', 'Could not verify selected address.');
        return res.redirect("/views/checkout");
    }

    try {
        const orderItems = cartItems.map(i => ({
            itemId: i.id,
            quantity: i.quantity
        }));
        const token = req.session.token;

        await axios.post(
            `${API_BASE_URL}/order`,
            {
                userId: req.user._id,
                items: orderItems,
                deliveryLocation,
                paymentMethod
            },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        // success!
        req.session.cart = [];                   // clear cart immediately
        req.flash("success", "Order placed successfully!");
        res.redirect("/views/profile");          // redirect to profile to show flash

    } catch (err) {
        console.error("Order placement error:", err.response?.data?.message || err.message);
        req.flash("error", err.response?.data?.message || "Failed to place order. Please try again.");
        res.redirect("/views/checkout");
    }
});

router.get("/faq", async (req, res) => {
    let faqs = [];

    try {
        const generalRes = await axios.get(`${API_BASE_URL}/general`);
        faqs = generalRes.data?.faq || [];
    } catch (error) {
        console.error("Error fetching FAQ data:", error.message);
        req.flash('error', 'Failed to load FAQs. Please try again later.');
        faqs = []; // Ensure empty array on error
    }

    res.render("pages/faq", {
        title: "Frequently Asked Questions",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: req.session.cart ? req.session.cart.length : 0, // Assuming cart in session
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,
        faqs: faqs, // Pass fetched FAQs to the EJS template
        messages: req.flash() // Pass flash messages
    });
});

router.get("/gallery", async (req, res) => {
    let images = [];
    let error = null;

    try {
        const galleryRes = await axios.get(`${API_BASE_URL}/gallery/all`);
        // Ensure data is an array; if not, default to empty array
        images = Array.isArray(galleryRes.data) ? galleryRes.data : [];
    } catch (err) {
        console.error("Error fetching gallery images:", err.message);
        error = "Could not load gallery. Please try again later.";
        images = []; // Ensure images is empty on error
    }

    res.render("pages/gallery", {
        title: "Our Gallery",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: req.session.cart ? req.session.cart.length : 0, // Assuming cart in session
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,
        images: images, // Pass fetched images to the EJS template
        error: error,   // Pass error message to the EJS template
        // No 'loading' state needed as it's handled on the server by the time EJS renders
        messages: req.flash() // Pass flash messages
    });
});

router.get([
    "/Menu",
    "/Cakes",
    "/Pastries",
    "/Cupcakes",
    "/BiscuitsAndCookies",
    "/Donut",
    "/Waffles",
    "/Breads",
    "/Others",
], async (req, res) => {
    const categoryId = req.query.category;
    let category = null;
    let items = [];
    let error = null;

    if (!categoryId) {
        // If no categoryId is provided, render the page with a message.
        return res.render("pages/menu", {
            title: "Menu",
            bodyColor: res.locals.bodyColor,
            showNavInitially: false,
            categories: res.locals.categories,
            propsId: res.locals.propsId,
            totalCartItems: req.session.cart ? req.session.cart.length : 0,
            isAdmin: res.locals.isAdmin,
            userLoggedIn: res.locals.userLoggedIn,
            footerColor: res.locals.navbarColor,
            footerdata: res.locals.footerdata,
            categoryId: null, // Indicate no category selected
            category: null,
            items: [],
            error: "No category selected. Please choose one to view menu items.",
            messages: req.flash()
        });
    }

    try {
        // Fetch category info
        const categoryRes = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
        category = categoryRes.data;
    } catch (catErr) {
        console.error("Error fetching category info:", catErr.message);
        category = null;
        error = "Could not load category information.";
    }

    try {
        // Fetch items in category
        const itemsRes = await axios.get(`${API_BASE_URL}/items/category/${categoryId}`);
        items = itemsRes.data;
    } catch (itemErr) {
        console.error("Error fetching items for category:", itemErr.message);
        items = [];
        error = error ? error + " And could not load items." : "Could not load items for this category.";
    }

    res.render("pages/menu", {
        title: category?.name ? `Menu: ${category.name}` : "Menu",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        totalCartItems: req.session.cart ? req.session.cart.length : 0, // Assuming cart in session
        isAdmin: res.locals.isAdmin,
        initialSearch: "",
        userLoggedIn: res.locals.userLoggedIn,
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,
        categoryId: categoryId, // Pass categoryId to the template
        category: category,   // Pass fetched category info
        items: items,         // Pass fetched items
        error: error,         // Pass any error message
        messages: req.flash()
    });
});

router.post("/cart/add", async (req, res) => {
    const { itemId, itemName, itemPrice, itemImage } = req.body;

    if (!itemId || !itemName || !itemPrice || !itemImage) {
        req.flash('error', 'Invalid item data received.');
        const referer = req.headers.referer;
        return res.redirect(referer || "/views/menu");
    }

    let cart = req.session.cart || [];
    const existingItemIndex = cart.findIndex(item => item.id === itemId);
    let message = '';

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
        message = `${itemName} quantity increased in cart.`;
    } else {
        cart.push({
            id: itemId,
            name: itemName,
            price: parseFloat(itemPrice),
            imageUrl: itemImage,
            quantity: 1,
        });
        message = `${itemName} added to cart.`;
    }

    req.session.cart = cart;
    req.flash('success', message);

    const referer = req.headers.referer;
    return res.redirect(referer || "/views/menu");
});


router.get("/profile", async (req, res) => {
    // req.user is set by the isAuthenticated middleware
    const user = req.user;
    let addresses = [];
    let orders = [];
    let error = null;
    let editName = req.query.editName === 'true'; // Get editName state from query param

    const token = req.session.token; // Get token from session

    try {
        // Fetch addresses
        const addressesRes = await axios.get(`${API_BASE_URL}/users/me/addresses`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        addresses = addressesRes.data;
    } catch (addrErr) {
        console.error("Error fetching addresses:", addrErr.message);
        addresses = [];
        error = error ? error + " Could not load addresses." : "Could not load addresses.";
    }

    try {
        // Fetch orders
        const ordersRes = await axios.get(`${API_BASE_URL}/order/my-orders/${user._id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        orders = ordersRes.data;
    } catch (orderErr) {
        console.error("Error fetching orders:", orderErr.message);
        orders = [];
        error = error ? error + " Could not load orders." : "Could not load orders.";
    }

    res.render("pages/profile", {
        title: "My Profile",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        propsId: res.locals.propsId,
        initialSearch: "",
        totalCartItems: req.session.cart ? req.session.cart.length : 0,
        isAdmin: res.locals.isAdmin,
        userLoggedIn: res.locals.userLoggedIn, // Will be true if isAuthenticated passed
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,
        user: user,       // Pass authenticated user data
        addresses: addresses, // Pass fetched addresses
        orders: orders,     // Pass fetched orders
        error: error,       // Pass any general error
        messages: req.flash(), // Pass flash messages
        editName: editName // Pass the editName state to EJS
    });
});

// --- NEW PUT route to update user name ---
router.put("/profile/update-name", async (req, res) => {
    const { name } = req.body;
    const token = req.session.token;

    try {
        await axios.put(
            `${API_BASE_URL}/users/me/update-name`,
            { name },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        req.flash('success', 'Name updated successfully!');
    } catch (err) {
        console.error("Error updating name:", err.response?.data?.message || err.message);
        req.flash('error', err.response?.data?.message || 'Failed to update name.');
    } finally {
        res.redirect('/views/profile'); // Redirect back to profile page
    }
});

// --- NEW PUT route to change password ---
router.put("/profile/change-password", async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const token = req.session.token;

    if (!oldPassword || !newPassword) {
        req.flash('error', 'Old and new password are required.');
        return res.redirect('/views/profile');
    }

    try {
        await axios.put(
            `${API_BASE_URL}/users/me/change-password`,
            { oldPassword, newPassword },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        req.flash('success', 'Password changed successfully!');
    } catch (err) {
        console.error("Error changing password:", err.response?.data?.message || err.message);
        req.flash('error', err.response?.data?.message || 'Failed to change password.');
    } finally {
        res.redirect('/views/profile'); // Redirect back to profile page
    }
});

// --- NEW POST route to add address ---
router.post("/profile/address", async (req, res) => {
    const { title, address } = req.body;
    const token = req.session.token;

    try {
        await axios.post(
            `${API_BASE_URL}/users/me/address`,
            { title, address },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        req.flash('success', 'Address added successfully!');
    } catch (err) {
        console.error("Error adding address:", err.response?.data?.message || err.message);
        req.flash('error', err.response?.data?.message || 'Failed to add address.');
    } finally {
        res.redirect('/views/profile'); // Redirect back to profile page
    }
});

// --- NEW DELETE route to delete address ---
router.delete("/profile/address/:id", async (req, res) => {
    const addressId = req.params.id;
    const token = req.session.token;

    try {
        await axios.delete(
            `${API_BASE_URL}/users/me/address/${addressId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        req.flash('success', 'Address deleted successfully!');
    } catch (err) {
        console.error("Error deleting address:", err.response?.data?.message || err.message);
        req.flash('error', err.response?.data?.message || 'Failed to delete address.');
    } finally {
        res.redirect('/views/profile'); // Redirect back to profile page
    }
});

// --- NEW POST route for Logout ---
router.post('/logout', (req, res) => {
    req.flash('success', 'You have been logged out.');
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session during logout:', err);
            return res.redirect('/views/profile'); // Or another appropriate page
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect('/views/login'); // Redirect to login page after logout
    });
});

router.get("/PartyProps", async (req, res) => {
    try {
        const category = await axios.get(`${API_BASE_URL}/categories/partyprops`)
        const itemsRes = await axios.get(`${API_BASE_URL}/items/category/${category.data._id}`)
        res.render("pages/partyprops", {
            bodyColor: res.locals.bodyColor,
            showNavInitially: false,
            categories: res.locals.categories,
            propsId: res.locals.propsId,
            initialSearch: "",
            totalCartItems: req.session.cart ? req.session.cart.length : 0,
            isAdmin: res.locals.isAdmin,
            userLoggedIn: res.locals.userLoggedIn, // Will be true if isAuthenticated passed
            footerColor: res.locals.navbarColor,
            footerdata: res.locals.footerdata,
            title: "Party Props",
            category: category.data,
            items: itemsRes.data
        });
    } catch (error) {
        console.error("Error fetching Party Props data:", error.message);
        res.redirect("/views/Homepage");
    }
});


router.get(
    "/participation",
    authenticateTokenRequired,
    (req, res) => {
        res.render("pages/participation", {
            title: "Contest Participation",
            bodyColor: res.locals.bodyColor,
            categories: res.locals.categories,
            propsId: res.locals.propsId,
            showNavInitially: false,
            initialSearch: "",
            totalCartItems: req.session.cart?.length || 0,
            isAdmin: res.locals.isAdmin,
            userLoggedIn: true,
            footerColor: res.locals.navbarColor,
            footerdata: res.locals.footerdata,
            messages: { success: req.flash("success"), error: req.flash("error") },
            formData: req.flash("formData")[0] || {},
            loading: false
        });
    }
);

// POST /views/participation
router.post(
    "/participation",
    authenticateTokenRequired,
    uploadContest.single("image"),
    async (req, res) => {
        const { title, description } = req.body;
        const image = req.file;
        const token = req.session.token;

        req.flash("formData", { title, description });

        if (!title || !description || !image) {
            req.flash("error", "Title, description, and an image are required.");
            return res.redirect("/views/participation");
        }

        const data = new FormData();
        data.append("title", title);
        data.append("description", description);
        data.append("userId", req.user._id.toString());
        data.append("image", fs.createReadStream(image.path), {
            filename: image.originalname,
            contentType: image.mimetype
        });

        try {
            await axios.post(`${API_BASE_URL}/contests/post`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    ...data.getHeaders()
                }
            });
            req.flash("success", "Participation submitted! Good luck!");
            res.redirect("/views/profile");   // flash success on profile
        } catch (err) {
            console.error("Error submitting participation:", err.message);
            req.flash(
                "error",
                err.response?.data?.message || "Submission failed. Please try again."
            );
            res.redirect("/views/participation");
        }
    }
);


router.get("/search", async (req, res) => {
    const query = (req.query.q || "").trim();
    let items = [];
    let error = null;

    if (query) {
        try {
            // call your API to search items
            const resp = await axios.get(`${API_BASE_URL}/search`, {
                params: { q: query },
            });
            items = Array.isArray(resp.data) ? resp.data : [];
        } catch (err) {
            console.error("Error fetching search results:", err.message);
            error = "Could not load search results. Please try again.";
        }
    }

    res.render("pages/search-results", {
        title: "Search Results",
        bodyColor: res.locals.bodyColor,
        showNavInitially: false,
        categories: res.locals.categories,
        initialSearch: query,
        propsId: res.locals.propsId,
        totalCartItems: req.session.cart?.length || 0,
        isAdmin: res.locals.isAdmin,
        userLoggedIn: req.user,
        footerColor: res.locals.navbarColor,
        footerdata: res.locals.footerdata,

        // page-specific
        query,
        items,
        error,
        messages: req.flash(),
    });
});



// admin routes bkjljhkhljgjghkl;jhjghkgjlk;jghcjhklkjghchjkglhjgkfhcgj



// GET /views/gallery/admin
router.get(
    "/gallery/admin",
    authenticateTokenRequired,
    requireAdmin,
    async (req, res) => {
        let gallery = [];
        const messages = { success: req.flash("success"), error: req.flash("error") };

        try {
            const resp = await axios.get(`${API_BASE_URL}/gallery/all`, {
                headers: { Authorization: `Bearer ${req.session.token}` }
            });
            gallery = Array.isArray(resp.data) ? resp.data : [];
        } catch (err) {
            console.error("Failed to fetch gallery:", err.message);
            messages.error.push("Failed to load gallery items.");
        }

        const editingId = req.query.edit || null;
        let formData = { title: "", description: "" };
        if (editingId) {
            const toEdit = gallery.find(g => String(g._id) === editingId);
            if (toEdit) formData = { title: toEdit.title, description: toEdit.description };
        }

        res.render("pages/gallery-admin", {
            title: "Manage Gallery",
            bodyColor: res.locals.bodyColor,
            showNavInitially: false,
            categories: res.locals.categories,
            initialSearch: "",
            propsId: res.locals.propsId,
            totalCartItems: req.session.cart?.length || 0,
            isAdmin: res.locals.isAdmin,
            userLoggedIn: req.user,
            footerColor: res.locals.navbarColor,
            footerdata: res.locals.footerdata,

            gallery,
            messages,
            editingId,
            formData
        });
    }
);

// POST /views/gallery/admin/add
router.post(
    "/gallery/admin/add",
    authenticateTokenRequired,
    requireAdmin,
    uploadGallery.single("image"),
    async (req, res) => {
        const { title, description } = req.body;
        const file = req.file;

        if (!title || !description || !file) {
            req.flash("error", "Title, description and image are required.");
            return res.redirect("/views/gallery/admin");
        }

        const form = new FormData();
        form.append("title", title);
        form.append("description", description);
        form.append("image", require("fs").createReadStream(file.path), {
            filename: file.originalname,
            contentType: file.mimetype
        });

        try {
            await axios.post(`${API_BASE_URL}/gallery/admin/add`, form, {
                headers: {
                    Authorization: `Bearer ${req.session.token}`,
                    ...form.getHeaders()
                }
            });
            req.flash("success", "Gallery item added");
        } catch (err) {
            console.error("Add gallery item failed:", err.message);
            req.flash("error", "Failed to add gallery item");
        }
        res.redirect("/views/gallery/admin");
    }
);

// POST /views/gallery/admin/change/:id  (method-override to PUT)
router.put(
    "/gallery/admin/change/:id",
    authenticateTokenRequired,
    requireAdmin,
    uploadGallery.single("image"),
    async (req, res) => {
        const { id } = req.params;
        const { title, description } = req.body;
        const file = req.file;

        if (!title || !description || !file) {
            req.flash("error", "Title, description and image are required.");
            return res.redirect(`/views/gallery/admin?edit=${id}`);
        }

        const form = new FormData();
        form.append("title", title);
        form.append("description", description);
        form.append("image", require("fs").createReadStream(file.path), {
            filename: file.originalname,
            contentType: file.mimetype
        });

        try {
            await axios.put(`${API_BASE_URL}/gallery/admin/change/${id}`, form, {
                headers: {
                    Authorization: `Bearer ${req.session.token}`,
                    ...form.getHeaders()
                }
            });
            req.flash("success", "Gallery item updated");
        } catch (err) {
            console.error("Update gallery item failed:", err.message);
            req.flash("error", "Failed to update gallery item");
        }
        res.redirect("/views/gallery/admin");
    }
);

// POST /views/gallery/admin/delete/:id  (method-override to DELETE)
router.delete(
    "/gallery/admin/delete/:id",
    authenticateTokenRequired,
    requireAdmin,
    async (req, res) => {
        const { id } = req.params;
        try {
            await axios.delete(`${API_BASE_URL}/gallery/admin/delete/${id}`, {
                headers: { Authorization: `Bearer ${req.session.token}` }
            });
            req.flash("success", "Gallery item deleted");
        } catch (err) {
            console.error("Delete gallery item failed:", err.message);
            req.flash("error", "Failed to delete gallery item");
        }
        res.redirect("/views/gallery/admin");
    }
);


module.exports = router;