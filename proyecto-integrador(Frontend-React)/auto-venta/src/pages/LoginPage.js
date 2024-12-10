import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const LoginContainer = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image: url('/images/fondo_login.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const LoginContent = styled.div`
  position: relative;
  z-index: 1;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const LoginTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 25px;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 1.1rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 15px;
  box-sizing: border-box;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  font-size: 1.2rem;
  border-radius: 8px;
  background-color: #007bff;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.p`
  font-size: 1rem;
  color: red;
  margin-top: 15px;
`;

const RegisterMessage = styled.p`
  font-size: 1.1rem;
  color: #333;
  margin-top: 20px;
`;

const RegisterButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #218838;
  }
`;

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Usamos useNavigate para redirigir

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Enviando datos al servidor: ", { username, password }); // Verifica los valores antes de enviarlos
  
    try {
      const response = await axios.post('http://localhost:8080/api/v1/login', {
        username,
        password
      });
  
      if (response.data && response.data.token) {
        const token = response.data.token;
        const userId = response.data.userId;
  
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
  
        window.location.href = "/autos"; // Redirige al dashboard
      } else {
        setError('Error en la autenticación, intente nuevamente.');
      }
    } catch (err) {
      console.log(err); // Verifica el error completo
      setError('Credenciales incorrectas');
    }
  };

  // Función de redirección a la página de registro
  const handleRedirectToRegister = () => {
    navigate('/register'); // Redirige a /register
  };

  return (
    <LoginContainer>
      <LoginContent>
        <LoginTitle>Iniciar Sesión</LoginTitle>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>Nombre de usuario</label>
            <FormInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px' }}>Contraseña</label>
            <FormInput
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <SubmitButton type="submit">Iniciar Sesión</SubmitButton>
        </form>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {/* Mensaje de registro */}
        <RegisterMessage>
          ¿No tienes cuenta? 
        </RegisterMessage>
        <RegisterButton onClick={handleRedirectToRegister}>
          Regístrate ahora
        </RegisterButton>
      </LoginContent>
    </LoginContainer>
  );
}

export default LoginPage;
