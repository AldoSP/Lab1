import React, { useEffect } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { Link, useNavigate, useParams } from 'react-router';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';

import { createEntity, getEntity, reset, updateEntity } from './vuelo.reducer';

export const VueloUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const vueloEntity = useAppSelector(state => state.vuelo.entity);
  const loading = useAppSelector(state => state.vuelo.loading);
  const updating = useAppSelector(state => state.vuelo.updating);
  const updateSuccess = useAppSelector(state => state.vuelo.updateSuccess);

  const handleClose = () => {
    navigate(`/vuelo${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
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
    values.fechaSalida = convertDateTimeToServer(values.fechaSalida);
    values.fechaLlegada = convertDateTimeToServer(values.fechaLlegada);

    const entity = {
      ...vueloEntity,
      ...values,
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
          fechaSalida: displayDefaultDateTime(),
          fechaLlegada: displayDefaultDateTime(),
        }
      : {
          ...vueloEntity,
          fechaSalida: convertDateTimeFromServer(vueloEntity.fechaSalida),
          fechaLlegada: convertDateTimeFromServer(vueloEntity.fechaLlegada),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="jhipster2026App.vuelo.home.createOrEditLabel" data-cy="VueloCreateUpdateHeading">
            <Translate contentKey="jhipster2026App.vuelo.home.createOrEditLabel">Create or edit a Vuelo</Translate>
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
                  id="vuelo-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              )}
              <ValidatedField
                label={translate('jhipster2026App.vuelo.numeroVuelo')}
                id="vuelo-numeroVuelo"
                name="numeroVuelo"
                data-cy="numeroVuelo"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.vuelo.origen')}
                id="vuelo-origen"
                name="origen"
                data-cy="origen"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.vuelo.destino')}
                id="vuelo-destino"
                name="destino"
                data-cy="destino"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.vuelo.fechaSalida')}
                id="vuelo-fechaSalida"
                name="fechaSalida"
                data-cy="fechaSalida"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('jhipster2026App.vuelo.fechaLlegada')}
                id="vuelo-fechaLlegada"
                name="fechaLlegada"
                data-cy="fechaLlegada"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <Button as={Link as any} id="cancel-save" data-cy="entityCreateCancelButton" to="/vuelo" replace variant="info">
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

export default VueloUpdate;
