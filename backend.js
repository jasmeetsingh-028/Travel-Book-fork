require("dotenv").config(); //It will point on config.json file and fetch the data;


const cloudinary = require('cloudinary').v2;
// const config = require('./config.json');
const config = require("./config.json");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");

// app.use(cors());
const app = express();

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
  });

app.use(cors({
  origin: ['https://travel-book-opal.vercel.app', 'https://travelbook.sahilportfolio.me','https://travelbook.sahilfolio.live'], // specific domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*',cors());

// Importing all the models;
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");


const { authenticateToken } = require("./utilities");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const { error } = require("console");

mongoose.connect(config.connectionString); //To use the string to connect with the mongodb


app.use(express.json());
// app.use(cors({ origin: "*" })) //To allow anyone to use the backend;

// TO CREATE AN ACCOUNT and we will configure it using POSTMAN;
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "All fields are required to create your travel memory!"
        });
    }

    try {
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({
                error: true,
                message: "User already has a travel book!"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        await user.save();

        // const accessToken = jwt.sign(
        //     { userId: user._id },
        //     process.env.ACCESS_TOKEN_SECRET,
        //     { expiresIn: "72h" }
        // );

        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "72h" });
        console.log(process.env.ACCESS_TOKEN_SECRET);



        return res.status(201).json({
            error: false,
            user: { fullName: user.fullName, email: user.email },
            accessToken,
            message: "Successfully Registered for a Travel Book!",
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                error: true,
                message: `Email ${email} is already registered. Please use a different email address.`,
            });
        }
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
});


// TO LOGIN;
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password is required to use your Travel Book"
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: "User not found"
        });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password); //if the password entered by the user during login matches the hashed password stored in the database for that user.
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid Credentials!"
        });
    }

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "72h", }
    );

    return res.json({
        error: false,
        message: "Login Succefully to Travel Book",
        user: { fullName: user.fullName, email: user.email },
        accessToken,
    });


});


// Google OAuth authentication endpoint
app.post("/oauth/google", async (req, res) => {
    const { email, fullName, profileImageUrl, clerkId } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required for Google authentication"
        });
    }

    try {
        // Check if user already exists with this email
        let user = await User.findOne({ email });

        if (user) {
            // User exists - update their information
            user.clerkId = clerkId || user.clerkId;
            
            // Only update these if provided and not already set
            if (fullName && !user.fullName) {
                user.fullName = fullName;
            }
            
            if (profileImageUrl) {
                user.profileImageUrl = profileImageUrl;
            }

            await user.save();
        } else {
            // Create new user with Google OAuth data
            // Generate a random secure password since they won't use password login
            const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = new User({
                fullName,
                email,
                password: hashedPassword,
                profileImageUrl,
                clerkId,
                isEmailVerified: true // Email is verified through Google
            });

            await user.save();
        }

        // Generate JWT token - same as your regular login
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.status(200).json({
            error: false,
            message: "Google authentication successful",
            user: { 
                fullName: user.fullName, 
                email: user.email,
                profileImageUrl: user.profileImageUrl
            },
            accessToken
        });
    } catch (error) {
        console.error("Google OAuth error:", error);
        res.status(500).json({
            error: true,
            message: "Authentication failed: " + error.message
        });
    }
});

// TO GET USER;
app.get("/get-user", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    const isUser = await User.findOne({ _id: userId });

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });

});

// Route to handle image upload;
app.post("/image-upload", upload.single("image"), async (req, res) => {
     try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: "No image uploaded"
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "travel_book", // optional, to organize your uploads
    });

    // Respond with the image URL
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        // Delete the travel story from the database
        await travelStory.deleteOne({ _id: id, userId: userId });

        // Extract the imageUrl and publicId from the travel story
        const imageUrl = travelStory.imageUrl;
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Assuming publicId is the last part of the URL

        // If the image is hosted on Cloudinary, delete from Cloudinary
        if (imageUrl.includes("cloudinary.com")) {
            await cloudinary.uploader.destroy(publicId);
        } else {
            // For local images (if any), delete the image file from the uploads folder
            const filename = path.basename(imageUrl);
            const filePath = path.join(__dirname, 'uploads', filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Failed to delete image file: ", err);
                }
            });
        }

        res.status(200).json({ message: "Travel Story deleted successfully!" });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }
});



// Serve static files from the uploads and the assets directory;
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// TO ADD TRAVEL STORY;
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({
            error: true,
            message: "All fields are required"
        });
    };

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();
        res.status(201).json({ story: travelStory, message: 'Added Successfully' });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});

// TO GET ALL THE TRAVEL STORIES;
app.get("/get-all-stories", authenticateToken, async (req, res) => {
    const { userId } = req.user;

    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({
            isFavourite: -1,
        });
        res.status(200).json({ stories: travelStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Edit Travel story;
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res
            .status(400)
            .json({ error: true, message: "All fields are required" });
    }

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        const placeholderImgUrl = `https://github.com/Sahilll94/Travel-Book-Backend/blob/Updated-Branch/logo.png?raw=true`;

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImgUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({ story: travelStory, message: 'Update Successful' });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: error.message
        });
    }

});


// Update isFavourite
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;
    const { userId } = req.user;

    try {
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        // Update the isFavourite property
        travelStory.isFavourite = isFavourite;

        // Save the updated travel story
        await travelStory.save();

        // Send success response
        res.status(200).json({ story: travelStory, message: "Update Successful" });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: true, message: error.message });
    }
});

// Search travel stories
app.get("/search", authenticateToken, async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(404).json({ error: true, message: "query is required" });
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: searchResults });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});

// Filter travel stories by date range
app.get("/travel-stories-filter", authenticateToken, async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        // Convert startDate and endDate from milliseconds to Date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // Find travel stories that belong to the authenticated user and fall within the date range
        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end },
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: filteredStories });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});




// To share Card
app.get('/api/story/:id', async (req, res) => {
  const storyId = req.params.id;
  
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    return res.status(400).json({ error: 'Invalid story ID format' });
  }

  try {
    const story = await TravelStory.findById(storyId); 
    if (story) {
      res.json(story);
    } else {
      res.status(404).json({ error: 'Story not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// for render activation using UptimeRobot.
app.get("/ping", (req, res) => {
  console.log("UptimeRobot ping received at", new Date().toLocaleString());
  res.status(200).send("Ping received");
});

  


const port = process.env.PORT || 4000;
app.listen(port); //Port number like "http://localhost:8000/"
module.exports = app;
