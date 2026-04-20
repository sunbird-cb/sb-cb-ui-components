import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { ConfigurationsService, getStringifiedQueryParams } from '@sunbird-cb/utils-v2'
import { NsAutoComplete } from './user-autocomplete.model'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const PROXIES_V8 = '/apis/proxies/v8'
const API_END_POINTS = {
  AUTOCOMPLETE: (query: string) => `${PROXIES_V8}/user/v1/autocomplete/${query}`,
  AUTOCOMPLETE_BY_DEPARTMENT: (query: string) => `${PROTECTED_SLAG_V8}/user/autocomplete/department/${query}`,
  SEARCH_USERS: '/apis/proxies/v8/user/v1/search',
}

@Injectable({
  providedIn: 'root',
})
export class UserAutocompleteService {

  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService
  ) { }

  fetchAutoComplete(
    query: string,
  ): Observable<NsAutoComplete.IUserAutoComplete[]> {
    let url = API_END_POINTS.AUTOCOMPLETE(query)
    const stringifiedQueryParams = getStringifiedQueryParams({
      dealerCode: this.configSvc.userProfile && this.configSvc.userProfile.dealerCode ? this.configSvc.userProfile.dealerCode : undefined,
      sourceFields: this.configSvc.instanceConfig && this.configSvc.instanceConfig.sourceFieldsUserAutocomplete
        ? this.configSvc.instanceConfig.sourceFieldsUserAutocomplete
        : undefined,
    })

    url += stringifiedQueryParams ? `?${stringifiedQueryParams}` : ''

    return this.http.get<NsAutoComplete.IUserAutoComplete[]>(url)
  }

  fetchAutoCompleteV2(
    query: string,
    roleType?: string
  ): Observable<NsAutoComplete.IUserAutoComplete[]> {
    let url = API_END_POINTS.AUTOCOMPLETE(query)
    const stringifiedQueryParams = getStringifiedQueryParams({
      dealerCode: this.configSvc.userProfile && this.configSvc.userProfile.dealerCode ? this.configSvc.userProfile.dealerCode : undefined,
      sourceFields: this.configSvc.instanceConfig && this.configSvc.instanceConfig.sourceFieldsUserAutocomplete
        ? this.configSvc.instanceConfig.sourceFieldsUserAutocomplete
        : undefined,
    })

    url += stringifiedQueryParams ? `?${stringifiedQueryParams}` : ''

    return this.http.get<NsAutoComplete.IUserAutoComplete[]>(url).pipe(
      map((data: any) => {
        const resData: any = []
        if (data && data.params && data.params.status.toLowerCase() === 'success') {
          const tempData = (data.result && data.result.response && data.result.response.count > 0) ? data.result.response.content : []
          if (tempData && tempData.length > 0) {
            tempData.forEach((element: any) => {
              if (element.roles && element.roles.length > 0 && element.roles.filter((v: any) => v.role === roleType).length) {
                if (roleType === 'PROGRAM_COORDINATOR') {
                  resData.push(this.getAutoCompleteData(element))
                } else {
                  if (this.configSvc.userProfile && (element.rootOrgId === this.configSvc.userProfile.rootOrgId)) {
                    resData.push(this.getAutoCompleteData(element))
                  }
                }
              } else if (roleType === 'ANY_ROLE') {
                resData.push(this.getAutoCompleteData(element))
              }
            })
          }
        }
        return resData
      })
    )
  }

  fetchsearchUser(query: string, rootOrgId: string, roleType?: string) {
    const filters: any = {}
    if (rootOrgId) {
      filters.rootOrgId = rootOrgId
    }
    if (roleType) {
      filters['organisations.roles'] = roleType
    }
    const reqBody = {
      request: {
        query,
        filters,
        limit: 20
      }
    }
    const normalizedQuery = query?.toLowerCase() || ''

    return this.http.post<any>(API_END_POINTS.SEARCH_USERS, reqBody).pipe(
      map((data: any) => {
        if (data?.params?.status?.toLowerCase() !== 'success') return []
        const users = data?.result?.response?.count ? data?.result?.response?.content : []

        return users
          ?.filter((u: any) => {
            if (roleType !== 'PROGRAM_COORDINATOR' && u?.rootOrgId !== rootOrgId) return false
            const name = `${u?.firstName || ''} ${u?.lastName || ''}`.toLowerCase().trim()
            const email = u?.profileDetails?.personalDetails?.primaryEmail?.toLowerCase() || ''
            return name.includes(normalizedQuery) || email.includes(normalizedQuery)
          })
          ?.sort((a: any, b: any) =>
            `${a?.firstName || ''} ${a?.lastName || ''}`.toLowerCase()
              .localeCompare(`${b?.firstName || ''} ${b?.lastName || ''}`.toLowerCase())
          )
          ?.map((u: any) => this.getAutoCompleteData(u))
      })
    )
  }

  getAutoCompleteData(resData: any) {
    const tempData = {
      department_name: (resData.rootOrgName) ? resData.rootOrgName : '',
      email: (
        resData.profileDetails && resData.profileDetails.personalDetails
        && resData.profileDetails.personalDetails.primaryEmail
      ) ? resData.profileDetails.personalDetails.primaryEmail : '',
      first_name: (resData.firstName) ? resData.firstName : '',
      // last_name: (resData.lastName) ? resData.lastName : '',
      root_org: '',
      wid: (resData.id) ? resData.id : '',
    }
    return tempData
  }

  fetchAutoCompleteByDept(
    query: string,
    departments: any
  ): Observable<NsAutoComplete.IUserAutoComplete[]> {
    let url = API_END_POINTS.AUTOCOMPLETE_BY_DEPARTMENT(query)

    const stringifiedQueryParams = getStringifiedQueryParams({
      dealerCode: this.configSvc.userProfile && this.configSvc.userProfile.dealerCode ? this.configSvc.userProfile.dealerCode : undefined,
      sourceFields: this.configSvc.instanceConfig && this.configSvc.instanceConfig.sourceFieldsUserAutocomplete
        ? this.configSvc.instanceConfig.sourceFieldsUserAutocomplete
        : undefined,
    })

    url += stringifiedQueryParams ? `?${stringifiedQueryParams}` : ''

    return this.http.post<NsAutoComplete.IUserAutoComplete[]>(
      url,
      { departments }
    )
  }

  searchUser(value: string, rootOrgId: string) {
    const reqBody = {
      request: {
        query: value,
        filters: {
          rootOrgId,
        },
      },
    }

    return this.http.post<any>(`${API_END_POINTS.SEARCH_USERS}`, reqBody)
  }
}
