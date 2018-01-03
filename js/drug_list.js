
var url='http://192.168.2.41:38099';
$(function(){

    var idx;
   var idx1;
   var total_num;
   var obj_status={status:0}
   var search_num=0;
// 分页组件：点击下一个按钮
   var obj_all={
   	pageData:{page:1,pageSize:10},
      exchange_val:function(){   // 封装一个方法，实现select选中项目与字段的匹配
                           var search_obj={};
               var select_val=$(".select_content").val();
                           switch(select_val){
                             case '手机号':
                             search_obj.mobile=$.trim($(".search_content").val())
                             break;
                             case '姓名':
                             search_obj.truename=$.trim($(".search_content").val())
                             break;
                            }
                            return search_obj;
                         },

    ajaxSearch:function(pageNum){
                      var obj=obj_all.exchange_val();
                      obj.page=pageNum;
                      obj.pageSize=10;
                              obj.uid=localStorage.getItem('uid');
                              obj.access_token=localStorage.getItem('access_token');

                            var   select_val=$("#select option:selected").val();
                            var content=$('.search_content').val();
                            var reg=/^1[34578]\d{9}$/;

        var Search=function(){
            $.ajax({
                url:"/drug/get_drug_management",
                data:obj,
                cache:false,
                success:function(data) {
                    // $.get('/drug/get_drug_management',obj,function(data){
                    if (data.errcode == 0) {

                        if (data.data == null) {
                            $(".pagination").addClass("hide_pagination");
                            $("#drug_list").addClass("hide_pagination");
                        } else {
                            $(".pagination").removeClass("hide_pagination");
                            $("#drug_list").removeClass("hide_pagination");
                            obj_status.status = 1;//表明页面已经成功发出过搜索请求

                            $('#drug_list').html(template('drug_data', data));
                            // 分页处理
                            total_num = Math.ceil(parseInt(data.total) / (obj_all.pageData.pageSize));

                            $.SearchNum(search_num);
                            search_num++;
                            $.Pagination(total_num, obj_all, obj_status);
                            $.DealPagination(total_num);
                            $.situationZero($(".drug_num"))
                            // 点击实现跳转关联医药代表详情列表页面
                            $(".drug_num").click(function () {
                                var index = $(this).parents('tr').index();
                                var id = data.data[index].id;
                                var num=parseInt($(this).html());
                                if(num>0){
                                    localStorage.setItem('id', id);
                                    $(window).attr('location', 'drug_list_detail.html');
                                }

                            })
                        }
                    }else{
                        alert(data.errmsg)
                    }
                }
            })
        }
        if(select_val=="手机号"){
             //验证搜索框是否为空
            if(content==''){ //若搜索框为空则不进行正则验证，发送请求
                Search()
            }else{
                if(!(reg.test(content))){
                    alert("输入手机号不正确!");
                }else{ Search();}
            }


        }else{ Search(); }

                      
                    },


    ajaxData:function(){   // 封装一个数据加载的方法

              var index1;
              // 遍历每一个页码，找出颜色高亮的那个页码数
              $(".pagination a").each(function(index,element){
                     if($(element).hasClass('active')){
                           index1=parseInt($(element).html());
                         }
                       })
                        this.pageData.page=index1;
                        this.pageData.uid=parseInt(localStorage.getItem('uid'));
                        this.pageData.access_token=localStorage.getItem('access_token');
        $.ajax({
            url:"/drug/get_drug_management",
            data:this.pageData,
            cache:false,
            success:function(data) {

                // $.get("/drug/get_drug_management",this.pageData,function(data){
                $.Logout($(window.parent.parent), "login.html", data)
                $('#drug_list').html(template('drug_data', data));

                // 分页处理
                total_num = Math.ceil(parseInt(data.total) / (obj_all.pageData.pageSize));
                //引用分页组件
                $.Pagination(total_num, obj_all, obj_status);
                $.DealPagination(total_num);

                // 点击实现跳转关联医药代表详情列表页面

                $(".drug_num").click(function () {
                    var index = $(this).parents('tr').index();
                    var id = data.data[index].id;
                    localStorage.setItem('id', id);
                    console.log(id)
                    $(window).attr('location', 'drug_list_detail.html');
                })

            }

                             })    
                        
                     }

        
   }
// 页面加载随即发送列表数据请求
obj_all.ajaxData();


// 实现搜索功能
$(".search_btn").click(function(){
    search_num=0;
        obj_all.ajaxSearch(1);
})
//    搜索之后，点击药品数实现跳转
    // enter键绑定点击事件
    $(document).keydown(function(event){
        if(event.keyCode==13){

            $(".search_btn").click();
        }
    })

})