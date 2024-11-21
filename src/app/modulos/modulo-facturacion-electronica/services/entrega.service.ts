import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment.prod';

import { IEntregaLocalElectronica } from '../interfaces/entrega.interface';
import { EntregaEnviarModel } from '../models/entrega.model';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class EntregaService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe) { }

  getListGuiaElectronicaByFechaAndNumero(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);
    params = params.append('text2', value.text2);

    return this.http.get<IEntregaLocalElectronica[]>(`${environment.url_api_fib}FacturacionElectronicaSap/GetListGuiaElectronicaByFechaAndNumero/`, {params: params});
  }

  setEnviarGuiaElectronica(value: EntregaEnviarModel) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}FacturacionElectronicaSap/EnviarGuiaElectronica/`, param);
  }
}
