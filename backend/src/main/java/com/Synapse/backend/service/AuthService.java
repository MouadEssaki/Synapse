package com.Synapse.backend.service;

import com.Synapse.backend.dto.auth.AuthResponse;
import com.Synapse.backend.dto.auth.LoginRequest;
import com.Synapse.backend.dto.auth.RefreshRequest;
import com.Synapse.backend.dto.auth.RegisterRequest;
import com.Synapse.backend.model.RefreshToken;
import com.Synapse.backend.model.Role;
import com.Synapse.backend.model.User;
import com.Synapse.backend.repository.RefreshTokenRepository;
import com.Synapse.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    // ── Register ──────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                HttpStatus.CONFLICT, "Email already in use"
            );
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_FREE)
                .build();

        userRepository.save(user);

        return buildAuthResponse(user);
    }

    // ── Login ─────────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
            )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found"
                ));

        return buildAuthResponse(user);
    }

    // ── Refresh ───────────────────────────────────────────────────────────

    @Transactional
    public AuthResponse refresh(RefreshRequest request) {
        RefreshToken existing = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Invalid refresh token"
                ));

        if (existing.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(existing);
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Refresh token expired"
            );
        }

        User user = existing.getUser();

        // Rotation : delete old, issue new
        refreshTokenRepository.delete(existing);

        return buildAuthResponse(user);
    }

    // ── Logout ────────────────────────────────────────────────────────────

    @Transactional
    public void logout(RefreshRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(refreshTokenRepository::delete);
    }

    // ── Internal ──────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        String accessToken  = jwtService.generateAccessToken(user.getId());
        String refreshToken = createRefreshToken(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    private String createRefreshToken(User user) {
        // Delete any existing token for this user (one active token per user)
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .user(user)
                .build();

        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }
}