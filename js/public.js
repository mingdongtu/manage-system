
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
    editable:false,

   });
  $( $("tr .datebox-button-a")[1]).html("清空");
    // $("#end_time").change(function(){
    //
    // })
   // $("#end_time").datebox('setValue',"请选择日期");
  /*easyui日期组件*/
   // var pageData={page:1,pageSize:10};
   var idx;
   var idx1;
   var total_num;
   var obj_status={status:0}  //用来监听用户是否成功进行了搜索请求
   var data_all={};//用来存储请求回来的列表数据；
    var search_num=0;
  //用面向对象的思想对代码结构进行改造
var obj_all={
    pageData:{page:1,pageSize:10},

 ajaxData:function(){   // 封装一个数据加载的方法
              var index1;
              // 遍历每一个页码，找出颜色高亮的那个页码数
              $(".pagination a").each(function(index,element){
                     if($(element).hasClass('active')){
                           index1=parseInt($(element).html());
                         }
                       })
                        this.pageData.page=index1;
                        this.pageData.uid=localStorage.getItem('uid');
                        this.pageData.access_token=localStorage.getItem('access_token');
                        var that=this;
                        $.ajax({
                            url:"/user/getUserByCondition",
                            data:this.pageData,
                            cache:false,
                            success:function(data) {

                                // })
                                // $.get("/user/getUserByCondition",this.pageData,function(data){
                                $.Logout($(window.parent.parent), "login.html", data)
                                data_all = data;
                                $('#user_manage_list').html(template('list_data', data));
                                // 分页处理
                                total_num = Math.ceil(parseInt(data.total) / (obj_all.pageData.pageSize));
                                //引用分页组件
                                $.Pagination(total_num, obj_all, obj_status);
                                $.DealPagination(total_num);
                                //删除成功后并没有执行两个
                                //点击查看按钮，弹出二维码图片
                                $(".look_code").click(function () {
                                    $(".back_box").addClass("box_hide");
                                    $(".back_box").addClass("high_z_index");
                                    $(".img_box").addClass("box_hide");
                                    $(".img_box").addClass("high_z_index");
                                    var num = $(this).parent().parent().index();
                                    var current_obj = data.data[num];
                                    $(".code_img").attr("src", current_obj.associated_url);
                                    $(".close_img").click(function () {
                                        $(".back_box").removeClass("box_hide");
                                        $(".img_box").removeClass("box_hide");
                                        $(".back_box").removeClass("high_z_index");
                                        $(".img_box").removeClass("high_z_index");
                                    })
                                })
                                $(".edit").click(function () {   //点击跳转编辑内容
                                    var mobile = $(this).parents('tr').find('td').eq(4).html();
                                    var index = $(this).parents('tr').index();
                                    if(data_all.data[index].status!=0){
                                        var id_1 = parseInt(data_all.data[index].id);
                                        var mobile_data = {id: id_1}
                                        mobile_data.uid = parseInt(localStorage.getItem('uid'));
                                        mobile_data.access_token = localStorage.getItem('access_token');
                                        // localStorage.setItem('id_0', id_1);
                                        $.get("/user/get_update_info", mobile_data, function (data) {
                                            $.Logout($(window.parent.parent), "login.html", data)
                                            if (data.errcode == 0) {
                                                // 将想要的部分数据注入缓存
                                                var list_edit = JSON.stringify(data.data);
                                                localStorage.setItem('list_edit', list_edit);
                                                $(window).attr('location', 'user_edit.html');
                                            }
                                        })
                                    }


                                })

                                // 将性别、认证审核以及登录状态改成文字形式,一定要循环修改
                                for (var i = 0; i < data.data.length; i++) {
                                    var sex = data_all.data[i].sex;
                                    var sex = parseInt($($(".transform_sex")[i]).html());
                                    var check = parseInt($($(".transform_check")[i]).html());
                                    var login = parseInt($($(".transform_login")[i]).html());

                                    if (sex == 0) {
                                        $($(".transform_sex")[i]).html('女');
                                    } else {
                                        $($(".transform_sex")[i]).html('男');
                                    }

                                    if (check == 0) {
                                        $($(".transform_check")[i]).html("待提交资料")
                                    //    将编辑颜色改变
                                         $($(".edit")[i]).addClass("gray");
                                    } else if (check == 1) {
                                        $($(".transform_check")[i]).html("待审核")
                                    } else if (check == 2) {
                                        $($(".transform_check")[i]).html("未通过")
                                    } else if (check == 3) {
                                        $($(".transform_check")[i]).html("已通过")
                                    }

                                    if (login == 0) {
                                        $($(".transform_login")[i]).html('禁止登录');
                                        $($(".transform_login")[i]).addClass("warn_color");
                                    } else {
                                        $($(".transform_login")[i]).html('允许登录');
                                        $($(".transform_login")[i]).removeClass("warn_color");
                                    }
                                }
                            }

                        })
                     },

    exchange_val:function(){   // 封装一个方法，实现select选中项目与字段的匹配
                           var search_obj={};
                           var select_val=$(".select_content").val();
                           switch(select_val){
                             case '手机号码':
                             search_obj.mobile=$.trim($(".search_content").val());
                             break;
                              case '用户名':
                             search_obj.username=$.trim($(".search_content").val());
                             break;
                              case '姓名':
                             search_obj.truename=$.trim($(".search_content").val());
                             break;
                             case '证件号码':
                             search_obj.identification_code=$.trim($(".search_content").val());
                             break;
                             case '公司':
                             search_obj.company=$.trim($(".search_content").val());
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
                        return y + '-' + m + '-' + d ;
   },

    ajaxSearch:function(pageNum){
                    var obj={};
                    obj=obj_all.exchange_val();
                        // var data_all;//用来存储请求回来的列表数据
                      obj.page=pageNum;
                      obj.pageSize=10;
                      //  获取注册时间
                      var start_time=new Date($('.textbox-value').eq(0).val());
                      var end_time=new Date($('.textbox-value').eq(1).val());
                      // console.log($('.textbox-value').eq(0).val())
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

                         var   select_val=$("#select option:selected").val();
                         var content=$.trim($('.search_content').val());
                         var reg=/^1[34578]\d{9}$/;


var Search=function(){
    if(time1H>time2H){  //开始时间不能大于或等于结束时间
        alert("开始时间不能大于结束时间！")
    }else{
        $.ajax({
            url:"/user/getUserByCondition",
            data:obj,
            cache:false,
            success:function(data) {
                // $.get('/user/getUserByCondition',obj,function(data){
                var data_all = data;
                $.Logout($(window.parent.parent), "login.html", data)
                if (data.errcode == 0) {

                    if (data.data == null) {
                        $(".pagination").addClass("hide_pagination");
                        $("#user_manage_list").addClass("hide_pagination");
                    } else {
                        $(".pagination").removeClass("hide_pagination");
                        $("#user_manage_list").removeClass("hide_pagination");

                        obj_status.status = 1;//表明页面已经成功发出过搜索请求
                        $('#user_manage_list').html(template('list_data', data));
                        // 分页处理
                        total_num = Math.ceil(parseInt(data.total) / (obj_all.pageData.pageSize));
                        //将页码重新归一

                        $.SearchNum(search_num);
                        search_num++;
                        //引用分页组件
                        $.Pagination(total_num, obj_all, obj_status);
                        $.DealPagination(total_num);

                        $(".edit").click(function () {   //点击跳转编辑内容
                            // 首先获取需要的数据将其以对象的形式存储在一个变量中
                            var mobile = $(this).parents('tr').find('td').eq(4).html();
                            var index = $(this).parents('tr').index();
                            var id_1 = parseInt(data_all.data[index].id);
                            var mobile_data = {id: id_1}
                            mobile_data.uid = parseInt(localStorage.getItem('uid'));
                            mobile_data.access_token = localStorage.getItem('access_token');
                            // localStorage.setItem('id_0', id_1);
                            $.get("/user/get_update_info", mobile_data, function (data) {
                                $.Logout($(window.parent.parent), "../login.html", data)
                                if (data.errcode == 0) {

                                    // 将想要的部分数据注入缓存
                                    var list_edit = JSON.stringify(data.data);
                                    localStorage.setItem('list_edit', list_edit);
                                    $(window).attr('location', 'user_edit.html');
                                }
                            })

                        })


                        //点击查看按钮，弹出二维码图片
                        $(".look_code").click(function () {

                            $(".back_box").addClass("box_hide");
                            $(".back_box").addClass("high_z_index");
                            $(".img_box").addClass("box_hide");
                            $(".img_box").addClass("high_z_index");
                            var num = $(this).parent().parent().index();
                            var current_obj = data.data[num];
                            $(".code_img").attr("src", current_obj.associated_url);
                            $(".close_img").click(function () {
                                $(".back_box").removeClass("box_hide");
                                $(".img_box").removeClass("box_hide");
                                $(".back_box").removeClass("high_z_index");
                                $(".img_box").removeClass("high_z_index");
                            })

                        })

                        // 将性别、认证审核以及登录状态改成文字形式,一定要循环修改
                        for (var i = 0; i < data.data.length; i++) {
                            var sex = data_all.data[i].sex;
                            // var sex=parseInt($($(".transform_sex")[i]).html());
                            var check = parseInt($($(".transform_check")[i]).html());
                            var login = parseInt($($(".transform_login")[i]).html());

                            if (parseInt(sex) == 0) {
                                $($(".transform_sex")[i]).html('女');
                            } else {
                                $($(".transform_sex")[i]).html('男');
                            }

                            if (check == 0) {
                                $($(".transform_check")[i]).html("待提交资料");
                                $($(".edit")[i]).addClass("gray");

                            } else if (check == 1) {
                                $($(".transform_check")[i]).html("待审核")
                            } else if (check == 2) {
                                $($(".transform_check")[i]).html("未通过")
                            } else if (check == 3) {
                                $($(".transform_check")[i]).html("已通过")
                            }

                            if (login == 0) {
                                $($(".transform_login")[i]).html('禁止登录');
                                $($(".transform_login")[i]).addClass("warn_color");
                            } else {
                                $($(".transform_login")[i]).html('允许登录');
                                $($(".transform_login")[i]).removeClass("warn_color");
                            }
                        }

                    }
                }else{
                    alert(data.errmsg)
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

//  点击删除
  $('body').on('click','.delete',function(){
           var that1=this;
                        $(".modal_hide").fadeIn(100); 
                        $(".quit").click(function(){ $(".modal_hide").fadeOut(100); });

                         $(".confirm").unbind('click').click(function(){
                           // $("body").off("click",".confirm");
                              var index=$(that1).parents('tr').index();   
                              var delete_obj={}
                              var delegate_id=data_all.data[index].id;
                             console.log(delegate_id)
                              // delete_obj.delegate_id=id;
                              delete_obj.uid=localStorage.getItem('uid');
                              delete_obj.access_token=localStorage.getItem('access_token');
                              delete_obj.delegate_id=delegate_id;
                              $.get("/user/deleteUser",delete_obj,function(data){           
                                 if(data.errcode==0){
                                     $(".modal_hide").fadeOut(100); 
                                      obj_all.ajaxData();

                                   }
                                 })

                               })
  })
       
                                   
                        
          
     



// 点击搜索，实现内容的检索

  $(".search_btn").click(function(){
      search_num=0;
        obj_all.ajaxSearch(1);
  })

    // enter键绑定点击事件
    // enter键绑定点击事件
    $.BackSearch( $(".search_btn"));
    $.BackSearch( $(".confirm"));
})