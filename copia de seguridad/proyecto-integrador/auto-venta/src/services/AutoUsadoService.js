import axios from 'axios';

// Definir la URL base para el servicio de usuarios
const AUTOUSADO_BASE_REST_API_URL = 'http://localhost:8080/api/v1/autos_usados';

class AutoUsadoService {
  // Obtener todos los usuarios (si es necesario)
  getAllAutosUsados() {
    return axios.get(AUTOUSADO_BASE_REST_API_URL);
  }

  // Crear un nuevo usuario
  createAutoUsado(autousado) {
    return axios.post(AUTOUSADO_BASE_REST_API_URL, autousado);
  }

  // Obtener un usuario por su ID
  getAutoUsadoById(autousadoId) {
    return axios.get(`${AUTOUSADO_BASE_REST_API_URL}/${autousadoId}`);
  }

  // Actualizar un usuario
  updateAutoUsado(autousadoId, autousado) {
    return axios.put(`${AUTOUSADO_BASE_REST_API_URL}/${autousadoId}`, autousado);
  }

  // Eliminar un usuario
  deleteAutoUsado(autousadoId) {
    return axios.delete(`${AUTOUSADO_BASE_REST_API_URL}/${autousadoId}`);
  }
}

// Exportar una instancia de UserService
export default new AutoUsadoService();
