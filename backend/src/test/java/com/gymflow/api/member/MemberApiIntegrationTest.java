package com.gymflow.api.member;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MemberApiIntegrationTest {
    private static final UUID GYM_ONE = UUID.fromString("6a62cf19-0120-4b9e-8975-a4cb68fcc307");
    private static final UUID GYM_TWO = UUID.fromString("6a62cf19-0120-4b9e-8975-a4cb68fcc308");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @BeforeEach
    void clearMembers() {
        memberRepository.deleteAll();
    }

    @Test
    void createsMemberForAuthenticatedGymAndPersistsIt() throws Exception {
        String request = """
                {
                  "name": "  Devika Rao  ",
                  "email": "devika.rao@email.com",
                  "phone": "+91 98765 00000",
                  "plan": "Elite Annual",
                  "expiresAt": "%s",
                  "gymId": "%s"
                }
                """.formatted(LocalDate.now().plusDays(60), GYM_TWO);

        mockMvc.perform(post("/api/members")
                        .with(jwt().jwt(token -> token.claim("gym_id", GYM_ONE.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.name").value("Devika Rao"))
                .andExpect(jsonPath("$.initials").value("DR"))
                .andExpect(jsonPath("$.status").value("Active"));

        var storedMembers = memberRepository.findAllByGymIdOrderByJoinedAtDescIdAsc(GYM_ONE);
        assertThat(storedMembers).hasSize(1);
        assertThat(storedMembers.getFirst().getName()).isEqualTo("Devika Rao");
        assertThat(storedMembers.getFirst().getGymId()).isEqualTo(GYM_ONE);
        assertThat(memberRepository.findAllByGymIdOrderByJoinedAtDescIdAsc(GYM_TWO)).isEmpty();
    }

    @Test
    void rejectsInvalidInputWithConsistentValidationError() throws Exception {
        String request = """
                {
                  "name": " ",
                  "email": "not-an-email",
                  "phone": "+91 98765 00000",
                  "plan": "Unknown plan",
                  "expiresAt": "%s"
                }
                """.formatted(LocalDate.now().minusDays(1));

        mockMvc.perform(post("/api/members")
                        .with(jwt().jwt(token -> token.claim("gym_id", GYM_ONE.toString())))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.fieldErrors.name").exists())
                .andExpect(jsonPath("$.fieldErrors.email").exists())
                .andExpect(jsonPath("$.fieldErrors.plan").exists())
                .andExpect(jsonPath("$.fieldErrors.expiresAt").exists());

        assertThat(memberRepository.findAllByGymIdOrderByJoinedAtDescIdAsc(GYM_ONE)).isEmpty();
    }

    @Test
    void returnsEmptyListWhenAuthenticatedGymHasNoMembers() throws Exception {
        mockMvc.perform(get("/api/members")
                        .with(jwt().jwt(token -> token.claim("gym_id", GYM_ONE.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void listsOnlyMembersForAuthenticatedGym() throws Exception {
        memberRepository.save(Member.create(
                GYM_ONE, "Member One", "one@example.com", "+1 555 0101", "Flex Monthly",
                LocalDate.now(), LocalDate.now().plusDays(30)));
        memberRepository.save(Member.create(
                GYM_TWO, "Member Two", "two@example.com", "+1 555 0102", "Flex Monthly",
                LocalDate.now(), LocalDate.now().plusDays(30)));

        mockMvc.perform(get("/api/members")
                        .with(jwt().jwt(token -> token.claim("gym_id", GYM_ONE.toString()))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("Member One"));
    }

    @Test
    void rejectsAuthenticatedTokenWithoutValidGymClaim() throws Exception {
        mockMvc.perform(get("/api/members").with(jwt()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.fieldErrors").isEmpty());

        mockMvc.perform(get("/api/members")
                        .with(jwt().jwt(token -> token.claim("gym_id", "not-a-uuid"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));

        mockMvc.perform(get("/api/members")
                        .with(jwt().jwt(token -> token.claim("gym_id", 42))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    void rejectsRequestsWithoutBearerAuthentication() throws Exception {
        mockMvc.perform(get("/api/members"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }
}
