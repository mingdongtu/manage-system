$(function(){
	var obj={};
	var obj1={};
	  obj.uid=localStorage.getItem('uid');
     obj.access_token=localStorage.getItem('access_token');
     obj.roleid=localStorage.getItem('roleid');
    obj1.roleid=localStorage.getItem('roleid');
    obj1.uid=localStorage.getItem('uid');
    obj1.access_token=localStorage.getItem('access_token');
   // 实时显示文本框中的字数
   $("#textarea").keyup(function(){
   	    $(".current_number").html($(this).val().length);
       var that=this;
       var str=$(this).val();

       if($(this).val().length>120){
           var str1=str.slice(0,120);
           $(".modal_hide").fadeIn(100);
           $(".confirm").click(function(){
               $(".modal_hide").fadeOut(100);
               $(that).val(str1);
               $(".current_number").html($(that).val().length);
           });

       }
   })
   
      // 封装一个动态创建的方法
   var create=function(current_data,div,idx){
       var input=$("<input>"),label=$("<label/>");
  	   input.attr('type','checkbox');label.html(current_data);
  	   input.attr("id","input_"+idx);
       div.append(input);
       div.append(label);
    }

  $.get("/role/get_Role_Power",obj,function(data){

  	var len=data.data.length;
    var data1=data.data;
  	   if(data.errcode==0){
  	   	 for(var i=0;i<len;i++){
  	   	  var div=$("<div/>");
  	   	  $(".edit_content").append(div);
  	   	  var idx1=data1[i].id;
  	   	 	create(data1[i].pow_name,div,idx1);
  	   	 	div.find("label").addClass('some_level');
  	   	 	 if(data1[i].data.length!=0){  //如果存在自二级项目
                 for(var j=0;j<data1[i].data.length;j++){
                 	var idx2=data1[i].data[j].id;
                 	   create(data1[i].data[j].pow_name,div,idx2);
                 }

  	   	 	 }
  	   	  }
  	   }
  	 var div1=$("<div/>");
     create("全选",div1);
     div1.find("label").addClass('some_level');
     div1.find("input").click(function(){
     	    if(div1.find("input").attr("checked")){$(".edit_content input").attr("checked","checked")}else{
     	    	$(".edit_content input").attr("checked",false)
     	    }
     })

     $(".edit_content").append(div1);
     var p=$("<p/>");
     p.html("保存修改");
     p.addClass('save_change');
     $(".edit_content").append(p);

 //将当前管理员权限渲染到页面
      $("#privilege_name").val(data.roleid.role_name);
     $("#textarea").val(data.roleid.note);
      $(".current_number").html($("#textarea").val().length);
 //     封装一个方法：将id与管理员类型结合起来
      var Manage=function(id){
         $("#input_"+id).attr("checked",true)  //将对应id的框选中，再将同级的input框选中
          // $("#input_"+id).siblings("input").attr("checked",true);
      }
 //     遍历已有权限，将其渲染到页面
for(var k=0;k<data.PowerIdData.length;k++){
 var powerId=data.PowerIdData[k].powerId;
    Manage(powerId)
    // if(data1[i].data.length!=0){
    //     var child_id=
    // }
}
 //将父权限与子权限绑定
      var Bind=function(ele){
          ele.unbind("click").click(function(){
              if($(this).attr("checked")){
                  $(this).siblings("input").attr("checked",true)
              }else{$(this).siblings("input").attr("checked",false)}
          })
      }
      var BindChild=function(ele1,ele2){
          ele1.unbind("click").click(function(){
              if($(this).attr("checked")){
                  ele2.attr("checked",true)
              }
          })
      }
      Bind($("#input_3"));
      BindChild($("#input_19"),$("#input_3"))

      Bind($("#input_5"));
      BindChild($("#input_21"),$("#input_5"))
      BindChild($("#input_23"),$("#input_5"))



 // 点击保存，实现权限组添加
   $(".save_change").click(function(){
      if($("#privilege_name").val()){
      	obj1.roleName=$("#privilege_name").val();
   	   obj1.note=$("#textarea").val();
   	   var powerIdList=[];
   	   var num=0;
$(".edit_content input").each(function(index,element){
	    if($(this).attr("checked")){
	    	var id=parseInt($(this).attr("id").substring(6));
	    	 powerIdList[num]={};
           powerIdList[num].id=id;
           num++;
	    }
})
   
    obj1.jsonArray=JSON.stringify(powerIdList);
     console.log(obj1);
     $.get("/role/edit_power",obj1,function(data){
        if(data.errcode==0){
            $.Logout( $(window.parent.parent),"login.html",data)
            alert(data.errmsg);
            $(window).attr("location",'privilege.html');
        }else{
            alert(data.errmsg)
        }
     })
 }else{
 	alert("权限组名称不能为空！")
 }
   	   

 })


  })
 












})