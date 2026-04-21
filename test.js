fetch("http://localhost:3000/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Hola", history: [] })
})
.then(res => res.json())
.then(data => console.log("Response:", data))
.catch(err => console.error("Error:", err));
