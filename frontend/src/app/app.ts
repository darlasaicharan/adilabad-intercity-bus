import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { BusService } from './services/bus.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  isMobileMenuOpen: boolean = false;
  isBackendConnected: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor(
    private busService: BusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.checkApiStatus();
  }

  checkApiStatus(): void {
    this.busService.checkHealth().subscribe({
      next: () => {
        this.isBackendConnected = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isBackendConnected = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
