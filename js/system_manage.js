
// 分页组件
var url='http://192.168.2.41:38099';
var url1='http://192.168.2.36:38099';

$(function(){

  /*easyui日期组件*/
   $("#start_time").datebox({
    height:32,
    editable:false,
  
   });
   
   $("#end_time").datebox({
    height:32,
    editable:false
   });
   
// 
   var idx;
   var idx1;
   var total_num;

   var data_all={};

    var obj_status={status:0}
var search_num=0;
    //用面向对象的思想对代码结构进行改造
var obj_all={
    pageData:{page:1,pageSize:10},   


 ajaxData:function(){   // 封装一个数据加载的方法
              var index1;
               // var data_all;//用来存储请求回来的列表数据
              // 遍历每一个页码，找出颜色高亮的那个页码数
              $(".pagination a").each(function(index,element){
                     if($(element).hasClass('active')){
                           index1=parseInt($(element).html());
                         }
                       });
                        this.pageData.page=index1;
                        this.pageData.uid=localStorage.getItem('uid');
                        this.pageData.access_token=localStorage.getItem('access_token');
                        var that=this;
     $.ajax({
         url:"/admin/get_admin_list",
         data:this.pageData,
         cache:false,
         success:function(data) {

             data_all = data;
             $.Logout($(window.parent.parent), "../login.html", data)
             if (data.errcode == 0) {

                 // 分页处理
                 ChangePrivilege(data_all);  //是否允许登录
                 FixPower(data_all);          //修改管理员
                 data_all = data;
                 $('#system_list').html(template('system_data', data));
                 total_num = Math.ceil(parseInt(data.countSize) / (obj_all.pageData.pageSize));
                 //引用分页组件
                 $.Pagination(total_num, obj_all, obj_status);
                 $.DealPagination(total_num);
                 // 数值与字符串的转换

                 for (var i = 0; i < data.data.length; i++) {
                     var n = parseInt($($(".login_privilege")[i]).html());
                     if (data_all.data[i].isLogin == 1) {
                         $($(".login_privilege")[i]).html("允许登录");
                         $($(".login_privilege")[i]).addClass('allow_color');
                     } else {
                         $($(".login_privilege")[i]).html("禁止登录");
                         $($(".login_privilege")[i]).addClass('forbid_color');
                     }
                     var delete_num=data_all.data[i].isDetele;
                     if(delete_num==1){
                     $($(".transform_check")[i]).html('');
                     }

                 }
             //    将失去权限组的用户


             }



         }
                              
                                    

                        })
                     },

    exchange_val:function(){   // 封装一个方法，实现select选中项目与字段的匹配
                           var search_obj={};
        var select_val=$(".select_content").val();
                           switch(select_val){
                             case '手机号码':
                             search_obj.mobile=$.trim($(".search_content").val())
                             break;
                              case '用户名':
                             search_obj.username=$.trim($(".search_content").val())
                             break;
                              case '姓名':
                             search_obj.truename=$.trim($(".search_content").val())
                             break;
                             
                            }
                            return search_obj;
                         },

    formatDateTime : function (date,time) {      // 封装一个方法，对时间格式进行转换
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        //  var h = date.getHours();
        // h = h < 10 ? ('0' + h) : h;
        // var minute = date.getMinutes();
        // minute = minute < 10 ? ('0' + minute) : minute;
        // var s = date.getSeconds();
        //    s = s < 10 ? ('0' + s) : s;
        // return y + '-' + m + '-' + d + ' ' + h  + ':' + minute  + ':' + s
        return y + '-' + m + '-' + d+" ";
    },

    ajaxSearch:function(pageNum){
                      var obj=obj_all.exchange_val();
                      obj.page=pageNum;
                      obj.pageSize=10;

        // var privilege_index=$("#select option:selected").index("#select option");
        // var privilege_val=$("#select option:selected").val();
        // if(privilege_index > 0){obj.rolename=privilege_val};
        //遍历每一个li找出有class='cur'的元素，获取里面的内容文本

        $(".select_li li").each(function(element,num_index){
                   if($(element).hasClass('cur')){
                    obj.role_name=$(element).find('a').html();
                   }
        })
        //  获取注册时间
                      var start_time=new Date($('.textbox-value').eq(0).val());
                      var end_time=new Date($('.textbox-value').eq(1).val());
                       //  对日期进行判断:只要开始与结束时间有一边没有，就不传时间参数
                        if($('.textbox-value').eq(0).val()!=''&&$('.textbox-value').eq(1).val()!=''){
                            obj.startDate=obj_all.formatDateTime(start_time)+" "+"00:00:00";
                            obj.endDate=obj_all.formatDateTime(end_time)+" "+"23:59:59";
                                        }
                        var time1=obj_all.formatDateTime(start_time).replace(new RegExp("-","gm"),"/");
                        var time2=obj_all.formatDateTime(end_time).replace(new RegExp("-","gm"),"/");
                        var time1H=(new Date(time1)).getTime();
                        var time2H=(new Date(time2)).getTime();
                        obj.uid=localStorage.getItem('uid');
                        obj.access_token=localStorage.getItem('access_token');

        var select_val=$(".select_content").val();

        var select_val1=$(".select_content1").val();
        if(select_val1=="-请选择权限组-"){
            obj.rolename='';
        }else{
            obj.rolename=select_val1;
        }
        var content=$.trim($('.search_content').val());

        var reg=/^1[34578]\d{9}$/;
        var Search=function(){
            if(time1H>time2H){alert("开始时间不能大于结束时间！")
            }else{
                $.ajax({
                    url:"/admin/get_admin_list",
                    data:obj,
                    cache:false,
                    success:function(data) {
                    $.Logout( $(window.parent.parent),"login.html",data)
                    if(data.errcode==0){

                        data_all=data;
                        ChangePrivilege(data_all);  //是否允许登录
                        FixPower(data_all);          //修改管理员
                        // 分页处理
                        if(data.data==null){
                            $(".pagination").addClass("hide_pagination");
                            $("#system_list").addClass("hide_pagination");
                        }else{
                            $(".pagination").removeClass("hide_pagination");
                            $("#system_list").removeClass("hide_pagination");
                            data_all=data;
                            obj_status.status=1;//表明页面已经成功发出过搜索请求
                            $('#system_list').html(template('system_data',data));
                            total_num=Math.ceil(parseInt(data.countSize)/(obj_all.pageData.pageSize));
                            $.SearchNum(search_num);
                            search_num++;
                            //引用分页组件
                            $.Pagination(total_num,obj_all,obj_status);
                            $.DealPagination(total_num);

                        }

                    }else{
                        alert(data.errmsg)
                    }
                    // 数值与字符串的转换
                    for(var i=0;i<data.data.length;i++) {
                        var n = parseInt($($(".login_privilege")[i]).html());
                        if (data_all.data[i].isLogin == 1) {
                            $($(".login_privilege")[i]).html("允许登录");
                            $($(".login_privilege")[i]).addClass('allow_color');
                        } else {
                            $($(".login_privilege")[i]).html("禁止登录");
                            $($(".login_privilege")[i]).addClass('forbid_color');
                        }
                        var delete_num=data_all.data[i].isDetele;
                        if(delete_num==1){
                            $($(".transform_check")[i]).html('');
                        }
                    }
                    }

                })
            }

        }

        if(select_val=="手机号码"){//如果选项为手机号且为空，则继续不用判断继续执行时间
            if(content!=""){
                if(!(reg.test(content))){
                    alert("输入手机号不正确!");
                }else{ Search();}
            }else{Search();}

        }else{
            Search();
        }
    }



                    

}
	

 obj_all.ajaxData();  //页面载入时即调用ajaxData方法

//点击修改低级管理员可登录权限：封装成一个方法

var ChangePrivilege=function(data){
    $("body").on("click",".login_privilege",function(){
        var privile_obj={}
        var that1=this;//注意下面获取index值一定要基于第一个点击事件的对象而不是第二个
        $(".modal_hide3").fadeIn(100);
        // 判断当前登录状态，对它的值进行取反；
        var index=$(that1).parents('tr').index();
        var login=data.data[index].isLogin;
        if(login==1){
            privile_obj.isLogin=0;
            $(".warn_content").html("是否禁止该管理员登录账号?");
        }else{
            privile_obj.isLogin=1;
            $(".warn_content").html("是否允许该管理员登录账号?")
        }

        $(".quit_privilege").click(function(){ $(".modal_hide3").fadeOut(100); });
        $(".give_privilege").unbind("click").click(function(){
            privile_obj.uid=localStorage.getItem('uid');
            privile_obj.access_token=localStorage.getItem('access_token');
            privile_obj.username=data.data[index].username;

            $.ajax({
                url:"/admin/ban_login",
                data:privile_obj,
                cache:false,
                success:function(data) {
                    $.Logout($(window.parent.parent), "../login.html", data)
                    if (data.errcode == 0) {
                        obj_all.ajaxData();
                        $(".modal_hide3").fadeOut(100);
                    }
                }
            })
        })

    })
}

    //将动态创建封装成一个方法
    var createOption=function(data,data1,index){
    var data_option=data.authorityGroupList;
        if(data.data.isDetele==1){
            $("#change_admin .select_content1").val('-请选择权限组-')
            for (var i = 0; i < data_option.length; i++) {
                var option = $("<li/>");
                var a=$("<a/>");
                a.attr('src','javascript:;')
                a.html(data_option[i].roleName);
                option.append(a);
                a.attr("id", "id_" + data_option[i].roleid);
                $("#change_admin .select_li").append(option);
            }

        }else{
            //填充权限组
            for (var i = 0; i < data_option.length; i++) {
                var option = $("<li/>");
                var a=$("<a/>");
                a.attr('src','javascript:;')
                a.html(data_option[i].roleName);
                option.append(a);
                a.attr("id", "id_" + data_option[i].roleid);
                $("#change_admin .select_li").append(option);
            }
            var privilege_name=data1.data[index].roleName;
            $("#change_admin .select_content").val(privilege_name)
        //   同时应该给相应的li标签加上class="cur"

        }


    }
    // 点击实现修改功能:封装成一个方法
var FixPower=function (data) {
  var select_value;
    var data1=data;
    $("body").on("click",".fix",function(){
        var index_add=$(this).parents('tr').index();
        $(".modal_hide").addClass('high_z_index');
        //声明一个变量用于存储后台传回来的经过加密的密码
        var protect_password;
        // 将内容渲染到修改框中
        var obj_add1={};
        obj_add1.username=data.data[index_add].username;
        obj_add1.uid=localStorage.getItem("uid");
        obj_add1.access_token=localStorage.getItem("access_token");
        $.ajax({
            url:"/admin/get_admin_by_username",
            data:obj_add1,
            cache:false,
            success:function(data) {
                var role_data = data.authorityGroupList;
                // protect_password=data.data.password;
                //判断是否已经创建并填充过option，避免重复创建
             var option_len= $("#change_admin").find('li').length;
             if(option_len != 0){
                 $("#change_admin").find('li').remove()
                 //动态创建option，并插入下拉框中：首先判断此管理员对应的权限组是否已经被删除
                 createOption(data,data1,index_add)
                 select_value=data1.data[index_add].roleName
                 $("#change_admin .select_li li").each(function(index,ele){
                     var val=$(ele).find('a').html();
                     if(val==select_value){
                         //   给对应的li机上class="cur"
                         $(ele).addClass('cur');
                     }
                 })
             }else{
                 //动态创建option；
                 createOption(data,data1,index_add)
                 $("#change_admin .select_li li").each(function(index,ele){
                     var val=$(ele).find('a').html();
                     if(val==select_value){
                         //   给对应的li机上class="cur"
                         $(ele).addClass('cur');
                     }
                 })
             }


            }
        })

        $(".add_username1").val(data.data[index_add].username);
        $(".add_truename1").val(data.data[index_add].truename);

        //密码采用固定假值
        var fake_password="Aa546822";
        $(".add_password1").val(fake_password);
        $(".add_mobile1").val(data.data[index_add].mobile);

        var add_obj={};
        add_obj.uid=localStorage.getItem('uid');
        add_obj.access_token=localStorage.getItem('access_token');
        add_obj.oldUsername=data.data[index_add].username;

        var reg=/^1[34578]\d{9}$/;

        $(".close_img").click(function(){$(".modal_hide").removeClass('high_z_index'); });
        $(".quit").click(function(){$(".modal_hide").removeClass('high_z_index'); });
        $(".close_img1").click(function(){$(".modal_hide").removeClass('high_z_index'); });
        //密码框获取焦点时，清空密码框，失去焦点时若用户没有任何输入，则将密码框的内容恢复原样



        //点击提交：
        $(".confirm").unbind('click').click(function(){

            // add_obj.username=$(".add_username1").val();
            // add_obj.truename=$(".add_truename1").val();
            // add_obj.mobile=$(".add_mobile1").val();

            //判断用户对密码是否进行了修改，若是则使用修改后的密码，若不是则使用后台传回来的密码

            var new_password=$.trim($(".add_password1").val());
            if(fake_password==new_password){
                add_obj.newPassword='';
            }else{add_obj.newPassword=$(".add_password1").val();}

            // add_obj.password=protect_password;
            // var option_ch=$(".add_privilege1").find("option:selected");
            //遍历li，找出含有class="cur"的一项
            var option_ch;
            $("#change_admin .select_li li").each(function(index,ele){
                var val=$(ele).find('a').html();
                  if($(ele).hasClass('cur')){
                      option_ch=$(ele).find('a');
                  }
            })
            // add_obj.password=protect_password;
            //发送请求前判断手机号和下拉框是否选择
             var option_content=$("#change_admin .select_content").val();
            if($(".add_username1").val()!="" && $(".add_password1").val()!=""){
                var mobile_number=parseInt($(".add_mobile1").val());
                if(!(reg.test(mobile_number))){
                    alert("手机号输入不正确！")
                }else if(option_content=='-请选择权限组-'){
                    alert('请选择权限组或者取消修改！')
                }else{
                    add_obj.roleId=parseInt(option_ch.attr("id").slice(3));
                    $.ajax({
                        url:"/admin/update_admin",
                        data:add_obj,
                        cache:false,
                        success:function(data) {

                        $.Logout( $(window.parent.parent),"login.html",data)
                        if(data.errcode==0) {
                            $(".modal_hide").removeClass('high_z_index');
                            obj_all.ajaxData();
                        }else{alert(data.errmsg)}
                        }
                    })
                }

            }else{
                alert("你输入的用户名或密码不能为空！")
            }
        })

    })

}






// 点击搜索，实现内容的检索

  $(".search_btn").click(function(){
      search_num=0;
        obj_all.ajaxSearch(1);
  })
  // 添加管理员
    var obj_add={};
    // obj_add=obj_all.pageData;
    obj_add.pageSize=666;
    obj_add.page=666;
    obj_add.uid=localStorage.getItem("uid");
    obj_add.access_token=localStorage.getItem("access_token");
  $(".add_btn").click(function(){
      $(".modal_hide1").addClass('high_z_index');
      $.ajax({
          url:"/role/get_role_list",
          data:obj_add,
          cache:false,
          success:function(data) {
              var role_data = data.data;
              //判断之前是否已经创建过，若有，就将原来的删除，否则就直接添加
              var create_option=$("#add_admin").find('li').length;
              if(create_option != 0){
                  $("#add_admin").find('li').remove();
                  for (var i = 0; i < role_data.length; i++) {
                      var option = $("<li/>");
                      var a=$("<a/>");
                      a.attr('src','javascript:;')
                      a.html(role_data[i].roleName);
                      option.append(a);
                      a.attr("id", "id_" + role_data[i].roleid);
                      $(".select_li").append(option);
                  }
              }else{
                  //动态创建option；
                  for (var i = 0; i < role_data.length; i++) {
                      var option = $("<li/>");
                      var a=$("<a/>");
                      a.attr('src','javascript:;')
                      a.html(role_data[i].roleName);
                      option.append(a);
                      // option.attr("value", role_data[i].role_name);
                      a.attr("id", "id_" + role_data[i].roleid);
                      $(".select_li").append(option);
                  }
              }
              var add_obj = {};
              add_obj.uid = localStorage.getItem('uid');
              add_obj.access_token = localStorage.getItem('access_token');

              // 对手机号进行正则判断

              var reg = /^1[34578]\d{9}$/;

              // 点击取消按钮
              $(".close_img1").click(function () {
                  $(".modal_hide1").removeClass('high_z_index');
              })
              $(".cancel").click(function () {
                  $(".modal_hide1").removeClass('high_z_index');
              })
              $(".sure").unbind('click').click(function () {
                  add_obj.username = $(".add_username").val();
                  add_obj.truename = $(".add_truename").val();
                  add_obj.mobile = $(".add_mobile").val();
                  add_obj.password = $(".add_password").val();

                  // var option_ch = $(".name1 select").find("option:selected");
                  var option_ch;
                  $("#add_admin .select_li li").each(function(index,ele){
                      if($(ele).hasClass('cur')){
                        option_ch=$(ele).find('a');
                      }
                  })
                  add_obj.roleId = parseInt(option_ch.attr("id").slice(3));

                  var mobile_number = parseInt($(".add_mobile").val());
                  if (!(reg.test(mobile_number))) {
                      alert("手机号输入不正确！")
                  } else {
                      $.get("/admin/add_admin", add_obj, function (data) {
                          if (data.errcode == 0) {
                              $(".modal_hide1").removeClass('high_z_index');
                              // 给后台发送请求重新加载列表
                              obj_all.ajaxData();
                          } else {
                              alert(data.errmsg)
                          }
                      })
                  }

              })

          }
   })


  })
//系统管理列表加载时，动态创建搜索时权限组的内容
   $("#select .select_content1").val('-请选择权限组-')
    $.ajax({
        url:"/role/get_role_list",
        data:obj_add,
        cache:false,
        success:function(data) {
            var role_data = data.data;

            //动态创建option；
            for (var i = 0; i < role_data.length; i++) {
                var option = $("<li/>");
                var a=$("<a/>");
                a.attr('src','javascript:;')
                a.html(role_data[i].roleName);
                option.append(a);
                // option.attr("value", role_data[i].roleName);
                a.attr("id", "id_" + role_data[i].roleid);
                $(".select_li").append(option);
            }
        }
    })
    // enter键绑定点击事件
    $.BackSearch( $(".search_btn"));
    $.BackSearch( $(".sure"));
    $.BackSearch( $(".confirm"));
    $.BackSearch( $(".give_privilege"));

})