import { CanActivateFn, Router } from '@angular/router';
import { TrivialService } from '../services/trivial.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const trivialService = inject(TrivialService);
  const router = inject(Router);

  const token = trivialService.getToken();
  
  if (token && token.length > 0) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};