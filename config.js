/**
 * 生成字体文件配置
 *    fontFilePath:     字体文件路径
 *    outputDir:        生成的文件都将输出到该目录下
 *    charsetRange:     需要生成字体图片的字符的unicode编码范围[[start, end], [another_start, another_end]...]
 *    genFrequency:     是否要生成常用字
 *    pictureSize:      输出的字体图片的大小[width, height]
 *    outputFileName:   字体生成后的输出文件名
 *    charsetInputFile: 要生成字体的字符集
 */
const conf = {
  fontFilePath: "C:/Windows/Fonts/simhei.ttf",
  outputDir: "./dist/",
  charsetRange: [[0xFF00, 0xFFEF]],
  genFrequency: true,
  pictureSize: [256, 256],
  outputFileName: 'testFont',
  charsetInputFile: './charset.txt'
};

exports.conf = conf;
