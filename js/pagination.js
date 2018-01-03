
/*
分页插件接收3个参数：
1、总页数；
2、一般情况下页面刷新数据请求；
3、搜索后，页面刷新的数据请求；
*/


$(function($){
var Pagination=function Pagination(){};
  $.Pagination=function(total_num,obj_all,obj_status){
      var idx;
      var idx1;
      var obj_all1= {
          pageData: {page: 1, pageSize: 10},
          changePage: function (s, p, v, u) {  // 封装一个changePage方法，用来批量改变页数的值
              for (var i = s; i < v; i++) {
                  var num = parseInt($(".pagination a").eq(i).html());
                  if (p) {
                      num++;
                      $(".pagination a").eq(i).html(num);
                      $('.current_page').html($(".pagination a").eq(u).html()); //同步页码
                  } else {
                      num--;
                      $(".pagination a").eq(i).html(num);
                      $('.current_page').html($(".pagination a").eq(u).html());
                  }

              }
          },

          controlOmit: function (index, m, n, k) {   // 封装一个controlOmit方法，当页数在第四位的时候来改变页码
              var num1 = parseInt($(".pagination a").eq(m).html());
              var num2 = parseInt($(".pagination a").eq(n).html());
              var num3 = num1 - num2;
              if (num3 == 2) {
                  index++;
                  idx = index;
              } else {
                  // 给1-5的页数加值, 同步页码
                  obj_all1.changePage(0, 1, k, 4);
                  idx = index;
              }
          },
          addColor: function (idx) {   // 封装一个方法，用于给当前页码添加背景色
              var num1 = parseInt($(".pagination a").eq(6).html());
              var num2 = parseInt($(".pagination a").eq(4).html());
              var num3 = num1 - num2;
              if (num3 == 2) {
                  // console.log(idx)
                  $(".omit").addClass('omit_hide');
                  $(".pagination a").eq(idx).addClass("active");
                  idx++;

              } else {
                  $(".pagination a").eq(idx).addClass("active");
              }
          }
      }

// 分页组件：点击下一个按钮
      $(".img_next").unbind("click").click(function(){
          $(".pagination a").each(function(index,element){
              if($(element).hasClass('active')){

                  if(parseInt($(element).html())==total_num){  // 判断当前页是否是最后一页
                      $('.current_page').html($(".pagination a").eq(index).html());  // 同步当前页数
                      // alert("您已到最后一页！")
                      return;
                  }else{
                      $(element).removeClass("active");
                      if(index >= 4){
                          if(index==5){
                              index++
                              idx=index;

                          }else if(index==4){
                              if($(".omit ").hasClass("hide_pagination")){//如果第二个省略号不存在

                                  index++;
                                  idx=index;
                              }else{

                                  $(".omit_show").removeClass('omit_hide');
                                  obj_all1.controlOmit(index,6,4,5);
                              }


                          }else if(index==6){
                              idx=index;
                              obj_all1.changePage(5,1,7,6)
                          }

                      }else{
                          index++;
                          $('.current_page').html($(".pagination a").eq(index).html());    // 同步当前页数
                          idx=index;
                      }

                      $('.current_page').html($(".pagination a").eq(idx).html());

                  }

              };
          })
          // 给页码添加背景色
          obj_all1.addColor(idx);
          // 分页进行数据请求时要做一个判断：有搜索情况和无搜索情况!
          if(obj_status.status==1){  //这个时候点击分页按钮时是在已经搜索过的结果基础上进行请求
              obj_all.ajaxSearch(parseInt($(".pagination a").eq(idx).html()));
          }else{ obj_all.ajaxData()}

      })


      // 点击上一个按钮
      $(".img_prev").unbind("click").click(function(){
          $(".pagination a").each(function(index,element){
              if($(element).hasClass('active')){
                  // 判断是否是第一页
                  if(parseInt($(element).html())==1){
                       // alert("您已到第一页！")
                      return;
                  }else{
                      $(element).removeClass('active') //去掉当前页码的背景色

                      if(parseInt($(".pagination a").eq(0).html())>= 2){// 情况一：假设第一个位置的省略号存在
                          var differ=parseInt($(".pagination a").eq(5).html())-parseInt($(".pagination a").eq(4).html());
                          if(index==0){  // 假如当前页面还处在第一的位置
                              // console.log(index)
                              obj_all1.changePage(0,0,5,0);
                              idx=index;
                              // 让省略号重现
                              $(".omit").removeClass("omit_hide");
                              // 如果当前页面的页码是1时
                              if( parseInt($(".pagination a").eq(0).html())==1 ){$(".omit_show").addClass('omit_hide')}
                          }else if(index==5&&differ>1){
                              obj_all1.changePage(5,0,7,5);
                              idx=index;
                          }else{

                              if(differ=1){
                                  // $(".omit").addClass("omit_hide");
                                  index--;
                                  $('.current_page').html($(".pagination a").eq(index).html()); // 同步当前页数
                                  idx=index;
                                  $(".pagination a").eq(6).html(total_num);
                                  $(".pagination a").eq(5).html(total_num-1);
                              }else{
                                  index--;
                                  $('.current_page').html($(".pagination a").eq(index).html()); // 同步当前页数
                                  idx=index;
                              }
                          }
                      }else{    //  情况二：第一个位置的省略号不存在
                          if(index==0){
                              return; }else if(index==5){
                              if(parseInt($(".pagination a").eq(5).html())==6){
                                  $(".pagination a").eq(6).html(total_num);
                                  $(".pagination a").eq(5).html(total_num-1);
                                  index--;
                                  $('.current_page').html($(".pagination a").eq(index).html()); // 同步当前页数
                                  idx=index;
                              }else{obj_all1.changePage(5,0,7,5);
                                  idx=index;}
                          }else{
                              index--;
                              $('.current_page').html($(".pagination a").eq(index).html()); // 同步当前页数
                              idx=index;
                          }

                      }

                  }
              }
          })
          $(".pagination a").eq(idx).addClass("active");//给当前页码加上颜色
          // 分页进行数据请求时要做一个判断：有搜索情况和无搜索情况!
          if(obj_status.status==1){  //这个时候点击分页按钮时是在已经搜索过的结果基础上进行请求
              obj_all.ajaxSearch(parseInt($(".pagination a").eq(idx).html()));
          }else{ obj_all.ajaxData()}
      })

// 当你任意点击一个按钮时，给它增加背景色，同时取消其他元素背景色
//      当第二个省略号存在时，当点击第5个按钮时，前5个按钮吗，每个的页数加1 ，将第4个按钮进行高亮
//      存在两个特殊情况：1、第二个省略号是否存在；2、当第五个按钮到倒数第三个时，要将第二个省略号去掉，第一个省略号重现，并且前面5个不再累加
      $(".pagination a").unbind("click").click(function(){
          idx=$(this).index(".pagination a");

          if(!$(".omit ").hasClass("hide_pagination")&& idx==4){   // 首先判断第二个省略号是否存在：特殊情况
          //     再次判断第五个按钮是否是第三个
              var num1 = parseInt($(".pagination a").eq(6).html());
              var num2 = parseInt($(".pagination a").eq(4).html());
              var num3 = num1 - num2;
              if (num3 == 2) {
                  $(".omit").addClass('omit_hide');
                  $(this).addClass('active').siblings('.active').removeClass('active');   //给相应的 页码进行高亮显示
                  $('.current_page').html(parseInt($(this).html())-1)  ;   //同步当前页数
              }else{
                  for(var i=0;i<5;i++){
                      var num = parseInt($(".pagination a").eq(i).html());
                      num++;
                      $(".pagination a").eq(i).html(num);
                  }
                  $(".pagination a").eq(3).addClass('active').siblings('.active').removeClass('active');  //给第四个按钮高亮显示
                  $('.current_page').html(parseInt($(this).html())-1)  ;   //同步当前页数
                  $(".omit_show ").removeClass('omit_hide')   //显示第一个省略号
                  //请求后的页面渲染
                  if(obj_status.status==1){  //这个时候点击分页按钮时是在已经搜索过的结果基础上进行分页请求
                      obj_all.ajaxSearch(parseInt($(".pagination a").eq(idx).html()));
                  }else{ obj_all.ajaxData()}
              }


          }else if(!$(".omit_show ").hasClass('omit_hide')  && idx==0){   //第一个省略号存在且点击的是第一个
          //       首先判断第一个按钮是否页数是否为1，若是就隐藏省略号回归正常
                 if(parseInt($(".pagination a").eq(0).html())==2){
                     for(var i=0;i<5;i++){
                         var num = parseInt($(".pagination a").eq(i).html());
                         num--;
                         $(".pagination a").eq(i).html(num);
                     }
                     $(".omit_show ").addClass("omit_hide")
                     $(".pagination a").eq(0).addClass('active').siblings('.active').removeClass('active');
                     $('.current_page').html(parseInt($(this).html()))  ;   //同步当前页数
                     $(".omit ").removeClass("omit_hide")    //显示第二个省略号
                     //请求后的页面渲染
                     if(obj_status.status==1){  //这个时候点击分页按钮时是在已经搜索过的结果基础上进行分页请求
                         obj_all.ajaxSearch(parseInt($(".pagination a").eq(idx).html()));
                     }else{ obj_all.ajaxData()}
                 }else{   //1-5个页码开始递减
                     for(var i=0;i<5;i++){
                         var num = parseInt($(".pagination a").eq(i).html());
                         num--;
                         $(".pagination a").eq(i).html(num);
                     }
                     $(".pagination a").eq(1).addClass('active').siblings('.active').removeClass('active');  //  第二个按钮高亮显示
                     $('.current_page').html(parseInt($(this).html())+1)  ;   //同步当前页数
                     $(".omit ").removeClass("omit_hide")    //显示第二个省略号
                     //请求后的页面渲染
                     if(obj_status.status==1){  //这个时候点击分页按钮时是在已经搜索过的结果基础上进行分页请求
                         obj_all.ajaxSearch(parseInt($(".pagination a").eq(idx).html()));
                     }else{ obj_all.ajaxData()}
                 }
          }
          else{   //一般情况下分页
              $(this).addClass('active').siblings('.active').removeClass('active');   //给相应的 页码进行高亮显示
              $('.current_page').html(parseInt($(this).html()))  ;   //同步当前页数
              if(obj_status.status==1){  //这个时候点击分页按钮时是在已经搜索过的结果基础上进行分页请求
                  obj_all.ajaxSearch(parseInt($(".pagination a").eq(idx).html()));
              }else{ obj_all.ajaxData()}
          }



      })



  }






})