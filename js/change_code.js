$(function(){
    var change_code={uid:localStorage.getItem('uid'),access_token:localStorage.getItem('access_token')}
    // 首先判断新密码是否是数字和字符组成

    $(".save_btn").click(function(){
        var  reminder_val=$(".origin_code").val();
        var  new_val=$(".new_code").val();
        var  confirm_val=$(".confirm_code").val();
        var  regexp=/(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{6,12}/;
        if(new_val.length<6||new_val.length>12){
            alert("密码长度为6-12位！")
        }else if(/^\d+$/.test(new_val)){
            alert("不能全是数字！")
        }else if(/^[a-z]+$/i.test(new_val)){
            alert("不能全是字母！")
        }else{

            // 对数据进行AES加密处理
            var key = CryptoJS.enc.Utf8.parse("6ee15b7a65d3c7fcf73d94c1b7f81d33");   //加密使用的key
            var plaintText1 = reminder_val; // 明文用户
            var plaintText2 = new_val;//明文密码
            var plaintText3 =confirm_val;//明文确认密码
            // 开始加密
            var encryptedData1 = CryptoJS.AES.encrypt(plaintText1, key, {

                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7

            });

            var encryptedData2 = CryptoJS.AES.encrypt(plaintText2, key, {

                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });

            var encryptedData3 = CryptoJS.AES.encrypt(plaintText3, key, {

                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            });
            change_code.oldPassword=''+encryptedData1;
            change_code.newPassword=''+encryptedData2;
            change_code.confirmPassword=''+encryptedData3;

            $.get("/user/change_password",change_code,function(data){
                $.Logout( $(window.parent.parent),"login.html",data)
                if(data.errcode==0){
                    localStorage.clear();
                    $(window.parent.parent).attr("location",'../login.html');  //修改成功后跳转到登录页面
                }else{alert(data.errmsg);}

            })

        }



    })


    $.BackSearch( $(".save_btn"));


})