import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getAsientos } from 'app/entities/asiento/asiento.reducer';
import { getEntities as getPasajeros } from 'app/entities/pasajero/pasajero.reducer';
import { getEntities as getVuelos } from 'app/entities/vuelo/vuelo.reducer';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './reserva.reducer';

export const ReservaUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const vuelos = useAppSelector(state => state.vuelo.entities);
  const asientos = useAppSelector(state => state.asiento.entities);
  const pasajeros = useAppSelector(state => state.pasajero.entities);
  const reservaEntity = useAppSelector(state => state.reserva.entity);
  const loading = useAppSelector(state => state.reserva.loading);
  const updating = useAppSelector(state => state.reserva.updating);
  const updateSuccess = useAppSelector(state => state.reserva.updateSuccess);

  const handleClose = () => {
    navigate(`/reserva${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getVuelos({}));
    dispatch(getAsientos({}));
    dispatch(getPasajeros({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.fechaReserva = convertDateTimeToServer(values.fechaReserva);

    const entity = {
      ...reservaEntity,
      ...values,
      vuelo: vuelos.find(it => it.id.toString() === values.vuelo?.toString()),
      asiento: asientos.find(it => it.id.toString() === values.asiento?.toString()),
      pasajero: pasajeros.find(it => it.id.toString() === values.pasajero?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          fechaReserva: displayDefaultDateTime(),
        }
      : {
          ...reservaEntity,
          fechaReserva: convertDateTimeFromServer(reservaEntity.fechaReserva),
          vuelo: reservaEntity?.vuelo?.id,
          asiento: reservaEntity?.asiento?.id,
          pasajero: reservaEntity?.pasajero?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jhipster2026App.reserva.home.createOrEditLabel" data-cy="ReservaCreateUpdateHeading">
            <Translate contentKey="jhipster2026App.reserva.home.createOrEditLabel">Create or edit a Reserva</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm mode="all" defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew && (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="reserva-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('jhipster2026App.reserva.codigo')}
                id="reserva-codigo"
                name="codigo"
                data-cy="codigo"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.reserva.fechaReserva')}
                id="reserva-fechaReserva"
                name="fechaReserva"
                data-cy="fechaReserva"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.reserva.estado')}
                id="reserva-estado"
                name="estado"
                data-cy="estado"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                id="reserva-vuelo"
                name="vuelo"
                data-cy="vuelo"
                label={translate('jhipster2026App.reserva.vuelo')}
                type="select"
              >
                <option value="" key="0" />
                {vuelos
                  ? vuelos.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="reserva-asiento"
                name="asiento"
                data-cy="asiento"
                label={translate('jhipster2026App.reserva.asiento')}
                type="select"
              >
                <option value="" key="0" />
                {asientos
                  ? asientos.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="reserva-pasajero"
                name="pasajero"
                data-cy="pasajero"
                label={translate('jhipster2026App.reserva.pasajero')}
                type="select"
              >
                <option value="" key="0" />
                {pasajeros
                  ? pasajeros.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/reserva" replace variant="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button variant="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ReservaUpdate;
