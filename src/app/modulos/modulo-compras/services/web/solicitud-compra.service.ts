import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';


import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { ISolicitudCompra } from '../../interfaces/solicitud-compra.interface';
import { SolicitudCompraCloseModel, SolicitudCompraCreateModel, SolicitudCompraUpdateModel } from '../../models/solicitud-compra.model';


@Injectable({providedIn: 'root'})
export class SolicitudCompraService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ){ }

  getNumber() {
    return this.http.get<ISolicitudCompra>(`${environment.url_api_fib}SolicitudCompra/GetNumber/`);
  }

  getListFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    return this.http.get<ISolicitudCompra[]>(`${environment.url_api_fib}SolicitudCompra/GetListFiltro/`,{params: params});
  }

  getById(id: number) {
    return this.http.get<ISolicitudCompra>(`${environment.url_api_fib}SolicitudCompra/GetById/${id}`);
  }

  setCreate(value: SolicitudCompraCreateModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}SolicitudCompra/SetCreate/`, param);
  }

  setUpdate(value: SolicitudCompraUpdateModel) {
    debugger
    var closeList = value.linea.filter(x=>x.record === 4);

    if (closeList.length === 0)
    {
      const param: string = JSON.stringify(value);
      return this.http.put(`${environment.url_api_fib}SolicitudCompra/SetUpdate/`, param);
    }
    else
    {
      const param: string = JSON.stringify(closeList);
      return this.http.put(`${environment.url_api_fib}SolicitudCompra/SetItemClose/`, param);
    }
  }

  setClose(value: SolicitudCompraCloseModel) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}SolicitudCompra/SetClose/`, param);
  }
}
