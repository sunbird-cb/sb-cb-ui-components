import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'

/**
 * Editor Service - Stub implementation
 * Provides content editing functionality
 */
@Injectable({
  providedIn: 'root',
})
export class EditorService {
  constructor(private http: HttpClient) {}

  deleteContent(contentId: string, type?: string): Observable<any> {
    return of({ success: true })
  }

  updateContent(contentId: string, data: any): Observable<any> {
    return of({ success: true })
  }

  getContent(contentId: string): Observable<any> {
    return of(null)
  }

  createContent(data: any): Observable<any> {
    return of({ identifier: '' })
  }
}
