// src/pages/HomePage.js

import React from 'react';
import './MiComponente.css';

export const HomePage = () => {
    // Verificar si el usuario está logueado comprobando el accessToken en localStorage
    const isLoggedIn = localStorage.getItem('accessToken');

    const handleSellCarClick = () => {
        // Si no hay un token de acceso, redirigir al login
        if (!isLoggedIn) {
            window.location.href = '/login';
        } else {
            // Si el usuario está logueado, redirigir a la página de vender auto
            window.location.href = '/publicar-anuncio';
        }
    };

    return (
        <div className="home-container">
            {/* Título de bienvenida */}
            <h1 className="text-center welcome-title">
                ¡Bienvenido a MotorMarket!
            </h1>

            {/* Descripción breve */}
            <p className="description">
                Encuentra los mejores autos nuevos y usados a los precios más competitivos. 
                Compra, vende o intercambia vehículos de manera rápida y segura.
            </p>
            <div className="cta-container">
                <button className="cta-btn" onClick={() => window.location.href = '/catalogo'}>Ver Catálogo</button>
                <button className="cta-btn" onClick={handleSellCarClick}>Vende tu Auto</button>
            </div>

            {/* Imagen representativa de autos */}
            <div className="image-container">
                <img src="/images/motormarket.jpg" alt="Compra y venta de autos" className="mi-imagen" />
            </div>

           
            
        </div>
    );
};

export default HomePage;
