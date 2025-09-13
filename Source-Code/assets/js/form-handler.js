//index page forms
async function handleAjaxFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  const spinner = button.querySelector(".spinner-border");
  const buttonText = button.querySelector(".button-text");

  if (button) {
    button.disabled = true;
    spinner?.classList.remove("d-none");
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

    form.reset();
    const modal = bootstrap.Modal.getInstance(form.closest(".modal"));
    if (modal) modal.hide();
    await Swal.fire({
      title: "Submitted!",
      text: "Your information has been sent.",
      icon: "success",
      confirmButtonColor: "#ed9320",
    });
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

  const resumeFile = form.resume.files[0];
  if (!resumeFile) {
    Swal.fire({
      title: "Resume Required",
      text: "Please upload your resume.",
      icon: "warning",
      confirmButtonColor: "#ed9320",
    });
    return;
  }

  button.disabled = true;
  spinner.classList.remove("d-none");
  buttonText.textContent = "Submitting...";

  try {
    // Firebase Setup
    const { initializeApp } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
    );
    const { getFirestore, collection, addDoc } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );
    const { getStorage, ref, uploadBytes, getDownloadURL } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js"
    );

    const firebaseConfig = {
      apiKey: "AIzaSyAG5VgFrw7dpTVCu0OtE00HQht2HN9O2rE",
      authDomain: "tungsten-user-management.firebaseapp.com",
      projectId: "tungsten-user-management",
      storageBucket: "tungsten-user-management.firebasestorage.app",
      messagingSenderId: "81220252865",
      appId: "1:81220252865:web:693895e1d91306f1ba5040",
    };

    const app = initializeApp(firebaseConfig, "career-form-app-" + Date.now());
    const db = getFirestore(app);
    const storage = getStorage(app);

    // Upload Resume
    const storageRef = ref(storage, `resumes/${Date.now()}-${resumeFile.name}`);
    const snapshot = await uploadBytes(storageRef, resumeFile);
    const resumeUrl = await getDownloadURL(snapshot.ref);

    //  Web3Forms
    const web3FormData = new FormData();
    web3FormData.append("access_key", form.access_key.value);
    web3FormData.append("name", form.name.value);
    web3FormData.append("email", form.email.value);
    web3FormData.append("whatsapp", form.whatsapp.value);
    web3FormData.append("position", form.position.value);
    web3FormData.append("Resume Link", resumeUrl);

    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });
    const result = await web3Response.json();

    if (result.success) {
      form.reset();
      Swal.fire({
        title: "Submitted!",
        text: "Thank you for applying.",
        icon: "success",
        confirmButtonColor: "#ed9320",
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Career Form Error:", error);
    Swal.fire({
      title: "Application Error",
      text: error.message || "An error occurred.",
      icon: "error",
    });
  } finally {
    button.disabled = false;
    spinner.classList.add("d-none");
    buttonText.textContent = "SEND APPLICATION";
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const careerForm = document.getElementById("careerForm"); // Finds your form by its ID
  if (careerForm) {
    careerForm.addEventListener("submit", handleCareerFormSubmit);
  }
});

async function handleFranchiseFormSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button[type="submit"]');

  const btnContent = button.querySelector(".btn-content");
  const btnLoading = button.querySelector(".btn-loading");

  button.disabled = true;
  btnContent.classList.add("d-none");
  btnLoading.classList.remove("d-none");

  try {
    const investmentSizes = Array.from(
      form.querySelectorAll("input[name='investment_size']:checked")
    ).map((checkbox) => checkbox.value);

    const formDataForFirebase = {
      name: form.name.value,
      email: form.email.value,
      whatsapp: form.whatsapp.value,
      message: form.message.value,
      investment_size: investmentSizes,
      source: "website-franchise",
      status: "new",
      form_type: "Franchise Inquiry",
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
    const app = initializeApp(
      firebaseConfig,
      "franchise-form-app-" + Date.now()
    );
    const db = getFirestore(app);
    await addDoc(collection(db, "leads"), formDataForFirebase);

    const web3FormData = new FormData(form);

    web3FormData.set("investment_size", investmentSizes.join(", "));
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });
    const result = await web3Response.json();

    if (result.success) {
      form.reset();
      Swal.fire({
        title: "Submitted!",
        text: "Thank you for your interest! We will contact you shortly.",
        icon: "success",
        confirmButtonColor: "#ed9320",
      });
    } else {
      throw new Error(result.message);
    }
  } catch (error) {
    console.error("Franchise Form Error:", error);
    Swal.fire({
      title: "Error",
      text: error.message || "An error occurred. Please try again.",
      icon: "error",
    });
  } finally {
    button.disabled = false;
    btnContent.classList.remove("d-none");
    btnLoading.classList.add("d-none");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const franchiseForm = document.getElementById("franchiseForm");
  if (franchiseForm) {
    franchiseForm.addEventListener("submit", handleFranchiseFormSubmit);
  }
});
