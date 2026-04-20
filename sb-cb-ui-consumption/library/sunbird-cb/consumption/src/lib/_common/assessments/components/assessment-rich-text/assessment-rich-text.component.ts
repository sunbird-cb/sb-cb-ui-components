import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild, Inject } from '@angular/core'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
declare var CKEDITOR: any
import * as _ from 'lodash'

@Component({
  selector: 'sb-uic-assessment-rich-text',
  templateUrl: './assessment-rich-text.component.html',
  styleUrls: ['./assessment-rich-text.component.scss']
})
export class AssessmentRichTextComponent {

  @ViewChild('editor') editor!: any
  @ViewChild('addBlank') blank!: ElementRef
  blankName = 'Add Blank'
  @Input() name: any
  @Input() specificToolBar!: any
  @Input() showAudioVideoToolBar: any = false
  @Input() ftbCount = 0
  @Input() ftbMaxCount = 0
  @Input() readOnly: boolean = false
  // @Input() showAudioVideoToolBar!: any
  @Output() getContent = new EventEmitter()
  @Output() onTouched = new EventEmitter<void>()
  html = ''
  @Input() set textToBeShown(value: string) {
    this.html = value
  }
  @Input() height = 61

  // All avalible toolbar for CK editor
  // ['Templates', 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'],
  // ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'],
  // ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'],
  // ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-',
  // 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl'],
  // ['Link', 'Unlink', 'Anchor'],
  // ['Image', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'],
  // ['Styles', 'Format', 'Font', 'FontSize'],
  // ['TextColor', 'BGColor'],
  // ['Maximize', 'ShowBlocks']
  // ['Font', 'FontSize', 'Subscript', 'Superscript', 'Videoembed', 'Bold', 'Italic', 'Underline',
  // 'StrikeThrough', 'Image', 'Table', '-', 'PramukhIME', 'PramukhIMEClick', 'PramukhIMEConvert', 'PramukhIMEHelp', {
  //   name: 'Mathjax', items: ['Mathjax'] }]
  // Ends here

  ckEditorConfig: any
  environment: any

  constructor(
    private configSvc: ConfigurationsService,
    @Inject('environment') env: any,
  ) {
    this.environment = env

    // Only run in browser environment
    if (typeof document !== 'undefined' && document && typeof CKEDITOR !== 'undefined') {
      const script: any = document.createElement('script')
      if (!(CKEDITOR.type === '3')) {
        CKEDITOR.type = '3'
        script.type = 'text/javascript'
        // script[('innerHTML')] = CKEDITOR.plugins.addExternal('html5audio', '/assets/js/html5audio/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('html5video', '/assets/js/html5video/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('pramukhime', '/assets/js/pramukhime/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('pastefromword', '/assets/js/pastefromword/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('clipboard', '/assets/js/clipboard/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('uploadfile', '/assets/js/uploadfile/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('uploadimage', '/assets/js/uploadimage/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('uploadwidget', '/assets/js/uploadwidget/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('filetools', '/assets/js/filetools/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('notificationaggregator', '/assets/js/notificationaggregator/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('notification', '/assets/js/notification/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('simpleImageUpload', '/assets/js/simpleImageUpload/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('simpleVideoUpload', '/assets/js/simpleVideoUpload/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('simpleAudioUpload', '/assets/js/simpleAudioUpload/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('keystrokes', '/assets/js/keystrokes/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('eqneditor', '/assets/js/eqneditor/', 'plugin.js') +
        //   CKEDITOR.plugins.addExternal('videoembed', '/assets/js/videoembed/', 'plugin.js')
        // document.getElementsByTagName('head')[0].appendChild(script)
        script[('innerHTML')] = CKEDITOR.plugins.addExternal('simpleImageUpload', '/assets/js/simpleImageUpload/', 'plugin.js')
        script[('innerHTML')] = CKEDITOR.plugins.addExternal('SimpleAudioUpload', '/assets/js/simpleAudioUpload/', 'plugin.js') // NOSONAR
        script[('innerHTML')] = CKEDITOR.plugins.addExternal('simpleVideoUpload', '/assets/js/simpleVideoUpload/', 'plugin.js') // NOSONAR
        document.getElementsByTagName('head')[0].appendChild(script)
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.initiateConfig()
    if (_.get(changes, 'height.currentValue') && this.ckEditorConfig) {
      this.ckEditorConfig['height'] = _.get(changes, 'height.currentValue')
    }
  }

  ngOnInit() {

    this.ckEditorConfig['fileRequestData'] = {
      request: {
        content: {
          contentType: 'Asset',
          createdBy: this.configSvc.userProfile.userId,
          creator: this.configSvc.userProfile.userName,
          mimeType: 'image/png',
          mediaType: 'image',
          language: ['English'],
          license: 'CC BY 4.0',
          primaryCategory: 'Asset',
        },
      },
    }

    // Remove all HTML tags on paste
    setTimeout(() => {
      const editorInstance = this.editor?.instance
      if (editorInstance?.on) {
        // Set readOnly state
        if (this.readOnly && editorInstance.setReadOnly) {
          editorInstance.setReadOnly(true)
        }

        // Blur event - mark as touched
        editorInstance.on('blur', () => {
          this.onTouched.emit()
        })

        // Paste event
        editorInstance.on('paste', (evt: any) => {
          const clipboardData = evt?.data?.dataTransfer || evt?.data?.$

          if (clipboardData?.getData) {
            // Step 1: Get raw pasted HTML or plain text
            const raw =
              clipboardData.getData('text/plain') ||
              clipboardData.getData('text') || ''

            // Step 2: Parse the HTML safely
            if (typeof document === 'undefined' || !document) {
              return
            }
            const tempDiv = document.createElement('div')
            tempDiv.innerHTML = raw

            // Step 3: Remove blocked tags
            const blockedTags = [
              'script',
              'style',
              'alert',
              'img',
              'audio',
              'video',
              'source',
              'iframe',
              'embed',
            ]
            blockedTags.forEach((tag) => {
              tempDiv.querySelectorAll(tag)?.forEach((el) => el.remove())
            })

            // Step 4: Extract plain visible text
            let cleanText = tempDiv?.textContent || tempDiv?.innerText || ''

            // Step 5: Remove emojis (Unicode ranges)
            cleanText = cleanText.replace(
              /([\u2700-\u27BF]|[\uE000-\uF8FF]|\u24C2|[\uD83C-\uDBFF\uDC00-\uDFFF]+|[\u200D\uFE0F])/g,
              ''
            )
            // Step 6: Trim and assign
            evt.data.dataValue = cleanText.replace(/\s+/g, ' ').trim()
          }
        })

        // Drop event - block media/file drops
        editorInstance.on('drop', (evt: any) => {
          evt?.cancel?.()
        })
      }
    }, 500)
  }


  initiateConfig() {
    if (typeof document === 'undefined' || !document || typeof location === 'undefined' || !location) {
      return
    }

    let baseUrl = ''
    if (location.hostname === 'localhost') {
      baseUrl = 'http://localhost:3000/'
    } else {
      baseUrl = this.environment.cbpPortal
    }
    this.ckEditorConfig = {
      height: '50',
      allowedContent: true,
      extraPlugins: 'simpleImageUpload',
      extraAllowedContent: 'a[!href,download,document-href,class]',
      contentCreateUrl: `${baseUrl}apis/proxies/v8/action/content/v3/create`,
      fileUploadUrl: `${baseUrl}apis/proxies/v8/upload/action/content/v3/upload/`,
      artifactUrl: `${this.environment.cbpPortal}assets/public`,
      // Prevent formatting on paste
      forcePasteAsPlainText: true,
      pasteFilter: 'plain-text',
      removeFormatAttributes: '',
      removeFormatTags: 'b,strong,em,i,u,span,font',
      readOnly: this.readOnly,
    }
    if (this.specificToolBar === 'FTB') {
      this.ckEditorConfig['toolbar'] = [
        // tslint:disable-next-line:max-line-length
        [
          'Bold', 'Italic', 'Underline', 'Image',
          'Subscript', 'Superscript', 'NumberedList', 'BulletedList',
          { name: 'Mathjax', items: ['Mathjax'] },
          { name: 'simpleImageUpload', items: ['simpleImageUpload'] },
          { name: 'Blank', items: ['insert'] },
        ],
      ]
    } else if (this.specificToolBar === 'description') {
      this.ckEditorConfig['toolbar'] = [
        // tslint:disable-next-line:max-line-length
        [
          'Bold', 'Italic', 'Underline',
          'Subscript', 'Superscript', 'NumberedList', 'BulletedList', 'Table',
          { name: 'Mathjax', items: ['Mathjax'] },
        ],
      ]
      this.ckEditorConfig['height'] = 160
    } else if (this.specificToolBar === 'instructions') {
      this.ckEditorConfig['toolbar'] = [
        // tslint:disable-next-line:max-line-length
        [
          'Bold', 'Italic', 'Underline', 'Image',
          'Subscript', 'Superscript', 'NumberedList', 'BulletedList',
          { name: 'Mathjax', items: ['Mathjax'] },
          { name: 'simpleImageUpload', items: ['simpleImageUpload'] },
        ],
      ]
      this.ckEditorConfig['height'] = 100
    } else if (this.showAudioVideoToolBar) {
      this.ckEditorConfig['extraPlugins'] = 'simpleImageUpload,simpleAudioUpload,simpleVideoUpload'
      this.ckEditorConfig['toolbar'] = [
        // tslint:disable-next-line:max-line-length
        [
          'Bold', 'Italic', 'Underline', 'Image',
          'Subscript', 'Superscript', 'NumberedList', 'BulletedList', 'Audio', 'Video',
          { name: 'Mathjax', items: ['Mathjax'] },
          { name: 'simpleImageUpload', items: ['simpleImageUpload'] },
          { name: 'simpleAudioUpload', items: ['simpleAudioUpload'] },
          { name: 'simpleVideoUpload', items: ['simpleVideoUpload'] },
        ],
      ]
    } else {
      this.ckEditorConfig['toolbar'] = [
        // tslint:disable-next-line:max-line-length
        [
          'Bold', 'Italic', 'Underline', 'Image',
          'Subscript', 'Superscript', 'NumberedList', 'BulletedList',
          { name: 'Mathjax', items: ['Mathjax'] },
          { name: 'simpleImageUpload', items: ['simpleImageUpload'] },
        ],
      ]
    }

    if (this.showAudioVideoToolBar) {
      this.ckEditorConfig['extraPlugins'] = 'simpleImageUpload,simpleAudioUpload,simpleVideoUpload'
      this.ckEditorConfig['toolbar'] = [
        // tslint:disable-next-line:max-line-length
        [
          'Bold', 'Italic', 'Underline', 'Image',
          'Subscript', 'Superscript', 'NumberedList', 'BulletedList', 'Audio', 'Video',
          { name: 'Mathjax', items: ['Mathjax'] },
          { name: 'simpleImageUpload', items: ['simpleImageUpload'] },
          { name: 'simpleAudioUpload', items: ['simpleAudioUpload'] },
          { name: 'simpleVideoUpload', items: ['simpleVideoUpload'] },
        ],
      ]
    }
  }

  /* tslint:disable */
  onLoad(event: any) {
    /* tslint:disable */
    // console.log('event', event)
  }

  onChange(event: any) {
    this.getContent.emit(event)
  }

  getConfig() {
    return this.ckEditorConfig
  }

  addBlankBtn() {
    if (this.specificToolBar === 'FTB' && this.ftbCount < this.ftbMaxCount) {
      this.editor.instance.insertHtml(' <input style="border-style:none none solid none"> ')
    }
  }


}
