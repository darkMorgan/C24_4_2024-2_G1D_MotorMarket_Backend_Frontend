import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardMedia, Grid, Typography, Button, Container, Snackbar, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import './AutoList.css';

export const AutoListUsado = () => {
  const [autos, setAutos] = useState([]);
  const [filteredAutos, setFilteredAutos] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    listarAutos();
  }, []);

  // Obtener lista de autos desde la API
  const listarAutos = async () => {
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken) {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/autos_usados', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });

        setAutos(response.data);
        setFilteredAutos(response.data);

        // Obtener marcas únicas para el filtro
        const uniqueBrands = Array.from(new Set(response.data.map((auto) => auto.marca)));
        setBrands(uniqueBrands);

      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Token inválido o expirado. Intentando refrescar token...');
          try {
            const refreshResponse = await axios.post('http://localhost:8080/api/v1/refresh', {
              refreshToken
            });

            if (refreshResponse.data && refreshResponse.data.accessToken) {
              localStorage.setItem('accessToken', refreshResponse.data.accessToken);
              const retryResponse = await axios.get('http://localhost:8080/api/v1/autos', {
                headers: { 'Authorization': `Bearer ${refreshResponse.data.accessToken}` }
              });
              setAutos(retryResponse.data);
              setFilteredAutos(retryResponse.data);
            } else {
              setError('No se pudo obtener un nuevo token. Por favor, inicie sesión nuevamente.');
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
            }
          } catch (refreshError) {
            setError('Error al refrescar el token. Inicie sesión nuevamente.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } else {
          setError('Error al obtener los autos.');
        }
      }
    } else {
      setError('No hay token. Por favor, inicie sesión.');
    }
  };

  // Filtrar autos por marca
  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setSelectedBrand(selectedBrand);

    if (selectedBrand === '') {
      setFilteredAutos(autos); // Si no hay marca seleccionada, mostrar todos los autos
    } else {
      setFilteredAutos(autos.filter(auto => auto.marca === selectedBrand)); // Filtrar por marca
    }
  };

  // Filtrar autos por texto de búsqueda (nombre, modelo, año)
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = autos.filter(auto => 
      auto.marca.toLowerCase().includes(query.toLowerCase()) ||
      auto.modelo.toLowerCase().includes(query.toLowerCase()) ||
      auto.year.toString().includes(query)
    );
    setFilteredAutos(filtered);
  };

  return (
    
    <Container>
      
      <Typography variant="h4" gutterBottom>
        Autos Seminuevos
      </Typography>

      {error && (
        <Snackbar
          open={openSnackbar}
          message={error}
          autoHideDuration={6000}
          onClose={() => setOpenSnackbar(false)}
        />
      )}

      {/* Filtros y Buscador */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Marca</InputLabel>
            <Select
              value={selectedBrand}
              onChange={handleBrandChange}
              label="Marca"
            >
              <MenuItem value="">Todas las marcas</MenuItem>
              {brands.map((brand, index) => (
                <MenuItem key={index} value={brand}>{brand}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={9}>
          <TextField
            label="Buscar por marca, modelo o año"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Grid>
      </Grid>

      {/* Lista de Autos Filtrados */}
      <Grid container spacing={4}>
        {filteredAutos.map((auto) => (
          <Grid item xs={12} sm={6} md={4} key={auto.id}>
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                height="140"
                image={auto.imagen} // Usamos la URL de la imagen directamente
                alt={auto.marca + ' ' + auto.modelo}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {auto.marca} {auto.modelo}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Año: {auto.year}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Precio: US$ {auto.precio}
                </Typography>
                <Link to={`/autos_usados/${auto.id}`}>
                  <Button variant="contained" color="primary" fullWidth>
                    Ver Detalles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AutoListUsado;
