package com.tecsup.ventadeautos.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    // Constructor para inyección de dependencias
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()

                .requestMatchers("/api/v1/autos/{id}").permitAll()// Proteger los endpoints de autos
                .requestMatchers("/api/v1/login", "/api/v1/usuarios","/api/v1/autos","/api/v1/autos_usados").permitAll()  // Permitir el acceso a login y registro
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);  // Registrar el filtro JWT

        // No necesitamos deshabilitar CSRF explícitamente si estamos trabajando con JWT
        http.csrf().disable();  // Deshabilitar CSRF solo si es necesario, por ejemplo, en una API REST sin formularios

        return http.build();
    }



}
