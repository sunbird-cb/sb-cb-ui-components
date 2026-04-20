import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class PageNameResolve  {
  constructor(
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
  ): string {
    if (route.data.pageUrl) {
      return route.data.pageUrl
    }
    if (route.data.pageType === 'feature' && route.data.pageKey) {
      return `${route.data.pageKey}`
    }
    if (
      route.data.pageType === 'page' &&
      route.data.pageKey &&
      route.paramMap.has(route.data.pageKey)
    ) {
      return `${route.paramMap.get(route.data.pageKey)}`
    }
    if (
      route.data.pageType === 'page' &&
      route.data.pageKey &&
      route.data.pageKey === 'toc'
    ) {
      return `${route.data.pageKey}`
    }
    return 'common module'
  }
}
