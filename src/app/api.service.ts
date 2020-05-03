import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment/moment';
import { forkJoin,  timer } from 'rxjs';
import { delay, switchMap,  toArray } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private SERVER_URL = 'https://covid-19-data.p.rapidapi.com/report/country/all';
  private TOTAL_URL = 'https://covid-19-data.p.rapidapi.com/report/totals';

  constructor(private httpClient: HttpClient) { }

  public getCountriesData() {
    const headers = new HttpHeaders()
      .set('x-rapidapi-host', 'covid-19-data.p.rapidapi.com')
      .set('x-rapidapi-key', '331631a043msh9812da69aacc2dap1c61a1jsnde8d3be3caef');

    const params = new HttpParams().set('date', '2020-04-01').set('date-format', 'YYYY-MM-DD');
    return this.httpClient.get(this.SERVER_URL, { headers, params });
  }

  public getTotals() {
    const headers = new HttpHeaders()
      .set('x-rapidapi-host', 'covid-19-data.p.rapidapi.com')
      .set('x-rapidapi-key', '331631a043msh9812da69aacc2dap1c61a1jsnde8d3be3caef');

    const yesterday = moment().subtract(1, 'd').format('YYYY-MM-DD');
    const twoWeeks = moment().subtract(2, 'w').format('YYYY-MM-DD');
    const fourWeeks = moment().subtract(4, 'w').format('YYYY-MM-DD');
    const sixWeeks = moment().subtract(6, 'w').format('YYYY-MM-DD');
    const yesterdayParams = new HttpParams().set('date', yesterday);
    const twoWeeksParams = new HttpParams().set('date', twoWeeks);
    const fourWeeksParams = new HttpParams().set('date', fourWeeks);
    const sixWeeksParams = new HttpParams().set('date', sixWeeks);

    return  forkJoin(
      this.httpClient.get(this.TOTAL_URL, { headers, params: yesterdayParams }),
      timer(1000).pipe(switchMap(() => this.httpClient.get(this.TOTAL_URL, { headers, params: twoWeeksParams }))),
      timer(3000).pipe(switchMap(() => this.httpClient.get(this.TOTAL_URL, { headers, params: fourWeeksParams }))),
      timer(6000).pipe(switchMap(() => this.httpClient.get(this.TOTAL_URL, { headers, params: sixWeeksParams }))),
    );

  }
}
