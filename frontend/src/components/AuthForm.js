import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AuthForm({ type }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const url = `http://localhost:3000/${type}`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const text = await res.text();
      alert(text);
      if (res.ok) navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{type === 'login' ? 'Login' : 'Register'}</h2>
      <input name="username" value={form.username} onChange={handleChange} placeholder="Username" required />
      <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
      <button type="submit">{type}</button>
    </form>
  );
}

export default AuthForm;
