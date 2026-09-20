import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntities as getVuelos } from 'app/entities/vuelo/vuelo.reducer';

import { createEntity, getEntity, reset, updateEntity } from './asiento.reducer';

export const AsientoUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const vuelos = useAppSelector(state => state.vuelo.entities);
  const asientoEntity = useAppSelector(state => state.asiento.entity);
  const loading = useAppSelector(state => state.asiento.loading);
  const updating = useAppSelector(state => state.asiento.updating);
  const updateSuccess = useAppSelector(state => state.asiento.updateSuccess);

  const handleClose = () => {
    navigate(`/asiento${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getVuelos({}));
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

    const entity = {
      ...asientoEntity,
      ...values,
      vuelo: vuelos.find(it => it.id.toString() === values.vuelo?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...asientoEntity,
          vuelo: asientoEntity?.vuelo?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jhipster2026App.asiento.home.createOrEditLabel" data-cy="AsientoCreateUpdateHeading">
            <Translate contentKey="jhipster2026App.asiento.home.createOrEditLabel">Create or edit a Asiento</Translate>
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
                  id="asiento-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('jhipster2026App.asiento.numero')}
                id="asiento-numero"
                name="numero"
                data-cy="numero"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.asiento.clase')}
                id="asiento-clase"
                name="clase"
                data-cy="clase"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.asiento.disponible')}
                id="asiento-disponible"
                name="disponible"
                data-cy="disponible"
                check
                type="checkbox"
              />
              <ValidatedField
                id="asiento-vuelo"
                name="vuelo"
                data-cy="vuelo"
                label={translate('jhipster2026App.asiento.vuelo')}
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
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/asiento" replace variant="info">
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

export default AsientoUpdate;
