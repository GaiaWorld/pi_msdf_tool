const { join } = require('path');
const { readFileSync } = require('fs');
const { conf } = require('../config');
const { gb2312 } = require('./gb2312');
const { getAll } = require('./asciiAndSymbol');
const { excludeString, generate, getStringFromUnicode, uniqueChar, writeFileSync } = require('./util');

const alreadyGenChar = [];
const info = {};
const infoPath = join(conf.outputDir, 'char_info.json');

const genTarget = (additionalChars = null) => {
    let targetString = '';
    if (conf.charsetRange) {
        for (const range of conf.charsetRange) {
            targetString += getStringFromUnicode(range);
        }
    }
    if (conf.charsetInputFile) {
        targetString += readFileSync(conf.charsetInputFile, { encoding: 'utf8' });
    }
    targetString = excludeString(targetString, alreadyGenChar);

    if (!targetString) return;
    generate(targetString, conf.fontFilePath, conf.pictureSize, conf.outputDir, conf.outputFileName, (res) => {
        const { fileName, chars } = res;
        info[fileName] = chars
        writeFileSync(infoPath, JSON.stringify(info));
    });
};

if (conf.genFrequency) {
    const asciiAndSymbol = getAll();
    const freqCharset = uniqueChar(getAll() + uniqueChar(gb2312).slice(0, 3000));
    generate(freqCharset, conf.fontFilePath, [1024, 1024], conf.outputDir, 'frequency', (data) => {
        const { fileName, chars } = data;
        alreadyGenChar.push(...alreadyGenChar.concat(chars));
        info.frequency = chars;

        genTarget();
    });
} else {
    genTarget();
}
