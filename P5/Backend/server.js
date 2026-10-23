require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.use(cors());
app.use(express.json());

app.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  if (typeof email !== "string" || !emailPattern.test(email)) {
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });
  }

  const msg = {
    to: email,
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
    console.log("Responding to frontend with status: 200");
    res.status(200).json({ message: "Subscribed successfully!" });
  } catch (error) {
    console.error("SendGrid error:", error.message);
    res.status(500).json({ error: "Failed to subscribe" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
