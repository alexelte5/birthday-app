import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '**',
    redirectTo: 'dashboard',
  },
  {
    path: 'persons/new',
    loadComponent: () =>
      import('./features/persons/person-form/person-form').then((m) => m.PersonForm),
  },
];
