import { Component, OnInit, Input, Injector, Type, ChangeDetectionStrategy, ChangeDetectorRef, SimpleChanges, OnChanges } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { DomSanitizer } from '@angular/platform-browser'
import { ConfigurationsService, EventService } from '@sunbird-cb/utils-v2'
import { UtilityService } from '@sunbird-cb/utils-v2'
import { TranslateService } from '@ngx-translate/core'
import { MultilingualTranslationsService } from '@sunbird-cb/utils-v2'
import * as _ from 'lodash'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar } from '@angular/material/snack-bar'
import { EditorDialogComponent } from '../../micro-sites-components/components/editor-dialog/editor-dialog.component'
import { SlwConfigDialogComponent } from '../../micro-sites-components/components/slw-config-dialog/slw-config-dialog.component'
import { cloneDeep } from 'lodash'
import { HttpClient } from '@angular/common/http' // Add this import

// Import component types
import { TopSectionComponent } from '../../micro-sites-components/components/top-section/top-section.component'
import { LookerSectionComponent } from '../../micro-sites-components/components/looker-section/looker-section.component'
import { TopLearnersComponent } from '../../micro-sites-components/components/top-learners/top-learners.component'
import { MainContentComponent } from '../../micro-sites-components/components/main-content/main-content.component'
import { SupportSectionComponent } from '../../micro-sites-components/components/support-section/support-section.component'
import { HighlightsOfWeekComponent } from '../../../highlights-of-week/highlights-of-week.component'
import { UserProgressComponent } from '../../../user-progress/user-progress.component'
import { SpeakersComponent } from '../../../speakers/speakers.component'
import { MicrositeV3Service } from '../../../../_services/microsite-v3.service'
import { map, switchMap } from 'rxjs/operators'

@Component({
  selector: 'sb-uic-mdo-channel-v3',
  templateUrl: './mdo-channel-v3.component.html',
  styleUrls: ['./mdo-channel-v3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MdoChannelV3Component implements OnInit, OnChanges {
  @Input() sectionList: any[] = [];
  @Input() slwConfiguration: any
  @Input() userRedirectionData: any
  @Input() isEdit: boolean = false;
  activeSections: any[] = [];
  @Input() providerId: string = '123456789';
  @Input() channelName: string
  @Input() orgId: string
  @Input() defaultMicrosite: boolean = false;

  isMobile: boolean = false;
  isStateLearningWeekEnabled: boolean = false;
  hasUnsavedChanges: boolean = false;
  userRedirectionEnabled: any
  isLoading: boolean = false;

  navigationTitles = [
    { title: 'Learn', url: '/page/learn', icon: 'school', disableTranslate: false },
    { title: 'MDO Channels', url: '/app/learn/mdo-channels/all-channels', icon: '', disableTranslate: true }
  ];

  private componentRegistry: { [key: string]: Type<any> } = {
    'topSection': TopSectionComponent,
    'lookerSection': LookerSectionComponent,
    'topLearners': TopLearnersComponent,
    'mainContent': MainContentComponent,
    'supportSection': SupportSectionComponent,
    'weekHighlights': HighlightsOfWeekComponent,
    'userProgress': UserProgressComponent,
    'speakers': SpeakersComponent
  };

  private _eventCallbackFn: (event: any) => void
  private injectorCache: Map<string, Injector> = new Map();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private translate: TranslateService,
    private langTranslations: MultilingualTranslationsService,
    public configSvc: ConfigurationsService,
    private sanitizer: DomSanitizer,
    private utilsSvc: UtilityService,
    private injector: Injector,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    public microSiteV3Service: MicrositeV3Service,
    private snackBar: MatSnackBar,
  ) {
    this.isMobile = this.utilsSvc.isMobile;

    // Make component globally accessible for direct access
    (window as any).mdoChannelComponent = this
  }

  ngOnInit() {
    // Create a callback function for child components
    this._eventCallbackFn = (event: any) => this.handleSectionEvent(event);

    // Set global injector data for components that can't use Angular's DI properly
    (window as any).__INJECTOR_DATA = {
      isEditable: true, // Force this to true for now to enable editing
      eventCallback: this._eventCallbackFn
    };

    // Set up global callbacks
    (window as any).INJECTED_CALLBACKS = {
      ...(window as any).INJECTED_CALLBACKS || {},
      highlightsOfWeek: this._eventCallbackFn
    }

    // Get active sections
    this.activeSections = this.sectionList?.filter(section => section.enabled)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) || []

    // Trigger change detection after initialization
    this.cdr.detectChanges()

    // Get channel info from route
    this.route.params.subscribe(params => {
      if (params.channelId) {
        this.channelName = params.channelName || ''
        this.orgId = params.channelId
        this.cdr.detectChanges()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes.sectionList && !changes.sectionList.firstChange) ||
      (changes.slwConfiguration && !changes.slwConfiguration.firstChange)) {
      this.injectorCache.clear()
      this.hasUnsavedChanges = true // Enable Save button only after first change

      // Recalculate active sections when sectionList changes
      if (changes.sectionList) {
        this.activeSections = this.sectionList?.filter(section => section.enabled)
          .sort((a, b) => (a.order || 0) - (b.order || 0)) || []
      }

      // Trigger change detection
      this.cdr.detectChanges()
    }
  }

  handleSectionEvent(event: any) {
    // Handle events from child components

    // Check for undefined or null event
    if (!event) {
      console.error('Received null/undefined event')
      return
    }

    // Raise telemetry for the event
    if (event.action) {
      this.raiseTelemetry(`${event.source}-${event.id || 'unknown'}`)
    }

    // Handle specific events
    if (event.action === 'view-all' && event.data?.viewMoreUrl) {
      this.router.navigateByUrl(event.data.viewMoreUrl)
    }

    // Handle edit events
    if (event.action === 'edit') {
      this.openEditorDialog(event)
    }

    // Handle playlist updates
    if (event.action === 'playlist-updated') {
      this.injectorCache.clear()
      this.hasUnsavedChanges = true
      this.cdr.detectChanges()
    }

    // Handle playlist created
    if (event.action === 'playlist-created') {
      this.injectorCache.clear()
      this.hasUnsavedChanges = true
      this.cdr.detectChanges()
    }

    // Handle section visibility toggled
    if (event.action === 'section-visibility-toggled' || event.action === 'strip-removed') {
      this.hasUnsavedChanges = true
      // this.updateStripSections(event.data?.stripSections)
    }



    // Handle strip sections updates (only from notifyStripSectionsChange)
    if (event.action === 'update-strip-sections') {
      this.updateStripSections(event.data?.stripSections)
    }
  }

  updateStripSections(stripSections: any[]) {
    // Find the mainContent section and update its stripsArray data
    const mainContentSection = this.sectionList?.find(section => section.key === 'sectionMain')

    if (mainContentSection) {
      // Check if columns exist and find mainContent column
      if (mainContentSection.column && Array.isArray(mainContentSection.column)) {
        const mainContentColumn = mainContentSection.column.find(col => col.key === 'mainContent')
        if (mainContentColumn && mainContentColumn.data) {
          // Update stripsArray in the column's data using spread operator
          if (!mainContentColumn.data.stripsArray) {
            mainContentColumn.data.stripsArray = []
          }
          mainContentColumn.data.stripsArray = [...mainContentColumn.data.stripsArray, ...stripSections]
          this.hasUnsavedChanges = true

          // Force immediate change detection
          this.cdr.detectChanges()
          return
        }
      }

      // If no columns or mainContent column not found, update directly in section data
      if (!mainContentSection.data) {
        mainContentSection.data = {}
      }
      if (!mainContentSection.data.stripsArray) {
        mainContentSection.data.stripsArray = []
      }
      mainContentSection.data.stripsArray = [...stripSections]
      this.hasUnsavedChanges = true

      // Force immediate change detection
      this.cdr.detectChanges()
    }
  }

  getSectionComponent(key: string): Type<any> {
    return this.componentRegistry[key] || null
  }

  createInjector(section: any, column: any): Injector {
    // Create a stable reference to the callback function if not already created
    if (!this._eventCallbackFn) {
      this._eventCallbackFn = (event: any) => this.handleSectionEvent(event)
    }

    // Create a cache key based on section and column keys
    const cacheKey = `${section.key}-${column.key}`

    // Return cached injector if available
    if (this.injectorCache.has(cacheKey)) {
      return this.injectorCache.get(cacheKey)!
    }

    // Update global injector data
    (window as any).__INJECTOR_DATA = {
      isEditable: (column.key === 'weekHighlights' || column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit,
      isEdit: (column.key === 'weekHighlights' || column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit,
      eventCallback: this._eventCallbackFn,
      sectionData: column.data,
      channelName: this.channelName,
      orgId: this.orgId
    }

    // Create new injector
    const injector = Injector.create({
      providers: [
        { provide: 'sectionData', useValue: (column.key === 'topLearners') ? column : column.data },
        { provide: 'channelName', useValue: this.channelName },
        { provide: 'orgId', useValue: this.orgId },
        { provide: 'isMobile', useValue: this.isMobile },
        { provide: 'isEdit', useValue: (column.key === 'weekHighlights' || column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit },
        { provide: 'slwConfiguration', useValue: this.slwConfiguration },
        { provide: 'providerId', useValue: this.orgId },
        { provide: 'eventCallback', useValue: this._eventCallbackFn },
        { provide: 'isEditable', useValue: (column.key === 'weekHighlights' || column.key === 'userProgress' || column.key === 'speakers') ? true : this.isEdit }
      ],
      parent: this.injector
    })

    // Cache the injector
    this.injectorCache.set(cacheKey, injector)

    return injector
  }

  trackByFn(index: number, item: any): any {
    return item.version || item.key || index
  }

  raiseTelemetry(name: string) {
    this.eventSvc.raiseInteractTelemetry(
      {
        type: 'click',
        subType: 'mdo-channel',
        id: `${_.kebabCase(name).toLowerCase()}`
      },
      {},
      { module: 'LEARN' }
    )
  }

  // Add new method to handle edit dialog
  openEditorDialog(event: any) {
    const dialogWidth = this.getDialogWidth(event.data.fieldType)

    // Debug logs for all configurations

    // Get the actual value to pass to the dialog
    let dialogValue = event.data.value

    // Special handling for weekHighlights - retrieve from nested structure
    if (event.data.fieldType === 'weekHighlights') {
      // Find the mainContent section and log its current weekHighlights data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.weekHighlights) {
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.weekHighlights.data
          }
        }
      }
    }

    // Special handling for userProgressConfig - retrieve from nested structure
    if (event.data.fieldType === 'userProgressConfig') {
      // Find the mainContent section and get its myprogress data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.myprogress) {
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.myprogress
          }
        }
      }
    }
    // Special handling for eventsConfig - retrieve from nested structure
    if (event.data.fieldType === 'eventsConfig') {
      // Find the mainContent section and get its events data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.events) {
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.events
          }
        }
      }
    }

    // Special handling for mdoLeaderboardConfig - retrieve from nested structure
    if (event.data.fieldType === 'mdoLeaderboardConfig') {
      // Find the mainContent section and get its mdoLeaderboard data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.mdoLeaderboard) {
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.mdoLeaderboard
          }
        }
      }
    }

    // Special handling for cbpPlanConfig - retrieve from nested structure
    if (event.data.fieldType === 'cbpPlanConfig') {
      // Find the mainContent section and get its cbpPlan data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.cbpPlanSection) {
            // Use the nested data for the dialog
            dialogValue = column.data.cbpPlanSection?.data
          }
        }
      }
    }
    // Special handling for speakersConfig - retrieve from nested structure
    if (event.data.fieldType === 'speakersConfig') {
      // Find the mainContent section and get its speakers data
      for (const section of this.sectionList) {
        for (const column of section.column) {
          if (column.key === 'mainContent' && column.data?.stateLearningWeekSection?.speakerOftheDay) {
            // Use the nested data for the dialog
            dialogValue = column.data.stateLearningWeekSection.speakerOftheDay
          }
        }
      }
    }
    const dialogRef = this.dialog.open(EditorDialogComponent, {
      width: dialogWidth,
      data: {
        fieldName: event.data.fieldName,
        displayName: event.data.displayName,
        value: dialogValue,  // Use the retrieved value
        fieldType: event.data.fieldType,
        section: event.source
      }, autoFocus: false
    })

    // After dialog close
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true
        // Use updateSectionData method to update section data
        this.updateSectionData(event.source, event.data.fieldName, result)

        this.isLoading = false
      }
    })
  }

  // Helper method to determine dialog width based on field type
  private getDialogWidth(fieldType: string): string {
    switch (fieldType) {
      case 'textarea':
      case 'slider':
      case 'metrics':
      case 'weekHighlights':
      case 'userProgressConfig':
      case 'speakersConfig':
      case 'eventsConfig':
      case 'mdoLeaderboardConfig':
      case 'cbpPlanConfig':
      case 'keyHighlights':
        return '800px'
      case 'announcementsConfig':
      case 'lookerConfig':
      case 'image':
      case 'color':
        return '600px'
      default:
        return '400px'
    }
  }

  // Method to update section data
  private updateSectionData(sectionType: string, fieldName: string, newValue: any) {
    // Make a deep copy to avoid modifying the original reference
    const updatedSections = cloneDeep(this.sectionList)
    let updated = false

    // Special handling for speakersConfig
    if (fieldName === 'speakersConfig' && sectionType === 'speakers') {
      // Find the section with speakers
      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'mainContent') {
            // Ensure nested objects exist before assignment (avoid optional-chaining on LHS)
            if (!column.data) {
              column.data = {}
            }
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.speakerOftheDay) {
              column.data.stateLearningWeekSection.speakerOftheDay = {}
            }
            column.data.stateLearningWeekSection.speakerOftheDay = newValue?.speakerOftheDay

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for announcementsConfig
    if (fieldName === 'announcementsConfig' && sectionType === 'announcements') {
      // Find the section with speakers
      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'mainContent') {
            // Ensure nested objects exist before assignment (avoid optional-chaining on LHS)
            if (!column.data) {
              column.data = {}
            }
            if (!column.data.announcementSection) {
              column.data.announcementSection = {}
            }
            column.data.announcementSection.data = newValue

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for weekHighlights
    else if (fieldName === 'weekHighlights' && sectionType === 'weekHighlights') {
      // weekHighlights is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.weekHighlights.data
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the weekHighlights
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.weekHighlights) {
            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.weekHighlights) {
              column.data.stateLearningWeekSection.weekHighlights = { enabled: true }
            }
            if (!column.data.stateLearningWeekSection.weekHighlights.data) {
              column.data.stateLearningWeekSection.weekHighlights.data = {}
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.stateLearningWeekSection.weekHighlights.data.title = newValue.title
            column.data.stateLearningWeekSection.weekHighlights.data.list = JSON.parse(JSON.stringify(newValue.list))

            updated = true
            break
          }
        }
        if (updated) break
      }

    }

    // Special handling for userProgressConfig (myprogress)
    else if (fieldName === 'userProgressConfig' && sectionType === 'userProgress') {
      // myprogress is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.myprogress
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the myprogress
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.myprogress) {
            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.myprogress) {
              column.data.stateLearningWeekSection.myprogress = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            // The newValue contains the full userProgress config, we store it under myprogress
            column.data.stateLearningWeekSection.myprogress = JSON.parse(JSON.stringify(newValue))

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Also handle if it comes as 'myprogress' directly
    else if ((fieldName === 'myprogress' || fieldName === 'userProgressConfig') &&
      (sectionType === 'mainContent' || sectionType === 'myprogress' || sectionType === 'userProgress')) {
      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.myprogress) {
            if (!column.data) {
              column.data = {}
            }

            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.myprogress) {
              column.data.stateLearningWeekSection.myprogress = { enabled: true }
            }

            column.data.stateLearningWeekSection.myprogress = JSON.parse(JSON.stringify(newValue))

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for eventsConfig
    else if (fieldName === 'eventsConfig' && sectionType === 'events') {
      // events is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.events
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the events
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.events) {
            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.events) {
              column.data.stateLearningWeekSection.events = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.stateLearningWeekSection.events = JSON.parse(JSON.stringify(newValue))

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for mdoLeaderboardConfig
    else if (fieldName === 'mdoLeaderboardConfig' && sectionType === 'mdoLeaderboard') {
      // mdoLeaderboard is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.mdoLeaderboard
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the mdoLeaderboard
          if (column.key === 'mainContent' || column.data?.stateLearningWeekSection?.mdoLeaderboard) {
            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection = {}
            }
            if (!column.data.stateLearningWeekSection.mdoLeaderboard) {
              column.data.stateLearningWeekSection.mdoLeaderboard = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.stateLearningWeekSection.mdoLeaderboard = JSON.parse(JSON.stringify(newValue))

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for cbpPlanConfig
    else if (fieldName === 'cbpPlanConfig' && sectionType === 'cbpPlan') {
      // cbpPlan is nested inside mainContent column's data structure
      // Path: column.data.stateLearningWeekSection.cbpPlan
      for (const section of updatedSections) {
        for (const column of section.column) {
          // Look for mainContent column which contains the cbpPlan
          if (column.key === 'mainContent' || column.data?.cbpPlanSection) {
            if (!column.data) {
              column.data = {}
            }

            // Ensure the nested structure exists
            if (!column.data.cbpPlanSection) {
              column.data.cbpPlanSection = {}
            }
            if (!column.data.cbpPlanSection.data) {
              column.data.cbpPlanSection.data = { enabled: true }
            }

            // Update the nested data with deep copy to avoid reference issues
            column.data.cbpPlanSection.data = JSON.parse(JSON.stringify(newValue))

            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Special handling for lookerConfig
    else if (fieldName === 'lookerConfig' && sectionType === 'lookerSection') {
      // lookerConfig is in the lookerSection column data
      for (const section of updatedSections) {
        for (const column of section.column) {
          if (column.key === 'lookerSection') {
            if (!column.data) {
              column.data = {}
            }
            column.data.enabled = newValue.enabled
            if (!column.data.header) {
              column.data.header = {}
            }
            column.data.header.headerText = newValue.header?.headerText || ''
            column.data.header.description = newValue.header?.description || ''
            column.data.desktopHeight = newValue.desktopHeight ? `${newValue.desktopHeight}px` : '600px'
            column.data.mobileHeight = newValue.mobileHeight ? `${newValue.mobileHeight}px` : '400px'
            column.data.lookerProDesktopUrl = newValue.lookerProDesktopUrl
            column.data.lookerProMobileUrl = newValue.lookerProMobileUrl
            updated = true
            break
          }
        }
        if (updated) break
      }
    }

    // Regular handling for other field types
    if (!updated) {
      // Find the relevant section and column
      for (const section of updatedSections) {
        if (!section.enabled) continue

        for (const column of section.column) {
          if (column.key === sectionType && column.data) {

            // Special handling for keyHighlights which is nested under stateLearningWeekSection
            if (fieldName === 'keyHighlights' && column.data.stateLearningWeekSection) {
              column.data.stateLearningWeekSection.keyHighlights = newValue
              updated = true
            } else {
              // Update other fields using the nested field helper
              this.updateNestedField(column.data, fieldName, newValue)
              updated = true
            }
            break
          }
        }
        if (updated) break
      }
    }

    // Clear the injector cache to force component recreation
    this.injectorCache.clear()

    // Update the sectionList with new reference (this will trigger change detection)
    this.sectionList = updatedSections

    // Update active sections with new reference
    this.activeSections = this.sectionList.filter(section => section.enabled)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    // Mark for change detection
    this.hasUnsavedChanges = true

    // Force change detection to ensure UI updates
    this.cdr.detectChanges()
  }

  // Helper method to update nested fields
  private updateNestedField(obj: any, path: string, value: any) {
    // Handle nested paths (e.g., "sliderData.styleData.borderRadius")
    const parts = path.split('.')
    let current = obj

    // Navigate to the parent object
    for (let i = 0; i < parts.length - 1; i++) {
      if (!current[parts[i]]) {
        current[parts[i]] = {}
      }
      current = current[parts[i]]
    }

    // Update the final property
    current[parts[parts.length - 1]] = value
  }

  // Action handlers
  toggleStateLearningWeek() {
    this.isStateLearningWeekEnabled = !this.isStateLearningWeekEnabled
    this.hasUnsavedChanges = true
    this.cdr.detectChanges()

    // Raise telemetry
    this.raiseTelemetry('toggle-state-learning-week')
  }

  saveChanges(type?: string) {
    // Prepare payload
    const payload = {
      request: {
        type: 'mdo-channel',
        subType: (type === 'publish') ? 'microsite-v3' : 'microsite-v3-preview',
        action: 'page-configuration',
        component: 'portal',
        framework: '*',
        data: {
          stateLearningWeekConfig: this.slwConfiguration || {},
          sectionList: this.sectionList || [],
          userRedirectionData: {
            enabled: this.userRedirectionEnabled || false,
            orgId: this.orgId || '',
            channelName: this.channelName || ''
          }
        },
        rootOrgId: this.orgId || ''
      }
    }
    if (this.defaultMicrosite) {
      // Call the API
      this.microSiteV3Service.createMicrosite(payload).subscribe({
        next: async (res) => {
          if (type === 'publish') {
            const updateOrgBookmarkPromises: Promise<any>[] = []
            updateOrgBookmarkPromises.push(this.updateOrgBookmark())
          }
          this.snackBar.open('Microsite Created successfully')
          this.hasUnsavedChanges = false
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error('Form update failed:', err)
        }
      })
      // Raise telemetry
      this.raiseTelemetry('update-changes')
    } else {
      // Call the API
      this.microSiteV3Service.updateMicrosite(payload).subscribe({
        next: async (res) => {
          if (type === 'publish') {
            const updateOrgBookmarkPromises: Promise<any>[] = []
            updateOrgBookmarkPromises.push(this.updateOrgBookmark())
            await Promise.all(updateOrgBookmarkPromises)
            this.snackBar.open('Microsite published successfully')
          } else {
            this.snackBar.open('Microsite updated successfully')
          }

          this.hasUnsavedChanges = false
          this.cdr.detectChanges()
        },
        error: (err) => {
          console.error('Form update failed:', err)
        }
      })
      // Raise telemetry
      this.raiseTelemetry('update-changes')
    }
  }

  updateOrgBookmark() {
    return new Promise<boolean>((resolve) => {
      this.microSiteV3Service.readOrgBookmark().pipe(
        switchMap((bookmarkRes: any) => {
          if (bookmarkRes?.result?.data?.orgList?.length) {
            if (!bookmarkRes.result.data.orgList.find((org: any) => org.rootOrgId === this.orgId)) {
              const tempData = []
              bookmarkRes?.result?.data?.orgList.forEach((org: any) => {
                tempData.push(org.rootOrgId)
              })
              const reqBody: any = {
                orgBookmarkId: '',
                title: this.configSvc.orgReadData.channel || '',
                description: this.configSvc.orgReadData.description || '',
                category: this.configSvc.orgReadData.category || 'MDO_ORG_LIST',
                orgId: this.configSvc.orgReadData.rootOrgId || '',
                orgList: [this.orgId, ...tempData],
              }
              // Only include imgUrl if it's a valid non-empty string
              if (this.configSvc.orgReadData.imgUrl && this.configSvc.orgReadData.imgUrl.trim() !== '') {
                reqBody.imageUrl = this.configSvc.orgReadData.imgUrl
              }
              return this.microSiteV3Service.updateOrgBookmark(reqBody).pipe(
                map((res: any) => {
                  return res
                })
              )
            }
          }
          return bookmarkRes
        })
      ).subscribe({
        next: (bookmarkRes: any) => {
          resolve(true)
        },
        error: (err) => {
          console.error('Error reading org bookmark:', err)
          resolve(false)
        }
      })
    })
  }

  publishChanges() {
    this.saveChanges('publish')
    // Implement publish logic here
    // Raise telemetry
    this.raiseTelemetry('publish-changes')
    // You can emit an event or call a service to publish the data
  }

  // Add method to open SLW configuration dialog
  openSLWConfigDialog(currentConfig: any) {
    const dialogRef = this.dialog.open(SlwConfigDialogComponent, {
      width: '800px',
      maxHeight: '90vh',
      disableClose: false,
      data: currentConfig || {
        enabled: true,
        startDate: '',
        endDate: '',
        title: 'State Learning Week',
        description: '',
        titleHi: '',
        descriptionHi: '',
        buttonText: 'View More',
        width: '30px',
        orgId: this.orgId,
        orgName: ''
      },
      autoFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update SLW configuration
        this.slwConfiguration = result
        this.isStateLearningWeekEnabled = result.enabled
        this.hasUnsavedChanges = true
        this.cdr.detectChanges()
      } else {
        // If dialog was cancelled, disable SLW
        this.isStateLearningWeekEnabled = false
        if (this.slwConfiguration) {
          this.slwConfiguration.enabled = false
        }
        this.hasUnsavedChanges = true
        this.cdr.detectChanges()
      }
    })
  }

  handleToggleSLW() {
    if (this.slwConfiguration) {
      this.slwConfiguration.enabled = !this.slwConfiguration.enabled
      this.hasUnsavedChanges = true
      this.cdr.detectChanges()
    }
  }

  handleConfigureSLW(currentConfig: any) {
    this.openSLWConfigDialog(currentConfig)
  }

  handleUserRedirectionToggle(enabled: boolean) {
    this.userRedirectionEnabled = enabled
    this.hasUnsavedChanges = true
    this.cdr.detectChanges()
  }


}