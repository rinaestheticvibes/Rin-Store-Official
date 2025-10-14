function showGuide() {
    document.getElementById("guideModal").style.display = "flex";
  }

  function hideGuide() {
    document.getElementById("guideModal").style.display = "none";
  }

  function hideConfirm() {
    document.getElementById("confirmPopup").style.display = "none";
  }

  function confirmOrder() {
  hideConfirm();

  const playerId = document.getElementById("playerId").value.trim();
  const serverId = document.getElementById("serverId").value.trim();
  const ign = document.getElementById("ign").value.trim() || "Not Provided";

  const selectedCard = document.querySelector(".diamond-card.selected");
  if (!selectedCard) {
    alert("Please select a diamond package.");
    return;
  }

  const diamond = selectedCard.querySelector(".diamond-title").innerText;
  const price = selectedCard.querySelector(".new-price").innerText.replace("₹", "");

  const query = new URLSearchParams({
    playerId,
    serverId,
    ign,
    diamond,
    price
  }).toString();

  window.location.href = `payment.html?${query}`;
}

  const cards = document.querySelectorAll('.diamond-card');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });

  document.getElementById("proceedBtn").addEventListener("click", function () {
    const playerId = document.getElementById("playerId").value.trim();
    const serverId = document.getElementById("serverId").value.trim();
    const ign = document.getElementById("ign").value.trim();
    const selectedCard = document.querySelector(".diamond-card.selected");

    // Hide previous errors
    document.getElementById("error-player").style.display = "none";
    document.getElementById("error-server").style.display = "none";
    document.getElementById("error-diamond").style.display = "none";

    let error = false;

    if (playerId === "") {
      document.getElementById("error-player").textContent = "Please enter Player ID";
      document.getElementById("error-player").style.display = "block";
      error = true;
    }

    if (serverId === "") {
      document.getElementById("error-server").textContent = "Please enter Server ID";
      document.getElementById("error-server").style.display = "block";
      error = true;
    }

    if (!selectedCard) {
      document.getElementById("error-diamond").textContent = "Please choose a diamond amount";
      document.getElementById("error-diamond").style.display = "block";
      error = true;
    }

    if (error) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // ✅ Show confirmation popup
    const amount = selectedCard.querySelector(".diamond-title").innerText;
    const price = selectedCard.querySelector(".new-price").innerText.replace("₹", "");

    document.getElementById("popup-playerId").textContent = playerId;
    document.getElementById("popup-serverId").textContent = serverId;
    document.getElementById("popup-ign").textContent = ign !== "" ? ign : "Not Provided";
  document.getElementById("popup-diamond").textContent = amount;
    document.getElementById("popup-price").textContent = price;

    document.getElementById("confirmPopup").style.display = "flex";
  });