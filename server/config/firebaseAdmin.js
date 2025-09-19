const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
let serviceAccountPath = "/etc/secrets/serviceAccountKey.json";

// const serviceAccount = require("./etc/secrets/serviceAccountKey.json");

// Fallback for local dev
if (!fs.existsSync(serviceAccountPath)) {
  serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  storageBucket: "tungsten-user-management.firebasestorage.app",
});

const bucket = admin.storage().bucket();

// export bucket so your controller can use it for uploads
module.exports = { bucket };