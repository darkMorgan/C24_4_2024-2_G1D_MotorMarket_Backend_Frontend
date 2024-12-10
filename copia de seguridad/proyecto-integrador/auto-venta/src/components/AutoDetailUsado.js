import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import './AutoDetail.css'; 

export const AutoDetailUsado = () => {
  const { id } = useParams(); // Obtén el ID del auto desde la URL
  const [auto, setAuto] = useState(null);
  const [error, setError] = useState(null); // Estado para manejar errores
  const navigate = useNavigate(); // Cambiado de useHistory a useNavigate

  useEffect(() => {
    const obtenerDetallesAuto = async () => {
      let accessToken = localStorage.getItem('accessToken');  // Obtener el Access Token de localStorage
      if (accessToken) {
        try {
          // Realizar la solicitud para obtener los detalles del auto
          const response = await axios.get(`http://localhost:8080/api/v1/autos_usados/${id}`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`  // Enviar el token JWT en la cabecera
            }
          });
          
          setAuto(response.data.autoUsado);  // Guardar los detalles del auto en el estado
          
        } catch (error) {
          if (error.response && error.response.status === 401) {
            setError('Token inválido o expirado. Por favor, inicie sesión nuevamente.');
            localStorage.removeItem('accessToken');  // Eliminar el token
            navigate('/login');  // Redirigir al login
          } else {
            setError('Error al obtener los detalles del auto. Intente nuevamente más tarde.');
            console.error("Error al obtener los detalles del auto:", error.response ? error.response.data : error);
          }
        }
      } else {
        setError('No hay token. Por favor, inicie sesión.');
        navigate('/login');  // Redirigir al login si no hay token
      }
    };

    obtenerDetallesAuto();  // Llamada a la función cuando el componente se monte

  }, [id, navigate]);  // `id` y `navigate` son dependencias


  if (error) {
    return <div className="error-message">{error}</div>; // Si hay un error, muestra el mensaje
  }

  if (!auto) {
    return <div className="loading-message">Cargando...</div>; // Si aún no se cargaron los detalles del auto
  }

  return (
    <div className="auto-detail-container">
      <div className="auto-detail-card">
        <h2 className="auto-detail-title">Detalles del Auto</h2>
        {/* Usamos la URL de la imagen que se obtiene del backend */}
        <img
          src={auto.imagen} // Imagen que viene directamente del backend
          alt={auto.marca + ' ' + auto.modelo}
          className="auto-image"
        />
        <div className="auto-info">
          <p><strong>Marca:</strong> {auto.marca}</p>
          <p><strong>Modelo:</strong> {auto.modelo}</p>
          <p><strong>Año:</strong> {auto.year}</p>
          <p className="auto-price"><strong>Precio:</strong> US$ {auto.precio}</p>
        </div>
        <div className="buy-button-container">
          <Link to={`/compra/${auto.id}`}>
            <button className="btn-buy">Comprar</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AutoDetailUsado;
