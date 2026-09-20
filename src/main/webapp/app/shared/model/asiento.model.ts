import { IVuelo } from 'app/shared/model/vuelo.model';

export interface IAsiento {
  id?: number;
  numero?: string;
  clase?: string;
  disponible?: boolean;
  vuelo?: IVuelo | null;
}

export const defaultValue: Readonly<IAsiento> = {
  disponible: false,
};
