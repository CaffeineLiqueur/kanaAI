export interface KanaEntry { character: string; romaji: string; group: string; kind: 'base' | 'voiced' | 'semi' | 'yoon' }

const baseRows = [
  { group: '元音', kana: 'あいうえお', roma: ['a','i','u','e','o'] },
  { group: 'K 行', kana: 'かきくけこ', roma: ['ka','ki','ku','ke','ko'] },
  { group: 'S 行', kana: 'さしすせそ', roma: ['sa','shi','su','se','so'] },
  { group: 'T 行', kana: 'たちつてと', roma: ['ta','chi','tsu','te','to'] },
  { group: 'N 行', kana: 'なにぬねの', roma: ['na','ni','nu','ne','no'] },
  { group: 'H 行', kana: 'はひふへほ', roma: ['ha','hi','fu','he','ho'] },
  { group: 'M 行', kana: 'まみむめも', roma: ['ma','mi','mu','me','mo'] },
  { group: 'Y 行', kana: 'やゆよ', roma: ['ya','yu','yo'] },
  { group: 'R 行', kana: 'らりるれろ', roma: ['ra','ri','ru','re','ro'] },
  { group: 'W 行', kana: 'わをん', roma: ['wa','wo','n'] },
]
const voicedRows = [
  { group: 'G 行', kana: 'がぎぐげご', roma: ['ga','gi','gu','ge','go'] },
  { group: 'Z 行', kana: 'ざじずぜぞ', roma: ['za','ji','zu','ze','zo'] },
  { group: 'D 行', kana: 'だぢづでど', roma: ['da','ji','zu','de','do'] },
  { group: 'B 行', kana: 'ばびぶべぼ', roma: ['ba','bi','bu','be','bo'] },
]
const semiRows = [{ group: 'P 行', kana: 'ぱぴぷぺぽ', roma: ['pa','pi','pu','pe','po'] }]
const yoonBases = [
  ['き','ky'],['し','sh'],['ち','ch'],['に','ny'],['ひ','hy'],['み','my'],['り','ry'],
  ['ぎ','gy'],['じ','j'],['び','by'],['ぴ','py'],
]

function rowsToEntries(rows: typeof baseRows, kind: KanaEntry['kind']): KanaEntry[] {
  return rows.flatMap((row) => Array.from(row.kana).map((character, index) => ({ character, romaji: row.roma[index], group: row.group, kind })))
}

export const HIRAGANA: KanaEntry[] = [
  ...rowsToEntries(baseRows, 'base'),
  ...rowsToEntries(voicedRows, 'voiced'),
  ...rowsToEntries(semiRows, 'semi'),
  ...yoonBases.flatMap(([base, prefix]) => ['ゃ','ゅ','ょ'].map((small, index) => ({ character: base + small, romaji: prefix + ['a','u','o'][index], group: '拗音', kind: 'yoon' as const }))),
]

export const KATAKANA: KanaEntry[] = HIRAGANA.map((entry) => ({ ...entry, character: Array.from(entry.character).map((character) => String.fromCodePoint(character.codePointAt(0)! + 96)).join('') }))

export const KANA_RULES = [
  { title: '促音', japanese: 'きって', reading: 'kitte', explanation: '小「っ／ッ」占一拍，让后面的辅音停顿一次。' },
  { title: '长音', japanese: 'コーヒー', reading: 'kōhī', explanation: '片假名的「ー」把前一个元音延长一拍。平假名通常用元音假名表示。' },
  { title: '拨音', japanese: 'ほん', reading: 'hon', explanation: '「ん／ン」独占一拍，结尾不再加元音。' },
]
