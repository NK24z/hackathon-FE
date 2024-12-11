
import { fireAuth } from './firebase.ts';
import { useEffect,useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/user");
      if (!response.ok) throw new Error(`Failed to fetch users: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(fireAuth, email, password);

      const result = await fetch("http://localhost:8000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!result.ok) {
        const errorText = await result.text();
        throw new Error(`Failed to create user: ${result.status}. ${errorText}`);
      }

      setEmail('');
      setPassword('');
      setName('');
      fetchUsers();
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "An unexpected error occurred.");
    }
  };

  const handleChange = (setter) => (event) => setter(event.currentTarget.value);

  return (
    <div>
      <h1>ユーザ登録</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>ユーザー名</label>
          <input name="name" type="text" placeholder="name" onChange={handleChange(setName)} />
        </div>
        <div>
          <label>メールアドレス</label>
          <input name="email" type="email" placeholder="email" onChange={handleChange(setEmail)} />
        </div>
        <div>
          <label>パスワード</label>
          <input name="password" type="password" placeholder="password" onChange={handleChange(setPassword)} />
        </div>
        <div>
          <button type="submit">登録</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;