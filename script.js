document.addEventListener("DOMContentLoaded", () => {

  // Smooth scroll to services on CTA click (index.html only)
  const ctaBtn = document.getElementById("cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      document.getElementById("services").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Handle contact form submission (index.html only)
  const contactForm = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  if (contactForm && feedback) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const submitBtn = contactForm.querySelector("button[type='submit']");

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      feedback.style.color = "#9AA3C7";
      feedback.textContent = "";

      try {
        const response = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (response.ok) {
          feedback.style.color = "#4ade80";
          feedback.textContent = `Thank you, ${name}! Your message has been sent.`;
          contactForm.reset();
        } else {
          feedback.style.color = "#f87171";
          feedback.textContent = "Something went wrong. Please email us directly at nelsondcruz43@gmail.com.";
        }
      } catch (err) {
        feedback.style.color = "#f87171";
        feedback.textContent = "Network error. Please email us directly at nelsondcruz43@gmail.com.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    });
  }

  // ----- First-visit location capture -----
  // Runs on every page. Browsers only show the native permission prompt
  // once per site (until the visitor clears it), so this fires on the
  // very first visit and stays silent afterwards.
  captureVisitorLocation();
});

const FORM_ENDPOINT = "https://formspree.io/f/mrpzoezr";

function captureVisitorLocation() {
  if (!navigator.geolocation) {
    notifyVisit("Location unavailable (browser doesn't support it)");
    return;
  }

  // Already have it cached from an earlier page/visit — reuse, don't re-prompt.
  const cached = localStorage.getItem("bimin_visitor_location");
  if (cached) {
    attachLocationToForm(cached);
    notifyVisit(cached);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      let label = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;

      // Reverse-geocode to a human-readable city/state using a free,
      // no-API-key client-side service.
      try {
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        if (res.ok) {
          const data = await res.json();
          const parts = [data.city || data.locality, data.principalSubdivision, data.countryName].filter(Boolean);
          if (parts.length) label = parts.join(", ");
        }
      } catch (err) {
        // Reverse geocoding failed — fall back to raw coordinates already set above.
      }

      localStorage.setItem("bimin_visitor_location", label);
      attachLocationToForm(label);
      notifyVisit(label);
    },
    () => {
      // Permission denied or unavailable.
      notifyVisit("Location not shared (visitor declined)");
    },
    { timeout: 8000 }
  );
}

function notifyVisit(locationLabel) {
  // Only one visit notification per browser session, no matter how many
  // pages (index/About/Services) the visitor loads.
  if (sessionStorage.getItem("bimin_visit_logged")) return;
  sessionStorage.setItem("bimin_visit_logged", "true");

  const data = new FormData();
  data.append("_subject", "Site Visit (no message) — Bimin InfoTech");
  data.append("type", "page_visit");
  data.append("page", window.location.pathname);
  data.append("location", locationLabel);
  data.append("time", new Date().toLocaleString());

  fetch(FORM_ENDPOINT, {
    method: "POST",
    body: data,
    headers: { Accept: "application/json" }
  }).catch(() => {
    // Silent failure — never surface network errors for a background ping.
  });
}

function attachLocationToForm(label) {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  let hiddenField = contactForm.querySelector("input[name='visitor_location']");
  if (!hiddenField) {
    hiddenField = document.createElement("input");
    hiddenField.type = "hidden";
    hiddenField.name = "visitor_location";
    contactForm.appendChild(hiddenField);
  }
  hiddenField.value = label;
}
