import axios from 'axios';

// Define la URL base de la API
const AUTO_BASE_REST_API_URL = 'http://localhost:8080/api/v1/autos';

// Función para obtener el token desde el localStorage
const getAuthToken = () => {
  return localStorage.getItem('token'); // O sessionStorage.getItem('token') si el token está almacenado ahí
};

class AutoService {
  // Obtener todos los autos
  getAllAutos() {
    const token = localStorage.getItem('token');  // Obtén el token del localStorage o sessionStorage
    return axios.get(AUTO_BASE_REST_API_URL, {
      headers: {
        Authorization: `Bearer ${token}` // Enviar el token en el encabezado Authorization
      }
    });
  }

  // Crear un nuevo auto
  createAuto(auto) {
    const token = localStorage.getItem('token');
    return axios.post(AUTO_BASE_REST_API_URL, auto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Obtener detalles de un auto por ID
  getAutoById(autoId) {
    const token = localStorage.getItem('token');
    return axios.get(`${AUTO_BASE_REST_API_URL}/${autoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Actualizar un auto
  updateAuto(autoId, auto) {
    const token = getAuthToken();
    return axios.put(`${AUTO_BASE_REST_API_URL}/${autoId}`, auto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Eliminar un auto
  deleteAuto(autoId) {
    const token = getAuthToken();
    return axios.delete(`${AUTO_BASE_REST_API_URL}/${autoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

export default new AutoService();
