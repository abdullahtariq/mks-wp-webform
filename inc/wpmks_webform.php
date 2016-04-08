<div class="mks-webform-wrapper">
<div class="mks-webform-listings">
    <table width="100%" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right save-form"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right save-form"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right save-form"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right save-form"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right save-form"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
        <tr>
            <td width="85%">Form list one</td>
            <td width="15%"><a class="btn-green right save-form"><span>Edit</span><i class="icon check"></i></a></td>
        </tr>
    </table>
</div>
<div class="campaign-content" style="padding:0px 20px;position:relative;">           
            <div class="topbar-fixed">
              <div class="topbar-wrapper">
                <div style="margin-top:0;" class="btns">
                    <a id="formlink" title="Form Links" class="btn-blue left showtooltip"><i class="icon link24"></i></a>
                    <a id="formcode" title="Embed Code" class="btn-blue left showtooltip"><i class="icon embed24"></i></a>
                    <a id="setting_form" class="btn-blue left "><span>Form Settings</span><i class="icon setting"></i></a>
                    <a id="fwdsettingsbtn" class="btn-blue left "><span>Forward Settings</span><i class="icon form"></i></a>
                </div>
                <div style="margin-top:0;" class="btns left">
                    <span class="namelabel">Form Name: </span><input type=text id="fname" name="formName" value="" maxlength="50" style="width:250px;line-height: 20.5px;float:left;" size="50" />
                    <a  class="btn-green right save-form"><span>Save</span><i class="icon check"></i></a>
                </div>
                <div class="alert alert-error nolist" style="display:none">
                      <strong>Oh snap!</strong> Target list is missing for this form.
                 </div>
               </div>
            </div>
            <!--- REMOVE DATA -->
            <div class="header" style="display:none">
                Form Builder
                <div class="header-btns">
                    <input type="hidden" id="plg-src-path" value="<?php echo $plugin_url; ?>" />
                    <input type="hidden" id="admin-src-path" value="<?php echo get_site_url(); ?>" />
                    <select id="mid_sel" name="mid" class="form_loader chzn-select" data-placeholder="Choose a Form to load..." style="width:300px" >
                        <option value=""></option>
                        
                       
                        
                    </select>
                    <button class="toolbarbtn" id="loadformbtn">load form</button>
                    <button class="toolbarbtn" id="newformbtn">new form</button>
                </div>
            </div>          
            <div class="subheader" style="display:none">
                <div class="formname"></div>
                <div class="toolbar" >
                    <a id="preview_form">preview</a>
                    <a id="target_form">target lin</a>
                    <a id="embed_form">embed Code</a>
                    <a id="update_form">update landing page</a>
                    <a id="deleteformbtn">delete form</a>
                    <a id="save_form">save</a>
                    <a id="closebtn">close</a>
                </div>
            </div>

            <div class="clearfix"></div>
            <!---  END REMOVE DATA -->

            <div class="autosave label label-info">
                Auto Saving...
            </div>

            <div class="contents" style="visibility: hidden;margin-top:10px">
              <div id="formtabs">
                <ul>
                    <li><a href="#tabs-1" id="formbuilder_tab">Form Builder</a></li>
                    <li><a href="#tabs-2" id="setting_tab">Form Settings</a></li>
                </ul>
                <div id="tabs-1">
                    <!--Start of builder area-->
                    <div class="subtoolbar">
                        <a id="setting_form" class="setting_button">Form Settings</a>
                        
                    </div>
                    <div class="contentRow">
                        <div class="leftbar-container">
                        <div class="leftbar" style="top:50px;">
                            <div id="accordion-form" onselectstart="return false;" unselectable="on">
                                <h3 style="margin-top:0px">Layout</h3>
                                <ul>
                                    <li id="html_heading" class="dragme">Heading</li>
                                    <li id="html_text" class="dragme">Text</li>
                                    <li id="html_break" class="dragme">Line Break</li>
                                    <li id="html_hr" class="dragme">Horizontal Rule</li>
                                    <li id="html_captcha" class="dragme">Captcha</li>
                                    <li id="html_submit" class="dragme">Submit button</li>
                                </ul>

                                <h3>Basic Fields</h3>
                                <ul id="fieldList" style="display:none">
                                    <div class="accordianbar">
                                        <div>
                                            <div class="search">
                                                <input type="text" class="serachList" name="" value="" data-search="fieldList">
                                                <a style="display: none" class="close-icon clearsearch"></a>
                                                <a class="search searchBBLink">
                                                    <i class="icon search"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                </ul>
                                <?php if($bms_user_name !== "babar"): ?>
                                <h3>Custom Fields</h3>
                                <ul id="customFieldList">
                                   <div class="accordianbar">
                                        <div>
                                            <div class="search">
                                                <input type="text" class="serachList" name="" value="" data-search="customFieldList">
                                                <a style="display: none" class="close-icon clearsearch"></a>
                                                <a class="search searchBBLink">
                                                    <i class="icon search"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <li id="frmFld_customField" class="dragme">New Custom Field</li>
                                    
                                       <li id="frmFld_customField" class="dragme"></li>
                                   
                                </ul>

                               <h3>Lists</h3>
                               <ul id="mailLists">
                                    <div class="accordianbar">
                                        <div>
                                            <div class="search">
                                                <input type="text" class="serachList" name="" value="" data-search="mailLists">
                                                <a style="display: none" class="close-icon clearsearch"></a>
                                                <a class="search searchBBLink">
                                                    <i class="icon search"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                </ul>

                               <h3 class="salesforce_a">Add to Salesforce <div class="salesforce_icon"></div></h3>
                               <ul class="salesforce_a">
                                   <li class="salesforce">
                                       <div class="div-salesforce"> 
                                        <div>
                                            <div><label><input type="checkbox" id="salesforce_checkbox" /> Add as </label><select name="salesforce" disabled="disabled" style="width:300px"><option value="1">Lead</option><option value="2">Contact</option></select></div>                                           
                                        </div>
                                       </div>
                                   </li>
                                </ul>
                                <?php endif; ?>
                            </div>
                            <div id="accordion-form2" onselectstart="return false;" unselectable="on">
                                <?php if($bms_user_name !== "babar"): ?>
                                <h3>Sales Assignment</h3>
                                <ul>
                                   <li id="salesRepItem">Sales Rep:&nbsp;
                                    <select id="salesRepPicker" name="salesRep" style="width:177px" data-placeholder="Select Sale Rep">                                    
                                    <option value=""></option>
                                   
                                    <option value="<%=salesRepName%>"></option>
                                    
                                    </select>
                                    <a id="sales_assignment_btn" title="Assign form submissions to this Sales Rep"></a>
                                   </li>
                                </ul>
                                <?php endif; ?>
                            </div>

                        </div>
                        </div>
                        <div class="formarea">
                            <div class="formareacontents">
                                <div id="emptyContents" class="nocontent div-zone" style="width:412px;display: block;">
                                    <div class="empty-text">Drop element here</div>
                                </div>
                                 <ul id="formheader">

                                </ul>
                                <ul id="formcontents" class="startform" style="display:none;">

                                </ul>
                                <ul id="formfooter">

                                </ul>
                            </div>
                        </div>

                   </div>


                    <!--End of builder area-->
                </div>
                <div id="tabs-2">
                    
                </div>

               </div>
            </div>
        </div>
        <form method="post" id="form_builder_form" action="/pms/landingpages/rFormSaver.jsp?ukey=&BMS_REQ_TK=">
        <input id="mformId" type=hidden name="mformId" value="">
        <input id="mpageId" type=hidden name="mpageId" value="">
        <input id="mIsCAPTCHA" type=hidden name="mIsCAPTCHA" value="">
        <input id="mformName" type=hidden name="mformName" value="">
        <input id="mformType" type=hidden name="mformType" value="">
        <input id="source" type=hidden name="source" value="">
        <input id="sfEntity" type=hidden name="sfentity" value="">
        <input id="isSalesforce" type=hidden name="isSalesforce" value="">

        <textarea id="mformHTML" name="mformHTML" style="display:none"></textarea>
      </form>
<div id="elementProperties" title="Properties" style="display:none;z-index: 10002;">
             <div class="windowcontent">
                 <div id="prop-" style="display: inline-block;width:100%;">
                    <div class="prop-tabs-table">
                        <form class="form-horizontal" id="elementPropertiesform">
                           <div id="basic_settings">


                            </div>
                            <a id="show_advance" class="advance_link"><i class="icon-plus-sign"></i>Show Advance Settings</a>
                            <div id="advance_settings" style="display:none">

                            </div>
                            <input type="hidden" value="0" id="prp_type" />
                        </form>
                    </div>
                 </div>
         </div>
       </div>

       <div id="forwardSettings" title="Forward Settings" style="display:none;z-index: 10002;">
             <div id="forwardSettingContainer">
                 <iframe src="about:blank" id="settings_iframe" frameborder='0' width="100%" height="400px"></iframe>
        </div>
       </div>

       <div id="embedcode" title="Embed Code" style="display:none;z-index: 10002;">
             <div>
                 <div style="margin-bottom:10px;">Copy the snippet, and paste it in the page where you want the form to be visible:</div>

                <textarea rows=1 style="padding:10px;width:558px;height:70px;color:#6666FF;" id='frmSnippet'>
</textarea>
                 
         </div>
       </div>

       <div id="targetcode" title="Form Links" style="display:none;z-index: 10002;">
             <div>
                <div style="margin-bottom:10px;font-weight:bold;font-size:13px;color: #414f58;">URL:</div>
        <div><input type="text" name='' value="" style="width:558px;" class="targeturl"></div>
         </div>
             
            <div>
                <div style="margin-bottom:10px;font-weight:bold;font-size:13px;color: #414f58;">Iframe Snippet:</div>
        <div>
                    <textarea rows=1 style="padding:10px;width:558px;height:70px;color:#6666FF;" id='frmIframeSnippet'><iframe src="" frameborder="0" style="width:400px;height:600px"></iframe></textarea>
                </div>
         </div>
            
             <div style="margin-top:10px;">Copy iframe snippet, and paste it in the page where you want the form to be visible:</div>
       </div>

 </div>      

       <script>

            
            function updateLandingPage() {
             
             window.opener.setFormId('qcWTh30Zk33Nf26qTy');
             
           }

     var SESSION_DOMAIN_NAME = 'test.bridgemailsystem.com';
           var bms_token_var = '&BMS_REQ_TK=<?php echo $bms_user_token; ?>';
           var user_key = '&ukey=<?php echo $bms_user_key; ?>';
           var formURL = 'https://test.bridgemailsystem.com/pms/landingpages/rformBuilderNew.jsp?'+bms_token_var+user_key+'&pageId=BzAEqwsDj20BvfrFtg&formId=';
           var newFormURL ='https://test.bridgemailsystem.com/pms/landingpages/rformBuilderNew.jsp?'+bms_token_var+user_key+'&pageId=kzaqwJa26ksdrt';
           var settingURL = 'https://test.bridgemailsystem.com/pms/landingpages/rFormSettings.jsp?'+bms_token_var+user_key+'&pageId=qcWNb30qaS&formId=';
           var contentDomain = "test.bridgemailsystem.com";
           var previewURL ='http://test.bridgemailsystem.com/pms/vform/BzAEqwsJp20Ns21Rn30BgyStRf/?preview=Y';
           //JOSN list of fields pre-populated on right column
           var formFieldsStr = '{"html_heading_default": {"name":"heading","label":"Enquiry Form","type":"heading","required":false}, '
                                +'"field_email": {"name":"email","label":"E-mail Address","type":"text","required":true}, '
                                +'"html_submit_button": {"name":"html_submit_button","label":"Submit","type":"submit","required":false}}';
           var formFields = eval('('+ formFieldsStr + ')');
           //JSON list of mailing lists that the user can subscribe to
           var mailListsStr = '[{"list":"MKS Test","id":"qcWRf30Qb33Og26Ij17Ge20qcW","md5":"cd882c767c8c59acb413a971a5b442f7"},{"list":"Supress_List_umair","id":"kzaqwNe26Aa17If20Lh21Ob30kzaqw","md5":"53c5dfc539ac63b95de34377abf5ba9"}]';
           var mailLists = eval('(' + mailListsStr + ')');

           

    </script>