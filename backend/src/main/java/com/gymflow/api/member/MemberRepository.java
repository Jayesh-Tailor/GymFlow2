
package com.gymflow.api.member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface MemberRepository extends JpaRepository<Member, UUID> {

    List<Member> findAllByGymIdOrderByJoinedAtDescIdAsc(UUID gymId);

    Optional<Member> findByIdAndGymId(UUID id, UUID gymId);

    long countByGymId(UUID gymId);

    long countByGymIdAndExpiresAtBefore(
            UUID gymId,
            LocalDate date
    );

    long countByGymIdAndExpiresAtBetween(
            UUID gymId,
            LocalDate startDate,
            LocalDate endDate
    );
}
