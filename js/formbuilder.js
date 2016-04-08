/*
 *Code written by : Umair Shahid
 *Created Date: 18 Jan 2013
 **/


/*///////////////////////////////////////// Helper class that contains all the common function used /////////////////////////////////////////*/
var helper={
    getRHeight:function(){
        var contentAreaBordersHeight = 107;
        var consumedHeight = $(".header").outerHeight(true) + $(".subheader").outerHeight(true) + $("#formtabs ui.ui-tabs-nav").outerHeight(true)+contentAreaBordersHeight;
        var totalHeight = $(document).find('.postbox').height();
        var topHeight = ($('#postbox-container-1').length) ? $('#postbox-container-1').height() : 0; 
        return ((totalHeight + topHeight) - consumedHeight);
    },
    showLoading:function(msg,opt){
        var innerWidth = (opt.iWidth)?'width:'+opt.iWidth+'px':'';
        return "<div id='"+opt.id+"' class='imgLoading' style='height:"+opt.h+"px; width: "+opt.w+"px;top:0px;left:0px;z-index:100000'><div class='centerpics' style='left:45%;"+innerWidth+"'>"+msg+"&nbsp;<img class='vam' src='/pms/img/newui/processing2.gif'></div></div>"
    },
    hideLoading:function(id){
        $("#"+id).remove();
    },
    showMessage:function(msg,isError){
         mainView.remoteCall.postMessage("{\"showMessage\":true,\"msg\":\""+msg+"\"}");
    },
    hideMessage:function(){
        
    },
    getColorCode:function(color){
        var _color = "none";
        if(color && color!="transparent"){
            _color = color.substr(0,1)=="#"?color:("#"+color);
        }
        else if(color=="transparent"){
            _color = "transparent";
        }
        return _color;
    },
     filter:function(str){
        str = str.replace(/&#58;/g,":");
        str = str.replace(/&#39;/g,"\'");
        str = str.replace(/&#34;/g,"\"");
        str = str.replace(/&#61;/g,"=");
        str = str.replace(/&#40;/g,"(");
        str = str.replace(/&#41;/g,")");
        str = str.replace(/&lt;/g,"<");
        str = str.replace(/&gt;/g,">");
        str = str.replace(/&quote/g,"\"");
        return str;
    },
    getListCode:function(md5_code){
        var list_code ="";
        for(var i=0;i<mailLists.length;i++){
            if(mailLists[i].md5==md5_code){
                list_code = mailLists[i].id;
                break;
            }
        }
        return list_code;
    }
};

/*/////////////////////////////////////// Main view for form builder ////////////////////////////////////////////////////*/
var mainView = {
    tabActive:0,
    fieldsArray:{},
    keyWordsList:[],
    mergeTags:null,
    upperHeight:45,
    selectedField : null,
    salesforce_fields:null,
    remoteCall:null,
    formSaved : false,
    typeToC:false,
    defaultView: '[{"formname":"","fields":[{"li_id":"html_header","id":"html_header","label":"Heading","style":"","type":"header","order":1},{"li_id":"basic_email","id":"html_email","label":"Email","name":"email","required":"yes","requried_msg":"This field is required","default_value":"","hidden":"no","style":"","type":"textfield","order":2},{"li_id":"html_submit","id":"html_submit","label":"Submit","align":"","reset":"","print":"","style":"","type":"button","order":3}]}]',
    init:function(){
        if($("#mformId").val()){
            $("#mid_sel").val($('#mid_sel option:contains('+$("#fname").val()+')').val());

        }
        else{
            $("#mformType").val("C");
        }
        //$(".chzn-select").chosen();
        $(".container,.contentRow").css("width",($(this).parents('.postbox').width()-100)+"px");    /* setting width of container*/
        if($("#isSalesforce").val()=="false"){
           $(".salesforce_a").remove();
        } 
        this.setFormArea();
        $(".toolbarbtn").button();                                                  /* initializing button jquery way*/
        $("#formtabs" ).tabs();  
        /* fill accordion with fields*/

        /* initializing tabs*/

        /* initializing tabs if user exists */
        if($('#userInfoExists').length > 0 && $('#userInfoExists').val()){
                  this.fillFields();
        }else{
          return false;
        }
                                                                  
         /*Initilize the buttons for first form li*/
        control.init();
        this.createAccordion();                                                     /* initializing accordions*/
        var dHeight=helper.getRHeight();
        $(".formareacontents").css("height",(dHeight+10)+"px");        /* setting height form builder area*/
        $(".formarea").css("min-height",(dHeight+10)+"px");
        if(parseFloat(dHeight)<450){
            $(".leftbar").css("height",450+"px");
        }
        else{
            $(".leftbar").css("height",dHeight+"px");
        }
        $( "#accordion-form").accordion( "resize");                                /* resize accordion area accordiong to height */
        $(".contents").css("visibility","visible");                                 /* show contents area which includes accordion and form area */
        this.attachEvents();                                                        /* Attach events for main view*/
        this.imageLoading();                                                        /* Auto load images on background*/
        formJSON.createForm();
        this.initDialog();
        this.loadData();
        this.getFormList();
        /*mainView.remoteCall = new easyXDM.Socket({
            onMessage:function(message, origin) {
                //do something with message
            },
            onReady:function(){
                 mainView.remoteCall.postMessage("{\"isConnected\":true}");
            }
        });*/
        
        if(navigator.platform.toUpperCase().indexOf("MAC")==-1){
            $(".accordianbar").addClass("windows");
        }        
    },

    loadData:function() {       
        var URL=$('#admin-src-path').val()+"/wp-admin/admin-ajax.php?action=merge_tags";
        try{
            jQuery.getJSON(URL,  function(tsv, state, xhr){
                var result = jQuery.parseJSON(xhr.responseText);
                mainView.mergeTags = result;
                for(var i=0;i<result.length;i++){
                   var category = result[i][2]=='true'?"Basic Fields":"Custom Fields";
                   mainView.keyWordsList.push(jQuery.parseJSON("{\"label\":\""+result[i][1]+"\",\"category\":\""+category+"\"}"));
                }
            });
        }
        catch(e){}
        if($("#sfEntity").val()!=="N"){
               // $("#salesforce_checkbox").iCheck('check');
                $("select[name='salesforce']").val(($("#sfEntity").val()=="L")?"1":"2");
                $("select[name='salesforce']").attr("disabled",false);               
                //mainView.loadSalesEntitiesLink();                
            }
       
    },
    getFormList: function(){
       var tableHTMl;
       var URL=$('#admin-src-path').val()+"/wp-admin/admin-ajax.php";
       $.ajax({
            url: URL,
            dataType: 'json',
            data:{action:'webforms_list',offset:0},
            async: true,
            type:'GET',
            success: function(data) {
              var fields = eval(data);
              console.log(data);
              $.each(data.forms,function(key,formsval){
                $.each(formsval,function(key,values){
                  console.log(values[0].name);
                  if(tableHTMl){
                      tableHTMl += '<tr><td width="85%">'+values[0].name+'</td><td width="15%"><a class="btn-green right" formid='+values[0]["formId.encode"]+'><span>Edit</span><i class="icon check"></i></a></td></tr>';
                  }else{
                    tableHTMl = '<tr><td width="85%">'+values[0].name+'</td><td width="15%"><a class="btn-green right" formid='+values[0]["formId.encode"]+'><span>Edit</span><i class="icon check"></i></a></td></tr>'
                  }
                  
                })
              });

              $('.mks-webform-listings table').html(tableHTMl);
              //var fields = fields.Fields;
              /*for(var i=0;i<fields.length;i++){
                  if(fields[i].type=="standard"){
                    li  = '<li id="basic_' + fields[i].personilzationText + '" class="dragme"';
                    li += ' fieldIndex="' + i + '"';
                    li += '>' + fields[i].fieldName + '</li>';
                    $('#fieldList').append(li);
                 }
              }*/
            }
          });
     },
    attachEvents:function(){
       $("#save_form").button({icons: {
               primary: "save"
          }
       });
       $("#update_form").button();
       $("#setting_form").bind('click', function() {
            control.createProperties("form","_form");
            if($(window).height()<560){
                $(".windowcontent").css("height",($(window).height()-130)+"px");
             } 
            $("#elementProperties").dialog("open");
        });
        $("#sales_assignment_btn").click(function(){
            control.addSalesAssignment();
        });
       $("#embed_form").button({icons: {
                    primary: "html"
                 }
                 ,text:false
                 ,disabled: true

       });
           $("#formcode").click(function(){
           if(!$(this).hasClass("ui-button-disabled")){
            $("#embedcode").dialog("open");
           }
       });
        $("#target_form").button({icons: {
                    primary: "link"
                 }
                 ,text:false
                 ,disabled: true

       });
       $("#formlink").click(function(){
           if(!$(this).hasClass("ui-button-disabled")){
                $("#targetcode").dialog("open");
           }
       });
       $("#deleteformbtn").button({icons: {
                    primary: "trash"
                 }
                 ,text:false
                 ,disabled: true

       }).click(function(){
           if(!$(this).hasClass("ui-button-disabled")){
                formJSON.delete_form();
           }
       });
       $("#preview_form").button({icons: {
                primary: "icon-search"
             },
             text:false
             ,disabled: true
       }).click(function(){
           if(!$(this).hasClass("ui-button-disabled")){
                var link = previewURL;
                window.open(link,'FRM.BLD.PR','width=900,height=650,left=50,top=50,screenX=100,screenY=100,scrollbars=yes,resizable=yes,status=yes');
           }
       });
       $("#closebtn").button({
            text: true,
            icons: {
                primary: "ui-icon-close"
            }
        }).click(function(){
            window.close();
        });
       $("#salesRepPicker").change(function(){
          if($(this).val() && $("#html_salesRep input[value='"+$(this).val()+"']").length===0){
              $("#sales_assignment_btn").button("enable");             
          }
          else{
              $("#sales_assignment_btn").button("disable");
          }
       });
        $(".save-form").click(function(){formJSON.save()});
        $("#update_form").click(updateLandingPage);
        $("#loadformbtn").click(mainView.loadForm);
        $("#newformbtn").click(mainView.newForm);        
        $("#setting_tab").click(mainView.loadSettings);
        $("#formbuilder_tab").click(mainView.loadFormBuilder);
        $("#show_advance").click(function(){
            if($("#advance_settings").css("display")=="none"){
                $("#advance_settings").fadeIn();
                $(this).html("<i class='icon-minus-sign'></i> Hide Advance Settings");
            }
            else{
                 $("#advance_settings").fadeOut();
                $(this).html("<i class='icon-plus-sign'></i> Show Advance Settings");
            }
        });       
        $("select[name='salesforce']").change(mainView.loadSalesforceFields);
        $("#fname").change(function(){
            if($(this).val()!==""){
                formJSON.save(true);
            }
        })
        /*$('input#salesforce_checkbox').iCheck({
            checkboxClass: 'checkinput'            
        }).on("ifChecked",function(e){
            $("select[name='salesforce'],#salesforce_source").attr("disabled",false);
            $("select[name='salesforce']").trigger("chosen:updated");
            mainView.loadSalesEntities();            
        }).on("ifUnchecked",function(e){
            $("select[name='salesforce'],#salesforce_source").attr("disabled",true);
            $("select[name='salesforce']").trigger("chosen:updated");
            $("#accordion-form li.salesforce_field").remove();
            $("#sfEntity").val('N');
            $("#source").val('');$("#salesforce_source").val("-1");
            $(".loadFields").remove();            
        }) */      
        
        //$("select[name='salesforce']").chosen({disable_search_threshold: 5,width:"155px",fixCallBack:mainView.fixShowSelect});
        //$("select#salesRepPicker").chosen({disable_search_threshold: 5,width:"185px"});
        
        $("#fwdsettingsbtn").click(function(){
            if($(window).height()<560){
                $("#forwardSettingContainer").css("height",($(window).height()-130)+"px");
            }            
            $("#settings_iframe").attr("src",settingURL+$("#mformId").val()+"&isNewBuilder=true");
            $("#forwardSettings").dialog("open");
        });
        
        $(".serachList").keyup(function(){
            var container = $(this).attr("data-search");
            var searchValue = $.trim($(this).val());
            
            if(searchValue){
                $("#"+container).find("li").hide();
                $("#"+container).find("li").filter(function() {
                    if($(this).text().toLowerCase().indexOf(searchValue) > -1)
                    {				                        
                        return $(this);
                    }
                }).show();	
                               
                $("#"+container).find("li").each(function(i) {                    
                    $(this).removeHighlight().highlight(searchValue);
                });
                $("#"+container).find(".clearsearch").show();
            }
            else{
                $("#"+container).find("li").show();
                $("#"+container).find(".clearsearch").hide();                  
                $("#"+container).find("li").each(function(i) {                    
                    $(this).removeHighlight()
                });
            }
            
            
        })
        
        $(".clearsearch").click(function(){
            $(this).hide();
            $(this).prev().val('');
            var container =  $(this).prev().attr("data-search");
            $("#"+container).find("li").show();
            $("#"+container).find("li").each(function(i) {                    
                $(this).removeHighlight()
            });
        });
        $(".showtooltip").tooltip({'placement':'bottom',delay: { show: 0, hide:0 },animation:false});
        $("#frmSnippet,#frmIframeSnippet,.targeturl").mousedown(function (event) {
            $(this).select().focus();
            event.stopPropagation();
            event.preventDefault();
        })
        
    },
    setFormArea:function(){
       var formAreaWidth =  ($(".contentRow").width()-$(".leftbar").width());
       $(".formarea").css("width",formAreaWidth+"px");
    }
    ,
    createAccordion:function(){
     
       $("#accordion-form").accordion({
            autoHeight: false,
            fillSpace: true,
            icons: { "header": false, "headerSelected": false }
       });
       $("#accordion-form2").accordion({
            autoHeight: false,
            icons: { "header": false, "headerSelected": false }
       });

       $("#accordion-form .ui-accordion-header span.ui-icon").remove();
       this.initDragDrop();
    }
    ,fillFields:function(){
        var li="";
        
        URL=$('#admin-src-path').val()+"/wp-admin/admin-ajax.php";
        $.ajax({
            url: URL,
            dataType: 'json',
            data:{action:'basic_fields'},
            async: false,
            type:'GET',
            success: function(data) {
              var fields = eval(data);
              var fields = fields.Fields;
              for(var i=0;i<fields.length;i++){
                  if(fields[i].type=="standard"){
                    li  = '<li id="basic_' + fields[i].personilzationText + '" class="dragme"';
                    li += ' fieldIndex="' + i + '"';
                    li += '>' + fields[i].fieldName + '</li>';
                    $('#fieldList').append(li);
                 }
              }
            }
          });

        li="";
	//Populate mailing list fields
	for(var i in mailLists) {
                if(mailLists[i].list.indexOf("Bounce_Supress")==-1 && mailLists[i].list.indexOf("Supress_List")==-1){
                    li  = '<li id="list_' + mailLists[i].md5 + '" class="dragme"';
                    li += ' fieldIndex="' + i + '">' + mailLists[i].list + '</li>';
                    $('#mailLists').append(li);
                }
	}

    },
    initDialog:function(){
        $("#elementProperties").dialog({
            autoOpen: false,
            resizable: false,
            width:600,
            height:505,
            position:{ my: "top+10 center", at: "top+10 center", of: window },
            modal: true,
            buttons: {
                    "save":function(){
                       var s_field = mainView.fieldsArray[mainView.selectedField];
                       if ( s_field && s_field.type){
                           if(s_field.type!=$("#prp_type").val()){
                               control.typeChanged =true;
                           }
                       }
                       control.savePropertities();
                       $("#prp_type").val(s_field.type);
                       $( this ).dialog( "close" );
                    },
                    "close": function() {
                        $( this ).dialog( "close" );
                    }
            },
            close: function( event, ui ) {
              // Restore Defaults
              var s_field = mainView.fieldsArray[mainView.selectedField];
              if ( s_field && s_field.type){
                  s_field.type = $("#prp_type").val();
              }
            }
        });
        $("#embedcode,#targetcode").dialog({
            autoOpen: false,
            resizable: false,
            width:600,
            height:300,
            modal: true,
            buttons: {
                    "close": function() {
                        $( this ).dialog( "close" );
                    }
            },
            open: function( event, ui ) {
                if($(event.target).attr("id")=="targetcode"){
                    $(event.target).css("height","80px");
                }
            }
        });
        
        $("#forwardSettings").dialog({
            autoOpen: false,
            resizable: false,
            width:600,
            height:300,
            modal: true,
            buttons: {
              "save": function() {
                    $("#settings_iframe")[0].contentWindow.save();                       
              },  
              "close": function() {
                    $( this ).dialog( "close" );
                }
               
            },
            open: function( event, ui ) {
              
            }
        });
        
        
        
        /* Scrolling make basic bar static*/
        var $win = $(window), $nav = $('.leftbar')
        , navTop = $('.leftbar').length && $('.leftbar').offset().top
        , isFixed = 0;
        if(parseFloat($(".leftbar").css("height")) > 750){
            $(".leftbar").addClass('header-fixed');
        }
        var h = $(".leftbar").height();        
        $(".leftbar").css("height",(h+(mainView.upperHeight))+"px");
        
        $( "#accordion-form").accordion( "resize");
        //$win.on('scroll', processScroll);
        function processScroll(){
            var i, scrollTop = $win.scrollTop();
            if (scrollTop >= navTop && !isFixed) {
                isFixed = 1
                if(parseFloat($(".leftbar").css("height")) > 450){
                    $nav.addClass('header-fixed');
                }
                var h = $(".leftbar").height();
                $(".leftbar").css("height",(h+(mainView.upperHeight))+"px");
            } else if (scrollTop <= navTop  && isFixed) {
                isFixed = 0;
                var h = $(".leftbar").height();
                $(".leftbar").css("height",(h-(mainView.upperHeight))+"px");
                if(parseFloat($(".leftbar").css("height")) > 450){
                    $nav.removeClass('header-fixed');
                }
            }
            
        };
        $.fn.jPicker.defaults.images.clientPath=$('#plg-src-path').val()+'/img/';
    }
    ,
    initDragDrop:function(){
        $(".dragme").draggable({
		connectToSortable:".formarea #formcontents",
		helper:"clone",
		revert:"invalid",
		opacity:0.95,
		cursor:"move",
		scroll:true,
		appendTo:'body',
                helper: function( event ) {
                    var ele_id = $(event.currentTarget).html();
                    return $("<div class='moveable-ele' style='width:120px'>"+ele_id+"</div>");
                },
                start:function(event){
                    
                },
                stop:function(event){
                    
                }
	});
        $(".formarea, #formcontents").droppable({
            activeClass: "state-default",
            hoverClass: "state-hover",
            drop: function( event, ui ) {
                 var currentId = $(ui.draggable).attr("id");
                 control.li = ui.draggable.removeHighlight();                 
                 if($("#emptyContents").css("display")=="block"){
                     //control.li = control.createWrapper(ui.draggable.html(),ui.draggable.attr("id"));
                     //control.draggedItem = ui.draggable;
                     //control.appendLi();
                     $("#formfooter").removeClass("new-form");
                     $("#formcontents").css({"display":"block"});
                     $("#emptyContents").css("display","none");
                     $("#formcontents").removeClass("startform");
                 }
                 setTimeout(mainView.resizeForm,300);
                 return false;
            }
        });
        $(".formarea #formcontents").sortable({
		cancel: ".disableSort",
                handle: '.drag',
		revert:false,
		placeholder:'placeHolder',
		cursor:"move",
                receive:control.create,
                stop: function( event, ui ) {
                    if(ui.item.attr("id").indexOf("frmFld_customField")!==0){
                        formJSON.save(true);
                    }
                }
	}).enableSelection();
    }
    ,imageLoading:function(){
         var images = ["img/glyphicons-halflings-white.png"];
         $(images).each(function(i,v) {
            var image = $('<img />').attr('src', v);
       });
    },
    loadForm:function() {
        var frmId = $(".chzn-select").val();

        if(frmId==null || frmId=='')
              return;
        var c = $(document.documentElement);
        c.append(helper.showLoading("Loading Form",{h:(c.height()-20),w:(c.width()-20),id:"load__"}));

        window.location = formURL+frmId;
   },
   newForm:function(){
       var c = $(document.documentElement);
       c.append(helper.showLoading("Creating New",{h:(c.height()-20),w:(c.width()-20),id:"newload__"}));
       window.location = newFormURL;
   }
   ,
   resizeForm:function(){
       $(".formareacontents").css("height","auto");
       var formHeight = $(".formareacontents").height();
       var ulHeight = $(".formarea").height();
       if(formHeight>ulHeight){
            //$(".leftbar").css("height",formHeight+"px");
       }
       else{
           //$(".leftbar").css("height",ulHeight+"px");
           $(".formareacontents").css("height","100%");          
       }
        $( "#accordion-form").accordion( "resize");
   },
   loadSettings:function(){
       mainView.tabActive =1;
       if($("#settings_iframe").attr("src")==""){
           var c = $("#tabs-2");
           c.append(helper.showLoading("Loading Settings",{h:500,w:(c.width()-20),id:"settings__"}));
           $("#settings_iframe").attr("src",settingURL+$("#mformId").val()+"&isNewBuilder=true");
       }
   }
   ,
   loadFormBuilder:function(){
       mainView.tabActive =0;
   },
   applySettings:function(id){
       var field_obj = mainView.fieldsArray[id];
       if(field_obj.formname){
        //$("#fname").val(field_obj.formname);
       }
       else{
           mainView.formSaved = true;
       }
       if(field_obj.bg_color){
            var color =  helper.getColorCode(field_obj.bg_color);//field_obj.bg_color.substr(0,1)=="#"?field_obj.bg_color:("#"+field_obj.bg_color);
            $(".formareacontents").css("background",color);
       }
       if(field_obj.style){
        $(".formareacontents").attr("style",field_obj.style);
       }
        if(field_obj.font_size){
             $(".formareacontents .form-label-top").each(function(){
                 var id = $(this).parents("li").attr("id");
                 if(mainView.fieldsArray[id].style.indexOf("font-size")==-1){
                    $(this).css("font-size",field_obj.font_size+"px");
                 }
             });

        }
         if(field_obj.font_color){
             var color = helper.getColorCode(field_obj.font_color);
             $(".formareacontents .form-label-top").each(function(){
                 var id = $(this).parents("li").attr("id");
                 if(mainView.fieldsArray[id].style.indexOf("color")==-1){
                     $(this).css("color",color);
                 }
             });

        }
        if(field_obj.font_family){
            $(".formareacontents .form-label-top").css("font-family",field_obj.font_family);
       }
   },
   loadSalesforceSource:function(){
        var URL="/pms/json/forms.jsp?"+bms_token_var+"&action=sources"+user_key;
        jQuery.getJSON(URL,  function(tsv, state, xhr){
            var result = jQuery.parseJSON(xhr.responseText); 
            var source_html = "<div><select id=\"salesforce_source\" name=\"salesforce_source\" data-placeholder='Select Source'><option value=''></option>";
            var select_val = $("#source").val();
            var _source = "";
            for(var i=0;i<result.length;i++){
                   
                   _source =(select_val && result[i]==select_val)? "selected='selected'":"";                                      
                   source_html +="<option value='"+result[i]+"'  "+_source+">"+result[i]+"</option>"           
            }
            source_html += "</select></div>";
            $("li.salesforce div.div-salesforce").append($(source_html));
            //$("#salesforce_source").chosen({disable_search_threshold: 5,width:"231px",fixCallBack: mainView.fixShowSelect});
            $("#salesforce_source").change(function(){
                if($(this).val()!==""){
                    $("#source").val($(this).val());
                    formJSON.save(true);
                }                
            });
            $("li.salesforce").css({"height":"83px","margin-bottom":"5px"})
            
        });
   }
   ,
   fixShowSelect: function(isFix){
       if(isFix){
           $(".salesforce_a,li.salesforce").addClass("fix-select");
       }
       else{
           $(".salesforce_a,li.salesforce").removeClass("fix-select");
           setTimeout(function(){$("li.salesforce").scrollTop(0);},100);
       }
   },
   loadSalesEntities:function(){
       if(!mainView.salesforce_fields){
        if($("#salesforce_source").length==0){
            mainView.loadSalesforceSource();        
        }        
        var c = $("li.salesforce").parent();
        $(".loadFields").remove();
        c.css("position","relative");
        c.append(helper.showLoading("Loading",{h:(c.height()-20),w:(c.width()-20),id:"salesforce__",iWidth:'200'}));
        /*var transport = new easyXDM.Socket({           
            remote:  window.location.protocol+'//'+SESSION_DOMAIN_NAME+'/pms/json/forms.jsp?action=sf_fields'+bms_token_var,
            onReady: function(){

            },
            onMessage: function(message, origin){
                mainView.salesforce_fields = jQuery.parseJSON(message);
                helper.hideLoading("salesforce__");
                mainView.loadSalesforceFields();
                $("iframe[id^='easyXDM_']").remove();
            }
        });*/
        var entitesiframe = $('<iframe src="'+window.location.protocol+'//'+contentDomain+'/pms/json/forms.jsp?action=sf_fields'+bms_token_var+user_key+'" frameborder="0" scrolling="no" style="width:1px;height:1px;" id="temp_salesforce_iframe"></iframe>');
        entitesiframe.load(function(){           
            helper.hideLoading("salesforce__");
            mainView.salesforce_fields = jQuery.parseJSON($($("#temp_salesforce_iframe")[0].contentWindow.document.body).text());
            mainView.loadSalesforceFields();
        });
        $("body").append(entitesiframe);   
       }
       else{
           mainView.loadSalesforceFields();
       }
   },
   loadSalesforceFields:function(){
       var selected_val = $("select[name='salesforce'] option:selected").val();
       var flag = selected_val=="1"?"lead":"contact";
       $("#sfEntity").val(selected_val=="1"?'L':'C');       
       var fields_array = mainView.salesforce_fields.Fields;
       var fields_html = "";
       var used_salesforce_fields = [];
       for (var i =0;i<fields_array.length;i++){
          if(fields_array[i].type==flag){
              if($("#accordion-form #"+fields_array[i].personilzationText).length==0){
                fields_html += "<li id=\""+fields_array[i].personilzationText+"\" class=\"dragme salesforce_field\">"+fields_array[i].fieldName+"</li>";
              }
              
              if($(".formareacontents #"+fields_array[i].personilzationText).length>0){
                  used_salesforce_fields.push(fields_array[i].personilzationText);                  
              }
              
          } 
       }
       $("#accordion-form li.salesforce_field").remove();
       $("li.salesforce").parent().append($(fields_html));
       $("#accordion-form li.salesforce_field").draggable({
		connectToSortable:".formarea #formcontents",
		helper:"clone",
		revert:"invalid",
		opacity:0.95,
		cursor:"move",
		scroll:true,
		appendTo:'body',
                helper: function( event ) {
                    var ele_id = $(event.currentTarget).html();
                    return $("<div class='moveable-ele' style='width:120px'>"+ele_id+"</div>");
                }
	});
        $(used_salesforce_fields).each(function(i,v){            
            $("#accordion-form #"+v).draggable("option", "disabled", true);
            control.removeEle(v);
        });
        formJSON.save(true);
   },
   loadSalesEntitiesLink:function(){
        var parent_ul = $("li.salesforce").parent();
        var _text = ($("select[name='salesforce']").val()=="1")?"Load Lead Fields":"Load Contact Fields";
        var _style = ($("select[name='salesforce']").val()=="1")?"left:20%":"left:18%";
        var showLink = $("<div class='loadFields' style='"+_style+"'><i class='icon-refresh'></i> "+_text+"</div>");
        mainView.loadSalesforceSource();
        showLink.click(function(){
            $(this).remove();
            mainView.loadSalesEntities();            
        });
        parent_ul.append(showLink);
   }
};
/*///////////////////////////////////////// Dragable and sortable control with delete and edit option /////////////////////////////////////////*/
var control={
    li:null,
    draggedItem:null,
    firstLastControl:false,
    typeChanged : false,
    fieldTypes:[["textfield","Text field"],["textarea","Text area"],["selectbox","Drop Down"],["radio","Radio Button"],["checkbox","Check box"]],
    fontFamilies:[["Arial, Helvetica, sans-serif","Arial"],["'Arial Black', Gadget, sans-serif","Arial Black"],["'Comic Sans MS', cursive, sans-serif","Comic Sans MS"],["Impact, Charcoal, sans-serif","Impact"],["'Lucida Sans Unicode', 'Lucida Grande', sans-serif","Lucida Sans Unicode"],["Tahoma, Geneva, sans-serif","Tahoma"],["'Trebuchet MS', Helvetica, sans-serif","Trebuchet MS"],["Verdana, Geneva, sans-serif","Verdana"]],
    fontSizes:[["30","30px"],["28","28px"],["26","26px"],["24","24px"],["22","22px"],["20","20px"],["18","18px"],["16","16px"],["14","14px"],["12","12px"],["10","10px"],["8","8px"]],
    fontBold:[["normal","Normal Text"],["bold","Bold"],["bolder","Bolder"],["lighter","Lighter"],["100","100"],["200","200"],["300","300"],["400","400"],["500","500"],["600","600"],["700","700"],["800","800"],["900","900"]],
    setting_options:{ "heading":[[{"name":"Label","subheading":"Text for your Heading","type":"textfield","key":"label"},{"name":"Background Color","subheading":"Set heading background color","type":"color","key":"bg_color"},{"name":"Color","subheading":"Set heading text color","type":"color","key":"font_color"},{"name":"Size","subheading":"Set size of heading","type":"selectbox","options":"control.fontSizes","key":"font_size"},{"name":"Bold","subheading":"Set weight of text heading","type":"selectbox","options":"control.fontBold","key":"font_weight"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "header":[[{"name":"Label","subheading":"Text for your Heading","type":"textfield","key":"label"},{"name":"Background Color","subheading":"Set heading background color","type":"color","key":"bg_color"},{"name":"Color","subheading":"Set heading text color","type":"color","key":"font_color"},{"name":"Size","subheading":"Set size of heading","type":"selectbox","options":"control.fontSizes","key":"font_size"},{"name":"Bold","subheading":"Set weight of text heading","type":"selectbox","options":"control.fontBold","key":"font_weight"},{"name":"Hidden","subheading":"Make header Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "linebreak":[[{"name":"Height","subheading":"Height for line break","type":"textfield","key":"height"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "hr":[[{"name":"Height","subheading":"Height for line","type":"textfield","key":"height"},{"name":"Color","subheading":"Select color for Horizontal rule","type":"color","key":"bg_color"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "text":[[{"name":"Text","subheading":"Text to show on form","type":"textfield","key":"label"},{"name":"Align","subheading":"Align text","type":"selectbox","options":[["left","Left"],["center","Center"],["right","Right"]],"key":"align"},{"name":"Font Family","subheading":"Default Font family for label","type":"selectbox","options":"control.fontFamilies","key":"font_family"},{"name":"Font size","subheading":"Default Font size for label","type":"selectbox","options":"control.fontSizes","key":"font_size"},{"name":"Color","subheading":"Set text color","type":"color","key":"font_color"},{"name":"Background Color","subheading":"Set text background color","type":"color","key":"bg_color"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "textfield":[[{"name":"Label","subheading":"Text for your Field label","type":"textfield","key":"label"},{"name":"Name","subheading":"Name for your Field","type":"label","key":"name"},{"name":"Required","subheading":"Require completing field","type":"radio","key":"required"},{"name":"Require Message","subheading":"Show error message on require validation","type":"textfield","key":"requried_msg"},{"name":"Type","subheading":"Type of form field","type":"selectbox","options":"control.fieldTypes","key":"type"},{"name":"Default Value","subheading":"Pre-populate a value","type":"textfield","key":"default_value"},{"name":"Hidden","subheading":"Make field Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "custom_field":[[{"name":"Label","subheading":"Text for your Field label","type":"textfield","key":"label"},{"name":"Name","subheading":"Name for your Field","type":"textfield","key":"name"},{"name":"Required","subheading":"Require completing field","type":"radio","key":"required"},{"name":"Require Message","subheading":"Show error message on require validation","type":"textfield","key":"requried_msg"},{"name":"Type","subheading":"Type of form field","type":"selectbox","options":"control.fieldTypes","key":"type"},{"name":"Default Value","subheading":"Pre-populate a value","type":"textfield","key":"default_value"},{"name":"Hidden","subheading":"Make field Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "textarea":[[{"name":"Label","subheading":"Text for your Field label","type":"textfield","key":"label"},{"name":"Name","subheading":"Name for your Field","type":"label","key":"name"},{"name":"Required","subheading":"Require completing field","type":"radio","key":"required"},{"name":"Require Message","subheading":"Show error message on require validation","type":"textfield","key":"requried_msg"},{"name":"Type","subheading":"Type of form field","type":"selectbox","options":"control.fieldTypes","key":"type"},{"name":"Rows","subheading":"Number of lines on textarea","type":"textfield","key":"rows"},{"name":"Columns","subheading":"Width of textarea","type":"textfield","key":"cols"},{"name":"Default Value","subheading":"Pre-populate a value","type":"textfield","key":"default_value"},{"name":"Hidden","subheading":"Make field Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "checkbox":[[{"name":"Label","subheading":"Text for your Field label","type":"textfield","key":"label"},{"name":"Name","subheading":"Name for your Field","type":"label","key":"name"},{"name":"Required","subheading":"Require completing field","type":"radio","key":"required"},{"name":"Require Message","subheading":"Show error message on require validation","type":"textfield","key":"requried_msg"},{"name":"Type","subheading":"Type of form field","type":"selectbox","options":"control.fieldTypes","key":"type"},{"name":"Options","subheading":"Users can choose from these options","type":"textarea","key":"options"},{"name":"Default Value","subheading":"Pre-populate a value","type":"textfield","key":"default_value"},{"name":"Hidden","subheading":"Make field Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "radio":[[{"name":"Label","subheading":"Text for your Field label","type":"textfield","key":"label"},{"name":"Name","subheading":"Name for your Field","type":"label","key":"name"},{"name":"Required","subheading":"Require completing field","type":"radio","key":"required"},{"name":"Require Message","subheading":"Show error message on require validation","type":"textfield","key":"requried_msg"},{"name":"Type","subheading":"Type of form field","type":"selectbox","options":"control.fieldTypes","key":"type"},{"name":"Options","subheading":"Users can choose from these options","type":"textarea","key":"options"},{"name":"Default Value","subheading":"Pre-populate a value","type":"textfield","key":"default_value"},{"name":"Hidden","subheading":"Make field Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "selectbox":[[{"name":"Label","subheading":"Text for your Field label","type":"textfield","key":"label"},{"name":"Name","subheading":"Name for your Field","type":"label","key":"name"},{"name":"Required","subheading":"Require completing field","type":"radio","key":"required"},{"name":"Require Message","subheading":"Show error message on require validation","type":"textfield","key":"requried_msg"},{"name":"Type","subheading":"Type of form field","type":"selectbox","options":"control.fieldTypes","key":"type"},{"name":"Options","subheading":"Users can choose from these options","type":"textarea","key":"options"},{"name":"Default Value","subheading":"Pre-populate a value","type":"textfield","key":"default_value"},{"name":"Hidden","subheading":"Make field Hidden","type":"radio","key":"hidden"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "button":[[{"name":"Button Text","subheading":"Text for submit buton","type":"textfield","key":"label"},{"name":"Color","subheading":"Set button color","type":"color","key":"bg_color"},{"name":"Background Color","subheading":"Set button background color","type":"color","key":"bg_color_button"},{"name":"Button Align","subheading":"Align submit button to left, center or right","type":"selectbox","options":[["left","Left"],["center","Center"],["right","Right"]],"key":"align"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "default":[[{"name":"Label","subheading":"Text for your field","type":"textfield","key":"label"},{"name":"Value","subheading":"Value for your Field","type":"label","key":"default_value"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea"}]],
                      "capacha":[[],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "form":[[{"name":"Form Name","subheading":"Set form name","type":"textfield","key":"formname"},{"name":"Font Family","subheading":"Default Font family for label","type":"selectbox","options":"control.fontFamilies","key":"font_family"},{"name":"Font size","subheading":"Default Font size for label","type":"selectbox","options":"control.fontSizes","key":"font_size"},{"name":"Font Color","subheading":"Set default color of labels","type":"color","key":"font_color"},{"name":"Background Color","subheading":"Set background color for form","type":"color","key":"bg_color"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]],
                      "hidden":[[{"name":"Name","subheading":"Name for your Field","type":"label","key":"name"},{"name":"Value","subheading":"Value for your Field","type":"label","key":"default_value"}],[{"name":"Style","subheading":"Inline Style for heading","type":"textarea","key":"style"}]]
                    }
    ,
    init:function(){
        $("#firstli").html(control.toolbar);
        this.li =  $("#formcontents li:first");
        control.addObserver();
    },
    setNoContents:function(){
        if($("#formcontents").children().length==0){
             $("#formcontents").css({"display":"none"});
             $("#emptyContents").css("display","block");
             $("#formcontents").removeClass("startform");
        }
    },
    create:function(e,u,opt){
        if(u && u.item){
            control.draggedItem = u.item;
        }
        var _id = (opt)?opt.id:control.li.attr("id");
        var _type = (opt)?opt.type:control.getType(_id);        
        var _text = control.li.html();
        if(_id==="basic_dateOfBirth" && _text.indexOf("(yyyy-MM-dd)")==-1){
           _text = _text + " (yyyy-MM-dd)";
        }
        control.li.html("");
        control.li.append(controlHTML.creatHTML(_type,_text,_id));
        control.li.append(control.toolbar());
        control.addObserver();
        /*Handle duplicate id's for control*/
        if(e && u){
            var ctrl_id = control.li.attr("id");
            var controls_length = $("#formcontents [id^='"+ctrl_id+"']").length;
            if(controls_length>=2){
                var control_id = 1;
                while($("#formcontents #"+ctrl_id+"_"+control_id).length){
                    control_id = control_id+1;
                }
                ctrl_id = control.li.attr("id")+"_"+control_id;
                control.li.attr("id",ctrl_id);
            }

            //Setting object to default
            mainView.fieldsArray[ctrl_id] = {};
             _type =  _type==""?"textfield": _type;
            var setting_obj = control.setting_options[_type];

            if(setting_obj){
               for(var s=0;s<setting_obj.length;s++){
                   for(var m=0;m<setting_obj[s].length;m++){
                      if(setting_obj[s][m]['key']=='label'){
                          mainView.fieldsArray[ctrl_id][setting_obj[s][m]['key']] =_text;
                      }
                      else if( mainView.fieldsArray["_form"][setting_obj[s][m]['key']]){
                          mainView.fieldsArray[ctrl_id][setting_obj[s][m]['key']] = mainView.fieldsArray["_form"][setting_obj[s][m]['key']];
                      }
                      else{
                        mainView.fieldsArray[ctrl_id][setting_obj[s][m]['key']] = "";
                      }

                   }
               }
               mainView.fieldsArray[ctrl_id]["type"] = _type;
               if(_id.split("_")[0]=="list"){
                   mainView.fieldsArray[ctrl_id]["name"] = "lists";
                   mainView.fieldsArray[ctrl_id]["default_value"]=helper.getListCode(_id.split("_")[1]);
               }
               else if(_id.split("_")[0]=="frmFld"){
                   mainView.fieldsArray[ctrl_id]["name"] = _id;
               }
               else{
                   mainView.fieldsArray[ctrl_id]["name"] = _id.split("_")[1];

               }
               if(_type=="heading"){
                   mainView.fieldsArray[ctrl_id]['font_size'] = "18";
                   mainView.fieldsArray[ctrl_id]['font_weight'] = "bold";
               }
               else if(_type=="custom_field"){
                   mainView.fieldsArray[ctrl_id]["name"] = "customField";
               }
            }
            
            if(ctrl_id.indexOf("frmFld_customField")==0){
                control.createProperties(_type,ctrl_id);
                if($(window).height()<560){
                    $(".windowcontent").css("height",($(window).height()-130)+"px");
                } 
                $("#elementProperties").dialog("open");
                setTimeout('$("#window_label").focus()',300);
            }

        }
    },
    addSalesAssignment:function(){
        var sale_rep_val = $("#salesRepPicker").val();
        if(sale_rep_val && !$("#sales_assignment_btn").hasClass("ui-button-disabled")){
             if($("#emptyContents").css("display")=="block"){
                $("#formfooter").removeClass("new-form");
                $("#emptyContents").css("display","none");
                $("#formcontents").removeClass("startform");
            }
            if($("#formcontents #html_salesRep").length){
                control.delCtrl($("#formcontents #html_salesRep"));
            }
            control.li = this.createWrapper(sale_rep_val,"html_salesRep");
            this.create(true,true);
            $("#formcontents").append(control.li);
            mainView.fieldsArray["html_salesRep"]["default_value"] = sale_rep_val;
            $("#sales_assignment_btn").button("disable");
            formJSON.save(true);
        }
    },
    getName:function(id,type,field){
        var control = $("#formcontents [id='"+id+"'] input");
        var control_name = "";
        if(control.length){
            control_name = control.attr("name");
        }
        control_name = (id.substring(0,6)=="frmFld")?id:control_name;
        if(id.indexOf("frmFld_customField")==0){
            control_name = mainView.fieldsArray[id]["name"];
        }
        return control_name;
    },
    getType:function(t){
        var returnType = "";
        if(t.substring(0,4)=="list"){
            t = "list";
        }
        else if(t=="frmFld_customField" || t.substr(0, 11)=='customField'){
            t = "customField";
        }
        switch(t){
            case 'html_text':
                returnType = "text";
                break;
            case 'html_heading':
                returnType = "heading";
                break;
                break;
            case 'html_header':
                returnType = "header";
                break;
            case 'html_break':
                returnType = "linebreak";
                break;
            case 'html_hr':
                returnType = "hr";
                break;
            case 'html_submit':
                returnType = "button";
                break;
            case 'html_captcha':
                returnType = "capacha";
                break;
            case 'html_salesRep':
                returnType = "hidden";
                break;
            case 'list':
                returnType = "checkbox";
                break;
            case 'customField':
                returnType = "custom_field";
                break;    
            default:
                returnType = "";
                break;
        }
        return returnType;
    },
    removeEle:function(id){
      var h ="<div class='rm icon-trash' title='Remove'></div>";
      var li_forremoveEl = $(".leftbar-container [id='"+id+"']");
      if(li_forremoveEl.find(".rm").length==0){
       li_forremoveEl.append(h);
        $(".leftbar-container [id='"+id+"'] .icon-trash").click(function(){
            var li_id = $(this).parents("li").attr("id");
            control.delControl($("#formcontents [id='"+li_id+"']"));
        });
      }
    },
    createWrapper:function(val,id){
        return $("<li id='"+id+"'>"+val+"</li>");
    },
    appendLi:function(){
        this.create();
        $("#formcontents").append(control.li);
    },
    toolbar:function(){
        var toolbarHTML = ""
        if(control.firstLastControl){
             toolbarHTML += "<div class='controlButtons firstlast_setting'><div class='tool_button setting' title='Show Properties'></div></div>";
        }
        else{
            var controlWidth = (control.li.attr("id")=="basic_email")?"style='width:20px;'":"";
            toolbarHTML = "<div class='drag_element'><div class='tool_button drag' title='Drag handle'></div></div><div class='controlButtons' "+controlWidth+">";
            toolbarHTML += "<div class='tool_button setting' title='Show Properties'></div>";
            if(control.li.attr("id")!=="basic_email"){
                toolbarHTML += "<div class='spacer'></div><div class='tool_button delete icon-trash' title='Delete'></div></div>";
            }
        }
        return toolbarHTML;
    },
    addObserver:function(){
        control.li.find(".controlButtons .delete").click(control.delMe);
        control.li.find(".controlButtons .setting").click(control.editControl);
        control.li.find(".labelEdit").click(control.editLabel);
    },
    delMe:function(event,ui){
       control.delControl($(this).parents("li"));
    },
    delControl:function(obj){          /*Delete control li*/
        obj.hide("drop",300,function(){
            $(this).remove();
            delete mainView.fieldsArray[$(this).attr("id")];
            $("#"+$(this).attr("id")).draggable("option", "disabled", false);
            control.setNoContents();
            $("#"+$(this).attr("id")).find(".icon-trash").remove();
            mainView.resizeForm();
            formJSON.save(true);
        });

    },
     delCtrl:function(obj){          /*Delete control li*/
            obj.remove();
            delete mainView.fieldsArray[obj.attr("id")];
            $("#"+obj.attr("id")).draggable("option", "disabled", false);
            control.setNoContents();
            $("#"+obj.attr("id")).find(".icon-trash").remove();
            mainView.resizeForm();
    },
    editControl:function(event,ui){
         var control_type = $(this).parents("li").find(":first-child").attr("ctrl_type");
         var control_id = $(this).parents("li").attr("id");

         control.createProperties(control_type,control_id);
         if($(window).height()<560){
            $(".windowcontent").css("height",($(window).height()-130)+"px");
         } 
         $("#elementProperties").dialog("open");
    },
    createProperties:function(ctr_type,ctr_id){
        //Save the selected field id
        mainView.selectedField = ctr_id;
        $("#basic_settings,#advance_settings").children().remove();
        var prp_fields = control.setting_options[ctr_type];
        if(!prp_fields){
            prp_fields =control.setting_options["default"];
        }
        this.createFieldSettings(prp_fields[0],"basic_settings",ctr_id);
        this.createFieldSettings(prp_fields[1],"advance_settings",ctr_id);
        $("#prp_type").val(ctr_type);
        var window_title =ctr_type=='form'?'Form Settings':'Properties';
        $("#ui-dialog-title-elementProperties").html(window_title);
    },
    createFieldSettings:function(fields,container,ctr_id){
        var fieldsHTML = "";
        var field_obj = mainView.fieldsArray[ctr_id];

        for(var f=0;f<fields.length;f++){
            var textareaHeight = (fields[f].type=="textarea")?"textareaHeight":"";
            var hideControl = "";
            if(((ctr_id==="basic_email" || ctr_id.substring(0,4)=="list") && fields[f].key=="type") ||( ctr_id.indexOf("frmFld_customField")==0 && fields[f].key=="type") || (ctr_id.substring(0,4)=="list" && fields[f].key=="options")|| (ctr_id.substring(0,4)=="list" && fields[f].key=="default_value")){
                hideControl="style='display:none'";
            }
            fieldsHTML +='<div class="control-group '+textareaHeight+'" '+hideControl+'><label class="control-label labeldialog">';
                fieldsHTML +=fields[f].name;
                fieldsHTML +='<span class="prop-table-detail">'+fields[f].subheading+'</span></label>';
                fieldsHTML +='<div class="controls controldialog">';
                var val = typeof(field_obj[fields[f].key])=="undefined"?"":field_obj[fields[f].key];
                fieldsHTML +=this.getFieldSetting(fields[f],val);
                fieldsHTML += '</div>';
            fieldsHTML += '</div>';
        }
        $("#"+container).html(fieldsHTML);
        $("#"+container+" input[name='window_color']").jPicker({
                window:
                {
                    expandable: true,
                    position:
                    {
                        x: 'screenCenter',
                        y: 'bottom'
                    }
                }
            });
       $("#window_default_value").catcomplete({
            source: mainView.keyWordsList,
            minLength: 0,
            delay: 0,
            select:function(e,ui){
                var str = ui.item.value;
                var index = -1;
                if(str!==""){
                    for(var i=0;i<mainView.mergeTags.length;i++){
                        if(mainView.mergeTags[i][1].toLowerCase()==str.toLowerCase()){
                            index = i;
                            $("#window_default_value").val(mainView.mergeTags[i][0]);
                            break;
                        }
                    }
                  }

               return false;
            }
       });
       $(".pickkeywords").click(function(e){
           $("#window_default_value").focus();
           $("#window_default_value").catcomplete("search","");
           e.preventDefault();
           e.stopPropagation();
           return false;
       }) ;
       $("#"+container+" #window_type").change(function(){
           $("#basic_settings,#advance_settings").children().remove();
           var ctr_type =  $(this).val();
           var ctr_id =  mainView.selectedField;
           mainView.fieldsArray[ctr_id].type = ctr_type;
           var prp_fields = control.setting_options[ctr_type];
           control.createFieldSettings(prp_fields[0],"basic_settings",ctr_id);
           control.createFieldSettings(prp_fields[1],"advance_settings",ctr_id);

       });

    },
    getFieldSetting:function(field,val){
        var fieldHTML = "";
        switch (field.type){
            case "textfield":
                fieldHTML +='<div class="input-text">';
                     var readonly = (field.readonly)?'readonly="readonly"':'';
                     fieldHTML +='<input type="text"value="'+val.replace("frmFld_","")+'" '+readonly+' id="window_'+field.key+'" />';
                     if(field.key=="default_value"){
                         fieldHTML +='<b class="caret pickkeywords"></b>';
                     }
                fieldHTML +='</div>';
                break;
             case "selectbox":
                fieldHTML +='<div class="input-select">';
                     fieldHTML +='<select id="window_'+field.key+'">';
                     var options = eval(field.options);
                     for(var i=0;i<options.length;i++){
                        var selectopt = (options[i][0]==val) ? 'selected="selected"':"";
                        fieldHTML +='<option value="'+options[i][0]+'" '+selectopt+'>'+options[i][1]+'</option>';
                     }
                     fieldHTML +='</select>';
                fieldHTML +='</div>';
                break;
              case "radio":
                    var yesChecked ='';
                    var noChecked = 'checked="checked"';
                    if(val){
                        yesChecked = (val=='yes')?'checked="checked"':'';
                        noChecked = (val=='no')?'checked="checked"':'';
                    }
                    fieldHTML +='<div class="input-radio">';
                        fieldHTML += '<label class="checkbox inline"><input type="radio" name="window_'+field.key+'" value="yes" '+yesChecked+' /> Yes</label>';
                        fieldHTML += '<label class="checkbox inline"><input type="radio" name="window_'+field.key+'" value="no" '+noChecked+' /> No</label>';
                    fieldHTML += '</div>';
                break;
              case "textarea":
                  fieldHTML +='<div class="input-textarea">';
                    var text_val = (field.key=="options")? val.replace(/_-_/g,"\n") :val;
                    fieldHTML +='<textarea cols="30" rows="5" id="window_'+field.key+'">'+text_val+'</textarea>';
                  fieldHTML += '</div>';
              break;
               case "label":
                  fieldHTML +='<div class="input-label">';                    
                    fieldHTML +='<label id="window_'+field.key+'">'+val.replace("frmFld_","")+'</label>';
                  fieldHTML += '</div>';
              break;
              case "color":
                    if(!val){
                        val = "#666699";
                    }
                    else if(val=="transparent"){
                        val = "";
                    }
                    fieldHTML +='<div class="input-color">';
                        fieldHTML += '<input type="hidden" id="window_'+field.key+'" name="window_color" value="'+val+'" />';
                     fieldHTML += '</div>';
              break;
             default:
                 break;
        }
        return fieldHTML;
    },
    editLabel:function(e,u){
       var label = $(this);
       if(label.find("input.editText").length===0){
        label.children().remove();
        var _text = $.trim(label.text());
        var inputEdit = $("<input type='text' class='editText' value='"+_text+"' />");
        var okBtn = $("<i class='icon-ok editlabel'></i>");
        label.html(inputEdit);label.append(okBtn);
        inputEdit.focus();
        inputEdit.blur(function(){
             control.setText(this);
        });
        inputEdit.keydown(function(e,u){
           if(e.which==13 || e.which==27){
               control.setText(this);
           }
        });
        okBtn.click(function(){
            var input_obj = $(this).parent().find("input")[0];
            control.setText(input_obj);
        });
        inputEdit.click(function(e,ui){
             e.preventDefault();
             e.stopPropagation();
        });
       }
    },
    setText:function(obj){
            var l = $(obj).val();
            var parent_div = $(obj).parent();
            $(obj).remove();
            parent_div.html(l);
            var _li =parent_div.parents("li");
            var _id = _li.attr("id");
            mainView.fieldsArray[_id].label = l;
            control.applySettings(_id, mainView.fieldsArray[_id].type);
        }
    ,redrawControl:function(){
        var _id = mainView.selectedField;
        var field_obj = mainView.fieldsArray[_id];
        var _type = field_obj.type;        
        var _text = typeof(field_obj.label)!=="undefined"?field_obj.label:"";

        var setting_obj = control.setting_options[_type];
        if(setting_obj){
           for(var s=0;s<setting_obj.length;s++){
               for(var m=0;m<setting_obj[s].length;m++){
                  if(typeof(field_obj[setting_obj[s][m]['key']])!=="undefined"){
                      mainView.fieldsArray[_id][setting_obj[s][m]['key']] =field_obj[setting_obj[s][m]['key']];
                  }
                  else{
                    mainView.fieldsArray[_id][setting_obj[s][m]['key']] = "";
                  }

               }
           }
            mainView.fieldsArray[_id]["type"] = _type;
            mainView.fieldsArray[_id]["name"] = (_id.indexOf("frmFld_")==-1)?_id.split("_")[1]:_id;
        }

        control.li = $("#formcontents [id='"+mainView.selectedField+"']");
        control.li.children().remove();
        control.li.append(controlHTML.creatHTML(_type,_text,_id));
        control.li.append(control.toolbar());
        control.addObserver();
    }
    ,savePropertities: function(){
        var field_obj = mainView.fieldsArray[mainView.selectedField];
        if(control.typeChanged===true){
            control.redrawControl();
            control.typeChanged = false;
        }
        var type = field_obj.type || "form";
        var field = control.setting_options[type];
        for(var i=0;i<field.length;i++){
            for(var s=0;s<field[i].length;s++){
                var val = "";
                if(field[i][s].type=='radio'){
                    val = $("input[name='window_"+field[i][s].key+"']:checked").val();
                }
                else if(field[i][s].type=='label'){
                    val = mainView.fieldsArray[mainView.selectedField].name;
                }
                else if(field[i][s].key=='options'){
                    val = $("#window_"+field[i][s].key).val().replace(/\n/g,"_-_");
                }
                else{
                    val = $("#window_"+field[i][s].key).val().replace(/\n/g,"");
                    if(field[i][s].key.indexOf("_color")>-1){
                        if(val==""){
                            val = "transparent";
                        }
                    }
                    
                    //bg_color, font_color
                }
                if(field[i][s].key=="name" && type=="custom_field"){
                    if(val.indexOf("frmFld_")==-1){
                        val = "frmFld_"+val;
                    }
                }
                field_obj[field[i][s].key] = val;
            }
        }
        
        if($("#prp_type").val()=="form"){
            mainView.applySettings(mainView.selectedField);
        }
        else{
            if($("#prp_type").val()=="custom_field"){
                field_obj["type"] = "custom_field";
            }
            this.applySettings(mainView.selectedField,type);
        }
        formJSON.save(true);
    },
    applySettings:function(id,type){
         var field_obj = mainView.fieldsArray[id];
         var requiredHTML = "";
         type = (type=="custom_field")?'textfield':type;
         var requiredMsgHTML = "";
         var d_val = "";
         $(".formareacontents [id='"+id+"']").find("div").first().removeClass("hide-control");
         if(field_obj.required && field_obj.required=='yes'){
               requiredHTML +="<div class='required'>*</div>";

                if(field_obj.requried_msg && field_obj.requried_msg!==''){
                        requiredMsgHTML +="<div class='required_message'>"+field_obj.requried_msg+"</div>";
                  }
         }

         if(type=="checkbox"){
            $(".formareacontents [id='"+id+"'] .form-label-top").find(".required,.required_message").remove();
            $(".formareacontents [id='"+id+"'] .form-label-top .label").html(field_obj.label);
            $(".formareacontents [id='"+id+"'] .form-label-top").append(requiredHTML+requiredMsgHTML);
         }
         else if(type=="textfield" || type=="text" || type=="selectbox" || type=="textarea"){
             $(".formareacontents [id='"+id+"'] .form-label-top").html(field_obj.label+requiredHTML+requiredMsgHTML);
             if(field_obj.default_value && field_obj.default_value!==""){
                 $("#formcontents [id='"+id+"'] .form-input-wide input").val(field_obj.default_value);
             }
         }
         else if(type=='heading'){
             $("#formcontents [id='"+id+"'] .form-label-top .heading").html(field_obj.label);
         }
         else if(type=='header'){
             $("#formheader [id='"+id+"'] .form-label-top .heading").html(field_obj.label);
         }
         else if(type=='button'){
              $(".formareacontents [id='"+id+"'] .form-label-top button").html(field_obj.label);
         }
         else if(type=='hidden'){
              $(".formareacontents [id='"+id+"'] .form-label-top input").val(field_obj.default_value);
         }

         //Set alignment of text or control
         if(field_obj.align){
               $(".formareacontents [id='"+id+"'] .form-label-top").css("text-align",field_obj.align)
         }
         if((type=='radio' || type=='checkbox') && field_obj.options){
              var _options = [];
             if(field_obj.options){
                _options =  field_obj.options.split("_-_");
             }
             var optionhtml = "";
             if(field_obj.label && _options.length>1){
                 optionhtml += "<div class='labelEdit'>"+field_obj.label+"</div>";
             }
             for(var o=0;o<_options.length;o++){
                 var classMargin = (o>0)?'class=""':'';
                 var breakline = (o>0)?'<br/>':'';
                 optionhtml +=breakline+'<input type="'+type+'" '+classMargin+' disabled="disabled" name="'+field_obj.name+'" value="'+_options[o]+'" /><span class="label">'+_options[o]+'</span>'
             }
             $(".formareacontents [id='"+id+"'] .form-label-top").html(optionhtml);
             $(".formareacontents [id='"+id+"'] .form-label-top").find(".labelEdit").click(control.editLabel);
         }
         //Set style of control
         if(field_obj.style){
               $(".formareacontents [id='"+id+"'] .form-label-top").attr("style",field_obj.style)
         }
         //Set hidden property
         if(field_obj.hidden && field_obj.hidden=='yes'){
             $(".formareacontents [id='"+id+"']").find("div").first().addClass("hide-control");
             $(".formareacontents [id='"+id+"']").find("input[type='checkbox']").attr("checked",true);
         }
         if(field_obj.height){
               $(".formareacontents [id='"+id+"'] .form-label-top div").css("height",field_obj.height+"px");
         }
         if(field_obj.bg_color){
               var color = helper.getColorCode(field_obj.bg_color);
               if(type=="button"){
                   var startColor = control.ColorAdjust(color, 0.077);
                   control.setColor(startColor,color,$("#formfooter [id='"+id+"'] .form-label-top button"));
               }
               else if(type=="header"){
                   if(color!=="transparent"){
                    var startColor = control.ColorAdjust(color, 0.077);
                    control.setColor(startColor,color,$("#formheader li"));
                  }
                  else{
                      $(".formareacontents #" + id).css("background", color);
                  }
                
               }
               else if(type=="heading"){
                    $(".formareacontents [id='"+id+"'] .form-label-top .heading").css("background",color);
               }
               else if(type=="text"){
                   $(".formareacontents [id='"+id+"']").css("background",color);
               }
               else{
                $(".formareacontents [id='"+id+"'] .form-label-top div").css("background",color);
               }
         }
            if(field_obj.font_color){
                var color = helper.getColorCode(field_obj.font_color);
                if(type=="text"){
                     $(".formareacontents [id='"+id+"'] .form-label-top").css("color",color);
                }
                else if(type=="heading" || type=="header"){
                    $(".formareacontents [id='"+id+"'] .form-label-top .heading").css("color",color);
                }
            }
         if(field_obj.bg_color_button){
             var color = helper.getColorCode(field_obj.bg_color_button);
             if(type=="button"){
                 $("#formfooter li#html_submit").css("background-color",color);
             }
         }
         if(field_obj.font_size){
            if(type=="heading" || type=="header"){
                $(".formareacontents [id='"+id+"'] .form-label-top .heading").css("font-size",field_obj.font_size+"px");
            }
            else{
                $(".formareacontents [id='"+id+"'] .form-label-top").css("font-size",field_obj.font_size+"px");
            }
         }
         if(field_obj.font_family){
            $(".formareacontents [id='"+id+"'] .form-label-top").css("font-family",field_obj.font_family);
         }
         if(field_obj.font_weight){
            if(type=="heading" || type=="header"){
                $(".formareacontents [id='"+id+"'] .form-label-top .heading").css("font-weight",field_obj.font_weight);
            }
         }

    },
    ColorAdjust:function(hex, lum) {
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
             hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i*2,2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00"+c).substr(c.length);
        }
        return rgb;
    },
    setColor:function(startColor,endColor,element){
        element.css("background-color",endColor)
        if($.browser.mozilla){
            element.css("background","-moz-linear-gradient(top, "+startColor+", "+endColor+")");

        }
        else if($.browser.mise){
            if(parseInt($.browser.version)<=9){
                element.css("filter","progid:DXImageTransform.Microsoft.gradient(startColorstr='"+startColor+"', endColorstr='"+endColor+"', GradientType=0)");
            }
            else if(parseInt($.browser.version)>=10){
                element.css("background","-ms-linear-gradient(top, "+startColor+", "+endColor+")");
            }
        }
        else if($.browser.webkit){
            element.css("background","-webkit-linear-gradient(top, "+startColor+", "+endColor+")");
        }
        else if($.browser.opera){
            element.css("background","-o-linear-gradient(top, "+startColor+", "+endColor+")");
        }
    }
};

/*///////////////////////////////////////// Actual control creation using HTML /////////////////////////////////////////*/
var controlHTML = {
    creatHTML:function(type,txt,id){
        var isCustom = id.substring(0,7)=="frmFld_"?true:false;
        var ctrl_id=id.split("_")[1];
        var ctrl_name=id;
        var cHTML = "";
        switch(type){
           case 'heading':
                cHTML = this.headingField(txt);
               break;
           case 'header':
               cHTML = this.headerField(txt);
               break;
           case 'text':
               cHTML = this.wrapper(txt,false,{type:"text",labelEdit:true});
               break;
           case 'linebreak':
               cHTML = this.lineBreak();
               break;
          case 'hr':
               cHTML = this.horizontalRule();
               break;
          case 'custom_field':
               ctrl_name = "customField";
               cHTML = this.inputField(ctrl_id,txt,ctrl_name,'custom_field');
               break;
           case 'button':
               cHTML = this.buttonHTML();
               this.addLayer();
               break;
           case 'capacha':
               cHTML = this.capachaHTML();
               this.addLayer();
               break;
           case 'checkbox':
               cHTML = this.listHTML(ctrl_id,txt,isCustom);
               this.addLayer();
               break;
           case 'radio':
               cHTML = this.radioHTML(ctrl_id,txt);
               this.addLayer();
               break;
           case 'textarea':
               cHTML = this.textareaHTML(ctrl_id,txt);
               this.addLayer();
               break;
           case 'selectbox':
               cHTML = this.selectField(ctrl_id,txt);
               this.addLayer();
               break;
           case 'hidden':
               cHTML = this.hiddenField(ctrl_id,txt);

               break;
           default:
                cHTML = this.inputField(ctrl_id,txt,ctrl_name);
                this.addLayer();
               break;
        }
        return cHTML;
    },
    addLayer:function(){
        control.draggedItem.draggable("option", "disabled", true);
        if(control.li.attr("id")!=="basic_email" && control.li.attr("id")!=="html_submit" ){
            control.removeEle(control.draggedItem.attr("id"));
        }
    }
    ,
    wrapper:function(l,i,opt){
        var iHTML = "<div style='display: inline-block; width: 100%;' ctrl_type='"+opt.type+"'>";
        if(l){
            var labelEdit = opt.labelEdit ? "labelEdit":"";
            var ctrl_id = control.li.attr("id");
            var form_object = mainView.fieldsArray["_form"];
            var color = (form_object.font_color && ctrl_id!=="html_header" && ctrl_id!=="html_submit")?"color:"+helper.getColorCode(form_object.font_color)+";":"";
            var fsize = (form_object.font_size && ctrl_id!=="html_header" && ctrl_id!=="html_submit")?"font-size:"+form_object.font_size+"px;":"";
            var ffamily = (form_object.font_family && ctrl_id!=="html_header" && ctrl_id!=="html_submit")?"font-family:"+form_object.font_family+";":"";

            iHTML += "<div class='form-label-top "+labelEdit+"' style=\"width: 100%;"+color+fsize+ffamily+"\">";
            iHTML +=l;
            iHTML += "</div>";
        }
        if(i){
            iHTML +="<div class='form-input-wide'>";
            iHTML += i;
            iHTML +="</div>";
        }
        iHTML += "</div>";
        return iHTML;
    },
    textareaHTML:function(id,l){
        var fieldHTML = "<textarea name='"+id+"' id='"+id+"' readonly='readonly' placeholder='' rows='5' cols='10'></textarea>";
        return this.wrapper(l, fieldHTML,{type:"textarea",labelEdit:true});
    },
    inputField:function(id,l,ctrl_name,type){
        var _name = ctrl_name.substring(0,6)=="frmFld"?ctrl_name:id;
        var fieldHTML = "<input name='"+_name+"' id='"+id+"' class='form-textbox validate[required]' type='text' size='30' readonly='readonly' placeholder='' />";
        return this.wrapper(l, fieldHTML,{'type':type?type:"textfield",labelEdit:true});
    },
    selectField:function(id,l){
        var fieldHTML = "<select name='"+id+"' id='"+id+"' class='form-selectbox validate[required]' ><option value='0'>--Select value---</option></select>";
        return this.wrapper(l, fieldHTML,{type:"selectbox",labelEdit:true});
    },
    headingField:function(txt){
        var iHTML = "<div class='heading'>"+txt+"</div>";
        return this.wrapper(iHTML,false,{type:"heading",labelEdit:false});
    },
    headerField:function(txt){
        var iHTML = "<div class='heading'>"+txt+"</div>";
        return this.wrapper(iHTML,false,{type:"header",labelEdit:false});
    },
    lineBreak:function(){
       var breakHTML = "<br/>";
       return this.wrapper(breakHTML,false,{type:"linebreak"});
    }
    ,
    horizontalRule:function(){
       var ruleHTML = "<div class='hr'></div>";
       return this.wrapper(ruleHTML,false,{type:"hr"});
    },
    buttonHTML:function(){
       var btnHTML = "<button class='btn btn-large btn-info'>Submit</button>";
       return this.wrapper(btnHTML,false,{type:"button"});
    },
    listHTML:function(id,txt,isCustom){
       var lstHTML = "";
       if(isCustom){
           lstHTML = "<input type='checkbox' name='frmFld_"+id+"' id='"+id+"' disabled='disabled' /><span class='label'>"+txt+"</span>";
       }else{
           lstHTML = "<input type='checkbox' name='lists' id='"+id+"' disabled='disabled' /><span class='label'>"+txt+"</span>";
       }
       
       return this.wrapper(lstHTML,false,{type:"checkbox"});
    },
    radioHTML:function(id,txt){
       var lstHTML = "<input type='radio' name='"+id+"' id='"+id+"' disabled='disabled' /><span class='label'>"+txt+"</span>";
       return this.wrapper(lstHTML,false,{type:"radio"});
    },
    capachaHTML:function(){
        var capachaControl = "<div class='capacha'><img src='/pms/challenge?c=xhDfUo33Rs26Fp17Dk20Ms21Sp30xnHt' border='0'><input type='text' readonly='readonly' placeholder='' style='width:118px;margin-top:3px' / ></div>";
        return this.wrapper(capachaControl,false,{type:"capacha"});
    },
    hiddenField:function(id,val){
        var hiddenHTML = "<input type='text' name='salesRep' id='"+id+"' class='hide-control' disabled='disabled' value='"+val+"' />";
        return this.wrapper(hiddenHTML,false,{type:"hidden"});
    }
};
/*/////////////////////////////////////////Create JSON to save - Create form on load /////////////////////////////////////////*/
var formJSON = {
    formEle : "formcontents",   /*Set form id*/
    create:function(){          /*Create JSON based on form*/
        var formContainer = $("#"+this.formEle);
        var f_name = $("#fname").val();
        $("#mIsCAPTCHA").val("N");
        mainView.fieldsArray['_form'].formname=f_name;
        var strJSON ='[{';
            //Embed form settings
            var field_obj = mainView.fieldsArray['_form'];
            var field_prp = control.setting_options["form"];
                for(var p=0;p<field_prp.length;p++){
                    for(var f=0;f<field_prp[p].length;f++){
                          var key = field_prp[p][f].key;
                           strJSON +='"'+key+'":"'+field_obj[key]+'",';
                    }
                }
            strJSON +='"fields":[';
        $(".formareacontents ul").each(function(ind,value){
            formContainer = $(this);
            for(var c=0;c<formContainer.children().length;c++){
                var liContainer = formContainer.children().eq(c);
                strJSON +='{';
                    var ctrl_id = liContainer.attr("id");
                    var ctrl_type = liContainer.find("div").first().attr("ctrl_type");
                    strJSON +='"li_id":"'+ctrl_id+'",';
                    strJSON +='"id":"'+ctrl_id+'",';
                    //Setting propertites according to setting obj
                    field_obj = mainView.fieldsArray[ctrl_id];
                    var type = field_obj.type;
                    field_prp = control.setting_options[type];
                        for(var p=0;p<field_prp.length;p++){
                            for(var f=0;f<field_prp[p].length;f++){
                                  var key = field_prp[p][f].key;
                                  if(key!=="type"){
                                    strJSON +='"'+key+'":"'+formJSON.encodeHTML(field_obj[key])+'",';
                                  }
                            }
                        }
                    if(type=="capacha"){
                        $("#mIsCAPTCHA").val("Y");
                    }
                    strJSON +='"type":"'+ctrl_type+'",';
                    strJSON +='"order":'+(c+1)+'';

                strJSON +='}';
                if(c<formContainer.children().length-1){
                    strJSON +=',';
                }
            }
             if(ind<$(".formareacontents ul").length-1){
                    strJSON +=',';
                }
        });
        strJSON +=']}]';
        return strJSON;
    }
    ,
    delete_form:function(){
        if(confirm("Are you really want to delete this form?")){
            var deleteFlag ="&delete=true";
            $.post($("#form_builder_form").attr("action"), $("#form_builder_form").serialize()+deleteFlag,function(data){
                if(data.success){
                    window.location.href = newFormURL;
                }
            });
        }
    },
    save:function(autosave){

        if(formJSON.validate(autosave)){
                              
                    $("#mformHTML").val(formJSON.create());
                    $("#mformName").val($("#fname").val());
                    //$("#mIsCAPTCHA").val();
                    if(autosave && mainView.formSaved){
                       $(".autosave").effect("bounce", { times:5 }, 500);
                    }
                    else if(!autosave){
                        var c = $(document.documentElement);
                        c.append(helper.showLoading("Saving Form",{h:(c.height()-20),w:(c.width()-20),id:"savemask"}));
                    }
                    else{
                        return false;
                    }

                    var newFormFlag = ($("#mformId").val()=="" || mainView.typeToC)?"&new=Y":"";
                    $.post($("#form_builder_form").attr("action"), $("#form_builder_form").serialize()+newFormFlag,
                        function(data) {
                           helper.hideLoading("savemask");
                           if(data.error) {
                              var errorText = data.error;
                              helper.showMessage(errorText,'error');

                           } else if(data.success && data.success!=="updated.") {                               
                              var fid = data.formId;
                              $("#mformId").val(fid);
                              formJSON.createOption(fid);
                              helper.showMessage("Form Created Successfully.");
                              mainView.formSaved = true;
                              mainView.typeToC = false;
                               var URL="/pms/json/forms.jsp?formId="+fid+"&pageId="+$("#mpageId").val()+user_key+bms_token_var;
                                jQuery.getJSON(URL,  function(tsv, state, xhr){
                                    var result = jQuery.parseJSON(xhr.responseText);
                                    if(!result.error){
                                        $("#preview_form,#embed_form,#target_form,#deleteformbtn").button("enable");
                                        previewURL = helper.filter(result.formURL) + "?preview=Y";                                    
                                        $(".targeturl").val(helper.filter(result.formURL));
                                        $("#frmSnippet").val(helper.filter(result.embedCode));
                                        mainView.remoteCall.postMessage("{\"isRefresh\":false,\"formURL\":\""+helper.filter(result.formURL.replace("http:",""))+"\",\"formId\":\""+result.formId+"\"}");
                                    }                                    
                                });
                              return;

                           } else {
                              helper.showMessage("Form updated Successfully.");
                              setTimeout('$(".autosave").css("display","none")',300);
                           }
                           if(!data.error){
                                mainView.remoteCall.postMessage("{\"isRefresh\":true}")                               
                           }

                    });
                }
    },
    saveSettings:function(){
       var c = $(document.documentElement);
       c.append(helper.showLoading("Saving Form Settings",{h:(c.height()-20),w:(c.width()-20),id:"settings__"}));
    },
    createOption:function(id){
        $("#mid_sel").append("<option value='"+id+"'>"+$("#fname").val()+"</option>");
        $("#mid_sel").val(id);
    },
    validate:function(autosave){
        var isValid = true;
        var f_name = $("#fname").val();
        if(f_name==""){
            if(!autosave){
                alert("Form name can't be empty.");
            }
            isValid = false;
        }
        else if($("input[name='lists']").length==0){
            if(!autosave){
                alert("Please provide at least one target list.");
            }
            
            isValid = false;
        }
        formJSON.checkFormList();
        return isValid;
    },
    checkFormList:function(){
        if($("input[name='lists']").length!==0){
            $(".nolist").hide();
        }
        else{
            $(".nolist").show();
        }
    },
    createForm:function(){
      var form_type = $("#mformType").val();
      if(form_type==="C"){
          this.createFormFromJSON();
      }
      else{
          this.createIframe(form_type);
      }

    },
    filter:function(str){
        str = str.replace(/\n/g,"");
        str = str.replace(/\*/g,"");
        str = str.replace(/\"/g,"\\\"");
        return str;
    },
    encodeHTML: function (str) {
            if (typeof (str) !== "undefined") {
                str = str.replace(/"/g, "");                
            }
            else {
                str = "";
            }
            return str;
        }
        ,
        decodeHTML: function (str, lineFeed) {
            //decoding HTML entites to show in textfield and text area 				
            if (typeof (str) !== "undefined") {                
                str = str.replace(/&____;/g, "\"");                
            }
            else {
                str = "";
            }
            return str;
    },
    createFormFromJSON:function(){
        var form_json = $("#mformHTML").val().replace(/\n/g,"");
        var formObj = jQuery.parseJSON(form_json);
        var isDefaultView = false;
        if(formObj==null){
            formObj = jQuery.parseJSON(mainView.defaultView);
            isDefaultView = true;

        }
        else{
            mainView.formSaved = true;
            $("#preview_form,#embed_form,#target_form,#deleteformbtn").button("enable");
           
        }
        if(formObj!==null ){
            var formFields = formObj[0].fields;
            //Set form propertites
            mainView.fieldsArray["_form"] = {};
            var setting_obj = control.setting_options["form"];
            for(var s=0;s<setting_obj.length;s++){
                for(var m=0;m<setting_obj[s].length;m++){
                    if(formObj[0][setting_obj[s][m]['key']]){
                       mainView.fieldsArray["_form"][setting_obj[s][m]['key']] = formObj[0][setting_obj[s][m]['key']];
                    }
                    else{

                       if(setting_obj[s][m]['key']=="font_color"){
                           mainView.fieldsArray["_form"][setting_obj[s][m]['key']] = "#222222";
                       }
                       else if(setting_obj[s][m]['key']=="bg_color"){
                            mainView.fieldsArray["_form"][setting_obj[s][m]['key']] = "#F5F5F5";
                       }
                       else{
                           mainView.fieldsArray["_form"][setting_obj[s][m]['key']] = "";
                       }
                    }
                }
            }

            if(formFields && formFields.length){
                if(isDefaultView===false){
                    $("#emptyContents").css("display","none");
                    $("#formcontents").removeClass("startform");
                }
                $("#formcontents").css({"display":"block"});
                $("#formcontents").children().remove();
                for(var i=0;i<formFields.length;i++){
                     var li_container = $("#formcontents");
                     control.firstLastControl=(i==0 || i==formFields.length-1)?true:false;

                     control.li = control.createWrapper(formFields[i].label,formFields[i].li_id);

                        if(i==0){
                            li_container =$("#formheader");
                        }
                        else if(i==formFields.length-1){
                            li_container =$("#formfooter");
                        }
                        else{
                            li_container = $("#formcontents");
                        }
                     control.draggedItem = $("#accordion-form [id='"+formFields[i].li_id+"']");
                     var opt_obj={"id":formFields[i].li_id,"type":formFields[i].type};
                     control.create(false,false,opt_obj);
                     li_container.append(control.li);

                     mainView.fieldsArray[formFields[i].li_id] = {};
                     var setting_obj = control.setting_options[formFields[i].type];
                     if(setting_obj){
                        for(var s=0;s<setting_obj.length;s++){
                            for(var m=0;m<setting_obj[s].length;m++){
                                if(formFields[i][setting_obj[s][m]['key']]){
                                   mainView.fieldsArray[formFields[i].li_id][setting_obj[s][m]['key']] = formFields[i][setting_obj[s][m]['key']]; //formJSON.decodeHTML(
                                }
                                else{
                                        mainView.fieldsArray[formFields[i].li_id][setting_obj[s][m]['key']] = "";
                                }
                            }
                        }
                        mainView.fieldsArray[formFields[i].li_id]['type'] = formFields[i].type;
                        mainView.fieldsArray[formFields[i].li_id]['name'] = control.getName(formFields[i].li_id,formFields[i].type);
                        if(formFields[i].type=="heading" || formFields[i].type=="header"){
                            if(!mainView.fieldsArray[formFields[i].li_id]['font_size']){
                                mainView.fieldsArray[formFields[i].li_id]['font_size'] = "20";
                            }
                            if(!mainView.fieldsArray[formFields[i].li_id]['font_weight']){
                                mainView.fieldsArray[formFields[i].li_id]['font_weight'] = "bold";
                            }
                        }
                        if(li_container.attr("id")!="formcontents"){
                            if(!mainView.fieldsArray[formFields[i].li_id]['bg_color']){
                                mainView.fieldsArray[formFields[i].li_id]['bg_color'] = "#49AFCD";
                            }
                            if(!mainView.fieldsArray[formFields[i].li_id]['bg_color_button']){
                                mainView.fieldsArray[formFields[i].li_id]['bg_color_button'] = "#CCCCCC";
                            }
                            if(typeof(mainView.fieldsArray[formFields[i].li_id]['font_color'])!="undefined" && mainView.fieldsArray[formFields[i].li_id]['font_color']==""){
                                mainView.fieldsArray[formFields[i].li_id]['font_color'] = "#ffffff";
                            }
                        }

                        control.applySettings(formFields[i].li_id,formFields[i].type);
                     }
                } //End of fields creation loop
                if($("#mformId").val()!==""){
                  mainView.resizeForm();
                }
                if(isDefaultView===true){

                    $("#formfooter").addClass("new-form");
                }
            } //End of formFields check
            if($("#mformId").val()!==""){
               formJSON.checkFormList();
            }
        }//End of formobj check
        control.firstLastControl = false;
        mainView.applySettings("_form");
    },
    createJSONFromB:function(){
       var form_obj = $( $("#temp_form_frame")[0].contentWindow.document.body);
       var c = 1;
       var header,footer;
       var strJSON ='[{';
            strJSON +='"formname":"'+$("#fname").val()+'",';
            strJSON +='"fields":[';
            var field_array = form_obj.find("> p,> input");
         field_array.each(function(ind,value){
            var isElement = true;
            var type = "textfield",li_id,id,name,label,val,req,option_str;
            if($(this).find(".formHeading").length){
                header =true;
                type = "header";
                li_id ="html_header";id="html_header";
                label = formJSON.filter($(this).find(".formHeading").text());
            }
            else if($(this).find(".formCaptcha").length){
                type = "capacha";
                li_id ="html_captcha";id="html_captcha";
            }
            else if($(this).find(".formFieldInput").length){
                var input_field = $(this).find(".formFieldInput");
                if(input_field.attr("type")=="text"){
                    type="textfield";
                    name = input_field.attr("name");
                    label = formJSON.filter($(this).find(".formFieldLabel").text());
                    var ctrl_id = (name.indexOf("frmFld_")>-1) ?name:"basic_"+name;
                    li_id =id=ctrl_id;
                    req = ($(this).find(".required").length || $(this).find(".formFieldLabel").text().indexOf("*")!=-1)?"yes":"no";
                    val = input_field.val();
                }
                else if(input_field.attr("type")=="submit"){
                    if(ind!=field_array.length-1){
                        isElement = false;
                    }
                    else{
                        footer = true;
                        type="button";
                        label = input_field.attr("value");
                        li_id =id="html_submit";
                    }
                }
                else if($(this).find("input[type='radio']").length>1 || $(this).find("input[type='checkbox']").length>1){
                    type=$(this).find("input").attr("type");
                    name = input_field.attr("name");
                    label = $(this).find(".formFieldLabel").html();
                    option_str = "";
                    var multi_option = $(this).find("input[type='"+type+"']");
                    for(var i=0;i<multi_option.length;i++){
                        option_str += $(multi_option[i]).val();
                        if(i<multi_option.length-1){
                            option_str += "_-_";
                        }
                    }
                    var ctrl_id = "_"+name.replace(/_/g,"-").replace(/ /g,"-");
                    li_id =id=ctrl_id;
                }
                else if(input_field.attr("type")=="checkbox"){
                    type="checkbox";
                    name = input_field.attr("name");
                    label = $(this).find(".formFieldLabel .formFieldLabel").html();
                    var ctrl_id = name+"_"+input_field.attr("value");
                    li_id =id=ctrl_id;
                }
                else if(input_field.attr("type")=="radio"){
                    type="radio";
                    name = input_field.attr("name");
                    label = $(this).find(".formFieldLabel").html();
                    var ctrl_id = (name.indexOf("frmFld_")>-1) ?name:"basic_"+name;
                    li_id =id=ctrl_id;
                }
                else if(input_field[0].tagName=="SELECT"){
                    type="selectbox";
                    var option_array = $(input_field[0]).find("option");
                    option_str = "";
                    for(var i=0;i<option_array.length;i++){
                        option_str += $(option_array[i]).html();
                        if(i<option_array.length-1){
                            option_str += "_-_";
                        }
                    }
                    name = input_field.attr("name");
                    label = formJSON.filter($(this).find(".formFieldLabel").text());
                    var ctrl_id = (name.indexOf("frmFld_")>-1) ?name:"basic_"+name;
                    li_id =id=ctrl_id;
                    req = ($(this).find(".required").length || $(this).find(".formFieldLabel").text().indexOf("*")!=-1)?"yes":"no";
                }
            }
            else if($(this).find(".formLineBreak").length){
                type="linebreak";
                li_id =id="linebreak"+c;
            }
            else if($(this).find(".formHorizontalRule").length){
                type="hr";
                li_id =id="hr"+c;
            }
            else if(this.tagName=="INPUT" && $(this).attr("type")=="hidden"){
                if($(this).attr("name")=="salesRep"){
                    li_id =id="html_salesRep";
                    name = "salesRep";
                }
                else{
                    li_id =id="html_salesRep";
                    name = $(this).attr("name");
                    var ctrl_id = "_"+name.replace(/_/g,"-").replace(/ /g,"-");
                    li_id =id=ctrl_id;
                }
                type="hidden";
                val = $(this).val();
            }
            else{
                isElement = false;
            }
            if(isElement){
                if(c==1 && !header){
                     strJSON += '{"li_id":"html_header","id":"html_header","label":"Heading","style":"","type":"header","order":1},';
                     header = true;
                }
                strJSON += "{";
                strJSON +='"li_id":"'+li_id+'",';
                strJSON +='"id":"'+id+'",';
                if(label){
                    strJSON +='"label":"'+label+'",';
                }
                if(val){
                    strJSON +='"default_value":"'+val+'",';
                }
                strJSON +='"style":"",';
                if(name){
                    strJSON +='"name":"'+name+'",';
                }
                if(req){
                    strJSON +='"required":"'+req+'",';
                }
                if(option_str){
                    strJSON +='"options":"'+option_str+'",';
                }
                strJSON +='"type":"'+type+'",';
                strJSON +='"order":'+c+'';
                strJSON += "}";


                c++;
            }
            if(ind<field_array.length-1){
                if(isElement){
                  strJSON +=',';
                }
            }
            else{
                if(!footer){
                    var coma = strJSON.substring(strJSON.length-1)==","?"":",";
                    strJSON += coma+'{"li_id":"html_submit","id":"html_submit","label":"Submit","align":"left","style":"","type":"button","order":'+(c+1)+'}';
                    footer =true;
                }
            }
        });
        strJSON +=']}]';

        $("#mformHTML").val(strJSON);
        formJSON.createFormFromJSON();

    },
    createJSONFromA:function(){
       var form_obj = $( $("#temp_form_frame")[0].contentWindow.document.body.innerHTML);

    },
    createJSONFromF:function(){
       var form_obj = $( $("#temp_form_frame")[0].contentWindow.document.body);
       var c = 1;
       var strJSON ='[{';
            strJSON +='"formname":"'+$("#fname").val()+'",';
            strJSON +='"fields":[';
         var field_header = form_obj.find("> table h2");
         var headr_text = (field_header.length && $.trim(field_header.html())!=="") ? formJSON.filter(field_header.text()) : "Sign up Form";
            strJSON += '{"li_id":"html_header","id":"html_header","label":"'+headr_text+'","style":"","type":"header","order":1},';

         var field_array = form_obj.find("form table tbody tr") ;
         field_array.each(function(ind,value){
            var isElement = true;
            var type = "textfield",li_id,id,name,label,val,req,option_str;
            if($(this).find("input[type='text']").length){
                var input_field = $(this).find("input[type='text']");
                var name = input_field.attr("name");
                if(name=="uText"){
                    type = "capacha";
                    li_id ="html_captcha";id="html_captcha";
                }
                else{
                    type="textfield";
                    label = $(this).find("td:first-child").text();
                    var ctrl_id = (name.indexOf("frmFld_")>-1) ?name:"basic_"+name;
                    li_id =id=ctrl_id;
                    req = label.indexOf("*")>-1?"yes":"no";
                    val = input_field.val();
                    label = label.replace("*","");
                }
            }
            else if($(this).find("select").length){
                var input_field = $(this).find("select");
                var name = input_field.attr("name");
                type="selectbox";
                var option_array = $(input_field[0]).find("option");
                option_str = "";
                for(var i=0;i<option_array.length;i++){
                    option_str += $(option_array[i]).html();
                    if(i<option_array.length-1){
                        option_str += "_-_";
                    }
                }
                var label = formJSON.filter($(this).find("td:first-child").text());
                var ctrl_id = (name.indexOf("frmFld_")>-1) ?name:"basic_"+name;
                li_id =id=ctrl_id;
                req = $(this).find("td:first-child").text().indexOf("*")>-1?"yes":"no";
            }
            else if($(this).find("input[type='checkbox']").length){
                var input_field = $(this).find("input[type='checkbox']");
                var name = input_field.attr("name");
                type="checkbox";
                label = $(this).find("td:last-child").text();
                var ctrl_id = name+"_"+input_field.attr("value");
                li_id =id=ctrl_id;
            }
            else{
                isElement = false;
            }
            if(isElement){
                strJSON += "{";
                strJSON +='"li_id":"'+li_id+'",';
                strJSON +='"id":"'+id+'",';
                if(label){
                    strJSON +='"label":"'+label+'",';
                }
                if(val){
                    strJSON +='"default_value":"'+val+'",';
                }
                strJSON +='"style":"",';
                if(name){
                    strJSON +='"name":"'+name+'",';
                }
                if(req){
                    strJSON +='"required":"'+req+'",';
                }
                if(option_str){
                    strJSON +='"options":"'+option_str+'",';
                }
                strJSON +='"type":"'+type+'",';
                strJSON +='"order":'+c+'';
                strJSON += "}";


                c++;
            }
            if(ind<field_array.length-1){
                if(isElement){
                  strJSON +=',';
                }
            }

        });
        var field_button= form_obj.find("form input[type='submit']");
        var button_text = field_button.length?field_button.val():"Submit";
        strJSON +='{"li_id":"html_submit","id":"html_submit","label":"'+button_text+'","align":"left","style":"","type":"button"}';

        strJSON +=']}]';

        $("#mformHTML").val(strJSON);
        formJSON.createFormFromJSON();
    },
    createIframe:function(ftype){
        $("body").append('<iframe src="" frameborder="0" scrolling="no" style="width:1px;height:1px;" id="temp_form_frame"></iframe>');
        setTimeout('formJSON.setIFrameHTML("'+ftype+'")',200);
    },
    setIFrameHTML:function(form_type){
        $("#temp_form_frame")[0].contentWindow.document.body.innerHTML = $("#mformHTML").val();
        var isError = false;
        if(form_type==="B"){
          formJSON.createJSONFromB();          
        }
        else if(form_type==="F" || form_type==="A"){
            formJSON.createJSONFromF();
        }
        else{
            alert("Unknow form type, cann't display your form. Please create a new form.");
        }
        if(isError===false){
            formJSON.saveNewLayout();
        }
        $("#temp_form_frame").remove();
    },
    saveNewLayout:function(){        
        $("#mformType").val("C");
        mainView.typeToC = true;
        formJSON.save(true);
    }
};

/*/////////////////////////////////////////Jquery dom ready with main view initialize /////////////////////////////////////////*/
$(function(){
   mainView.init();
});/*end of ready function*/

$.widget( "custom.catcomplete", $.ui.autocomplete, {
    _renderMenu: function( ul, items ) {
        var that = this,
        currentCategory = "";
        $.each( items, function( index, item ) {
        if ( item.category != currentCategory ) {
            ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
            currentCategory = item.category;
        }
        that._renderItem( ul, item );
        });
    }
});
