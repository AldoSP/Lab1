import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './reserva.reducer';

export const ReservaDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id!));
  }, []);

  const reservaEntity = useAppSelector(state => state.reserva.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="reservaDetailsHeading">
          <Translate contentKey="jhipster2026App.reserva.detail.title">Reserva</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{reservaEntity.id}</dd>
          <dt>
            <span id="codigo">
              <Translate contentKey="jhipster2026App.reserva.codigo">Codigo</Translate>
            </span>
          </dt>
          <dd>{reservaEntity.codigo}</dd>
          <dt>
            <span id="fechaReserva">
              <Translate contentKey="jhipster2026App.reserva.fechaReserva">Fecha Reserva</Translate>
            </span>
          </dt>
          <dd>
            {reservaEntity.fechaReserva ? <TextFormat value={reservaEntity.fechaReserva} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="estado">
              <Translate contentKey="jhipster2026App.reserva.estado">Estado</Translate>
            </span>
          </dt>
          <dd>{reservaEntity.estado}</dd>
          <dt>
            <Translate contentKey="jhipster2026App.reserva.vuelo">Vuelo</Translate>
          </dt>
          <dd>{reservaEntity.vuelo ? reservaEntity.vuelo.id : ''}</dd>
          <dt>
            <Translate contentKey="jhipster2026App.reserva.asiento">Asiento</Translate>
          </dt>
          <dd>{reservaEntity.asiento ? reservaEntity.asiento.id : ''}</dd>
          <dt>
            <Translate contentKey="jhipster2026App.reserva.pasajero">Pasajero</Translate>
          </dt>
          <dd>{reservaEntity.pasajero ? reservaEntity.pasajero.id : ''}</dd>
        </dl>
        <Button as={Link as any} to="/reserva" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/reserva/${reservaEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ReservaDetail;
