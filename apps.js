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

    // Load existing subscribers from localStorage
    const subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];

    // Function to update the leaderboard
    function updateLeaderboard() {
        subscribersList.innerHTML = '';
        subscribers.slice(-5).forEach(subscriber => {
            const li = document.createElement('li');
            li.textContent = subscriber;
            subscribersList.appendChild(li);
        });
    }

    // Initial call to populate the leaderboard
    updateLeaderboard();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Clear previous message
        message.textContent = "";
        message.classList.remove("success", "error");

        const email = emailInput.value;

        // Simple email validation
        if (validateEmail(email)) {
            // Add to subscribers list and update localStorage
            subscribers.push(email);
            localStorage.setItem('subscribers', JSON.stringify(subscribers));
            updateLeaderboard();

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
        speakText(document.querySelector(".about__content .section__description").textContent);
        aboutSection.scrollIntoView({ behavior: "smooth" });
    });

    // Speech-to-Text functionality for email input
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

    // Text-to-Speech on hover for text elements
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

    // Text-to-Speech on hover for buttons
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

    // Speech Recognition for the repeat section
    const micContainer = document.getElementById("microphone");
    const bubbleText = document.querySelector(".bubble-text").textContent;
    const feedback = document.getElementById("feedback");

    micContainer.addEventListener("click", () => {
        if (window.SpeechRecognition || window.webkitSpeechRecognition) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.lang = 'nl-NL';
            recognition.start();

            recognition.onstart = () => {
                feedback.textContent = "Listening...";
            };

            recognition.onspeechend = () => {
                recognition.stop();
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                if (transcript.toLowerCase() === bubbleText.toLowerCase()) {
                    feedback.textContent = "Congratulations! You said it correctly.";
                    speakText("Congratulations! You said it correctly.");
                } else {
                    feedback.textContent = `Wrong! You said: ${transcript}`;
                    speakText(`Wrong! You said: ${transcript}`);
                }
            };

            recognition.onerror = (event) => {
                feedback.textContent = `Error: ${event.error}`;
                speakText(`Error: ${event.error}`);
            };
        } else {
            feedback.textContent = "Speech Recognition API is not supported in this browser.";
            speakText("Speech Recognition API is not supported in this browser.");
        }
    });

    // Check answer for quiz
    const checkAnswerBtn = document.querySelector('.check-answer');
    const answerFeedback = document.getElementById('answer-feedback');

    checkAnswerBtn.addEventListener('click', () => {
        const selectedOption = document.querySelector('input[name="quiz"]:checked');
        if (selectedOption) {
            if (selectedOption.value === 'duck') {
                answerFeedback.textContent = "Correct! El pato is the duck.";
                speakText("Correct! El pato is the duck.");
            } else {
                answerFeedback.textContent = "Incorrect! Please try again.";
                speakText("Incorrect! Please try again.");
            }
        } else {
            answerFeedback.textContent = "Please select an answer.";
            speakText("Please select an answer.");
        }
    });
});
