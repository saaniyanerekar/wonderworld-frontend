import { useState } from "react";

function VoiceSearch({ onVoiceResult }) {
  const [isListening, setIsListening] = useState(false);

  function startListening() {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Browser does not support speech recognition.");
      return;
    }
  
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
  
    recognition.onstart = () => setIsListening(true);
  
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onVoiceResult(transcript);
      setIsListening(false);
    };
  
    recognition.onerror = (event) => {
      setIsListening(false);
      console.error("Speech Recognition Error: ", event.error); // Logs error in Console
      alert(`Error: ${event.error}`); // Shows exact error message
    };
  
    recognition.onend = () => setIsListening(false);
  
    recognition.start();
  }
  

  return (
    <div className="text-center my-3">
      <button
        type="button"
        onClick={startListening}
        className={`button ${isListening ? "bg-gray-400" : "bg-blue-500"}`}
      >
        🎤 {isListening ? "Listening..." : "Tap to Speak"}
      </button>
    </div>
  );
}

export default VoiceSearch;
