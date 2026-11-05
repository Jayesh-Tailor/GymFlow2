
package com.gymflow.api.dashboard;

public record DashboardSummaryResponse(
        long totalMembers,
        long activeMembers,
        long expiringMembers,
        long expiredMembers
) {
}
