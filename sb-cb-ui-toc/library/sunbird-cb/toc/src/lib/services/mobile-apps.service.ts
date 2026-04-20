import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs'

/**
 * Mobile Apps Service stub
 * Provides mobile app specific functionality
 * 
 * Note: This is a minimal stub. The consuming application should provide
 * a proper implementation if full functionality is needed.
 */
@Injectable({
  providedIn: 'root',
})
export class MobileAppsService {
  private isMobileApp = new BehaviorSubject<boolean>(false)

  constructor() {
    this.detectMobileApp()
  }

  private detectMobileApp(): void {
    // Check if running in mobile app context
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    this.isMobileApp.next(isMobile)
  }

  get isMobile$(): Observable<boolean> {
    return this.isMobileApp.asObservable()
  }

  get isMobile(): boolean {
    return this.isMobileApp.value
  }

  /**
   * Check if running in Android app
   */
  isAndroidApp(): boolean {
    return /android/i.test(window.navigator.userAgent)
  }

  /**
   * Check if running in iOS app
   */
  isIOSApp(): boolean {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  }

  /**
   * Send message to native app
   */
  sendToNativeApp(action: string, data?: any): void {
    // Stub implementation
    console.log('MobileAppsService.sendToNativeApp:', action, data)
  }

  /**
   * Mobile top header visibility status
   */
  mobileTopHeaderVisibilityStatus = new BehaviorSubject<boolean>(true)

  /**
   * Send viewer data to mobile app
   */
  sendViewerData(content: any): void {
    // Stub implementation
    console.log('MobileAppsService.sendViewerData:', content)
  }
}
