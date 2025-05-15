
import { useState, useRef, useEffect } from "react";
import { Send, ArrowLeft, MoreVertical, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const mockMessages = [
  {
    id: 1,
    text: "Welcome to the Emergency Chat. This is a safe space to communicate during emergencies.",
    sender: "system",
    timestamp: "10:00 AM",
  },
  {
    id: 2,
    text: "Is anyone in the downtown area? I'm hearing reports of flooding on Main Street.",
    sender: "Sarah",
    timestamp: "10:05 AM",
  },
  {
    id: 3,
    text: "Yes, I'm near there. The water is rising quickly. Police are redirecting traffic now.",
    sender: "Michael",
    timestamp: "10:07 AM",
  },
  {
    id: 4,
    text: "City emergency services have announced evacuation for zones A and B. Please check your zone on the map.",
    sender: "system",
    timestamp: "10:10 AM",
  },
  {
    id: 5,
    text: "I'm in zone B. Has anyone been to the shelter at Central High School? Is it open yet?",
    sender: "Sarah",
    timestamp: "10:12 AM",
  },
];

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const participants = [
    { name: "Sarah", status: "online" },
    { name: "Michael", status: "online" },
    { name: "Emergency Services", status: "online" },
    { name: "John", status: "offline" },
    { name: "Lisa", status: "offline" },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      text: newMessage,
      sender: "You",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2 px-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold">Community Emergency Chat</h1>
            <p className="text-xs text-muted-foreground">{participants.filter(p => p.status === "online").length} participants online</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-1"
            onClick={() => setShowParticipants(!showParticipants)}
          >
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-1">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 flex">
          <div className={`flex-1 overflow-y-auto p-4 hide-scrollbar ${showParticipants ? 'w-2/3' : 'w-full'} transition-all duration-300`} ref={chatContainerRef}>
            <div className="space-y-4 pb-20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "You" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "You"
                        ? "bg-primary text-white"
                        : message.sender === "system"
                        ? "bg-muted"
                        : "bg-secondary"
                    }`}
                  >
                    {message.sender !== "You" && message.sender !== "system" && (
                      <p className="text-xs font-medium mb-1">
                        {message.sender}
                      </p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70 text-right">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {showParticipants && (
            <div className="w-1/3 border-l border-border bg-background overflow-y-auto animate-slide-in-right">
              <div className="p-4 flex items-center justify-between border-b border-border">
                <h3 className="font-medium">Participants</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="p-1" 
                  onClick={() => setShowParticipants(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-2">
                {participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                    <span>{participant.name}</span>
                    <span className={`w-2 h-2 rounded-full ${participant.status === 'online' ? 'bg-crisis-green' : 'bg-crisis-gray'}`}></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t border-border">
        <div className="flex">
          <textarea
            className="flex-1 p-3 rounded-l-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 transition duration-200 resize-none"
            placeholder="Type a message..."
            rows={1}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button 
            className="rounded-l-none" 
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
