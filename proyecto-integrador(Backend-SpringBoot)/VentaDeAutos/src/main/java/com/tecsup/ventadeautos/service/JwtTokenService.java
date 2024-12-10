package com.tecsup.ventadeautos.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtTokenService {

    // Leemos la clave secreta desde el archivo de propiedades
    @Value("${jwt.secret}")
    private String secretKey;  // Se espera que esté en el archivo application.properties




    // Tiempo de expiración del token en milisegundos (1 hora)
    private static final long EXPIRATION_TIME = 100000 * 60 * 60;  // 1 hora

    // Método para generar un token JWT
    public String generateToken(String username, Long userId) {
        return Jwts.builder()
                .setSubject(username)  // Usamos el nombre de usuario como "subject"
                .claim("userId", userId)

                .setIssuedAt(new Date())  // Fecha de emisión del token
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // Fecha de expiración
                .signWith(SignatureAlgorithm.HS256, secretKey)  // Firmado con el algoritmo HS256 y la clave secreta
                .compact();
    }

    // Método para extraer el nombre de usuario (subject) del token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);  // Extraemos el "subject" que es el username
    }

    // Método para extraer el userId del token
    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));  // Extrae el 'userId' del claim
    }

    // Método para extraer cualquier tipo de reclamación (claim) del token
    private <T> T extractClaim(String token, ClaimsResolver<T> claimsResolver) {
        final Claims claims = extractAllClaims(token);  // Extraemos todas las reclamaciones del token
        return claimsResolver.resolve(claims);  // Resolvemos la reclamación específica
    }

    // Método para extraer todas las reclamaciones del token
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)  // Usamos la misma clave secreta para analizar el token
                .parseClaimsJws(token)  // Parseamos el JWT y obtenemos las reclamaciones
                .getBody();
    }

    // Método para verificar si el token ha expirado
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());  // Comprobamos si la fecha de expiración es antes de la fecha actual
    }

    // Método para extraer la fecha de expiración del token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);  // Extraemos la fecha de expiración del token
    }

    // Método para validar el token, asegurando que el nombre de usuario coincida y el token no haya expirado
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));  // Validamos que el username coincida y que el token no haya expirado
    }

    // Interfaz funcional para resolver reclamaciones específicas
    @FunctionalInterface
    public interface ClaimsResolver<T> {
        T resolve(Claims claims);
    }

    public boolean isValidRefreshToken(String refreshToken) {
        try {
            // Intentamos verificar el token. Si es válido, no lanzará ninguna excepción.
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)  // Reemplaza con tu clave secreta
                    .parseClaimsJws(refreshToken)
                    .getBody();

            // Puedes agregar más lógica para verificar la validez, como asegurarte de que el token no haya expirado.
            return true;
        } catch (Exception e) {
            // Si ocurre un error (por ejemplo, token expirado o inválido), el token no es válido.
            return false;
        }
    }


    public String getUsernameFromRefreshToken(String refreshToken) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(secretKey)  // Reemplaza con tu clave secreta
                    .parseClaimsJws(refreshToken)
                    .getBody();

            // Aquí se asume que el nombre de usuario está almacenado en el claim "sub" (subject).
            return claims.getSubject();
        } catch (Exception e) {
            // Si el token es inválido o no tiene la estructura esperada, lanzamos una excepción.
            throw new IllegalArgumentException("No se pudo obtener el usuario del refresh token.");
        }
    }





}
