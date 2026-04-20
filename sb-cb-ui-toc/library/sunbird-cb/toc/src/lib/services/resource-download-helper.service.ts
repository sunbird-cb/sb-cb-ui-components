import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

/**
 * Resource Download Helper Service
 * Handles resource download functionality
 */
@Injectable({
  providedIn: 'root',
})
export class ResourceDownloadHelperService {
  constructor(private http: HttpClient) {}

  /**
   * Download a resource by URL
   */
  downloadResource(url: string, fileName?: string): void {
    const link = document.createElement('a')
    link.href = url
    link.download = fileName || 'download'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * Download blob as file
   */
  downloadBlob(blob: Blob, fileName: string): void {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  /**
   * Get resource as blob
   */
  getResourceAsBlob(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' })
  }

  /**
   * Download PDF by URL or content object
   */
  downloadPDF(content: any, pageId?: string): void {
    // Handle both URL string and content object
    if (typeof content === 'string') {
      this.downloadResource(content, pageId || 'document.pdf')
    } else if (content && content.artifactUrl) {
      this.downloadResource(content.artifactUrl, content.name ? `${content.name}.pdf` : 'document.pdf')
    }
  }
}
