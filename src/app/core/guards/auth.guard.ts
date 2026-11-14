import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/** Solo deja pasar si hay sesión. Si recargaste la página, recupera el perfil. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.autenticado()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.usuario()) {
    return true;
  }

  return auth.cargarPerfil().pipe(
    map(() => true),
    catchError(() => {
      auth.cerrarSesion();
      return of(false);
    })
  );
};

/** Solo deja pasar si NO hay sesión (login y registro). */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.autenticado() ? router.createUrlTree(['/inicio']) : true;
};