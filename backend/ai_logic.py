# ai_logic.py

def process_user_question(question, profile):
    question = question.lower()  # Normalize the question for easier processing
    
    # Example basic processing logic
    if "career" in question:
        return f"Based on your interests and degree in {profile.get('degree')}, you might consider the following career paths: {get_career_advice(profile)}."
    
    elif "help" in question or "what can you do" in question:
        return "I can help you with career advice based on your profile, answer questions about different careers, or assist you in understanding your interests better."

    elif "suggest" in question or "recommend" in question:
        return "I can suggest various career paths based on your degree and interests. What would you like to know about?"

    # If the bot doesn't understand, prompt for clarification
    return "I'm not sure how to respond to that. Could you rephrase your question, or ask about career paths or what I can help you with?"


def get_career_advice(profile):
    career_paths = {
        "Web Design & Development": [
            "Front-End Developer",
            "Back-End Developer",
            "Full-Stack Developer",
            "UI/UX Designer",
            "Web Project Manager",
            "Freelance Web Designer",
            "Web Consultant",
            "SEO Specialist",
            "Digital Marketing Manager"
        ],
        "Computer Science": [
            "Software Engineer",
            "Data Scientist",
            "AI Engineer",
            "Systems Analyst",
            "Database Administrator",
            "DevOps Engineer",
            "Network Engineer",
            "Cybersecurity Analyst",
            "Mobile App Developer"
        ],
        "Marketing": [
            "Digital Marketing Specialist",
            "SEO Consultant",
            "Content Strategist",
            "Brand Manager",
            "Market Research Analyst",
            "Social Media Manager",
            "Public Relations Specialist"
        ],
        "Business Administration": [
            "Business Analyst",
            "Operations Manager",
            "Project Manager",
            "Financial Analyst",
            "Human Resources Manager",
            "Supply Chain Manager"
        ],
        "Psychology": [
            "Clinical Psychologist",
            "Counseling Psychologist",
            "Human Resources Specialist",
            "Market Research Analyst",
            "User Experience Researcher"
        ],
        "Engineering": [
            "Mechanical Engineer",
            "Civil Engineer",
            "Electrical Engineer",
            "Chemical Engineer",
            "Project Engineer",
            "Quality Assurance Engineer"
        ],
        # Add more degrees and corresponding career paths
    }

    interests = profile.get("interests", "").lower()
    degree = profile.get("degree", "")
    gpa = profile.get("gpa", "").lower()  # Can be used for additional filtering if needed
    modules = profile.get("modules", "").lower()  # Can provide additional context

    suggestions = career_paths.get(degree, [])

    # Enhance suggestions based on interests
    if "design" in interests:
        suggestions.extend(["Graphic Designer", "Art Director"])
    if "data" in interests:
        suggestions.extend(["Data Analyst", "Business Intelligence Analyst"])
    if "software" in interests:
        suggestions.extend(["Software Tester", "Quality Assurance Analyst"])
    if "marketing" in interests:
        suggestions.extend(["Email Marketing Specialist", "Content Marketing Manager"])
    
    # Logic to refine suggestions based on GPA (e.g., high GPA in tech might suggest more technical roles)
    if gpa and "first" in gpa:  # Assuming "first" indicates a high GPA
        suggestions.append("Technical Project Manager")

    # If modules are related to certain skills, suggest careers accordingly
    if "ai" in modules or "machine learning" in modules:
        suggestions.append("Machine Learning Engineer")

    # Remove duplicates
    suggestions = list(set(suggestions))

    if suggestions:
        return ", ".join(suggestions)
    else:
        return "Explore various fields that align with your interests and skills."
    
