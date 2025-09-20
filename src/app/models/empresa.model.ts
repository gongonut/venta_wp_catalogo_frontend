import { Producto } from './producto.model';

export interface Empresa {
  _id: string;
  code: string;
  nombre: string;
  telefono?: string;
  whatsApp: string;
  email?: string;
  direccion?: string;
  saludoBienvenida?: string;
  saludoDespedida?: string;
  categorias?: string[];
  productos?: Producto[];
  // No incluimos geoUbicacion en el modelo simple para el listado, a menos que sea necesario
}