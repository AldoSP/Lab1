package com.udea.service;

import java.io.Serial;

public class SeatUnavailableException extends RuntimeException {

    @Serial
    private static final long serialVersionUID = 1L;

    public SeatUnavailableException() {
        super("Seat is not available");
    }
}
