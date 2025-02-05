import React, { useState } from "react";

function Chats() {
  const messages = [
    {
      id: 1,
      sender: "Nitish Kumar",
      content: "Hello! How can I help you today?",
      timestamp: "10:00 AM",
      isSentByMe: false,
    },
    {
      id: 2,
      sender: "You",
      content: "Hi! I have a question about the next class.",
      timestamp: "10:01 AM",
      isSentByMe: true,
    },
  ];
  const [newMessage, setNewMessage] = useState("");
  const [toggle, setToggle] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          sender: "You",
          content: newMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isSentByMe: true,
        },
      ]);
      setNewMessage("");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="flex flex-col gap-4">
          {/* Contacts Sidebar */}
          <div
            className={` ${
              toggle ? "min-w-[320px]" : "w-[50px]"
            } absolute left-0 bg-slate-200 rounded-r-2xl min-h-[85vh]  z-50`}
          >
            <div className={`${toggle ? "p-4" : "p-2"}`}>
              <div className="flex items-center justify-center gap-2">
                {toggle && (
                  <input
                    placeholder="Search conversations..."
                    className="w-full my-2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                )}
                {toggle ? (
                  <div className="flex" >
                    <button
                      onClick={handleSendMessage}
                      className="bg-gray-400 py-1.5 px-4 rounded-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="white"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={()=> setToggle(!toggle)}
                      className=" py-1.5 px-1 rounded-2xl"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setToggle(!toggle)}
                    className=" py-1.5 px-1 rounded-2xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                )}
              </div>
              {/* chats */}
              <div className="space-y-4 mt-4">
                {["John Doe", "Sarah Smith", "Mike Johnson"].map(
                  (contact, index) => (
                    <div
                      key={index}
                      className={`${toggle ? "p-2 space-x-4" : "p-0 "} flex items-center   rounded-lg hover:bg-gray-100 cursor-pointer`}
                    >
                      <div>
                        <img
                          className="rounded-full h-8 w-8"
                          src={`https://i.pravatar.cc/150?img=${index + 1}`}
                        />
                      </div>
                      {toggle && (
                        <div>
                          <p className="font-medium">{contact}</p>
                          <p className="text-sm text-gray-500">Online</p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Chat Window */}
          <div className="w-full pl-[35px]">
            <div className="p-4 h-[calc(100vh-12rem)]">
              <div className="grid grid-cols-1 md:mx-16  justify-center items-center h-full">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isSentByMe ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isSentByMe
                            ? "bg-peach-100 text-gray-800"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-sm font-medium mb-1">
                          {message.sender}
                        </p>
                        <p>{message.content}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message input */}
                <div className="flex absolute bottom-10 md:w-3/5 justify-center items-center justify-self-center space-x-2">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full mt-1 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-gray-400 py-1.5 px-4 rounded-2xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
