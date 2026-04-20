import { Injectable } from '@angular/core';
import { NsContent } from '../_models/widget-content.model';
import { NsContentStripWithTabs } from '../_common/content-strip-with-tabs-lib/content-strip-with-tabs-lib.model';
import { NsCommonStrip } from '../_common/common-strip/common-strip.model'

@Injectable({
  providedIn: 'root'
})
export class CommonMethodsService {

  constructor() { }

  transformContentsToWidgets(
    contents: NsContent.IContent[],
    strip: NsContentStripWithTabs.IContentStripUnit | NsCommonStrip.ICommonStripUnit,
  ) {
    return (contents || []).map((content, idx) => (
      content ? {
        widgetType: 'cardLib',
        widgetSubType: 'cardContentLib',
        widgetHostClass: 'mb-2',
        widgetData: {
          content,
          ...(content.batch && { batch: content.batch }),
          cardSubType: strip.stripConfig && strip.stripConfig.cardSubType,
          cardCustomeClass: strip.customeClass ? strip.customeClass : '',
          context: { pageSection: strip.key, position: idx },
          intranetMode: strip.stripConfig && strip.stripConfig.intranetMode,
          deletedMode: strip.stripConfig && strip.stripConfig.deletedMode,
          contentTags: strip.stripConfig && strip.stripConfig.contentTags,
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'cardContent',
        widgetHostClass: 'mb-2',
        widgetData: {},
      }
    ));
  }
  transformSkeletonToWidgets(
    strip: any
  ) {
    return [1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 10].map(_content => ({
      widgetType: 'cardLib',
      widgetSubType: 'cardContentLib',
      widgetHostClass: 'mb-2',
      widgetData: {
        cardSubType: strip.loaderConfig && strip.loaderConfig.cardSubType || 'card-standard-skeleton',
        cardCustomeClass: strip.customeClass ? strip.customeClass : '',
      },
    }));
  }

  handleCapitalize(str: string, type?: string): string {
    let returnValue = ''
    if (str) {
      if (type === 'name') {
        returnValue = str.split(' ').map(_str => {
          return _str.charAt(0).toUpperCase() + _str.slice(1)
        }).join(' ')
      } else {

        returnValue = str && (str.charAt(0).toUpperCase() + str.slice(1))
      }
    }
    return returnValue
  }

  transformContentsToWidgetsWithoutStrip(
    contents: NsContent.IContent[]

  ) {
    return (contents || []).map((content, idx) => (
      content ? {
        widgetType: 'cardLib',
        widgetSubType: 'cardContentLib',
        widgetHostClass: 'mb-2',
        widgetData: {
          content,
          ...(content.batch && { batch: content.batch }),
        },
      } : {
        widgetType: 'card',
        widgetSubType: 'cardContent',
        widgetHostClass: 'mb-2',
        widgetData: {},
      }
    ));
  }

  getCourseUnitIds() {
    return localStorage.getItem('comprehensiveAssessmentCourseUnits')
  }
}
