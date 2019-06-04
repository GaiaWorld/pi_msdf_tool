/**
 * 将json指定的内容转成二进制文件
 * 格式如下所示
 *     1. 固定字符串: "GLYPL_TABLE" 11字节
 *     2. 版本: 表示版本 1字节
 *     3. 字体名称长度: 1字节
 *     4. 字体名称: n字节
 *     5. line_height: 1字节
 *     6. atlas_width: 2字节,(图片宽)
 *     7. atlas_height: 2字节,(图片高)
 *     8. padding: 2字节x4
 *     9. 字符表:
 *     字符表内每个字符的内容为:
 *     | json字段        | 长度(单位:字节) |
 *     |-----------------+-----------------|
 *     | id              |               2 |
 *     | x               |               2 |
 *     | y               |               2 |
 *     | xoffset         |               1 |
 *     | yoffset         |               1 |
 *     | width           |               1 |
 *     | height          |               1 |
 *     | advance         |               1 |
 *     | vacancy(占位符) |               1 |
 *     |-----------------+-----------------|
 *     | 总和            |              12 |
 */
const setHead = (head = 'GLYPL_TABLE', len = head.length) => {
    if (len < head.length) {
        throw new Error(`"${head}" is too long, target length is ${len}.`);
    }

    return Buffer.from(head, 'utf8').slice(0, len);
};

const setVersion = (version = 1) => {
    const versionBuf = new ArrayBuffer(1);
    const view = new Uint8Array(versionBuf);
    view[0] = version;

    return Buffer.from(versionBuf);
};

const setFontName = (fontName = '') => {
    const len = new Uint8Array([fontName.length]);
    const lenBuf = Buffer.from(len.buffer);

    const nameBuf = Buffer.from(fontName, 'utf8');
    return Buffer.concat([lenBuf, nameBuf]);
};

const setLineHeight = (lineHeight = 0) => {
    const buffer = new ArrayBuffer(1);
    const view = new Uint8Array(buffer);
    view[0] = lineHeight;

    return Buffer.from(buffer);
};

const setPictureSize = (width, height) => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint16Array(buffer);

    view[0] = width;
    view[1] = height;

    return Buffer.from(buffer);
};

const setPadding = (padding) => {
    if (!Array.isArray(padding) || padding.length !== 4) {
        throw new Error('padding should be an Array with 4 Integer');
    }
    const buffer = new ArrayBuffer(8);
    const view = new Uint16Array(buffer);
    for (let i = 0; i < padding.length; ++i) {
        view[i] = padding[i];
    }

    return Buffer.from(buffer);
};

const setCharInfo = (id, x, y, xoffset, yoffset, width, height, advance) => {
    const buffer = new ArrayBuffer(12)
    const idView = new Uint16Array(buffer, 0, 1);
    const xView = new Uint16Array(buffer, 2, 1);
    const yView = new Uint16Array(buffer, 4, 1);
    const oxView = new Int8Array(buffer, 6, 1);
    const oyView = new Int8Array(buffer, 7, 1);
    const widthView = new Uint8Array(buffer, 8, 1);
    const heigthView = new Uint8Array(buffer, 9, 1);
    const advanceView = new Uint8Array(buffer, 10, 1);
    const vacancyView = new Uint8Array(buffer, 11, 1);

    idView[0] = id;
    xView[0] = x;
    yView[0] = y;
    oxView[0] = xoffset;
    oyView[0] = yoffset;
    widthView[0] = width;
    heigthView[0] = height;
    advanceView[0] = advance;
    vacancyView[0] = 0;

    return Buffer.from(buffer);
};

const setInfo = (json) => {
    const head = setHead();
    const version = setVersion();
    const fontName = setFontName(json.info.face);
    const lineHeight = setLineHeight(json.common.lineHeight);
    const pictureSize = setPictureSize(json.common.scaleW, json.common.scaleH);
    const padding = setPadding(json.info.padding);

    const info = Buffer.concat([head, version, fontName, lineHeight, pictureSize, padding]);

    return info;
};

const setCharsetMap = (json) => {
    const charset = [];
    const { chars } = json;
    chars.forEach((char) => {
        const { id, width, height, xoffset, yoffset, xadvance, x, y } = char;
        const charInfo = setCharInfo(id, x, y, xoffset, yoffset, width, height, xadvance);
        charset.push(Buffer.from(charInfo));
    });

    return Buffer.concat(charset);
};

const json2arraybuffer = (json) => {
    const info = setInfo(json);
    const charset = setCharsetMap(json);

    return Buffer.concat([info, charset]);
};

exports.json2arraybuffer = json2arraybuffer;
