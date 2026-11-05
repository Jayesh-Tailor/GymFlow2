
package com.gymflow.api.dashboard;

import com.gymflow.api.member.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class DashboardService {

    private final MemberRepository memberRepository;
    private final Clock clock;

    public DashboardService(
            MemberRepository memberRepository,
            Clock clock
    ) {
        this.memberRepository = memberRepository;
        this.clock = clock;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(UUID gymId) {

        LocalDate today = LocalDate.now(clock);
        LocalDate nextSevenDays = today.plusDays(7);

        long totalMembers =
                memberRepository.countByGymId(gymId);

        long expiredMembers =
                memberRepository.countByGymIdAndExpiresAtBefore(
                        gymId, today
                );

        long expiringMembers =
                memberRepository.countByGymIdAndExpiresAtBetween(
                        gymId, today, nextSevenDays
                );

        long activeMembers =
                totalMembers - expiredMembers - expiringMembers;

        return new DashboardSummaryResponse(
                totalMembers,
                activeMembers,
                expiringMembers,
                expiredMembers
        );
    }
}
