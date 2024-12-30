import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserService } from '../services/security/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (!userService.isAdmin()) {
    router.navigate(['/home']);
    // configurar alerta
    console.log('Access Not Allowed')
    return false;
  }

  return true;
};
