import { Inject, Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipePublicURL',
})
export class PipePublicURL implements PipeTransform {
  environment: any
  constructor(@Inject('environment') environment: any) {
    this.environment = environment
  }
  transform(value: string): any {
    // Karmayogi content to be modified with the domain specific url
    // https://portal.karmayogi.nic.in/content-store/content/do_113918818243969024137/artifact/
    // do_113918818243969024137_1699074493067_effectivecommunication1699074492860.jpg
    if (value && value.includes('/content') && value.includes('do_')) {
      const mainUrl = value && value.split('/content').pop() || ''
      const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}/content${mainUrl}`
      return value ? finalURL : ''
    }
    // CIOS content has direct S3 url like blow, so return same url
    // https://s3.amazonaws.com/ecornell/content/On-Demand/Homepages/Banners/CEPL503-OD3_homepage-banner_v1.jpg
    return value
  }
}
