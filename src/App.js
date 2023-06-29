import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const RegisterPage = ({ handleRegister, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister(email, password);
    setRedirectToLogin(true);
    // if (redirectToLogin) {
    //   return <Link to="/login" />;
    // }
  };

  

  return (
    <div>
      <h2>Register Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

const LoginPage = ({ handleLogin, isLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
    // if (isLoggedIn) {
    //   return <Link to="/" />;
    // }
  };

  

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

const HomePage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('https://reqres.in/api/users')
      .then(response => response.json())
      .then(data => setUsers(data.data))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Home Page</h2>
      {users.map(user => (
        <div key={user.id}>
          <img src={user.avatar} alt={user.first_name} />
          <h4>{user.first_name} {user.last_name}</h4>
          <Link to={`/user/${user.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

const UserDetailsPage = ({  }) => {
  const [user, setUser] = useState(null);
  const [editName, setEditName] = useState('');
  const { id } = useParams();

  useEffect(() => {
    fetchUser(id);
  }, [id]);

  const fetchUser = (userId) => {
    fetch(`https://reqres.in/api/users/${userId}`)
      .then(response => response.json())
      .then(data => setUser(data.data))
      .catch(error => console.error(error));
  };

  const handleEditUser = () => {
    fetch(`https://reqres.in/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editName }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle the response accordingly
      })
      .catch(error => console.error(error));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Details Page</h2>
      <img src={user.avatar} alt={user.first_name} />
      <h4>{user.first_name} {user.last_name}</h4>
      <p>Email: {user.email}</p>
      <input
        type="text"
        placeholder="Name"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
      />
      <button onClick={handleEditUser}>Edit</button>
    </div>
  );
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleRegister = (email, password) => {
    fetch('https://reqres.in/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        // Handle the response accordingly
      })
      .catch(error => console.error(error));
  };

  const handleLogin = (email, password) => {
    fetch('https://reqres.in/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setIsLoggedIn(true);
        // Handle the response accordingly
      })
      .catch(error => console.error(error));
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/register" element={<RegisterPage handleRegister={handleRegister} handleLogin={handleLogin} />} />
          <Route path="/login" element={<LoginPage handleLogin={handleLogin} isLoggedIn={isLoggedIn} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:id" element={<UserDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;