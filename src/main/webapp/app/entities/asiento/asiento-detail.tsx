import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate } from 'react-jhipster';
import { Link, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './asiento.reducer';

export const AsientoDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id!));
  }, []);

  const asientoEntity = useAppSelector(state => state.asiento.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="asientoDetailsHeading">
          <Translate contentKey="jhipster2026App.asiento.detail.title">Asiento</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{asientoEntity.id}</dd>
          <dt>
            <span id="numero">
              <Translate contentKey="jhipster2026App.asiento.numero">Numero</Translate>
            </span>
          </dt>
          <dd>{asientoEntity.numero}</dd>
          <dt>
            <span id="clase">
              <Translate contentKey="jhipster2026App.asiento.clase">Clase</Translate>
            </span>
          </dt>
          <dd>{asientoEntity.clase}</dd>
          <dt>
            <span id="disponible">
              <Translate contentKey="jhipster2026App.asiento.disponible">Disponible</Translate>
            </span>
          </dt>
          <dd>{asientoEntity.disponible ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="jhipster2026App.asiento.vuelo">Vuelo</Translate>
          </dt>
          <dd>{asientoEntity.vuelo ? asientoEntity.vuelo.id : ''}</dd>
        </dl>
        <Button as={Link as any} to="/asiento" replace variant="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button as={Link as any} to={`/asiento/${asientoEntity.id}/edit`} replace variant="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AsientoDetail;
