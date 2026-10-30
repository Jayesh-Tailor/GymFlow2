package com.gymflow.api.member;

import com.gymflow.api.security.GymIdResolver;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/members")
public class MemberController {
    private final MemberService memberService;
    private final GymIdResolver gymIdResolver;

    public MemberController(MemberService memberService, GymIdResolver gymIdResolver) {
        this.memberService = memberService;
        this.gymIdResolver = gymIdResolver;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody CreateMemberRequest request
    ) {
        return memberService.create(gymIdResolver.requireGymId(jwt), request);
    }

    @GetMapping
    public List<MemberResponse> list(@AuthenticationPrincipal Jwt jwt) {
        return memberService.list(gymIdResolver.requireGymId(jwt));
    }
}
