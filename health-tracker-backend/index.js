const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Directory to store CSV files
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

app.post("/submit", (req, res) => {
  const formData = req.body;
  const date = formData.date || new Date().toISOString().slice(0, 10);
  const filePath = path.join(dataDir, `${date}.csv`);

  const flatData = Object.entries(formData).map(([key, value]) => `${key},"${value}"`).join("\n");

  fs.writeFile(filePath, flatData, (err) => {
    if (err) {
      console.error("Failed to write CSV:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.status(200).json({ message: "Data saved successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});