import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

const API_POINTS = {
    COMPETENCY_LIST: `apis/proxies/v8/competency/v4/search`,
    competency_URL: `apis/proxies/v8/v1/search/competenciesByOrg/`,
    COMPETENCY_LIST_V2: `apis/proxies/v8/searchBy/v2/competency`,
}

@Injectable({ providedIn: 'root' })

export class CompetencyPassbookMdoService {
    // tslint: disable-next-line: whitespace
    constructor(private http: HttpClient) { }
    getCompetencyList(payload: any): Observable<any> {
        return this.http.post(API_POINTS.COMPETENCY_LIST, payload)
    }
    getCompetencyListv_V2(): Observable<any> {
        return this.http.get(API_POINTS.COMPETENCY_LIST_V2)
    }
    mdoCompetency(providerId: string): Observable<any> {
        return this.http.get(API_POINTS.competency_URL + providerId)
    }
}
