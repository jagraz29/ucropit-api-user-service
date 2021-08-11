import { capitalize } from 'lodash'
export function parseLangLocal(
  locales: object,
  key: string,
  alt?
): string | any {
  alt = alt || key
  return locales[key.toLowerCase()] || capitalize(alt.replace('_', ' '))
}
