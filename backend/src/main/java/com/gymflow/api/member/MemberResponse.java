package com.gymflow.api.member;

import java.time.LocalDate;
import java.util.UUID;

public record MemberResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String plan,
        LocalDate joinedAt,
        LocalDate expiresAt,
        String status,
        String initials,
        String color
) {
}
