package com.tecsup.ventadeautos.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecsup.ventadeautos.excepciones.ResourceNotFoundException;
import com.tecsup.ventadeautos.model.Auto;
import com.tecsup.ventadeautos.repository.AutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;



import org.springframework.web.multipart.MultipartFile;

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
@RequestMapping("/api/v1")  // Punto de entrada para la API de Autos
public class AutoController {

    @Autowired
    private AutoRepository autoRepository;  // Inyectamos el repositorio de Auto




    // Obtener todos los autos
    @GetMapping("/autos")
    public List<Auto> listarAutos() {
        System.out.println("Consultando los autos...");
        return autoRepository.findAll();
    }

    @GetMapping("/autos/{id}")
    public Map<String, Object> obtenerAutoPorId(@PathVariable Long id) {
        System.out.println("Consultando auto con ID: " + id);

        // Obtener el auto desde la base de datos
        Auto auto = autoRepository.findById(id).orElse(null);

        Map<String, Object> response = new HashMap<>();

        if (auto != null) {
            // Verificar si la imagen ya tiene el prefijo completo "http://localhost:8080/uploads/"
            String imagenUrl = auto.getImagen();
            if (!imagenUrl.startsWith("http://localhost:8080/uploads/")) {
                imagenUrl = "http://localhost:8080/uploads/" + imagenUrl;
            }
            auto.setImagen(imagenUrl);  // Establecer la URL de la imagen en el objeto auto
            response.put("auto", auto);  // Retornar el auto con la URL de la imagen
        } else {
            response.put("auto", null);  // Si el auto no se encuentra, poner null
        }

        return response;
    }


















    // Guardar un nuevo auto
    @PostMapping("/autos")
    public Auto guardarAuto(@RequestParam("auto") String autoJson,
                            @RequestParam("imagen") MultipartFile imagen) throws IOException {
        // Parseamos el JSON para obtener los datos del auto
        ObjectMapper objectMapper = new ObjectMapper();
        Auto auto = objectMapper.readValue(autoJson, Auto.class);

        // Crear el directorio uploads si no existe
        Path uploadDir = Paths.get("uploads");
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Obtener el nombre de la imagen y moverla a la carpeta uploads
        String imagenNombre = imagen.getOriginalFilename();
        Path imagePath = uploadDir.resolve(imagenNombre);
        Files.copy(imagen.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);

        // Guardamos el nombre de la imagen en el objeto Auto
        auto.setImagen("http://localhost:8080/uploads/" + imagenNombre);

        // Guardamos el auto en la base de datos
        return autoRepository.save(auto);
    }

























    // Actualizar un auto por su id
    @PutMapping("/autos/{id}")
    public ResponseEntity<Auto> actualizarAuto(@PathVariable Long id,
                                               @RequestParam("auto") String autoJson,
                                               @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        // Buscar el auto por id y lanzar excepción si no lo encuentra
        Auto auto = autoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El auto no existe con el id: " + id));

        // Parsear el JSON para obtener los nuevos datos del auto
        ObjectMapper objectMapper = new ObjectMapper();
        Auto autoRequest = objectMapper.readValue(autoJson, Auto.class);

        // Actualizar los campos del auto con los datos de autoRequest
        auto.setMarca(autoRequest.getMarca());
        auto.setModelo(autoRequest.getModelo());
        auto.setYear(autoRequest.getYear());

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

            // Guardar la URL de la nueva imagen en el objeto Auto
            auto.setImagen("http://localhost:8080/uploads/" + imagenNombre);
        }

        // Guardar el auto actualizado en la base de datos
        Auto autoActualizado = autoRepository.save(auto);

        // Devolver el auto actualizado
        return ResponseEntity.ok(autoActualizado);
    }

    // Eliminar un auto por su id
    @DeleteMapping("/autos/{id}")
    public ResponseEntity<Map<String, Boolean>> eliminarAuto(@PathVariable Long id) {
        // Buscar el auto por id y lanzar excepción si no lo encuentra
        Auto auto = autoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("El auto no existe con el id: " + id));

        // Eliminar el auto de la base de datos
        autoRepository.delete(auto);

        // Responder con un mensaje de confirmación
        Map<String, Boolean> response = new HashMap<>();
        response.put("eliminado", Boolean.TRUE);  // Indicamos que fue eliminado
        return ResponseEntity.ok(response);
    }
}


