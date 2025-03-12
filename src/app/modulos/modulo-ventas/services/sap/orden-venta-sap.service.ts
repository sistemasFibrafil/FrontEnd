import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';



import { FilterRequestModel } from 'src/app/models/filter-request.model';
import { IPickingVentaItem } from '../../interfaces/picking-venta.interface';
import { IOrdenVentaPendienteByFecha, IOrdenVentaSapPendienteByFiltro, IOrdenVentaSeguimientoByFecha, IOrdenVentaSeguimientoDetalladoByFecha } from '../../interfaces/sap/orden-venta-sap.interface';


@Injectable({providedIn: 'root'})
export class OrdenVentaSapService {
  constructor(
    private http: HttpClient,
    private datePipe: DatePipe
  ) { }

  getListOrdenVentaPendienteForPickingByCardCode(cardCode: string) {
    let params = new HttpParams();
    params = params.append('cardCode', cardCode);

    return this.http.get<any[]>(`${environment.url_api_fib}OrdenVentaSap/GetListOrdenVentaPendienteForPickingByCardCode/`,{params: params});
  }

  getOrdenVentaItemPendienteForPickingByBarCode(value: any) {
    let params = new HttpParams();
    params = params.append('idPicking', value.idPicking);
    params = params.append('docEntry', value.docEntry);
    params = params.append('cardCode', value.cardCode);
    params = params.append('whsCode', value.whsCode);
    params = params.append('barCode', value.barCode);
    params = params.append('codEstado', value.codEstado);
    params = params.append('idUsuario', value.idUsuario);

    return this.http.get<IPickingVentaItem>(`${environment.url_api_fib}OrdenVentaSap/GetOrdenVentaItemPendienteForPickingByBarCode/`,{params: params});
  }

  getListOrdenVentaSeguimientoByFecha(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('cod4', value.cod4);
    params = params.append('text1', value.text1);

    return this.http.get<IOrdenVentaSeguimientoByFecha[]>(`${environment.url_api_fib}OrdenVentaSap/GetListOrdenVentaSeguimientoByFecha/`,{params: params});
  }

  getOrdenVentaSeguimientoExcelByFecha(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('cod4', value.cod4);
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}OrdenVentaSap/GetOrdenVentaSeguimientoExcelByFecha/`,{params: params, responseType: 'arraybuffer'});
  }

  getListOrdenVentaSeguimientoDetalladoByFecha(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('cod4', value.cod4);
    params = params.append('text1', value.text1);

    return this.http.get<IOrdenVentaSeguimientoDetalladoByFecha[]>(`${environment.url_api_fib}OrdenVentaSap/GetListOrdenVentaSeguimientoDetalladoByFecha/`,{params: params});
  }

  getOrdenVentaSeguimientoDetalladoExcelByFecha(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('cod1', value.cod1);
    params = params.append('cod2', value.cod2);
    params = params.append('cod3', value.cod3);
    params = params.append('cod4', value.cod4);
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}OrdenVentaSap/GetOrdenVentaSeguimientoDetalladoExcelByFecha/`,{params: params, responseType: 'arraybuffer'});
  }

  getListOrdenVentaPendienteStockAlmacenProduccionByFecha(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);

    return this.http.get<IOrdenVentaPendienteByFecha[]>(`${environment.url_api_fib}OrdenVentaSap/GetListOrdenVentaPendienteStockAlmacenProduccionByFecha/`,{params: params});
  }

  getOrdenVentaPendienteStockAlmacenProduccionExcelByFecha(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}OrdenVentaSap/GetOrdenVentaPendienteStockAlmacenProduccionExcelByFecha/`,{params: params, responseType: 'arraybuffer'});
  }

  getListOrdenVentaProgramacionByFecha(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);

    return this.http.get<IOrdenVentaPendienteByFecha[]>(`${environment.url_api_fib}OrdenVentaSap/GetListOrdenVentaProgramacionByFecha/`,{params: params});
  }

  getOrdenVentaProgramacionExcelByFecha(value: FilterRequestModel){
    let params = new HttpParams();
    params = params.append('dat1', this.datePipe.transform(value.dat1, 'yyyy-MM-dd'));
    params = params.append('dat2', this.datePipe.transform(value.dat2, 'yyyy-MM-dd'));
    params = params.append('text1', value.text1);

    return this.http.get(`${environment.url_api_fib}OrdenVentaSap/GetOrdenVentaProgramacionExcelByFecha/`,{params: params, responseType: 'arraybuffer'});
  }

  getListOrdenVentaSodimacPendienteByFiltro(value: FilterRequestModel) {
    let params = new HttpParams();
    params = params.append('text1', value.text1);

    return this.http.get<IOrdenVentaSapPendienteByFiltro[]>(`${environment.url_api_fib}OrdenVentaSap/GetListOrdenVentaSodimacPendienteByFiltro/`,{params: params});
  }

  getOrdenVentaSodimacPendienteByDocEntry(docEntry: number) {
    debugger
    let params = new HttpParams();
    params = params.append('id1', docEntry.toString());
    return this.http.get<IOrdenVentaSapPendienteByFiltro>(`${environment.url_api_fib}OrdenVentaSap/GetOrdenVentaSodimacPendienteById/`,{params: params});
  }
}
