from flask import Flask, render_template, request, jsonify, session
from flask_mail import Mail, Message
from flask_cors import CORS
from ai_logic import get_career_advice, process_user_question  # Function for processing questions
import os
from dotenv import load_dotenv  # Import load_dotenv to load .env variables

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), '../templates'))
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

@app.route('/add_profile', methods=['POST'])
def add_new_profile():
    # Add new profile to session
    data = request.json
    profile_data = {
        'name': data.get('name'),
        'email': data.get('email'),
        'university': data.get('university'),
        'degree': data.get('degree'),
        'gpa': data.get('gpa'),
        'modules': ', '.join(data.get('modules', [])),
        'interests': ', '.join(data.get('interests', []))
    }
    session['profile'] = profile_data
    print("Profile added to session:", session['profile'])  # Debug statement
    return jsonify({"message": "Profile added successfully!"}), 201

@app.route('/fetch_profiles', methods=['GET'])
def fetch_profiles():
    # Fetch profiles stored in session
    profiles = session.get('profiles', [])
    return jsonify(profiles), 200

@app.route('/form')
def form():
    return render_template('index.html')

@app.route('/contact')
def contactform():
    return render_template('contact.html')

@app.route('/chatbot')
def chatbot():
    # Retrieve profile from session and get career advice
    profile = session.get('profile', {})
    print("Profile retrieved from session:", profile)  # Debug statement
    best_career_advice = get_career_advice(profile)

    # Structured message to display in the chatbot
    initial_message = {
        "path": best_career_advice,
        "name": profile.get('name'),
        "email": profile.get('email'),
        "university": profile.get('university'),
        "degree": profile.get('degree'),
        "gpa": profile.get('gpa'),
        "interests": profile.get('interests'),
        "modules": profile.get('modules')
    }

    return render_template('chatbot.html', initial_message=initial_message)

@app.route('/chatbot/ask', methods=['POST'])
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
    app.run(debug=True, port=port)
