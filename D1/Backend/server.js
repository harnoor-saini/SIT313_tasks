require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const app = express();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const availablePlans = {
  education: 199,
  pro: 399,
  premium: 699,
};

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

app.use(cors());
app.use(express.json());

// Check JWT authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication token is required.",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token || !process.env.JWT_SECRET) {
    return res.status(401).json({
      error: "Invalid authentication token.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid or expired authentication token.",
    });
  }
}

// Home route
app.get("/", (req, res) => {
  res.send("DEV@Deakin backend is running.");
});

// Register a new user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      error: "Name, email and password are required.",
    });
  }

  if (name.trim().split(/\s+/).length < 2) {
    return res.status(400).json({
      error: "Please enter your first and last name.",
    });
  }

  if (!emailPattern.test(email.trim())) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters.",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUsers = await db
      .collection("users")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!existingUsers.empty) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      plan: "free",
      selectedPlan: null,
      createdAt: FieldValue.serverTimestamp(),
    };

    const userRef = await db.collection("users").add(userData);

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: userRef.id,
        name: userData.name,
        email: userData.email,
        plan: userData.plan,
        selectedPlan: userData.selectedPlan,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);

    return res.status(500).json({
      error: "Failed to register. Please try again.",
    });
  }
});

// Login an existing user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    !emailPattern.test(email.trim()) ||
    typeof password !== "string" ||
    !password
  ) {
    return res.status(400).json({
      error: "A valid email and password are required.",
    });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();

    const result = await db
      .collection("users")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (result.empty) {
      return res.status(401).json({
        error: "Incorrect email or password.",
      });
    }

    const userDoc = result.docs[0];
    const userData = userDoc.data();

    const passwordMatches = await bcrypt.compare(password, userData.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Incorrect email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: "Server authentication is not configured.",
      });
    }

    const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        plan: userData.plan || "free",
        selectedPlan: userData.selectedPlan || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      error: "Failed to log in. Please try again.",
    });
  }
});

// Get the current user's account and plan
app.get("/me", authenticateToken, async (req, res) => {
  try {
    const userDoc = await db.collection("users").doc(req.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        error: "User account not found.",
      });
    }

    const userData = userDoc.data();

    return res.status(200).json({
      user: {
        id: userDoc.id,
        name: userData.name,
        email: userData.email,
        plan: userData.plan || "free",
        selectedPlan: userData.selectedPlan || null,
      },
    });
  } catch (error) {
    console.error("Get current user error:", error.message);

    return res.status(500).json({
      error: "Failed to retrieve user information.",
    });
  }
});

// Buy a paid plan (only one plan can be bought)
app.post("/upgrade", authenticateToken, async (req, res) => {
  const { plan } = req.body;

  if (
    typeof plan !== "string" ||
    !Object.prototype.hasOwnProperty.call(availablePlans, plan)
  ) {
    return res.status(400).json({ error: "Please choose a valid plan." });
  }

  try {
    const userRef = db.collection("users").doc(req.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User account was not found." });
    }

    if (userDoc.data().plan === "paid") {
      return res.status(409).json({ error: "You are already on a paid plan." });
    }

    await userRef.update({
      plan: "paid",
      selectedPlan: plan,
      planPrice: availablePlans[plan],
      planUpdatedAt: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: "Your demo subscription has been activated.",
      user: { plan: "paid", selectedPlan: plan },
    });
  } catch (error) {
    console.error("Upgrade error:", error.message);

    return res.status(500).json({ error: "Unable to update your subscription." });
  }
});

// Save a post
app.post("/posts", authenticateToken, async (req, res) => {
  const { type, title, description, abstract, articleText, tags } = req.body;

  if (type !== "question" && type !== "article") {
    return res.status(400).json({ error: "Post type must be question or article." });
  }

  if (typeof title !== "string" || title.trim().length < 5) {
    return res.status(400).json({ error: "Title must be at least 5 characters." });
  }

  if (
    type === "question" &&
    (typeof description !== "string" || description.trim().length < 20)
  ) {
    return res.status(400).json({ error: "Description must be at least 20 characters." });
  }

  if (
    type === "article" &&
    (typeof abstract !== "string" || abstract.trim().length < 20)
  ) {
    return res.status(400).json({ error: "Abstract must be at least 20 characters." });
  }

  if (
    type === "article" &&
    (typeof articleText !== "string" || articleText.trim().length < 50)
  ) {
    return res.status(400).json({ error: "Article text must be at least 50 characters." });
  }

  if (
    !Array.isArray(tags) ||
    tags.length < 1 ||
    tags.length > 3 ||
    tags.some((tag) => typeof tag !== "string" || !tag.trim() || tag.trim().length > 20)
  ) {
    return res.status(400).json({ error: "Please add 1 to 3 tags, each up to 20 characters." });
  }

  try {
    const userDoc = await db.collection("users").doc(req.userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User account not found." });
    }

    const postData = {
      type,
      title: title.trim(),
      tags: tags.map((tag) => tag.trim()),
      authorId: req.userId,
      authorName: userDoc.data().name,
      createdAt: FieldValue.serverTimestamp(),
    };

    if (type === "question") {
      postData.description = description.trim();
    } else {
      postData.abstract = abstract.trim();
      postData.articleText = articleText.trim();
    }

    await db.collection("posts").add(postData);

    return res.status(201).json({ message: "Post saved successfully." });
  } catch (error) {
    console.error("Save post error:", error.message);

    return res.status(500).json({ error: "Failed to save the post." });
  }
});

// Newsletter subscription
app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (typeof email !== "string" || !emailPattern.test(email.trim())) {
    return res.status(400).json({
      error: "Please enter a valid email address.",
    });
  }

  if (!process.env.SENDGRID_API_KEY) {
    return res.status(500).json({
      error: "Newsletter service is not configured.",
    });
  }

  const msg = {
    to: email.trim(),
    from: "harnoorsaini17@gmail.com",
    subject: "Welcome to my Newsletter!",
    html: `<h2>Hey, Thanks for Subscribing!</h2>
        <p>Welcome! I'll share my latest projects and coding tips with you.</p>
        <p>Stay tuned!</p>
        <p>- Harnoor</p>`,
  };

  try {
    const [response] = await sgMail.send(msg);

    console.log("SendGrid status:", response.statusCode);

    return res.status(200).json({
      message: "Subscribed successfully!",
    });
  } catch (error) {
    console.error("SendGrid error:", error.message);

    return res.status(500).json({
      error: "Failed to subscribe.",
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});