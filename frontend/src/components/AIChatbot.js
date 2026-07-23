import { useState, useRef, useEffect } from "react";
import "./AIChatbot.css";

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMsg, setInputMsg] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I am your AI Placement & Career Mentor. Ask me about MNC job requirements, study roadmaps for tech roles, interview preparation, or ATS resume tips!",
      isGreeting: true,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // AI Response Generator Engine
  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes("full stack") || q.includes("web") || q.includes("react") || q.includes("frontend")) {
      return `💻 **Study Roadmap for Full Stack Web Roles:**\n\n1. **Frontend**: Master HTML5, CSS3, JavaScript (ES6+), React.js, and State Management.\n2. **Backend**: Learn Node.js, Express.js, and RESTful API Design.\n3. **Database**: Learn PostgreSQL / MySQL queries, indexing, and ORMs.\n4. **Tools**: Git, GitHub, Postman, and Docker basics.\n5. **DSA**: Practice Arrays, String Manipulation, Trees, and Dynamic Programming on LeetCode!`;
    }

    if (q.includes("java") || q.includes("backend") || q.includes("spring")) {
      return `☕ **Study Roadmap for Java Backend Engineering:**\n\n1. **Core Java**: OOPs concepts, Collections framework, Multithreading, Streams API.\n2. **Frameworks**: Spring Boot, Spring Security, Hibernate ORM.\n3. **Databases**: Relational DBs (PostgreSQL/SQL), Indexing, and JDBC.\n4. **System Design**: REST APIs, Microservices Architecture, Message Queues (Kafka/RabbitMQ).\n5. **Preparation**: Practice System Design patterns and LeetCode Medium Java DSA questions.`;
    }

    if (q.includes("python") || q.includes("data") || q.includes("ai") || q.includes("ml") || q.includes("machine learning")) {
      return `🤖 **Study Roadmap for Data Science & AI Engineering:**\n\n1. **Programming**: Python (Advanced), NumPy, Pandas, Scipy.\n2. **Machine Learning**: Scikit-Learn, Regression, Classification, Clustering, Neural Networks.\n3. **SQL & Data**: Advanced SQL queries, Window Functions, PostgreSQL.\n4. **Deep Learning**: TensorFlow or PyTorch basics.\n5. **Projects**: Build predictive models and upload Jupyter notebooks to GitHub.`;
    }

    if (q.includes("google") || q.includes("nvidia") || q.includes("microsoft") || q.includes("amazon") || q.includes("meta") || q.includes("apple") || q.includes("mnc") || q.includes("company")) {
      return `🏢 **Top MNC Drives Currently Open on Portal:**\n\n• **NVIDIA**: AI & Accelerated GPU Engineer (💰 40.00 LPA · Min 8.5 CGPA)\n• **Netflix**: Backend Microservices Architect (💰 38.00 LPA · Min 8.0 CGPA)\n• **Meta**: Frontend & Performance React Engineer (💰 35.00 LPA · Min 8.0 CGPA)\n• **Google**: Senior Software Engineer - Cloud (💰 32.50 LPA · Min 8.0 CGPA)\n• **Apple**: iOS & Systems Engineer (💰 30.00 LPA · Min 8.0 CGPA)\n• **Microsoft**: Full Stack SDE (💰 28.00 LPA · Min 7.5 CGPA)\n• **Amazon**: SDE II AWS Infrastructure (💰 26.50 LPA · Min 7.5 CGPA)\n\n📌 Click on any job card on your dashboard to apply!`;
    }

    if (q.includes("ats") || q.includes("resume") || q.includes("score")) {
      return `📄 **How to Score 90%+ on the AI ATS Resume Scorer:**\n\n1. **Upload Format**: Save your resume as a clean PDF under 2 MB.\n2. **Filename**: Rename to 'FirstName_LastName_Resume.pdf'.\n3. **Keywords**: Include mandatory tech keywords (React, Node, SQL, Git, REST APIs, DSA) matching your target job role.\n4. **Action Metrics**: Write bullet points using action verbs with metrics (e.g., *'Optimized PostgreSQL queries, reducing latency by 40%'*).\n5. **CGPA**: Keep your CGPA updated in your student profile to pass academic cutoffs!`;
    }

    if (q.includes("status") || q.includes("application") || q.includes("track")) {
      return `📋 **Tracking Your Applications:**\n\n1. Click the **'📋 My Applications'** button in the top right navbar.\n2. View your real-time recruitment round progress timeline (Passed, Scheduled, Pending).\n3. Join interview video calls directly using the 1-Click **'🎥 Join Meeting'** button when scheduled by recruiters!`;
    }

    return `💡 **Career Mentor Advice:**\n\nI can help you with:\n1. **Study Roadmaps** for Web, Java, or Data Science roles.\n2. **MNC Drive Requirements & CTC Info** (Google, Microsoft, Amazon, NVIDIA).\n3. **Resume ATS Optimization & Scoring** tips.\n4. **Interview Round Preparation** guidance.\n\nTry asking: *"What to study for Full Stack jobs?"* or *"What are Google job requirements?"*`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg.trim();
    setInputMsg("");

    // Append User Message
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setIsTyping(true);

    // Simulate AI Response Delay
    setTimeout(() => {
      const aiReply = generateAIResponse(userText);
      setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
      setIsTyping(false);
    }, 600);
  };

  const handleChipClick = (suggestionText) => {
    setInputMsg(suggestionText);
    setMessages((prev) => [...prev, { sender: "user", text: suggestionText }]);
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = generateAIResponse(suggestionText);
      setMessages((prev) => [...prev, { sender: "bot", text: aiReply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Trigger Icon */}
      <button
        className="ai-bot-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Close AI Assistant" : "Ask AI Placement Mentor"}
      >

        {isOpen ? "✕" : "🤖"}
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="ai-chat-window-container">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-header-info">
              <div className="ai-avatar-circle">🤖</div>
              <div className="ai-title-meta">
                <h4>Placement AI Mentor</h4>
                <p>🟢 Online · Career & ATS Guide</p>
              </div>
            </div>
            <button className="ai-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="ai-chat-body">
            {messages.map((msg, index) => (
              <div key={index} className={`chat-msg-row ${msg.sender}`}>
                {msg.sender === "bot" && (
                  <div className="bot-avatar-small">🤖</div>
                )}

                <div className="chat-msg-bubble">
                  <div style={{ whiteSpace: "pre-line" }}>{msg.text}</div>

                  {/* Initial Suggestion Chips */}
                  {msg.isGreeting && (
                    <div className="suggestion-chips-wrapper">
                      <button
                        className="suggestion-chip-btn"
                        onClick={() => handleChipClick("What to study for Full Stack Web roles?")}
                      >
                        💻 What to study for Full Stack jobs?
                      </button>
                      <button
                        className="suggestion-chip-btn"
                        onClick={() => handleChipClick("What are top MNC job drives and packages?")}
                      >
                        🏢 Show top MNC drives (Google, NVIDIA, etc.)
                      </button>
                      <button
                        className="suggestion-chip-btn"
                        onClick={() => handleChipClick("How to score 90+ on AI ATS Resume Scorer?")}
                      >
                        📄 How to boost my Resume ATS score?
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-msg-row bot">
                <div className="bot-avatar-small">🤖</div>
                <div className="chat-msg-bubble" style={{ color: "#94a3b8", fontStyle: "italic" }}>
                  AI Mentor is typing response...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Form */}
          <div className="ai-chat-footer">
            <form className="ai-chat-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                className="ai-chat-input"
                placeholder="Ask about jobs, study topics, or resume tips..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button
                type="submit"
                className="ai-chat-send-btn"
                disabled={!inputMsg.trim() || isTyping}
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
