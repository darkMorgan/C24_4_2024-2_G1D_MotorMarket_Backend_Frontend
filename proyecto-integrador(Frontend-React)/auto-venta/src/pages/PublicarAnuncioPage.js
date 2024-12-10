import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PublicarAnuncio.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PublicarAnuncioPage = () => {
  const [formData, setFormData] = useState({
    propietario: '',
    marca: '',
    modelo: '',
    year: '',
    precio: '',
  });
  const [imagen, setImagen] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Manejo de campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de subida de imagen
  const handleImageChange = (e) => {
    setImagen(e.target.files[0]);
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Valida que todos los campos estén llenos
    const { propietario,marca, modelo, year, precio } = formData;
    if (!propietario || !marca || !modelo || !year || !precio) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Obtén el userId desde localStorage
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('No se pudo obtener el ID del usuario. Intenta iniciar sesión nuevamente.');
      return;
    }

    // Crear FormData para enviar como multipart/form-data
    const dataToSend = new FormData();
    dataToSend.append(
      'auto',
      JSON.stringify({ propietario, marca, modelo, year: parseInt(year), precio: parseFloat(precio) })
    );
    if (imagen) {
      dataToSend.append('imagen', imagen);
    }
    dataToSend.append('userId', userId); // Asegúrate de que el userId esté correctamente incluido

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:8080/api/v1/autos_usados', dataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Incluye el token en los headers
        },
      });

      // Maneja la respuesta
      if (response.status === 200) {
        navigate('/autos_usados');
      } else {
        setError('Hubo un problema al guardar el anuncio. Intenta de nuevo.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Hubo un error al publicar tu auto. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow mx-auto p-4" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-4">Publicar Anuncio</h2>

        <form onSubmit={handleSubmit}>
          {/* Campos de texto */}
          {['propietario','marca', 'modelo', 'year', 'precio'].map((field, index) => (
            <div className="mb-3" key={index}>
              <label className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'year' || field === 'precio' ? 'number' : 'text'}
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                required
              />
            </div>
          ))}

          {/* Campo de subida de imagen */}
          <div className="mb-3">
            <label className="form-label">Imagen</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>

          {/* Botón de envío */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Publicando...' : 'Publicar Auto'}
          </button>
        </form>

        {error && <p className="text-danger text-center mt-3">{error}</p>}
      </div>
    </div>
  );
};

export default PublicarAnuncioPage;
