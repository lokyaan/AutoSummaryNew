from flask import Flask, request, jsonify
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
summarizer = pipeline("summarization")

@app.route('/summarize', methods=['POST'])
def summarize():
     data = request.json
     text = data['text']
     min_length = data.get('min_length', 10)  # Default min length
     max_length = data.get('max_length', 150)  # Default max length
     summary = summarizer(text, min_length=min_length, max_length=max_length)[0]['summary_text']
     return jsonify({'summary': summary})

if __name__ == '__main__':
    app.run(debug=True)