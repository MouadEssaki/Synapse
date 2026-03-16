package com.Synapse.backend.controller;

import com.Synapse.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(Map.of(
            "id",        user.getId(),
            "email",     user.getEmail(),
            "role",      user.getRole(),
            "createdAt", user.getCreatedAt()
        ));
    }
}