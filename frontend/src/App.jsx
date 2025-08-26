import React, { useState } from "react";
import Home from "./components/Home";
import AddPost from "./components/AddPost";
import Post from "./components/Post";
import ManageTags from "./components/ManageTags";
import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import axios from "axios";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [message, setMessage] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function login(username, password) {
    try {
      const res = await axios.post("/api/auth/login", {
        username,
        password,
      });
      const data = res.data;
      if (res.status === 200 && data.token) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("");
      } else {
        setMessage(data.message || "Logowanie nie powiodło się!");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Błąd połączenia z API");
    }
  }

  async function register(username, password) {
    try {
      const res = await axios.post("/api/auth/register", {
        username,
        password,
      });
      const data = res.data;
      if (res.status === 201 && data.message === "User created") {
        setMessage("Rejestracja udana! Możesz się teraz zalogować.");
        setUsername("");
        setPassword("");
        setShowRegister(false);
      } else {
        setMessage(data.message || "Rejestracja nie powiodła się!");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Błąd połączenia z API");
    }
  }

  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h2 className="text-3xl font-bold">{showRegister ? "Rejestracja" : "Logowanie"}</h2>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 text-black border-2 border-transparent outline-none hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 text-black border-2 border-transparent outline-none hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
        />
        {showRegister ? (
          <>
            <button
              onClick={() => register(username, password)}
              className="px-4 py-2 text-white bg-blue-800 rounded-lg"
            >
              Zarejestruj
            </button>
            <button
              onClick={() => {
                setShowRegister(false);
                setMessage("");
              }}
              className="text-amber-400"
            >
              Masz już konto? Zaloguj się
            </button>
          </>
        ) : (
          <>
            <button onClick={() => login(username, password)} className="px-4 py-2 text-white bg-blue-800 rounded-lg">
              Zaloguj
            </button>
            <button
              onClick={() => {
                setShowRegister(true);
                setMessage("");
              }}
              className="text-amber-400"
            >
              Nie masz konta? Zarejestruj się
            </button>
          </>
        )}
        {message && (
          <div
            className={
              message.toLowerCase().includes("błąd") || message.toLowerCase().includes("nie powiodło")
                ? "text-red-400"
                : "text-green-500"
            }
          >
            {message}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Router>
        <header>
          <nav className="relative flex items-center justify-between py-8 text-xl border-b border-amber-500 text-amber-50 ">
            <Link to="/">
              <img src="/awsLogo.svg" alt="AWS Logo" className="w-20 h-auto" />
            </Link>
            <div className="flex gap-10">
              <Link to="/add-post" className="hover:text-amber-400">
                Dodaj Post
              </Link>
              <Link to="/manage-tags" className="hover:text-amber-400">
                Zarządzaj Tagami
              </Link>
            </div>
            <button onClick={logout} className="px-4 py-1 text-lg bg-blue-800 rounded-lg">
              Wyloguj się
            </button>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/post/:id" element={<Post user={user} />} />
          <Route path="/manage-tags" element={<ManageTags />} />
        </Routes>
      </Router>
      <footer className="flex items-center justify-between py-4">
        <p className="">
          Stworzone przez{" "}
          <span className="inline-block text-xl text-transparent bg-gradient-to-r from-amber-500 to-blue-700 bg-clip-text">
            w64191 do pracy magisterskiej - Blog AWS
          </span>{" "}
        </p>
        <div
          style={{
            border: "4px solid",
            borderImage: "linear-gradient(to right, #FF9900, #146EB4) 1",
          }}
        >
          <img src="/poweredByAws.png" alt="Powered by AWS" className="w-40 px-4 py-2.5 bg-white" />
        </div>
      </footer>
    </>
  );
}

export default App;
