import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Reserva from './reserva';
import ReservaDeleteDialog from './reserva-delete-dialog';
import ReservaDetail from './reserva-detail';
import ReservaUpdate from './reserva-update';

const ReservaRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Reserva />} />
    <Route path="new" element={<ReservaUpdate />} />
    <Route path=":id">
      <Route index element={<ReservaDetail />} />
      <Route path="edit" element={<ReservaUpdate />} />
      <Route path="delete" element={<ReservaDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ReservaRoutes;
