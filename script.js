function showCustomAlert(message) {
  const popup = document.getElementById('popupAlert');
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

// Bell click animation trigger
document.addEventListener("DOMContentLoaded", () => {
  const bell = document.querySelector(".notify-icon");

  if (bell) {
    bell.addEventListener("click", (e) => {
      bell.classList.add("clicked");

      // Remove animation class after it runs
      setTimeout(() => {
        bell.classList.remove("clicked");
      }, 300); // Match animation duration
    });
  }
});

  // Check if user has read notifications
  const isRead = localStorage.getItem("notificationsRead") === "true";
  const notiDot = document.getElementById("notidot");

  if (!isRead) {
    notiDot.style.display = "block";
  } else {
    notiDot.style.display = "none";
  }

    //Slide bar overlay function
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 4000); // 4 seconds