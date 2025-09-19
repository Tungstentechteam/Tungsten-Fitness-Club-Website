const { db } = require("../config/firebase");
const { bucket } = require("../config/firebaseAdmin"); // Required for resume uploads
const { collection, addDoc } = require("firebase/firestore");
const axios = require("axios");
// Wati api configs
const WATI_BASE_URL = process.env.WATI_BASE_URL;
const WATI_TOKEN = process.env.WATI_ACCESS_TOKEN;
const OWNER_NUMBER1 = process.env.OWNER_NUMBER2;
//to return formatted time
const getFormattedDate = () =>
  new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

/** wati templates paramaters the type of parameters
 @param {string} number 
  @param {string} templateName 
  @param {string} broadcastName 
 @param {Array<Object>} parameters 
**/
// function to send wati templates(different for different forms)
async function sendWatiTemplate(
  number,
  templateName,
  broadcastName,
  parameters
) {
  const url = `${WATI_BASE_URL}/api/v1/sendTemplateMessage?whatsappNumber=${number}`;
  const headers = {
    Authorization: `Bearer ${WATI_TOKEN}`,
    "Content-Type": "application/json",
  };
  const body = {
    template_name: templateName,
    broadcast_name: broadcastName,
    parameters: parameters,
  };
  //post request to wati api
  return axios.post(url, body, { headers });
}

//Form Controllers

//ulwe form controller
exports.saveForm = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const formattedIST = getFormattedDate();
    //data passed to firebase
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
        details:
          "User agreed to receive WhatsApp notifications and promotional activities.",
      },
    };
    //save to firestore
    await addDoc(collection(db, "leads-1"), formDataForFirebase);

    //wati
    // to user who submitted the form
    await sendWatiTemplate(
      phone,
      "contact_confirmation", // Template for the user
      "Form Confirmation",
      [{ name: "1", value: name }]
    );

    //to the website owner/admin
    await sendWatiTemplate(
      OWNER_NUMBER1,
      "lead_notify", // Template for the admin
      "Lead Notification",
      [
        { name: "1", value: name },
        { name: "2", value: phone },
        { name: "3", value: "Ulwe" },
        { name: "4", value: formattedIST },
      ]
    );
    //error handling
    return res.status(200).json({
      success: true,
      message: "Saved to Firestore & WhatsApp messages sent",
      data: formDataForFirebase,
    });
  } catch (error) {
    console.error("❌ Ulwe Form Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving Ulwe form or sending WhatsApp",
      error: error.message,
    });
  }
};

//franchise form
exports.saveFranchiseForm = async (req, res) => {
  try {
    const { name, email, whatsapp, message, investment_size, page_name } =
      req.body;
    const formattedIST = getFormattedDate();
    //firestore data
    const formData = {
      name,
      email: email || "none",
      number: whatsapp,
      message: message || "none",
      investment_size,
      source: "website",
      status: "new",
      form_type: page_name || "Franchise Inquiry",
      createdAt: formattedIST,
      consent: {
        consentGiven: true,
        agreedAt: formattedIST,
        subscribeWhatsapp: true,
        details:
          "User agreed to receive WhatsApp notifications and promotional activities.",
      },
    };

    await addDoc(collection(db, "leads"), formData);
    await sendWatiTemplate(
      whatsapp,
      "franchise_confirmation", //  new template for applicants
      "Application Received",
      [{ name: "1", value: name }]
    );

    await sendWatiTemplate(
      OWNER_NUMBER1,
      "franchise_confirmation_admin", //  create a new template
      "Franchise Lead Notification",
      [
        { name: "1", value: name },
        { name: "2", value: whatsapp },
        { name: "3", value: formData.form_type },
        { name: "4", value: formattedIST },
      ]
    );

    // error handling
    res.status(200).json({
      success: true,
      message: "Saved to firestore ",
      data: formData,
    });
  } catch (error) {
    console.error("❌ Franchise Form Error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing franchise form.",
      error: error.message,
    });
  }
};

//career form
exports.saveCareerForm = async (req, res) => {
  try {
    const { name, email, whatsapp, position, page_name } = req.body;
    const resumeFile = req.file;
    //check whether resume is present
    if (!resumeFile) {
      return res
        .status(400)
        .json({ success: false, message: "Resume file is required." });
    }
    // name to store for storage
    const uniqueFileName = `Tungsten-Website/resumes/${Date.now()}-${
      resumeFile.originalname
    }`;
    //file reference in firebase storage bucket
    const fileUpload = bucket.file(uniqueFileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: resumeFile.mimetype },
    });
    //hanlde file upload error
    blobStream.on("error", (error) => {
      console.error("Storage Upload Error:", error);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "File upload failed.",
          error: error.message,
        });
      }
    });
    //successful upload
    blobStream.on("finish", async () => {
      try {
        //make file public and generate url
        await fileUpload.makePublic();
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;
        const formattedIST = getFormattedDate();
        //form data
        const formData = {
          name,
          email: email || "none",
          number: whatsapp,
          position,
          resumeUrl: publicUrl,
          form_type: page_name || "Career Application",
          source: "website-career",
          status: "new",
          createdAt: formattedIST,
        };
        await addDoc(collection(db, "leads-1"), formData);

        await sendWatiTemplate(
          whatsapp,
          "lead_notify", //  new template for applicants
          "Application Received",
          [{ name: "1", value: name }]
        );

        await sendWatiTemplate(
          OWNER_NUMBER1,
          "lead_notify", //new template for admin
          "New Career Applicant",
          [
            { name: "1", value: name },
            { name: "2", value: whatsapp },
            { name: "3", value: position },
            { name: "4", value: formattedIST },
          ]
        );
        //error handling ,sending response back to frontend
        if (!res.headersSent) {
          res.status(200).json({
            success: true,
            message: "Applicattion data sent",
            resumeUrl: publicUrl,
            data: formData,
          });
        }
      } catch (finishError) {
        console.error("❌ Error after file upload:", finishError);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Error saving application data.",
            error: finishError.message,
          });
        }
      }
    });

    blobStream.end(resumeFile.buffer);
  } catch (error) {
    console.error("❌ Career Form Error (Outer):", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error processing career form.",
        error: error.message,
      });
    }
  }
};