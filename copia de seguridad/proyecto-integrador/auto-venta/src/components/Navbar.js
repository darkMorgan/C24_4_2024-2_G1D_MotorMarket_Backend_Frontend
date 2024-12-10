import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Usamos useNavigate para redirigir
import './Navbar.css';  // Importamos el CSS

const Navbar = () => {
  const username = localStorage.getItem('username'); // Verifica si el usuario está logueado
  const navigate = useNavigate(); // Hook para navegar programáticamente

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    window.location.href = '/login'; // Redirige a la página de login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">MotorMarket</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Inicio</Link>
            </li>
            {/* Mostrar "Autos Disponibles" y "Vender Auto" solo si el usuario está logueado */}
            {username && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/autos">Autos Nuevos </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/autos_usados">Autos Usados </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/publicar-anuncio">Vender Auto</Link> {/* Enlace para Vender Auto */}
                </li>
                <li className="nav-item">
                <Link className="nav-link" to="/autos_publicados">
                  Autos Publicados
                </Link>
              </li>
              </>
            )}
            {!username ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Iniciar Sesión</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Regístrate</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <span className="navbar-text">Hola, {username}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
