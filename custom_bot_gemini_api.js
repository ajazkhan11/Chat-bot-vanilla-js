


//  Get input from user
function getinput() {
    let userInput = document.getElementById("user_input").value; // Get value from input field
    return userInput; // Return input
}



//  Add click event listener to submit button
document.getElementById("submit_button").addEventListener('click', async function () {
    let user_prompt = getinput(); // Get the user's input from textbox

    if (!user_prompt || user_prompt.toLowerCase() === "exit") { // If input is empty or "exit"
        return; // Stop function
    }

    const response = await sendMessageToGemini(user_prompt); // Send message to Gemini

    let remove_userinputs = document.getElementById("user_input");
    remove_userinputs.value = '';
    
    displayChatHistory(); // Show full conversation
});



//  Your Gemini API Key
const API_KEY = "YOUR_GEMINI_API_KEY_HERE"; // ⚠️ Keep this secret in production

//  Chat history will store messages from user and Gemini
let chatHistory = [];

//  Function to send a message to Gemini
async function sendMessageToGemini(prompt) {
    chatHistory.push({ role: "You", message: prompt }); // Save user message to history

    const contents = chatHistory.map(entry => ({
        role: entry.role.toLowerCase() === "you" ? "user" : "model", // Map roles
        parts: [{ text: entry.message }] // Wrap each message
    }));

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`; // Gemini API endpoint

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Tell server you're sending JSON
        },
        body: JSON.stringify({ contents }) // Send chat history
    });

    const data = await res.json(); // Get JSON response

    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) { // Check if valid response
        const response = data.candidates[0].content.parts[0].text; // Extract response text
        chatHistory.push({ role: "Ai BOT" , message: response }); // Save Gemini's response
        return response; // Return response
    } else {
        return "Error: No response or an error occurred."; // Error handling
    }
}

// Show full chat history in a paragraph and alert
function displayChatHistory() {
    let historyText = ''; // Prepare display string

    chatHistory.forEach((entry) => {
        historyText += `${entry.role}: ${entry.message}\n\n`; // Add each message
    });

    document.getElementById("repose").textContent = historyText; // Show on screen
    

}
