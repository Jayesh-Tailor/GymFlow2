package com.gymflow.api.security;

import com.gymflow.api.error.InvalidGymClaimException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class GymIdResolver {
    public UUID requireGymId(Jwt jwt) {
        Object rawClaim = jwt.getClaims().get("gym_id");
        if (!(rawClaim instanceof String claim) || claim.isBlank()) {
            throw new InvalidGymClaimException();
        }
        try {
            return UUID.fromString(claim);
        } catch (IllegalArgumentException exception) {
            throw new InvalidGymClaimException();
        }
    }
}
