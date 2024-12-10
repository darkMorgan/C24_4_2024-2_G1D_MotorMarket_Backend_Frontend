import React, { useState } from 'react';
import axios from 'axios';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.includes('@gmail.com')) {
      setError('El correo electrónico debe ser un @gmail.com');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const user = { username, email, password };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/usuarios', user);

      setSuccessMessage('Usuario registrado exitosamente');
      setUsername('');
      setEmail('');
      setPassword('');
      window.location.href = "/login";
    } catch (err) {
      setError('Error al registrar el usuario');
      console.log(err.response?.data || err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Registrarse</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
            />
            <div className="input-hint">Debe ser un correo de tipo @gmail.com</div>
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
            <div className="input-hint">La contraseña debe tener al menos 6 caracteres</div>
          </div>
          <button type="submit" className="submit-btn">Registrar</button>
        </form>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;
