## 介绍

该工具用于生成msdf字体文件的图片和相对应的json文件

由于json文件不能直接输入16进制的数，而字符的unicode编码多为16进制数，为了方便配置，故用js文件作为配置文件，而不是json文件。

常用字，根据 [汉字unicode编码](https://blog.csdn.net/gywtzh0889/article/details/71083459) 和 [常用汉字频率表](https://github.com/sxei/pinyinjs/blob/master/other/%E5%B8%B8%E7%94%A86763%E4%B8%AA%E6%B1%89%E5%AD%97%E4%BD%BF%E7%94%A8%E9%A2%91%E7%8E%87%E8%A1%A8.txt) ，默认GB2312包括了所有常用的简体汉字，则常用字从GB2312中取前3000个。

常用字生成出来的图片名是`frequency.[索引号].png`，其配置文件是`frequency.json`。

其余字会按照unicode排序，默认每100个字为一批分多批生成，以保证每一批的字都在一张图片上，使每次生成字体时，下载的文件大小尽可能小，文件个数尽可能少。每批处理的字符个数可以配置，说明见配置说明。

目标字符有去重规则，如果再常用字中生成了的字符，则再非常用字中不再生成

## 用法

根据下面的配置项说明，在`config.js`和`charset.txt`配置完成后，运行`generate.bat`批处理文件即可

## 配置项说明

1. fontFilePath:

        字体文件所在路径
        可以是绝对路径，也可以是相对路径

2. outputDir:

        生成的图片和json文件都生成到该目录下

3. charsetRange:

        需要生成的字符unicode码的范围列表
        如果不按该规则生成，则不配置该项，或设置成null

4. genFrequency:

        是否要生成常用字，常用字规则见介绍

5. charNumPerProcess:

        每一批要生成的字符个数
        如果此处配置个数太多，pictureSize配置的大小不能容纳所有字符，则会生成多于1张图片

6. pictureSize:

        生成的图片最大尺寸(单位：像素)
        格式: [宽, 高]
        程序会根据文字的多少，自动适配图片的大小，图片的宽高始终是2的幂

7. jsonToBinary:

        生成成文件时，是否同时生成json文件内容对应的二进制文件
        二进制文件包含所有的字符信息和一些额外的字体信息

8. includeGB2312:

        目标字符是否要包含GB2312字符集中的所有字符
        所有GB2312字符都在./src/gb2312.js中

9. charsetInputFile:

        读取该文件中的所有字符，并将其加入到要生成的字符中
        如不需要按照该规则生成，则不配置该项，或设置成null
