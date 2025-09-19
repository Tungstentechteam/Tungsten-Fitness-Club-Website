const admin = require("firebase-admin");

const serviceAccount = require("./etc/secrets/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),

  storageBucket: "tungsten-user-management.firebasestorage.app",
});

const bucket = admin.storage().bucket();

// export bucket so your controller can use it for uploads
module.exports = { bucket };