import { Component, Inject, OnInit } from '@angular/core'
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog'
import { EventService, WsEvents } from '@sunbird-cb/utils-v2'
import { jsPDF } from 'jspdf'

@Component({
  selector: 'ws-widget-certificate-dialog',
  templateUrl: './certificate-dialog.component.html',
  styleUrls: ['./certificate-dialog.component.scss'],
   /* tslint:disable */
   host: { class: 'certificate-inner-dialog-panel' },
   /* tslint:enable */
})
export class CertificateDialogComponent implements OnInit {
  url!: string
  navUrl = ''
  constructor(
    private events: EventService,
    public dialogRef: MatDialogRef<CertificateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject('environment') private environment: any
  ) {

  }

  ngOnInit() {
    this.url = this.data.cet
    
    // Determine the certificate URL based on whether it's an achievement/milestone certificate
    const certDownloadUrl = this.data?.isAchievement 
      ? `${this.environment.contentHost}/apis/public/v8/milestone/cert/download/${this.data.certId}`
      : `${this.environment.contentHost}/apis/public/v8/cert/download/${this.data.certId}`
    
    // tslint:disable-next-line:max-line-length
    this.navUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certDownloadUrl)}`
  }

  downloadCert() {
    this.raiseIntreactTelemetry('svg')
    const a: any = document.createElement('a')
    a.href = this.data.cet
    a.download = 'Certificate'
    document.body.appendChild(a)
    a.style = 'display: none'
    a.click()
    a.remove()
  }

  downloadCertPng() {
    this.raiseIntreactTelemetry('png')
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // ctx.imageSmoothingEnabled = true
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const a = document.createElement('a')
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        a.href = canvas.toDataURL('image/png', quality)
        a.download = 'Certificate'
        a.append(canvas)
        a.click()
        a.remove()
      }
    }
  }
  async downloadCertPdf() {
    this.raiseIntreactTelemetry('pdf')
    const uriData = this.data.cet
    const img = new Image()
    img.src = uriData
    img.width = 1820
    img.height = 1000
    img.onload = () => {
      const canvas = document.createElement('canvas');
      [canvas.width, canvas.height] = [img.width, img.height]
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const quality = 1.0 // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/imageSmoothingQuality
        const dataImg = canvas.toDataURL('application/pdf', quality)
        const pdf = new jsPDF('landscape', 'px', 'a4')

        // add the image to the PDF
        pdf.addImage(dataImg, 10, 20, 600, 350)

        // download the PDF
        pdf.save('Certificate.pdf')
      }
    }
  }

  getCertificateUrl(): string {
    return this.data?.isAchievement 
      ? `${this.environment.contentHost}/apis/public/v8/milestone/cert/download/${this.data.certId}`
      : `${this.environment.contentHost}/apis/public/v8/cert/download/${this.data.certId}`
  }

  shareCert() {
    this.raiseShareIntreactTelemetry('share')
    return window.open(this.navUrl, '_blank')
  }

  shareOnLinkedIn() {
    this.raiseShareIntreactTelemetry('share', 'linkedin')
    const certDownloadUrl = this.getCertificateUrl()
    
    
    // LinkedIn's current sharing endpoint
    // Note: LinkedIn requires the URL to be publicly accessible
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certDownloadUrl)}`
    
    
    // Open LinkedIn share dialog
    const popup = window.open(linkedInUrl, '_blank', 'width=600,height=600,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1')
    
    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      // Fallback: try opening in same tab
      window.open(linkedInUrl, '_blank')
    }
  }

  shareOnFacebook() {
    this.raiseShareIntreactTelemetry('share', 'facebook')
    const certDownloadUrl = this.getCertificateUrl()
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(certDownloadUrl)}`
    window.open(facebookUrl, '_blank', 'width=600,height=600')
  }

  shareOnTwitter() {
    this.raiseShareIntreactTelemetry('share', 'twitter')
    const certDownloadUrl = this.getCertificateUrl()
    const text = this.data?.isAchievement 
      ? 'I have achieved a milestone! Check out my certificate.'
      : 'I have completed a course! Check out my certificate.'
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(certDownloadUrl)}&text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank', 'width=600,height=600')
  }

  shareOnWhatsApp() {
    this.raiseShareIntreactTelemetry('share', 'whatsapp')
    const certDownloadUrl = this.getCertificateUrl()
    const text = this.data?.isAchievement 
      ? 'I have achieved a milestone! Check out my certificate: '
      : `I have completed a course! Check out my certificate: `
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + certDownloadUrl)}`
    window.open(whatsappUrl, '_blank')
  }

  shareViaEmail() {
    this.raiseShareIntreactTelemetry('share', 'email')
    const certDownloadUrl = this.getCertificateUrl()
    const subject = this.data?.isAchievement 
      ? 'Milestone Achievement Certificate'
      : 'Course Completion Certificate'
    const body = this.data?.isAchievement 
      ? `I have achieved a milestone! You can view my certificate here: ${certDownloadUrl}`
      : `I have completed a course! You can view my certificate here: ${certDownloadUrl}`
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoUrl
  }

  copyCertificateLink() {
    this.raiseShareIntreactTelemetry('share', 'copy')
    const certDownloadUrl = this.getCertificateUrl()
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(certDownloadUrl).then(() => {
        console.log('Certificate link copied to clipboard')
        // You can add a snackbar notification here if needed
      }).catch(err => {
        console.error('Failed to copy certificate link:', err)
        this.fallbackCopyTextToClipboard(certDownloadUrl)
      })
    } else {
      this.fallbackCopyTextToClipboard(certDownloadUrl)
    }
  }

  private fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.width = '2em'
    textArea.style.height = '2em'
    textArea.style.padding = '0'
    textArea.style.border = 'none'
    textArea.style.outline = 'none'
    textArea.style.boxShadow = 'none'
    textArea.style.background = 'transparent'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try {
      document.execCommand('copy')
      console.log('Certificate link copied to clipboard (fallback)')
    } catch (err) {
      console.error('Fallback: Failed to copy', err)
    }
    document.body.removeChild(textArea)
  }

  raiseShareIntreactTelemetry(type?: string, action?: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: `${type}-${WsEvents.EnumInteractSubTypes.CERTIFICATE}`,
        subType:  action ? action : '',
      },
      {
        id: this.data.certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    )
  }

  raiseIntreactTelemetry(action?: string) {
    this.events.raiseInteractTelemetry(
      {
        type: WsEvents.EnumInteractTypes.CLICK,
        id: 'download-certificate',
        subType: action ? action : '',
      },
      {
        id: this.data.certId,   // id of the certificate
        type: WsEvents.EnumInteractSubTypes.CERTIFICATE,
      }
    )
  }

}
