import { Routes } from '@angular/router';
import { Roulette } from './components/roulette/roulette';
import { EditList } from './components/edit-list/edit-list';

export const routes: Routes = [
  { path: '', component: Roulette },
  { path: 'edit', component: EditList },
  { path: '**', redirectTo: '' }
];
