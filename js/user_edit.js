  $(function(){
     var url='http://192.168.2.41:38099/'
     var list_edit=eval("("+localStorage.getItem('list_edit')+")");

     $(".username").val(list_edit.username);
     $(".truename").val(list_edit.truename);
     $("#textarea").val(list_edit.reason);
      $(".mobile_num").val(list_edit.mobile);
      $(".company").val(list_edit.company);
      $(".id_msg").val(list_edit.identification_code);
      $(".upright img").attr("src",list_edit.person_front_image);
      $(".down img").attr("src",list_edit.person_reverse_image);

     // 封装一个方法控制单选按钮
      $(".head_img img").attr("src",list_edit.avatar);
      if(list_edit.sex){
          $('#sex_man').attr("checked",true);
      }else{ $('#sex_woman').attr("checked",true);
          }

if(list_edit.avatar==null || list_edit.avatar=='' ){
    if(list_edit.sex){
        $(".head_img img").attr("src","../images/boy.png");
    }else{
        $(".head_img img").attr("src","../images/girl.png")}
}

     $(".sex input").click(function(){
              if($(this).attr("checked")){
               $(this).siblings().attr("checked",false);
           }
     })


    // controlRadio(list_edit.sex,$('#sex_man'),$('#sex_woman'),$(".sex input"));
    // controlRadio(list_edit.is_login,$('#yes'),$('#no'),$(".forbid input"));
            if(list_edit.is_login==1){
                   $("#no").attr("checked",true);
            }else if(list_edit.is_login==0){
                $("#yes").attr("checked",true);
            }

         $(".forbid input").click(function(){
          if($(this).attr("checked")){
              $(this).siblings().attr("checked",false);
          }
      })



     if(list_edit.status==3){
         $("#check_yes").attr("checked",true)

     }else{ $("#check_no").attr("checked",true);}

     //进入编辑页面时
      $(".check input").each(function(index,ele){
              if($(this).attr("checked")){
                  if(index==0){ $("#textarea").attr("readonly","readonly");
                      $(".reason").addClass("reason_hide");}else{
                      $(".reason").removeClass("reason_hide");
                      $("#textarea").removeAttr("readonly");
                  }
              }
      });
     $(".check input").click(function(){
                 if($(this).attr("checked")){
               $(this).siblings().attr("checked",false);

               var index=$(this).index(".check input");
               if(index==0){ // 理由为只读状态
                   $("#textarea").attr("readonly","readonly");
                   $(".reason").addClass("reason_hide");
               }else{
                   $(".reason").removeClass("reason_hide");
                   $("#textarea").removeAttr("readonly");
               }
           }
         })


     // 开始处理图片上传：封装一个处理图片的方法
    //  var uploadImg=function(element,n){
    //        element.change(function(){
    //        var formData=new FormData();
    //        formData.append('file',element[0].files[0]);
    //         var uid_1=localStorage.getItem('uid');
    //         var access_token_1=localStorage.getItem('access_token');
    //         $.ajax({
    //         url:'/user/upload_image?uid='+uid_1+'&access_token='+access_token_1+'&type='+n,
    //         type:'POST',
    //         data:formData,
    //         processData: false,
    //         contentType: false,
    //         success:function(data){
    //           var file_url=data.img_url;
    //           element.next().attr("src",file_url);
    //           // 将修改后的信息保存
    //         }
    //    })

    //    })
    //  }
    // uploadImg($(".file_0"),1) ;  //上传头像
    // uploadImg($(".file_1"),2) ;  //证件照正面上传
    // uploadImg($(".file_2"),3) ;  //证件照反面上传
 // 封装一个模态框方法
      var modal=function(value){
        $(".modal_hide").fadeIn(100);
        $(".modal_content p").html(value)
        $(".confirm").click(function(){
              $(".modal_hide").fadeOut(100);
              if(value="保存成功"){
                  var t=new Date();
                  location.href = "user_manage.html?id="+t;
                  // $(window).attr("location","user_manage.html");
                  // history.go(-1)
              }
        })
  }

    // 封装一个简单的表单验证方法:验证身份证、手机号、以及是否为空
    // var validate=function(element,ele,str){
    //   element.blur(function(){
    //        if($(this).val()==""){
    //         ele.html(str+"不能为空！")
    //        }else if(element.hasClass('mobile_num')){
    //         var mobile_number=parseInt(element.val());
    //         var reg=/^1[34578]\d{9}$/;
    //         if(!(reg.test(mobile_number))){
    //            ele.html("不是完整的11位手机号或者正确的手机号前七位!"); 
    //              }else{ele.html("")}
    //        }else if(element.hasClass('id_msg')){
    //          var id_number=parseInt(element.val());
    //          var reg=/^\d{17}(\d|x)$/i;
    //          if(!(reg.test(id_number))){
    //               ele.html(str+"不正确！"); 
    //          }else{ele.html('')}
    //        }else{ele.html("")}

    //           })
    // }
    // validate($(".username"),$(".username_warn"),"用户名");
    // validate($(".truename"),$(".truename_warn"),"姓名");
    // validate($(".company"),$(".company_warn"),"所属公司");
    // validate($(".mobile_num"),$(".mobile_warn"),"手机号码");
    // validate($(".id_msg"),$(".card_warn"),"证件号码");
   
// 修改后保存功能实现
   $(".save_message").click(function(){
        var data_obj={};
        // 封装一个方法获取单选框字段对应想要的值
        var gainValue=function(element1){
         var idx;
        element1.find("input").each(function(index,element){
              if($(element).attr("checked")){idx=index}
         })
          if(element1.hasClass('sex')){
              if(idx==0){ data_obj.sex=1}else{data_obj.sex=0}
            }else if(element1.hasClass("check")){
              if(idx==0){data_obj.status=3}else if(idx==1){data_obj.status=2}else{return;}//不传状态参数到后台
            }else if(element1.hasClass("forbid")){
              if(idx==0){data_obj.is_login=0}else{data_obj.is_login=1}
            }
        
        }
    
        // data_obj.avatar=$(".head_img img").attr("src");
        // data_obj.username=$(".username").val();
        data_obj.truename=$(".truename").val();//需要
        // gainValue($(".sex"));
        gainValue($(".check"));//需要
        gainValue($(".forbid"));//需要
        // data_obj.mobile=parseInt($(".mobile_num").val());
        // data_obj.company=$(".company").val();
        // data_obj.identification_code=parseInt($(".id_msg").val());
        // data_obj.person_front_image=$(".upright img").attr("src");
        // data_obj.person_reverse_image=$(".down img").attr("src");
        data_obj.reason=$("#textarea").val();//需要
        data_obj.delegate_id=parseInt(list_edit.id);//需要
        data_obj.uid=localStorage.getItem('uid');//需要
        data_obj.access_token=localStorage.getItem('access_token');//需要
        data_obj.admin_name=localStorage.getItem('username');//需要

        if($("#textarea").val()!="" || $("#check_yes").attr("checked")){
            $.get('/user/updateUser',data_obj,function(data){
                $.Logout( $(window.parent.parent),"login.html",data)
                if(data.errcode==0){
                    var value="保存成功！";
                    modal(value);
                }else{
                    alert(data.errmsg);
                }
            })
        }else{alert("理由不能为空！")}

   })

   // //   点击按钮返回上一级
   //    $(".up_level").click(function(){
   //          $(window).attr("location","user_manage.html");
   //    })

   //   将是否通过单选框与下面的编辑框绑定
   })