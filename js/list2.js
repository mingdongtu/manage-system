
var url='http://192.168.2.36:38099';
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
                             case '医生姓名':
                             search_obj.relationDoctorName=$.trim($(".search_content").val());
                             break;
                            }

                            return search_obj;
                         },

    ajaxSearch:function(pageNum){
          console.log($("#select option:selected").val())
                      var obj=obj_all.exchange_val();
                      obj.page=pageNum;
                      obj.pageSize=10;
                              obj.uid=localStorage.getItem('uid');
                              obj.access_token=localStorage.getItem('access_token');
                              obj.delegateId=localStorage.getItem('delegateId');

                            $.get('/relation/get_doctor_details',obj,function(data){

                                $.Logout( $(window.parent.parent),"login.html",data)
                              if(data.errcode==0){
                                    if(data.data==null){
                                        $(".pagination").addClass("hide_pagination");
                                        $("#doctor_list").addClass("hide_pagination");
                                    }else{
                                        $(".pagination").removeClass("hide_pagination");
                                        $("#doctor_list").removeClass("hide_pagination");
                                        obj_status.status=1;
                                        $('#doctor_list').html(template('doctor_data',data));
                                        total_num=Math.ceil(parseInt(data.countSize)/(obj_all.pageData.pageSize));
                                        $.SearchNum(search_num);
                                        search_num++;
                                        $.Pagination(total_num,obj_all,obj_status);
                                        $.DealPagination(total_num);
                                        $(".doctor_drug").click(function(){
                                            var index=$(this).parents('tr').index();
                                            var doctorCode=data.data[index].doctorCode;
                                            localStorage.setItem("doctorCode2",doctorCode);

                                            $(window).attr('location',"list2_detail.html");
                                        })
                                    }


                                }else{
                                  alert(data.errmsg)
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
                        this.pageData.uid=localStorage.getItem('uid');
                        this.pageData.access_token=localStorage.getItem('access_token');
                        this.pageData.delegateId=localStorage.getItem('delegateId');

                        $.get("/relation/get_doctor_details",this.pageData,function(data){

                            $.Logout( $(window.parent.parent),"login.html",data)
                              $('#doctor_list').html(template('doctor_data',data));
                            // 分页处理
                            total_num=Math.ceil(parseInt(data.countSize)/(obj_all.pageData.pageSize));
                            //引用分页组件
                            $.Pagination(total_num,obj_all,obj_status);
                            $.DealPagination(total_num);
                              
                              // 点击实现跳转关联医药代表详情列表页面
                            $.situationZero($(".doctor_drug"))
                            $(".doctor_drug").click(function(){
                                var index=$(this).parents('tr').index();
                                var doctorCode=data.data[index].doctorCode;
                                var num=parseInt($(this).html());
                                if(num>0){
                                    localStorage.setItem("doctorCode2",doctorCode);
                                    $(window).attr('location',"list2_detail.html");
                                }



                            })

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
        $(window).attr("location","relate_manage.html");
    })

    // enter键绑定点击事件
    // enter键绑定点击事件
    $.BackSearch( $(".search_btn"));

})