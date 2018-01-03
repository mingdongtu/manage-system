// function selectmoli(){
// 	$("select").not(".no").each(function(index, element) {
// 		if(!$(this).parent().hasClass("select")){
// 			$(this).wrap('<div class="select" />').before('<i></i><input name="" readonly="readonly" type="text" /><ul></ul>');
// 		}
// 		var opt = $(this).find("option");
// 		var ul = $(this).siblings("ul");
// 		var vid = $(this).val();
// 		var li ='';
// 		var wth = $(this).attr("data-w");
// 		var on = $(this).attr("data-on");
// 		var dis = $(this).prop("disabled");
// 		if(wth){
// 			$(this).parent().css("width",wth);
// 		}
// 		if(dis){
// 			$(this).parent().addClass("lock");
// 			$(this).siblings("input").attr("disabled",true);
// 		}else{
// 			$(this).parent().removeClass("lock");
// 			$(this).siblings("input").removeAttr("disabled");
// 		}
// 		ul.attr("id","select"+index);
// 		for(var i=0; i<opt.length; i++){
// 			var val = opt.eq(i).val();
// 			var txt = opt.eq(i).text();
// 			if(val == vid){
// 				li += '<li data-id="'+val+'" class="cur"><a href="javascript:;">'+txt+'</a></li>';
// 				$(this).siblings("input").val(txt).attr("data-id",val);
// 			}else{
// 				li += '<li data-id="'+val+'"><a href="javascript:;">'+txt+'</a></li>';
// 			}
// 		}
// 		ul.html(li);
// 		if(on == "1"){
// 			$(this).siblings("input").removeAttr("readonly");
// 			filteroption("select"+index);
// 			$(this).siblings("input").keyup(function(e) {
// 				resetOption($.trim($(this).val()), "select"+index);
// 			});
// 		}
// 	});
// }


$(function(){
	// selectmoli();
     var isShow=0
	$("body").on("click", ".select i", function(){
        if ($(this).parent().hasClass("lock")) {
            return false;
        }
        // $(".select ul").hide();
      if(isShow==0){
          $(".select").css("z-index", "");
          $(this).parent().css("z-index", "110");
          $(this).siblings("ul").show();
          isShow=1
      }else{

          $(this).siblings("ul").hide();
          isShow=0
      }
    });
    $("body").on("click", ".select input", function(){
        if ($(this).parent().hasClass("lock")) {
            return false;
        }
        $(".select ul").hide();
        $(".select").css("z-index", "");
        $(this).parent().css("z-index", "110");
        $(this).siblings("ul").show();
    });
	$("body").on("click", ".select li", function(){
        var This = $(this);
        var Thisinput = This.parent().siblings("input");
		var Thisselect = This.parent().siblings("select");
        var livalue = This.find("a").text();
        var Thisul = This.parent();
		if(This.hasClass("bound")){
			return;
		}
		This.addClass("cur");
		This.siblings(".cur").removeClass("cur");
		Thisinput.val(livalue);
		var obj = This.attr("data-id");
		Thisinput.attr("data-id", obj);
		Thisselect.val(obj).change();
		This.parent().hide();
    });
	$(document).click(function() {
        $(".select ul").hide(); 
    });
	$(document).on("click", ".select", function(event) {
		event.stopPropagation();
    });
});