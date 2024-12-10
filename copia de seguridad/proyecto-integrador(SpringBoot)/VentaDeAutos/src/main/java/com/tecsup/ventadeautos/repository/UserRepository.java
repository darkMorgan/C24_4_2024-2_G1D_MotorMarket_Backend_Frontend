package com.tecsup.ventadeautos.repository;

import com.tecsup.ventadeautos.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);

    Optional<User> findByUsername(String username);
    // JpaRepository ya tiene métodos como findById(), save(), delete(), etc.
}
