export interface Producto {
  _id?: string;
  sku: string;
  nombreCorto: string;
  nombreLargo?: string;
  // descripcion?: string;
  precioVenta: number;
  existencia?: number;
  presentacion?: Record<string, { precioventa: number; disponible: boolean }>;
  categoria?: string;
  fotos?: string[];
}
