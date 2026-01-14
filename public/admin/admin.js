const socket = io("http://localhost:3000");

socket.on("receive-user-message", (msg) => {
  addMessage("User", msg);
  scrollToBottom();
});

function send() {
  const input = document.getElementById("adminInput");
  if (input.value.trim() === "") return;

  socket.emit("admin-message", input.value);
  addMessage("Admin", input.value);
  input.value = "";
  scrollToBottom();
}

function addMessage(sender, msg) {
  const div = document.createElement("div");
  div.innerHTML = `<b>${sender}:</b> ${msg}`;
  document.getElementById("messages").appendChild(div);
}

function scrollToBottom() {
  const messagesDiv = document.getElementById("messages");
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Send message on Enter key
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("adminInput");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        send();
      }
    });
  }
});
