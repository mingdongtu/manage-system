// 声明一个全局变量，用于存储登录成功返回的数据

$(function(){
    //阻止后退
    var counter = 0;
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            window.history.pushState('forward', null, '#');
            window.history.forward(1);

        });
    }

    window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
    window.history.forward(1);
    // var url="http://192.168.2.41:38099";
    var url="http://192.168.2.36:38099";
    $(".verifyImg").attr("src","/code/create_code");
    // 每点击一次完成一次请求，并且将原有的元素删除掉
    // 采用原生的xmlhttp请求：
    // var xmlhttp=new XMLHttpRequest();
    $(".change_code").click(function(){
        $.ajax({
            type:"GET",
            url: "/code/create_code",
            // crossDomain:true,
            success:function(data){
                var data1 = new Date();
                $(".verifyImg").attr("src","/code/create_code?data=" + data1);

            }
        })


    })
// 封装两个方法，用于登录出错时前端样式的实现
    // var  remind=function(ele1,ele2){
    //        $(".img_error").ele1("img_show");
    //        $(".user").ele1('warn_color');
    //        $(".user_tip").ele1("img_show");
    //        $(".img_error").ele2("img_show");
    //        $(".user").ele2('warn_color');
    //        $(".user_tip").ele2("img_show");
    // }
    // 封装一个模态框方法
    var modal=function(value){
        $(".modal_hide").fadeIn(100);
        $(".modal_content p").html(value)
        $(".confirm").click(function(){
            $(".modal_hide").fadeOut(100);
        })
    }

    // 点击登录按钮
    $(".btn1").unbind("click").click(function(){



        var data={};
        var userName=$(".user").val();
        var  password=$(".password").val();
        var verify_input=$(".verify_input").val().toUpperCase();
        var username_length=$.trim($(".user").val()).length;
        var  password1=$.trim($(".password").val()).length;
        // 对用户名和密码进行AES加密处理
        var key = CryptoJS.enc.Utf8.parse("6ee15b7a65d3c7fcf73d94c1b7f81d33");   //加密使用的key


        var plaintText1 = userName; // 明文用户
        var plaintText2 = password;//明文密码
        // 开始加密
        var encryptedData1 = CryptoJS.AES.encrypt(plaintText1, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        var encryptedData2 = CryptoJS.AES.encrypt(plaintText2, key, {

            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });

        data.username=''+encryptedData1;
        data.password=''+encryptedData2;
        data.code=verify_input;

        // ajax请求前先要检测用户名和密码是否为空
        if(!userName&&!password){
            // 测试：触发模态框
            var value="用户名和密码均不能为空！";
            modal(value);
        }else if(!userName){
            var value="用户名不能为空！";
            modal(value);
        }else if(!password){
            var value="密码不能为空！";
            modal(value);
        }else if(userName.length>username_length){
            alert("用户名不能有空格！")
        }else {
            $.ajax({
                type:"GET",
                url:'/user/login',
                data:data,
                // crossDomain:true,
                success:function(data){
                    if(data.errcode==0){
                        localStorage.setItem('username',data.data.username);
                        localStorage.setItem('uid',data.data.uid);
                        if(data.data.isDetele==1){
                            localStorage.setItem('roleName',"");
                            var list=[];
                        }else{
                            var list=JSON.stringify(data.data.menuList);
                            localStorage.setItem('roleName',data.data.roleName);
                        }
                        localStorage.setItem('access_token',data.data.access_token);
                        localStorage.setItem('list',list);
                        localStorage.setItem('password',password);
                        location.href="main.html";
                    }else{ //失败情况下的各种提示
                        if(data.errmsg=="用户不存在"){
                            $(".img_error").addClass("img_show");
                            $(".user").addClass('warn_color');
                            $(".user_tip").addClass("img_show");
                            $(".error_img").removeClass("img_show");
                            $(".password").removeClass('warn_color');
                            $(".password_tip").removeClass("img_show");
                            $(".password").addClass('right_color');
                            $(".img_right").addClass('img_show');
                        }else if(data.errmsg=="密码错误"){
                            $(".img_error").removeClass("img_show");
                            $(".user").removeClass('warn_color');
                            $(".user").addClass('right_color');
                            $(".right_img").addClass("img_show");
                            $(".user_tip").removeClass("img_show");
                            $(".error_img").addClass("img_show");
                            $(".password").addClass('warn_color');
                            $(".password_tip").addClass("img_show");
                        }else{
                            modal(data.errmsg)
                        }
                        // else if(data.errmsg=="登录失败"){
                        //     var value="登录失败！";
                        //     modal(value);
                        // }else if(data.errmsg=="验证码错误"){
                        //     var value="验证码错误！";
                        //     modal(value);
                        // }else if(data.errmsg=="您已被禁止登录"){
                        //     var value="您已被禁止登录";
                        //     modal(value);
                        // }
                        // else{
                        //     $(".img_error").removeClass("img_show");
                        //     $(".user").removeClass('warn_color');
                        //     $(".user_tip").removeClass("img_show");
                        //     $(".error_img").removeClass("img_show");
                        //     $(".password").removeClass('warn_color');
                        //     $(".password_tip").removeClass("img_show");
                        // }
                    }
                }
            })



        }
    })

// enter键绑定点击事件
    $(document).keydown(function(event){
        if(event.keyCode==13){

            $(".btn1").click();
        }
    })


})