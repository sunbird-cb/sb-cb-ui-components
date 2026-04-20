import { HttpClient } from '@angular/common/http'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'

/**
 * HttpLoaderFactory for @ngx-translate
 * Creates a TranslateHttpLoader to load translation files
 */
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}
