import { Injectable } from '@angular/core'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class NavigationExternalService {
  constructor(private router: Router) { }

  init() {
    // Listen for navigation events from external sources (e.g., mobile app)
    document.addEventListener('NAVIGATION_DATA_INCOMING', (event: any) => {
      if (event.detail && event.detail.url) {
        const url = event.detail.url
        const params = event.detail.params || {}

        // Navigate to the requested URL with params
        this.router.navigate([url], { queryParams: params }).catch(err => {
          console.error('Navigation error:', err)
        })
      }
    })
  }
}
