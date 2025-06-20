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
            image: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&w=600&q=80",
            description: "Delicious cakes for every celebration.",
        },
        {
            name: "Pastries",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            description: "Flaky, buttery, and sweet pastries for every taste.",
        },
        {
            name: "Cupcakes",
            image: "https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&w=600&q=80",
            description: "Colorful cupcakes topped with creamy frosting.",
        },
        {
            name: "BiscuitsAndCookies",
            image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&w=600&q=80",
            description:
                "Crunchy and soft cookies and biscuits in a variety of flavors.",
        },
        {
            name: "Donut",
            image: "https://images.pexels.com/photos/390051/pexels-photo-390051.jpeg?auto=compress&w=600&q=80",
            description: "Sweet, colorful donuts perfect for any occasion.",
        },
        {
            name: "Waffles",
            image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&w=600&q=80",
            description: "Golden, crispy waffles for breakfast or dessert.",
        },
        {
            name: "Breads",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            description: "Freshly baked breads, from sourdough to baguettes.",
        },
        {
            name: "PartyProps",
            image: "https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&w=600&q=80",
            description: "Internal category for system use. Party popper! 🎉",
        },
    ]);

    const items = await Item.insertMany([
        // Cakes
        {
            name: "Chocolate Cake",
            category: categories[0]._id,
            description: "Rich chocolate cake with creamy frosting.",
            image: "https://images.pexels.com/photos/533325/pexels-photo-533325.jpeg?auto=compress&w=600&q=80",
            price: 20,
        },
        {
            name: "Red Velvet Cake",
            category: categories[0]._id,
            description: "Classic red velvet with cream cheese icing.",
            image: "https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&w=600&q=80",
            price: 22,
        },
        {
            name: "Cheesecake",
            category: categories[0]._id,
            description: "Creamy cheesecake with a graham cracker crust.",
            image: "https://images.pexels.com/photos/704971/pexels-photo-704971.jpeg?auto=compress&w=600&q=80",
            price: 24,
        },
        // Pastries
        {
            name: "Croissant",
            category: categories[1]._id,
            description: "Buttery French pastry.",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            price: 2.5,
        },
        {
            name: "Danish",
            category: categories[1]._id,
            description: "Fruit-filled Danish pastry.",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            price: 3,
        },
        {
            name: "Apple Turnover",
            category: categories[1]._id,
            description: "Flaky pastry with apple filling.",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            price: 3.5,
        },
        // Cupcakes
        {
            name: "Vanilla Cupcake",
            category: categories[2]._id,
            description: "Classic vanilla cupcake with buttercream.",
            image: "https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&w=600&q=80",
            price: 2,
        },
        {
            name: "Chocolate Cupcake",
            category: categories[2]._id,
            description: "Moist chocolate cupcake with chocolate icing.",
            image: "https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&w=600&q=80",
            price: 2.2,
        },
        {
            name: "Strawberry Cupcake",
            category: categories[2]._id,
            description: "Cupcake topped with strawberry frosting.",
            image: "https://images.pexels.com/photos/14105/pexels-photo-14105.jpeg?auto=compress&w=600&q=80",
            price: 2.5,
        },
        // BiscuitsAndCookies
        {
            name: "Chocolate Chip Cookie",
            category: categories[3]._id,
            description: "Classic cookie with chocolate chips.",
            image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&w=600&q=80",
            price: 1.2,
        },
        {
            name: "Oatmeal Raisin Cookie",
            category: categories[3]._id,
            description: "Chewy oatmeal cookie with raisins.",
            image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&w=600&q=80",
            price: 1.3,
        },
        {
            name: "Shortbread Biscuit",
            category: categories[3]._id,
            description: "Buttery shortbread biscuit.",
            image: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&w=600&q=80",
            price: 1.1,
        },
        // Donut
        {
            name: "Glazed Donut",
            category: categories[4]._id,
            description: "Sweet glazed donut.",
            image: "https://images.pexels.com/photos/390051/pexels-photo-390051.jpeg?auto=compress&w=600&q=80",
            price: 1.5,
        },
        {
            name: "Chocolate Donut",
            category: categories[4]._id,
            description: "Donut with chocolate icing and sprinkles.",
            image: "https://images.pexels.com/photos/390051/pexels-photo-390051.jpeg?auto=compress&w=600&q=80",
            price: 1.7,
        },
        {
            name: "Jelly Donut",
            category: categories[4]._id,
            description: "Donut filled with sweet jelly.",
            image: "https://images.pexels.com/photos/390051/pexels-photo-390051.jpeg?auto=compress&w=600&q=80",
            price: 1.8,
        },
        // Waffles
        {
            name: "Belgian Waffle",
            category: categories[5]._id,
            description: "Thick, fluffy Belgian waffle.",
            image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&w=600&q=80",
            price: 4,
        },
        {
            name: "Chocolate Waffle",
            category: categories[5]._id,
            description: "Waffle with chocolate drizzle.",
            image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&w=600&q=80",
            price: 4.5,
        },
        {
            name: "Berry Waffle",
            category: categories[5]._id,
            description: "Waffle topped with fresh berries.",
            image: "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&w=600&q=80",
            price: 4.8,
        },
        // Breads
        {
            name: "Sourdough Bread",
            category: categories[6]._id,
            description: "Crusty sourdough loaf.",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            price: 5,
        },
        {
            name: "Baguette",
            category: categories[6]._id,
            description: "Classic French baguette.",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            price: 3,
        },
        {
            name: "Whole Wheat Bread",
            category: categories[6]._id,
            description: "Healthy whole wheat bread.",
            image: "https://images.pexels.com/photos/461382/pexels-photo-461382.jpeg?auto=compress&w=600&q=80",
            price: 4,
        },
        // PartyProps
        {
            name: "Party Popper",
            category: categories[7]._id,
            description: "Colorful party popper for celebrations.",
            image: "https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&w=600&q=80",
            price: 2,
        },
        {
            name: "Birthday Candle Set",
            category: categories[7]._id,
            description: "Set of colorful birthday candles.",
            image: "https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&w=600&q=80",
            price: 1.5,
        },
        {
            name: "Confetti Pack",
            category: categories[7]._id,
            description: "Pack of vibrant confetti for parties.",
            image: "https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&w=600&q=80",
            price: 1.8,
        },
        {
            name: "Party Hat",
            category: categories[7]._id,
            description: "Fun party hat for guests.",
            image: "https://images.pexels.com/photos/1303083/pexels-photo-1303083.jpeg?auto=compress&w=600&q=80",
            price: 1.2,
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
            imageUrl:
                "https://i.pinimg.com/474x/01/fa/96/01fa9660e0c4591c1be323f753ba7c67.jpg",
        },
        {
            title: "Sample 2",
            description: "Sample description 2",
            imageUrl:
                "https://i.pinimg.com/474x/17/01/f6/1701f664ec2143c894664f174b555c81.jpg",
        },
        {
            title: "Sample 3",
            description: "Sample description 3",
            imageUrl:
                "https://i.pinimg.com/474x/98/37/c4/9837c423b77bf82627c4ef6d94976faf.jpg",
        },
        {
            title: "Sample 4",
            description: "Sample description 4",
            imageUrl:
                "https://i.pinimg.com/474x/d4/80/16/d480161e7fcfcd5b04f77b84168d5567.jpg",
        },
        {
            title: "Sample 5",
            description: "Sample description 5",
            imageUrl:
                "https://i.pinimg.com/474x/c4/02/f6/c402f678e4ef06b21e92169073b7d03a.jpg",
        },
        {
            title: "Sample 6",
            description: "Sample description 6",
            imageUrl:
                "https://i.pinimg.com/474x/0c/18/96/0c18965ee529f4c8c7e32227bbe7864b.jpg",
        },
        {
            title: "Sample 7",
            description: "Sample description 7",
            imageUrl:
                "https://i.pinimg.com/474x/2d/0f/83/2d0f83c9174a30ea180ad31b2d8cc2c8.jpg",
        },
        {
            title: "Sample 8",
            description: "Sample description 8",
            imageUrl:
                "https://i.pinimg.com/474x/df/4c/56/df4c56c13320813e89479dc623a5e6de.jpg",
        },
        {
            title: "Sample 9",
            description: "Sample description 9",
            imageUrl:
                "https://i.pinimg.com/474x/55/b5/4e/55b54ef5f57598205995c98c0ce9dc32.jpg",
        },
        {
            title: "Sample 10",
            description: "Sample description 10",
            imageUrl:
                "https://i.pinimg.com/474x/07/fe/40/07fe404ca9327bf56c87b24a8b9208e2.jpg",
        },
        {
            title: "Sample 11",
            description: "Sample description 11",
            imageUrl:
                "https://i.pinimg.com/474x/9b/8c/df/9b8cdf0bee5360ae58a94698d3cf5219.jpg",
        },
        {
            title: "Sample 12",
            description: "Sample description 12",
            imageUrl:
                "https://i.pinimg.com/474x/ba/63/6b/ba636b5ad83ae0f549bd9731a2f02346.jpg",
        },
        {
            title: "Sample 13",
            description: "Sample description 13",
            imageUrl:
                "https://i.pinimg.com/474x/71/9e/82/719e82b6347aa0014f3a11ab4b79f959.jpg",
        },
        {
            title: "Sample 14",
            description: "Sample description 14",
            imageUrl:
                "https://i.pinimg.com/474x/2b/8f/b0/2b8fb0e0bc245bbfcf5b0755b58b2693.jpg",
        },
        {
            title: "Sample 15",
            description: "Sample description 15",
            imageUrl:
                "https://i.pinimg.com/474x/24/f3/58/24f358d734ad3527ca40343ea41a8576.jpg",
        },
        {
            title: "Sample 16",
            description: "Sample description 16",
            imageUrl:
                "https://i.pinimg.com/474x/d9/a1/eb/d9a1eba110dff93d7592aa84a3519d66.jpg",
        },
        {
            title: "Sample 17",
            description: "Sample description 17",
            imageUrl:
                "https://i.pinimg.com/474x/cb/44/66/cb44665b41adeda4a0c1ad15c5d0e4d0.jpg",
        },
        {
            title: "Sample 18",
            description: "Sample description 18",
            imageUrl:
                "https://i.pinimg.com/474x/52/03/50/5203509a81366ebe056ea0c18e8127af.jpg",
        },
        {
            title: "Sample 19",
            description: "Sample description 19",
            imageUrl:
                "https://i.pinimg.com/474x/6a/4f/a8/6a4fa85dd24d9fb0bb9497682836ddbf.jpg",
        },
        {
            title: "Sample 20",
            description: "Sample description 20",
            imageUrl:
                "https://i.pinimg.com/474x/6d/ff/7f/6dff7f832c1a5cab8e0b64cf8e998371.jpg",
        },
        {
            title: "Sample 21",
            description: "Sample description 21",
            imageUrl:
                "https://i.pinimg.com/474x/7c/0a/4a/7c0a4aa5872152c8caa44ed9236a4509.jpg",
        },
        {
            title: "Sample 22",
            description: "Sample description 22",
            imageUrl:
                "https://i.pinimg.com/474x/12/1c/ff/121cfff0843a2cc3721013952049580b.jpg",
        },
        {
            title: "Sample 23",
            description: "Sample description 23",
            imageUrl:
                "https://i.pinimg.com/474x/a3/6c/69/a36c69f187aa35cd38f3bc03c5a93f63.jpg",
        },
        {
            title: "Sample 24",
            description: "Sample description 24",
            imageUrl:
                "https://i.pinimg.com/474x/3b/30/da/3b30da5509d6132566dec5287177104e.jpg",
        },
        {
            title: "Sample 25",
            description: "Sample description 25",
            imageUrl:
                "https://i.pinimg.com/474x/24/c5/b5/24c5b5373334d58b429e73b3388764dc.jpg",
        },
        {
            title: "Sample 26",
            description: "Sample description 26",
            imageUrl:
                "https://i.pinimg.com/474x/9c/c1/b7/9cc1b7cc0be0804dda0d93f7e35871a9.jpg",
        },
        {
            title: "Sample 27",
            description: "Sample description 27",
            imageUrl:
                "https://i.pinimg.com/474x/44/ff/2a/44ff2a60cceecbff14bdc41843221019.jpg",
        },
        {
            title: "Sample 28",
            description: "Sample description 28",
            imageUrl:
                "https://i.pinimg.com/474x/d4/20/12/d42012ba478399a12a8e8df66b23a693.jpg",
        },
    ]);

    console.log("⚙️  Seeding Staff...");
    await Staff.insertMany([
        {
            name: "Alice",
            role: "Baker",
            pictureUrl: "https://picsum.photos/id/64/200/300",
            description: "Head pastry chef",
        },
        {
            name: "Bob",
            role: "Manager",
            pictureUrl: "https://picsum.photos/id/22/200/300",
            description: "Runs the front of house",
        },
    ]);

    console.log("⚙️  Seeding Cooking Videos...");
    await CookingVideo.insertMany([
        {
            title: "Making Croissants",
            description: "Step-by-step croissants",
            videoUrl:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        },
        {
            title: "Decorating Donuts",
            description: "Glaze & toppings",
            videoUrl:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        },
        {
            title: "Elephants Dream",
            description: "A story about elephants",
            videoUrl:
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        },
    ]);

    console.log("⚙️  Seeding Contests...");
    const contests = await Contest.insertMany([
        {
            title: "Best Cookie Recipe",
            description: "Share your secret cookie recipe",
            imageUrl:
                "https://unsplash.com/photos/a-stack-of-cookies-sitting-on-top-of-each-other-UzDJVy0D0MU",
            user: customerUser._id,
        },
        {
            title: "Donut Decorating",
            description: "Show off your donut art",
            imageUrl:
                "https://unsplash.com/photos/three-donuts-with-pink-icing-are-flying-in-the-air-1ZP5yXcULwo",
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
