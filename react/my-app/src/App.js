
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./pages/App.css";
import React, { createContext, useContext,useEffect, useState } from "react";
import { onAuthStateChanged, signOut, signInWithEmailAndPassword,} from "firebase/auth";
import { fireAuth } from "./firebase.ts";
import SignUp from './SignUp';
import axios from "axios";


BEAPI=https://hackathon-be-980031394301.us-central1.run.app



function Home() {
  const [content, setContent] = useState([]); // データを保存するステート
  const [loading, setLoading] = useState(false); // ローディング状態
  const [error, setError] = useState(null); // エラー状態
  const [activeFormId, setActiveFormId] = useState(null); // 現在表示中のフォームのID
  const [formContent, setFormContent] = useState(''); // フォームの入力内容

  const fetchContent = () => {
    setLoading(true);
    setError(null);

    fetch('${BEAPI}/post') // バックエンドAPIのURLに変更してください
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setContent(data); // データをステートに保存
        setLoading(false); // ローディング完了
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error); // エラーを保存
        setLoading(false);
      });
  };

  const sendIdToBackend = (id) => {
    fetch(`${BEAPI}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to send ID');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response from backend:', data);
        alert(`ID ${id} was sent successfully!`);
      })
      .catch((error) => {
        console.error('Error sending ID:', error);
        alert(`Failed to send ID ${id}: ${error.message}`);
      });
  };

  const handleFormSubmit = (id) => {
    if (!formContent) {
      alert('Please enter content');
      return;
    }

    fetch(`${BEAPI}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, content: formContent }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Response from backend:', data);
        alert(`Content submitted successfully for ID ${id}!`);
        setFormContent(''); // フォームをリセット
        setActiveFormId(null); // フォームを閉じる
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
        alert(`Failed to submit content: ${error.message}`);
      });
  };

  return (
    <div>
      <h1>Content List</h1>
      <button onClick={fetchContent}>Load Content</button>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <ul>
        {content.map((item) => (
          <li key={item.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
            <h2>{item.content}</h2>
            <p>Likes: {item.like_count}</p>
            <p>Replies: {(item.replies ?? []).length}</p>
            <button onClick={() => sendIdToBackend(item.id)}>Like</button>
            <button
              onClick={() =>
                setActiveFormId(activeFormId === item.id ? null : item.id)
              }
            >
              Add Comment
            </button>
            {/* フォームを該当アイテムの下に表示 */}
            {activeFormId === item.id && (
              <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd' }}>
                <textarea
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Enter your comment here"
                  style={{ width: '100%', height: '80px' }}
                />
                <button onClick={() => handleFormSubmit(item.id)}>Submit</button>
              </div>
            )}

            {/* Replies を表示 */}
            {item.replies && item.replies.length > 0 && (
              <ul style={{ marginTop: '10px', paddingLeft: '20px', borderLeft: '2px solid #ddd' }}>
                {item.replies.map((reply) => (
                  <li key={reply.id} style={{ marginBottom: '10px' }}>
                    <p>{reply.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
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

function Loginac() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // ユーザー情報を保存

  // ユーザー認証状態の監視

  const fetchUserData = async (mail) => {
    if (!mail) {
      console.error("mail parameter is required.");
      return;
    }
  
    const endpoint = `${BEAPI}/get-mail?mail=${encodeURIComponent(mail)}`;
  
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      if (!response.ok) {
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }
  
      const data = await response.json();
      console.log("mail:", mail);
      console.log("User Data:", data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };
  


  // ログイン処理
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(fireAuth, mail, password);
      setMail("");
      setPassword("");

    } catch (error) {
      console.error("ログインエラー:", error.message);
      alert(error.message);
    }
  };  

  function handleButtonClick() {
    handleLogin();
    fetchUserData(mail);
  }

 

  return (
    <div className="body">
      <h1>ログイン</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleButtonClick}>ログイン</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {username && <p>ようこそ、{username}さん！</p>}
      <div>
        <Link to="/create">新しいアカウントを作成</Link>
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

  const API_URL ="${BEAPI}/post";
  
  const GEMINI_API_URL ="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?";

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
        
          <button type="submit" style={{ padding: "10px 20px", cursor: "pointer" }}>
            Post
          </button>
        </div>
      </form>
      
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

          {user ? (
            <>

              <li>
                <button  onClick={handleLogout}>
                  Logout
                </button>
              </li>
              <li>
              <Link to="/post" className="sidetext">Post</Link>
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


