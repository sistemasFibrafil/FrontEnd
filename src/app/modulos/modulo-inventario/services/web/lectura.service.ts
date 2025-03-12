import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { LecturaCreateModel, LecturaDeleteModel } from '../../models/web/lectura.model';
import { ILectura, ILecturaCopyToTransferencia } from '../../interfaces/web/lectura.inteface';



@Injectable({providedIn: 'root'})
export class LecturaService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  setCreate(value: LecturaCreateModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}Lectura/SetCreate/`, param);
  }

  getListByBaseTypeAndBaseEntry(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('id1', value.id1);
    params = params.append('cod1', value.cod1);

    return this.http.get<ILectura[]>(`${environment.url_api_fib}Lectura/GetListByBaseTypeAndBaseEntry/`,{params: params});
  }

  getByObject(value: any) {
    const param: string = JSON.stringify(value);
    return this.http.post<ILectura>(`${environment.url_api_fib}Lectura/GetByObject/`, param);
  }

  getListFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('text1', value.text1);

    return this.http.get<ILectura[]>(`${environment.url_api_fib}Lectura/GetListByFiltro/`,{params: params});
  }

  getListByBaseTypeBaseEntryBaseLineFiltro(value: FilterRequestModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<ILectura[]>(`${environment.url_api_fib}Lectura/GetListByBaseTypeBaseEntryBaseLineFiltro/`, param);
  }

  getListByTargetTypeTrgetEntryTrgetLineFiltro(value: FilterRequestModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<ILectura[]>(`${environment.url_api_fib}Lectura/GetListByTargetTypeTrgetEntryTrgetLineFiltro/`, param);
  }

  setDeleteMassive(value: LecturaDeleteModel) {
    const param: string = JSON.stringify(value);
    return this.http.patch<ILectura>(`${environment.url_api_fib}Lectura/SetDeleteMassive/`, param);
  }

  setDelete(value: LecturaDeleteModel) {
    const param: string = JSON.stringify(value);
    return this.http.patch<ILectura>(`${environment.url_api_fib}Lectura/SetDelete/`, param);
  }

  getLecturaCopyToTransferencia(value: any) {
    const param: string = JSON.stringify(value);
    return this.http.post<ILecturaCopyToTransferencia>(`${environment.url_api_fib}Lectura/GetLecturaCopyToTransferencia/`, param);
  }

  getPackingListPdfByTargetTypeTrgetEntry(value: FilterRequestModel) {
    var params = new HttpParams();
    params = params.append('cod1', value.cod1);
    params = params.append('id1', value.id1);
    return this.http.get(`${environment.url_api_fib}Lectura/GetPackingListPdfByTargetTypeTrgetEntry/`, {params: params, responseType: 'blob',  observe: 'response', reportProgress: true });
  }
}
