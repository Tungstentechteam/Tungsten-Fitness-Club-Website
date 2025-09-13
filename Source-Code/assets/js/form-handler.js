document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contactForm");
  const contactModalEl = document.getElementById("contactModal");

  if (contactForm && contactModalEl) {
    const contactModal = new bootstrap.Modal(contactModalEl);

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const form = event.target;
      const button = form.querySelector('button[type="submit"]');
      const spinner = button.querySelector(".spinner-border");
      const buttonText = button.querySelector(".button-text");

      button.disabled = true;
      spinner.classList.remove("d-none");
      buttonText.textContent = "Submitting...";

      try {
        const formDataForFirebase = {
          name: form.name.value,
          email: form?.email?.value || "none",
          whatsapp: form.whatsapp.value,
          message: form.message.value,
          branch: form?.branch ? form.branch.value : "N/A",
          source: "website",
          status: "new",
          form_type: form.form_type ? form.form_type.value : "N/A",
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
          "contact-form-app-" + Date.now()
        );
        const db = getFirestore(app);
        await addDoc(collection(db, "leads"), formDataForFirebase);

        const web3FormData = new FormData(form);
        const web3Response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: web3FormData,
        });
        if (!web3Response.ok) throw new Error("Web3Forms submission failed");

        form.reset();
        contactModal.hide();
        await Swal.fire({
          title: "Submitted!",
          text: "Your information has been sent.",
          icon: "success",
          confirmButtonColor: "#ed9320",
        });
      } catch (error) {
        console.error("ERROR BLOCK: The script failed with an error.", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
        });
      } finally {
        button.disabled = false;
        spinner.classList.add("d-none");
        buttonText.textContent = "Start My Journey";

        document
          .querySelectorAll(".modal-backdrop")
          .forEach((el) => el.remove());

        document.body.classList.remove("modal-open");

        document.body.style.overflow = "auto";
      }
    });
  }
});
