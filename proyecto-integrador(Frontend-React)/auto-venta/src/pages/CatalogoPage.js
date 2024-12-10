import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CatalogoPage.css';

export const autosNuevos  = [
    {
        id: 1,
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2023,
        precio: 28000,
        imagen: '/images/toyota_corolla.jpg',
        descripcion: 'Auto nuevo, confiable y eficiente. Ideal para la familia.',
    },
    {
        id: 2,
        marca: 'Mazda',
        modelo: 'Mazda3',
        año: 2023,
        precio: 32000,
        imagen: '/images/mazda3.png',
        descripcion: 'SUV nuevo, con diseño elegante y tecnología avanzada.',
    },
    {
        id: 3,
        marca: 'Ford',
        modelo: 'Mustang',
        año: 2023,
        precio: 55000,
        imagen: '/images/ford_mustang_nuevo_2023.png',
        descripcion: 'Deportivo icónico con motor V8 y diseño aerodinámico.',
    },
    {
        id: 4,
        marca: 'Chevrolet',
        modelo: 'Silverado',
        año: 2023,
        precio: 45000,
        imagen: '/images/Chevrolet_Silverado_nuevo_2023.jpg',
        descripcion: 'Pickup robusta y poderosa, lista para cualquier desafío.',
    },
    {
        id: 5,
        marca: 'Tesla',
        modelo: 'Model 3',
        año: 2023,
        precio: 40000,
        imagen: '/images/Tesla_Model_3_nuevo_2023.jpg',
        descripcion: 'Sedán eléctrico con autonomía avanzada y tecnología de punta.',
    },
    {
        id: 6,
        marca: 'Hyundai',
        modelo: 'Tucson',
        año: 2023,
        precio: 32000,
        imagen: '/images/hyundai_tucson.jpg',
        descripcion: 'SUV espaciosa con diseño moderno y características innovadoras.',
    },
    {
        id: 7,
        marca: 'BMW',
        modelo: 'X5',
        año: 2023,
        precio: 60000,
        imagen: '/images/BMW_X5_nuevo_2023.jpg',
        descripcion: 'SUV de lujo con un interior sofisticado y un motor potente.',
    },
    {
        id: 8,
        marca: 'Mercedes-Benz',
        modelo: 'C-Class',
        año: 2023,
        precio: 50000,
        imagen: '/images/Mercedes_Benz_C_Class _nuevo_2023.jpg',
        descripcion: 'Sedán premium que combina elegancia y rendimiento.',
    },
    {
        id: 9,
        marca: 'Kia',
        modelo: 'Sportage',
        año: 2023,
        precio: 28000,
        imagen: '/images/Kia_Sportage_nuevo_2023.jpg',
        descripcion: 'SUV compacta con tecnología avanzada y diseño atractivo.',
    },
    {
        id: 10,
        marca: 'Audi',
        modelo: 'A4',
        año: 2023,
        precio: 42000,
        imagen: '/images/Audi_A4_nuevo_2023.jpg',
        descripcion: 'Sedán de lujo con tecnología innovadora y conducción dinámica.',
    },
    {
        id: 11,
        marca: 'Volkswagen',
        modelo: 'Tiguan',
        año: 2023,
        precio: 34000,
        imagen: '/images/Volkswagen_Tiguan_nuevo_2023.jpg',
        descripcion: 'SUV versátil con gran espacio y tecnología intuitiva.',
    },
    {
        id: 12,
        marca: 'Nissan',
        modelo: 'Altima',
        año: 2023,
        precio: 29000,
        imagen: '/images/Nissan_Altima_nuevo_2023.jpg',
        descripcion: 'Sedán confiable con tecnología avanzada y diseño atractivo.',
    },
];


export const autosUsados = [
    {
        id: 1,
        marca: 'Honda',
        modelo: 'Civic',
        año: 2021,
        precio: 22000,
        imagen: '/images/honda_civic.jpg',
        descripcion: 'Compacto usado, excelente estado y gran rendimiento.',
    },
    {
        id: 2,
        marca: 'Nissan',
        modelo: 'Navara',
        año: 2020,
        precio: 27000,
        imagen: '/images/nissan_navara.jpg',
        descripcion: 'Pickup usada, robusta y lista para cualquier terreno.',
    },
    {
        id: 3,
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2019,
        precio: 20000,
        imagen: '/images/toyota_corolla.jpg',
        descripcion: 'Sedán usado, confiable y eficiente en combustible.',
    },
    {
        id: 4,
        marca: 'Ford',
        modelo: 'Ranger',
        año: 2018,
        precio: 25000,
        imagen: '/images/Ford_Ranger_usado_2018.jpg',
        descripcion: 'Camioneta usada, potente y espaciosa.',
    },
    {
        id: 5,
        marca: 'Chevrolet',
        modelo: 'Spark',
        año: 2020,
        precio: 15000,
        imagen: '/images/Chevrolet_Spark_usado_2020.jpg',
        descripcion: 'Hatchback compacto, ideal para la ciudad.',
    },
    {
        id: 6,
        marca: 'Mazda',
        modelo: 'CX-5',
        año: 2022,
        precio: 30000,
        imagen: '/images/Mazda_CX_5_usado_2022.png',
        descripcion: 'SUV usado, moderno y confortable.',
    },
    {
        id: 7,
        marca: 'Volkswagen',
        modelo: 'Jetta',
        año: 2017,
        precio: 18000,
        imagen: '/images/Volkswagen_Jetta_usado_2017.jpg',
        descripcion: 'Sedán usado, con diseño clásico y gran desempeño.',
    },
    {
        id: 8,
        marca: 'Kia',
        modelo: 'Sportage',
        año: 2021,
        precio: 29000,
        imagen: '/images/Kia_Sportage_usado_2021.png',
        descripcion: 'SUV familiar usado, versátil y con buen equipamiento.',
    },
    {
        id: 9,
        marca: 'Hyundai',
        modelo: 'Tucson',
        año: 2019,
        precio: 27000,
        imagen: '/images/hyundai_tucson.jpg',
        descripcion: 'SUV usado, elegante y eficiente.',
    },
    {
        id: 10,
        marca: 'BMW',
        modelo: 'X3',
        año: 2018,
        precio: 35000,
        imagen: '/images/BMW_X3_usado_2018.jpg',
        descripcion: 'SUV premium usado, con gran lujo y rendimiento.',
    },
    {
        id: 11,
        marca: 'Jeep',
        modelo: 'Cherokee',
        año: 2020,
        precio: 32000,
        imagen: '/images/Jeep_Cherokee_usado_2020.png',
        descripcion: 'SUV todo terreno usado, resistente y confiable.',
    },
    {
        id: 12,
        marca: 'Audi',
        modelo: 'A4',
        año: 2019,
        precio: 37000,
        imagen: '/images/Audi_A4_usado_2019.jpg',
        descripcion: 'Sedán premium usado, diseño elegante y tecnología avanzada.',
    },
];

export const CatalogoPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredNuevos, setFilteredNuevos] = useState(autosNuevos);
    const [filteredUsados, setFilteredUsados] = useState(autosUsados);
    const navigate = useNavigate();


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            // Si el usuario ya está logueado, redirigimos a la lista de autos
            navigate('/autos');
        }
    }, [navigate]);

    const handleSearchChange = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredNuevos(
            autosNuevos.filter(
                (auto) =>
                    auto.marca.toLowerCase().includes(term) ||
                    auto.modelo.toLowerCase().includes(term)
            )
        );
        setFilteredUsados(
            autosUsados.filter(
                (auto) =>
                    auto.marca.toLowerCase().includes(term) ||
                    auto.modelo.toLowerCase().includes(term)
            )
        );
    };

    const handleRedirectToDetails = (id) => {
        navigate(`/autos/${id}`);
    };

    const handleRedirectToLogin = () => {
        navigate('/login');
    };

    return (
        <div className="catalogo-container">
            <h2 className="catalogo-title">Catálogo de Autos</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Busca por marca o modelo"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>

            {/* Catálogo de Autos Nuevos */}
            <h3 className="catalogo-subtitle">Autos Nuevos</h3>
            <div className="autos-list">
                {filteredNuevos.length > 0 ? (
                    filteredNuevos.map((auto) => (
                        <div key={auto.id} className="auto-card">
                            <img src={auto.imagen} alt={auto.marca + ' ' + auto.modelo} className="auto-image" />
                            <div className="auto-info">
                                <h3 className="auto-title">
                                    {auto.marca} {auto.modelo} ({auto.año})
                                </h3>
                                <p className="auto-description">{auto.descripcion}</p>
                                <p className="auto-price">${auto.precio.toLocaleString()}</p>
                                <button
                                    className="auto-btn"
                                    onClick={() => handleRedirectToDetails(auto.id)}
                                >
                                    Ver más detalles
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No se encontraron autos nuevos con ese criterio de búsqueda.</p>
                )}
            </div>

            {/* Catálogo de Autos Usados */}
            <h3 className="catalogo-subtitle">Autos Usados</h3>
            <div className="autos-list">
                {filteredUsados.length > 0 ? (
                    filteredUsados.map((auto) => (
                        <div key={auto.id} className="auto-card">
                            <img src={auto.imagen} alt={auto.marca + ' ' + auto.modelo} className="auto-image" />
                            <div className="auto-info">
                                <h3 className="auto-title">
                                    {auto.marca} {auto.modelo} ({auto.año})
                                </h3>
                                <p className="auto-description">{auto.descripcion}</p>
                                <p className="auto-price">${auto.precio.toLocaleString()}</p>
                                <button
                                    className="auto-btn"
                                    onClick={() => handleRedirectToDetails(auto.id)}
                                >
                                    Ver más detalles
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-results">No se encontraron autos usados con ese criterio de búsqueda.</p>
                )}
            </div>

            <div className="view-more-container">
                <button className="view-more-btn" onClick={handleRedirectToLogin}>
                    Ver más autos disponibles
                </button>
            </div>
        </div>
    );
};

export default CatalogoPage;
