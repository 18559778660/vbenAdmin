export type CardBinPrefix = {
  end: string;
  start: string;
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
