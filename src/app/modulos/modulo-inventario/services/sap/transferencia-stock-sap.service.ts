import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({providedIn: 'root'})
export class TransferenciaStockSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getTransferenciaStockPdfByDocEntry(id: number) {
    return this.http.get(`${environment.url_api_fib}TransferenciaStockSap/GetTransferenciaStockPdfByDocEntry/${id}`, {responseType: 'blob',  observe: 'response', reportProgress: true });
  }
}
