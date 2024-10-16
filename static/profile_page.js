document.addEventListener("DOMContentLoaded", async () =>  {
    const hamburger = document.getElementById("hamburger");
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");

    const { createClient } = window.supabase;
    const supabaseUrl = 'https://ynqfcsnmekopstlkgadm.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucWZjc25tZWtvcHN0bGtnYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMDA0MjUsImV4cCI6MjA0NDY3NjQyNX0.Rg6_lUSTkGOec-cm7UQzikTFcBf57qqKFWxW59rznpg'; // Use environment variable in production
    const supabase = createClient(supabaseUrl, supabaseKey);

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

    // Logout function
    async function logout() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error);
            alert('There was an error logging you out. Please try again.');
        } else {
            // Redirect to login or home page
            window.location.href = '/login'; // Change to your login page
        }
    }

    // Attach logout function to a button (assuming you have a logout button with id 'logoutButton')
    document.getElementById('logoutButton').addEventListener('click', logout);

    // Fetch user data
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData) {
        console.log('User data:', userData);

        // Query the Supabase database to retrieve the user's data
        const { data, error } = await supabase
            .from('profiles')
            .select('name, username, email, password')
            .eq('email', userData.email);

        if (error) {
            console.error('Error retrieving user data:', error);
        } else {
            const user = data[0];
            if (user) {
                console.log('User data from database:', user);

                // Update the page with the user data
                document.getElementById('welcome-message').innerHTML = `Welcome, ${user.username}!`;
                document.getElementById('profile-name').innerHTML = user.name;
                document.getElementById('profile-email').innerHTML = user.email;
                document.getElementById('username').innerHTML = user.username;
                document.getElementById('username-display').innerHTML = user.username;
                document.getElementById('password').innerHTML = user.password; // Consider security implications
            } else {
                console.error('No user found with the provided email.');
                alert('No user found with the provided email.');
            }
        }
    } else {
        // User is not logged in, redirect to login page
        window.location.href = '/login';
    }
});
