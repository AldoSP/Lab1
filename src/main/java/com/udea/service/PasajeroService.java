package com.udea.service;

import com.udea.domain.Pasajero;
import com.udea.repository.PasajeroRepository;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.udea.domain.Pasajero}.
 */
@Service
@Transactional
public class PasajeroService {

    private static final Logger LOG = LoggerFactory.getLogger(PasajeroService.class);

    private final PasajeroRepository pasajeroRepository;

    public PasajeroService(PasajeroRepository pasajeroRepository) {
        this.pasajeroRepository = pasajeroRepository;
    }

    /**
     * Save a pasajero.
     *
     * @param pasajero the entity to save.
     * @return the persisted entity.
     */
    public Pasajero save(Pasajero pasajero) {
        LOG.debug("Request to save Pasajero : {}", pasajero);
        return pasajeroRepository.save(pasajero);
    }

    /**
     * Update a pasajero.
     *
     * @param pasajero the entity to save.
     * @return the persisted entity.
     */
    public Pasajero update(Pasajero pasajero) {
        LOG.debug("Request to update Pasajero : {}", pasajero);
        return pasajeroRepository.save(pasajero);
    }

    /**
     * Partially update a pasajero.
     *
     * @param pasajero the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Pasajero> partialUpdate(Pasajero pasajero) {
        LOG.debug("Request to partially update Pasajero : {}", pasajero);

        return pasajeroRepository
            .findById(pasajero.getId())
            .map(existingPasajero -> {
                updateIfPresent(existingPasajero::setNombre, pasajero.getNombre());
                updateIfPresent(existingPasajero::setApellido, pasajero.getApellido());
                updateIfPresent(existingPasajero::setEmail, pasajero.getEmail());
                updateIfPresent(existingPasajero::setTelefono, pasajero.getTelefono());
                updateIfPresent(existingPasajero::setFechaNacimiento, pasajero.getFechaNacimiento());

                return existingPasajero;
            })
            .map(pasajeroRepository::save);
    }

    /**
     * Get all the pasajeros.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Pasajero> findAll(Pageable pageable) {
        LOG.debug("Request to get all Pasajeros");
        return pasajeroRepository.findAll(pageable);
    }

    /**
     * Get one pasajero by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Pasajero> findOne(Long id) {
        LOG.debug("Request to get Pasajero : {}", id);
        return pasajeroRepository.findById(id);
    }

    /**
     * Delete the pasajero by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Pasajero : {}", id);
        pasajeroRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
