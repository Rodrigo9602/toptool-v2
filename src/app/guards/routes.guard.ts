import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthTokenService } from '../services/security/auth-token.service';

export const routesGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = inject(AuthTokenService).getToken();

  if (!token) {
    console.log('Access blocked');
    // aquí podríamos configurar una alerta para el usuario
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }  
};

