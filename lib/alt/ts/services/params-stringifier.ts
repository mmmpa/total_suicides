export function stringifyParams(x, xSpecified, y, ySpecified, z):string {
  return [x, xSpecified, y, ySpecified, z].join('_');
}

export function retrieveBaseParams(stringified:string):FetchingParams {
  let [x, xSpecifiedSrc, y, ySpecified, z]= stringified.split('_');
  let xSpecified = xSpecifiedSrc.split(',');

  return new FetchingParams({x, y, z, xSpecified, ySpecified, src: stringified});
}

export function retrieveParams(stringified:string, base:FetchingParams):FetchingParams {
  let [y, ySpecified, z]= stringified.split('_');
  let {x, xSpecified} = base;

  return new FetchingParams({x, y, z, xSpecified, ySpecified, src: stringified});
}

export class FetchingParams {
  x;
  y;
  z;
  xSpecified;
  ySpecified;
  gender;
  area;
  year;
  detail;
  detailName;
  src;

  constructor({x, y, z, xSpecified, ySpecified, src}) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xSpecified = xSpecified;
    this.ySpecified = ySpecified;
    this.src = src;

    if (x) {
      _.zip([x, y], [xSpecified, ySpecified]).forEach(([key, value])=> {
        switch (key) {
          case 'area':
            this.area = value;
            break;
          case 'year':
            this.year = value;
            break;
          case 'gender':
            this.gender = value;
            break;
          default:
            this.detailName = key;
            this.detail = value;
        }
      });
    }

    if (!this.area) {
      this.area = '0'
    }

    if (!this.gender) {
      this.gender = '0'
    }

    if (!this.year) {
      this.year = z
    }


    if (!this.detailName) {
      this.detailName = 'total';
      this.detail = 'number';
    }
  }

  stringify():string {
    return [this.x, this.xSpecified, this.y, this.ySpecified, this.z].join('_');
  }

  additionalStringify():string {
    return [this.y, this.ySpecified, this.z].join('_');
  }
}