const generateBMFont = require('msdf-bmfont-xml');
const { basename, dirname, join, resolve } = require('path');
const { existsSync, mkdirSync, writeFileSync } = require('fs');

/**
 * 获取指定unicode范围内的字符串
 */
const getStringFromUnicode = (unicodeArray, isRange = true) => {
  if (!Array.isArray(unicodeArray)) {
    console.log("参数需要是数组");
    return;
  }
  const charset = [];
  if (isRange) {
    if (unicodeArray.length < 2) {
      console.log("参数数组长度至少为2");
      return;
    }
    if (unicodeArray.length === 2) {
      for (let code = unicodeArray[0]; code <= unicodeArray[1]; ++code) {
        const char = String.fromCharCode(code);
        charset.push(char);
      }
    }
  } else {
    const set = new Set();
    unicodeArray.forEach((code) => {
      const char = String.fromCharCode(code);
      set.add(char);
    });
    for (const c of set.values()) {
      charset.push(c);
    }
  }

  return charset.join('');
};

/**
 * 递归创建目录
 */
const makeSureDirExist = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(resolve(dir), { recursive: true });
  }
};

/**
 * 写文件(如果父级目录不存在，创建之)
 */
const writeFile = (fileName, data) => {
  try {
    const dir = dirname(fileName);
    makeSureDirExist(dir);
    writeFileSync(fileName, data);
  } catch (err) {
    throw err;
  }
};

/**
 * 去掉字符串中重复的字符
 */
const uniqueChar = (str) => {
  const charset = new Set();
  str.split('').forEach((char) => {
    charset.add(char);
  });

  let result = '';
  for (const c of charset.values()) {
    result += c;
  }

  return result;
};

/**
 * 查找字体中不支持的字符
 * 如果字体中不存在该字符，则其相应json数据中width和height为0
 */
const filterNotSupportChars = (json) => {
  const data = JSON.parse(json);
  const { chars, info } = data;
  const notSupportChars = [];
  chars.forEach((char, index) => {
    if (char.width === 0 || char.height === 0) {
      const idx = info.charset.indexOf(char.char);
      info.charset.splice(idx, 1);
      notSupportChars.push({
        charCode: char.id,
        char: char.char
      });
    }
  });

  return {
    data: data,
    failedChars: notSupportChars.length === 0 ? null : notSupportChars
  };
};

/**
 * 从目标字符串中去掉指定的字符
 */
const excludeString = (dest, exclude) => {
  if (typeof dest === typeof 'str') {
    dest = dest.split('');
  }
  const d = new Set(dest);
  if (typeof exclude === typeof 'str') {
    exclude = exclude.split('');
  }
  exclude.forEach((e) => {
    d.delete(e);
  });

  let result = '';
  for (const c of d.values()) {
    result += c;
  }

  return result;
}


/**
 * 生成字体相关文件
 */
const generate = (charset, fontFile, pictureSize, outputDir, outputFilename = '', callback = ({fileName, chars, failedChars}) => {}) => {
  const opt = {
    outputType: 'json',
    fontSize: 32,
    fieldType: 'msdf',
    textureSize: pictureSize,
    distanceRange: 4,
    charset: charset,
    filename: outputFilename || undefined
  };
  generateBMFont(fontFile, opt, (error, textures, font) => {
    if (error) throw error;

    const needIndex = textures.length > 1;
    textures.forEach((texture, index) => {
      const fn = basename(texture.filename);
      if (!outputFilename) {
        const regx = new RegExp(`.${index}$`);
        outputFilename = fn.replace(regx, '');
      }

      const fileName = needIndex ? `${outputFilename}.${index}.png` : `${outputFilename}.png`;
      const imgPath = join(outputDir, fileName);
      writeFile(imgPath, texture.texture);
    });

    const jsonPath = join(outputDir, `${outputFilename}.json`);

    const { data, failedChars } = filterNotSupportChars(font.data);
    writeFile(jsonPath, JSON.stringify(data));
    if (failedChars) {
      const failedFile = `${join(outputDir, outputFilename)}_fail.json`;
      writeFile(failedFile, JSON.stringify(failedChars));
    }
    callback && callback({ fileName: outputFilename, chars: data.info.charset, failedChars });
  });
};

exports.generate = generate;
exports.uniqueChar = uniqueChar;
exports.writeFileSync = writeFile;
exports.excludeString = excludeString;
exports.getStringFromUnicode = getStringFromUnicode;
