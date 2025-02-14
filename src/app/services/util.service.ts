import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  fecha_AAAAMMDD(fecha: string | Date): string {
    const day = new Date(fecha).getDate();
    const month = new Date(fecha).getMonth() + 1;
    const year = new Date(fecha).getFullYear();
    const fechaFinal = `${year}-${month}-${day}`;
    return fechaFinal;
  }

  fecha_AAAAMMDD_F112(fecha: string | Date): string {
    var day = new Date(fecha).getDate().toString();
    var month = (new Date(fecha).getMonth() + 1).toString();
    const year = new Date(fecha).getFullYear();
    if(Number(day)<10) day="0"+day.toString();
    if(Number(month)<10) month="0"+month.toString();

    const fechaFinal = `${year}${month}${day}`;

    return fechaFinal;
  }

  fecha_MM(fecha: Date): string {
    var month = new Date(fecha).getMonth() + 1

    if(Number(month)<10) {
      return "0"+month.toString();
    } else {
      return month.toString();
    }
  }

  fecha_YY(fecha: Date): number {
    const year = new Date(fecha).getFullYear();

    return year;
  }

  fecha_DDMMYYYYHHMM(fecha: Date): string {
    const day = this.padLeft(new Date(fecha).getDate(),2);
    const month = this.padLeft(new Date(fecha).getMonth() + 1,2);
    const year = new Date(fecha).getFullYear();
    const hour = this.padLeft(new Date(fecha).getHours(),2);
    const minute = this.padLeft(new Date(fecha).getMinutes(),2);
    const fechaFinal = `${day}/${month}/${year} ${hour}:${minute}`;
    return fechaFinal;
  }

  obtenerHora(fecha: Date): string {
    const hour = this.padLeft(new Date(fecha).getHours(),2);
    const minute = this.padLeft(new Date(fecha).getMinutes(),2);
    const hora = `${hour}:${minute}`;
    return hora;
  }

  obtenerFechaHora(fecha: Date, hora: string): Date {
    const day = this.padLeft(new Date(fecha).getDate(),2);
    const month = this.padLeft(new Date(fecha).getMonth() + 1,2);
    const year = new Date(fecha).getFullYear();

    const fechaFinal = new Date(`${month}/${day}/${year} ${hora}`);

    return fechaFinal;
  }

  padLeft(value: number, lon: number): string {
    return value.toString().padStart(lon,'0')
  }

  recortarMensajeApiExito(msg: string): string {
    return msg.split(',')[0];
  }

  fechaApi_POST(fecha: Date): string {
    fecha.setHours(0, -fecha.getTimezoneOffset(), 0, 0);
    return fecha.toISOString();
  }

  validar_email(email)
  {
    var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email) ? true : false;
  }

  goValidacionFechas(fechaInicio: Date, fechaFin: Date): boolean {
    let valido: boolean = false;

    if (fechaInicio === null) {
      valido = false;
      return valido;
    }

    if (fechaFin === null) {
      valido = false;
      return valido;
    }

    if (fechaInicio > fechaFin) {
      valido = true;
    }

    return valido;
  }

  convertirListaEmail(cadenaEmail: string): string[] {
    let miCadena = cadenaEmail;
    let posicion = miCadena.indexOf(';');
    let posiInicio = 0;

    let listDtaemail: string[] = [];

    if (posicion === -1)
    {
      listDtaemail.push(miCadena);
    }

    while (posicion !== -1) {

      let data = miCadena.substr(posiInicio, posicion);
      listDtaemail.push(data);
      miCadena = miCadena.substr(posicion + 1);
      posicion = miCadena.indexOf(';');

      if (posicion === -1)
      {
        listDtaemail.push(miCadena);
      }
    }
    return listDtaemail;
  }

  validaListEmail(email: string): string {
    var lista = this.convertirListaEmail(email);
    let msg = '';

    lista.forEach(x => {
      let validoEmail = this.validar_email(x);
      if (!validoEmail) {
        msg += '/' + x;
      }
    });

    return msg;
  }

  restarDia(fecha: string | Date, dias) {
    if (typeof fecha === 'string') {
      fecha = new Date(fecha);
    }
    fecha.setDate(fecha.getDate() - dias);
    return fecha;
  }

  sumarDias(fecha, dias) {
    fecha.setDate(fecha.getDate() + dias);
    return fecha;
  }
  recortarMensajeApiError(msg: string): string {
    return msg.split(';')[0];
  }

  onRedondearDecimal(numero: number, decimales: number): number {

    // let numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
    // if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
    //     return Number(numero.toFixed(decimales));
    // } else {
    //     return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    // }
    let valor = Math.round(numero * 100) / 100;

    let isNumero = Number(valor.toFixed(decimales));

    return isNumero;

    // let isNumero = Number(numero.toFixed(decimales));
    // return isNumero;
  }

  onRedondearDecimalConCero(numero: number, decimales: number): string {

    // let numeroRegexp = new RegExp('\\d\\.(\\d){' + decimales + ',}');   // Expresion regular para numeros con un cierto numero de decimales o mas
    // if (numeroRegexp.test(numero)) {         // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
    //     return Number(numero.toFixed(decimales));
    // } else {
    //     return Number(numero.toFixed(decimales)) === 0 ? 0 : numero;  // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    // }
    let valor = Math.round(numero * 100) / 100;

    var numeroArray:any = valor.toString().split(".");

    var decimals: number = 0;
    if (numeroArray.length > 1) {
      decimals = (numeroArray[1].length != undefined)?numeroArray[1].length:0;
    } else {
      decimals = 0;
    }

    if (decimals === 0) {
      return(numeroArray[0].toString() + '.00');
    }

    if (decimals === 1) {
      return(numero.toString() + '0');
    }

    if (decimals > 1) {
      return valor.toFixed(decimales);
    }

    // let isNumero = Number(valor.toFixed(decimales));

    // return isNumero;

    // let isNumero = Number(numero.toFixed(decimales));
    // return isNumero;
  }

  aceptaSoloNumeros(evt, value){
    // debugger
    // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
    const key = window.Event ? evt.which : evt.keyCode;
    const chark = String.fromCharCode(key);
    let tempValue = value + chark;

    if(key >= 48 && key <= 57){
      if (this.filter(tempValue) === false){
        return false;
      }else{
        return true;
      }
    }
    else
    {
      if (key === 8 || key === 13 || key === 0) {
        return true;
      }else if ( key === 46){
      if (this.filter(tempValue) === false){
        return false;
      }else{
        return true;
      }
      }else{
        return false;
      }
    }
  }

  filter(val){
    const preg = /^([0-9]+\.?[0-9]{0,4})$/;
    // const preg = new RegExp('/^([0-9]+\.?[0-9]{0,' + decimal + '})$/');
    if ( preg.test(val) === true){
      return true;
    }else{
      return false;
    }
  }

  convertirMayuscula(data: string): string {
    data = data === null ? '': data;
    data = data === undefined ? '' : data;

    let mayus = data.toUpperCase();

    return mayus;
  }

  goFindRegistroPorCode(data: SelectItem[], find: any): SelectItem {
    let item: SelectItem = data.find(xFind => xFind.value === find);

    item = item === undefined ? null : item;

    return item;
  }

  goOcultarParteDelCorreo(value: string) :  string{
    let chars = 3; // Cantidad de caracters visibles
    return value
    ? value.replace(/[a-z0-9\-_.]+@/ig, (c) => c.substr(0, chars) + c.split('').slice(chars, -1).map(v => '*').join('') + '@')
    : value;
  }
}
