const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi"); 
const path = require("path"); 
const app = express();


app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.static("public"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });


const modalCards = [
    {
        "_id": 1,
        "title": "Heritage Line Ylang Cruise",
        "img_name": "images/cruise.jpg",
        "description": "Discover the stunning waters and limestone karsts of Ha Long Bay aboard the luxurious Heritage Ylang Cruise.",
        "link": "https://www.booking.com/hotel/vn/heritage-line-ylang-cruise.en.html",
        "city": "Ha Long Bay",
        "difficulty_level": "Easy"
    },
    {
        "_id": 2,
        "title": "The Marble Mountains",
        "img_name": "images/mm.jpg",
        "description": "A group of five limestone hills located in Da Nang, known for their beautiful caves and Buddhist sanctuaries.",
        "link": "https://www.tripadvisor.com/Attraction_Review-g298085-d454980-Reviews-The_Marble_Mountains-Da_Nang.html",
        "city": "Da Nang",
        "difficulty_level": "Moderate"
    },
    {
        "_id": 3,
        "title": "The Old Quarter",
        "img_name": "images/quarter.jpg",
        "description": "Explore the bustling streets of Hanoi's Old Quarter, filled with history, traditional shops, and vibrant street life.",
        "link": "https://vietnam.travel/things-to-do/explore-old-quarter-your-way",
        "city": "Hanoi",
        "difficulty_level": "Easy"
    },
    {
        "_id": 4,
        "title": "Cat Ba Island",
        "img_name": "images/island.jpg",
        "description": "Cat Ba Island is the largest island in the Ha Long Bay archipelago, known for its rugged limestone hills and diverse wildlife.",
        "link": "https://www.tripadvisor.com/Attraction_Review-g737051-d386683-Reviews-Cat_Ba_Island-Cat_Ba_Hai_Phong.html",
        "city": "Cat Ba",
        "difficulty_level": "Hard"
    },
    {
        "_id": 1,
        "title": "Ho Chi Minh City",
        "img_name": "images/hcm.jpg",
        "description": "o Chi Minh City, formerly known as Saigon, is a bustling city with rich history and vibrant culture.",
        "link": "https://www.tripadvisor.com/Tourism-g293925-Ho_Chi_Minh_City-Vacations.html",
        "attractions": ["Ben Thanh Market", "Notre-Dame Cathedral Basilica", "War Remnants Museum"],
        "historical_significance": "Following the partition of French Indochina, it became the capital of South Vietnam until it was captured by North Vietnam, who renamed the city after their former leader Hồ Chí Minh"
    },
    {
        "_id": 2,
        "title": "Saigon",
        "img_name": "images/saigon.jpeg",
        "description": "Explore the historic streets of Saigon, known for its French colonial architecture and vibrant culture.",
        "link": "https://vietnam.travel/places-to-go/southern-vietnam/ho-chi-minh-city",
        "attractions": ["Saigon Opera House", "Reunification Palace", "Saigon Central Post Office"],
        "historical_significance": "Famous for its role as the capital of South Vietnam during the Vietnam War."
    },
    {
        "_id": 3,
        "title": "Hanoi",
        "img_name": "images/temple.jpg",
        "description": "The capital of Vietnam, Hanoi, is known for its centuries-old architecture and rich culture influenced by Southeast Asia.",
        "link": "https://www.tripadvisor.com/Tourism-g293924-Hanoi-Vacations.html",
        "attractions": ["Hoan Kiem Lake", "Old Quarter", "Temple of Literature"],
        "historical_significance": "Served as the capital of Vietnam since the 11th century, rich in cultural heritage."
    },
    {
        "_id": 4,
        "title": "Hạ Long Bay",
        "img_name": "images/discoverbay.jpg",
        "description": "Hạ Long Bay is famous for its emerald waters and thousands of towering limestone islands topped with rainforests.",
        "link": "https://whc.unesco.org/en/list/672/",
        "attractions": ["Bai Tu Long Bay", "Cat Ba Island", "Sung Sot Cave"],
        "historical_significance": "A UNESCO World Heritage site, it has great importance for its natural beauty and unique geology."
    },
    {
        "_id": 1,
        "title": "Bánh mì",
        "img_name": "images/banhmi.jpg",
        "description": "A popular street food, Bánh mì is a Vietnamese sandwich filled with a variety of meats, vegetables, and herbs.",
        "link": "https://vietnamnomad.com/eat-drink/banh-mi/",
        "ingredients": ["Baguette", "Pork", "Pickled Vegetables", "Cilantro", "Chili Sauce"],
        "region": "Southern Vietnam"
    },
    {
        "_id": 2,
        "title": "Phở",
        "img_name": "images/pho.jpg",
        "description": "Phở is a Vietnamese soup consisting of broth, rice noodles, herbs, and meat, usually beef or chicken.",
        "link": "https://vietnamnomad.com/eat-drink/pho/",
        "ingredients": ["Beef Broth", "Rice Noodles", "Beef Slices", "Bean Sprouts", "Basil"],
        "region": "Northern Vietnam"
    },
    {
        "_id": 3,
        "title": "Bún bò Huế",
        "img_name": "images/bbh.jpg",
        "description": "Bún bò Huế is a Vietnamese soup with a lemongrass-flavored broth, beef, and noodles.",
        "link": "https://vietnamnomad.com/eat-drink/bun-bo-hue/",
        "ingredients": ["Lemongrass Broth", "Beef Shank", "Rice Vermicelli", "Shrimp Paste", "Chili Oil"],
        "region": "Central Vietnam"
    },
    {
        "_id": 4,
        "title": "Bún thịt nướng",
        "img_name": "images/btn.jpg",
        "description": "Bún thịt nướng is a Vietnamese dish consisting of grilled pork and vermicelli noodles, often served with fresh vegetables.",
        "link": "https://www.hungryhuy.com/bun-thit-nuong-recipe-vietnamese-grilled-bbq-pork-with-rice-vermicelli-vegetables/",
        "ingredients": ["Grilled Pork", "Rice Vermicelli", "Fish Sauce", "Pickled Carrots", "Cucumber"],
        "region": "Southern Vietnam"
    }
];

const validateModalCard = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(5).required(),
        img_name: Joi.string().optional(), // This will be added if file is uploaded
        city: Joi.string().optional(), // Add other fields as required
        difficulty_level: Joi.string().optional(),
        historical_significance: Joi.string().optional(),
        ingredients: Joi.array().items(Joi.string()).optional(),
        region: Joi.string().optional()
    });
    return schema.validate(data);
};

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/house_plans", (req, res) => {
    res.json(modalCards);
});

app.post('/api/house_plans', upload.single("img"), (req, res) => {
    console.log('Body received:', req.body);
    console.log('File received:', req.file);

    const result = validateModalCard(req.body);
    if (result.error) {
        console.error('Validation error:', result.error.details[0].message);
        return res.status(400).send(result.error.details[0].message);
    }

    // Create new item
    const newItem = {
        _id: modalCards.length + 1, // Simple ID generation; consider more robust solutions for production
        title: req.body.title,
        description: req.body.description,
        img_name: req.file ? "images/" + req.file.filename : req.body.img_name || "", // Use uploaded file or default value
        city: req.body.city || "",
        difficulty_level: req.body.difficulty_level || "",
        historical_significance: req.body.historical_significance || "",
        ingredients: req.body.ingredients ? req.body.ingredients.split(",") : [],
        region: req.body.region || ""
    };

    // Add the new item to the array
    modalCards.push(newItem);
    console.log("Added new item:", newItem);
    res.status(200).send(newItem);
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});