import { capitalize } from 'lodash'

export function parseLangLocal(locales: object, key): string {
  return locales[key.toLowerCase()] || capitalize(key.replace('_', ''))
}
