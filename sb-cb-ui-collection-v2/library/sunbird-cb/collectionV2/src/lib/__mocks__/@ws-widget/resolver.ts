
export class WidgetBaseComponent {
  constructor() { }
}

export namespace NsWidgetResolver {
  export interface IWidgetData<T> {
    widgetData?: T
    widgetSubType?: string
    widgetType?: string
  }
}
