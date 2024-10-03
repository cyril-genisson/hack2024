# save this as app.py
from flask import Flask,request,jsonify
from flask import render_template
import requests

app = Flask(__name__)

@app.route("/")
def hello():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat_with_ai():
    data = request.json
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    # Corrected URL (removed extra 'h')
    url = "http://localhost:1234/v1/chat/completions"
    payload = {
        "model": "jpacifico/Chocolatine-3B-Instruct-DPO-Revised-Q4_K_M-GGUF",  # Updated model as per your earlier requests
        "messages": [{"role": "user", "content": user_message}],
        "max_tokens": 10000
    }

    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            ai_reply = response.json().get("choices", [])[0].get("message", {}).get("content", "").strip()
            return jsonify({"response": ai_reply})
        else:
            return jsonify({"error": response.text}), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500