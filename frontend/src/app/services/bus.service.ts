import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Bus, SearchResponse, SingleBusResponse, CitiesResponse } from '../models/bus';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  // Express.js backend base URL
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Fetch all bus records
   * GET /api/buses
   */
  getAllBuses(): Observable<Bus[]> {
    return this.http.get<{ success: boolean; buses: Bus[]; totalCount: number }>(`${this.apiUrl}/buses`)
      .pipe(
        map(response => response.buses || []),
        catchError(this.handleError)
      );
  }

  /**
   * Filter buses by starting city and destination city
   * GET /api/buses/search?from=...&to=...&date=...
   */
  searchBuses(from: string, to: string, date?: string): Observable<Bus[]> {
    let params = new HttpParams()
      .set('from', from.trim())
      .set('to', to.trim());

    if (date) {
      params = params.set('date', date);
    }

    return this.http.get<SearchResponse>(`${this.apiUrl}/buses/search`, { params })
      .pipe(
        map(response => response.buses || []),
        catchError(this.handleError)
      );
  }

  /**
   * Fetch a single bus by ID
   * GET /api/buses/:id
   */
  getBusById(id: string): Observable<Bus> {
    return this.http.get<SingleBusResponse>(`${this.apiUrl}/buses/${encodeURIComponent(id)}`)
      .pipe(
        map(response => {
          if (response && response.bus) {
            return response.bus;
          }
          throw new Error(`Bus with ID '${id}' was not found.`);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Fetch list of available unique cities for dropdowns
   * GET /api/cities
   */
  getCities(): Observable<string[]> {
    return this.http.get<CitiesResponse>(`${this.apiUrl}/cities`)
      .pipe(
        map(response => response.cities || []),
        catchError(() => {
          // Fallback static list if server is temporarily unreachable during initial page load
          return of([
            'Adilabad',
            'Asifabad',
            'Hyderabad',
            'Karimnagar',
            'Mancherial',
            'Nagpur',
            'Nirmal',
            'Nizamabad'
          ]);
        })
      );
  }

  /**
   * Check backend server health status
   */
  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Centralized HTTP error handler
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      if (error.status === 0) {
        errorMessage = 'Unable to connect to the backend server. Please verify the Express server is running on http://localhost:3000.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.status === 404) {
        errorMessage = 'The requested bus or route could not be found.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid search request. Please check your inputs.';
      } else {
        errorMessage = `Server returned code ${error.status}: ${error.statusText || 'Internal error'}`;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
}
