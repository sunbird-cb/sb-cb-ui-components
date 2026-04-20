import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'

/**
 * Certificate Service
 * Handles certificate-related operations
 */

const urls = {
  HIERARCHY: 'course/v1/hierarchy',
  LEARNER_PREFIX: '/api/',
  PROXIES_PREFIX: '/apis/proxies/v8/',
  VALIDATE_CERTIFICATE: 'certreg/v1/certs/validate',
  DOWNLOAD_CERTIFICATE: (id: string) => `certreg/v2/certs/download/${id}`,
  DOWNLOAD_CERTIFICATE_v2: (id: string) => `apis/protected/v8/cohorts/course/batch/cert/download/${id}`,
  SEARCH_CERTIFICATE: 'certreg/v1/certs/search',
  VALIDATE_ENROLLMENT: 'cios-enroll/v1/validation',
  CONSENT_API: 'consent/v1/acknowledge',
}
@Injectable({
  providedIn: 'root',
})
export class CertificateService {
  private readonly PROXY_SLAG_V8 = '/apis/proxies/v8'
  
  constructor(private http: HttpClient) {}

  /**
   * Get certificate details by certificate ID
   */
  getCertificateDetails(certId: string): Observable<any> {
    return this.http.get(`${this.PROXY_SLAG_V8}/certificates/v1/cert/${certId}`)
  }

  /**
   * Download certificate
   */
  downloadCertificate(certId: string): Observable<Blob> {
    return this.http.get( `${urls.LEARNER_PREFIX}${urls.DOWNLOAD_CERTIFICATE(certId)}`, {
      responseType: 'blob'
    })
  }

  /**
   * Get user certificates
   */
  getUserCertificates(userId: string): Observable<any> {
    return this.http.get(`${this.PROXY_SLAG_V8}/certificates/v1/user/${userId}`)
  }

  /**
   * Verify certificate
   */
  verifyCertificate(certId: string): Observable<any> {
    return this.http.get(`${this.PROXY_SLAG_V8}/certificates/v1/verify/${certId}`)
  }

  /**
   * Download certificate v2
   */
  downloadCertificate_v2(certId: string): Observable<any> {
    return this.http.get(`${urls.DOWNLOAD_CERTIFICATE_v2(certId)}`)
  }

  /**
   * Validate enrollment eligibility
   */
  validateEnrollmentEligibility(courseId: string, partnerId: string): Observable<any> {
    const option = {
      url: `${urls.PROXIES_PREFIX}${urls.VALIDATE_ENROLLMENT}`,
      data: {
        courseId,
        partnerId,
      },
    }
    return this.http.post<any>(option.url, option.data)
  }

  /**
   * Submit consent for content
   */
  consentSubmit(request: any): Observable<any> {
    return this.http.post(`${this.PROXY_SLAG_V8}/consent/v1/acknowledge`, request)
  }

   downloadCertificate_v3(certId: string): Observable<any> {
    return this.http.get(`/apis/protected/v8/cohorts/course/batch/cert/download/${certId}`)
  }

  validateCertificate(data: any): Observable<any> {
    const option = {
      data,
      // url: `${urls.PROXIES_PREFIX}learner/${urls.VALIDATE_CERTIFICATE}`,
      url: `${urls.LEARNER_PREFIX}${urls.VALIDATE_CERTIFICATE}`,
    }
    return this.http.post<any>(option.url, option.data)
  }

    searchCertificate(recipientId: string): Observable<any> {
    const option = {
      url: `${urls.LEARNER_PREFIX}${urls.SEARCH_CERTIFICATE}`,
      data: {
        request: {
          _source: ['data.badge.issuer.name', 'pdfUrl', 'data.issuedOn', 'data.badge.name'],
          query: {
            bool: {
              must: [{
                match_phrase: { 'recipient.id': recipientId },
              }],
            },
          },
          size: 50,
        },
      },
    }
    return this.http.post<any>(option.url, option.data)

  }
}



