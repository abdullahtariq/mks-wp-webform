$(document).ready(function(){
$('#signup-trial').click(function(){$('#New-Signup-form').fadeIn();})
/*===================================
	Validation For Short Trial
	====================================*/
	$('#signUpButtonTrial').click(function(){
		var fname = $('#fname').val();
		var lname = $('#lname').val();
		var challText = $('#uText').val();
		var pwd = $('#pwd').val();
		var pwd2 = $('#pwd2').val();
		var phone = $('#phone').val();
		var email = $('#email').val();
		var company = $('#company').val();
		$('.erroricon').hide();
		var cmnErr = false;
		var emailErr = false;

		if(challText == '')
		{
					//alert(' Enter text for spam protection.');
					cmnErr = true;
					$('#uText').parent().addClass('has-error');
					$('#uText_erroricon').show();
					$('#uText_erroricon').attr('data-content','Please enter the CAPTCHA');
					//$('#uText_erroricon').popover({'placement':'bottom','trigger':'hover',delay: { show: 0, hide:0 },animation:false});
					//return false;
				}
				else
				{
					//cmnErr = false;
					$('#uText').parent().removeClass('has-error');
					$('#uText_erroricon').hide();
				}
				/*if(company == "")
				{
					//errorMessage += '- Please enter company.\n';
					cmnErr = true;
					$('#company').parent().addClass('has-error');
					$('#company_erroricon').show();
					$('#company_erroricon').attr('data-content','Please enter company.');
				}
				else
				{
					//cmnErr = false;
					$('#company').parent().removeClass('has-error');
					$('#company_erroricon').hide();
				}*/
				if(pwd.length<8){

					cmnErr = true;
					$('#pwd').parent().addClass('has-error');
					$('#pwd_erroricon').show();
					$('#pwd_erroricon').attr('data-content','Password must contain at least 8 characters.');
				}
				else if(isValidPassword(pwd)==false){
					//errorMessage += '- Enter a valid password. Space and blackslash characters not allowed.\n';
					cmnErr = true;
					$('#pwd').parent().addClass('has-error');
					$('#pwd_erroricon').show();
					$('#pwd_erroricon').attr('data-content','Enter a valid password. Space and backslash characters are not allowed.');
				}
				else if(isValidPass(pwd)==false){
					//errorMessage += '- Password must have at least one letter and one number.\n';
					cmnErr = true;
					$('#pwd').parent().addClass('has-error');
					$('#pwd_erroricon').show();
					$('#pwd_erroricon').attr('data-content','Password must have at least one letter and one number.');
				}
				else if(pwd != pwd2)
				{
					//errorMessage += '- Password is mismatching, please enter your password again.\n';
					cmnErr = true;
					$('#pwd').parent().addClass('has-error');
					$('#pwd2').parent().addClass('has-error');
					$('#pwd_erroricon').show();
					$('#pwd_erroricon').attr('data-content','Password mismatch. Please enter your password again.');
				}
				else
				{
					//cmnErr = false;
					$('#pwd').parent().removeClass('has-error');
					$('#pwd2').parent().removeClass('has-error');
					$('#pwd_erroricon').hide();
				}
				if(fname == '') {
					//errorMessage += '- Please enter first name.\n';
					cmnErr = true;
					$('#fname').parent().addClass('has-error');
					$('#fname_erroricon').show();
					$('#fname_erroricon').attr('data-content','Please enter first name.');
				}
				else
				{
					//cmnErr = false;
					$('#fname').parent().removeClass('has-error');
					$('#fname_erroricon').hide();
				}
				if(lname == '') {
					//errorMessage += '- Please enter last name.\n';
					cmnErr = true;
					$('#lname').parent().addClass('has-error');
					$('#lname_erroricon').show();
					$('#lname_erroricon').attr('data-content','Please enter last name.');
				}
				else
				{
					//cmnErr = false;
					$('#lname').parent().removeClass('has-error');
					$('#lname_erroricon').hide();
				}			
				if(phone == '')
				{
					//errorMessage += '- Please enter phone.\n';
					cmnErr = true;
					$('#phone').parent().addClass('has-error');
					$('#phone_erroricon').show();
					$('#phone_erroricon').attr('data-content','Please enter phone number.');
				}
				else if(isValidPhone(phone)== false){
					cmnErr = true;
					$('#phone').parent().addClass('has-error');
					$('#phone_erroricon').show();
					$('#phone_erroricon').attr('data-content','Only Digits allowed');
				}
				else
				{
					//cmnErr = false;
					$('#phone').parent().removeClass('has-error');;
					$('#phone_erroricon').hide();
				}
				
				
				
				
				if(email == '')
				{
					//errorMessage += '- Please enter valid email address.\n';
					cmnErr = true;
					$('#email').parent().addClass('has-error');
					$('#email_erroricon').show();
					$('#email_erroricon').attr('data-content','Please enter email address.');
				}
				else if(isValidEmail(email)==false)
				{
					//errorMessage += '- Please enter valid email address.\n';
					cmnErr = true;
					$('#email').parent().addClass('has-error');
					$('#email_erroricon').show();
					$('#email_erroricon').attr('data-content','Please enter valid email address.');
				}
				else if(isEmail(email)==false)
				{
					emailErr = true;
					$('#email').parent().addClass('has-error');
					$('#email_erroricon').show();
					$('#email_erroricon').attr('data-content','Email addresses of free services are not accepted. (e.g. @msn, @gmail, @yahoo)');
				}else{
					//emailErr = false;
					//cmnErr = false;
					$('#email').parent().removeClass('has-error');
					$('.emailbg').attr('style','');
					$('#email_erroricon').hide();
				}// Validate Phone
function isValidPhone(string){
var a = string;
    var filter = /^[0-9-+]+$/;
    if (filter.test(a)) {
	        return true;
	    }
	    else {
	        return false;
	    }
}
				postForm({cmnErr:cmnErr,emailErr:emailErr});
			});

function isValidEmail(string) {
	if (string.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
		return true;
	else
		return false;
}
function isEmail(string) {
	var re = '[a-zA-Z_\\.-]+@((hotmail)|(yahoo)|(gmail)|(msn))\\.[a-z]{2,4}';
	if(string.match(re))
		return false;
	else
		return true;
}
function isValidPassword(value) {
	if(value.charAt(0)==' ' || value.charAt(value.length-1)==' ' || value.indexOf("\\")>=0)
		return false;

	return true;
}
function isValidPass(string) {
	if (string.search(/^.*(?=.{8,})(?=.*\d)(?=.*[A-Za-z]).*$/) != -1)
		return true;
	else
		return false;
}
// Validate Phone
function isValidPhone(string){
var a = string;
    var filter = /^[0-9-+]+$/;
    if (filter.test(a)) {
	        return true;
	    }
	    else {
	        return false;
	    }
}
/*============================================
			POST AJAX FORM 
  ========================================*/ 
function postForm(object){
	if(!object.cmnErr && !object.emailErr){
					
					$('#signup_form').parents('.postbox').append('<div class="formoverlay"><span class="spinnerloading"></span><p>Sending request....</p></div>');
					var data = $("#signup_form").serialize();
					var url = $("#admin-src-path").val();
					var type= 'webforms_createuser';
					
					//console.log(data);
					//return false;
                    $.ajax({
                        url:url+"/wp-admin/admin-ajax.php",
                        type:'POST',
                        data: data,
                        success:function(results)
                        {
                            $('#signup_form').parents('.postbox').find('.formoverlay').remove();

                            var res = JSON.parse(results);	
                            if(res.key_value == 'Error')
							{
								//var str = res[1];
								//alert(str);
                                	//$('.errors').html('Please re-enter the CAPTCHA correctly');
								$('.response-error p').html(res.response);
								$('.response-error').show();
								$('.notice-success').hide();
								return false;
							}
                            else 
                            {
                            	$('.notice-success p').html(res.response);
                            	$('.notice-success').show();
								$('.response-error').hide();
								$('#New-Signup-form').hide();
								//window.location = url+'/thank-you?q='+type;
								return true;
                            }
                        }
                    });
					return false;
	}
	else{
		return false;
	}
}







})