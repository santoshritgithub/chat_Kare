(function () {
  // Load CSS
  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = "/widget/widget.css";
  document.head.appendChild(css);

  // Load socket.io
  const script = document.createElement("script");
  script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
  document.head.appendChild(script);

  script.onload = () => {
    const socket = io();

    // Track unread messages
    let unreadCount = 0;
    let isChatOpen = false;

    // UI - Chat Icon with Notification Badge
    const icon = document.createElement("div");
    icon.id = "chat-icon";
    icon.innerHTML = `
      <span id="chat-icon-emoji">💬</span>
      <span id="notification-badge" class="notification-badge hidden">0</span>
    `;

    // UI - Chat Box (hidden by default)
    const box = document.createElement("div");
    box.id = "chat-box";
    box.style.display = "none"; // Hidden by default
    box.innerHTML = `
      <div id="chat-header">
        <span>Chat with Admin</span>
        <span id="close-chat">×</span>
      </div>
      <div id="messages"></div>
      <div id="input-box">
        <input id="msgInput" placeholder="Type message..." />
        <button id="sendBtn">Send</button>
      </div>
    `;

    document.body.appendChild(icon);
    document.body.appendChild(box);

    // Toggle chat window
    const toggleChat = () => {
      isChatOpen = !isChatOpen;
      box.style.display = isChatOpen ? "flex" : "none";
      
      // Reset notification badge when opening chat
      if (isChatOpen) {
        unreadCount = 0;
        updateNotificationBadge();
        // Auto-scroll to bottom when opening
        scrollToBottom();
      }
    };

    // Close chat handler
    icon.onclick = toggleChat;
    document.getElementById("close-chat").onclick = (e) => {
      e.stopPropagation();
      isChatOpen = false;
      box.style.display = "none";
    };

    // Update notification badge
    const updateNotificationBadge = () => {
      const badge = document.getElementById("notification-badge");
      if (unreadCount > 0 && !isChatOpen) {
        badge.textContent = unreadCount > 99 ? "99+" : unreadCount.toString();
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    };

    // Scroll messages to bottom
    const scrollToBottom = () => {
      const messagesDiv = document.getElementById("messages");
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };

    // Send message handler
    const sendMessage = () => {
      const input = document.getElementById("msgInput");
      if (input.value.trim() === "") return;

      socket.emit("user-message", input.value);
      addMessage("You", input.value, "user-message");
      input.value = "";
      scrollToBottom();
    };

    document.getElementById("sendBtn").onclick = sendMessage;

    // Send message on Enter key
    document.getElementById("msgInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });

    // Receive admin messages
    socket.on("receive-admin-message", (msg) => {
      addMessage("Admin", msg, "admin-message");
      scrollToBottom();
      
      // Increment unread count if chat is closed
      if (!isChatOpen) {
        unreadCount++;
        updateNotificationBadge();
      }
    });

    // Add message to chat
    function addMessage(sender, msg, messageClass) {
      const messagesDiv = document.getElementById("messages");
      const div = document.createElement("div");
      div.className = `message ${messageClass}`;
      div.innerHTML = `<b>${sender}:</b> ${msg}`;
      messagesDiv.appendChild(div);
    }

    // Initialize: hide badge on load
    updateNotificationBadge();
  };
})();
