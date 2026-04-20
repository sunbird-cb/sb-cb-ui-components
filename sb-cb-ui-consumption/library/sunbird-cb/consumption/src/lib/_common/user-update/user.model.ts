import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export const NOTIFICATION_TIME = 5
export const AVAILABLE_LOCALES = [
  'en',
]

export namespace NSApiRequest {
  export interface ICreateNewUser {
    personalDetails: {
      email: string,
      userName: string,
      firstName: string,
      // lastName: string,
      channel: string,
      phone: number,
      roles?: any
    }
  }

  export interface IAssignUserRoles {
    request: {
      organisationId?: string,
      userId: string,
      roles: string[]
    }
  }

}

export function preventHtmlAndJs(): ValidatorFn {
  const pattern = /<[^>]*>|(function\s*\([^)]*\))|(javascript:[^\s]+)/i
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value
    if (Array.isArray(value)) {
      value.forEach((element: any) => {
        if (element && element.length && element.match(pattern)) {
          return { hasHtml: true }
        }
        return null
      })
    } else {
      if (value && value.length > 0 && value.match(pattern)) {
        return { hasHtml: true }
      }
    }
    return null
  }
}
