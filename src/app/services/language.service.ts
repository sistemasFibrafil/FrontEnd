import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  es: any;

  constructor() {
    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
      dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
      dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
      monthNames: [ 'enero',
                    'febrero',
                    'marzo',
                    'abril',
                    'mayo',
                    'junio',
                    'julio',
                    'agosto',
                    'septiembre',
                    'octubre',
                    'noviembre',
                    'diciembre'],
      monthNamesShort: ['ene',
                        'feb',
                        'mar',
                        'abr',
                        'may',
                        'jun',
                        'jul',
                        'ago',
                        'sep',
                        'oct',
                        'nov',
                        'dic'],
      today: 'Hoy',
      clear: 'Borrar'
    };
  }
}
