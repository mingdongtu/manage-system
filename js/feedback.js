
var url='http://192.168.2.36:38099';
$(function(){

    var idx;
   var idx1;
   var total_num;

   var obj_status={status:0}
// 分页组件：点击下一个按钮
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

        $.ajax({
            url:"/feedback/get_feedback_list",
            data:this.pageData,
            cache:false,
            success:function(data) {

                // $.get("/feedback/get_feedback_list",this.pageData,function(data){
                $.Logout($(window.parent.parent), "login.html", data)
                if (data.errcode == 0) {

                    // 分页处理
                    if (data.data == null) {
                        alert("没有数据！")
                        $(".pagination").addClass("hide_pagination");
                    } else {
                        $('#feedback_list').html(template('feedback_data', data));
                        total_num = Math.ceil(parseInt(data.countSize) / (obj_all.pageData.pageSize));
                        //引用分页组件
                        $.Pagination(total_num, obj_all, obj_status);
                        $.DealPagination(total_num);
                    }

                }

                // 点击实现跳转关联医药代表详情列表页面
                $(".feedback_num").click(function () {
                    var feedback_data = {};
                    var index = $(this).parents('tr').index();
                    var id = data.data[index].delegateId;
                    localStorage.setItem('delegate_no', id);
                    $(window).attr('location', 'feedback_detail.html');

                })
            }
                             })    

                     }

        
   }
// 页面加载随即发送列表数据请求
obj_all.ajaxData();




})