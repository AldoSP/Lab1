import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { Link, useLocation, useNavigate } from 'react-router';

import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';

import { getEntities } from './reserva.reducer';

export const Reserva = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const reservaList = useAppSelector(state => state.reserva.entities);
  const loading = useAppSelector(state => state.reserva.loading);
  const totalItems = useAppSelector(state => state.reserva.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const { order } = paginationState;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="reserva-heading" data-cy="ReservaHeading">
        <Translate contentKey="jhipster2026App.reserva.home.title">Reservas</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="jhipster2026App.reserva.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/reserva/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="jhipster2026App.reserva.home.createLabel">Create new Reserva</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {reservaList?.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="jhipster2026App.reserva.id">ID</Translate> <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('codigo')}>
                  <Translate contentKey="jhipster2026App.reserva.codigo">Codigo</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('codigo')} />
                </th>
                <th className="hand" onClick={sort('fechaReserva')}>
                  <Translate contentKey="jhipster2026App.reserva.fechaReserva">Fecha Reserva</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fechaReserva')} />
                </th>
                <th className="hand" onClick={sort('estado')}>
                  <Translate contentKey="jhipster2026App.reserva.estado">Estado</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('estado')} />
                </th>
                <th>
                  <Translate contentKey="jhipster2026App.reserva.vuelo">Vuelo</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="jhipster2026App.reserva.asiento">Asiento</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th>
                  <Translate contentKey="jhipster2026App.reserva.pasajero">Pasajero</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reservaList.map(reserva => (
                <tr key={`entity-${reserva.id}`} data-cy="entityTable">
                  <td>
                    <Button as={Link as any} to={`/reserva/${reserva.id}`} variant="link" size="sm">
                      {reserva.id}
                    </Button>
                  </td>
                  <td>{reserva.codigo}</td>
                  <td>{reserva.fechaReserva ? <TextFormat type="date" value={reserva.fechaReserva} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{reserva.estado}</td>
                  <td>{reserva.vuelo ? <Link to={`/vuelo/${reserva.vuelo.id}`}>{reserva.vuelo.id}</Link> : ''}</td>
                  <td>{reserva.asiento ? <Link to={`/asiento/${reserva.asiento.id}`}>{reserva.asiento.id}</Link> : ''}</td>
                  <td>{reserva.pasajero ? <Link to={`/pasajero/${reserva.pasajero.id}`}>{reserva.pasajero.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button as={Link as any} to={`/reserva/${reserva.id}`} variant="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        as={Link as any}
                        to={`/reserva/${reserva.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        variant="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (globalThis.location.href = `/reserva/${reserva.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        variant="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="jhipster2026App.reserva.home.notFound">No Reservas found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={reservaList && reservaList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Reserva;
