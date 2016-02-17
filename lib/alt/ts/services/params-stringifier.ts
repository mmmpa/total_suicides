export function stringifyParams(x, xSpecified, y, ySpecified, z):string {
  return [x, xSpecified, y, ySpecified, z].join('__');
}

export function retrieveBaseParams(stringified:string):ChartBase {
  let [x, xSpecifiedSrc]= stringified.split('__');
  let xSpecified = xSpecifiedSrc.split(',');

  return new ChartBase(x, xSpecified, stringified);
}

export function retrieveParams(stringified:string, base:ChartBase):FetchingParams {
  let [y, ySpecified, z]= stringified.split('__');

  return new FetchingParams(base, {y, z, ySpecified, src: stringified});
}

export class ChartBase {
  constructor(public x:string, public xSpecified:any[], public src?:string) {
  }

  stringify():string {
    return [this.x, this.xSpecified].join('__');
  }
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

  constructor(base:ChartBase, {y, z, ySpecified, src}) {
    this.x = base.x;
    this.y = y;
    this.z = z;
    this.xSpecified = base.xSpecified;
    this.ySpecified = ySpecified;
    this.src = src;

    if (base) {
      _.zip([base.x, y], [base.xSpecified, ySpecified]).forEach(([key, value])=> {
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
    return [this.y, this.ySpecified, this.z].join('__');
  }
}