from flask import Flask, render_template, request, jsonify, session
from flask_mail import Mail, Message
from flask_cors import CORS
from ai_logic import get_career_advice, process_user_question  # Function for processing questions
import os
from dotenv import load_dotenv  # Import load_dotenv to load .env variables

# Load environment variables from .env file
load_dotenv()

app = Flask(
    __name__,
    template_folder=os.path.join(os.path.dirname(__file__), '../templates'),
    static_folder=os.path.join(os.path.dirname(__file__), '../static')
)
app.secret_key = 'JHagduasdYGBJKUH34253245'  # Secret key for session management
CORS(app)

# Configure Flask-Mail with environment variables
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Fetch from environment variable
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Fetch from environment variable
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')  # Use the same email as the sender

# Raise an error if environment variables for email are missing
if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
    raise ValueError("MAIL_USERNAME and MAIL_PASSWORD must be set as environment variables")

mail = Mail(app)

@app.route('/send_email', methods=['POST'])
def send_email():
    # Fetch form data
    subject = request.form.get('subject')
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    # Debugging: Print the form data
    print(f"Subject: {subject}, Name: {name}, Email: {email}, Message: {message}")

    # Create and send email
    msg = Message(subject, recipients=["onesitedesigns@gmail.com"])
    msg.body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

    try:
        mail.send(msg)
        print("Email sent successfully!")  # Debugging line
        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        print(f"Error sending email: {str(e)}")  # Debugging line
        return jsonify({"message": "Failed to send email.", "error": str(e)}), 500

# Route for serving the base HTML page
@app.route('/')
def home():
    return render_template('base.html')

@app.route('/profile_create')
def profcreate():
    return render_template('profile_create.html')

@app.route('/login')
def proflogin():
    return render_template('profile_login.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/add_profile', methods=['POST'])
def add_profile():
    profile_data = request.json
    session['profile'] = profile_data  # Store the profile in session
    return jsonify({"message": "Profile added successfully"}), 200

@app.route('/fetch_profiles', methods=['GET'])
def fetch_profiles():
    profiles = session.get('profiles', [])  # Fetch profiles stored in session
    return jsonify(profiles), 200

@app.route('/form')
def form():
    return render_template('index.html')

@app.route('/contact')
def contactform():
    return render_template('contact.html')

@app.route('/chatbot')
def chatbot1():
    return render_template('chatbot.html')

@app.route('/career-advisor')
def career_advisor():
    # profile = session.get('profile', None)

    # if not profile:
    #     return "No profile found. Please fill out the form first.", 400

    # # Generate career suggestion based on the user's profile
    # best_career_advice = generate_career_suggestion(profile)

    # # Structured message to display in the chatbot
    initial_message = {
    #     "path": best_career_advice,
    #     "name": profile.get('name'),
    #     "degree": profile.get('degree'),
    #     "interests": profile.get('interests'),
    #     "modules": profile.get('modules')
    }

    # Render the chatbot page, passing in the initial message
    return render_template('career-advisor.html', initial_message=initial_message)

# Function to analyze the profile and give a career suggestion
def generate_career_suggestion(profile):
    degree = profile.get('degree')
    modules = profile.get('modules')
    interests = profile.get('interests')

    # Simplified career advice logic based on degree and interests
    if 'computer science' in degree.lower():
        if 'machine learning' in modules or 'ai' in interests:
            return "AI Specialist or Machine Learning Engineer"
        else:
            return "Software Engineer or Web Developer"
    elif 'business' in degree.lower():
        return "Business Analyst or Project Manager"
    else:
        return "Explore roles based on your strengths and interests!"

@app.route('/career-advisor/ask', methods=['POST'])
def ask_bot():
    # Process user questions with AI logic
    data = request.json
    question = data.get('question', '')
    profile = session.get('profile', {})
    
    response = process_user_question(question, profile)  # Function that processes user question
    return jsonify({"response": response})

@app.route('/check_session', methods=['GET'])
def check_session():
    # Check if a profile is stored in session
    profile = session.get('profile')  # Retrieve profile data from session
    if profile:
        return jsonify({"profile": profile}), 200
    else:
        return jsonify({"message": "No profile found in session."}), 404

if __name__ == '__main__':
    port = int(os.getenv('PORT', 443))  # Default to port 443 if not set
    app.run(debug=True, host='0.0.0.0', port=port)
