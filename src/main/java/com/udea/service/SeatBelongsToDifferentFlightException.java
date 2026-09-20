package com.udea.service;

import java.io.Serial;

public class SeatBelongsToDifferentFlightException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public SeatBelongsToDifferentFlightException() {
        super("Seat belongs to a different flight");
    }
}
