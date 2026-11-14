// Display rounding only. Package arithmetic always uses the original amounts in cents.
const formatter=new Intl.NumberFormat('hr-HR',{maximumFractionDigits:0,minimumFractionDigits:0});
export const editorialMoney=cents=>formatter.format(Math.round(cents/100))+' €';
export const editorialShortMoney=cents=>formatter.format(Math.round(cents/100))+'€';
