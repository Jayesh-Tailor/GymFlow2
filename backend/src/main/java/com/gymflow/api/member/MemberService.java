package com.gymflow.api.member;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@Transactional
public class MemberService {
    
    private static final List<String> AVATAR_COLORS = List.of("mint", "peach", "lavender", "blue", "yellow", "rose");

    private final MemberRepository memberRepository;
    private final Clock clock;

    public MemberService(MemberRepository memberRepository, Clock clock) {
        this.memberRepository = memberRepository;
        this.clock = clock;
    }

    public MemberResponse create(UUID gymId, CreateMemberRequest request) {
        Member member = Member.create(
                gymId,
                request.name().trim(),
                request.email().trim(),
                request.phone().trim(),
                request.plan(),
                LocalDate.now(clock),
                request.expiresAt()
        );
        return toResponse(memberRepository.save(member));
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> list(UUID gymId) {
        return memberRepository.findAllByGymIdOrderByJoinedAtDescIdAsc(gymId).stream()
                .map(this::toResponse)
                .toList();
    }

    private MemberResponse toResponse(Member member) {
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(clock), member.getExpiresAt());
        String status = daysRemaining < 0 ? "Expired" : daysRemaining <= 7 ? "Expiring soon" : "Active";
        String initials = java.util.Arrays.stream(member.getName().trim().split("\\s+"))
                .limit(2)
                .map(part -> part.substring(0, 1).toUpperCase(Locale.ROOT))
                .reduce("", String::concat);
        String color = AVATAR_COLORS.get(Math.floorMod(member.getId().hashCode(), AVATAR_COLORS.size()));

        return new MemberResponse(
                member.getId(),
                member.getName(),
                member.getEmail(),
                member.getPhone(),
                member.getPlan(),
                member.getJoinedAt(),
                member.getExpiresAt(),
                status,
                initials,
                color
        );
    }
}
