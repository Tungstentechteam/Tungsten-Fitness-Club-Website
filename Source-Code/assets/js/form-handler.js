//index page form
async function handleAjaxFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  const spinner = button.querySelector(".spinner-border");
  const buttonText = button.querySelector(".button-text");
  const fullLoader = document.getElementById("fullScreenLoader");

  if (button) {
    button.disabled = true;
    spinner?.classList.remove("d-none");
    fullLoader?.classList.remove("d-none");
    buttonText && (buttonText.textContent = "Submitting...");
  }

  try {
    //logic for firebase and web3
    const formDataForFirebase = {
      name: form.name.value,
      email: form?.email?.value || "none",
      whatsapp: form.whatsapp.value,
      message: form.message.value,
      branch: form?.branch ? form.branch.value : "N/A",
      source: "website",
      status: "new",
      form_type: form.form_type ? form.form_type.value : "Contact Form",
      createdAt: new Date().toISOString(),
    };

    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
    );
    const { getFirestore, collection, addDoc } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );
    const firebaseConfig = {
      apiKey: "AIzaSyAG5VgFrw7dpTVCu0OtE00HQht2HN9O2rE",
      authDomain: "tungsten-user-management.firebaseapp.com",
      projectId: "tungsten-user-management",
      storageBucket: "tungsten-user-management.firebasestorage.app",
      messagingSenderId: "81220252865",
      appId: "1:81220252865:web:693895e1d91306f1ba5040",
    };
    const app = initializeApp(firebaseConfig, "form-handler-app-" + Date.now());
    const db = getFirestore(app);
    await addDoc(collection(db, "leads"), formDataForFirebase);

    const web3FormData = new FormData(form);
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });
    if (!web3Response.ok) throw new Error("Web3Forms submission failed");

    await Swal.fire({
      title: "Submitted!",
      text: "Thank you for submitting your request.",

      title: "Success!",
      text: "Your information has been submitted successfully. We'll contact you shortly!",

      icon: "success",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "var(--accent-color)",

      customClass: {
        popup: "premium-popup",
        title: "premium-title",
        htmlContainer: "premium-text",
        confirmButton: "premium-btn",
      },
      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    });
    form.reset();
    const modal = bootstrap.Modal.getInstance(form.closest(".modal"));
    if (modal) modal.hide();

    setTimeout(() => {
      fullLoader?.classList.add("d-none");
      document.body.style.overflow = "auto";
    }, 1500);
  } catch (error) {
    console.error("ERROR BLOCK:", error);
    Swal.fire({
      title: "Error!",
      text: "Something went wrong.",
      icon: "error",
    });
  } finally {
    if (button) {
      button.disabled = false;
      spinner?.classList.add("d-none");

      fullLoader.classList.add("d-none");
      document.body.style.overflow = "auto";

      fullLoader.classList.add("d-none");

      buttonText && (buttonText.textContent = "Start My Journey");
    }
    document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("submit", function (event) {
  if (event.target.matches(".ajax-contact-form")) {
    handleAjaxFormSubmit(event);
  }
});

// Career form
async function handleCareerFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  const spinner = button.querySelector(".spinner-border");
  const buttonText = button.querySelector(".button-text");
  const fullLoader = document.getElementById("fullScreenLoader");

  const resumeFile = form.resume.files[0];
  if (!resumeFile) {
    return Swal.fire({
      title: "Resume Required",
      text: "Please upload your resume before submitting.",
      icon: "warning",
      confirmButtonColor: "var(--accent-color)",
    });
  }

  button.disabled = true;
  spinner?.classList.remove("d-none");
  if (buttonText) buttonText.textContent = "Submitting...";
  if (fullLoader) fullLoader.classList.remove("d-none");
  document.body.style.overflow = "hidden";

  try {
    const apiFormData = new FormData(form);
    const response = await fetch(
      "https://tungsten-fitness-club-website.onrender.com/api/forms/career",
      {
        method: "POST",
        body: apiFormData,
      }
    );

    if (!response.ok) {
      throw new Error(`Server Error: ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || "Backend API returned an error.");
    }

    const resumeUrl = result.resumeUrl;
    const web3FormData = new FormData(form);
    web3FormData.delete("resume");
    web3FormData.append("resume_url", resumeUrl);

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });

    const web3Result = await web3Response.json();

    if (web3Result.success) {
      form.reset();
      Swal.fire({
        title: "Submitted!",
        text: "Thank you for applying! We'll review your application and contact you soon.",
        icon: "success",
        background: "var(--surface-color)",
        color: "var(--default-color)",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--accent-color)",
        iconColor: "#e74c3c",
      });
    } else {
      console.warn("Web3Forms backup submission failed:", web3Result.message);
      form.reset();
      Swal.fire({
        title: "Submitted!",
        text: "Thank you for applying. We'll review your application and contact you soon.",
        icon: "success",
        confirmButtonColor: "var(--accent-color)",
      });
    }
  } catch (error) {
    console.error("Career Form Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Error submitting form. Please try again or contact us directly.",
      icon: "error",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "Try Again",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
  } finally {
    button.disabled = false;
    spinner?.classList.add("d-none");
    if (buttonText) buttonText.textContent = "SEND APPLICATION";
    if (fullLoader) fullLoader.classList.add("d-none");
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const careerForm = document.getElementById("careerForm");
  if (careerForm) {
    careerForm.addEventListener("submit", handleCareerFormSubmit);
  }
});

//Franchise Form

async function handleFranchiseFormSubmit(event) {
  // Prevent the default browser action of reloading the page
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  const btnContent = button.querySelector(".btn-content");
  const btnLoading = button.querySelector(".btn-loading");
  const fullLoader = document.getElementById("fullScreenLoader");

  button.disabled = true;
  btnContent.classList.add("d-none");
  btnLoading.classList.remove("d-none");
  if (fullLoader) fullLoader.classList.remove("d-none");
  document.body.style.overflow = "hidden";

  try {
    const investmentSizes = Array.from(
      form.querySelectorAll("input[name='investment_size']:checked")
    ).map((checkbox) => checkbox.value);

    const formDataObject = {
      name: form.name.value,
      email: form.email.value,
      whatsapp: form.whatsapp.value,
      message: form.message.value,
      investment_size: investmentSizes,
      page_name: form.page_name.value,
    };

    //backend api
    const response = await fetch(
      "https://tungsten-fitness-club-website.onrender.com/api/forms/franchise",
      {
        // Use your production or local URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formDataObject),
      }
    );
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Submission to our server failed.");
    }

    const web3FormData = new FormData(form);

    web3FormData.set("investment_size", investmentSizes.join(", "));
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });
    if (!web3Response.ok) {
      console.warn("Web3Forms backup submission failed.");
    }

    // --- ON SUCCESS ---
    form.reset();
    await Swal.fire({
      title: "Submitted!",
      text: "Thank you for your interest! Our franchise team will contact you shortly.",
      icon: "success",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
  } catch (error) {
    console.error("Franchise Form Submission Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Error submitting form. Please try again or contact us directly.",
      icon: "error",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "Try Again",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
  } finally {
    button.disabled = false;
    btnContent.classList.remove("d-none");
    btnLoading.classList.add("d-none");
    if (fullLoader) fullLoader.classList.add("d-none");
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const franchiseForm = document.getElementById("franchiseForm");
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", handleFranchiseFormSubmit);
  }
});
//ulwe form
async function handleUlweFormSubmit(event) {
  event.preventDefault();
  console.log("object");
  const form = event.target;
  const button = form.querySelector(".button-text");
  const spinner = form.querySelector(".spinner-border");
  const fullLoader = document.getElementById("fullScreenLoader");

  button.textContent = "Submitting...";
  button.disabled = true;
  spinner.classList.remove("d-none");
  if (fullLoader) fullLoader.classList.remove("d-none");
  document.body.style.overflow = "hidden";

  try {
    // 1. Save in Firestore (via backend)
    const response = await fetch(
      "https://tungsten-fitness-club-website.onrender.com/api/forms/ulwe",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          phone: form.phone.value,
          email: "none",
        }),
      }
    );

    console.log(response);

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message);
    }

    // 2. Submit to Web3Forms (directly from frontend)
    const web3FormData = new FormData(form);
    web3FormData.append("access_key", "71282d82-2443-4652-a722-8f2be9ddf033");
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });
    const web3Result = await web3Response.json();

    if (!web3Result.success) {
      throw new Error(web3Result.message || "Web3Forms failed");
    }

    // 3. UI Feedback
    form.reset();
    const modal = bootstrap.Modal.getInstance(form.closest(".modal"));
    if (modal) modal.hide();

    Swal.fire({
      title: "Submitted",
      text: "Your Ulwe branch inquiry has been submitted successfully.",
      icon: "success",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "var(--accent-color)",
    });
  } catch (error) {
    console.error("Ulwe Form Error:", error);
    Swal.fire({
      title: "Error!",
      text: "Error submitting form. Please try again or contact us directly.",
      icon: "error",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "Try Again",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
  } finally {
    spinner.classList.add("d-none");
    button.textContent = "Submit";
    button.disabled = false;
    if (fullLoader) fullLoader.classList.add("d-none");
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const ulweForm = document.getElementById("ulweBranchForm");
  if (ulweForm) {
    ulweForm.addEventListener("submit", handleUlweFormSubmit);
  }
});