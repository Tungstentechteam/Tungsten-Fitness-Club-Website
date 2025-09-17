const { db } = require("../config/firebase");
const { collection, addDoc } = require("firebase/firestore");
const axios = require("axios");

// Load ENV variables
const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_TOKEN = process.env.WATI_ACCESS_TOKEN;
const OWNER_NUMBER = process.env.OWNER_NUMBER; // your number

console.log("WATI Token:", process.env.WATI_ACCESS_TOKEN ? "Loaded ✅" : "Missing ❌");


// Reusable function to send WhatsApp message
async function sendUserTemplate(number, name, branch) {
  const url = `${process.env.WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${number}`;

  return axios.post(
    url,
    {
      template_name: "lead_confirmation",
      broadcast_name: "Lead Confirmation",
      parameters: [
        { name: "1", value: name },
        { name: "2", value: branch },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WATI_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}

async function sendAdminTemplate(ownerNumber, name, phone, branch, createdAt) {
  const url = `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${ownerNumber}`;

  return axios.post(
    url,
    {
      template_name: "lead_notification",
      broadcast_name: "Lead Notification",
      parameters: [
        { name: "1", value: name },
        { name: "2", value: phone },
        { name: "3", value: branch },
        { name: "4", value: createdAt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${WATI_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}


exports.saveForm = async (req, res) => {
  console.log("reach");
  try {
    const { name, phone, email } = req.body;

    const formDataForFirebase = {
      name,
      number: phone,
      email: email || "none",
      message: "Ulwe Branch Inquiry",
      branch: "Ulwe",
      source: "website",
      status: "new",
      form_type: "Ulwe Inquiry",
      createdAt: new Date().toISOString(),
    };

    console.log("📩 Received form:", formDataForFirebase);

    // Save to Firestore
    await addDoc(collection(db, "leads-1"), formDataForFirebase);

    // ✅ Send WhatsApp messages
    // 1. To sender
    await sendUserTemplate(formDataForFirebase.number, formDataForFirebase.name, formDataForFirebase.branch)

    // 2. To website owner
    await sendAdminTemplate(OWNER_NUMBER, formDataForFirebase.number, formDataForFirebase.name, formDataForFirebase.branch, formDataForFirebase.createdAt);

    return res.status(200).json({
      success: true,
      message: "Saved to Firestore & WhatsApp messages sent",
      data: formDataForFirebase,
    });
  } catch (error) {
    console.error("❌ Firestore Save Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving form or sending WhatsApp",
      error: error.message,
    });
  }
};
