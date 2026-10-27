import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-search-buses',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './search-buses.html',
  styleUrl: './search-buses.css'
})
export class SearchBusesComponent implements OnInit {
  fromCity: string = 'Adilabad';
  toCity: string = 'Hyderabad';
  journeyDate: string = '';
  errorMessage: string = '';
  minDate: string = '';
  availableCities: string[] = [];
  isLoadingCities: boolean = true;

  // Quick route presets for one-click search convenience
  popularRoutes = [
    { from: 'Adilabad', to: 'Hyderabad', label: 'Adilabad ➔ Hyderabad' },
    { from: 'Hyderabad', to: 'Adilabad', label: 'Hyderabad ➔ Adilabad' },
    { from: 'Adilabad', to: 'Nirmal', label: 'Adilabad ➔ Nirmal' },
    { from: 'Adilabad', to: 'Nizamabad', label: 'Adilabad ➔ Nizamabad' },
    { from: 'Adilabad', to: 'Karimnagar', label: 'Adilabad ➔ Karimnagar' },
    { from: 'Adilabad', to: 'Mancherial', label: 'Adilabad ➔ Mancherial' },
    { from: 'Adilabad', to: 'Asifabad', label: 'Adilabad ➔ Asifabad' },
    { from: 'Adilabad', to: 'Nagpur', label: 'Adilabad ➔ Nagpur' }
  ];

  constructor(
    private router: Router,
    private busService: BusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    this.journeyDate = this.minDate;

    this.loadCities();
  }

  loadCities(): void {
    this.isLoadingCities = true;
    this.busService.getCities().subscribe({
      next: (cities) => {
        this.availableCities = cities;
        this.isLoadingCities = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.availableCities = ['Adilabad', 'Asifabad', 'Hyderabad', 'Karimnagar', 'Mancherial', 'Nagpur', 'Nirmal', 'Nizamabad'];
        this.isLoadingCities = false;
        this.cdr.detectChanges();
      }
    });
  }

  swapCities(): void {
    const temp = this.fromCity;
    this.fromCity = this.toCity;
    this.toCity = temp;
    this.validateInputs();
  }

  selectQuickRoute(route: { from: string; to: string }): void {
    this.fromCity = route.from;
    this.toCity = route.to;
    this.errorMessage = '';
    this.submitSearch();
  }

  validateInputs(): boolean {
    this.errorMessage = '';

    if (!this.fromCity) {
      this.errorMessage = 'Please select a starting city (From).';
      this.cdr.detectChanges();
      return false;
    }

    if (!this.toCity) {
      this.errorMessage = 'Please select a destination city (To).';
      this.cdr.detectChanges();
      return false;
    }

    if (this.fromCity.trim().toLowerCase() === this.toCity.trim().toLowerCase()) {
      this.errorMessage = 'Starting city and destination city cannot be identical. Please select different cities.';
      this.cdr.detectChanges();
      return false;
    }

    if (!this.journeyDate) {
      this.errorMessage = 'Please pick a journey date.';
      this.cdr.detectChanges();
      return false;
    }

    this.cdr.detectChanges();
    return true;
  }

  submitSearch(): void {
    if (!this.validateInputs()) {
      return;
    }

    this.router.navigate(['/results'], {
      queryParams: {
        from: this.fromCity,
        to: this.toCity,
        date: this.journeyDate
      }
    });
  }
}
