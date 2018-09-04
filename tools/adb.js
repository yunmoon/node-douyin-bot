const child_process = require('child_process');

function pullFile () {
    const adbProcess = child_process.spawn('adb', ['pull', '/sdcard/screenshot.png', './'])
    return new Promise((resolve, reject) => {
        adbProcess.stderr.on('data', function (data) {
            reject(data)
        });
        adbProcess.on('error', (err) => {
            reject(err)
        });
        adbProcess.on('exit', (code) => {
            if (code === 0) {
                resolve()
            }
        })
    })
}

module.exports = {
    //检查adb是否安装
    checkAdb () {
        const adbProcess = child_process.spawn('adb', ['version'])
        return new Promise((resolve, reject) => {
            adbProcess.on('error', (err) => {
                console.log('请安装adb服务');
                reject()
            });
            adbProcess.stdout.on('data', function (data) {
                console.log('stdout: ' + data);
                resolve()
            });

            adbProcess.stderr.on('data', function (data) {
                console.log('请安装adb服务');
            });
        })
    },
    listDevices () {
        const adbProcess = child_process.spawn('adb', ['devices'])
        return new Promise((resolve, reject) => {
            adbProcess.stdout.on('data', function (data) {
                let devices = [];
                data = data.toString().split('\n');
                data.forEach((val, index) => {
                    if (index > 0 && val) {
                        devices.push(val.split('\t')[0])
                    }
                })
                if (!devices.length) {
                    reject('未连接设备')
                } else {
                    resolve(devices)
                }
            });

            adbProcess.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
                reject(data)
            });
        })
    },
    screenshot () {
        const adbProcess = child_process.spawn('adb', ['shell', 'screencap', '-p', '/sdcard/screenshot.png'])
        return new Promise((resolve, reject) => {
            // adbProcess.stdout.on('data', function (data) {
            //    resolve(data)
            // });

            adbProcess.stderr.on('data', function (data) {
                reject(data)
            });
            adbProcess.on('error', (err) => {
                reject(err)
            });
            adbProcess.on('exit', (code) => {
                if (code === 0) {
                    // resolve()
                    pullFile().then(resolve, reject)
                }
            })
        })
    },
    tap (x, y) {
        const adbProcess = child_process.spawn('adb', ['shell','input', 'tap', x, y])
        return new Promise((resolve, reject) => {
            adbProcess.on('error', (err) => {
                reject(err)
            });
            adbProcess.stderr.on('data', function (data) {
                reject(data)
            });
            adbProcess.on('exit', (code) => {
                if (code === 0) {
                    // resolve()
                    resolve()
                }
            })
        })
    },
    swipe (x, y ,tx, ty) {
        const adbProcess = child_process.spawn('adb', ['shell','input', 'swipe', x, y, tx, ty])
        return new Promise((resolve, reject) => {
            adbProcess.on('error', (err) => {
                reject(err)
            });
            adbProcess.stderr.on('data', function (data) {
                reject(data)
            });
            adbProcess.on('exit', (code) => {
                if (code === 0) {
                    // resolve()
                    resolve()
                }
            })
        })
    }
}
