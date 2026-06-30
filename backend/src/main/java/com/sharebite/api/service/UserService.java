package com.sharebite.api.service;

import com.sharebite.api.dto.RegisterRequest;
import com.sharebite.api.model.Role;
import com.sharebite.api.model.User;
import com.sharebite.api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username is already taken.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered.");
        }

        Role role;
        try {
            role = Role.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid role. Role must be ROLE_DONOR or ROLE_RECIPIENT.");
        }

        // Encrypt the password using BCrypt
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        String businessName = null;
        if (role == Role.ROLE_DONOR) {
            businessName = request.getBusinessName();
            if (businessName == null || businessName.trim().isEmpty()) {
                businessName = request.getUsername() + "'s Food Spot";
            }
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                encodedPassword,
                role,
                businessName
        );

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        return userRepository.findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail));
    }
}
