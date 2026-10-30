package com.gymflow.api.member;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateMemberRequest(
        @NotBlank @Size(max = 80) String name,
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(max = 24) String phone,
        @NotBlank @Pattern(regexp = "Flex Monthly|Strength Plus|Elite Annual") String plan,
        @NotNull @FutureOrPresent LocalDate expiresAt
) {
}
