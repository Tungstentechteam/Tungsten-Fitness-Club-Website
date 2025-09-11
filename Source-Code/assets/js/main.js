/**
 * Template Name: NiceSchool
 * Template URL: https://bootstrapmade.com/nice-school-bootstrap-education-template/
 * Updated: May 10 2025 with Bootstrap v5.3.6
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      offset: 100, // Offset (in px) from the original trigger point
      delay: 100, // Delay animation (in ms)
      duration: 600,
      once: true,
      mirror: false,
    });
    // Additional fix for mobile viewport
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      document
        .querySelector('meta[name="viewport"]')
        .setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        );
    }
  }
  window.addEventListener("load", aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            if (typeof aosInit === "function") {
              aosInit();
            }
          },
          false
        );
      });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });
})();

/**
 * Contact form send email
 */

function closeForm() {
  document.getElementById("contactForm").style.display = "none";
}

function openForm() {
  document.getElementById("contactForm").style.display = "block";
  window.scrollTo(0, document.getElementById("contactForm").offsetTop);
}

document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".video-carousel .card");
  document.getElementById("totalSlides").textContent = slides.length;
});

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("videoCarousel");
  const cards = carousel.querySelectorAll(".video-card");
  const totalSlides = cards.length;
  const currentSlideEl = document.getElementById("currentSlide");

  let currentSlide = 1;

  function autoScroll() {
    if (currentSlide >= totalSlides) {
      currentSlide = 1;
      carousel.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      currentSlide++;
      carousel.scrollTo({
        left: carousel.offsetWidth * (currentSlide - 1),
        behavior: "smooth",
      });
    }

    currentSlideEl.textContent = currentSlide;
  }

  setInterval(autoScroll, 3000);
});

function openVideoModal(videoUrl) {
  const modalVideo = document.getElementById("modalVideo");
  const source = modalVideo.querySelector("source");
  source.src = videoUrl;
  modalVideo.load();

  const modal = new bootstrap.Modal(document.getElementById("test-videoModal"));
  modal.show();

  // Play the video when modal opens
  modalVideo.onloadeddata = function () {
    modalVideo.play();
  };

  // Reset video when modal closes
  document
    .getElementById("test-videoModal")
    .addEventListener("hidden.bs.modal", function () {
      modalVideo.pause();
      modalVideo.currentTime = 0;
    });
}

AOS.init();

// testimonial-masonry
document.addEventListener("DOMContentLoaded", function () {
  const masonry = document.querySelector(".testimonial-masonry");
  const items = document.querySelectorAll(".testimonial-item");
  const indexEl = document.getElementById("testimonial-index");
  const totalEl = document.getElementById("testimonial-total");

  totalEl.textContent = items.length;

  // Function to detect the visible item
  function updateVisibleIndex() {
    let closestIndex = 0;
    let closestOffset = Infinity;

    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const offset = Math.abs(rect.left);

      if (offset < closestOffset) {
        closestOffset = offset;
        closestIndex = i;
      }
    });

    indexEl.textContent = closestIndex + 1;
  }

  // Add scroll listener
  masonry.addEventListener("scroll", () => {
    requestAnimationFrame(updateVisibleIndex);
  });

  // Initial call
  updateVisibleIndex();
});

// home model form contact firebase  function

window.saveForm = async function (event) {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector('button[type="submit"]');
  const spinner = button.querySelector(".spinner-border");
  const buttonText = button.querySelector(".button-text");
  const successMessage = form.querySelector(".successMessage");
  const fullLoader = document.getElementById("fullScreenLoader");

  // 1️⃣ Show loader
  spinner?.classList.remove("d-none");
  buttonText && (buttonText.textContent = "Submitting...");
  button.disabled = true;
  fullLoader?.classList.remove("d-none");
  successMessage?.classList.add("d-none");

  // 2️⃣ Collect form data
  const formDataForFirebase = {
    name: form.name.value,
    email: form?.email?.value || "none",
    whatsapp: form.whatsapp.value,
    message: form.message.value,
    branch: form?.branch ? form.branch.value : "N/A", // ✅ fix
    source: "website",
    status: "new",
    form_type: form.form_type ? form.form_type.value : "N/A",
    consent: {
      whatsapp_updates: true,
      agreedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
  };

  try {
    // --- Firebase Setup ---
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
      databaseURL:
        "https://tungsten-user-management-default-rtdb.firebaseio.com/",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    await addDoc(collection(db, "leads"), formDataForFirebase);

    // --- Web3Forms Submission ---
    const web3FormData = new FormData(form);
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });

    if (!web3Response.ok) throw new Error("Web3Forms submission failed");

    // ✅ Success Popup with SweetAlert2
    Swal.fire({
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

    setTimeout(() => {
      fullLoader?.classList.add("d-none");
      document.body.style.overflow = "auto";
    }, 1500);
  } catch (error) {
    console.error("Form submission error:", error);
    
    // Error Popup with SweetAlert2
    Swal.fire({
      title: "Error!",
      text: "Something went wrong. Please try again or contact us directly.",
      icon: "error",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "Try Again",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
    
    fullLoader?.classList.add("d-none");
  } finally {
    // Reset button state
    spinner?.classList.add("d-none");
    buttonText && (buttonText.textContent = "Start My Journey");
    button.disabled = false;
  }
};

window.saveUlweForm = async function (event) {
  event.preventDefault();

  const form = event.target;
  const button = form.querySelector("button[type='submit']");
  const spinner = button.querySelector(".spinner-border");
  const btnText = button.querySelector(".btn-text");
    const fullLoader = document.getElementById("fullScreenLoader");


  // Show loader + disable
  spinner?.classList.remove("d-none");
    fullLoader?.classList.remove("d-none");

  if (btnText) btnText.textContent = "Submitting...";
  button.disabled = true;

  // Collect data safely
  const nameEl = form.elements["name"];
  const phoneEl = form.elements["phone"];
  const formTypeEl = form.elements["form_type"];

  const formDataForFirebase = {
    name: nameEl?.value?.trim() || "",
    number: phoneEl?.value?.trim() || "",
    email: "none",
    message: "Ulwe Branch Inquiry",
    branch: "Ulwe",
    source: "website",
    status: "new",
    form_type: formTypeEl?.value || "Ulwe Inquiry",
    createdAt: new Date().toISOString(),
  };

  try {
    // --- Firebase (non-blocking: if it fails, we still try Web3Forms) ---
    try {
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
        databaseURL:
          "https://tungsten-user-management-default-rtdb.firebaseio.com/",
      };

      if (!window.firebaseApp) {
        window.firebaseApp = initializeApp(firebaseConfig);
      }
      const db = getFirestore(window.firebaseApp);
      await addDoc(collection(db, "leads"), formDataForFirebase);
    } catch (fbErr) {
      console.warn("Firebase failed, continuing with Web3Forms:", fbErr);
    }

    // --- Web3Forms (must succeed) ---
    const web3Res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: new FormData(form),
    });

    const web3Data = await web3Res.json();
    if (!web3Data.success)
      throw new Error(web3Data.message || "Web3Forms submission failed");

    // Success UI with SweetAlert2
    Swal.fire({
      title: "Thank You!",
      text: "Your Ulwe branch inquiry has been submitted successfully.",
      icon: "success",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "var(--accent-color)",
    });

    form.reset();

    setTimeout(() => {
      const modalEl = document.getElementById("ulweBranchModal");
      if (modalEl) {
        // In case no instance exists yet, create one before hiding
        let modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (!modalInstance) modalInstance = new bootstrap.Modal(modalEl);
        modalInstance.hide();
      }

      // Clean up any leftover backdrop/scroll lock
      document.querySelectorAll(".modal-backdrop").forEach((b) => b.remove());
      document.body.classList.remove("modal-open");
            fullLoader?.classList.add("d-none");

      document.body.style.overflow = "auto";
    }, 1500);
  } catch (err) {
    console.error("Ulwe form error:", err);
    
    // Error Popup with SweetAlert2
    Swal.fire({
      title: "Error!",
      text: "Submission failed. Please try again or contact us directly.",
      icon: "error",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "Try Again",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
  } finally {
    // Always restore button
    spinner?.classList.add("d-none");
    if (btnText) btnText.textContent = "Submit";
    button.disabled = false;
  }
};

window.saveFormfranchise = async function (event) {
  event.preventDefault();
  const form = event.target;
  const button = form.querySelector("button[type='submit']");
  const btnContent = button.querySelector(".btn-content");
  const btnLoading = button.querySelector(".btn-loading");
  const fullLoader = document.getElementById("fullScreenLoader");
  const successMessage = document.getElementById("successMessage");

  // Show loaders
  btnContent.classList.add("d-none");
  btnLoading.classList.remove("d-none");
  button.disabled = true;
  if (fullLoader) fullLoader.classList.remove("d-none");
  document.body.style.overflow = "hidden";

  try {
    // Collect selected checkboxes
    const investmentSizes = Array.from(
      form.querySelectorAll("input[name='investment_size']:checked")
    ).map((cb) => cb.value);

    // Firebase + Web3Forms logic
    const formDataForFirebase = {
      name: form.name.value,
      email: form.email.value,
      whatsapp: form.whatsapp.value,
      message: form.message.value,
      investment_size: investmentSizes,
      form_type: "Lead Franchise",
      consent: {
        whatsapp_updates: true,
        agreedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    // Firebase setup
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
      databaseURL:
        "https://tungsten-user-management-default-rtdb.firebaseio.com/",
    };

    const app = initializeApp(firebaseConfig, "franchise-" + Date.now());
    const db = getFirestore(app);

    await addDoc(collection(db, "leads"), formDataForFirebase);

    // Submit to Web3Forms
    const web3FormData = new FormData(form);
    const web3Response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: web3FormData,
    });

    if (web3Response.ok) {
      // Success Popup with SweetAlert2
      Swal.fire({
        title: "Franchise Inquiry Received!",
        text: "Thank you for your interest in our franchise program. We'll contact you shortly.",
        icon: "success",
        background: "var(--surface-color)",
        color: "var(--default-color)",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--accent-color)",
        iconColor: "var(--accent-color)",
      });

      form.reset();
    } else {
      throw new Error("Web3Forms submission failed");
    }
  } catch (error) {
    console.error("Error:", error);
    
    // Error Popup with SweetAlert2
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
    // Reset UI
    btnContent.classList.remove("d-none");
    btnLoading.classList.add("d-none");
    button.disabled = false;
    if (fullLoader) fullLoader.classList.add("d-none");
    document.body.style.overflow = "auto";
  }
};

// career
window.saveCareerForm = async function (event) {
  event.preventDefault();
  const form = event.target;

  const button = form.querySelector('button[type="submit"]');
  const successMessage = document.getElementById("successMessage");
  const spinner = button.querySelector(".spinner-border");
  const buttonText = button.querySelector(".button-text");

  // ✅ FIX: define loader element
  const fullLoader = document.getElementById("fullScreenLoader");

  const resumeFile = form.resume.files[0];
  if (!resumeFile) {
    // Alert with SweetAlert2
    Swal.fire({
      title: "Resume Required",
      text: "Please upload your resume before submitting.",
      icon: "warning",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "OK",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#f39c12",
    });
    return;
  }

  // --- Show loaders ---
  button.disabled = true;
  spinner.classList.remove("d-none");
  buttonText.textContent = "Submitting...";
  fullLoader.classList.remove("d-none"); // ✅ now works
  document.body.style.overflow = "hidden";

  try {
    // --- Firebase Setup (Dynamic Imports) ---
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
      databaseURL:
        "https://tungsten-user-management-default-rtdb.firebaseio.com/",
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const storage = getStorage(app);

    // --- 1. Upload Resume (This is the step that requires the CORS fix) ---
    const storageRef = ref(storage, `resumes/${Date.now()}-${resumeFile.name}`);
    const snapshot = await uploadBytes(storageRef, resumeFile);
    const resumeUrl = await getDownloadURL(snapshot.ref);

    // --- 2. Save Data to Firestore ---
    const formDataForFirebase = {
      name: form.name.value,
      email: form.email.value,
      whatsapp: form.whatsapp.value,

      position: form.position.value,
      resume: resumeUrl,
      source: "website",
      status: "new",
      form_type: form.page_name.value,
      consent: {
        whatsapp_updates: true, // ✅ user agrees since text is shown
        agreedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, "leads"), formDataForFirebase);

    // --- 3. Send Email Notification ---
    const web3FormData = new FormData();
    web3FormData.append("access_key", form.access_key.value);
    web3FormData.append("page_name", form.page_name.value);
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
    console.log("Web3Forms response:", result);

    if (web3Response.ok) {
      console.log("Email sent successfully!");
      
      // Success Popup with SweetAlert2
      Swal.fire({
        title: "Application Submitted!",
        text: "Thank you for applying. We'll review your application and contact you soon.",
        icon: "success",
        background: "var(--surface-color)",
        color: "var(--default-color)",
        confirmButtonText: "OK",
        confirmButtonColor: "var(--accent-color)",
        iconColor: "var(--accent-color)",
      });
      
      form.reset();
    } else {
      throw new Error("Email submission failed: " + JSON.stringify(result));
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    
    // Error Popup with SweetAlert2
    Swal.fire({
      title: "Application Error",
      text: "An error occurred while submitting your application. Please try again.",
      icon: "error",
      background: "var(--surface-color)",
      color: "var(--default-color)",
      confirmButtonText: "Try Again",
      confirmButtonColor: "var(--accent-color)",
      iconColor: "#e74c3c",
    });
  } finally {
    button.disabled = false;
    spinner.classList.add("d-none");
    buttonText.textContent = "SEND APPLICATION";
    fullLoader.classList.add("d-none"); // ✅ hides loader
    document.body.style.overflow = "auto";
  }
};

// lazy-load-video
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll("video.lazy-video");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const video = entry.target;
          const source = video.querySelector("source");
          source.src = source.dataset.src; // Load actual video
          video.load();
          video.play(); // Autoplay when visible
          obs.unobserve(video);
        }
      });
    },
    { threshold: 0.25 }
  ); // 25% visible

  videos.forEach((video) => observer.observe(video));
});

document.addEventListener("DOMContentLoaded", function () {
  var ulweModal = new bootstrap.Modal(
    document.getElementById("ulweBranchModal")
  );
  var videoModal = new bootstrap.Modal(document.getElementById("videoModal"));

  var ulweBtn = document.getElementById("reopenUlweBtn");
  var videoBtn = document.getElementById("reopenVideoBtn");

  // Show both modals after 5 seconds
  setTimeout(function () {
    if (window.innerWidth < 768) {
      // mobile → stack modals
      ulweModal.show();
      // setTimeout(() => videoModal.show(), 600); // small delay for stacking
    } else {
      // desktop → side by side
      ulweModal.show();
      // videoModal.show();
    }
  }, 5000);

  // ULWE modal events
  document
    .getElementById("ulweBranchModal")
    .addEventListener("hidden.bs.modal", function () {
      ulweBtn.style.display = "flex";
    });

  document
    .getElementById("ulweBranchModal")
    .addEventListener("shown.bs.modal", function () {
      ulweBtn.style.display = "none";
    });

  const ulweCard = document.getElementById("ulweCard");

  ulweCard.addEventListener("click", function () {
    ulweModal.show();
    document.getElementById("mouni-video").style.display = "none";
  });

  ulweBtn.addEventListener("click", function () {
    ulweModal.show();
    document.getElementById("mouni-video").style.display = "none";
  });

  // VIDEO modal events
  document
    .getElementById("ulweBranchModal")
    .addEventListener("hidden.bs.modal", function () {
      videoBtn.style.display = "flex";
    });

  document
    .getElementById("ulweBranchModal")
    .addEventListener("shown.bs.modal", function () {
      videoBtn.style.display = "none";
    });

  videoBtn.addEventListener("click", function () {
    videoModal.show();
  });
});

// document.getElementById("videoModal").addEventListener("hidden.bs.modal", function () {
//   videoBtn.style.display = "flex";

//   // Stop video playback when modal closes
//   var vid = this.querySelector("video");
//   if (vid) {
//     vid.pause();
//     vid.currentTime = 0; // optional → reset to start
//   }
// });

// slider image open model
document.addEventListener("DOMContentLoaded", () => {
  const imageModal = new bootstrap.Modal(document.getElementById("imageModal"));
  const imageCarousel = document.getElementById("imageCarousel");

  document.querySelectorAll(".small-card-img").forEach((img) => {
    img.addEventListener("click", () => {
      // get slide index
      const slideTo = img.getAttribute("data-bs-slide-to");

      // open modal
      imageModal.show();

      // go to clicked slide
      const bsCarousel =
        bootstrap.Carousel.getInstance(imageCarousel) ||
        new bootstrap.Carousel(imageCarousel);
      bsCarousel.to(slideTo);
    });
  });
});

// fast slide branch images hero
document.addEventListener("DOMContentLoaded", function () {
  const heroCarousel = document.querySelector("#heroCarousel");
  const carousel = new bootstrap.Carousel(heroCarousel, {
    interval: 1500, // normal speed
    ride: true, // don't auto start
  });

  // Start auto-slide after 5 seconds
  setTimeout(() => {
    carousel.cycle();
  }, 500);

  //<!-- Custom Branch Dropdown -->

  document.addEventListener("DOMContentLoaded", function () {
    const customSelect = document.querySelector(".custom-select");
    const trigger = customSelect.querySelector(".custom-select-trigger");
    const options = customSelect.querySelectorAll(".custom-option");
    const hiddenInput = document.getElementById("modal_branch");

    trigger.addEventListener("click", () => {
      customSelect.classList.toggle("open");
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        // Update trigger text
        trigger.querySelector("span").textContent = option.textContent;

        // Update hidden input value
        hiddenInput.value = option.dataset.value;

        // Highlight selected
        options.forEach((opt) => opt.classList.remove("selected"));
        option.classList.add("selected");

        // Close dropdown
        customSelect.classList.remove("open");
      });
    });

    // Close dropdown if clicked outside
    document.addEventListener("click", (e) => {
      if (!customSelect.contains(e.target)) {
        customSelect.classList.remove("open");
      }
    });
  });
});

// branch images scroller function
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".auto-scroll-wrapper");
  const inner = wrapper.querySelector(".auto-scroll-inner");

  // ========== DRAG / SWIPE ==========
  let isDown = false;
  let startX, scrollLeft;

  wrapper.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - wrapper.offsetLeft;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener("mouseup", () => (isDown = false));
  wrapper.addEventListener("mouseleave", () => (isDown = false));
  wrapper.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - startX) * 2; // drag speed
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // Touch
  wrapper.addEventListener("touchstart", (e) => {
    isDown = true;
    startX = e.touches[0].pageX;
    scrollLeft = wrapper.scrollLeft;
  });
  wrapper.addEventListener("touchend", () => (isDown = false));
  wrapper.addEventListener("touchmove", (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX;
    const walk = (x - startX) * 2;
    wrapper.scrollLeft = scrollLeft - walk;
  });

  // ========== AUTO SCROLL ==========
  let scrollSpeed = 1;
  let scrolling = true;

  function scrollStep() {
    if (scrolling) {
      wrapper.scrollLeft += scrollSpeed;
      // Loop when reaching end
      if (wrapper.scrollLeft >= inner.scrollWidth - wrapper.clientWidth) {
        wrapper.scrollLeft = 0;
      }
    }
    requestAnimationFrame(scrollStep);
  }

  scrollStep();
});
