const supabaseUrl = 'https://ynqfcsnmekopstlkgadm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlucWZjc25tZWtvcHN0bGtnYWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxMDA0MjUsImV4cCI6MjA0NDY3NjQyNX0.Rg6_lUSTkGOec-cm7UQzikTFcBf57qqKFWxW59rznpg'; // Use environment variable in production
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
  
      console.log('Login form submitted'); // Debugging line
  
      try {
        const response = await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password,
        });
      
        console.log('Response:', response);
      
        if (response.error) {
          console.error('Error signing in:', response.error);
          alert('There was an error signing you in. Please check your email and password and try again.');
          return;
        }
      
        const userData = {
          email: response.data.user.email,
          username: response.data.user.username,
          // Add any other properties you need
        };
      
        sessionStorage.setItem('userData', JSON.stringify(userData));
        window.location.href = '/profile'; // Redirect to your profile page
      } catch (error) {
        console.error('Error signing in:', error);
        alert('There was an error signing you in. Please check your email and password and try again.');
      }
    });
  });
