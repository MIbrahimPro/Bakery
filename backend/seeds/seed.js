// scripts/seed.js
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");
const Config = require("../models/General");
const Category = require("../models/Category");
const Item = require("../models/Item");
const User = require("../models/User");
const Gallery = require("../models/Gallery");
const Staff = require("../models/Staff");
const CookingVideo = require("../models/CookingVideo");
const Contest = require("../models/Contest");
const Order = require("../models/Order");

async function seed() {
    await connectDB();
    console.log("🗑  Clearing existing data...");
    await Promise.all([
        Config.deleteMany({}),
        Category.deleteMany({}),
        Item.deleteMany({}),
        User.deleteMany({}),
        Gallery.deleteMany({}),
        Staff.deleteMany({}),
        CookingVideo.deleteMany({}),
        Contest.deleteMany({}),
        Order.deleteMany({}),
    ]);

    console.log("⚙️  Seeding Config...");
    await Config.create({
        instagramLink: "https://instagram.com/tresbakery",
        facebookLink: "https://facebook.com/tresbakery",
        youtubeLink: "https://youtube.com/tresbakery",
        contactNumber: "+1234567890",
        contactEmail: "contact@tresbakery.com",
        faq: [
            {
                question: "What are your opening hours?",
                answer: "Mon–Sat 8am–8pm",
            },
            { question: "Do you deliver?", answer: "Yes, within city limits." },
        ],
        analytics: {
            yearsOfOperation: 5,
            employeesCount: 12,
            bakedKilograms: 25000,
            destinationsCount: 3,
        },
        mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9995.696802250279!2d73.09190756037309!3d33.651891410163664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df952e017d0acd%3A0xf20be4a76782ceaf!2sPir%20Mehr%20Ali%20Shah%20Arid%20Agriculture%20University%20-%20PMAS%20AAUR!5e1!3m2!1sen!2s!4v1750370364889!5m2!1sen!2s",
    });

    console.log("⚙️  Seeding Categories & Items...");
    const categories = await Category.insertMany([
        {
            name: "Cakes",
            image: "/uploads/categories/c (1).jpg",
            description: "Delicious cakes for every celebration.",
        },
        {
            name: "Pastries",
            image: "/uploads/categories/c (2).jpg",
            description: "Flaky, buttery, and sweet pastries for every taste.",
        },
        {
            name: "Cupcakes",
            image: "/uploads/categories/c (3).jpg",
            description: "Colorful cupcakes topped with creamy frosting.",
        },
        {
            name: "BiscuitsAndCookies",
            image: "/uploads/categories/c (4).jpg",
            description:
                "Crunchy and soft cookies and biscuits in a variety of flavors.",
        },
        {
            name: "Donut",
            image: "/uploads/categories/c (5).jpg",
            description: "Sweet, colorful donuts perfect for any occasion.",
        },
        {
            name: "Waffles",
            image: "/uploads/categories/c (6).jpg",
            description: "Golden, crispy waffles for breakfast or dessert.",
        },
        {
            name: "Breads",
            image: "/uploads/categories/c (7).jpg",
            description: "Freshly baked breads, from sourdough to baguettes.",
        },
        {
            name: "PartyProps",
            image: "/uploads/categories/c (8).jpg",
            description: "Internal category for system use. Party popper! 🎉",
        },
    ]);

    const items = await Item.insertMany([
        // Cakes
        {
            name: "Chocolate Cake",
            category: categories[0]._id,
            description: "Rich chocolate cake with creamy frosting.",
            image: "/uploads/items/i (1).jpg",
            price: 20,
        },
        {
            name: "Red Velvet Cake",
            category: categories[0]._id,
            description: "Classic red velvet with cream cheese icing.",
            image: "/uploads/items/i (2).jpg",
            price: 22,
        },
        // Pastries
        {
            name: "Croissant",
            category: categories[1]._id,
            description: "Buttery French pastry.",
            image: "/uploads/items/i (3).jpg",
            price: 2.5,
        },
        {
            name: "Danish",
            category: categories[1]._id,
            description: "Fruit-filled Danish pastry.",
            image: "/uploads/items/i (4).jpg",
            price: 3,
        },
        // Cupcakes
        {
            name: "Vanilla Cupcake",
            category: categories[2]._id,
            description: "Classic vanilla cupcake with buttercream.",
            image: "/uploads/items/i (5).jpg",
            price: 2,
        },
        {
            name: "Chocolate Cupcake",
            category: categories[2]._id,
            description: "Moist chocolate cupcake with chocolate icing.",
            image: "/uploads/items/i (6).jpg",
            price: 2.2,
        },
        // BiscuitsAndCookies
        {
            name: "Chocolate Chip Cookie",
            category: categories[3]._id,
            description: "Classic cookie with chocolate chips.",
            image: "/uploads/items/i (7).jpg",
            price: 1.2,
        },
        {
            name: "Oatmeal Raisin Cookie",
            category: categories[3]._id,
            description: "Chewy oatmeal cookie with raisins.",
            image: "/uploads/items/i (8).jpg",
            price: 1.3,
        },
        // Donut
        {
            name: "Glazed Donut",
            category: categories[4]._id,
            description: "Sweet glazed donut.",
            image: "/uploads/items/i (9).jpg",
            price: 1.5,
        },
        {
            name: "Chocolate Donut",
            category: categories[4]._id,
            description: "Donut with chocolate icing and sprinkles.",
            image: "/uploads/items/i (10).jpg",
            price: 1.7,
        },
        // Waffles
        {
            name: "Belgian Waffle",
            category: categories[5]._id,
            description: "Thick, fluffy Belgian waffle.",
            image: "/uploads/items/i (11).jpg",
            price: 4,
        },
        {
            name: "Chocolate Waffle",
            category: categories[5]._id,
            description: "Waffle with chocolate drizzle.",
            image: "/uploads/items/i (12).jpg",
            price: 4.5,
        },
        // Breads
        {
            name: "Sourdough Bread",
            category: categories[6]._id,
            description: "Crusty sourdough loaf.",
            image: "/uploads/items/i (13).jpg",
            price: 5,
        },
        {
            name: "Baguette",
            category: categories[6]._id,
            description: "Classic French baguette.",
            image: "/uploads/items/i (14).jpg",
            price: 3,
        },
        // PartyProps
        {
            name: "Party Popper",
            category: categories[7]._id,
            description: "Colorful party popper for celebrations.",
            image: "/uploads/items/i (15).jpg",
            price: 2,
        },
        {
            name: "Birthday Candle Set",
            category: categories[7]._id,
            description: "Set of colorful birthday candles.",
            image: "/uploads/items/i (16).jpg",
            price: 1.5,
        },
    ]);

    console.log("⚙️  Seeding Users...");
    const adminPassHash = await bcrypt.hash("admin123", 12);
    const userPassHash = await bcrypt.hash("user123", 12);

    const [adminUser, customerUser] = await User.insertMany([
        {
            name: "Admin User",
            email: "admin@admin.com",
            password: adminPassHash,
            role: "admin",
        },
        {
            name: "Jane Doe",
            email: "user@user.com",
            password: userPassHash,
            role: "customer",
        },
    ]);

    console.log("⚙️  Seeding Gallery...");
    await Gallery.insertMany([
        {
            title: "Sample 1",
            description: "Sample description 1",
            imageUrl: "/uploads/gallery/g (1).jpg",
        },
        {
            title: "Sample 2",
            description: "Sample description 2",
            imageUrl: "/uploads/gallery/g (2).jpg",
        },
        {
            title: "Sample 3",
            description: "Sample description 3",
            imageUrl: "/uploads/gallery/g (3).jpg",
        },
        {
            title: "Sample 4",
            description: "Sample description 4",
            imageUrl: "/uploads/gallery/g (4).jpg",
        },
        {
            title: "Sample 5",
            description: "Sample description 5",
            imageUrl: "/uploads/gallery/g (5).jpg",
        },
        {
            title: "Sample 6",
            description: "Sample description 6",
            imageUrl: "/uploads/gallery/g (6).jpg",
        },
        {
            title: "Sample 7",
            description: "Sample description 7",
            imageUrl: "/uploads/gallery/g (7).jpg",
        },
        {
            title: "Sample 8",
            description: "Sample description 8",
            imageUrl: "/uploads/gallery/g (8).jpg",
        },
        {
            title: "Sample 9",
            description: "Sample description 9",
            imageUrl: "/uploads/gallery/g (9).jpg",
        },
        {
            title: "Sample 10",
            description: "Sample description 10",
            imageUrl: "/uploads/gallery/g (10).jpg",
        },
        {
            title: "Sample 11",
            description: "Sample description 11",
            imageUrl: "/uploads/gallery/g (11).jpg",
        },
        {
            title: "Sample 12",
            description: "Sample description 12",
            imageUrl: "/uploads/gallery/g (12).jpg",
        },
        {
            title: "Sample 13",
            description: "Sample description 13",
            imageUrl: "/uploads/gallery/g (13).jpg",
        },
        {
            title: "Sample 14",
            description: "Sample description 14",
            imageUrl: "/uploads/gallery/g (14).jpg",
        },
        {
            title: "Sample 15",
            description: "Sample description 15",
            imageUrl: "/uploads/gallery/g (15).jpg",
        },
        {
            title: "Sample 16",
            description: "Sample description 16",
            imageUrl: "/uploads/gallery/g (16).jpg",
        },
        {
            title: "Sample 17",
            description: "Sample description 17",
            imageUrl: "/uploads/gallery/g (17).jpg",
        },
        {
            title: "Sample 18",
            description: "Sample description 18",
            imageUrl: "/uploads/gallery/g (18).jpg",
        },
        {
            title: "Sample 19",
            description: "Sample description 19",
            imageUrl: "/uploads/gallery/g (19).jpg",
        },
        {
            title: "Sample 20",
            description: "Sample description 20",
            imageUrl: "/uploads/gallery/g (20).jpg",
        },
    ]);

    console.log("⚙️  Seeding Staff...");
    await Staff.insertMany([
        {
            name: "Alice",
            role: "Baker",
            pictureUrl: "/uploads/staff/s (1).jpg",
            description: "Head pastry chef",
        },
        {
            name: "Bob",
            role: "Manager",
            pictureUrl: "/uploads/staff/s (2).jpg",
            description: "Runs the front of house",
        },
    ]);

    console.log("⚙️  Seeding Cooking Videos...");
    await CookingVideo.insertMany([
        {
            title: "Making Croissants",
            description: "Step-by-step croissants",
            videoUrl: "/uploads/cooking/m (1).mp4",
        },
        {
            title: "Decorating Donuts",
            description: "Glaze & toppings",
            videoUrl: "/uploads/cooking/m (2).mp4",
        },
        {
            title: "Elephants Dream",
            description: "A story about elephants",
            videoUrl: "/uploads/cooking/m (3).mp4",
        },
    ]);

    console.log("⚙️  Seeding Contests...");
    const contests = await Contest.insertMany([
        {
            title: "Best Cookie Recipe",
            description: "Share your secret cookie recipe",
            imageUrl: "/uploads/contests/ct (1).jpg",
            user: customerUser._id,
        },
        {
            title: "Donut Decorating",
            description: "Show off your donut art",
            imageUrl: "/uploads/contests/ct (2).jpg",
            user: customerUser._id,
        },
    ]);

    console.log("⚙️  Seeding Orders...");
    await Order.create({
        user: adminUser._id,
        items: items.map((it) => ({
            item: it._id,
            name: it.name,
            quantity: 2,
            price: it.price,
            subTotal: it.price * 2,
        })),
        totalPrice: items.reduce((sum, it) => sum + it.price * 2, 0),
        deliveryLocation: { title: "Home", address: "123 Baker St" },
        paymentMethod: "card",
        paymentStatus: "paid",
        orderStatus: "delivered",
    });

    console.log("🎉 Seeding complete!");
    mongoose.connection.close();
}

seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
