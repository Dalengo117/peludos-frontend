export type Rol = 'cliente' | 'veterinaria' | 'admin';

/** Respuesta de GET /usuarios/me, POST /auth/register y PATCH /usuarios/me */
export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo_electronico: string;
  telefono: string | null;
  direccion: string | null;
  rol: Rol;
  activo: boolean;
  fecha_registro: string;
}

/** Cuerpo de POST /auth/register (rol no se envía: el back asigna 'cliente') */
export interface RegistroRequest {
  nombre_completo: string;
  correo_electronico: string;
  contrasena: string;
  telefono?: string | null;
  direccion?: string | null;
}

/** Datos del formulario de login (se envían como form-urlencoded) */
export interface LoginRequest {
  correo: string;
  contrasena: string;
}

/** Respuesta de POST /auth/login */
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

/** Cuerpo de PATCH /usuarios/me (solo los campos que cambian) */
export interface ActualizarPerfilRequest {
  nombre_completo?: string;
  telefono?: string | null;
  direccion?: string | null;
}

/** Cuerpo de PUT /usuarios/me/contrasena */
export interface CambioContrasenaRequest {
  contrasena_actual: string;
  contrasena_nueva: string;
}