export class SerieNumeracionModel {
  codSerieNumeracion    : string;
  tipDocumento          : string;
  serDocumento          : string;
  numDocumento          : string;
  maxNumDocumento       : string;
  codSede               : number;
  codFormulario         : number;
  idUsuario             : number;
  linea                 : SerieNumeracionActionModel[]

  constructor(){
    this.codSerieNumeracion = '';
    this.tipDocumento       = '';
    this.serDocumento       = '';
    this.numDocumento       = '';
    this.maxNumDocumento    = '';
    this.codSede            = 0;
    this.codFormulario      = 0;
    this.idUsuario          = 0;
    this.linea              = [];
  }
}

export class SerieNumeracionActionModel {
  codSerieNumeracion    : string;
  tipDocumento          : string;
  serDocumento          : string;
  numDocumento          : string;
  maxNumDocumento       : string;
  codSede               : number;
  codFormulario         : number;
  idUsuario             : number;
  record                : number;

  constructor(){
    this.codSerieNumeracion = '';
    this.tipDocumento       = '';
    this.serDocumento       = '';
    this.numDocumento       = '';
    this.maxNumDocumento    = '';
    this.codSede            = 0;
    this.codFormulario      = 0;
    this.idUsuario          = 0;
    this.record             = 0;
  }
}
