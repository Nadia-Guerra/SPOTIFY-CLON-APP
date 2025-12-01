import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Player } from './player/player';
import { SearchResults } from './search-results/search-results';

const routes: Routes = [
  { path: '', component: Player },
  { path: 'search', component: SearchResults },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }