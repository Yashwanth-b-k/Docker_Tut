import React, { useEffect, useState } from "react"; // imports

export default function App() {
  const [todos, setTodos] = useState([]); // list of todos
  const [text, setText] = useState(""); // input text

  // load todos once on mount
  useEffect(() => {
    fetch("/api/todos") // call backend via relative path (nginx proxy in production)
      .then((res) => res.json()) // parse JSON
      .then((data) => setTodos(data)) // set state
      .catch((err) => console.error(err)); // simple error log
  }, []); // empty deps -> run once

  // add a new todo
  async function addTodo(e) {
    e.preventDefault(); // prevent form submit reload
    if (!text) return; // skip empty
    const res = await fetch("/api/todos", {
      // POST /api/todos
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    const newTodo = await res.json(); // get created todo
    setTodos([newTodo, ...todos]); // add to state
    setText(""); // clear input
  }

  // delete by id
  async function deleteTodo(id) {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t._id !== id)); // optimistic UI update
  }

  // render UI
  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>MERN + Docker Demo</h1>

      <form onSubmit={addTodo}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New todo"
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Add
        </button>
      </form>

      <ul style={{ marginTop: 20 }}>
        {todos.map((t) => (
          <li key={t._id} style={{ marginBottom: 8 }}>
            {t.text}
            <button onClick={() => deleteTodo(t._id)} style={{ marginLeft: 8 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
