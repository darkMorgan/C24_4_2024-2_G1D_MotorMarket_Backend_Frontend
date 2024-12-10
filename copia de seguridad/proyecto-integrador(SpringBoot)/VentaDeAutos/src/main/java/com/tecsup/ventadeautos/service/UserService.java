package com.tecsup.ventadeautos.service;

import com.tecsup.ventadeautos.model.User;
import com.tecsup.ventadeautos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;




    // Método para autenticar usuario
    public User authenticate(String username, String password) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        // Comprobamos si el usuario existe y si la contraseña es correcta
        if (optionalUser.isPresent()){
            User user = optionalUser.get();
            if(user.getPassword().equals(password)){
                return user;// Si es válido, retornamos el User
            }
        }

        // Si no existe o la contraseña no es correcta, lanzamos una excepción o devolvemos null
        return null;
    }

    // Otros métodos del servicio, por ejemplo, para obtener el usuario por ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }






    public User registerUser(User user) {


        // Guardar el usuario en la base de datos
        return userRepository.save(user);
    }











}
