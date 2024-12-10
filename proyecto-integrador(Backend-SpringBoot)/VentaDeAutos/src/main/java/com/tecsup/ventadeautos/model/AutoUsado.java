package com.tecsup.ventadeautos.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "autos_usados")
public class AutoUsado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;


    @Column(name = "propietario")
    private String propietario;


    @Column(name = "marca")
    private String marca;

    @Column(name = "modelo")
    private String modelo;

    @Column(name = "year")
    private int year;

    @Column(name = "precio")
    private Double precio;

    @Column(name = "imagen")
    private String imagen;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")  // La columna que hace la relación con la tabla usuarios
    @JsonBackReference
    private User user;


}

