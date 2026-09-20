package com.udea.service;

import com.udea.domain.Vuelo;
import com.udea.repository.VueloRepository;
import java.util.Optional;
import java.util.function.Consumer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.udea.domain.Vuelo}.
 */
@Service
@Transactional
public class VueloService {

    private static final Logger LOG = LoggerFactory.getLogger(VueloService.class);

    private final VueloRepository vueloRepository;

    public VueloService(VueloRepository vueloRepository) {
        this.vueloRepository = vueloRepository;
    }

    /**
     * Save a vuelo.
     *
     * @param vuelo the entity to save.
     * @return the persisted entity.
     */
    public Vuelo save(Vuelo vuelo) {
        LOG.debug("Request to save Vuelo : {}", vuelo);
        return vueloRepository.save(vuelo);
    }

    /**
     * Update a vuelo.
     *
     * @param vuelo the entity to save.
     * @return the persisted entity.
     */
    public Vuelo update(Vuelo vuelo) {
        LOG.debug("Request to update Vuelo : {}", vuelo);
        return vueloRepository.save(vuelo);
    }

    /**
     * Partially update a vuelo.
     *
     * @param vuelo the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Vuelo> partialUpdate(Vuelo vuelo) {
        LOG.debug("Request to partially update Vuelo : {}", vuelo);

        return vueloRepository
            .findById(vuelo.getId())
            .map(existingVuelo -> {
                updateIfPresent(existingVuelo::setNumeroVuelo, vuelo.getNumeroVuelo());
                updateIfPresent(existingVuelo::setOrigen, vuelo.getOrigen());
                updateIfPresent(existingVuelo::setDestino, vuelo.getDestino());
                updateIfPresent(existingVuelo::setFechaSalida, vuelo.getFechaSalida());
                updateIfPresent(existingVuelo::setFechaLlegada, vuelo.getFechaLlegada());

                return existingVuelo;
            })
            .map(vueloRepository::save);
    }

    /**
     * Get all the vuelos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<Vuelo> findAll(Pageable pageable) {
        LOG.debug("Request to get all Vuelos");
        return vueloRepository.findAll(pageable);
    }

    /**
     * Get one vuelo by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Vuelo> findOne(Long id) {
        LOG.debug("Request to get Vuelo : {}", id);
        return vueloRepository.findById(id);
    }

    /**
     * Delete the vuelo by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Vuelo : {}", id);
        vueloRepository.deleteById(id);
    }

    private <T> void updateIfPresent(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }
}
