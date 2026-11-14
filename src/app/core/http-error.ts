import { HttpErrorResponse } from '@angular/common/http';

/** Convierte un error del back en un mensaje legible. */
export function mensajeError(err: unknown, porDefecto = 'Ocurrió un error inesperado'): string {
  if (!(err instanceof HttpErrorResponse)) return porDefecto;

  if (err.status === 0) return 'No hay conexión con el servidor';

  const detail = err.error?.detail;
  if (typeof detail === 'string') return detail;                       // 400, 401, 403, 404, 409
  if (Array.isArray(detail) && detail.length) {                        // 422
    return detail.map((d: { msg: string }) => d.msg).join('. ');
  }
  return porDefecto;
}