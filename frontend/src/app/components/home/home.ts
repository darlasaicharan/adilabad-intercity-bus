import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BusService } from '../../services/bus.service';

interface PopularDestination {
  city: string;
  tagline: string;
  distance: string;
  duration: string;
  minFare: number;
  frequency: string;
  busTypes: string[];
  icon: string;
  description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  fromCity: string = 'Adilabad';
  toCity: string = 'Hyderabad';
  journeyDate: string = '';
  errorMessage: string = '';
  availableCities: string[] = [];

  popularDestinations: PopularDestination[] = [
    {
      city: 'Hyderabad',
      tagline: 'Telangana Capital & IT Hub',
      distance: '305 km',
      duration: '6 hrs 15 mins',
      minFare: 385,
      frequency: 'Every 1-2 hours',
      busTypes: ['Rajadhani AC', 'Super Luxury', 'Express', 'AC Sleeper'],
      icon: 'fa-building',
      description: 'Major arterial corridor via NH-44 connecting Adilabad to JBS and MGBS Hyderabad.'
    },
    {
      city: 'Nirmal',
      tagline: 'Art & Heritage Gateway',
      distance: '85 km',
      duration: '1 hr 45 mins',
      minFare: 115,
      frequency: 'Every 45 minutes',
      busTypes: ['Express', 'Super Luxury', 'Palle Velugu'],
      icon: 'fa-palette',
      description: 'Frequent local transit passing picturesque Kuntala falls & Sahyadri ghats.'
    },
    {
      city: 'Nizamabad',
      tagline: 'Indur Commercial & Railway Node',
      distance: '155 km',
      duration: '3 hrs 00 mins',
      minFare: 240,
      frequency: 'Hourly',
      busTypes: ['Super Luxury', 'Rajadhani AC', 'Express'],
      icon: 'fa-train-subway',
      description: 'Essential business link via Armoor and Balkonda with direct RTC depot services.'
    },
    {
      city: 'Karimnagar',
      tagline: 'Educational & Agricultural Center',
      distance: '210 km',
      duration: '4 hrs 30 mins',
      minFare: 310,
      frequency: 'Regular Daily',
      busTypes: ['Super Luxury', 'Express'],
      icon: 'fa-graduation-cap',
      description: 'Key northern Telangana route linking Jagtial, Korutla, and Karimnagar CBS.'
    },
    {
      city: 'Mancherial',
      tagline: 'Godavari Basin & Coal Belt',
      distance: '145 km',
      duration: '3 hrs 30 mins',
      minFare: 210,
      frequency: 'Daily Services',
      busTypes: ['Deluxe', 'Express'],
      icon: 'fa-industry',
      description: 'Traverses through Utnoor agency forests and Jannaram wildlife zones.'
    },
    {
      city: 'Nagpur',
      tagline: 'Interstate Healthcare & Metro Link',
      distance: '195 km',
      duration: '4 hrs 30 mins',
      minFare: 340,
      frequency: 'Interstate Daily',
      busTypes: ['Super Luxury Express'],
      icon: 'fa-map-location-dot',
      description: 'Northward express route crossing Penganga river into Maharashtra via NH-44.'
    }
  ];

  constructor(
    private router: Router,
    private busService: BusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Set default date to today in YYYY-MM-DD
    const today = new Date();
    this.journeyDate = today.toISOString().split('T')[0];

    // Load available cities from backend
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
  }

  handleSearch(): void {
    this.errorMessage = '';

    if (!this.fromCity || !this.toCity) {
      this.errorMessage = 'Please select both Starting City and Destination City.';
      this.cdr.detectChanges();
      return;
    }

    if (this.fromCity.trim().toLowerCase() === this.toCity.trim().toLowerCase()) {
      this.errorMessage = 'Starting city and destination cannot be identical. Please choose distinct locations.';
      this.cdr.detectChanges();
      return;
    }

    // Navigate to results page with query parameters
    this.router.navigate(['/results'], {
      queryParams: {
        from: this.fromCity,
        to: this.toCity,
        date: this.journeyDate
      }
    });
  }

  quickSearch(destinationCity: string): void {
    this.fromCity = 'Adilabad';
    this.toCity = destinationCity;
    this.handleSearch();
  }

  swapCities(): void {
    const temp = this.fromCity;
    this.fromCity = this.toCity;
    this.toCity = temp;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
}
