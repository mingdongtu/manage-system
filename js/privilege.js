
// 分页组件
// var url='http://192.168.2.41:38099';
var url='http://192.168.2.36:38099';

$(function(){


   var idx;
   var idx1;
   var total_num;
   var first_num;
   var obj_status={status:0}  //用来监听用户是否成功进行了搜索请求
  var data_all={};//用来存储请求回来的列表数据
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
         url: "/role/get_role_list",
         data: this.pageData,
         cache: false,
         success:function(data) {

             $.Logout($(window.parent.parent), "../login.html", data)
             if (data.errcode == 0) {
                 data_all = data;
                 // 分页处理
                 $('#privilege_list').html(template('privilege_data', data));
                 total_num = Math.ceil(parseInt(data.countSize) / (obj_all.pageData.pageSize));
                 //引用分页组件
                 $.Pagination(total_num, obj_all, obj_status);
                 $.DealPagination(total_num);


             }else{
                 alert(data.errmsg)
             }
             //  对管理员进行修改
             $(".revise").click(function () {
                 var index = $(this).parents("tr").index();

                 localStorage.setItem("roleid", data_all.data[index].roleid);
                 $(window).attr("location", "change_privilege.html");
             })

         }
                        })
                     },

    ajaxSearch:function(pageNum){
                      var obj={};
                      obj.page=pageNum;
                      obj.pageSize=10;
                      //  获取注册时间
                      obj.roleName=$.trim($(".search_content_1").val());
                        obj.uid=localStorage.getItem('uid');
                        obj.access_token=localStorage.getItem('access_token');


        $.ajax({
            url: "/role/get_role_list",
            data: obj,
            cache: false,
            success:function(data) {

                // $.get('/role/get_role_By_condition',obj,function(data){
                $.Logout($(window.parent.parent), "../login.html", data)
                if (data.errcode == 0) {
                    if (data.data == null) {
                        $(".pagination").addClass("hide_pagination");
                        $("#privilege_list").addClass("hide_pagination");
                    } else {
                        $(".pagination").removeClass("hide_pagination");
                        $("#privilege_list").removeClass("hide_pagination");
                        obj_status.status = 1;//表明页面已经成功发出过搜索请求
                        $('#privilege_list').html(template('privilege_data', data));
                        total_num = Math.ceil(parseInt(data.countSize) / (obj_all.pageData.pageSize));
                        $.SearchNum(search_num);
                        search_num++;
                        //引用分页组件
                        $.Pagination(total_num, obj_all, obj_status);
                        $.DealPagination(total_num);
                        //  对管理员进行修改
                        $(".revise").click(function () {
                            var index = $(this).parents("tr").index();
                            console.log(index)
                            console.log(data.data[index].roleid)
                            localStorage.setItem("roleid", data.data[index].roleid);
                            $(window).attr("location", "change_privilege.html");
                        })

                    }
                }else{
                    alert(data.errmsg)
                }
            }
                            })
                      
                    }



                    

}
	

 obj_all.ajaxData();  //页面载入时即调用ajaxData方法
// 删除权限组

     $("body").on("click",".delete_privilege",function(){
           var obj={};
           var index=$(this).parents("tr").index();
           obj.roleid=data_all.data[index].roleid;
           obj.uid=localStorage.getItem('uid');
           obj.access_token=localStorage.getItem('access_token');

         $(".modal_hide3").fadeIn(100);
         $(".quit_privilege").click(function(){ $(".modal_hide3").fadeOut(100);});

         $(".give_privilege").unbind("click").click(function(){

             $.ajax({
                 url: "/role/deleteRole",
                 data: obj,
                 cache: false,
                 success:function(data) {


                     if (data.errcode == 0) {
                         $(".modal_hide3").fadeOut(100);
                         obj_all.ajaxData();
                     }
                 }
           })
         })
          

     })



// 点击搜索，实现内容的检索

  $(".search_btn").click(function(){
      search_num=0;
        obj_all.ajaxSearch(1);
  })
  // 添加管理员
  $(".add_btn").click(function(){
      $(window).attr('location','add_privilege.html');

  })

    // enter键绑定点击事件
    $.BackSearch( $(".search_btn"));

})