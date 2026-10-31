
package com.gymflow.api.security;

import com.gymflow.api.error.InvalidGymClaimException;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class GymIdResolver {

    private static final UUID DEV_GYM_ID =
            UUID.fromString("11111111-1111-1111-1111-111111111111");

    private final Environment environment;

    public GymIdResolver(Environment environment) {
        this.environment = environment;
    }

    public UUID requireGymId(Jwt jwt) {

        // Local development only: allow requests without a JWT.
        if (jwt == null && environment.acceptsProfiles(Profiles.of("dev"))) {
            return DEV_GYM_ID;
        }

        // Production and authenticated requests must provide a valid JWT.
        if (jwt == null) {
            throw new InvalidGymClaimException();
        }

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
