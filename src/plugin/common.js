
export const regPhone = function(phone){
    let reg = /^1[3|4|5|6|7|8|9]\d{9}$/;
    return reg.test(phone);
}
export const verifyPwd = function(pwd){
    if(pwd.length<8){
        return true;
    }else{
        return false;
    }
}
export const regPwd = function(pwd){
    let reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{8,16}$/;
    return reg.test(pwd);
}
export const toBase64 = function(file, fun) {
    //参数file为input获取到的file数组第一项，fun向外传递转换成功的base64编码
    var reader = new FileReader();
    if(file) {
        reader.readAsDataURL(file);
        reader.onload = function() {
            fun(this.result);
        }
    }
}
export const regEmail = function(email) {
    let reg =  /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    return reg.test(email);
}
export const regIdCard = function(idcard){
    let reg = /^\d{17}(\d|X|x)$/;
    return reg.test(idcard);
}
export const regName = function(name){
    let reg = /^[\u4E00-\u9FA5\uf900-\ufa2d]{2,8}$/;
    return reg.test(name);
}
export const regQQ = function(QQ){
    let reg = /^\d{5,11}$/;
    return reg.test(QQ);
}
export const setCookie = function (cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
export  const getCookie= function (cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
export const ChangeSite= function (params) {
    this.params = params;
    this.province_list = Area.province_list;
    this.city_list = Area.city_list;
    this.county_list = Area.county_list;
}
ChangeSite.prototype.changeProvince = function name() {
    let provinceArr = [];
    for(let item in this.province_list){
        provinceArr.push({"label":this.province_list[item],"value":item})
    }
    return provinceArr;
}
ChangeSite.prototype.changeCity = function name() {
    let cityArr = [];
    let reg = new RegExp("^"+this.params.slice(0,2)+"");
    for(let item in this.city_list){
        if(reg.test(item)){
            cityArr.push({"label":this.city_list[item],"value":item})
        }
    }
    return cityArr;
}
ChangeSite.prototype.changeCounty = function name() {
    let countyArr = [];
    let reg = new RegExp("^"+this.params.slice(0,4)+"");
    for(let item in this.county_list){
        if(reg.test(item)){
            countyArr.push({"label":this.county_list[item],"value":item})
        }
    }
    return countyArr;
}


// 图片压缩
export const compress = function (event) {
    var file = event.target.files;
    var reader = new FileReader(), imgFile = file[0];
    if (imgFile.type.indexOf('image') == 0) {
        reader.readAsDataURL(imgFile);
    } else {
        this.$Message.infor('文件类型仅为图片')
    }
    let img = new Image();
    reader.onload = function (e) {
        img.src = e.target.result;
    };
    var imgP = new Promise((resolve, reject) => {
        img.onload = () => {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            // 瓦片canvas
            var tCanvas = document.createElement("canvas");
            var tctx = tCanvas.getContext("2d");
            var initSize = img.src.length;
            var width = img.width;
            var height = img.height;
            //图片像素大于400万像素，计算压缩到400万以下
            var ratio;
            if ((ratio = width * height / 4000000) > 1) {
                ratio = Math.sqrt(ratio);
                width /= ratio;
                height /= ratio;
            } else {
                ratio = 1;
            }
            canvas.width = width;
            canvas.height = height;
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //如果图片太大则使用瓦片绘制
            var count;
            if ((count = width * height / 1000000 > 1)) {
                count = ~~(Math.sqrt(count) + 1);//计算分成的瓦片数
                var nw = ~~(width / count);
                var nh = ~~(height / count);
                tCanvas.width = nw;
                tCanvas.height = nh;
                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < count; j++) {
                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                    }
                }
            } else {
                ctx.drawImage(img, 0, 0, width, height)
            }
            //进行最小压缩
            var ndata = canvas.toDataURL('image/jpeg', 0.3);
            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
            resolve(ndata)
        }
    })
    return Promise.all([imgP])
}