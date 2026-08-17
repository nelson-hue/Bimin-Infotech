document.addEventListener("DOMContentLoaded", () => {
  // Smooth scroll to services on CTA click
  const ctaBtn = document.getElementById("cta-btn");
  ctaBtn.addEventListener("click", () => {
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
  });

  // Handle contact form submission
  const contactForm = document.getElementById("contact-form");
  const feedback = document.getElementById("form-feedback");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;

    feedback.style.color = "#4ade80";
    feedback.textContent = `Thank you, ${name}! Your request has been received.`;
    contactForm.reset();
  });
});