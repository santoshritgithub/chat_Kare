(function () {
  // Load CSS
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "http://localhost:3000/widget/widget.css";
  document.head.appendChild(css);

  // Load socket.io
  const script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
  document.head.appendChild(script);

  script.onload = () => {
    const socket = io("http://localhost:3000");

    // UI
    const icon = document.createElement("div");
    icon.id = "chat-icon";
    icon.innerText = "💬";

    const box = document.createElement("div");
    box.id = "chat-box";
    box.innerHTML = `
      <div id="chat-header">Chat with Admin</div>
      <div id="messages"></div>
      <div id="input-box">
        <input id="msgInput" placeholder="Type message..." />
        <button id="sendBtn">Send</button>
      </div>
    `;

    document.body.appendChild(icon);
    document.body.appendChild(box);

    icon.onclick = () => {
      box.style.display = box.style.display === "flex" ? "none" : "flex";
    };

    document.getElementById("sendBtn").onclick = () => {
      const input = document.getElementById("msgInput");
      if (input.value.trim() === "") return;

      socket.emit("user-message", input.value);
      addMessage("You", input.value);
      input.value = "";
    };

    socket.on("receive-admin-message", (msg) => {
      addMessage("Admin", msg);
    });

    function addMessage(sender, msg) {
      const div = document.createElement("div");
      div.innerHTML = `<b>${sender}:</b> ${msg}`;
      document.getElementById("messages").appendChild(div);
    }
  };
})();
