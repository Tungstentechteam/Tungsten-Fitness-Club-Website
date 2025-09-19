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
  }, 3000);

  // ULWE modal events
  document
    .getElementById("ulweBranchModal")
    .addEventListener("hidden.bs.modal", function () {
      ulweBtn.style.display = "flex";
      document.getElementById("popupVideo").pause();
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
  //hello
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
