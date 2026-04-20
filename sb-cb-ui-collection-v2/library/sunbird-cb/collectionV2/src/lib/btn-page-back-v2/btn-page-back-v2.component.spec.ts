import { ComponentFixture, TestBed } from '@angular/core/testing'
import { BtnPageBackV2Component } from './btn-page-back-v2.component'
import { RouterTestingModule } from '@angular/router/testing'
import { ConfigurationsService } from '@sunbird-cb/utils-v2'
import { BtnPageBackV2Service } from './btn-page-back-v2.service'
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'

describe('BtnPageBackV2Component', () => {
  let component: BtnPageBackV2Component
  let fixture: ComponentFixture<BtnPageBackV2Component>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BtnPageBackV2Component],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ConfigurationsService,
          useValue: {
            instanceConfig: {
              hubs: []
            }
          }
        },
        BtnPageBackV2Service
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnPageBackV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
