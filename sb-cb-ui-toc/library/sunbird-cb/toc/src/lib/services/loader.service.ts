import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

/**
 * Loader Service
 * Handles loading state management
 */
@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private loading = false
  changeLoad = new BehaviorSubject<boolean>(false)

  constructor() {}

  show(): void {
    this.loading = true
    this.changeLoad.next(true)
  }

  hide(): void {
    this.loading = false
    this.changeLoad.next(false)
  }

  get isLoading(): boolean {
    return this.loading
  }
}
