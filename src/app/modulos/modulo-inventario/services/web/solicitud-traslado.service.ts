import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ILecturaCopySolicitudTrasladoToTransferencia, ISolicitudTraslado } from '../../interfaces/web/solicitud-traslado.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { SolicitudTrasladoCloseModel, SolicitudTrasladoCreateModel, SolicitudTrasladoUpdateModel } from '../../models/web/solicitud-traslado.model';


@Injectable({providedIn: 'root'})
export class SolicitudTrasladoService {
  constructor
  (
    private http: HttpClient,
    private datePipe: DatePipe
  ){ }

  getNumber() {
    return this.http.get<ISolicitudTraslado>(`${environment.url_api_fib}SolicitudTraslado/GetNumber/`);
  }

  getListFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    return this.http.get<ISolicitudTraslado[]>(`${environment.url_api_fib}SolicitudTraslado/GetListFiltro/`,{params: params});
  }

  getById(id: number) {
    return this.http.get<ISolicitudTraslado>(`${environment.url_api_fib}SolicitudTraslado/GetById/${id}`);
  }

  getSolicitudTrasladoToTransferencia(id: number) {
    return this.http.get<ILecturaCopySolicitudTrasladoToTransferencia>(`${environment.url_api_fib}SolicitudTraslado/GetSolicitudTrasladoToTransferencia/${id}`);
  }

  setCreate(value: SolicitudTrasladoCreateModel) {
    const param: string = JSON.stringify(value);
    return this.http.post<any[]>(`${environment.url_api_fib}SolicitudTraslado/SetCreate/`, param);
  }

  setUpdate(value: SolicitudTrasladoUpdateModel) {
    debugger
    var closeList = value.linea.filter(x=>x.record === 4);

    if (closeList.length === 0)
    {
      const param: string = JSON.stringify(value);
      return this.http.put(`${environment.url_api_fib}SolicitudTraslado/SetUpdate/`, param);
    }
    else
    {
      const param: string = JSON.stringify(closeList);
      return this.http.put(`${environment.url_api_fib}SolicitudTraslado/SetItemClose/`, param);
    }
  }

  setClose(value: SolicitudTrasladoCloseModel) {
    const param: string = JSON.stringify(value);
    return this.http.put(`${environment.url_api_fib}SolicitudTraslado/SetClose/`, param);
  }
}
