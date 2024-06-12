document.addEventListener("DOMContentLoaded", () => {
    const micContainer = document.getElementById("microphone");
    const bubbleText = document.querySelector(".bubble-text").textContent;
    const feedback = document.getElementById("feedback");

    // Function to handle TTS
    function speakText(text) {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "nl-NL";
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }

    // Add hover TTS for all relevant elements
    document.querySelectorAll('p, h1, h2, h4, .nav__links a, .option span').forEach(element => {
        element.addEventListener('mouseenter', () => {
            speakText(element.textContent);
        });

        element.addEventListener('mouseleave', () => {
            window.speechSynthesis.cancel();
        });
    });

    // Add hover TTS for buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            speakText(button.textContent);
        });

        button.addEventListener('mouseleave', () => {
            window.speechSynthesis.cancel();
        });
    });

    // Function to handle STT
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
                const transcript = event.results[0][0].transcript.trim();
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
});
