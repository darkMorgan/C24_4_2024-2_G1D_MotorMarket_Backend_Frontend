import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios'; 
import './AutoDetail.css'; 

export const AutoDetail = () => {
  const { id } = useParams(); // Obtén el ID del auto desde la URL
  const [auto, setAuto] = useState(null);
  const [endpoint, setEndpoint] = useState(null); // Nuevo estado para el endpoint
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerDetallesAuto = async () => {
      if (accessToken) {
        try {
          // Intentar primero obtener de `autos`
          let response = await axios.get(`http://localhost:8080/api/v1/autos/${id}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
          });
          setAuto(response.data.auto);
          setEndpoint('autos'); // Indicar que se encontró en `autos`
        } catch (error1) {
          // Si no existe en `autos`, intentar `autos_usados`
          try {
            let response = await axios.get(`http://localhost:8080/api/v1/autos_usados/${id}`, {
              headers: { 'Authorization': `Bearer ${accessToken}` },
            });
            setAuto(response.data.autoUsado);
            setEndpoint('autos_usados'); // Indicar que se encontró en `autos_usados`
          } catch (error2) {
            setError('Error al obtener los detalles del auto. Intente nuevamente más tarde.');
          }
        }
      } else {
        setError('No hay token. Por favor, inicie sesión.');
        navigate('/login');
      }
    };

    obtenerDetallesAuto();
  }, [id, navigate, accessToken]);

  const handlePurchaseComplete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/${endpoint}/${id}`, // Usar el endpoint dinámico
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.status === 204) {
        alert('Compra realizada con éxito. El auto ha sido eliminado de la lista.');
        navigate('/autos'); // Redirige a la lista de autos
      }
    } catch (error) {
      console.error('Error al completar la compra:', error);
      alert('Hubo un problema al completar la compra. Intenta de nuevo.');
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!auto) {
    return <div className="loading-message">Cargando...</div>;
  }

  return (
    <div className="auto-detail-container">
      <div className="auto-detail-card">
        <h2 className="auto-detail-title">Detalles del Auto</h2>
        <img
          src={auto.imagen}
          alt={auto.marca + ' ' + auto.modelo}
          className="auto-image"
        />
        <div className="auto-info">
          <p><strong>Marca:</strong> {auto.marca}</p>
          <p><strong>Modelo:</strong> {auto.modelo}</p>
          <p><strong>Año:</strong> {auto.year}</p>
          <p className="auto-price"><strong>Precio:</strong> US$ {auto.precio}</p>
        </div>
        <div className="paypal-container">
          <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID", currency: "USD" }}>
            <PayPalButtons
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      amount: { value: auto.precio.toFixed(2) },
                      description: `${auto.marca} ${auto.modelo} (${auto.year})`,
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                  alert('Compra completada con éxito');
                  handlePurchaseComplete(); // Llamar al backend para eliminar el auto
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default AutoDetail;
