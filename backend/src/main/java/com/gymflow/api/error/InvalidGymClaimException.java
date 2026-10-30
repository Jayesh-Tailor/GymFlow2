package com.gymflow.api.error;

public class InvalidGymClaimException extends RuntimeException {
    public InvalidGymClaimException() {
        super("The authenticated account does not contain a valid gym_id claim.");
    }
}
