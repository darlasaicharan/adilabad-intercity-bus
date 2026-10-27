import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { SearchBusesComponent } from './components/search-buses/search-buses';
import { BusResultsComponent } from './components/bus-results/bus-results';
import { BusDetailsComponent } from './components/bus-details/bus-details';
import { AboutComponent } from './components/about/about';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home - Adilabad Intercity Bus Information Service' },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'search', component: SearchBusesComponent, title: 'Search Buses - Adilabad Intercity Bus Information Service' },
  { path: 'results', component: BusResultsComponent, title: 'Search Results - Adilabad Intercity Bus Information Service' },
  { path: 'bus/:id', component: BusDetailsComponent, title: 'Bus Details - Adilabad Intercity Bus Information Service' },
  { path: 'about', component: AboutComponent, title: 'About - Adilabad Intercity Bus Information Service' },
  { path: '**', redirectTo: '' }
];
