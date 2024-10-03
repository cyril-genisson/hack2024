import os
from flask import Flask, request, jsonify, render_template, session
from flask_session import Session
from mistralai import Mistral
import markdown
import asyncio

app = Flask(__name__, static_folder="static", template_folder="templates")

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

MISTRAL_API_KEY = "iWzL01E2EVBLPWOzqKg3Y4nn9Dvx08Ul"
api_key = os.environ.get("MISTRAL_API_KEY", MISTRAL_API_KEY)
model = "mistral-large-latest"

client = Mistral(api_key=api_key)
history = """Tu gères l'urbanisation de la ville de Paris et tu dois générer un rapport sur la biodiversité des arbres dans la ville de Paris. On te fournit les données suivantes :
    [Your data here]
"""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_with_ai():
    if 'conversation_history' not in session:
        session['conversation_history'] = [{"role": "system", "content": history}]
    else:
        session['conversation_history'] = session['conversation_history'][-2:]

    user_message = request.json.get("message")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    session['conversation_history'].append({"role": "user", "content": user_message})

    try:
        chat_response = client.chat.complete(
            model=model,
            messages=session['conversation_history']
        )

        ai_reply = chat_response.choices[0].message.content.strip()
        ai_reply_html = markdown.markdown(ai_reply)

        session['conversation_history'].append({"role": "assistant", "content": ai_reply_html})

        return jsonify({"response": ai_reply_html})

    except Exception as e:
        app.logger.error(f"Error in chat_with_ai: {str(e)}")
        return jsonify({"error": "An error occurred while processing your request"}), 500

if __name__ == '__main__':
    app.run(debug=True)