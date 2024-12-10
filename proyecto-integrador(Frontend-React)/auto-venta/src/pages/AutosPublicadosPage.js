import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Grid, Container } from '@mui/material';

const AutosPublicadosPage = () => {
  const [autos, setAutos] = useState([]);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchAutosPublicados();
  }, []);

  const fetchAutosPublicados = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    // Verificar que el token esté presente
    if (!accessToken) {
      setError('No se ha encontrado un token de acceso. Por favor, inicia sesión.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/api/v1/autos_usados/usuario', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      setAutos(response.data);  // Aquí tomamos los autos filtrados por el backend
    } catch (error) {
      setError('Error al obtener los autos publicados. Por favor, intenta de nuevo.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Mis Autos Publicados
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={4}>
        {autos.map((auto) => (
          <Grid item xs={12} sm={6} md={4} key={auto.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={auto.imagen}
                alt={`${auto.marca} ${auto.modelo}`}
              />
              <CardContent>
                <Typography variant="h6">{auto.marca} {auto.modelo}</Typography>
                <Typography>Año: {auto.year}</Typography>
                <Typography>Precio: US$ {auto.precio}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AutosPublicadosPage;
