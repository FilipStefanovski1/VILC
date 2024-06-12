document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("newsletter-form");
    const emailInput = document.getElementById("email");
    const message = document.getElementById("message");
    const subscribersList = document.getElementById("subscribers-list");
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    const menuBtnIcon = menuBtn.querySelector("i");
    const ttsBtn = document.getElementById("tts-btn");
    const sttBtn = document.getElementById("stt-btn");
    const aboutSection = document.getElementById("about");

    const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

    function updateLeaderboard() {
        subscribersList.innerHTML = '';
        subscribers.slice(-5).forEach(subscriber => {
            const li = document.createElement('li');
            li.textContent = subscriber;
            subscribersList.appendChild(li);
        });
    }

    updateLeaderboard();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        message.textContent = "";
        message.classList.remove("success", "error");

        const email = emailInput.value;

        if (validateEmail(email)) {
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            updateLeaderboard();

            message.textContent = "Thank you for subscribing!";
            message.classList.add("success");

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

    ScrollReveal().reveal(".header__container p", scrollRevealOption);
    ScrollReveal().reveal(".header__container h1", { ...scrollRevealOption, delay: 500 });

    ScrollReveal().reveal(".about__image img", { ...scrollRevealOption, origin: "left" });
    ScrollReveal().reveal(".about__content .section__subheader", { ...scrollRevealOption, delay: 500 });
    ScrollReveal().reveal(".about__content .section__header", { ...scrollRevealOption, delay: 1000 });
    ScrollReveal().reveal(".about__content .section__description", { ...scrollRevealOption, delay: 1500 });
    ScrollReveal().reveal(".about__btn", { ...scrollRevealOption, delay: 2000 });

    ScrollReveal().reveal(".features__grid .feature__card", { ...scrollRevealOption, interval: 500 });

    ScrollReveal().reveal(".testimonials__grid .testimonial__card", { ...scrollRevealOption, interval: 500 });

    ScrollReveal().reveal(".team__grid .team__member", { ...scrollRevealOption, interval: 500 });

    ScrollReveal().reveal(".newsletter__section", scrollRevealOption);

    ttsBtn.addEventListener("click", () => {
        speakText(document.querySelector(".about__content .section__description").textContent);
        aboutSection.scrollIntoView({ behavior: "smooth" });
    });

    sttBtn.addEventListener("click", () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onstart = () => {
            message.textContent = "Listening... Please speak clearly into the microphone.";
            message.classList.add("info");
        };

        recognition.onresult = (event) => {
            let speechResult = event.results[0][0].transcript;
            speechResult = speechResult.replace(/\s/g, '').replace(/at/g, '@').replace(/dot/g, '.');
            emailInput.value = speechResult;
            message.textContent = "Speech recognized successfully!";
            message.classList.remove("info", "error");
            message.classList.add("success");
        };

        recognition.onspeechend = () => {
            recognition.stop();
            message.textContent = "Processing speech...";
            message.classList.add("info");
        };

        recognition.onerror = (event) => {
            console.error("Error occurred in recognition: " + event.error);
            message.textContent = "Speech recognition error: " + event.error;
            message.classList.remove("info");
            message.classList.add("error");

            if (event.error === 'no-speech') {
                message.textContent = "No speech detected. Please try again.";
            } else if (event.error === 'aborted') {
                message.textContent = "Speech recognition aborted. Please try again.";
            } else if (event.error === 'audio-capture') {
                message.textContent = "No microphone was found. Ensure that a microphone is installed and that microphone settings are configured correctly.";
            } else if (event.error === 'network') {
                message.textContent = "A network error occurred during speech recognition. Please check your connection and try again.";
            }
        };
    });

    let currentUtterance = null;
    document.querySelectorAll('p, h1, h2, h4, .nav__links a').forEach(element => {
        element.addEventListener('mouseenter', () => {
            speakText(element.textContent);
        });

        element.addEventListener('mouseleave', () => {
            if (currentUtterance) {
                window.speechSynthesis.cancel();
                currentUtterance = null;
            }
        });
    });

    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            speakText(button.textContent);
        });

        button.addEventListener('mouseleave', () => {
            if (currentUtterance) {
                window.speechSynthesis.cancel();
                currentUtterance = null;
            }
        });
    });

    function speakText(text) {
        if (currentUtterance) {
            window.speechSynthesis.cancel();
        }
        currentUtterance = new SpeechSynthesisUtterance(text);
        currentUtterance.lang = "en-US";
        currentUtterance.rate = 1;
        currentUtterance.pitch = 1;
        
        const voices = window.speechSynthesis.getVoices();
        const naturalVoice = voices.find(voice => voice.name.includes('Google US English')) || voices[0];
        currentUtterance.voice = naturalVoice;

        window.speechSynthesis.speak(currentUtterance);
    }
});
