
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./pages/App.css";
import React, { createContext, useContext,useEffect, useState } from "react";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword,} from "firebase/auth";
import { fireAuth } from "./firebase.ts";
import SignUp from './SignUp';
import axios from "axios";



function Home() {
  return (
    <div class="container">
      
      <div class="body">
        <h1 class="maintext">Home</h1>
        
      </div>
    </div>
  );
}

function Search() {
  return (
    <div class="body">
      <h1>Search</h1>
    </div>
  );
}

function Contact() {
  return (
    <div class="body">
      <h1>Contact Page</h1>
    </div>
  );
}

function Loginac(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(fireAuth, email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div class="body">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      <div>
        <Link to="/create">Create new account</Link>
      </div>
    </div>
  );
}

function Createaccount(){
  return (
    <div class="body">
      <h1>create account</h1>
      <div>
        <SignUp />
      </div>
    </div>
  );
}



function Post() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const API_URL = "http://localhost:8000/post";
  const APIkey = "AIzaSyAzo1oXczLtTDr7EIYGdU1XKt05mhDUNYc";
  const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAzo1oXczLtTDr7EIYGdU1XKt05mhDUNYc";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL, {
          headers: { "Content-Type": "application/json" },
        });
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      alert("Content cannot be empty!");
      return;
    }

    await axios.post(API_URL, { content });
    setContent("");
    
  };

    

  const handleEdit = async () => {
    if (!content.trim()) {
      alert("Content cannot be empty!");
      return;
    }

    setIsEditing(true); // ローディング状態を表示

    try {
      const response = await axios.post(
        GEMINI_API_URL,
        { text: "${content}を添削して適切にしたものを出力してください" },
        {
          headers: {
            Authorization: `Bearer ${APIkey}`, // Gemini APIキーを設定
          },
        }
      );
      setContent(response.data.editedText); // 添削された文章をセット
    } catch (error) {
      console.error("Error with Gemini API:", error);
      alert("Failed to edit text. Please try again.");
    } finally {
      setIsEditing(false); // ローディング状態を解除
    }
  };



  
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>post</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
        />
        <div style={{ marginBottom: "10px" }}>
          <button
            type="button"
            onClick={handleEdit}
            disabled={isEditing}
            style={{
              padding: "10px 20px",
              cursor: isEditing ? "not-allowed" : "pointer",
              marginRight: "10px",
            }}
          >
            {isEditing ? "Editing..." : "Edit with Gemini"}
          </button>
          <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
            Post
          </button>
        </div>
      </form>
      <div>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>{post.content}</p>
            <div style={{ fontSize: "0.8em", color: "gray" }}>
              {new Date(post.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};




function App() {
  const [user, setUser]=useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(fireAuth, (currentUser)=>{
      setUser(currentUser);
      setLoading(false);
    });

    return ()=>unsubscribe();
  },[]);



  const handleLogout = async () => {
    try {
      await signOut(fireAuth);
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };


  



  return (
    <Router>
      <div className="container">
       
        <ul className="side">
          <li>
            <Link to="/search" className="sidetext">search</Link>
          </li>
          <li>
            <Link to="/" className="sidetext">Home</Link>
          </li>
          <li>
            <Link to="/post" className="sidetext">Post</Link>
          </li>
          {user ? (
            <>

              <li>
                <button  onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ):(
            <>
              <li>
                <Link to="login" className="sidetext">Login</Link>
              </li>
           
            </>
          )}
        </ul>

        
        <div className="body">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Loginac />} />
            <Route path="/create" element={<Createaccount />} />
            <Route path="/post" element={<Post />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
