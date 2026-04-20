/**
 * NsAutoComplete namespace - stub model for autocomplete functionality
 */
export namespace NsAutoComplete {
  export interface IUserAutoComplete {
    wid?: string
    userId?: string
    email?: string
    firstName?: string
    lastName?: string
    displayName?: string
    name?: string
    profileImage?: string
    department?: string
    departmentName?: string
  }

  export interface IAutoCompleteConfig {
    placeholder?: string
    minLength?: number
    debounceTime?: number
    maxResults?: number
  }

  export interface IAutoCompleteResult {
    results: IUserAutoComplete[]
    total: number
  }
}
