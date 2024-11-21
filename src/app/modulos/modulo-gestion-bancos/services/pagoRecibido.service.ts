import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ICobranzaCarteraVencidaSapByFecha } from '../interfaces/pagoRecibido.interface';
import { FilterRequestModel } from 'src/app/models/filter-request.model';



@Injectable({providedIn: 'root'})
export class PagoRecibidoSapService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe) { }

  getListCobranzaCarteraVencidaByFechaCorte(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('text1', value.text1);

    return this.http.get<ICobranzaCarteraVencidaSapByFecha[]>(`${environment.url_api_fib}PagoRecibidoSap/GetListCobranzaCarteraVencidaByFechaCorte/`,{params: params});
  }

  getListCobranzaCarteraVencidaExcelByFechaCorte(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}PagoRecibidoSap/GetListCobranzaCarteraVencidaExcelByFechaCorte/`,{params: params, responseType: 'arraybuffer'});
  }
}
