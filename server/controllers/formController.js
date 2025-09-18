const { db } = require("../config/firebase");
const { collection, addDoc } = require("firebase/firestore");
const axios = require("axios");

// Load ENV variables
const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_TOKEN = process.env.WATI_ACCESS_TOKEN;
const OWNER_NUMBER1 = process.env.OWNER_NUMBER1; // your number


// Reusable function to send WhatsApp message
async function sendUserTemplate(number, name) {
  const url = `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${number}`;

  return axios.post(
    url,
    {
      template_name: "contact_confirmation",
      broadcast_name: "Form Confirmation",
      parameters: [
        { name: "1", value: name },
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

async function sendAdminTemplate(ownerNumber, name, phone, branch, createdAt) {
  const url = `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${ownerNumber}`;

  return axios.post(
    url,
    {
      template_name: "lead_notify",
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
  try {
    const { name, phone, email } = req.body;
    const dateOBJ = new Date();
    const formattedIST = dateOBJ.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const formDataForFirebase = {
      name,
      number: phone,
      email: email || "none",
      message: "Ulwe Branch Inquiry",
      branch: "Ulwe",
      source: "website",
      status: "new",
      form_type: "Ulwe Inquiry",
      createdAt: formattedIST,
      consent: {
        consentGiven: true,
        agreedAt: formattedIST,
        subscribeWhatsapp: true,
        details: "User agreed to receive WhatsApp notifications and promotional activities.",
      },
    };

    // Save to Firestore
    await addDoc(collection(db, "leads"), formDataForFirebase);

    // ✅ Send WhatsApp messages
    // 1. To sender
    // await sendUserTemplate(formDataForFirebase.number, formDataForFirebase.name)

    // 2. To website owner
    await sendAdminTemplate(OWNER_NUMBER1, formDataForFirebase.name, formDataForFirebase.number, formDataForFirebase.branch, formDataForFirebase.createdAt);

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