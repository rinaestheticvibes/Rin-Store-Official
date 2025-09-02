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

//First Popup section
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("socialPopup");
  const closeBtn = document.getElementById("closePopup");

  // Once per day key
  const KEY = "rin_store_popup_date";

  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function shouldShow() {
    // Once per day - DISABLED for editing
    // const lastShown = localStorage.getItem(KEY);
    // return lastShown !== todayStr();
    return true; // Always show while editing
  }

  function markShown() {
    localStorage.setItem(KEY, todayStr());
  }

  if (shouldShow()) {
    popup.classList.add("active");
    popup.setAttribute("aria-hidden", "false");
  }

  closeBtn.addEventListener("click", () => {
  // Remove focus first
  closeBtn.blur();

  popup.classList.remove("active");
  popup.setAttribute("aria-hidden", "true");
  markShown();
});

popup.addEventListener("click", (e) => {
  if (e.target === popup) {
    // Remove focus from anything inside
    document.activeElement.blur();

    popup.classList.remove("active");
    popup.setAttribute("aria-hidden", "true");
    markShown();
  }
});
});

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then(reg => console.log("✅ Service Worker registered", reg))
      .catch(err => console.log("❌ Service Worker failed", err));
  });
}

// Handle Install Prompt
let deferredPrompt;
const installBtn = document.createElement("button");
installBtn.innerText = "📲 Install Rin Store";
installBtn.style.cssText = `
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  font-size: 16px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(90deg, #6a00f4, #9a4dff);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  z-index: 1000;
  display: none;
`;
document.body.appendChild(installBtn);

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
  installBtn.style.display = "none";
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log("User response:", outcome);
    deferredPrompt = null;
  }
});

// Loader helpers
function showLoader() {
  const el = document.getElementById('loader');
  if (el) el.style.display = 'flex';
}
function hideLoader() {
  const el = document.getElementById('loader');
  if (el) el.style.display = 'none';
}

// Always hide loader when page is shown (incl. back/forward cache)
window.addEventListener('pageshow', hideLoader);

// Attach to product links
document.querySelectorAll('.games').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const target = this.href;
    showLoader();

    let navigated = false;
    const onNav = () => { navigated = true; cleanup(); };
    const cleanup = () => {
      window.removeEventListener('pagehide', onNav);
      window.removeEventListener('beforeunload', onNav);
      document.removeEventListener('visibilitychange', onVis);
      clearTimeout(safetyTimer);
      clearTimeout(delayedGo);
    };
    const onVis = () => {
      // If page is hidden, navigation started
      if (document.visibilityState === 'hidden') onNav();
    };

    // Mark as navigating if the page is leaving
    window.addEventListener('pagehide', onNav, { once: true });
    window.addEventListener('beforeunload', onNav, { once: true });
    document.addEventListener('visibilitychange', onVis);

    // Safety: hide loader if nothing happens within 6s
    const safetyTimer = setTimeout(() => {
      if (!navigated) hideLoader();
      cleanup();
    }, 3000);

    // Go after 1.5s (your UX delay)
    const delayedGo = setTimeout(() => {
      // If somehow pointing to same URL, cancel
      if (window.location.href === target) {
        hideLoader();
        cleanup();
        return;
      }
      window.location.assign(target);
    }, 1000);
  });
});