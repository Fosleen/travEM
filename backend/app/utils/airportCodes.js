export function normalizeAirportCodes(value) {
  const items = value == null || value === '' ? [] : typeof value === 'string' ? value.split(',') : value;
  if (!Array.isArray(items)) throw new Error('IATA kodovi moraju biti popis.');
  const codes = items.map(code => String(code).trim().toUpperCase()).filter(Boolean);
  if (codes.some(code => !/^[A-Z]{3}$/.test(code))) throw new Error('Svaki IATA kod mora imati točno tri slova.');
  if (new Set(codes).size !== codes.length) throw new Error('IATA kodovi ne smiju se ponavljati.');
  return codes;
}
