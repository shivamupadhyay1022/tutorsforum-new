import { useState } from "react";
import { db } from "../firebase"; // Ensure correct Firebase import
import { ref, push } from "firebase/database";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome to TutorsForum! How can I assist you?", type: "bot" },
    { text: "Please choose a category:", type: "bot" },
  ]);
  const [chatState, setChatState] = useState("main");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleButtonClick = (text, nextState) => {
    setMessages((prev) => [...prev, { text, type: "user" }]);
    if (nextState) setChatState(nextState);
    setTimeout(() => {
      if (nextState === "tutor") {
        setMessages((prev) => [
          ...prev,
          { text: "Here are some tutor-related questions:", type: "bot" },
        ]);
      } else if (nextState === "student") {
        setMessages((prev) => [
          ...prev,
          { text: "Here are some student-related questions:", type: "bot" },
        ]);
      } else if (nextState === "contact") {
        setMessages((prev) => [
          ...prev,
          { text: "Please fill out this form to contact us.", type: "bot" },
        ]);
      }
    }, 500);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await push(ref(db, "queries"), formData);
    setMessages([
      { text: "Thank you! Your query has been submitted.", type: "bot" },
      { text: "For any further queries, reach us at support@tutorsforum.in", type: "bot" },
    ]);
    setChatState("main");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        className="fixed bottom-5 right-5 bg-peach-200 z-10 text-white px-4 py-2 rounded-full shadow-lg hover:bg-peach-400 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬 Chat
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 z-10 bg-white shadow-xl border rounded-lg">
          {/* Chat Header */}
          <div className="bg-peach-200 text-white p-3 flex justify-between">
            <span>Chat with TutorsForum</span>
            <button onClick={() => setIsOpen(false)}>✖</button>
          </div>

          {/* Chat Messages */}
          <div className="p-3 h-64 overflow-y-auto flex flex-col space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${msg.type === "bot" ? "bg-gray-200 self-start" : "bg-blue-500 text-white self-end"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Navigation Questions */}
          <div className="p-3 space-y-2">
            {chatState === "main" && (
              <>
                <button onClick={() => handleButtonClick("Tutor Related", "tutor")} className="w-full bg-gray-100 p-2 rounded">Tutor Related</button>
                <button onClick={() => handleButtonClick("Student Related", "student")} className="w-full bg-gray-100 p-2 rounded">Student Related</button>
                <button onClick={() => handleButtonClick("Contact TutorsForum", "contact")} className="w-full bg-gray-100 p-2 rounded">Contact TutorsForum</button>
              </>
            )}

            {/* Tutor Related Questions */}
            {chatState === "tutor" && (
              <>
                <button onClick={() => handleButtonClick("How do I sign up as a tutor?", "main")} className="w-full bg-gray-100 p-2 rounded">How do I sign up as a tutor?</button>
                <button onClick={() => handleButtonClick("How do I get students?", "main")} className="w-full bg-gray-100 p-2 rounded">How do I get students?</button>
                <button onClick={() => handleButtonClick("How does the payment system work?", "main")} className="w-full bg-gray-100 p-2 rounded">How does the payment system work?</button>
              </>
            )}

            {/* Student Related Questions */}
            {chatState === "student" && (
              <>
                <button onClick={() => handleButtonClick("How do I request a class?", "main")} className="w-full bg-gray-100 p-2 rounded">How do I request a class?</button>
                <button onClick={() => handleButtonClick("What happens after I request a tutor?", "main")} className="w-full bg-gray-100 p-2 rounded">What happens after I request a tutor?</button>
                <button onClick={() => handleButtonClick("How do I make payments?", "main")} className="w-full bg-gray-100 p-2 rounded">How do I make payments?</button>
              </>
            )}

            {/* Contact TutorsForum Form */}
            {chatState === "contact" && (
              <form onSubmit={handleFormSubmit} className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 border rounded"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-2 border rounded"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Your message"
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
                <button type="submit" className="w-full bg-peach-200 text-white p-2 rounded">Submit</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
