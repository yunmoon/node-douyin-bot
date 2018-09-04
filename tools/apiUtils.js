const crypto = require('crypto');
module.exports = {
    //对象排序
    objectSort (obj) {
      const keys = Object.keys(obj).sort();
      let newObj = {};
      keys.forEach((val) => {
          newObj[val] = obj[val];
      })
      return newObj;
    },
    formatStr (obj) {
        $strs = [];
        Object.keys(obj).forEach((val) => {
            $strs.push(`${val}=${encodeURIComponent(obj[val])}`)
        })
        return $strs.join('&');
    },
    getReqSign (str, appkey) {
        str += `&app_key=${appkey}`
        const md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex');
    }
};
