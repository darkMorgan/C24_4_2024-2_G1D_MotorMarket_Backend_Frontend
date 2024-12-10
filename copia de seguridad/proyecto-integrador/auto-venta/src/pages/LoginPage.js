import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Login.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Usamos un ref para controlar el iframe del video
  const videoRef = useRef(null);

  // Reproducir el video cuando el componente se monta
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src += '&autoplay=1'; // Asegura que el video empiece a reproducirse
    }

    return () => {
      // Pausar el video cuando salimos de la página
      if (videoRef.current) {
        videoRef.current.src = videoRef.current.src.replace('&autoplay=1', ''); // Quitar autoplay
      }
    };
  }, []); // Se ejecuta solo una vez cuando el componente se monta

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Enviar datos al backend para autenticación
      const response = await axios.post('http://localhost:8080/api/v1/login', {
        username,
        password
      });
  
      // Verificar si la respuesta contiene el token y el refresh token
      if (response.data && response.data.token) {
        const token = response.data.token;
        const userId = response.data.userId;  // Asegúrate de que el backend esté enviando esto
  
        // Guardar el token y el userId en localStorage
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userId', userId);  // Guardar el userId también
        localStorage.setItem('username', username); // Guardar el nombre del usuario
  
        console.log('Usuario autenticado, token:', token);
  
        // Redirigir a la página de autos
        window.location.href = "/autos";
      } else {
        setError('Error en la autenticación, intente nuevamente.');
      }
    } catch (err) {
      console.error('Error al autenticar al usuario:', err.response ? err.response.data : err);
      setError('Credenciales incorrectas');
    }
  };

  

  return (
    <div className="login-container">
      {/* Video de fondo de YouTube */}
      <iframe
        ref={videoRef}
        className="background-video"
        width="100%"
        height="100%"
        src="https://www.youtube.com/embed/D9G1VOjN_84?list=RDD9G1VOjN_84&start=33&autoplay=1"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Background Video"
      ></iframe>

      <div className="login-content">
        <h2 className="login-title">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mb-3">
            <label className="form-label">Nombre de usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
