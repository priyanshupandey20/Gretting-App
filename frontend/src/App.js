import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Import animation library

function App() {
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [darkMode, setDarkMode] = useState(localStorage.getItem("darkMode") === "true");

    const [speechRate, setSpeechRate] = useState(1);
    const [speechPitch, setSpeechPitch] = useState(1);
    const [selectedGreeting, setSelectedGreeting] = useState("default");

    const greetings = {
        default: "Hello, {name}! Have an amazing day! 🎉",
        funny: "Hey {name}, you're awesome! Now go take over the world! 😆",
        motivational: "{name}, you're doing great! Keep pushing forward! 🚀",
        friendly: "Welcome, {name}! Stay awesome! 💖"
    };

    const speakGreeting = (text) => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.lang = "en-US";
            speech.rate = speechRate;
            speech.pitch = speechPitch;
            window.speechSynthesis.speak(speech);
        }
    };

    const startListening = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.onstart = () => console.log("Listening...");
        recognition.onresult = (event) => {
            const spokenName = event.results[0][0].transcript;
            setName(spokenName);
        };
        recognition.start();
    };

    const fetchGreeting = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/greet?name=${name}`);
            setMessage(response.data.message);
            speakGreeting(response.data.message);
        } catch (error) {
            const customGreeting = greetings[selectedGreeting].replace("{name}", name);
            setMessage(customGreeting);
            speakGreeting(customGreeting);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        localStorage.setItem("darkMode", !darkMode);
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [darkMode]);

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} flex items-center justify-center min-h-screen transition-colors duration-300`}>
            <motion.div 
                className={`p-8 rounded-lg shadow-xl max-w-md w-full text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <button 
                    onClick={toggleDarkMode} 
                    className="absolute top-4 right-4 p-2 rounded-full bg-gray-300 dark:bg-gray-700 transition duration-300"
                >
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                </button>

                <h1 className="text-3xl font-bold mb-4">Greeting App</h1>
                <p className="mb-6">Enter or Speak your name to get a personalized greeting!</p>

                <div className="flex space-x-2">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 ${
                            darkMode ? "bg-gray-700 text-white placeholder-gray-300 border-gray-600" : "bg-white text-black border-gray-300"
                        }`}
                    />
                    <button
                        onClick={startListening}
                        className="bg-gray-200 text-gray-700 p-3 rounded-lg hover:bg-gray-300 transition duration-300"
                    >
                        🎤
                    </button>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Choose Greeting Style:</label>
                    <select 
                        value={selectedGreeting} 
                        onChange={(e) => setSelectedGreeting(e.target.value)}
                        className="w-full p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="default">✨ Default</option>
                        <option value="funny">😂 Funny</option>
                        <option value="motivational">🚀 Motivational</option>
                        <option value="friendly">💖 Friendly</option>
                    </select>
                </div>

                <div className="mt-4">
                    <label className="block text-gray-700 dark:text-gray-300">Voice Speed:</label>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1" 
                        value={speechRate} 
                        onChange={(e) => setSpeechRate(e.target.value)}
                        className="w-full"
                    />
                    <label className="block text-gray-700 dark:text-gray-300 mt-2">Voice Pitch:</label>
                    <input 
                        type="range" 
                        min="0.5" 
                        max="2" 
                        step="0.1" 
                        value={speechPitch} 
                        onChange={(e) => setSpeechPitch(e.target.value)}
                        className="w-full"
                    />
                </div>

                <motion.div className="flex gap-2 mt-4">
                    <motion.button
                        onClick={fetchGreeting}
                        className="w-1/2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
                        whileTap={{ scale: 0.9 }}
                    >
                        Get Greeting 🎙️
                    </motion.button>
                    <motion.button
                        onClick={() => speakGreeting(message)}
                        className="w-1/2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-300"
                        disabled={!message}
                        whileTap={{ scale: 0.9 }}
                    >
                        🔁 Repeat
                    </motion.button>
                </motion.div>

                <motion.h2 
                    className="mt-4 text-lg font-semibold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {message}
                </motion.h2>
            </motion.div>
        </div>
    );
}

export default App;
