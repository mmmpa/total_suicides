export function retrieveBaseParams(stringified:string):ChartBase {
  let [x, xSpecifiedSrc]= stringified.split('__');
  let xSpecified = xSpecifiedSrc.split(',').map((v)=> {
    let num = +v;
    return isNaN(num) ? v : num;
  });

  return new ChartBase(x, xSpecified, stringified);
}

export function retrieveParams(stringified:string, base:ChartBase):FetchingParams {
  let [y, ySpecified, zSpecified, chartType]= stringified.split('__');

  return new FetchingParams(base, {y, zSpecified, ySpecified, chartType, src: stringified});
}

export class ChartBase {
  constructor(public x:string, public xSpecified:any[], public src?:string) {
  }

  stringify():string {
    return [this.x, this.xSpecified].join('__');
  }
}

interface FetchingParamsParams{
  y:string,
  ySpecified:string,
  zSpecified:string,
  src?:string,
  chartType?:string
}

export class FetchingParams {
  x;
  y;
  zSpecified;
  xSpecified;
  ySpecified;
  gender;
  area;
  year;
  detail;
  detailName;
  chartType;
  src;

  constructor(base:ChartBase, {y, zSpecified, ySpecified, src, chartType}:FetchingParamsParams) {
    this.x = base.x;
    this.y = y;
    this.zSpecified = zSpecified;
    this.xSpecified = base.xSpecified;
    this.ySpecified = ySpecified;
    this.src = src;
    this.chartType = chartType;

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
      this.year = zSpecified
    }

    if (!this.detailName) {
      this.detailName = 'total';
      this.detail = 'number';
    }
  }

  stringify():string {
    return [this.y, this.ySpecified, this.zSpecified, this.chartType].join('__');
  }

  stringifyAll():string {
    return [this.x, this.xSpecified, this.y, this.ySpecified, this.zSpecified, this.chartType].join('__');
  }
}