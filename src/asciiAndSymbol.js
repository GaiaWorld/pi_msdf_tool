const { getStringFromUnicode, uniqueChar } = require('./util');

/**
 * ASCII码
 * 参考https://blog.csdn.net/Solo_two/article/details/51577076
 */
const asciiRange = [32, 126];
let asciiMap = getStringFromUnicode(asciiRange);
asciiMap = uniqueChar(asciiMap);
const getAscii = () => asciiMap;

/**
 * 标点符号
 * 参考文档
 * http://www.unicode.org/charts/PDF/U3000.pdf
 * http://www.unicode.org/charts/PDF/UFF00.pdf
 * https://gist.github.com/shingchi/a8dc2975b00a580c8271
 */
const punctuationRange = [
  [0x3001, 0x3003],
  [0x3007, 0x3011],
  [0x3014, 0x301F],
  [0xFF01, 0xFF65],
  [ 0x00B7, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026 ]
];
let punctuationMap = '';
for (const range of punctuationRange) {
  punctuationMap += getStringFromUnicode(range, range.length === 2);
}
punctuationMap = uniqueChar(punctuationMap);
const getPunctuation = () => punctuationMap;

let all = asciiMap + punctuationMap;
all = uniqueChar(all);

exports.getAll = () => all;
exports.getAscii = getAscii;
exports.getPunctuation = getPunctuation;
