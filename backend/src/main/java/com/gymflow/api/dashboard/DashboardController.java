
package com.gymflow.api.dashboard;

import com.gymflow.api.security.GymIdResolver;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final GymIdResolver gymIdResolver;

    public DashboardController(
            DashboardService dashboardService,
            GymIdResolver gymIdResolver
    ) {
        this.dashboardService = dashboardService;
        this.gymIdResolver = gymIdResolver;
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(
            @AuthenticationPrincipal Jwt jwt
    ) {
        return dashboardService.getSummary(
                gymIdResolver.requireGymId(jwt)
        );
    }
}
