/**
 * Profile revamp model definitions
 */
export interface designation {
  id?: string
  name?: string
  description?: string
}

export interface IProfileRevamp {
  designation?: designation
  department?: string
  organization?: string
  location?: string
}
