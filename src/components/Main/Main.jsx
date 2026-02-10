import React, { useEffect, useRef, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import generateGeminiResponse from '../../api/gemini';

const Main = () => {
  const promptRef = useRef();
  const bottomRef = useRef();
  const [chatHistory, setChatHistory] = useState([]);
  const [hasStartedChat, setHasStartedChat] = useState(false);

 const handleSend = async () => {
  const prompt = promptRef.current.value.trim();
  if (!prompt) return;

  if (!hasStartedChat) setHasStartedChat(true);

  // Clear input field
  promptRef.current.value = '';

  // Add user message only once
  setChatHistory((prev) => [...prev, { role: "user", text: prompt }]);

  try {
    const response = await generateGeminiResponse(prompt);
    
    // Only add Gemini response here
    setChatHistory((prev) => [...prev, { role: "gemini", text: response }]);
  } catch (err) {
    console.error("Error fetching Gemini response:", err);
    setChatHistory((prev) => [
      ...prev,
      { role: "gemini", text: "❌ Failed to get response from Gemini." }
    ]);
  }
};

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    const input = promptRef.current;
    if (input) input.addEventListener("keypress", handleKeyPress);
    return () => {
      if (input) input.removeEventListener("keypress", handleKeyPress);
    };
  }, []);

  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chatHistory]);

  return (
    <div className='main'>
      {/* Top Navbar */}
      <div className="nav">
        <p>Gemini</p>
         <img src={assets.user_icon} alt="user" />
      </div>

      <div className="main-container">
        {/* Greeting and Cards */}
        {!hasStartedChat && (
          <>
            <div className="greet">
              <p><span>Hello,Dev </span></p>
              <p>How can I help you today?</p>
            </div>

            <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming roadtrip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Briefly Summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Improve code readability</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        )}

        {/* Chat Area */}
        <div className="chat-area">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.role === "user" ? "user-msg" : "gemini-msg"}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Bottom Input */}
        <div className="main-bottom">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter a prompt here"
              ref={promptRef}
              id="prompt"
            />
            <div>
              <img src={assets.gallery_icon} alt="gallery" />
              <img src={assets.mic_icon} alt="mic" />
              <img
                src={assets.send_icon}
                alt="send"
                id="send-btn"
                onClick={handleSend}
              />
            </div>
          </div>

          <p className="bottom-info">
            Gemini may display inaccurate information about people, places, or facts.
            Always verify with reliable sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
