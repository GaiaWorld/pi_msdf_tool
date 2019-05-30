const { join } = require('path');
const { readFileSync } = require('fs');
const { conf } = require('../config');
const { gb2312 } = require('./gb2312');
const { getAll } = require('./asciiAndSymbol');
const { excludeString, generate, getStringFromUnicode, frequencyCharName,
        sortString, splitString, uniqueChar, writeFileSync } = require('./util');

const alreadyGenChar = [];
const info = {};
const infoPath = join(conf.outputDir, 'char_info.json');

const getTargetCharset = () => {
  let targetString = gb2312;
  if (conf.charsetRange) {
    for (const range of conf.charsetRange) {
      targetString += getStringFromUnicode(range);
    }
  }
  if (conf.charsetInputFile) {
    targetString += readFileSync(conf.charsetInputFile, { encoding: 'utf8' });
  }
  targetString = excludeString(targetString, alreadyGenChar);

  return targetString;
};

const genSortedChars = (targetString = '', cb = () => {}) => {
  if (!targetString) return;
  const startCode = targetString.charCodeAt(0);
  const endCode = targetString.charCodeAt(targetString.length - 1);
  generate(targetString, conf.fontFilePath, conf.pictureSize, conf.outputDir, conf.jsonToBinary, `${startCode}_${endCode}`, true, (res) => {
    const { fileName, chars } = res;
    info[fileName] = chars
    // writeFileSync(infoPath, JSON.stringify(info));
    cb();
  });
};

const startGen = (str = '') => {
  if (!str) {
    console.log('no char need generating!');
    return;
  }
  str = uniqueChar(str);
  str = sortString(str);
  const strArr = splitString(str, conf.charNumPerProcess);
  const len = strArr.length;
  let count = 1;
  const genNext = () => {
    if (!strArr.length) {
      writeFileSync(infoPath, JSON.stringify(info));
      console.log('All charset generation complete!');
      return;
    }
    console.log('generate msdf font: process/total = %d/%d', count, len);
    genSortedChars(strArr[0], () => {
      strArr.splice(0, 1);
      ++count;
      genNext();
    });
  };

  genNext();
};

const genTarget = () => {
  startGen(getTargetCharset());
};

if (false) {
  startGen('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890');
} else if (conf.genFrequency) {
  const asciiAndSymbol = getAll();
  const freqCharset = uniqueChar(getAll() + uniqueChar(gb2312).slice(0, 3000));
  generate(freqCharset, conf.fontFilePath, [1024, 1024], conf.outputDir, conf.jsonToBinary, frequencyCharName, false, (data) => {
    const { fileName, chars } = data;
    alreadyGenChar.push(...alreadyGenChar.concat(chars));

    genTarget();
  });
} else {
  genTarget();
}
