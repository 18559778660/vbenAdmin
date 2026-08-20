import { ref } from 'vue';

export type CardBinPrefix = {
  end: string;
  start: string;
};

export type CountryRow = {
  cardBinRatio: number;
  code: string;
  id: number;
  name: string;
};

export const CARD_LENGTH_OPTIONS = [13, 14, 15, 16, 17, 18, 19].map(
  (value) => ({
    label: String(value),
    value,
  }),
);

export const CARD_BIN_SEARCH_OPTIONS = [
  { label: '不限', value: '' },
  { label: '缩写', value: 'code' },
  { label: '名称', value: 'name' },
];

export const CURRENCY_SEARCH_OPTIONS = [
  { label: '不限', value: '' },
  { label: '名称', value: 'name' },
  { label: 'CODE', value: 'code' },
];

export const COUNTRY_SEARCH_OPTIONS = [
  { label: '不限', value: '' },
  { label: '名称', value: 'name' },
  { label: '2位CODE', value: 'code' },
];

const COUNTRY_PAIRS: Array<[string, string]> = [
  ['Afghanistan', 'AF'],
  ['Albania', 'AL'],
  ['Algeria', 'DZ'],
  ['American Samoa', 'AS'],
  ['Andorra', 'AD'],
  ['Angola', 'AO'],
  ['Anguilla', 'AI'],
  ['Antigua and Barbuda', 'AG'],
  ['Argentina', 'AR'],
  ['Armenia', 'AM'],
  ['Aruba', 'AW'],
  ['Australia', 'AU'],
  ['Austria', 'AT'],
  ['Azerbaijan', 'AZ'],
  ['Bahamas', 'BS'],
  ['Bahrain', 'BH'],
  ['Bangladesh', 'BD'],
  ['Barbados', 'BB'],
  ['Belarus', 'BY'],
  ['Belgium', 'BE'],
  ['Belize', 'BZ'],
  ['Benin', 'BJ'],
  ['Bermuda', 'BM'],
  ['Bhutan', 'BT'],
  ['Bolivia', 'BO'],
  ['Bosnia and Herzegovina', 'BA'],
  ['Botswana', 'BW'],
  ['Brazil', 'BR'],
  ['British Virgin Islands', 'VG'],
  ['Brunei', 'BN'],
  ['Bulgaria', 'BG'],
  ['Burkina Faso', 'BF'],
  ['Burundi', 'BI'],
  ['Cambodia', 'KH'],
  ['Cameroon', 'CM'],
  ['Canada', 'CA'],
  ['Cape Verde', 'CV'],
  ['Cayman Islands', 'KY'],
  ['Central African Republic', 'CF'],
  ['Chad', 'TD'],
  ['Chile', 'CL'],
  ['China', 'CN'],
  ['Colombia', 'CO'],
  ['Comoros', 'KM'],
  ['Congo', 'CG'],
  ['Cook Islands', 'CK'],
  ['Costa Rica', 'CR'],
  ['Croatia', 'HR'],
  ['Cuba', 'CU'],
  ['Cyprus', 'CY'],
  ['Czechia', 'CZ'],
  ['Denmark', 'DK'],
  ['Djibouti', 'DJ'],
  ['Dominica', 'DM'],
  ['Dominican Republic', 'DO'],
  ['Ecuador', 'EC'],
  ['Egypt', 'EG'],
  ['El Salvador', 'SV'],
  ['Equatorial Guinea', 'GQ'],
  ['Eritrea', 'ER'],
  ['Estonia', 'EE'],
  ['Eswatini', 'SZ'],
  ['Ethiopia', 'ET'],
  ['Falkland Islands', 'FK'],
  ['Faroe Islands', 'FO'],
  ['Fiji', 'FJ'],
  ['Finland', 'FI'],
  ['France', 'FR'],
  ['French Guiana', 'GF'],
  ['French Polynesia', 'PF'],
  ['Gabon', 'GA'],
  ['Gambia', 'GM'],
  ['Georgia', 'GE'],
  ['Germany', 'DE'],
  ['Ghana', 'GH'],
  ['Gibraltar', 'GI'],
  ['Greece', 'GR'],
  ['Greenland', 'GL'],
  ['Grenada', 'GD'],
  ['Guadeloupe', 'GP'],
  ['Guam', 'GU'],
  ['Guatemala', 'GT'],
  ['Guernsey', 'GG'],
  ['Guinea', 'GN'],
  ['Guinea-Bissau', 'GW'],
  ['Guyana', 'GY'],
  ['Haiti', 'HT'],
  ['Honduras', 'HN'],
  ['Hong Kong', 'HK'],
  ['Hungary', 'HU'],
  ['Iceland', 'IS'],
  ['India', 'IN'],
  ['Indonesia', 'ID'],
  ['Iran', 'IR'],
  ['Iraq', 'IQ'],
  ['Ireland', 'IE'],
  ['Isle of Man', 'IM'],
  ['Israel', 'IL'],
  ['Italy', 'IT'],
  ['Jamaica', 'JM'],
  ['Japan', 'JP'],
  ['Jersey', 'JE'],
  ['Jordan', 'JO'],
  ['Kazakhstan', 'KZ'],
  ['Kenya', 'KE'],
  ['Kiribati', 'KI'],
  ['Kuwait', 'KW'],
  ['Kyrgyzstan', 'KG'],
  ['Laos', 'LA'],
  ['Latvia', 'LV'],
  ['Lebanon', 'LB'],
  ['Lesotho', 'LS'],
  ['Liberia', 'LR'],
  ['Libya', 'LY'],
  ['Liechtenstein', 'LI'],
  ['Lithuania', 'LT'],
  ['Luxembourg', 'LU'],
  ['Macao', 'MO'],
  ['Madagascar', 'MG'],
  ['Malawi', 'MW'],
  ['Malaysia', 'MY'],
  ['Maldives', 'MV'],
  ['Mali', 'ML'],
  ['Malta', 'MT'],
  ['Marshall Islands', 'MH'],
  ['Martinique', 'MQ'],
  ['Mauritania', 'MR'],
  ['Mauritius', 'MU'],
  ['Mayotte', 'YT'],
  ['Mexico', 'MX'],
  ['Micronesia', 'FM'],
  ['Moldova', 'MD'],
  ['Monaco', 'MC'],
  ['Mongolia', 'MN'],
  ['Montenegro', 'ME'],
  ['Montserrat', 'MS'],
  ['Morocco', 'MA'],
  ['Mozambique', 'MZ'],
  ['Myanmar', 'MM'],
  ['Namibia', 'NA'],
  ['Nauru', 'NR'],
  ['Nepal', 'NP'],
  ['Netherlands', 'NL'],
  ['New Caledonia', 'NC'],
  ['New Zealand', 'NZ'],
  ['Nicaragua', 'NI'],
  ['Niger', 'NE'],
  ['Nigeria', 'NG'],
  ['Niue', 'NU'],
  ['Norfolk Island', 'NF'],
  ['North Macedonia', 'MK'],
  ['Norway', 'NO'],
  ['Oman', 'OM'],
  ['Pakistan', 'PK'],
  ['Palau', 'PW'],
  ['Palestine', 'PS'],
  ['Panama', 'PA'],
  ['Papua New Guinea', 'PG'],
  ['Paraguay', 'PY'],
  ['Peru', 'PE'],
  ['Philippines', 'PH'],
  ['Poland', 'PL'],
  ['Portugal', 'PT'],
  ['Puerto Rico', 'PR'],
  ['Qatar', 'QA'],
  ['Réunion', 'RE'],
  ['Romania', 'RO'],
  ['Russia', 'RU'],
  ['Rwanda', 'RW'],
  ['Saint Kitts and Nevis', 'KN'],
  ['Saint Lucia', 'LC'],
  ['Saint Martin', 'MF'],
  ['Saint Vincent and the Grenadines', 'VC'],
  ['Samoa', 'WS'],
  ['San Marino', 'SM'],
  ['Sao Tome and Principe', 'ST'],
  ['Saudi Arabia', 'SA'],
  ['Senegal', 'SN'],
  ['Serbia', 'RS'],
  ['Seychelles', 'SC'],
  ['Sierra Leone', 'SL'],
  ['Singapore', 'SG'],
  ['Slovakia', 'SK'],
  ['Slovenia', 'SI'],
  ['Solomon Islands', 'SB'],
  ['Somalia', 'SO'],
  ['South Africa', 'ZA'],
  ['South Korea', 'KR'],
  ['Spain', 'ES'],
  ['Sri Lanka', 'LK'],
  ['Sudan', 'SD'],
  ['Suriname', 'SR'],
  ['Sweden', 'SE'],
  ['Switzerland', 'CH'],
  ['Syria', 'SY'],
  ['Taiwan', 'TW'],
  ['Tajikistan', 'TJ'],
  ['Tanzania', 'TZ'],
  ['Thailand', 'TH'],
  ['Timor-Leste', 'TL'],
  ['Togo', 'TG'],
  ['Tonga', 'TO'],
  ['Trinidad and Tobago', 'TT'],
  ['Tunisia', 'TN'],
  ['Turkey', 'TR'],
  ['Turkmenistan', 'TM'],
  ['Turks and Caicos Islands', 'TC'],
  ['Tuvalu', 'TV'],
  ['Uganda', 'UG'],
  ['Ukraine', 'UA'],
  ['United Arab Emirates', 'AE'],
  ['United Kingdom', 'GB'],
  ['United States', 'US'],
  ['Uruguay', 'UY'],
  ['Uzbekistan', 'UZ'],
  ['Vanuatu', 'VU'],
  ['Vatican City', 'VA'],
  ['Venezuela', 'VE'],
  ['Vietnam', 'VN'],
  ['U.S. Virgin Islands', 'VI'],
  ['Wallis and Futuna', 'WF'],
  ['Western Sahara', 'EH'],
  ['Yemen', 'YE'],
  ['Zambia', 'ZM'],
  ['United States Minor Outlying Islands', 'UM'],
  ['North Korea', 'KP'],
  ['Northern Mariana Islands', 'MP'],
  ['Caribbean Netherlands', 'BQ'],
  ['Sint Maarten', 'SX'],
  ['Curaçao', 'CW'],
  ['Zimbabwe', 'ZW'],
  ['DR Congo', 'CD'],
  ['Kosovo', 'XK'],
  ['South Sudan', 'SS'],
  ['Canary Islands', 'IC'],
];

export const COUNTRY_OPTIONS = COUNTRY_PAIRS.map(([label, value]) => ({
  label,
  value,
}));

export function countryNameByCode(code: string) {
  return COUNTRY_OPTIONS.find((item) => item.value === code)?.label || code;
}

export function countrySelectOptions() {
  return COUNTRY_OPTIONS.map((item) => ({
    label: `${item.label}（${item.value}）`,
    value: item.value,
  }));
}

export function emptyBinPrefix(): CardBinPrefix {
  return { start: '', end: '' };
}

export function formatBinPrefix(item: CardBinPrefix) {
  return item.end && item.end !== item.start
    ? `${item.start}-${item.end}`
    : item.start;
}

function digitClass(from: string, to: string) {
  if (from === to) {
    return from;
  }
  if (from === '0' && to === '9') {
    return String.raw`\d`;
  }
  return `[${from}-${to}]`;
}

function allSame(value: string, digit: string) {
  return value.length > 0 && [...value].every((item) => item === digit);
}

function prefixRangePatterns(lo: string, hi: string): string[] {
  if (lo === hi) {
    return [lo];
  }
  let i = 0;
  while (i < lo.length && lo[i] === hi[i]) {
    i += 1;
  }
  const prefix = lo.slice(0, i);
  const startRest = lo.slice(i);
  const endRest = hi.slice(i);
  if (allSame(startRest, '0') && allSame(endRest, '9')) {
    return [`${prefix}${String.raw`\d`.repeat(startRest.length)}`];
  }
  return splitPrefixRange(prefix, startRest, endRest);
}

function splitPrefixRange(
  prefix: string,
  startRest: string,
  endRest: string,
): string[] {
  const len = startRest.length;
  if (len === 1) {
    return [`${prefix}${digitClass(startRest, endRest)}`];
  }

  const startDigit = startRest[0] ?? '';
  const endDigit = endRest[0] ?? '';
  const startTail = startRest.slice(1);
  const endTail = endRest.slice(1);

  if (startDigit === endDigit) {
    return prefixRangePatterns(
      `${prefix}${startDigit}${startTail}`,
      `${prefix}${endDigit}${endTail}`,
    );
  }

  if (allSame(startTail, '0') && allSame(endTail, '9')) {
    return [
      `${prefix}${digitClass(startDigit, endDigit)}${String.raw`\d`.repeat(len - 1)}`,
    ];
  }

  const out: string[] = [];
  out.push(
    ...prefixRangePatterns(
      `${prefix}${startRest}`,
      `${prefix}${startDigit}${'9'.repeat(len - 1)}`,
    ),
  );

  const midFrom = Number(startDigit) + 1;
  const midTo = Number(endDigit) - 1;
  if (midFrom <= midTo) {
    out.push(
      `${prefix}${digitClass(String(midFrom), String(midTo))}${String.raw`\d`.repeat(len - 1)}`,
    );
  }

  out.push(
    ...prefixRangePatterns(
      `${prefix}${endDigit}${'0'.repeat(len - 1)}`,
      `${prefix}${endRest}`,
    ),
  );
  return out;
}

export function prefixToRegex(item: CardBinPrefix) {
  const start = item.start;
  const end = item.end && item.end !== item.start ? item.end : '';
  if (!start) {
    return '';
  }
  if (!end) {
    return `/^${start}/`;
  }
  if (
    start.length !== end.length ||
    start > end ||
    !/^\d+$/.test(start) ||
    !/^\d+$/.test(end)
  ) {
    return `/^(${start}|${end})/`;
  }

  const parts = prefixRangePatterns(start, end);
  if (parts.length === 1) {
    return `/^${parts[0]}/`;
  }
  return `/^(${parts.join('|')})/`;
}

export const mockCountryList = ref<CountryRow[]>(
  COUNTRY_OPTIONS.map((item, index) => ({
    id: index + 1,
    name: item.label,
    code: item.value,
    cardBinRatio: 99,
  })).toReversed(),
);

let nextCountryId = COUNTRY_OPTIONS.length + 1;

export function createCountry(payload: Omit<CountryRow, 'id'>) {
  const row: CountryRow = {
    ...payload,
    id: nextCountryId++,
  };
  mockCountryList.value.unshift(row);
  return row;
}

export function updateCountry(id: number, payload: Partial<CountryRow>) {
  const row = mockCountryList.value.find((item) => item.id === id);
  if (!row) {
    return null;
  }
  Object.assign(row, payload);
  return row;
}
