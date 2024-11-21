import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EntregaVentaCreateModel } from '../../models/entrega.model';


@Injectable({providedIn: 'root'})
export class EntregaSapService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  setCreate(value: EntregaVentaCreateModel) {
    debugger
    const param: string = JSON.stringify(value);
    return this.http.post(`${environment.url_api_fib}EntregaSap/SetCreate/`, param);
  }
}
