from flask import Flask, render_template, request, jsonify, session
from flask_mail import Mail, Message
from flask_cors import CORS
from ai_logic import get_career_advice, process_user_question  # New function for processing questions
import os
app = Flask(__name__, template_folder=os.path.join(os.path.dirname(__file__), '../templates'))
app.secret_key = 'JHagduasdYGBJKUH34253245'
CORS(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')  # Fetching from environment variable
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')  # Fetching from environment variable
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME')  # Using the same email as sender

# Raise an error if environment variables are missing
if not app.config['MAIL_USERNAME'] or not app.config['MAIL_PASSWORD']:
    raise ValueError("MAIL_USERNAME and MAIL_PASSWORD must be set as environment variables")

mail = Mail(app)

@app.route('/send_email', methods=['POST'])
def send_email():
    subject = request.form.get('subject')
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    print(f"Subject: {subject}, Name: {name}, Email: {email}, Message: {message}")  # Debugging line

    msg = Message(subject, recipients=["onesitedesigns@gmail.com"])
    msg.body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

    try:
        mail.send(msg)
        print("Email sent successfully!")  # Debugging line
        return jsonify({"message": "Email sent successfully!"}), 200
    except Exception as e:
        print(f"Error sending email: {str(e)}")  # Debugging line
        return jsonify({"message": "Failed to send email.", "error": str(e)}), 500


# Route for serving the index.html page
@app.route('/')
def home():
    return render_template('base.html')

@app.route('/add_profile', methods=['POST'])
def add_new_profile():
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
    # Store profile data in session
    session['profile'] = profile_data
    print("Profile added to session:", session['profile'])  # Debug statement
    return jsonify({"message": "Profile added successfully!"}), 201



@app.route('/fetch_profiles', methods=['GET'])
def fetch_profiles():
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
    profile = session.get('profile', {})
    print("Profile retrieved from session:", profile)  # Debug statement
    best_career_advice = get_career_advice(profile)

    # Create a structured message
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
    data = request.json
    question = data.get('question', '')
    profile = session.get('profile', {})
    
    # Process the user's question with your NLP logic
    response = process_user_question(question, profile)  # This function handles the user's question

    return jsonify({"response": response})


@app.route('/check_session', methods=['GET'])
def check_session():
    profile = session.get('profile')  # Retrieve profile data from session
    if profile:
        return jsonify({"profile": profile}), 200
    else:
        return jsonify({"message": "No profile found in session."}), 404



if __name__ == '__main__':
    app.run(debug=True)
