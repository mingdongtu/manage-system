
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
                             case '医生':
                             search_obj.name=$(".search_content").val()
                             break;
                             
                              case '姓名':
                             search_obj.truename=$.trim($(".search_content").val())
                             break;
                               case '药品':
                                   search_obj.drug_name=$.trim($(".search_content").val())
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
                         if(obj.hasOwnProperty("name")){
                             url="/order/get_orders_list";
                         }else{ url="/order/get_order_list";}
                            $.get(url,obj,function(data){
                                if(data.errcode==0){

                                    obj_status.status=1;
                                    if(data.data==null){
                                        alert("没有数据！")
                                        $(".pagination").addClass("hide_pagination");
                                        $("#order_list").addClass("hide_pagination");
                                    }else{
                                        $(".pagination").removeClass("hide_pagination");
                                        $("#order_list").removeClass("hide_pagination");

                                        $('#order_list').html(template('order_data',data));
                                        total_num=Math.ceil(parseInt(data.total)/(obj_all.pageData.pageSize));
                                        $.SearchNum(search_num);
                                        search_num++;
                                        //引用分页组件
                                        $.Pagination(total_num,obj_all,obj_status);
                                        $.DealPagination(total_num);
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
                        this.pageData.uid=parseInt(localStorage.getItem('uid'));
                        this.pageData.access_token=localStorage.getItem('access_token');
                        // this.pageData.id=localStorage.getItem('id');
                        $.get("/order/get_order_list",this.pageData,function(data){
                            $.Logout( $(window.parent.parent),"login.html",data)
                             if(data.errcode==0){

                                 // 分页处理
                                 if(data.data==null){
                                     alert("没有数据！")
                                      $(".pagination").addClass("hide_pagination");
                                 }else{
                                     $('#order_list').html(template('order_data',data));
                                     total_num=Math.ceil(parseInt(data.total)/(obj_all.pageData.pageSize));
                                     //引用分页组件
                                     $.Pagination(total_num,obj_all,obj_status);
                                     $.DealPagination(total_num);
                                 }

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

    // enter键绑定点击事件
    // enter键绑定点击事件
    $.BackSearch( $(".search_btn"));
})