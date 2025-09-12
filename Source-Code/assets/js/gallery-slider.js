    /*
        Script responsibilities:
        1. Duplicate the content inside #inner once to make a seamless loop.
        2. Compute animation duration based on the pixel width and desired speed (px/sec).
        3. Set the CSS --duration variable so the animation is smooth & consistent across sizes.
        4. Handle modal open/close and Prev/Next navigation.
    */
    (function () {
        const inner = document.getElementById("inner");
        // Duplicate the children
        const clone = inner.cloneNode(true);
        inner.parentNode.appendChild(clone);

        // Wrap both copies in a single track wrapper
        const viewport = inner.parentNode;
        const wrapper = document.createElement("div");
        wrapper.className = "track";
        while (viewport.firstChild) wrapper.appendChild(viewport.firstChild);
        viewport.appendChild(wrapper);

        // Compute duration based on speed
        function recalc() {
        const totalWidth = wrapper.scrollWidth; // doubled content width
        const singleWidth = totalWidth / 2;
        const speed =
            getComputedStyle(document.documentElement).getPropertyValue("--speed") ||
            1000;
        const speedPx = Number(speed);
        const durationSec = Math.max(4, Math.round(singleWidth / speedPx));
        wrapper.style.setProperty("--duration", durationSec + "s");
        }
        window.addEventListener("load", recalc);
        window.addEventListener("resize", recalc);
        recalc();

        // Accessibility: pause/resume on focus
        wrapper.tabIndex = 0;
        wrapper.addEventListener(
        "focus",
        () => (wrapper.style.animationPlayState = "paused")
        );
        wrapper.addEventListener(
        "blur",
        () => (wrapper.style.animationPlayState = "running")
        );

        // ========== MODAL GALLERY ==========
        const items = wrapper.querySelectorAll(".item");
        let currentIndex = 0;

        function openModal(index) {
          const item = items[index];
          const img = item.querySelector("img");

          document.getElementById("modal-img").src = img.src;
          document.getElementById("modal").classList.remove("hidden");
          currentIndex = index;
        }

        // Open modal on click
        items.forEach((item, index) => {
        item.addEventListener("click", () => openModal(index));
        });

        // Close modal
        document.querySelector(".c-modal .close").onclick = () => {
        document.getElementById("modal").classList.add("hidden");
        };

        // Prev / Next navigation
        document.getElementById("prevBtn").onclick = () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        openModal(currentIndex);
        };
        document.getElementById("nextBtn").onclick = () => {
        currentIndex = (currentIndex + 1) % items.length;
        openModal(currentIndex);
        };
    })();
