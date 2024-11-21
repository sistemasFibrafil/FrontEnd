import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ITipoCambioSap } from '../../interfaces/sap/tipo-cambio-sap.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';


@Injectable({providedIn: 'root'})
export class TipoCambioSapService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getByFechaCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    return this.http.get<ITipoCambioSap>(`${environment.url_api_fib}TipoCambioSap/GetByFechaCode/`, { params: params });
  }
}
