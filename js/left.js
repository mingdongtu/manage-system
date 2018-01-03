$(function(){
	
	  // 动态创建左侧折叠栏
	var privilege_data=eval(localStorage.getItem('list'));//获取权限数据
	
   var Create=function(k){
   		var h3=$("<h3/>"),a=$("<a/>"),img=$("<img/>"),span=$("<span/>");
   	    a.attr("target","I2");

   	    if(k==1){
            var pow_name=privilege_data[i].pow_name;
            var url=privilege_data[i].url;
   	        var img_src=privilege_data[i].imageUrl;
            img.attr("src",img_src);
   	    a.append(img);

   	    }else{
            var pow_name=privilege_data[i].data[j].pow_name;
            var url=privilege_data[i].data[j].url;
		}
   	    span.html(pow_name);
   	    a.attr("href",url);
   	    a.append(span);
   	    h3.append(a);
   	    return h3;
   }
var h3=$("<h3/>"),a=$("<a/>"),img=$("<img/>"),span=$("<span/>");
   for(var i=0;i<privilege_data.length;i++){
     	var k=1;
       var content1=Create(k);
   	    $(".main_content").append(content1);
 if(privilege_data[i].data.length!=0){
   content1.addClass("first_list");
 	var div=$("<div/>");
    div.addClass("list_hide");
 	   for(var j=0;j<privilege_data[i].data.length;j++){
          var k=0;
          var content2=Create(k);
          div.append(content2);
 	   }
 	 $(".main_content").append(div);
 }

   }

// 侧边栏创建后对有子栏目的项目加上指示图标：首先判断每一个一级菜单是否有子菜单，若有则动态创建一个图标并插入其中
     $(".main_content>h3").each(function(index,element){
            var child_list=$(element).next('div')[0];
            if(child_list){
                 var div=$('<div/>'),img=$("<img/>");
                 div.addClass('arrow');
                 div.addClass('rotate')
                 img.addClass('arrow_img');
                 img.attr('src','images/down.png');
                 div.append(img);
                 $(element).append(div);
            //点击箭头图标实现列表下拉，以及角度转换



            }
     })
    $(".main_content").on("click",".arrow",function(event){
        // 判断角度
        event.stopPropagation();
        if($(this).hasClass('rotate')){
            $(this).removeClass('rotate');
        }else{$(this).addClass('rotate')}
        $(this).parent('.first_list').next('div').slideToggle(400);

    })

    $(".main_content").on("click",".first_list a",function (){

        $(this).find(".arrow").trigger("click")
    })
//点击选中某一个列表项，就将其字体变成白色
    $("h3 a").click(function(event){

        event.stopPropagation();
        var first_list=$(this).parent()
        if(first_list.hasClass('first_list')){
            first_list.find(".arrow").trigger("click")
        }
        // $(".main_content h3").addClass('other');
        // $(".main_content div").addClass('other');
        // $(this).find("span").attr('id','chooseen')
    })
//将系统管理去掉

$(".first_list:last").find('a').attr("href",'javascript:void(0);');
	// $($(".first_list")[1]).find('a').attr("target",'');
})