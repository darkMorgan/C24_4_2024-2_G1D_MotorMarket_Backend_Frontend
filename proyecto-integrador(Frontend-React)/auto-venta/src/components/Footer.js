import React from 'react';
import './Footer.css'; // Asegúrate de tener un archivo CSS para los estilos

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 MotorMarket. Todos los derechos reservados.</p>
                <p>Dirección: Santa Anita av.cascanueces 123, Lima, Perú.</p>
                <p>Contacto: contacto@motormarket.com | Tel: +51 995 790 491</p>
            </div>
        </footer>
    );
};

export default Footer;