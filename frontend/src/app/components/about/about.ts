import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BusService } from '../../services/bus.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent implements OnInit {
  serverStatus: string = 'Checking...';
  isServerOnline: boolean = false;
  activeEndpointCount: number = 4;

  techStack = [
    {
      category: 'Frontend Client',
      tech: 'Angular & TypeScript',
      icon: 'fa-brands fa-angular',
      color: '#dd0031',
      description: 'Single Page Application (SPA) architecture with Standalone Components, typed interfaces, and two-way data binding.'
    },
    {
      category: 'Backend Server',
      tech: 'Node.js & Express.js',
      icon: 'fa-brands fa-node-js',
      color: '#68a063',
      description: 'Lightweight REST API service handling parameter validation, bus searching, and structured JSON responses.'
    },
    {
      category: 'HTTP Communication',
      tech: 'Angular HttpClient & RxJS',
      icon: 'fa-solid fa-network-wired',
      color: '#0284c7',
      description: 'Asynchronous reactive streams with Observables, pipe operators, and centralized error interception.'
    },
    {
      category: 'User Interface',
      tech: 'HTML5 & Vanilla CSS3',
      icon: 'fa-brands fa-css3-alt',
      color: '#0f766e',
      description: 'Handcrafted responsive design system with CSS custom properties, glassmorphism, and Adilabad-inspired palette.'
    }
  ];

  constructor(
    private busService: BusService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.busService.checkHealth().subscribe({
      next: (res) => {
        this.serverStatus = res.status || 'ONLINE';
        this.isServerOnline = true;
        this.cdr.detectChanges();
      },
      error: () => {
        this.serverStatus = 'OFFLINE (Start backend via node app.js)';
        this.isServerOnline = false;
        this.cdr.detectChanges();
      }
    });
  }
}
