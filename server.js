const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi"); 
const path = require("path"); 
const app = express();
const mongoose = require("mongoose");


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

mongoose
    .connect("mongodb+srv://SwSoA4F7DHUzPcVk:QDOpJxsDNbFn52NF@cluster0.csbjj.mongodb.net/DiscoverVietnam?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((error) => {
        console.log("couldn't connect to mongodb", error);
});

// MongoDB Schema and Model
const ItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    img_name: { type: String },
    city: { type: String },
    region: { type: String },
    difficulty_level: { type: String },
    historical_significance: { type: String },
    attractions: { type: [String] },
    ingredients: { type: [String] },
    link: { type: String }, // Add support for link fields
});

const Item = mongoose.model("Item", ItemSchema);

// Joi Validation Schema
const validateItem = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
        description: Joi.string().min(5).required(),
        city: Joi.string().optional(),
        img_name: Joi.string().optional(),
        region: Joi.string().optional(),
        difficulty_level: Joi.string().optional(),
        historical_significance: Joi.string().optional(),
        attractions: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ).optional(),
        ingredients: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ).optional(),
        link: Joi.string().uri().optional(), // Validate link as an optional URI
    });
    return schema.validate(data);
};

// API Endpoints

app.get("/api/house_plans", async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).send(items);
    } catch (err) {
        res.status(500).send("Error fetching items.");
    }
});

app.get("/api/house_plans/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).send("Item not found.");
        res.status(200).send(item);
    } catch (err) {
        res.status(500).send("Error fetching the item.");
    }
});

// Add New Item
app.post("/api/house_plans", upload.single("img"), async (req, res) => {
    const { error } = validateItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const item = new Item({
        ...req.body,
        img_name: req.file ? `/images/${req.file.filename}` : undefined,
        attractions: req.body.attractions
            ? JSON.parse(req.body.attractions)
            : undefined,
        ingredients: req.body.ingredients
            ? JSON.parse(req.body.ingredients)
            : undefined,
        link: req.body.link, // Save the provided link
    });

    try {
        const savedItem = await item.save();
        res.status(201).send(savedItem);
    } catch (err) {
        res.status(500).send("Error saving the item.");
    }
});

// Edit an Item
app.put("/api/house_plans/:id", upload.single("img"), async (req, res) => {
    const { error } = validateItem(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const existingItem = await Item.findById(req.params.id);

    const updateData = {
        ...req.body,
        img_name: req.file ? `/images/${req.file.filename}` : existingItem.img_name,
        attractions: req.body.attractions
            ? JSON.parse(req.body.attractions)
            : undefined,
        ingredients: req.body.ingredients
            ? JSON.parse(req.body.ingredients)
            : undefined,
        link: req.body.link || undefined, // Update link if provided
    };

    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
    });
    if (!updatedItem) return res.status(404).send("Item not found.");
        res.send(updatedItem);
    } catch (err) {
        res.status(500).send("Error updating the item.");
    }
});

// Delete an Item
app.delete("/api/house_plans/:id", async (req, res) => {
    try {
        const deletedItem = await Item.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).send("Item not found.");
        res.send(deletedItem);
    } catch (err) {
        res.status(500).send("Error deleting the item.");
    }
});


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});