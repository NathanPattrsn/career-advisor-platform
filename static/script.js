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

// Other event listeners and AJAX code...

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


// static/script.js

// Initialize Supabase client
const supabaseUrl = 'https://ynqfcsnmekopstlkgadm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucWZjc25tZWtvcHN0bGtnYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMDA0MjUsImV4cCI6MjA0NDY3NjQyNX0.Rg6_lUSTkGOec-cm7UQzikTFcBf57qqKFWxW59rznpg'; // Use environment variable in production
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Handle Profile Form Submission
document.getElementById('profileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    // Optional: Check if email is already registered before inserting
    const { data: existingProfiles, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);
    
    if (fetchError) {
        console.error('Error checking existing profiles:', fetchError);
        alert('There was an error checking your profile. Please try again.');
        return;
    }

    if (existingProfiles.length > 0) {
        alert('This email is already registered. Please log in or use a different email.');
        return;
    }

    // Insert the new profile
    const { data, error } = await supabase
        .from('profiles')
        .insert([{ name, username, email }]);

    if (error) {
        console.error('Error creating profile:', error);
        alert('There was an error creating your profile. Please try again.');
    } else {
        alert('Profile created successfully!');
        document.getElementById('create-profile-form').style.display = 'none';
        document.getElementById('main-form').style.display = 'block';
    }
});

