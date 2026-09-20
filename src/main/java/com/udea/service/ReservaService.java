package com.udea.service;

import com.udea.domain.Reserva;
import com.udea.repository.AsientoRepository;
import com.udea.repository.ReservaRepository;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.udea.domain.Reserva}.
 */
@Service
@Transactional
public class ReservaService {

    private static final Logger LOG = LoggerFactory.getLogger(ReservaService.class);

    private final ReservaRepository reservaRepository;

    private final AsientoRepository asientoRepository;

    public ReservaService(ReservaRepository reservaRepository, AsientoRepository asientoRepository) {
        this.reservaRepository = reservaRepository;
        this.asientoRepository = asientoRepository;
    }

    /**
     * Save a reserva.
     *
     * @param reserva the entity to save.
     * @return the persisted entity.
     */
    public Reserva save(Reserva reserva) {
        LOG.debug("Request to save Reserva : {}", reserva);
        if (reserva.getAsiento() != null && !Boolean.TRUE.equals(reserva.getAsiento().getDisponible())) {
            throw new SeatUnavailableException();
        }
        if (
            reserva.getAsiento() != null &&
            reserva.getAsiento().getVuelo() != null &&
            reserva.getVuelo() != null &&
            !Objects.equals(reserva.getAsiento().getVuelo().getId(), reserva.getVuelo().getId())
        ) {
            throw new SeatBelongsToDifferentFlightException();
        }
        if (reserva.getAsiento() != null) {
            reserva.getAsiento().setDisponible(false);
            asientoRepository.save(reserva.getAsiento());
        }
        return reservaRepository.save(reserva);
    }

    /**
     * Update a reserva.
     *
     * @param reserva the entity to save.
     * @return the persisted entity.
     */
    public Reserva update(Reserva reserva) {
        LOG.debug("Request to update Reserva : {}", reserva);
        return reservaRepository.save(reserva);
    }

    /**
     * Partially update a reserva.
     *
     * @param reserva the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Reserva> partialUpdate(Reserva reserva) {
        LOG.debug("Request to partially update Reserva : {}", reserva);

        return reservaRepository
            .findById(reserva.getId())
            .map(existingReserva -> {
                updateIfPresent(existingReserva::setCodigo, reserva.getCodigo());
                updateIfPresent(existingReserva::setFechaReserva, reserva.getFechaReserva());
                updateIfPresent(existingReserva::setEstado, reserva.getEstado());

                return existingReserva;
            })
            .map(reservaRepository::save);
    }

    /**
     * Get all the reservas.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Reserva> findAll(Pageable pageable) {
        LOG.debug("Request to get all Reservas");
        return reservaRepository.findAll(pageable);
    }

    /**
     * Get one reserva by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Reserva> findOne(Long id) {
        LOG.debug("Request to get Reserva : {}", id);
        return reservaRepository.findById(id);
    }

    /**
     * Delete the reserva by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Reserva : {}", id);
        reservaRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
