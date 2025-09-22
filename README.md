# Gemini Chatbot Project

## Web API Integration - Extra Credit

### What is this API about?

This project uses Google's Gemini 1.5 Flash API, which is a powerful generative AI model developed by Google. The Gemini API allows developers to integrate advanced natural language processing capabilities into their applications. It can understand and generate human-like text responses, making it perfect for creating intelligent chatbots, content generation, question-answering systems, and various other AI-powered applications. The Gemini 1.5 Flash model is optimized for speed and efficiency while maintaining high-quality responses, making it ideal for real-time chat applications.

### API URL

```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCg4txe-uvTFP9yWgry4TeMqzEq5qNrCUI
```

### API Result

The API returns a JSON response with the following structure:

```json
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Hello! How can I help you today? I'm ready to answer your questions or have a conversation with you."
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0,
      "safetyRatings": [
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "probability": "NEGLIGIBLE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "probability": "NEGLIGIBLE"
        }
      ]
    }
  ]
}
```

### Parsed Result for Web App Display

From the API response, we extract and display the following information:

1. **Main Response Text**: `response.candidates[0].content.parts[0].text`
   - This contains the actual AI-generated response that will be displayed to the user

2. **Safety Status**: `response.candidates[0].safetyRatings`
   - Used to ensure the response meets safety guidelines before displaying

3. **Finish Reason**: `response.candidates[0].finishReason`
   - Indicates whether the response was completed successfully ("STOP") or truncated

**Example of parsed data used in the web app:**
```javascript
const aiResponse = data.candidates[0].content.parts[0].text;
const isComplete = data.candidates[0].finishReason === "STOP";
const safetyCheck = data.candidates[0].safetyRatings.every(
  rating => rating.probability === "NEGLIGIBLE" || rating.probability === "LOW"
);
```

The chatbot displays the `aiResponse` text in a chat bubble format, and uses the safety check to ensure appropriate content is shown to users.

---

## How to Use

1. Clone the repository and switch to the `call-api` branch
2. Open the HTML file in a web browser
3. Type your message in the input field
4. Click "Send" to get AI-powered responses from Gemini
5. The chat history is maintained throughout the session

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Google Gemini 1.5 Flash API
- Fetch API for HTTP requests
