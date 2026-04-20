import { InjectionToken } from '@angular/core'

/**
 * Environment configuration interface
 * This defines the structure of the environment configuration
 * that should be provided by the consuming application
 */
export interface IEnvironment {
  production: boolean
  name?: string
  sitePath?: string
  contentHost?: string
  wsApiPath?: string
  portalURL?: string
  karmYogi?: string
  cbpPortal?: string
  certHost?: string
  azureHost?: string
  azureBucket?: string
}

/**
 * Environment injection token
 * Applications should provide their environment configuration using this token
 * 
 * Example usage in app.module.ts:
 * providers: [
 *   { provide: ENVIRONMENT_TOKEN, useValue: environment }
 * ]
 */
export const ENVIRONMENT_TOKEN = new InjectionToken<IEnvironment>('environment')
