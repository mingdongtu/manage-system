var selectstr = "";
function mydialog(obj) {
    var dia = $(".mydialog");
    if (dia.length>0) {

        if (selectstr != "") {
            if (selectstr == "yes")
                return true;
        }
        dia.remove();
        return false;
    } else {
        var mydialog = $('<div class="mydialog"><a href="javascript:;" class="close">关闭</a><h2>页面提示</h2><div class="conter"><span>确定要删除吗？</span></div><div class="btn_box"><a href="javascript:;" class="no">取消</a><a href="javascript:;" class="yes">确定</a></div></div>');
        mydialog.appendTo("body");
        $(".close,.btn_box .no").click(function (e) {
            selectstr = "no";
            obj.click();
        });
        $(".btn_box .yes").click(function (e) {
            selectstr = "yes";
            obj.click();
        });
        return false;
    }
}
function mytips(text) {
	var mytips = $('<div class="mytips"><a href="javascript:;" class="close">关闭</a></div>');
	mytips.append('<p>'+text+'</p>')
	mytips.appendTo("body");
	setTimeout(function () {
		$(".mytips").remove();
    }, 3000);
	$(".close").click(function (e) {
		$(".mytips").remove();
	});
}

$(function () {
	$(".table_box tr").hover(
	  function () {
		$(this).addClass("on");
	  },
	  function () {
		$(this).removeClass("on");
	  }
	);
	$(".input_warp i").click(function(e) {
		$(this).siblings("input").focus();
    });
	$(".input_warp input").focus(function() {
		$(this).siblings("i").hide();
		$(this).parent().addClass("bdergreen");
    });
	$(".input_warp input").blur(function() {
		var Thisval=$(this).val();
		$(this).parent().removeClass("bdergreen");
		if(Thisval==""){
			$(this).siblings("i").show();
		}
    });
	$(".select_warp i").click(function(e) {
		$(this).siblings("input").focus();
    });
	$(".select_warp input").focus(function() {
		if($(this).parent().hasClass("lock")){return false;}
		$(this).siblings("ul").show();
		$(this).parent().addClass("bdergreen");
    });
	var mytime;
	$(".select_warp input").blur(function() {
		var This=$(this).siblings("ul");
		$(this).parent().removeClass("bdergreen");
		mytime = setTimeout(function () {
            //This.hide();
        }, 800);
    });
	$(document).click(function(){
		$(".select_warp ul").hide();
	});
	$(".select_warp").click(function(event){
		event.stopPropagation();
	}); 
	$(".select_warp li,.select_warp2 li").click(function(e) {
		var This = $(this);
		var Thisinput = This.parent().next();
		var livalue = This.find("a").text();
		var Thisul = This.parent();
		clearTimeout(mytime);
		if(Thisul.hasClass("more")){
			Thisinput.focus();
			if(This.hasClass("cur")){
				This.removeClass("cur");
			}else{
				This.addClass("cur");
			}
			var Thistext = "";
			var Thisli = This.parent().find(".cur");
			for(var i=0;i<Thisli.length;i++){
				if(Thistext!=""){
					Thistext += "," + Thisli.eq(i).find("a").text();
				}else{
					Thistext += Thisli.eq(i).find("a").text();
				}
			}
			Thisinput.val(Thistext);
		}else{
			This.addClass("cur");
			This.siblings(".cur").removeClass("cur");
			Thisinput.val(livalue);
			This.parent().hide();
		}
    });
	$(".select_warp li,.select_warp2 li").hover(
	  function () {
		$(this).addClass("hover");
	  },
	  function () {
		$(this).removeClass("hover");
	  }
	);
	$(".select_warp2 input").focus(function() {
		if($(this).parent().hasClass("lock")){return false;}
		$(this).siblings("ul").show();
    });
	var mytime;
	$(".select_warp2 input").blur(function() {
		var This=$(this).siblings("ul");
		mytime = setTimeout(function () {
            This.hide();
        }, 800);
    });
	
});

var disease=[];
function modify(obj) {
	var text1="";
	var text2="";
	var text3="";
	var guanxi="0";
	var data={}
	var modify = $('<div class="modify_warp"><i class="mybj"></i></div>');
	var modify_box=$('<div class="modify_box">'+
    	'<a class="close" href="javascript:;"></a>'+
    	'<h2>提示</h2>'+
        '<div class="modify_center">'+
            '<div class="dl_warp"></div>'+
            '<div class="botton_box2"><a href="javascript:;" class="button_green btn150">确定</a><a href="javascript:;" class="button_gray btn150">取消</a></div>'+
        '</div></div>');
	switch(obj)
	{
	case 1:
		text1="药物过敏史";
		text2="过敏药物";
		text3="其他药物";
		data={list:["青霉素","链霉素","磺胺"]}
	  break;
	case 2:
		text1="遗传史";
		text2="遗传疾病";
		text3="其他遗传疾病";
		data={list:["高血压","糖尿病","血脂异常"]}
	  break;
	case 3:
		text1="既往史";
		text2="既往疾病";
		text3="其他疾病";
		data={list:["癌症","痛风","冠心病"]}
	  break;
	case 4:
		text1="现患疾病信息";
		text2="现患疾病";
		text3="其他疾病";
		data={list:["恶性肿瘤","疾病肺结核","慢性肺阻塞性肺炎"]}
	  break;
	default:
		text1="家族史";
		text2="父亲";
		text3="其他疾病";
		
		data={list:["冠心病","糖尿病","偏头痛","高血压","近视"]}
	}
	
	modify_box.appendTo(modify);
	modify.appendTo("body");
	$(".modify_center").prepend('<p>正在修改用户'+text1+'，请确认后再操作。</p>');
	var dl1=$('<dl><dt>'+text1+'：</dt><dd class="danxuan"><a href="javascript:;" alt="0" class="cur">无</a><a href="javascript:;" alt="1">有</a></dd></dl>');
	var dl2=$('<dl><dt>'+text2+'：</dt></dl>');
	var dd2=$('<dd class="duoxuan"></dd>');
	for(var i=0;i<data.list.length;i++){
		$('<a href="javascript:;">'+data.list[i]+'</a>').appendTo(dd2);
	}
	dd2.appendTo(dl2);
	var dl3=$('<dl><dt>'+text3+'：</dt><dd class="other_box"><input name="other" class="text" type="text" maxlength="20" /><a href="javascript:;" class="add_other"></a></dd></dl>');
	var dl4=$('<dl><dt>当前已选择：</dt><dd class="Selected_box"></dd></dl>');
	var dl_warp=$(".dl_warp");
	dl1.appendTo(dl_warp);
	dl2.appendTo(dl_warp);
	dl3.appendTo(dl_warp);
	dl4.appendTo(dl_warp);
	if(obj==4){
		$(".modify_center dl").slice(1).show();
		$(".modify_center dl").eq(0).hide();
	}else if(obj==5){
		$(".modify_center dl").slice(1).show();
		$(".modify_center dl").eq(0).hide();
		$(".botton_box2").html('<a href="javascript:;" class="button_blue btn150">下一步</a><a href="javascript:;" class="button_green btn150">确定</a>');
	}else{
		$(".modify_center dl").slice(1).hide();
	}
	$(".danxuan a").click(function(e) {
		$(this).addClass("cur").siblings(".cur").removeClass("cur");
		var alt=$(this).attr("alt");
		if(alt==="0"){
			$(".modify_center dl").slice(1).hide();
		}else{
			$(".modify_center dl").slice(1).show();
		}
	});
	$(".duoxuan a").click(function(e) {
		if($(this).hasClass("cur")){
			$(this).removeClass("cur");
		}else{
			$(this).addClass("cur");
		}
		var Thisval=$(this).text();
		var aLi=$(".Selected_box b");
		var Selectedbox = $(".Selected_box");
		function mj(text){
			var result = true;
			for(var i=0;i<aLi.length;i++){
				if(aLi.eq(i).text() == text){
					result = false;
					aLi.eq(i).parent().remove();
				}
			}
			return result;
		}
		if(mj(Thisval)){
			var blist=$('<span><b>'+Thisval+'</b><a href="javascript:;"></a><i></i></span>');
			blist.appendTo(Selectedbox);
		}
		
	});
	$(".Selected_box").on( "click", "a", function() {
		var This=$(this).parent();
		var Thistext=$(this).siblings("b").text();
		var Tali=$(".duoxuan a");
		for(var i=0;i<Tali.length;i++){
			if(Tali.eq(i).text() == Thistext){
				Tali.eq(i).removeClass("cur");
			}
		}	
		This.remove();
	});
	$(".add_other").click(function(e) {
		var Selectedbox = $(".Selected_box");
		var Thisval=$(this).siblings("input").val();
		var blist=$('<span><b>'+Thisval+'</b><a href="javascript:;"></a><i></i></span>');
		if(Thisval.length>0){
			blist.appendTo(Selectedbox);
		}
		
	});
	$(".modify_warp .close, .modify_warp .button_gray").click(function(e) {
		$(this).parents(".modify_warp").remove();
	});
	
	$(".modify_center .button_green").click(function(e) {
		var Thisbox;
		var Thisalt="1";
		var Thishtml="";
        if(obj==1){
			Thisbox=$(".si_box2 tr").eq(0).find("span");
			Thisalt=$(".danxuan .cur").attr("alt");
		}else if(obj==2){
			Thisbox=$(".si_box2 tr").eq(1).find("span");
			Thisalt=$(".danxuan .cur").attr("alt");
		}else if(obj==3){
			Thisbox=$(".si_box2 tr").eq(2).find("span");
			Thisalt=$(".danxuan .cur").attr("alt");
		}else if(obj==4){
			Thisbox=$(".si_box2 tr").eq(3).find("span");
			var xfjb=$("#xfjb");
			xfjb.html("");
		}else if(obj==5){
			Thisbox=$("#gx_"+guanxi);
		}
		if(Thisalt=="0"){
			Thishtml="无";
		}else{
			var Thisb=$(".Selected_box b");
			for(var i=0;i<Thisb.length;i++){
				if(i==0){
					Thishtml+=Thisb.eq(i).text();
				}else{
					Thishtml+="、"+Thisb.eq(i).text();
				}
				if(obj==4){ 
					var jblist=$('<tr><td>'+Thisb.eq(i).text()+'</td><td></td><td></td></tr>');
					jblist.appendTo(xfjb);
					disease.push(Thisb.eq(i).text());
				}
			}
		}
		Thisbox.html(Thishtml);
		$(this).parents(".modify_warp").remove();
    });
	
	$(".modify_center .button_blue").click(function(e) {
		var Thisbox;
		if(guanxi=="0"){
			Thisbox=$("#gx_0");
			guanxi="1";
			$(".dl_warp dt").eq(1).html("母亲：");
		}else if(guanxi=="1"){
			Thisbox=$("#gx_1");
			guanxi="2";
			$(".dl_warp dt").eq(1).html("兄弟姐妹：");
		}else if(guanxi=="2"){
			Thisbox=$("#gx_2");
			guanxi="3";
			$(".dl_warp dt").eq(1).html("子女：");
			$(this).hide();
		}
		var Thisb=$(".Selected_box b");
		var Thishtml="";
		for(var i=0;i<Thisb.length;i++){
			if(i==0){
				Thishtml+=Thisb.eq(i).text();
			}else{
				Thishtml+="、"+Thisb.eq(i).text();
			}
		}
		Thisbox.html(Thishtml);
		$(".duoxuan a").removeClass("cur");
		$(".Selected_box").html("");
	});
	
}
function diseaseshow() {
	if(disease.length<1){
		mytips("请您先添加现患疾病");
	}else{
		var modify = $('<div class="modify_warp"><i class="mybj"></i></div>');
		var modify_box=$('<div class="modify_box">'+
    	'<a class="close" href="javascript:;"></a>'+
    	'<h2>提示</h2>'+
        '<div class="modify_center">'+
            '<div class="dl_warp"></div>'+
            '<div class="botton_box2"><a href="javascript:;" class="button_green btn150">确定</a><a href="javascript:;" class="button_gray btn150">取消</a></div>'+
        '</div></div>');
		modify_box.appendTo(modify);
		modify.appendTo("body");
		$(".modify_center").prepend('<p>正在修改用户现患疾病用药情况，请确认后再操作。</p>');
		var dl_warp=$(".dl_warp");
		for(var i=0;i<disease.length;i++){
			$('<div class="yy_list c"><span>'+disease[i]+'</span>'+
                '<div class="select_warp fl yao_1"><i></i><ul><li><a href="javascript:;">用药</a></li><li><a href="javascript:;">不用药</a></li></ul>'+
                '<input name="yy_0" type="text" readonly="readonly" value="" />'+
                '</div><div class="select_warp fl yao_2"><i></i><ul>'+
                        '<li><a href="javascript:;">控制满意</a></li>'+
                        '<li><a href="javascript:;">控制不满意</a></li>'+
                        '<li><a href="javascript:;">药物副作用</a></li>'+
                        '<li><a href="javascript:;">经济原因</a></li>'+
                        '<li><a href="javascript:;">不良反应</a></li>'+
                        '<li><a href="javascript:;">不需药物治疗</a></li>'+
                        '<li><a href="javascript:;">不愿服药</a></li>'+
                    '</ul><input name="yy_0" type="text" readonly="readonly" value="" /></div></div>').appendTo(dl_warp);
		}
		$(".yao_2 li").hide();
		$(".yao_1 li").click(function(e) {
			var text=$(this).find("a").text();
			var list=$(this).parents(".yao_1").siblings(".yao_2").find("li");
			if(text=="用药"){
				list.slice(0, 3).show();
				list.slice(3).hide();
			}else{
				list.slice(0, 3).hide();
				list.slice(3).show();
			}
			$(this).parents(".yao_1").siblings(".yao_2").find("input").val("");
		});
		$(".select_warp i").click(function(e) {
			$(this).siblings("input").focus();
		});
		$(".select_warp input").focus(function() {
			$(this).siblings("ul").show();
		});
		var mytime;
		$(".select_warp input").blur(function() {
			var This=$(this).siblings("ul");
			mytime = setTimeout(function () {
				This.hide();
			}, 800);
		});
		$(".select_warp li").click(function(e) {
			var This = $(this);
			var Thisinput = This.parent().next();
			var livalue = This.find("a").text();
			var Thisul = This.parent();
			clearTimeout(mytime);
			This.addClass("cur");
			This.siblings(".cur").removeClass("cur");
			Thisinput.val(livalue);
			This.parent().hide();
		});
		$(".select_warp li").hover(
		  function () {
			$(this).addClass("hover");
		  },
		  function () {
			$(this).removeClass("hover");
		  }
		);
		$(".modify_warp .close, .modify_warp .button_gray").click(function(e) {
			$(this).parents(".modify_warp").remove();
		});
		$(".button_green").click(function(e) {
            var list=$(".yy_list");
			for(var i=0;i<list.length;i++){
				var li1=list.eq(i).find("input").eq(0).val();
				var li2=list.eq(i).find("input").eq(1).val();
				$("#xfjb tr").eq(i).find("td").eq(1).html(li1);
				$("#xfjb tr").eq(i).find("td").eq(2).html(li2);
			}
			$(this).parents(".modify_warp").remove();
        });
	}
}