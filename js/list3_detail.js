



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
                        this.pageData.delegateId=localStorage.getItem('delegateId');
                        this.pageData.pharmacyCode=localStorage.getItem('pharmacyCode');
                        $.get("/relation/get_drugCodedetails_by_pharmacyCode",this.pageData,function(data){

                            $.Logout( $(window.parent.parent),"login.html",data)
                         $('#store_drug_list').html(template('store_drug_data',data));
                            // 分页处理
                            total_num=Math.ceil(parseInt(data.countSize)/(obj_all.pageData.pageSize));
                            //引用分页组件
                            $.Pagination(total_num,obj_all,obj_status);
                            $.DealPagination(total_num);
                             })    
                        
                     }

        
   }
// 页面加载随即发送列表数据请求
obj_all.ajaxData();

    //   点击按钮返回上一级
    $(".up_level").click(function(){
        $(window).attr("location","list3.html");
    })



})