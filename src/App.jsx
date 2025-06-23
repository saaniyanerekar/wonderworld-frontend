import { useState } from "react";
import "./App.css";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import VoiceSearch from "./VoiceSearch"; // Ensure this file exists!

function App() {
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [step, setStep] = useState(1);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [speech, setSpeech] = useState(null);

  // Handle the voice input result
  function handleVoiceInput(voiceResult) {
    setQuestion(voiceResult); // Set voice result into the question field
  }

 async function generateAnswer(e) {
  e.preventDefault();
  setGeneratingAnswer(true);
  setAnswer("loading...");

  try {
    const response = await axios.post("http://localhost:5000/ask", {
      question: question  // ✅ this matches Flask
    });
    const prompt = `Explain this for kids age 6 to 15: ${question}`;


    // ✅ FIX: Now extract the answer correctly!
    const rawAnswer = response.data.answer;

    const processedAnswer = postProcessAnswer(rawAnswer);
    setAnswer(processedAnswer);
  } catch (error) {
    setAnswer("Sorry, something went wrong. Please try again.");
    console.error("Error:", error);
  } finally {
    setGeneratingAnswer(false);
  }
}

  function postProcessAnswer(answer) {
    return answer.replace(/\*\*/g, "");
  }

  // Function to remove emojis from text
  function removeEmojis(text) {
    return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "");
  }

  function handleNextStep() {
    setStep(step + 1);
  }

  function readTextAloud() {
    if (answer) {
      const cleanedText = removeEmojis(answer);
      const speechInstance = new SpeechSynthesisUtterance(cleanedText);
      const voices = speechSynthesis.getVoices();
      speechInstance.voice = voices.find(v => v.name.includes("Google UK English Female")) || voices[0]; 
      speechInstance.rate = 1.1; // Slightly faster
      speechInstance.pitch = 1.4; // Higher pitch for a friendly tone
  
      setSpeech(speechInstance);
      window.speechSynthesis.speak(speechInstance);
    }
  }
  

  function stopReading() {
    window.speechSynthesis.cancel();
    setSpeech(null);
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 h-screen p-3 flex flex-col justify-center items-center">
      <h1 className="title">Wonder World</h1>
      {step === 1 && (
        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105">
          <h2 className="subtitle">Welcome, young explorer! 🌟</h2>
          <p>What subject are you curious about today?</p>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="input-field"
          />
          <button onClick={handleNextStep} className="button mt-4">
            NEXT
          </button>
        </div>
      )}
      {step === 2 && (
        <form
          onSubmit={generateAnswer}
          className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg shadow-lg bg-white py-6 px-4 transition-all duration-500 transform hover:scale-105"
        >
          <textarea
            required
            className="input-field my-4"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What's your question?"
          ></textarea>

          {/* Voice Search Component */}
          <VoiceSearch onVoiceResult={handleVoiceInput} />

          <button
            type="submit"
            className={`button ${generatingAnswer ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={generatingAnswer}
          >
            {generatingAnswer ? "Generating..." : "Generate Answer"}
          </button>
        </form>
      )}
      {answer && (
        <div className="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 text-center rounded-lg bg-white my-4 shadow-lg transition-all duration-500 transform hover:scale-105">
          <ReactMarkdown className="answer-container p-4">{answer}</ReactMarkdown>
          <button onClick={readTextAloud} className="button mt-2">🔊 Read Aloud</button>
          <button onClick={stopReading} className="button mt-2">⏹️ Stop</button>
        </div>
      )}
    </div>
  );
}

export default App;
