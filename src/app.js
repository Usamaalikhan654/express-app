const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const { json } = require("express");
require("./db/conn");
const Register = require("./models/registers");
const TourPackage = require("./models/CreateTour");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

const static_path = path.join(__dirname, "../public");
const views_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set("view engine", "hbs");
app.set("views", views_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;

    if (password === confirmpassword) {
      const registerUser = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        userRole: req.body.userRole,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: confirmpassword,
      });

      // Generate the JWT token
      const authToken = jwt.sign({ userId: registerUser._id }, "secret_key");

      registerUser.authToken = authToken; // Save the token with the user

      const registered = await registerUser.save();
      res.status(201).json({ authToken });
    } else {
      res.send("The Passwords do not match");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // Check if the user exists in the database
    const user = await Register.findOne({ email: email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    // Check if the password is correct
    if (password !== user.password) {
      return res.status(401).send("Invalid email or password");
    }

    // Generate the JWT token
    const authToken = jwt.sign({ userId: user._id }, "secret_key");

    res.status(200).json({ authToken,userRole: user.userRole  });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/logout", (req, res) => {
  // Perform any necessary logout actions
  // For example, clear the authToken from localStorage or session

  res.redirect("/"); // Redirect the user to the home page or any other page
});

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:/uploads/"); // Store images in the "uploads" folder relative to the server root
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Create a new tour package with an image upload
app.post("/create-tour", upload.single("image"), async (req, res) => {
  try {
    const newPackage = new TourPackage({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration,
      destinations: req.body.destinations,
      imageUrl: req.file ? "D:/uploads/" + req.file.filename : "", // Store the image URL in the database
    });
    const savedPackage = await newPackage.save();
    res.status(201).json(savedPackage);
  } catch (error) {
    res.status(400).json({ message: "Error creating tour package", error });
  }
});


app.get("/tour-packages", async (req, res) => {
  try {
    const tourPackages = await TourPackage.find();
    res.status(200).json(tourPackages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tour packages", error });
  }
});

app.delete("/delete-package/:id", async (req, res) => {
  try {
    const packageId = req.params.id;
    const deletedPackage = await TourPackage.findByIdAndDelete(packageId);

    if (!deletedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting package", error });
  }
});

app.put("/edit-package/:packageId", async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const updatedData = req.body; // The updated package data sent in the request body

    const updatedPackage = await TourPackage.findByIdAndUpdate(packageId, updatedData, { new: true });

    if (!updatedPackage) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error editing package", error });
  }
});

app.get("/tour-packages/:packageId", async (req, res) => {
  try {
    const packageId = req.params.packageId;
    const package = await TourPackage.findById(packageId);

    if (!package) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ message: "Error fetching package details", error });
  }
});

app.listen(port, () => {
  console.log(`Server is running at port no ${port}`);
});
