package com.tecsup.ventadeautos.controller;

import com.tecsup.ventadeautos.model.User;
import com.tecsup.ventadeautos.repository.UserRepository;
import com.tecsup.ventadeautos.service.JwtTokenService;
import com.tecsup.ventadeautos.service.UserService;
import com.tecsup.ventadeautos.excepciones.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;



@CrossOrigin(origins = "http://localhost:3000")  // Permite solicitudes de un origen específico
@RestController
@RequestMapping("/api/v1")  // Punto de entrada para la API de Usuarios
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;



    @Autowired
    private JwtTokenService jwtTokenService;






    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user) {
        // Validación del usuario (asegurarse de que el usuario y la contraseña son correctos)
        User authenticatedUser = userService.authenticate(user.getUsername(), user.getPassword());
        if (authenticatedUser != null) {
            // Si el usuario es válido, genera un token JWT
            String token = jwtTokenService.generateToken(authenticatedUser.getUsername(), authenticatedUser.getId());

            // Crear una respuesta estructurada con el token y userId
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", String.valueOf(authenticatedUser.getId()));  // Añadir userId

            return ResponseEntity.ok(response); // Regresa el token al frontend
        }
        return ResponseEntity.status(401).body(Collections.singletonMap("message", "Invalid credentials"));
    }


    @PostMapping("/api/v1/refresh")
    public ResponseEntity<Map<String, String>> refreshToken(@RequestBody Map<String, String> body) {
        String refreshToken = body.get("refreshToken");

        if (refreshToken != null && jwtTokenService.isValidRefreshToken(refreshToken)) {
            // Extraemos el username del refresh token
            String username = jwtTokenService.getUsernameFromRefreshToken(refreshToken);

            // Obtener el usuario completo desde la base de datos (por ejemplo, usando el username)
            Optional<User> userOptional = userRepository.findByUsername(username);
            if (userOptional.isPresent()) {
                User user = userOptional.get();
                Long userId = user.getId();  // Obtienes el userId

                // Ahora pasas tanto el username como el userId al generar el nuevo token
                String newAccessToken = jwtTokenService.generateToken(username, userId);

                Map<String, String> response = new HashMap<>();
                response.put("accessToken", newAccessToken);

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(401).body(Collections.singletonMap("message", "User not found"));
            }
        } else {
            return ResponseEntity.status(401).body(Collections.singletonMap("message", "Refresh token inválido"));
        }
    }






    // Obtener todos los usuarios
    @GetMapping("/usuarios")
    public List<User> listarUsers() {
        System.out.println("Consultando los usuarios...");
        return userRepository.findAll();
    }

    // Crear un nuevo usuario
    @PostMapping("/usuarios")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Llamar al servicio para registrar el usuario
            User registeredUser = userService.registerUser(user);
            return ResponseEntity.ok("Usuario registrado correctamente: " + registeredUser.getUsername());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(e.getMessage()); // Si ocurre un error, devuelve el mensaje
        }
    }

    // Obtener un usuario por su ID
    @GetMapping("/usuarios/{id}")
    public ResponseEntity<User> obtenerUserPorId(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
    }

    // Actualizar un usuario
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<User> actualizarUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            User existingUser = userOptional.get();
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setPassword(userDetails.getPassword());

            // Guardamos el usuario actualizado
            userRepository.save(existingUser);

            return ResponseEntity.ok(existingUser);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
    }

    // Eliminar un usuario
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarUser(@PathVariable Long id) {
        Optional<User> userOptional = userRepository.findById(id);

        if (userOptional.isPresent()) {
            userRepository.deleteById(id);

            Map<String, Boolean> response = new HashMap<>();
            response.put("deleted", Boolean.TRUE);
            return ResponseEntity.ok(response);
        } else {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
    }
}
