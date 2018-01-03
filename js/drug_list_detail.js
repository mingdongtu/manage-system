
var url='http://192.168.2.36:38099';
var url1='http://192.168.2.41:38099';
$(function(){

    var idx;
   var idx1;
   var total_num;

   var obj_status={status:0}
    var  search_num=0;
// 分页组件：点击下一个按钮
   var obj_all={
    pageData:{page:1,pageSize:10},


      exchange_val:function(){   // 封装一个方法，实现select选中项目与字段的匹配
                           var search_obj={};
          var select_val=$(".select_content").val();
                           switch(select_val){
                             case '药品名':
                             search_obj.namecn=$.trim($(".search_content").val())
                             break;
                             
                              case '批准文号':
                             search_obj.codename=$.trim($(".search_content").val());
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
                              obj.id=String(localStorage.getItem("id"));

                              console.log(obj)
        $.ajax({
            url:"/drug/get_drug_detailsList",
            data:obj,
            cache:false,
            success:function(data) {

                // $.get('/drug/get_drug_detailsList',obj,function(data){
                $.Logout($(window.parent.parent), "login.html", data)
                if (data.errcode == 0) {
                    if (data.data == null) {
                        $(".pagination").addClass("hide_pagination");
                        $("#drug_detail_list").addClass("hide_pagination");
                    } else {
                        $(".pagination").removeClass("hide_pagination");
                        $("#drug_detail_list").removeClass("hide_pagination");
                        obj_status.status = 1;
                        $('#drug_detail_list').html(template('drug_detail_data', data));
                        // 分页处理
                        total_num = Math.ceil(parseInt(data.total) / (obj_all.pageData.pageSize));
                        $.SearchNum(search_num);
                        search_num++;
                        //引用分页组件
                        $.Pagination(total_num, obj_all, obj_status);
                        $.DealPagination(total_num);
                        $.situationZero($(".store_num"))
                        $.situationZero($(".doctor_num"))
                        // 点击实现跳转关联药店代表详情列表页面
                        $(".store_num").click(function () {
                            var index = $(this).parents('tr').index();
                            var codename = data.data[index].code;
                            var id = data.id;
                            var num=parseInt($(this).html());
                            if(num>0){
                                localStorage.setItem('id3', id);
                                localStorage.setItem('codename1', codename);
                                $(window).attr('location', 'shop_detail.html');
                            }


                        });
                        // 点击实现跳转关联药店代表详情列表页面
                        $(".doctor_num").click(function () {
                            var index = $(this).parents('tr').index();
                            var codename = data.data[index].code;
                            var id = data.id;
                            var num=parseInt($(this).html());
                            if(num>0){
                                localStorage.setItem('id3', id);
                                localStorage.setItem('codename2', codename);
                                $(window).attr('location', 'doctor_detail.html');
                            }


                        })
                    }


                }else{
                    alert(data.errmsg)
                }
            }
                            })
                      
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
                        this.pageData.id=parseInt(localStorage.getItem('id'));

        $.ajax({
            url:"/drug/get_drug_detailsList",
            data:this.pageData,
            cache:false,
            success:function(data) {

                // $.get("/drug/get_drug_detailsList",this.pageData,function(data){
                $.Logout($(window.parent.parent), "login.html", data)
                $('#drug_detail_list').html(template('drug_detail_data', data));
                // 分页处理
                total_num = Math.ceil(parseInt(data.total) / (obj_all.pageData.pageSize));
                //引用分页组件
                $.Pagination(total_num, obj_all, obj_status);
                $.DealPagination(total_num);

                // 点击实现跳转关联药店代表详情列表页面
                $(".store_num").click(function () {

                    var index = $(this).parents('tr').index();
                    var codename = data.data[index].code;
                    var id = data.id;
                    localStorage.setItem('id3', id);
                    localStorage.setItem('codename1', codename);
                    $(window).attr('location', 'shop_detail.html');

                })
                // 点击实现跳转关联药店代表详情列表页面
                $(".doctor_num").click(function () {

                    var index = $(this).parents('tr').index();
                    var codename = data.data[index].code;
                    var id = data.id;
                    localStorage.setItem('id3', id);
                    localStorage.setItem('codename2', codename);
                    $(window).attr('location', 'doctor_detail.html');

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



    //   点击按钮返回上一级
    $(".up_level").click(function(){
        $(window).attr("location","drug_list.html");
    })
    // enter键绑定点击事件
    $.BackSearch( $(".search_btn"));
})