import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({providedIn: 'root'})
export class SolicitudTrasladoSapService {
  constructor
  (
    private http: HttpClient
  ) { }

  getSolicitudTrasladoPdfByDocEntry(id: number) {
    return this.http.get(`${environment.url_api_fib}SolicitudTrasladoSap/GetSolicitudTrasladoPdfByDocEntry/${id}`, {responseType: 'blob',  observe: 'response', reportProgress: true });
  }
}
