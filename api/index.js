const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const fs = require('fs');
const path = require("path");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const conversationRoute= require("./routes/conversations");
const messageRoute = require("./routes/messages");
const router = express.Router();
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  }).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (error) {
    console.error(error);
  }
});

const uploadProfilePicture = multer({
  storage: multer.memoryStorage(), // Use multer.memoryStorage() here
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'profilePicture') {
      cb(null, true);
    } else {
      cb(new Error('Invalid fieldname, please use "profilePicture"'));
    }
  }
});

router.post("/api/uploadProfilePicture", uploadProfilePicture.single("profilePicture"), async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const filename = req.file.originalname;
    const filePath = path.join(__dirname, "public/images", filename);

    // Write the file to disk
    fs.writeFile(filePath, req.file.buffer, async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error saving file' });
      }
      user.profilePicture = filename;
      await user.save();
      res.status(200).json(user);
    }); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading profile picture' });
  } 
});

app.use("/api", router);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);

app.listen(5500, () => {  
  console.log("Backend server is running!");
});

