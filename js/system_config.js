
// 分页组件
var url='http://192.168.2.41:38099';
var url1='http://192.168.2.36:38099';

$(function(){

    var idx;
    var idx1;
    var total_num;
    var data_all={};
    var obj_status={status:0}
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
                url:"/system/get_system_list",
                data:this.pageData,
                cache:false,
                success:function(data) {
                    $.Logout($(window.parent.parent), "../login.html", data);
                    var data_all = data;
                    if (data.errcode == 0) {
                        $('#config_list').html(template('config_data', data));
                        total_num = Math.ceil(parseInt(data.countSize) / (obj_all.pageData.pageSize));
                        //引用分页组件
                        $.Pagination(total_num, obj_all, obj_status);
                        $.DealPagination(total_num);
                    }

                    //对数据进行循环处理  ,给状态赋予初始值
                    for (var i = 0; i < data.data.length; i++) {

                        var current_btn = $($(".status_btn")[i]);
                        if (data.data[i].configKey == 1) {
                            current_btn.addClass('change_btn');
                            current_btn.find('span').addClass('circle_btn');
                        } else if (data.data[i].configKey == 2) {
                            current_btn.removeClass('change_btn');
                            current_btn.find('span').removeClass('circle_btn');
                        }
                    }


                    //状态切换
                    $(".status_btn").click(function () {
                        // alert(1111)
                        if ($(this).hasClass('change_btn')) {
                            $(this).removeClass('change_btn');
                            $(this).find('span').removeClass('circle_btn');
                        } else {
                            $(this).addClass('change_btn');
                            $(this).find('span').addClass('circle_btn');
                        }
                    })


                }

            })
        }









    }


    obj_all.ajaxData();  //页面载入时即调用ajaxData方法

// 全选按钮控制
    $("#choose").click(function(){
        if($("#choose").attr("checked")){
            $('.checkbox').attr("checked",true)
        }else{
            $('.checkbox').attr("checked",false)
        }
    })
    //   状态修改，以及提交:
    $("body").on("click",".submit_btn",function(){
        var systemList=[];
        var k=0;
        for(var j=0;j<=obj_all.pageData.pageSize;j++){
            //将所有的状态值重新传输一遍
            var choose=$($(".checkbox")[j]);
            // if(choose.attr("checked")){
                var obj={}
                obj.configValue=$($(".config_value")[j]).html();
                // 获取响应状态
                if($($(".status_btn")[j]).hasClass('change_btn')){
                    obj.configKey=1;
                }else{obj.configKey=2;}
                systemList[j]=obj;


            // }
        }

        var data={};
        data.systemList=JSON.stringify(systemList);
        data.uid=parseInt(localStorage.getItem("uid"));
        data.access_token=localStorage.getItem('access_token');
        // JSON.stringify(data);

        // 开始请求
        $.ajax({
            url:"/system/update_systemConfig",
            data:data,
            cache:false,
            success:function(data) {

                $.Logout($(window.parent.parent), "../login.html", data)
                if (data.errcode == 0) {
                    alert(data.errmsg);

                    obj_all.ajaxData();
                    // $('#config_list').html(template('config_data',data));
                }
            }
        })
    })







})