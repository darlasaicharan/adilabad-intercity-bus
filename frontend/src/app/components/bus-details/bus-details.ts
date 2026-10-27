import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Bus } from '../../models/bus';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-bus-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bus-details.html',
  styleUrl: './bus-details.css'
})
export class BusDetailsComponent implements OnInit {
  busId: string = '';
  bus: Bus | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  // Simulated seat layout representation
  seatMatrix: { number: number; isAvailable: boolean; isSelected?: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private busService: BusService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.busId = params.get('id') || '';
      if (this.busId) {
        this.fetchBusDetails(this.busId);
      } else {
        this.isLoading = false;
        this.errorMessage = 'No Bus ID specified in the URL.';
      }
    });
  }

  fetchBusDetails(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.busService.getBusById(id).subscribe({
      next: (busData) => {
        this.bus = busData;
        this.generateSeatMatrix(busData);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || `Unable to locate details for bus '${id}'.`;
        this.cdr.detectChanges();
      }
    });
  }

  generateSeatMatrix(bus: Bus): void {
    const total = bus.totalSeats || 36;
    const available = bus.availableSeats || 15;
    const bookedCount = total - available;

    const seats = [];
    for (let i = 1; i <= total; i++) {
      // Deterministically mark the first `bookedCount` seats as booked
      seats.push({
        number: i,
        isAvailable: i > bookedCount,
        isSelected: false
      });
    }
    this.seatMatrix = seats;
  }

  toggleSeat(seat: { number: number; isAvailable: boolean; isSelected?: boolean }): void {
    if (!seat.isAvailable) return;
    seat.isSelected = !seat.isSelected;
    this.cdr.detectChanges();
  }

  getSelectedSeatCount(): number {
    return this.seatMatrix.filter(s => s.isSelected).length;
  }

  goBack(): void {
    this.location.back();
  }

  printSummary(): void {
    window.print();
  }
}
