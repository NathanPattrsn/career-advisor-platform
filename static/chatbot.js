document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");

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

    // Scroll to bottom when new message is added
    const sendButton = document.getElementById("send-button");
    const userInput = document.getElementById("user-input");
    const chatbox = document.getElementById("chatbox");

    // Initialize an object to store user data
    let userData = JSON.parse(localStorage.getItem("userData")) || {};

    // Generic chatbot responses
    const chatbotResponses = {
        "hi": "Hello! How can I help you today?",
        "hello": "Hi there! What's on your mind?",
        "how are you": "I'm a chatbot, so I don't have feelings, but I'm ready to assist you!",
        "what's your name": "I'm your AI assistant, here to help with whatever you need.",
        "thank you": "You're welcome! Feel free to ask me anything.",
        "weather": "I don't have live weather data, but you can check your favorite weather app for current conditions.",
        "time": `The current time is ${new Date().toLocaleTimeString()}.`,
        "date": `Today's date is ${new Date().toLocaleDateString()}.`,
        "goodbye": "Goodbye! Have a great day!"
    };

    const defaultResponse = "I'm not sure about that. Could you clarify or ask something else?";

    // Add personalized responses based on stored user data
    function getPersonalizedResponse(message) {
        if (userData.name) {
            chatbotResponses["what's your name"] = `You can call me your assistant, and I remember your name is ${userData.name}.`;
        }
        if (userData.hobby) {
            chatbotResponses["hobby"] = `You mentioned your hobby is ${userData.hobby}. That's awesome! How's that going?`;
        }
    }

    // Function to handle user input
    function handleUserInput() {
        const userMessage = userInput.value.trim().toLowerCase();
        if (!userMessage) return;

        // Display user message with the same styling as the first version
        addMessageToChatbox(userMessage, "user-message");

        // Process learning and store relevant info
        learnFromUserInput(userMessage);

        // Generate a response based on chatbot memory
        getPersonalizedResponse(userMessage);

        // Find a suitable chatbot response or use default
        let chatbotReply = chatbotResponses[userMessage] || defaultResponse;

        // Simulate delay for chatbot response
        setTimeout(() => {
            addMessageToChatbox(chatbotReply, "bot-message");
        }, 500);

        // Clear input after sending
        userInput.value = '';
    }

    // Function to learn from user input and store it
    function learnFromUserInput(message) {
        if (message.includes("my name is")) {
            // Extract name info
            userData.name = message.split("my name is")[1].trim();
            localStorage.setItem("userData", JSON.stringify(userData));
        }
        if (message.includes("my hobby is")) {
            // Extract hobby info
            userData.hobby = message.split("my hobby is")[1].trim();
            localStorage.setItem("userData", JSON.stringify(userData));
        }
    }

    // Function to display messages in the chatbox (same as previous version)
    function addMessageToChatbox(message, messageClass) {
        const messageElement = document.createElement("div");
        messageElement.classList.add(messageClass); // Apply proper class for user or bot messages
        messageElement.textContent = message;
        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight; // Automatically scroll to the latest message
    }

    // Send message on button click or Enter key press
    sendButton.addEventListener("click", handleUserInput);
    userInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            handleUserInput();
        }
    });

    // Clear stored data if needed
    function clearUserData() {
        localStorage.removeItem("userData");
        userData = {};
    }
});
