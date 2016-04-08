/*
 *Code written by : Umair Shahid
 *Created Date: 11 March 2013
*/

/*/////////////////////////////////////// Main view for form ////////////////////////////////////////////////////*/
var formPreview = {
    formJSON : {},
    init:function(){
        formJSON.createForm();
        if(BMS_IS_PREVIEW=="false"){
            $("#BMS_SUBMIT").click(function(){
                  if(formPreview.validate()){
                      $(this).parents("form").submit();
                  }
            });
            $(".formareacontents").css("width","100%");
        }
    },
     applySettings:function(field_obj){

       if(field_obj.bg_color){
            var color = field_obj.bg_color.substr(0,1)=="#"?field_obj.bg_color:("#"+field_obj.bg_color);
            $(".formareacontents").css("background",color);
       }
       if(field_obj.style){
        $(".formareacontents").attr("style",field_obj.style);
       }

   },
   loadCAPTCHA: function() {
        var mpageprotocol = document.location.protocol||'http:';
         $.ajax({
             type: 'POST',
             url: mpageprotocol+'//'+BMS_CAPTCHA_DOMAIN+'/pms/form/ChallengeHandler.jsp?usr='+FRM_UID,
             success: function(response) {
                 var splitRespAry = response.split(',');
                 $('#ibms_captch_challenge').val(splitRespAry[1]);
                 $('#bms_captch_img').attr('src', mpageprotocol+'//'+BMS_CAPTCHA_DOMAIN+splitRespAry[0]).show();
             },
             error: function(xhr) {
                 $('#ibms_captch_challenge').val('_DEFAULT');
                 $('#bms_captch_img').attr('src', mpageprotocol+'//'+BMS_CAPTCHA_DOMAIN+'/pms/challenge?c=_DEFAULT').show();
             }
         });
    },
    isEmail:function (string) {
        if (string.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
           return true;
        else
           return false;
     },
     validate:function(){
         var isValidation = true;
         var fields_li =$("#formcontents li");
         $("#formcontents li .required_message").css("display","none");
         var isRequiredElements = [];
         fields_li.each(function(i,v){
             var li_field = $(this);
             if(li_field.find(".required").length){
                 if((li_field.find("input[type='text']").length || li_field.find("textarea").length) && !li_field.find("input[type='text']").val()){
                     isRequiredElements.push([li_field.attr("id"),""]);
                 }
                 else if(li_field.find("input[type='checkbox']").length && li_field.find("input[type='checkbox']:checked").length==0){
                    isRequiredElements.push([li_field.attr("id"),""]);
                 }
                 else if(li_field.find("input[type='radio']").length && li_field.find("input[type='radio']:checked").length==0){
                      isRequiredElements.push([li_field.attr("id"),""]);
                 }
                 else if(li_field.find("select").length && (li_field.find("select").val()=="" || li_field.find("select").val()=="-1")){
                      isRequiredElements.push([li_field.attr("id"),""]);
                 }
                 else{
                     if(li_field.attr("id")=="basic_email"){
                         if(!formPreview.isEmail(li_field.find("input[type='text']").val())){
                             isRequiredElements.push([li_field.attr("id"),"Enter valid email address."]);
                         }
                     }
                 }
             }
             else if(li_field.attr("id")=="html_captcha"){
                 if(!li_field.find("#ibms_captch_response").val()){
                     isRequiredElements.push([li_field.attr("id"),""]);
                 }
             }
         });
         if(isRequiredElements.length){
             isValidation = false;

             $(isRequiredElements).each(function(i,ele){
                  var req_msg = $("[id='"+ele[0]+"']").find(".required_message");
                   if(ele[1]){
                       req_msg.html(ele[1]);
                   }
                   if($.trim(req_msg.html())==""){
                       req_msg.html("This field is required");
                   }
                   req_msg.fadeIn();
             });
             alert('Please correct mentioned error(s) with form fields.');
         }
         else if($("input[name='lists']").length && $("input[name='lists']:checked").length==0){
                alert('Select list(s) for subscription.');
                isValidation = false;
            }
         
         return isValidation;
     },
     loadFile:function(url){
         if($("link[href='"+url+"']").length==0){
            var link_url = $("<link>").attr({
               rel:  "stylesheet",
               type: "text/css",
               href: url
             });
            $("head").append(link_url);
         }
     }
};

var formJSON = {
    formEle : "formcontents",   /*Set form id*/
    createForm:function(){
        var form_json = BMS_FORM_JSON.replace(/\n/g,"");
        var formObj = jQuery.parseJSON(form_json);
        formPreview.formJSON = formObj[0];
        var formContainer = (typeof(BMS_IS_SCRIPT)!=="undefined")?$("#dv"+BMS_FORM_ID):$("body");

        formContainer.append("<form method='post' target='_top'  action='"+BMS_FORM_ACTION+"'><input type='hidden' value='"+BMS_FORM_ID+"' name='formId'><input type='hidden' value='"+BMS_PAGE_ID+"' name='pageId'><div id='' class='formareacontents'><ul id='formcontents'></ul></div></form>")
        if(formObj!==null ){
            var formFields = formObj[0].fields;
            //Set form propertites
            if(formFields && formFields.length){

                $("#formcontents").children().remove();
                for(var i=0;i<formFields.length;i++){
                     var li_container = $("#formcontents");
                     var opt_obj={"id":formFields[i].li_id,"type":formFields[i].type};
                     control.li = control.createWrapper(formFields[i].label,formFields[i].li_id,formFields[i].type);
                     control.create(formFields[i]);
                     li_container.append(control.li);

                     control.applySettings(formFields[i]);
                } //End of fields creation loop

            } //End of formFields check
        }//End of formobj check
        if(BMS_IS_CAPTCHA=="true"){
            formPreview.loadCAPTCHA();
        }
        formPreview.applySettings(formObj[0]);

    }
};

var control={
    li:null,
    createWrapper:function(val,id,type){
        var h = (type=="hidden")?"class='hiddenli'":"";
        return $("<li id='"+id+"' "+h+">"+val+"</li>");
    },
    create:function(field){

        control.li.html("");
        control.li.append(controlHTML.creatHTML(field));

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
    },applySettings:function(field_obj){
         var requiredHTML = "";
         var requiredMsgHTML = "";
         var type = field_obj.type;
         type = (type=="custom_field")?'textfield':type;
         var id = field_obj.li_id;
         $(".formareacontents [id='"+id+"']").find("div").first().removeClass("hide-control");
         if(field_obj.required && field_obj.required=='yes'){
              if(field_obj.requried_msg && field_obj.requried_msg!==''){
                    requiredMsgHTML +=field_obj.requried_msg;
                }
               requiredHTML +="<div class='required'>*</div><div class='required_message' style='display:none'>"+requiredMsgHTML+"</div>";
         }

         if(type=="checkbox"){
            $(".formareacontents [id='"+id+"'] .form-label-top .label").html(field_obj.label);
            $(".formareacontents [id='"+id+"'] .form-label-top").append(requiredHTML);
         }
         else if(type=="textfield" || type=="text" || type=="selectbox" || type=="textarea"){
             $(".formareacontents [id='"+id+"'] .form-label-top").html(field_obj.label+requiredHTML);
             if(field_obj.default_value && field_obj.default_value!==""){
                 $("#formcontents [id='"+id+"'] .form-input-wide input").val(field_obj.default_value);
             }
         }
         else if(type=='heading' || type=='header'){
             $(".formareacontents [id='"+id+"'] .form-label-top .heading").html(field_obj.label);
         }
         else if(type=='button'){
              $(".formareacontents [id='"+id+"'] .form-label-top button").html(field_obj.label);
         }

         if((type=='radio' || type=='checkbox') && field_obj.options){
              var _options = [];
             if(field_obj.options){
                _options =  field_obj.options.split("_-_");
             }
             var optionhtml = "";
             if(field_obj.label && _options.length>1){
                 optionhtml += "<div>"+field_obj.label+"</div>";
             }
             for(var o=0;o<_options.length;o++){
                 var classMargin = (o>0)?'class=""':'';
                 var selectedVal = (o==0)?'checked="checked"':'';
                 var breakline = (o>0)?'<br/>':'';
                 optionhtml +=breakline+'<input type="'+type+'" '+classMargin+' '+selectedVal+' name="'+field_obj.name+'" value="'+_options[o]+'" /><span class="label">'+_options[o]+'</span>'
             }
             $(".formareacontents [id='"+id+"'] .form-label-top").html(optionhtml);
         }

         //Set alignment of text or control
         if(field_obj.align){
               $(".formareacontents [id='"+id+"'] .form-label-top").css("text-align",field_obj.align)
         }
         //Set style of control
         if(field_obj.style){
               $(".formareacontents [id='"+id+"'] .form-label-top").attr("style",field_obj.style)
         }
         //Set hidden property
         if(field_obj.hidden && field_obj.hidden=='yes'){
             $(".formareacontents [id='"+id+"']").hide();
             $(".formareacontents [id='"+id+"']").find("div").first().addClass("hide-control");
             if($(".formareacontents [id='"+id+"']").find("input[type='checkbox']").length){
                $(".formareacontents [id='"+id+"']").find("input[type='checkbox']").attr("checked",true);
             }
         }
         if(field_obj.height){
               $(".formareacontents [id='"+id+"'] .form-label-top div").css("height",field_obj.height+"px");
         }
         if(field_obj.bg_color){
               var color = field_obj.bg_color.substr(0,1)=="#"?field_obj.bg_color:("#"+field_obj.bg_color);
               if(type=="button"){
                   var startColor = control.ColorAdjust(color, 0.077);
                   control.setColor(startColor,color,$(".formareacontents #"+id+" .form-label-top button"));
               }
               else if(type=="header"){
                    var startColor = control.ColorAdjust(color, 0.077);
                    control.setColor(startColor,color,$(".formareacontents #"+id));
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
          if(field_obj.bg_color_button){
             var color = field_obj.bg_color_button.substr(0,1)=="#"?field_obj.bg_color_button:("#"+field_obj.bg_color_button);
             if(type=="button"){
                 $(".formareacontents [id='"+id+"']").css("background-color",color);
             }
         }
         if(field_obj.font_color){
                var color = field_obj.font_color.substr(0,1)=="#"?field_obj.font_color:("#"+field_obj.font_color);
                if(type=="text"){
                     $(".formareacontents [id='"+id+"'] .form-label-top").css("color",color);
                }
                else if(type=="heading" || type=="header"){
                    $(".formareacontents [id='"+id+"'] .form-label-top .heading").css("color",color);
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

var controlHTML = {
    creatHTML:function(field){
         var id = field.li_id;
        var type = field.type;
        var txt = field.label;
        var _name = field.name;

        var ctrl_id=id.split("_")[1];
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
           case 'button':
               cHTML = this.buttonHTML();
               this.addLayer();
               break;
           case 'capacha':
               cHTML = this.capachaHTML();
               this.addLayer();
               break;
           case 'checkbox':
               cHTML = this.listHTML(ctrl_id,txt,field);
               this.addLayer();
               break;
           case 'radio':
               cHTML = this.radioHTML(ctrl_id,txt,field);
               this.addLayer();
               break;
           case 'textarea':
               cHTML = this.textareaHTML(ctrl_id,txt,_name,field);
               this.addLayer();
               break;
           case 'selectbox':
               cHTML = this.selectField(ctrl_id,txt,field);
               this.addLayer();
               break;
            case 'hidden':
                txt = field.default_value;
               cHTML = this.hiddenField(ctrl_id,txt,_name);

               break;
           default:
                cHTML = this.inputField(ctrl_id,txt,_name);
                this.addLayer();
               break;
        }
        return cHTML;
    },
    addLayer:function(){
    }
    ,
    wrapper:function(l,i,opt){
        var iHTML = "<div style='display: inline-block; width: 100%;' ctrl_type='"+opt.type+"'>";
        if(l){
            var ctrl_id = control.li.attr("id");
            var labelEdit = opt.labelEdit ? "labelEdit":"";
            var color = (formPreview.formJSON.color && ctrl_id!=="html_heading" && ctrl_id!=="html_submit")?"color:"+formPreview.formJSON.color+";":"";
            var fsize = (formPreview.formJSON.font_size && ctrl_id!=="html_heading" && ctrl_id!=="html_submit")?"font-size:"+formPreview.formJSON.font_size+"px;":"";
            var ffamily = (formPreview.formJSON.font_family && ctrl_id!=="html_heading" && ctrl_id!=="html_submit")?"font-family:"+formPreview.formJSON.font_family+";":"";
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
    textareaHTML:function(id,l,_name,f){       
        var __name = f.li_id.substring(0,7)=="frmFld_"?f.li_id:_name;
        var fieldHTML = "<textarea name='"+__name+"' id='"+id+"' placeholder='' rows='5' cols='10'></textarea>";
        return this.wrapper(l, fieldHTML,{type:"textarea",labelEdit:true});
    },
    inputField:function(id,l,ctrl_name){
        var _name = ctrl_name.substring(0,6)=="frmFld"?ctrl_name:id;
        if(id=="customField"){
            _name = ctrl_name;
        }
        var fieldHTML = "<input name='"+_name+"' id='"+id+"' class='form-textbox validate[required]' type='text' size='30' placeholder='' />";
        return this.wrapper(l, fieldHTML,{type:"textfield",labelEdit:true});
    },
    selectField:function(id,l,f){
        var _options = [];
        if(f.options){
            _options =  f.options.split("_-_");
        }
        var _name = f.li_id.substring(0,7)=="frmFld_"?f.li_id:f.name; 
        var fieldHTML = "<select name='"+_name+"' id='"+id+"' class='form-selectbox validate[required]' >";
        if(_options.length){
            for(var i=0;i<_options.length;i++){
                 fieldHTML += "<option value='"+_options[i]+"'>"+_options[i]+"</option>"
            }
        }
        else{
            fieldHTML += "<option value='-1'>--Select a value---</option>"
        }
        fieldHTML += "</select>";
        return this.wrapper(l, fieldHTML,{type:"selectbox",labelEdit:true});
    },
    headingField:function(txt){
        var iHTML = "<div class='heading'>"+txt+"</div>";
        return this.wrapper(iHTML,false,{type:"heading",labelEdit:true});
    },
    headerField:function(txt){
        var iHTML = "<div class='heading'>"+txt+"</div>";
        return this.wrapper(iHTML,false,{type:"header",labelEdit:true});
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
       var btnHTML = "<button id='BMS_SUBMIT' class='btn btn-large btn-info' type='button'>Submit</button>";
       return this.wrapper(btnHTML,false,{type:"button"});
    },
    listHTML:function(id,txt,f){
       var _name = f.li_id.substring(0,7)=="frmFld_"?f.li_id:"lists";
       var lstHTML = "<input type='checkbox' name='"+_name+"' id='"+id+"' value='"+f.default_value+"' /><span class='label'>"+txt+"</span>";
       return this.wrapper(lstHTML,false,{type:"checkbox"});
    },
   radioHTML:function(id,txt,f){
       var _name = f.li_id.substring(0,7)=="frmFld_"?f.li_id:id; 
       var lstHTML = "<input type='radio' name='"+_name+"' id='"+id+"' /><span class='label'>"+txt+"</span>";
       return this.wrapper(lstHTML,false,{type:"radio"});
    },
    capachaHTML:function(){
        var capachaControl = "<div class='capacha'><span class=\"formCaptcha\"><img id='bms_captch_img' style='display:none;' src='' border=1><br /><input type='text' name='bms_captch_response' id='ibms_captch_response'><input type='hidden' name='bms_captch_challenge' id='ibms_captch_challenge'><input type='hidden' name='isCAPTCHA' value='Y'></span></div><div class='required_message' style='display:none'>Enter text for spam protection.</div>";
        return this.wrapper(capachaControl,false,{type:"capacha"});
    },
    hiddenField:function(id,val,name){
        var hiddenHTML = "<input type='hidden' name='"+name+"' id='"+id+"' value='"+val+"' />";
        return hiddenHTML;
    }
};


/*/////////////////////////////////////////Jquery dom ready with main view initialize /////////////////////////////////////////*/
$(function(){
   formPreview.init();
   if(typeof(converted)!=="undefined"){
       alert('Old form is converted to new form layout. Please press save to save new layout if you want. \n If landing page is published, unpublished and save the new layout.');
   }
   //Height fix for landing page.
   if($("#main-container").length){
       $("#col-left,#col-middle,#col-right").height("auto");
       setTimeout("setHeightCols()",1000);
   }

});/*end of ready function*/
function setHeightCols(){
    var h = $("#main-container").height();
    $("#col-left,#col-middle").height(h);
    $("#col-right").height(h+12);
}
if(typeof(BMS_CSS_FILE)!=="undefined" && BMS_CSS_FILE){
    formPreview.loadFile(BMS_CSS_FILE);
}
