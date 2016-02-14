export function stringifyParams(gender, area, year, detailName, x, xSpecified, y, ySpecified, z){
  let uri = [gender, area, year, detailName].join('_');
  let filter = [x, xSpecified, y, ySpecified, z].join('_');

  return [uri, filter].join('__');
}

export function retrieveParams(stringified:string){
  let src = stringified.split('__');
  let [gender, area, year, detailName] = src[0].split('_');
  let [x, xSpecifiedSrc, y, ySpecified, z]= src[1].split('_');
  let xSpecified = xSpecifiedSrc.split(',');
  return {gender, area, year, detailName, x, xSpecified, y, ySpecified, z};
}