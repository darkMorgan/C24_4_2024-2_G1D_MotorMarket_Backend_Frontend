package com.tecsup.ventadeautos.repository;

import com.tecsup.ventadeautos.model.Auto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AutoRepository extends JpaRepository<Auto, Long> {
    // Métodos CRUD automáticos, se pueden agregar más métodos personalizados si se necesitan.
}

