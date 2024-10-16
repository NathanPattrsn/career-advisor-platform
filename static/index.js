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

    // Typing effect function
    function typeMessage(message, containerId, typingSpeed) {
        const container = document.getElementById(containerId);
        container.innerHTML = ""; // Clear previous messages
        let index = 0;

        function type() {
            if (index < message.length) {
                container.innerHTML += message.charAt(index);
                index++;
                setTimeout(type, typingSpeed);
            } else {
                // Show options after typing is complete
                setTimeout(showOptions, 500); // Wait for 3 seconds after typing
            }
        }

        type();
    }

    // Function to show options with fade-in effect
    function showOptions() {
        const options = document.getElementById("options");
        options.style.display = "block"; // Change to block to show
        options.classList.add("show"); // Add show class for fade-in effect

        // Fade in buttons
        const buttons = options.getElementsByTagName("button");
        for (let button of buttons) {
            button.style.opacity = 0; // Set initial opacity to 0
            button.style.transition = "opacity 0.5s ease"; // Add transition
            setTimeout(() => {
                button.style.opacity = 1; // Fade in effect
            }, 50); // Start the fade-in effect
        }
    }

    // Call the typing function on page load
    typeMessage("Welcome to the AI Career Advisor platform designed for university students! This is currently in early stages and we are updating and improving this platform as we go along, any feedback would be much appreciated!", "typing-container", 35);
});

async function submitForm(event) {
    event.preventDefault(); // Prevent default form submission

    const formData = {
        name: document.getElementById('name').value,
        degree: document.getElementById('degree').value,
        modules: document.getElementById('modules').value.split(','),
        interests: document.getElementById('interests').value.split(',')
    };

    try {
        const response = await fetch('/add_profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            // Redirect to the chatbot page
            window.location.href = '/career-advisor';
        } else {
            const errorMessage = await response.json();
            alert(`Error: ${errorMessage.message}`);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}