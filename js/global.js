// 构建一个全局方法库
$(function($){
    //判断token值是否为null
    var host = 'http://' + window.location.host + '/html/';
    var token=localStorage.getItem('access_token');

    if(token==null){
        if(top.location != self.location){
            // top.location = self.location
            top.location = host+"login.html"
        }
    }

   var Logout=function Logout(){}

    $.Logout = function (ele, url, data) {   //未登录时自动跳出

        if(typeof data === "object"){
            if(data.time=="30"){
                alert("登录已经超时，请重新登录！")
                top.location = host+"login.html"
                localStorage.clear();
            }else{
                if (data.user == 1) {
                    alert("你的账户已在其他设备登录！")
                    top.location = host+"login.html"
                    localStorage.clear();
                }else if(data.isLogin==0){
                    alert("你已经被禁止登录！")
                    top.location = host+"login.html"
                    localStorage.clear();
                }
                return;
            }
        }
      // var data=eval('('+data+')');


    }
//封装一个分页处理方法
var DealPagination=function DealPagination(){};
    $.DealPagination=function(total_num){

        $(".total_pagination").html(total_num);
        if(total_num<=1){
            $(".pagination").addClass("hide_pagination");
        } else if(total_num<=7&&total_num>1){
            $(".pagination").removeClass("hide_pagination");
            $(".omit").addClass("hide_pagination");
            for(var j=0;j<total_num;j++){
                $(".pagination a").eq(j).html(j+1);
                $(".pagination a").eq(j).removeClass("hide_pagination");
            }
            //改变组件的宽度
            $(".pagination").css("width",22*(total_num+2)+130+'px');
            for(var i=total_num;i<=7;i++){
                $(".pagination a").eq(i).addClass("hide_pagination");
            }
            $(".pagination").removeClass('omit_hide')
            }else{
            $(".pagination").removeClass("hide_pagination");
            $(".last_second").html(total_num-1);
            $(".last_one").html(total_num);
            $(".pagination").removeClass('omit_hide')
        }
    }
//封装一个点击数字然后跳转的方法
    var ToChild=function ToChild(){};
    $.ToChild=function(ele,data,url){
        ele.each(function(index1,ele1){
            var num=parseInt($(ele1).html());
            if(num==0){$(ele1).addClass('gray_num')}
        })
       ele.click(function(){
            //若本身数量是0，则不跳转
           var num=parseInt($(this).html());
           if(num>0){
               var index=$(this).parents('tr').index();
               var id=data.data[index].delegateId;
               localStorage.setItem('delegateId',id);
               // $(window).attr('location',url);
               location.href=url;
           }

        })
    }
//    封装一个全局的方法，当数量为0 时将值得颜色设置为灰色
    var situationZero=function situationZero(){};
    $.situationZero=function(cur_ele){
        cur_ele.each(function(index1,ele1){
            var num=parseInt($(ele1).html());
            if(num==0   ){$(ele1).addClass('gray_num')}
        })
    }
//    封装一个回车键搜索
    var BackSearch=function BackSearch(){}
    $.BackSearch=function(ele){
        $(document).keydown(function(event){
            if(event.keyCode==13){
                ele.click();
            }
        })
    }
//    封装一个方法解决搜索后页码归一的问题
    var SearchNum=function SearchNum(){};
    $.SearchNum=function(num){
        if(num==0){
            $(".pagination a").eq(0).addClass("active");//给当前页码加上颜色
            $(".pagination a").eq(0).siblings(".pagination a").removeClass("active");
        }

    }
});