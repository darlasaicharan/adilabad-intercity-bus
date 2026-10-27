import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Bus } from '../../models/bus';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-bus-results',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './bus-results.html',
  styleUrl: './bus-results.css'
})
export class BusResultsComponent implements OnInit {
  fromCity: string = '';
  toCity: string = '';
  journeyDate: string = '';

  allBuses: Bus[] = [];
  filteredBuses: Bus[] = [];
  availableCities: string[] = [];

  isLoading: boolean = true;
  errorMessage: string = '';
  isBackendOffline: boolean = false;

  // View mode: 'cards' or 'table'
  viewMode: 'cards' | 'table' = 'cards';

  // Filter & Sort
  selectedTypeFilter: string = 'ALL';
  selectedSortBy: string = 'DEPARTURE';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private busService: BusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Load available cities for query modification
    this.busService.getCities().subscribe({
      next: (cities) => {
        this.availableCities = cities;
        this.cdr.detectChanges();
      },
      error: () => {
        this.availableCities = ['Adilabad', 'Asifabad', 'Hyderabad', 'Karimnagar', 'Mancherial', 'Nagpur', 'Nirmal', 'Nizamabad'];
        this.cdr.detectChanges();
      }
    });

    // Listen to query param changes
    this.route.queryParams.subscribe(params => {
      this.fromCity = params['from'] || '';
      this.toCity = params['to'] || '';
      this.journeyDate = params['date'] || new Date().toISOString().split('T')[0];

      this.fetchBuses();
    });
  }

  fetchBuses(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.isBackendOffline = false;

    if (this.fromCity && this.toCity) {
      // Validate same city
      if (this.fromCity.trim().toLowerCase() === this.toCity.trim().toLowerCase()) {
        this.isLoading = false;
        this.errorMessage = 'Starting city and destination city cannot be identical.';
        this.allBuses = [];
        this.filteredBuses = [];
        this.cdr.detectChanges();
        return;
      }

      this.busService.searchBuses(this.fromCity, this.toCity, this.journeyDate).subscribe({
        next: (buses) => {
          this.allBuses = buses;
          this.applyFilterAndSort();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Unable to retrieve bus schedules.';
          if (err.message && err.message.includes('backend server')) {
            this.isBackendOffline = true;
          }
          this.allBuses = [];
          this.filteredBuses = [];
          this.cdr.detectChanges();
        }
      });
    } else {
      // If no query parameters are provided, show all intercity buses
      this.busService.getAllBuses().subscribe({
        next: (buses) => {
          this.allBuses = buses;
          this.applyFilterAndSort();
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Unable to load bus data from backend.';
          if (err.message && err.message.includes('backend server')) {
            this.isBackendOffline = true;
          }
          this.allBuses = [];
          this.filteredBuses = [];
          this.cdr.detectChanges();
        }
      });
    }
  }

  applyFilterAndSort(): void {
    let result = [...this.allBuses];

    // Filter by bus type
    if (this.selectedTypeFilter === 'AC') {
      result = result.filter(b => b.busType.toLowerCase().includes('ac') || b.busName.toLowerCase().includes('ac') || b.busName.toLowerCase().includes('rajadhani'));
    } else if (this.selectedTypeFilter === 'NON_AC') {
      result = result.filter(b => !b.busType.toLowerCase().includes('ac') && !b.busName.toLowerCase().includes('rajadhani'));
    } else if (this.selectedTypeFilter === 'SUPER_LUXURY') {
      result = result.filter(b => b.busType.toLowerCase().includes('super luxury'));
    } else if (this.selectedTypeFilter === 'SLEEPER') {
      result = result.filter(b => b.busType.toLowerCase().includes('sleeper'));
    }

    // Sort
    if (this.selectedSortBy === 'FARE_ASC') {
      result.sort((a, b) => a.fare - b.fare);
    } else if (this.selectedSortBy === 'FARE_DESC') {
      result.sort((a, b) => b.fare - a.fare);
    } else if (this.selectedSortBy === 'SEATS_DESC') {
      result.sort((a, b) => b.availableSeats - a.availableSeats);
    } else if (this.selectedSortBy === 'DURATION') {
      result.sort((a, b) => a.journeyDuration.localeCompare(b.journeyDuration));
    } else {
      // Default: departure time
      result.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    }

    this.filteredBuses = result;
    this.cdr.detectChanges();
  }

  onFilterChange(): void {
    this.applyFilterAndSort();
  }

  onSortChange(): void {
    this.applyFilterAndSort();
  }

  setViewMode(mode: 'cards' | 'table'): void {
    this.viewMode = mode;
    this.cdr.detectChanges();
  }

  swapCities(): void {
    const temp = this.fromCity;
    this.fromCity = this.toCity;
    this.toCity = temp;
    this.updateQueryRoute();
  }

  updateQueryRoute(): void {
    if (!this.fromCity || !this.toCity) {
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

  viewDetails(busId: string): void {
    this.router.navigate(['/bus', busId]);
  }

  getSeatBadgeClass(available: number): string {
    if (available <= 10) return 'badge-amber';
    return 'badge-green';
  }
}
