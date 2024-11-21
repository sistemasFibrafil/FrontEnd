import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';

import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { IFacturaVentaByFecha, IFacturaVentaSap, IVentaByFecha, IVentaProyeccionByFecha } from '../../interfaces/factura-venta.interface';
import { IPickingVentaItem } from '../../interfaces/picking-venta.interface';


@Injectable({providedIn: 'root'})
export class FacturaVentaService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe) { }

  getListFacturaReservaPendienteForPickingByCardCode(cardCode: string) {
    var params = new HttpParams();
    params = params.append('cardCode', cardCode);

    return this.http.get<any[]>(`${environment.url_api_fib}FacturaVentaSap/GetListFacturaReservaPendienteForPickingByCardCode/`,{params: params});
  }

  getFacturaReservaItemPendienteForPickingByBarCode(value: FilterRequestModel) {
    let params = new HttpParams();
    // params = params.append('idPicking', value.idPicking);
    // params = params.append('docEntry', value.docEntry);
    // params = params.append('cardCode', value.cardCode);
    // params = params.append('whsCode', value.whsCode);
    // params = params.append('barCode', value.barCode);
    // params = params.append('codEstado', value.codEstado);
    // params = params.append('idUsuario', value.idUsuario);

    return this.http.get<IPickingVentaItem>(`${environment.url_api_fib}FacturaVentaSap/getFacturaReservaItemPendienteForPickingByBarCode/`,{params: params});
  }

  getListVentaProyeccionByFecha(value: FilterRequestModel) {
    var params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));

    return this.http.get<IVentaProyeccionByFecha[]>(`${environment.url_api_fib}FacturaVentaSap/GetListVentaProyeccionByFecha/`,{params: params});
  }

  getListVentaResumenByFechaGrupo(value: FilterRequestModel) {
    var params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);

    return this.http.get<IFacturaVentaSap>(`${environment.url_api_fib}FacturaVentaSap/GetListVentaResumenByFechaGrupo/`,{params: params});
  }

  getVentaResumenExcelByFechaGrupo(value: FilterRequestModel){
    var params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);

    return this.http.get(`${environment.url_api_fib}FacturaVentaSap/GetVentaResumenExcelByFechaGrupo/`,{params: params, responseType: 'arraybuffer'});
  }

  getListVentaByFechaAndSlpCode(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('text1', value.text1);

    return this.http.get<IVentaByFecha[]>(`${environment.url_api_fib}FacturaVentaSap/GetListVentaByFechaAndSlpCode/`,{params: params});
  }

  getListVentaExcelByFechaAndSlpCode(value: FilterRequestModel){
    var params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}FacturaVentaSap/GetListVentaExcelByFechaAndSlpCode/`,{params: params, responseType: 'arraybuffer'});
  }

  getListFacturaVentaByFecha(value: FilterRequestModel){
    var params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);

    return this.http.get<IFacturaVentaByFecha[]>(`${environment.url_api_fib}FacturaVentaSap/GetListFacturaVentaByFecha/`,{params: params});
  }

  getListFacturaVentaExcelByFecha(value: FilterRequestModel){
    var params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}FacturaVentaSap/GetListFacturaVentaExcelByFecha/`,{params: params, responseType: 'arraybuffer'});
  }
}
