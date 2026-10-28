const slots = Array.from({length: 8}, (_, i) => ({
  part: i + 1,
  start: String(i + 9).padStart(2, "0") + ":00",
  end: String(i + 9).padStart(2, "0") + ":50"
}));
let current = null;
const grid = document.getElementById("modelGrid");
const overlay = document.getElementById("overlay");
const drawer = document.getElementById("drawer");
const form = document.getElementById("bookingForm");

grid.innerHTML = models.map((model, modelIndex) => `
  <article class="model-card">
    <div class="model-top">
      <img class="model-photo" src="${model.image}" alt="${model.name}" loading="lazy">
      <div class="model-details">
        <div class="model-name-row"><h2 class="model-name">${model.name}</h2><span class="model-type">model</span></div>
        <p class="group">${model.group}</p><div class="accent" style="background:linear-gradient(90deg,${model.accent},#fff 95%)"></div>
        <p class="feature">スマホ撮影：可</p><div class="price">PRICE : ${model.price.toLocaleString("ja-JP")}円</div>
      </div>
    </div>
    <div class="slots"><div class="slots-title">AVAILABLE TIME</div><div class="slot-grid">
      ${slots.map(slot => `<button class="slot" data-model="${modelIndex}" data-part="${slot.part}" type="button"><span class="slot-time"><strong>${slot.part}部</strong>${slot.start}〜${slot.end}</span><span class="slot-add">予約に追加</span></button>`).join("")}
    </div></div>
  </article>`).join("");

function openBooking(modelIndex, part) {
  document.querySelectorAll(".slot.selected").forEach(slot => slot.classList.remove("selected"));
  const button = document.querySelector(`.slot[data-model="${modelIndex}"][data-part="${part}"]`);
  button.classList.add("selected");
  const model = models[modelIndex];
  const slot = slots[part - 1];
  current = { model, slot };
  document.getElementById("summaryTitle").textContent = `${model.name}【${model.group}】`;
  document.getElementById("summarySlot").textContent = `${slot.part}部 ${slot.start}〜${slot.end} / ${model.price.toLocaleString("ja-JP")}円`;
  document.getElementById("totalPrice").textContent = `合計：${model.price.toLocaleString("ja-JP")}円`;
  document.getElementById("drawerInner").style.display = "block";
  document.getElementById("successScreen").style.display = "none";
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.getElementById("closeDrawer").focus();
}

grid.addEventListener("click", event => {
  const button = event.target.closest(".slot");
  if (button) openBooking(Number(button.dataset.model), Number(button.dataset.part));
});

function closeDrawer() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  document.querySelectorAll(".slot.selected").forEach(slot => slot.classList.remove("selected"));
}
function clearFormErrors() {
  form.querySelectorAll("input").forEach(input => input.classList.remove("has-error"));
  form.querySelectorAll(".error").forEach(error => error.style.display = "none");
}
function resetBooking() { form.reset(); clearFormErrors(); current = null; }
document.getElementById("closeDrawer").addEventListener("click", closeDrawer);
document.getElementById("deleteBooking").addEventListener("click", () => { resetBooking(); closeDrawer(); });
document.getElementById("successClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
document.addEventListener("keydown", event => { if (event.key === "Escape") closeDrawer(); });

form.addEventListener("submit", event => {
  event.preventDefault();
  let valid = true;
  form.querySelectorAll('[type="text"],[type="tel"],[type="email"]').forEach(input => {
    const empty = !input.value.trim();
    const error = input.parentElement.querySelector(".error");
    input.classList.toggle("has-error", empty);
    if (error) error.style.display = empty ? "block" : "none";
    if (empty) valid = false;
  });
  const terms = document.getElementById("terms");
  const termsError = document.getElementById("termsError");
  termsError.style.display = terms.checked ? "none" : "block";
  if (!terms.checked) valid = false;
  if (!valid) return;
  document.getElementById("drawerInner").style.display = "none";
  document.getElementById("successScreen").style.display = "block";
  resetBooking();
});