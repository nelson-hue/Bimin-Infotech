document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll to services on CTA click
  const ctaBtn = document.getElementById("cta-btn");
  ctaBtn.addEventListener("click", () => {
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
  });

  // Handle contact form submission
  const contactForm = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

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
});