import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ITransferenciaStock } from '../../interfaces/transferencia-stock.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { TransferenciaStockCloseModel, TransferenciaStockCreateModel, TransferenciaStockUpdateModel } from '../../models/transferencia-stock.model';


@Injectable({providedIn: 'root'})
export class TransferenciaStockService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ){ }

  getNumber() {
    return this.http.get<ITransferenciaStock>(`${environment.url_api_fib}TransferenciaStock/GetNumber/`);
  }

  getListFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    return this.http.get<ITransferenciaStock[]>(`${environment.url_api_fib}TransferenciaStock/GetListFiltro/`,{params: params});
  }

  getById(id: number) {
    return this.http.get<ITransferenciaStock>(`${environment.url_api_fib}TransferenciaStock/GetById/${id}`);
  }

  setCreate(value: TransferenciaStockCreateModel) {
    console.log("VALUES", value);
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}TransferenciaStock/SetCreate/`, param);
  }

  setUpdate(value: TransferenciaStockUpdateModel) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}TransferenciaStock/SetUpdate/`, param);
  }

  setClose(value: TransferenciaStockCloseModel) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}TransferenciaStock/SetClose/`, param);
  }
}
