
const notificationList = document.getElementById("notificationList");
const alertBox = document.getElementById("customAlert");
const promptBox = document.getElementById("customPrompt");
const promptTextarea = document.getElementById("promptTextarea");
const promptOk = document.getElementById("promptOk");
const promptCancel = document.getElementById("promptCancel");
const unlockPrompt = document.getElementById("unlockPrompt");
const unlockPassword = document.getElementById("unlockPassword");
const unlockOk = document.getElementById("unlockOk");
const unlockCancel = document.getElementById("unlockCancel");
const fab = document.getElementById("fab");

let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

function saveNotifications() {
  localStorage.setItem("notifications", JSON.stringify(notifications));
}

function timeAgo(timestamp) {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function renderNotifications() {
  notificationList.innerHTML = "";

  if (notifications.length === 0) {
    const empty = document.createElement("div");
    empty.style.textAlign = "center";
    empty.style.padding = "40px 0";
    empty.style.color = "#999";
    empty.innerText = "No new notifications";
    notificationList.appendChild(empty);
    return;
  }

  notifications.forEach((noti, index) => {
    const text = noti.text;
    const shortText = text.length > 80 ? text.slice(0, 80) + "..." : text;
    const isLong = text.length > 80;
    if (!noti.likes) noti.likes = 0;
    if (!noti.comments) noti.comments = [];

    const item = document.createElement("div");
    item.className = "notification-item";

    const commentsHTML = noti.comments.map(c => `<div class='comment'>${c}</div>`).join("");

    item.innerHTML = `
      <span class="notif-text" 
        data-full="${text.replace(/"/g, '&quot;')}" 
        data-short="${shortText.replace(/"/g, '&quot;')}">
        ${isLong ? shortText : text}
      </span>
      ${isLong ? `<a class="more-link" href="javascript:void(0);" onclick="expandMessage(this)" data-expanded="false">More</a>` : ""}
      <div class="notif-time">${timeAgo(noti.time)}</div>

      <div class="notif-actions">
        <button onclick="likeNotification(${index})">❤️ ${noti.likes}</button>
        <button onclick="toggleComments(${index})">💬 ${noti.comments.length}</button>
        <button onclick="shareNotification(${index})">📤 Share</button>
      </div>

      <div class="comment-section" id="comment-${index}" style="display:none">
        ${commentsHTML}
        <textarea class="comment-input" placeholder="Write a comment..." onkeydown="addComment(event, ${index})"></textarea>
      </div>

      <div class="options">
        <button onclick="deleteNotification(${index})">Delete</button>
      </div>
    `;

    let pressTimer;
    const startPress = () => {
      pressTimer = setTimeout(() => {
        document.querySelectorAll(".notification-item").forEach(el => el.classList.remove("show"));
        item.classList.add("show");
      }, 500);
    };

    const cancelPress = () => clearTimeout(pressTimer);

    item.addEventListener("mousedown", startPress);
    item.addEventListener("mouseup", cancelPress);
    item.addEventListener("mouseleave", cancelPress);
    item.addEventListener("touchstart", startPress);
    item.addEventListener("touchend", cancelPress);

    notificationList.appendChild(item);
  });
}

function expandMessage(link) {
  const span = link.closest('.notification-item').querySelector(".notif-text");
  const isExpanded = link.getAttribute("data-expanded") === "true";
  const fullText = span.dataset.full;
  const shortText = span.dataset.short;

  if (isExpanded) {
    span.textContent = shortText;
    link.textContent = "More";
    link.setAttribute("data-expanded", "false");
  } else {
    span.textContent = fullText;
    link.textContent = "Less";
    link.setAttribute("data-expanded", "true");
  }
}

function likeNotification(index) {
  notifications[index].likes++;
  saveNotifications();
  renderNotifications();
}

function toggleComments(index) {
  const el = document.getElementById(`comment-${index}`);
  el.style.display = el.style.display === "none" ? "block" : "none";
}

function addComment(event, index) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    const value = event.target.value.trim();
    if (value !== "") {
      notifications[index].comments.push(value);
      saveNotifications();
      renderNotifications();
    }
  }
}

function shareNotification(index) {
  navigator.clipboard.writeText(notifications[index].text);
  showCustomAlert("Copied to clipboard");
}

function showCustomAlert(message) {
  alertBox.textContent = message;
  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2500);
}

function deleteNotification(index) {
  notifications.splice(index, 1);
  saveNotifications();
  renderNotifications();
  showCustomAlert("Notification deleted");
}

function openPromptBox() {
  promptTextarea.value = "";
  promptBox.classList.add("show");
}

promptOk.onclick = () => {
  const msg = promptTextarea.value.trim();
  if (msg !== "") {
    notifications.unshift({ text: msg, time: Date.now(), likes: 0, comments: [] });
    saveNotifications();
    promptBox.classList.remove("show");
    renderNotifications();
    showCustomAlert("Notification added");
  } else {
    showCustomAlert("Please enter a message");
  }
};

promptCancel.onclick = () => {
  promptBox.classList.remove("show");
};

fab.onclick = () => {
  unlockPrompt.classList.add("show");
};

unlockOk.onclick = () => {
  const input = unlockPassword.value.trim();
  if (input === "codeme") {
    unlockPrompt.classList.remove("show");
    unlockPassword.value = "";
    openPromptBox();
  } else {
    showCustomAlert("Wrong password");
  }
};

unlockCancel.onclick = () => {
  unlockPrompt.classList.remove("show");
  unlockPassword.value = "";
};

renderNotifications();
