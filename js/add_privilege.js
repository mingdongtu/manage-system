var url='http://192.168.2.36:38099';

$(function() {
    var obj = {};
    obj.uid = localStorage.getItem('uid');
    obj.access_token = localStorage.getItem('access_token');

    // 实时显示文本框中的字数
    $("#textarea").keyup(function () {
        $(".current_number").html($(this).val().length);
        var that = this;
        var str = $(this).val();

        if ($(this).val().length > 120) {
            var str1 = str.slice(0, 120);
            $(".modal_hide").fadeIn(100);
            $(".confirm").click(function () {
                $(".modal_hide").fadeOut(100);
                $(that).val(str1);
                $(".current_number").html($(that).val().length);
            });

        }

    })

    // 封装一个动态创建的方法
    var create = function (current_data, div, idx) {
        var input = $("<input>"), label = $("<label/>");
        input.attr('type', 'checkbox');
        label.html(current_data);
        input.attr("id", "input_" + idx);
        div.append(input);
        div.append(label);
    }
    $.ajax({
        url: "/role/get_powerList",
        data: obj,
        cache: false,
        success:function(data) {

            $.Logout($(window.parent.parent), "../login.html", data)
            var len = data.data.length;
            var data1 = data.data;
            if (data.errcode == 0) {
                for (var i = 0; i < len; i++) {
                    var div = $("<div/>");
                    $(".edit_content").append(div);
                    var idx1 = data1[i].id;
                    create(data1[i].pow_name, div, idx1);
                    div.find("label").addClass('some_level');
                    if (data1[i].data.length != 0) {  //如果存在自二级项目
                        for (var j = 0; j < data1[i].data.length; j++) {
                            var idx2 = data1[i].data[j].id;
                            create(data1[i].data[j].pow_name, div, idx2);
                        }

                    }
                }
            }
            var div1 = $("<div/>");
            create("全选", div1);
            div1.find("label").addClass('some_level');
            div1.find("input").click(function () {
                if (div1.find("input").attr("checked")) {
                    $(".edit_content input").attr("checked", "checked")
                } else {
                    $(".edit_content input").attr("checked", false)
                }
            })

            $(".edit_content").append(div1);
            var p = $("<p/>");
            p.html("保存修改");
            p.addClass('save_change');
            $(".edit_content").append(p);
            //将父权限与子权限绑定
            var Bind=function(ele){
                ele.unbind("click").click(function(){
                    if($(this).attr("checked")){
                        $(this).siblings("input").attr("checked",true)
                    }else{$(this).siblings("input").attr("checked",false)}
                })
            }
            var BindChild=function(ele1,ele2){
                ele1.unbind("click").click(function(){
                    if($(this).attr("checked")){
                        ele2.attr("checked",true)
                    }
                })
            }
            Bind($("#input_3"));
            BindChild($("#input_19"),$("#input_3"))

            Bind($("#input_5"));
            BindChild($("#input_21"),$("#input_5"))
            BindChild($("#input_23"),$("#input_5"))


            // 点击保存，实现权限组添加
            $(".save_change").click(function () {
                if ($("#privilege_name").val()) {
                    obj.roleName = $("#privilege_name").val();
                    obj.note = $("#textarea").val();
                    var powerIdList = [];
                    var num = 0;
                    $(".edit_content input").each(function (index, element) {
                        if ($(this).attr("checked")) {
                            var id = parseInt($(this).attr("id").substring(6));
                            powerIdList[num] = {};
                            powerIdList[num].id = id;
                            num++;
                        }
                    })

                    obj.powerIdList = JSON.stringify(powerIdList);
                    console.log(obj);
                    $.get("/role/add_role", obj, function (data) {
                        $.Logout($(window.parent.parent), "../login.html", data)
                        if (data.errcode == 0) {
                            $(window).attr("location", "privilege.html");
                        } else {
                            alert(data.errmsg)
                        }
                    })
                } else {
                    alert("权限组名称不能为空！")
                }


            })
        }

})












})