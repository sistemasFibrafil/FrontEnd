export class TransferenciaStockCreateModel {
  id                      : number;
  tipDocumento            : string;
  serDocumento            : string;
  numDocumento            : string;
  docDate                 : Date;
  docDueDate              : Date;
  taxDate                 : Date;
  cardCode?               : string;
  cardName?               : string;
  cntctCode?              : number;
  address                 : string;
  filler                  : string;
  toWhsCode               : string;

  codTipTransporte        : string;
  codTipDocTransportista  : string;
  numTipoDocTransportista : string;
  nomTransportista        : string;
  numPlaVehTransportista  : string;

  codTipDocConductor      : string;
  numTipoDocConductor     : string;
  nomConductor            : string;
  apeConductor            : string;
  nomComConductor         : string;
  numLicConductor         : string;

  codTipTraslado          : string;
  codMotTraslado          : string;
  codTipSalida            : string;

  slpCode                 : number;
  numBulto                : number;
  totKilo                 : number;
  jrnlMemo                : string;
  comments                : string;

  idUsuarioCreate         : number;
  linea                   : TransferenciaStockDetalleCreateModel[];

  constructor(){
    this.id                       = 0;
    this.tipDocumento             = '';
    this.serDocumento             = '';
    this.docDate                  = null;
    this.docDueDate               = null;
    this.taxDate                  = null;
    this.cardCode                 = '';
    this.cardName                 = '';
    this.cntctCode                = 0;
    this.address                  = '';
    this.filler                   = '';
    this.toWhsCode                = '';

    this.codTipTransporte         = '';
    this.codTipDocTransportista   = '';
    this.numTipoDocTransportista  = '';
    this.nomTransportista         = '';
    this.numPlaVehTransportista   = '';

    this.codTipDocConductor       = '';
    this.numTipoDocConductor      = '';
    this.nomConductor             = '';
    this.apeConductor             = '';
    this.nomComConductor          = '';
    this.numLicConductor          = '';

    this.codTipTraslado           = '';
    this.codMotTraslado           = '';
    this.codTipSalida             = '';

    this.slpCode                  = -1;
    this.numBulto                 = 0;
    this.totKilo                  = 0;
    this.jrnlMemo                 = '';
    this.comments                 = '';
    this.idUsuarioCreate          = 0;
    this.linea                    = [];
  }
}

export class TransferenciaStockDetalleCreateModel {
  id                          : number;
  line                        : number;
  idBase                      : number;
  lineBase                    : number;
  idLectura                   : number;
  baseType                    : string;
  baseEntry                   : number;
  baseLine                    : number;
  itemCode                    : string;
  dscription                  : string;
  fromWhsCod                  : string;
  whsCode                     : string;
  codTipOperacion             : string;
  unitMsr                     : string;
  quantity                    : number;
  openQty                     : number;
  idUsuarioCreate             : number;

  constructor(){
    this.id                   = 0;
    this.line                 = 0;
    this.baseType             = '';
    this.baseEntry            = 0;
    this.baseLine             = 0;
    this.itemCode             = '';
    this.dscription           = '';
    this.fromWhsCod           = '';
    this.whsCode              = '';
    this.codTipOperacion      = '';
    this.unitMsr              = '';
    this.quantity             = 0;
    this.openQty              = 0;
    this.idUsuarioCreate      = 0;
  }
}


export class TransferenciaStockUpdateModel {
  id                          : number;
  docEntry                    : number;

  codTipTransporte            : string;
  codTipDocTransportista      : string;
  numTipoDocTransportista     : string;
  nomTransportista            : string;
  numPlaVehTransportista      : string;

  codTipDocConductor          : string;
  numTipoDocConductor         : string;
  nomConductor                : string;
  apeConductor                : string;
  nomComConductor             : string;
  numLicConductor             : string;

  codTipTraslado              : string;
  codMotTraslado              : string;
  codTipSalida                : string;

  slpCode                     : number;
  numBulto                    : number;
  totKilo                     : number;
  jrnlMemo                    : string;
  comments                    : string;
  idUsuarioUpdate             : number;
  linea                       : TransferenciaStockDetalleUpdateModel[];

  constructor(){
    this.id                       = 0;
    this.docEntry                 = 0;

    this.codTipTransporte         = '';
    this.codTipDocTransportista   = '';
    this.numTipoDocTransportista  = '';
    this.nomTransportista         = '';
    this.numPlaVehTransportista   = '';

    this.codTipDocConductor       = '';
    this.numTipoDocConductor      = '';
    this.nomConductor             = '';
    this.apeConductor             = '';
    this.nomComConductor          = '';
    this.numLicConductor          = '';

    this.codTipTraslado           = '';
    this.codMotTraslado           = '';
    this.codTipSalida             = '';

    this.codTipTraslado           = '';
    this.codMotTraslado           = '';
    this.codTipSalida             = '';
    this.slpCode                  = -1;
    this.numBulto                 = 0;
    this.totKilo                  = 0;
    this.jrnlMemo                 = '';
    this.comments                 = '';
    this.idUsuarioUpdate          = 0;
    this.linea                    = [];
  }
}

export class TransferenciaStockDetalleUpdateModel {
  id                          : number;
  line                        : number;
  docEntry                    : number;
  lineNum                     : number;
  itemCode                    : string;
  dscription                  : string;
  fromWhsCod                  : string;
  whsCode                     : string;
  codTipOperacion             : string;
  unitMsr                     : string;
  quantity                    : number;
  openQty                     : number;

  constructor(){
    this.id                   = 0;
    this.line                 = 0;
    this.docEntry             = 0;
    this.lineNum              = 0;
    this.itemCode             = '';
    this.dscription           = '';
    this.fromWhsCod           = '';
    this.whsCode              = '';
    this.codTipOperacion      = '';
    this.unitMsr              = '';
    this.quantity             = 0;
    this.openQty              = 0;
  }
}


export class TransferenciaStockCloseModel {
  id                         : number;
  docEntry                    : number;
  idUsuarioClose              : number;

  constructor(){
    this.id                   = 0;
    this.docEntry             = 0;
    this.idUsuarioClose       = 0;
  }
}
