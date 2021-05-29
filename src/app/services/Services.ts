import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlField} from '../bo/UrlField';

@Injectable({
  providedIn: 'root'
})
export class Services {

  URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {

  }

  getAllItemsFromEntity(entity: string) {

    const headers = new HttpHeaders({
      'Access-Control-Allow-Headers' : 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*'
    });

    return this.http.get(this.URL + '/' + entity + '/' + 'getAll',{headers});
  }


  getItemsFromEntityByFields(entity: string, method: string, fields: UrlField[]) {

    const headers = new HttpHeaders({
      'Access-Control-Allow-Headers' : 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*'
    });

    let urlFields = '';
    let cont = 0;
    for (const field of fields) {
      if (cont > 0) {
        urlFields += '&' + field.fieldName + '=' + field.value;
      } else if (cont === 0) {
        urlFields = field.fieldName + '=' + field.value;
      }

      cont++;
    }
    return this.http.get(this.URL + '/' + entity + '/' + method + '?' + urlFields,
      {headers});
  }




}
