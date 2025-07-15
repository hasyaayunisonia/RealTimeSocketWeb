import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

type MessageData = {
  username: string;
  text: string;
  timestamp: string;
};

function App() {
  const [username, setUsername] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    socket.on("chat-history", (history) => {
      console.log("Chat history received:", history);
      setMessages(history);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("chat-history");
      socket.off("receive-message");
    };
  }, []);

  const handleSetUsername = () => {
    if (inputName.trim() !== "") {
      setUsername(inputName);
      socket.emit("set-username", inputName);
      setInputName("");
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      socket.emit("send-message", inputMessage);
      setInputMessage("");
    }
  };

  if (!username) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Masukkan Nama Pengguna</h1>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Nama Pengguna"
        />
        <button onClick={handleSetUsername}>Masuk</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Real-Time Chat - Selamat datang, {username}</h1>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Ketik pesan..."
      />
      <button onClick={handleSendMessage}>Kirim</button>

      {messages.map((msg, idx) => (
        <div
          style={{
            marginTop: "1rem",
            border: "1px solid #ccc",
            padding: "1rem",
            maxHeight: "300px",
            overflowY: "auto",
          }}
          key={idx}
        >
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            {" "}
            <strong>{msg.username}</strong>
            <span>
              {new Date(msg.timestamp).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <p>{msg.text}</p>
          <hr />
          <p style={{ fontSize: "0.8rem", color: "#888" }}>
            {new Date(msg.timestamp).toLocaleString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
