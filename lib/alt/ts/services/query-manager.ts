export function pickEnabledFromQuery(query, name:string):boolean {
  let target = query[name];
  return target && target != 'false'
}

export function pickSelectedFromQuery(query, name:string) {
  let target = query[name];
  if (!target) {
    return [];
  }
  return target.toString().split(',').map((n)=> +n)
}
