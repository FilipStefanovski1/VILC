document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("email");
  const message = document.getElementById("message");
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const menuBtnIcon = menuBtn.querySelector("i");
  const ttsBtn = document.getElementById("tts-btn");
  const sttBtn = document.getElementById("stt-btn");

  form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      // Clear previous message
      message.textContent = "";
      message.classList.remove("success", "error");

      const email = emailInput.value;

      // Simple email validation
      if (validateEmail(email)) {
          // Simulate successful subscription
          message.textContent = "Thank you for subscribing!";
          message.classList.add("success");

          // Reset form
          form.reset();
      } else {
          message.textContent = "Please enter a valid email address.";
          message.classList.add("error");
      }
  });

  function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(String(email).toLowerCase());
  }

  menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");

      const isOpen = navLinks.classList.contains("open");
      menuBtnIcon.className = isOpen ? "ri-close-line" : "ri-menu-line";
  });

  navLinks.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtnIcon.className = "ri-menu-line";
  });

  const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
  };

  // Header container
  ScrollReveal().reveal(".header__container p", scrollRevealOption);
  ScrollReveal().reveal(".header__container h1", { ...scrollRevealOption, delay: 500 });

  // About container
  ScrollReveal().reveal(".about__image img", { ...scrollRevealOption, origin: "left" });
  ScrollReveal().reveal(".about__content .section__subheader", { ...scrollRevealOption, delay: 500 });
  ScrollReveal().reveal(".about__content .section__header", { ...scrollRevealOption, delay: 1000 });
  ScrollReveal().reveal(".about__content .section__description", { ...scrollRevealOption, delay: 1500 });
  ScrollReveal().reveal(".about__btn", { ...scrollRevealOption, delay: 2000 });

  // Features container
  ScrollReveal().reveal(".features__grid .feature__card", { ...scrollRevealOption, interval: 500 });

  // Testimonials container
  ScrollReveal().reveal(".testimonials__grid .testimonial__card", { ...scrollRevealOption, interval: 500 });

  // Team container
  ScrollReveal().reveal(".team__grid .team__member", { ...scrollRevealOption, interval: 500 });

  // Newsletter section
  ScrollReveal().reveal(".newsletter__section", scrollRevealOption);

  // Text-to-Speech functionality
  ttsBtn.addEventListener("click", () => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = document.querySelector(".section__description").textContent;
    window.speechSynthesis.speak(msg);
  });

  // Speech-to-Text functionality for email input
  sttBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      emailInput.value = speechResult;
    };

    recognition.onerror = (event) => {
      console.error("Error occurred in recognition: " + event.error);
    };
  });
});
