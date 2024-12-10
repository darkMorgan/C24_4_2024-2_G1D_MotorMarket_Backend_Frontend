import axios from 'axios';

// Definir la URL base para el servicio de usuarios
const USER_BASE_REST_API_URL = 'http://localhost:8080/api/v1/usuarios';

class UserService {
  // Obtener todos los usuarios (si es necesario)
  getAllUsers() {
    return axios.get(USER_BASE_REST_API_URL);
  }

  // Crear un nuevo usuario
  createUser(user) {
    return axios.post(USER_BASE_REST_API_URL, user);
  }

  // Obtener un usuario por su ID
  getUserById(userId) {
    return axios.get(`${USER_BASE_REST_API_URL}/${userId}`);
  }

  // Actualizar un usuario
  updateUser(userId, user) {
    return axios.put(`${USER_BASE_REST_API_URL}/${userId}`, user);
  }

  // Eliminar un usuario
  deleteUser(userId) {
    return axios.delete(`${USER_BASE_REST_API_URL}/${userId}`);
  }
}

// Exportar una instancia de UserService
export default new UserService();
