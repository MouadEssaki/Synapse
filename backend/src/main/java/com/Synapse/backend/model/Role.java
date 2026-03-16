package com.Synapse.backend.model;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

public enum Role {

    ROLE_FREE,
    ROLE_PREMIUM;

    public List<SimpleGrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.name()));
    }
}