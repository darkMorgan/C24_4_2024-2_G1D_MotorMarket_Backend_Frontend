// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AutoList from './components/AutoList';
import AutoDetail from './components/AutoDetail';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Compra from "./pages/Compra";
import Navbar from './components/Navbar';
import CatalogoPage from './pages/CatalogoPage';
import PublicarAnuncioPage from './pages/PublicarAnuncioPage';
import AutoListUsado from './components/AutoListUsado';
import AutoDetailUsado from './components/AutoDetailUsado';
import AutosPublicadosPage from './pages/AutosPublicadosPage';
import Footer from './components/Footer';
import './App.css';  // Asegúrate de importar el archivo de estilos

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navbar siempre visible */}
        <Navbar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/autos" element={<AutoList />} />
            <Route path="/autos/:id" element={<AutoDetail />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/compra/:id" element={<Compra />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/publicar-anuncio" element={<PublicarAnuncioPage />} />
            <Route path="/autos_usados" element={<AutoListUsado />} />
            <Route path="/autos_usados/:id" element={<AutoDetailUsado />} />
            <Route path="/autos_publicados" element={<AutosPublicadosPage />} />
          </Routes>
        </div>

        {/* Footer siempre visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
