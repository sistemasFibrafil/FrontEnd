import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { ITransferenciaStock } from '../interfaces/transferenciaStock.interface';
import { IEntregaLocalElectronica } from '../interfaces/entrega.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TransferenciaStockEnviarModel } from '../models/transferenciaStock.model';


@Injectable({providedIn: 'root'})
export class FacturacionElectronicaSapService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getListGuiaElectronicaByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);
    params = params.append('text2', value.text2);

    return this.http.get<IEntregaLocalElectronica[]>(`${environment.url_api_fib}FacturacionElectronicaSap/GetListGuiaElectronicaByFiltro/`, {params: params});
  }

  setEnviar(value: any) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}FacturacionElectronicaSap/SetEnviar/`, param);
  }

  getListGuiaInternaElectronicaByFechaAndNumero(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);
    params = params.append('text2', value.text2);

    return this.http.get<ITransferenciaStock[]>(`${environment.url_api_fib}FacturacionElectronicaSap/GetListGuiaInternaElectronicaByFechaAndNumero/`,{params: params});
  }

  setEnviarGuiaElectronica(value: TransferenciaStockEnviarModel) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}FacturacionElectronicaSap/EnviarGuiaInternaElectronica/`, param);
  }
}
