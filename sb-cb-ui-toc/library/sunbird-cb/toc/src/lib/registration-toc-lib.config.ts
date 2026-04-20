import { NsWidgetResolver } from '@sunbird-cb/resolver-v2'
import { ROOT_WIDGET_CONFIG } from './collection.config'
import { CardCompetencyComponent } from './_collection/_common/card-competency/card-competency.component'
import { CardCompetencyModule } from './_collection/_common/card-competency/card-competency.module'


export const WIDGET_REGISTERED_LIB_MODULES = [
  CardCompetencyModule
]


export const WIDGET_REGISTRATION_TOC_LIB_CONFIG: NsWidgetResolver.IRegistrationConfig[] = [
  {
    widgetType: ROOT_WIDGET_CONFIG.card._type,
    widgetSubType: ROOT_WIDGET_CONFIG.card.card_competency,
    component: CardCompetencyComponent,
  },
]
