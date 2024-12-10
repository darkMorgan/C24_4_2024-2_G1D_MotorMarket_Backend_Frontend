import React, { useState, useEffect } from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Compra.css";

const PayPalButtonComponent = ({ autoId, precioAuto, autoDetails, onPurchaseComplete }) => {
  const initialOptions = {
    "client-id": "AcZXjUJyS6HNujdBDya6rCkVSRcH4_UwgRa9viFgngTBYLcZJmOSzr0aSS1INb_ge9vozBjoYfjuZcnv",  // Asegúrate de usar tu client ID real
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: precioAuto.toFixed(2), // Usamos el precio real del auto
          },
          description: `${autoDetails.propietario} ${autoDetails.marca} ${autoDetails.modelo} (${autoDetails.year})`,  // Descripción del auto
          custom_id: `Auto-${autoId}`,  // Puede ser útil como identificador único de la compra
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      alert("Transaction completed by " + details.payer.name.given_name);
      // Llamar a la función que elimina el auto después de la transacción
      await onPurchaseComplete(autoId);
    });
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          size: "medium",
        }}
        createOrder={(data, actions) => createOrder(data, actions)}
        onApprove={(data, actions) => onApprove(data, actions)}
      />
    </PayPalScriptProvider>
  );
};

const Compra = () => {
  const { id } = useParams(); // Obtén el autoId de la URL
  const [auto, setAuto] = useState(null); // Estado para el auto
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  useEffect(() => {
    // Llamada para obtener los detalles del auto y su precio
    const obtenerAuto = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/autos_usados/${id}`);
        setAuto(response.data.autoUsado);  // Guarda los detalles del auto en el estado
      } catch (error) {
        console.error("Error al obtener los detalles del auto", error);
        alert("Hubo un problema al obtener los detalles del auto.");
      }
    };

    obtenerAuto();
  }, [id]);

  const handlePurchaseComplete = async (autoId) => {
    try {
      // Realiza la solicitud para eliminar el auto después de completar el pago
      const response = await axios.delete(
        `http://localhost:8080/api/v1/autos_usados/${autoId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Asegúrate de pasar el token
          },
        }
      );

      if (response.status === 204) {
        alert("Compra realizada con éxito. El auto ha sido eliminado de la lista.");
        navigate("/autos"); // Redirige a la vista de autos
      }
    } catch (error) {
      console.error("Error al eliminar el auto:", error);
      alert("Hubo un problema al eliminar el auto. Intenta de nuevo.");
    }
  };

  if (!auto) {
    return <div>Cargando...</div>;  // Mientras se carga el auto
  }

  return (
    <div className="compra-container">
      <h1 className="compra-title">Realizar Compra</h1>
      <p>Propietario: {auto.propietario}</p> 
      <p>Marca: {auto.marca}</p> {/* Mostrar la marca del auto */}
      <p>Modelo: {auto.modelo}</p> {/* Mostrar el modelo del auto */}
      <p>Año: {auto.year}</p> {/* Mostrar el año del auto */}
      <p>Precio del auto: ${auto.precio}</p> {/* Mostrar el precio del auto */}
      <div className="paypal-container">
        {/* Pasamos el autoId, precioAuto, autoDetails y la función handlePurchaseComplete */}
        <PayPalButtonComponent
          autoId={id}
          precioAuto={auto.precio}
          autoDetails={auto}  // Pasa todos los detalles del auto
          onPurchaseComplete={handlePurchaseComplete}
        />
      </div>
    </div>
  );
};

export default Compra;