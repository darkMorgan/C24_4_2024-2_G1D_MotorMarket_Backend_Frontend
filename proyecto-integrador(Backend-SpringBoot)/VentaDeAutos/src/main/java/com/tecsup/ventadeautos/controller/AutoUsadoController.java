package com.tecsup.ventadeautos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecsup.ventadeautos.excepciones.ResourceNotFoundException;
import com.tecsup.ventadeautos.model.Auto;
import com.tecsup.ventadeautos.model.AutoUsado;
import com.tecsup.ventadeautos.model.User;
import com.tecsup.ventadeautos.repository.AutoUsadoRepository;
import com.tecsup.ventadeautos.repository.UserRepository;
import com.tecsup.ventadeautos.service.JwtTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")  // Permite solicitudes de un origen específico
@RestController
@RequestMapping("/api/v1")  // Punto de entrada para la API de AutoUsado
public class AutoUsadoController {

    @Autowired
    private AutoUsadoRepository autousadoRepository;


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenService jwtTokenService;


    @GetMapping("/autos_usados")  // Método original
    public List<AutoUsado> getAllAutos() {
        return autousadoRepository.findAll();  // Obtener todos los autos de la base de datos
    }




    // Obtener todos los autos usados
    @GetMapping("/autos_usados/usuario")
    public List<AutoUsado> listarAutosUsados(@RequestHeader("Authorization") String authorizationHeader) {
        // Obtener el token y extraer el username desde el token
        String token = authorizationHeader.replace("Bearer ", "");
        String username = jwtTokenService.extractUsername(token);  // Usar jwtTokenService en lugar de jwtService

        // Buscar los autos del usuario por su username
        List<AutoUsado> autosUsados = autousadoRepository.findByUserUsername(username);  // Filtrar por username

        // Asegúrate de que las imágenes tengan la URL completa
        for (AutoUsado auto : autosUsados) {
            String imagenUrl = auto.getImagen();
            if (!imagenUrl.startsWith("http://localhost:8080/uploads/")) {
                imagenUrl = "http://localhost:8080/uploads/" + imagenUrl;
            }
            auto.setImagen(imagenUrl); // Establecer la URL completa de la imagen
        }

        return autosUsados; // Devolver los autos del usuario
    }










    // Obtener un auto usado por su ID
    @GetMapping("/autos_usados/{id}")
    public Map<String, Object> obtenerAutoUsadoPorId(@PathVariable Long id) {
        System.out.println("Consultando auto usado con ID: " + id);

        // Obtener el auto desde la base de datos
        AutoUsado autoUsado = autousadoRepository.findById(id).orElse(null);

        Map<String, Object> response = new HashMap<>();
        if (autoUsado != null) {
            String imagenUrl = autoUsado.getImagen();
            if (!imagenUrl.startsWith("http://localhost:8080/uploads/")) {
                imagenUrl = "http://localhost:8080/uploads/" + imagenUrl;
            }
            autoUsado.setImagen(imagenUrl);  // Establecer la URL completa de la imagen
            response.put("autoUsado", autoUsado);  // Retornar el auto con la URL de la imagen
        } else {
            response.put("autoUsado", null);  // Si no se encuentra, poner null
        }

        return response;
    }








    // Guardar un nuevo auto usado
    @PostMapping("/autos_usados")
    public ResponseEntity<AutoUsado> guardarAutoUsado(@RequestParam("auto") String autoJson,
                                                      @RequestParam("imagen") MultipartFile imagen,
                                                      @RequestParam("userId") Long userId) throws IOException {
        // Parseamos el JSON para obtener los datos del auto
        ObjectMapper objectMapper = new ObjectMapper();
        AutoUsado autoUsado = objectMapper.readValue(autoJson, AutoUsado.class);

        // Buscar el usuario por ID
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con el ID: " + userId));

        // Asociar el auto al usuario
        autoUsado.setUser(user);

        // Crear el directorio uploads si no existe
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Obtener el nombre de la imagen y moverla a la carpeta uploads
        String imagenNombre = imagen.getOriginalFilename();
        Path imagePath = uploadDir.resolve(imagenNombre);
        Files.copy(imagen.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        // Guardamos el nombre de la imagen en el objeto AutoUsado
        autoUsado.setImagen("http://localhost:8080/uploads/" + imagenNombre);

        // Guardamos el auto usado en la base de datos
        AutoUsado autoGuardado = autousadoRepository.save(autoUsado);

        return ResponseEntity.ok(autoGuardado);  // Retornar el auto guardado
    }
















    // Actualizar un auto usado
    @PutMapping("/autos_usados/{id}")
    public ResponseEntity<AutoUsado> actualizarAutoUsado(@PathVariable Long id,
                                                         @RequestParam("auto") String autoJson,
                                                         @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        // Buscar el auto por ID
        AutoUsado autoUsado = autousadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El auto usado no existe con el ID: " + id));

        // Parsear el JSON para obtener los nuevos datos
        ObjectMapper objectMapper = new ObjectMapper();
        AutoUsado autoRequest = objectMapper.readValue(autoJson, AutoUsado.class);

        // Actualizar los campos del auto
        autoUsado.setMarca(autoRequest.getMarca());
        autoUsado.setModelo(autoRequest.getModelo());
        autoUsado.setYear(autoRequest.getYear());
        autoUsado.setPrecio(autoRequest.getPrecio());

        // Si se proporciona una nueva imagen, manejarla
        if (imagen != null && !imagen.isEmpty()) {
            // Crear el directorio uploads si no existe
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Obtener el nombre de la nueva imagen y moverla a la carpeta uploads
            String imagenNombre = imagen.getOriginalFilename();
            Path imagePath = uploadDir.resolve(imagenNombre);
            Files.copy(imagen.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

            // Actualizar la URL de la imagen en el objeto AutoUsado
            autoUsado.setImagen("http://localhost:8080/uploads/" + imagenNombre);
        }

        // Guardar el auto actualizado
        AutoUsado autoUsadoActualizado = autousadoRepository.save(autoUsado);

        // Devolver el auto actualizado
        return ResponseEntity.ok(autoUsadoActualizado);
    }

    // Eliminar un auto usado
    @DeleteMapping("/autos_usados/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarAutoUsado(@PathVariable Long id) {
        // Buscar el auto usado por ID
        AutoUsado autoUsado = autousadoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El auto usado no existe con el ID: " + id));

        // Eliminar el auto de la base de datos
        autousadoRepository.delete(autoUsado);

        // Responder con un mensaje de confirmación
        Map<String, Boolean> response = new HashMap<>();
        response.put("eliminado", Boolean.TRUE);
        return ResponseEntity.ok(response);
    }
}
