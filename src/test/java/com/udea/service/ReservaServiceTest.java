package com.udea.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.udea.domain.Asiento;
import com.udea.domain.Reserva;
import com.udea.domain.Vuelo;
import com.udea.repository.AsientoRepository;
import com.udea.repository.ReservaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ReservaServiceTest {

    @Mock
    private ReservaRepository reservaRepository;

    @Mock
    private AsientoRepository asientoRepository;

    @InjectMocks
    private ReservaService reservaService;

    @Test
    void saveRejectsUnavailableSeat() {
        Asiento asiento = new Asiento().disponible(false);
        Reserva reserva = new Reserva().asiento(asiento);

        assertThatThrownBy(() -> reservaService.save(reserva))
            .isInstanceOf(SeatUnavailableException.class)
            .hasMessageContaining("Seat is not available");
    }

    @Test
    void saveMarksSeatUnavailable() {
        Asiento asiento = new Asiento().disponible(true);
        Reserva reserva = new Reserva().asiento(asiento);
        when(reservaRepository.save(reserva)).thenReturn(reserva);

        reservaService.save(reserva);

        verify(asientoRepository).save(asiento);
        verify(reservaRepository).save(reserva);
    }

    @Test
    void saveRejectsSeatFromDifferentFlight() {
        Vuelo reservedFlight = new Vuelo().id(1L);
        Vuelo seatFlight = new Vuelo().id(2L);
        Asiento asiento = new Asiento().disponible(true).vuelo(seatFlight);
        Reserva reserva = new Reserva().asiento(asiento).vuelo(reservedFlight);

        assertThatThrownBy(() -> reservaService.save(reserva))
            .isInstanceOf(SeatBelongsToDifferentFlightException.class)
            .hasMessageContaining("Seat belongs to a different flight");
    }
}
