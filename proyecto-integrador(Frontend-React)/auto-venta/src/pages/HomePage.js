import React, { useState, useEffect } from 'react';
import './HomePage.css';

function HomePage() {
  const [backgroundImage, setBackgroundImage] = useState('/images/motormarket.jpg');
  const [imageIndex, setImageIndex] = useState(0); // Índice de la imagen actual

  useEffect(() => {
    const images = [
      '/images/motormarket.jpg',
      '/images/motormarket2.jpg',
      '/images/motormarket3.jpg',
    ];

    const intervalId = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Cambia de imagen cada 5 segundos

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const images = [
      '/images/motormarket.jpg',
      '/images/motormarket2.jpg',
      '/images/motormarket3.jpg',
    ];
    setBackgroundImage(images[imageIndex]); // Cambiar la imagen cuando el índice cambia
  }, [imageIndex]);

  return (
    <div className="home-container">
      <div className="background-container" style={{ backgroundImage: `url(${backgroundImage})` }} />
      <div className="overlay" /> {/* Capa oscura */}
      <div className="content-container">
        <h1 className="title">¡Bienvenido a MotorMarket!</h1>
        <p className="description">
          Encuentra los mejores autos nuevos y usados en nuestro catálogo.
        </p>
        <div className="cta-container">
          <button className="cta-btn" onClick={() => window.location.href = '/catalogo'}>
            Ver Catálogo
          </button>
          <button className="cta-btn" onClick={() => window.location.href = '/publicar-anuncio'}>
            Vende tu Auto
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
