import './ClimateSource.scss';

export default function ClimateSource() {
  return <p className="climate-source">
    Izvor: {' '}
    <a href="https://meteostat.net/" target="_blank" rel="noopener noreferrer">Meteostat</a>
    {' i njegovi '}<a href="https://dev.meteostat.net/sources" target="_blank" rel="noopener noreferrer">pružatelji podataka</a>
    {' · '}<a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>
    {' · Podaci prilagođeni za prikaz.'}
  </p>;
}
