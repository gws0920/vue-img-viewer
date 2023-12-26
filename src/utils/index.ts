export const add = () => console.log('add')
export const minmax = (val: number, [min, max]: [number, number]) => {
  return Math.max(min, Math.min(max, val))
}
