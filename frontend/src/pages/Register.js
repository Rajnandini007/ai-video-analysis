
import React, { useState } from 'react';

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(\`\${process.env.REACT_APP_API_BASE}/register\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Registration successful! Now login.");
    } else {
      alert("Error registering.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
      <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
