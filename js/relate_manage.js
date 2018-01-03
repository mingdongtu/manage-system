
// var url='http://192.168.2.36:38099';
$(function(){

    var idx;
    var idx1;
    var total_num;
    var first_num=parseInt($(".total_pagination").eq(0).html());
    var obj_status={status:0}
    var search_data={};   //用于保存搜索后的数据
   var search_num=0;
    var obj_all={
        pageData:{page:1,pageSize:10},
        exchange_val:function(){   // 封装一个方法，实现select选中项目与字段的匹配
            var search_obj={};
            var select_val=$(".select_content").val();
            switch(select_val){
                case '手机号码':
                    search_obj.mobile=$.trim($(".search_content").val())
                    break;
                case '用户名':
                    search_obj.username=$.trim($(".search_content").val())
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
                $.get('/relation/get_relation_list',obj,function(data){
                    $.Logout( $(window.parent.parent),"login.html",data)
                    if(data.errcode==0){ //表明页面已经成功发出过搜索请求

                        if(data.data==null){
                            $(".pagination").addClass("hide_pagination");
                            $("#relate_list").addClass("hide_pagination");
                        }else{
                            $(".pagination").removeClass("hide_pagination");
                            $("#user_manage_list").removeClass("hide_pagination");

                            obj_status.status=1;
                            $('#relate_list').html(template('relate_data',data));
                            search_data=data;
                            // 分页处理
                            total_num=Math.ceil(parseInt(data.countSize)/(obj_all.pageData.pageSize));
                            $.SearchNum(search_num);
                            search_num++;
                            $.DealPagination(total_num);
                            $.Pagination(total_num,obj_all,obj_status);
                            // 点击实现跳转关联医药代表详情列表页面

                            $(".present_num").click(function(){
                                var index=$(this).parents('tr').index();
                                var id=data.data[index].delegateId;
                                // var pharmacyCode=data.data[index].pharmacyCode;
                                localStorage.setItem('delegateId',id);
                                $(window).attr('location','list1.html');
                            })


                            $(".doctor_num").click(function(){
                                var index=$(this).parents('tr').index();
                                var id=data.data[index].delegateId;

                                localStorage.setItem('delegateId',id);
                                $(window).attr('location','list2.html');
                            })
                            // $.ToChild($(".drugstore_num"),data,'list3.html');
                            $(".drugstore_num").click(function(){
                                var index=$(this).parents('tr').index();
                                var id=data.data[index].delegateId;

                                localStorage.setItem('delegateId',id);
                                $(window).attr('location','list3.html');
                            })
                        }
                    }else{
                        alert(data.errmsg)
                    }


                })

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
            $.get("/relation/get_relation_list",this.pageData,function(data){

                $.Logout( $(window.parent.parent),"login.html",data)
                $('#relate_list').html(template('relate_data',data));

                total_num=Math.ceil(parseInt(data.countSize)/(obj_all.pageData.pageSize));
                //引用分页组件
                $.Pagination(total_num,obj_all,obj_status);
                $.DealPagination(total_num);


                // 点击实现跳转关联医药代表详情列表页面
                $.ToChild($(".present_num"),data,'list1.html');
                $.ToChild( $(".doctor_num"),data,'list2.html');
                $.ToChild($(".drugstore_num"),data,'list3.html');


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
    $.BackSearch( $(".search_btn"));

})