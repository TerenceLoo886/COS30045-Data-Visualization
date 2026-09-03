// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== FAQ accordion =====
document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-question");
  question.addEventListener("click", () => {
    item.classList.toggle("open");
  });
});

// ===== Scroll reveal animation =====
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// ===== Animated stat counters =====
document.querySelectorAll(".stat-number").forEach((el) => {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(el.dataset.count, 10);
          let current = 0;
          const step = Math.max(1, Math.round(target / 50));

          const tick = () => {
            current += step;
            if (current >= target) {
              el.textContent = target;
            } else {
              el.textContent = current;
              requestAnimationFrame(tick);
            }
          };
          tick();
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  counterObserver.observe(el);
});

// ===== Scroll progress bar =====
const progressBar = document.getElementById("scroll-progress");
if (progressBar) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = percent + "%";
  });
}

// ===== Chart lightbox =====
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

if (lightbox && lightboxImg) {
  document.querySelectorAll(".story-chart").forEach((chart) => {
    chart.addEventListener("click", () => {
      lightboxImg.src = chart.getAttribute("src");
      lightbox.classList.add("open");
    });
  });

  lightbox.addEventListener("click", () => {
    lightbox.classList.remove("open");
  });
}

// ===== Interactive TV size energy estimator =====
const sizeSlider = document.getElementById("size-slider");
const sizeOutput = document.getElementById("size-output");
const energyOutput = document.getElementById("energy-output");

function estimateEnergy(inches) {
  if (inches <= 43) {
    return 155 + ((inches - 20) / (43 - 20)) * 20;
  } else if (inches <= 65) {
    return 155 + ((inches - 43) / (65 - 43)) * (405 - 155);
  } else {
    return 405 + ((inches - 65) / (85 - 65)) * (745 - 405);
  }
}

function updateEstimate() {
  const inches = parseInt(sizeSlider.value, 10);
  const kwh = Math.round(estimateEnergy(inches));
  sizeOutput.textContent = inches + '"';
  energyOutput.textContent = kwh;
}

if (sizeSlider && sizeOutput && energyOutput) {
  sizeSlider.addEventListener("input", updateEstimate);
  updateEstimate();
}