/**
 * 生成字体文件配置
 *    fontFilePath:       字体文件路径
 *    outputDir:          生成的文件都将输出到该目录下
 *    charsetRange:       需要生成字体图片的字符的unicode编码范围[[start, end], [another_start, another_end]...]
 *    genFrequency:       是否要生成常用字
 *    charNumPerProcess:  每次处理的字符个数
 *    pictureSize:        输出的字体图片的大小[width, height]
 *    jsonToBinary:       将字体json文件转成二进制文件
 *    outputFileName:     字体生成后的输出文件名
 *    charsetInputFile:   要生成字体的字符集
 */
const conf = {
  fontFilePath: "C:/Windows/Fonts/simhei.ttf",
  outputDir: "./dist/",
  charsetRange: [[0x3040, 0x309F], [0x30A0, 0x30FF], [0x31F0, 0x31FF]],
  genFrequency: true,
  charNumPerProcess: 100,
  pictureSize: [1024, 1024],
  jsonToBinary: true,
  outputFileName: 'testFont',
  charsetInputFile: './charset.txt'
};

exports.conf = conf;
