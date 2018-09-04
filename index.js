const adbTool = require('./tools/adb');
const checkAdb = adbTool.checkAdb;
const listDevices = adbTool.listDevices;
const screenshot = adbTool.screenshot;
const fs = require('fs');
const params = require('./configs/params');
const apiUtils = require('./tools/apiUtils');
const qs = require('qs');
const axios = require('axios');
const im = require('imagemagick');
let isError = false

function requireAiApi () {
    const url = 'https://api.ai.qq.com/fcgi-bin/face/face_detectface';
    const request_params = {
        app_id: params.app_id,
        time_stamp: Date.parse(new Date()).toString().substr(0,10),
        nonce_str: 'fa577ce340859f9fe',
        // image: fs.readFileSync('./screenshot.png').toString('base64'),
        mode: 0
    }
    // request_params['sign'] = apiUtils.getReqSign(apiUtils.formatStr(apiUtils.objectSort(request_params)), params.app_key).toUpperCase()
    return new Promise((resolve, reject) => {
        im.resize({
            srcPath: './screenshot.png',
            dstPath: './screenshot-small.jpg',
            width:  1024,
            height: 1024
        }, function(err, stdout, stderr){
            if (err) throw err;
            request_params['image'] = fs.readFileSync('./screenshot-small.jpg').toString('base64');
            request_params['sign'] = apiUtils.getReqSign(apiUtils.formatStr(apiUtils.objectSort(request_params)), params.app_key).toUpperCase();
            axios.post(url, qs.stringify(request_params)).then(resolve, reject)
        });
    });
}
function doing () {
    checkAdb().then(() => {
        console.log('安装了adb服务')
        return listDevices();
    }, () => {
        return Promise.reject('未安装adb')
    }).then((data) => {
        console.log('获取设备成功')
        return screenshot();
    }, () => {
        return Promise.reject('获取设备失败')
    }).then(() => {
        console.log('截屏成功')
        return requireAiApi()
    }, (err) => {
        return Promise.reject(err)
    }).then(response => {
        console.log('AI识别成功')
        const faceList = response.data.data.face_list
        let hasBeauty = false
        faceList.forEach((data) => {
            if (data.gender === params.gender &&
                data.age >= params.min_age &&
                data.age <= params.max_age && data.beauty >= params.min_beauty) {
                hasBeauty = true
                return false
            }
        });
        return Promise.resolve(hasBeauty)
    }).then(hasBeauty => {
        if (hasBeauty) {
            console.log('是漂亮妹纸~')
            return adbTool.tap(params.follow_position.x, params.follow_position.y).then(() => {
                return adbTool.tap(params.star_position.x, params.star_position.y)
            })
        } else {
            return Promise.resolve()
        }
    }).then(() => {
        return adbTool.swipe(params.center_position.x, params.center_position.y, params.center_position.x, params.center_position.y - 500)
    }).then(() => {
        doing()
    }).catch(err => {
        console.log(err.toString())
        return false
    });
}
doing()

process.on('exit', () => {
    console.log('感谢使用')
})
process.on('SIGINT', () =>{
    process.exit();
});
// function getDevices() {
//     listDevices().then((data) => {
//         console.log(data)
//     })
// }
