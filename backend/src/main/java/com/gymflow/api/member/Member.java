package com.gymflow.api.member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "members")
public class Member {

    public void updateDetails(
            String name,
            String email,
            String phone,
            String plan,
            LocalDate expiresAt
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.plan = plan;
        this.expiresAt = expiresAt;
    }

    @Id
    private UUID id;

    @Column(name = "gym_id", nullable = false, updatable = false)
    private UUID gymId;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(nullable = false, length = 120)
    private String email;

    @Column(nullable = false, length = 24)
    private String phone;

    @Column(nullable = false, length = 32)
    private String plan;

    @Column(name = "joined_at", nullable = false)
    private LocalDate joinedAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDate expiresAt;

    protected Member() {
    }

    private Member(UUID gymId, String name, String email, String phone, String plan, LocalDate joinedAt,
                   LocalDate expiresAt) {
        this.id = UUID.randomUUID();
        this.gymId = gymId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.plan = plan;
        this.joinedAt = joinedAt;
        this.expiresAt = expiresAt;
    }

    public static Member create(UUID gymId, String name, String email, String phone, String plan, LocalDate joinedAt,
                                LocalDate expiresAt) {
        return new Member(gymId, name, email, phone, plan, joinedAt, expiresAt);
    }

    public UUID getId() {
        return id;
    }

    public UUID getGymId() {
        return gymId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getPlan() {
        return plan;
    }

    public LocalDate getJoinedAt() {
        return joinedAt;
    }

    public LocalDate getExpiresAt() {
        return expiresAt;
    }
}
