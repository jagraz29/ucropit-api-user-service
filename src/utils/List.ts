/**
 * Reduce unique array when pass elements duplicates.
 *
 * @param prop
 * @returns
 */
export const uniqByPropMap = (prop: string) => <T>(list: Array<T>) =>
  Array.from(
    list
      .reduce(
        (acc, item) => (item && item[prop] && acc.set(item[prop], item), acc),
        new Map()
      )
      .values()
  )
