# 如何在抖音上找到漂亮小姐姐----抖音机器人（nodejs 实现）

参考[wangshub](https://github.com/wangshub) 使用python3实现的抖音机器人[wangshub/Douyin-Bot](https://github.com/wangshub/Douyin-Bot)

## 原理
- 打开《抖音短视频》APP，进入主界面
- 获取手机截图，并对截图进行压缩 (Size < 1MB)，使用 [imagemagick](https://github.com/rsms/node-imagemagick)库，mac使用 brew install imagemagick 安装，其他系统需在[官网](http://www.imagemagick.org/script/index.php)自行安装；
- 请求 人脸识别 API（腾讯AI）；
- 解析返回的人脸 Json 信息，对人脸检测切割；
- 当颜值大于门限值 min_beauty，点赞并关注；
- 下一页，返回第一步；

## 使用教程
- nodejs版本：8.0及以上
- 相关软件工具安装和使用步骤请参考 [wechat_jump_game](https://github.com/wangshub/wechat_jump_game) 和 [Android 操作步骤](https://github.com/wangshub/wechat_jump_game/wiki/Android-%E5%92%8C-iOS-%E6%93%8D%E4%BD%9C%E6%AD%A5%E9%AA%A4)
- 在 [ai.qq.com](https://ai.qq.com) 免费申请 `AppKey` 和 `AppID` 在`configs/params.js`中配置
1. 获取源码：`git clone https://github.com/yunmoon/node-douyin-bot.git`
2. 进入源码目录： `cd node-douyin-bot`
3. 安装依赖： `npm i`
4. 安装 [imagemagick](http://www.imagemagick.org/script/index.php)
5. 运行程序：`npm start`
