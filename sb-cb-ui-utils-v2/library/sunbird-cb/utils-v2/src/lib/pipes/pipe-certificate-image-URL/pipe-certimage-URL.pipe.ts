import { Inject, Pipe, PipeTransform } from '@angular/core'

@Pipe({
  name: 'pipeCertImageURL',
})
export class PipeCertificateImageURL implements PipeTransform {
  environment: any
  constructor(@Inject('environment') environment: any) {
    this.environment = environment
  }
  transform(value: string): any {
    if (value.indexOf(this.environment.contentHost) < 0) {
      if (value.indexOf('/public/content') > -1) {
        if (value.indexOf('/content/content') === -1 || value.indexOf('/content/collection') === -1) {
          const mainUrl = value && value.split('/content').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.certificateassets}/content${mainUrl}`
          return value ? finalURL : ''
        }
      }

      if (value.indexOf('/public/content') === -1) {
        if (value.indexOf('/content/content') > -1 || value.indexOf('/igot/content') > -1 || value.indexOf('/content-store/content') > -1) {
          const mainUrl = value && value.split('/content').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}/content${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotprod/collection') > -1) {
          const mainUrl = value && value.split('/igotprod').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotprod/content') > -1) {
          const mainUrl = value && value.split('/igotprod').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotuat/collection') > -1) {
          const mainUrl = value && value.split('/igotuat').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotuat/content') > -1) {
          const mainUrl = value && value.split('/igotuat').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igot/collection') > -1) {
          const mainUrl = value && value.split('/igot').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igot/content') > -1) {
          const mainUrl = value && value.split('/igot').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igot/profileImage') > -1) {
          const mainUrl = value && value.split('/igot').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotqa/profileImage') > -1) {
          const mainUrl = value && value.split('/igotqa').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotuat/profileImage') > -1) {
          const mainUrl = value && value.split('/igotuat').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/igotprod/profileImage') > -1) {
          const mainUrl = value && value.split('/igotprod').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/content/collection') > -1) {
          const mainUrl = value && value.split('/content').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }
        if (value.indexOf('/content/content') === -1 || value.indexOf('/content/collection') === -1) {
          const mainUrl = value && value.split('/content').pop() || ''
          const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
          return value ? finalURL : ''
        }

        if (this.environment && this.environment.bucketName) {
          if (value.indexOf(`/${this.environment.bucketName}/profileImage`) > -1) {
            const mainUrl = value && value.split(`/${this.environment.bucketName}`).pop() || ''
            const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
            return value ? finalURL : ''
          }
          if (value.indexOf(`/${this.environment.bucketName}/content`) > -1) {
            const mainUrl = value && value.split(`/${this.environment.bucketName}`).pop() || ''
            const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
            return value ? finalURL : ''
          }
          if (value.indexOf(`/${this.environment.bucketName}/collection`) > -1) {
            const mainUrl = value && value.split(`/${this.environment.bucketName}`).pop() || ''
            const finalURL = `${this.environment.contentHost}/${this.environment.contentBucket}${mainUrl}`
            return value ? finalURL : ''
          }
        }

      }
    } else {
      return value
    }
  }
}
