// /config/firebaseConfig.js

const admin = require("firebase-admin");
const path = require("path");
require("dotenv").config();

const serviceAccount = path.resolve(__dirname, "firebase-admin-sdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const messaging = admin.messaging();

module.exports = messaging;
