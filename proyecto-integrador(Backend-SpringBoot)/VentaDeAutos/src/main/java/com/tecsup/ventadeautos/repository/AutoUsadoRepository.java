package com.tecsup.ventadeautos.repository;


import com.tecsup.ventadeautos.model.AutoUsado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutoUsadoRepository extends JpaRepository<AutoUsado, Long> {

    List<AutoUsado> findByUserUsername(String username);
}
