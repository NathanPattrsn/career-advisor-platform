document.addEventListener("DOMContentLoaded", function() {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatbox = document.getElementById("chatbox");

    // Sample responses for chatbot
    const chatbotResponses = {
        "hi": "Hi there! How can I assist you with your career today?",
        "hello": "Hi there! How can I assist you with your career today?",
        "career": "Career paths vary depending on your degree and interests. What field are you interested in?",
        "job": "Looking for job opportunities? Let me know your degree or skills and I can help!",
        "internship": "Internships are a great way to gain experience. What industry are you aiming for?",
        "degree": "Tell me more about your degree, and I'll suggest career options!",
        "thank you": "You're welcome! I'm here to help anytime."
    };

    const defaultResponse = "I’m sorry, I didn’t quite catch that. Could you please rephrase or ask something else related to careers?";

    // Hamburger menu toggle functionality
    hamburger.addEventListener("click", function() {
        if (sidebar.style.left === "0px") {
            sidebar.style.left = "-250px"; // Close the sidebar
            content.style.marginLeft = "0"; // Adjust content back
            hamburger.classList.remove("white"); // Remove white color when closed
        } else {
            sidebar.style.left = "0px"; // Open the sidebar
            content.style.marginLeft = "250px"; // Shift content right
            hamburger.classList.add("white"); // Add white color when open
        }
    });

    // Close sidebar when clicking on links
    const links = sidebar.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.style.left = "-250px"; // Close the sidebar
            content.style.marginLeft = "0"; // Adjust content back
            hamburger.classList.remove("white"); // Ensure color resets when closed
        });
    });

    // Function to display messages in the chatbox
    function addMessageToChatbox(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(sender === "user" ? "user-message" : "bot-message");
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Scroll to the bottom
    }

    // Function to learn from user input and store it
    function learnFromUserInput(message) {
        if (message.includes("degree in")) {
            // Extract degree info
            userData.degree = message.split("degree in")[1].trim();
            localStorage.setItem("userData", JSON.stringify(userData));
        }
        if (message.includes("interested in")) {
            // Extract job interest info
            userData.jobInterest = message.split("interested in")[1].trim();
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    }

    // Function to get personalized responses based on stored user data
    function getPersonalizedResponse(message) {
        if (userData.degree) {
            chatbotResponses["degree"] = `You mentioned you're pursuing a degree in ${userData.degree}. There are great opportunities in that field!`;
        }
        if (userData.jobInterest) {
            chatbotResponses["job"] = `You told me you're interested in ${userData.jobInterest}. You could explore opportunities in that field.`;
        }
    }

    // Function to handle user input
    function handleUserInput() {
        const userMessage = userInput.value.trim().toLowerCase();
        if (!userMessage) return;

        // Display user message
        addMessageToChatbox(userMessage, "user");

        // Process learning and store relevant info
        learnFromUserInput(userMessage);

        // Generate a response based on chatbot memory
        getPersonalizedResponse(userMessage);

        // Find a suitable chatbot response or use default
        let chatbotReply = chatbotResponses[userMessage] || defaultResponse;

        // Simulate delay for chatbot response
        setTimeout(() => {
            addMessageToChatbox(chatbotReply, "bot");
        }, 500);

        // Clear input after sending
        userInput.value = '';
    }

    // Initialize conversation with a welcome message
    if (userData.name && userData.degree) {
        addMessageToChatbox(`Welcome, ${userData.name}! Your degree is in ${userData.degree}.`, "bot");
    }

    // Send user message on button click or Enter key press
    sendButton.addEventListener("click", handleUserInput);
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });

    // Clear user data from local storage
    function clearUserData() {
        localStorage.removeItem("userData");
        userData = Object.create(null);
    }
});
