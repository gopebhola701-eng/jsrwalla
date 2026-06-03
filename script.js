const glow = document.querySelector(".cursor-glow");
const toast = document.querySelector(".toast");
const deviceMessage = document.querySelector("#device-message");
const revealItems = document.querySelectorAll(".section-reveal");
const counters = document.querySelectorAll(".stat-number");
const pageChips = document.querySelectorAll(".page-chip");
const pageCards = document.querySelectorAll(".page-card");

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
};

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const isAndroid = /Android/i.test(navigator.userAgent);
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

if (deviceMessage) {
  if (isAndroid) {
    deviceMessage.textContent = "Android detected. Tap install, then approve the Android installer prompt.";
  } else if (isMobile) {
    deviceMessage.textContent = "This APK installs on Android devices. Open this page on Android to install.";
  } else {
    deviceMessage.textContent = "Open this page on Android, or download the APK and transfer it to your device.";
  }
}

document.querySelectorAll(".install-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const message = isAndroid
      ? "APK opening. Confirm installation when Android asks."
      : "APK download started. Install it on an Android device.";
    showToast(message);
  });
});

document.querySelectorAll(".copy-link").forEach((button) => {
  button.addEventListener("click", async () => {
    const href = button.getAttribute("data-copy");
    const url = new URL(href, window.location.href).href;

    try {
      await navigator.clipboard.writeText(url);
      showToast("APK link copied.");
    } catch (error) {
      showToast(url);
    }
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const counter = entry.target;
    const target = Number(counter.dataset.count || 0);
    const start = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = `${Math.round(target * eased)}+`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    countObserver.unobserve(counter);
  });
}, { threshold: 0.7 });

counters.forEach((counter) => countObserver.observe(counter));

pageChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const filter = chip.dataset.filter;

    pageChips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");

    pageCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.type === filter;
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});
