 <?php 

/*
Plugin Name: Webforms Plugin By Makesbirdge
Plugin URI: http://makesbridge.com/
Description: This plugin is build for learning purpose only to develop further plugin for makesbridge
Version: 1.0
Author: Abdullah
Author URI: http://uxify.com/
License: GPLv2 or later
*/
/*
* Assign global variables
*  
*
*/
$plugin_url = WP_PLUGIN_URL . '/wpmks-webforms';
$opions = array();
$display_json = true;
$isUser_registered = false;
$bms_user_token ='';
$bms_user_key ='';
$bms_user_name ='';
$baseUrl = 'https://test.bridgemailsystem.com/pms';
$wpmks_webforms_userinfo = '';

//Session Start;
session_start();
//$GLOBALS['baseUrl'] = 'https://test.bridgemailsystem.com/pms';
/*
* Add a link to our plugin in admin menu 
* under 'menu > MKS Webforms' 
*
*/


function wpmks_webforms_menu(){

			/*
			* Use the add_menu_page function
			* add_menu_page( $page_title, $menu_title , $capability,$menu-slug,$function)
			*
			*/


			add_menu_page(
					'Official Makesbridge Webforms Plugin',
					'MKS Webforms',
					'manage_options',
					'wpmks-webforms',
					'wpmks_webforms_options_page'
				);

}

function wpmks_webforms_options_page(){
	if(!current_user_can('manage_options')){
		wp_die('You do not have sufficient permission to access this page.');
	}

	// Global Variables
	global $plugin_url; // available on options-page-wrapper
	global $options;
	global $display_json;
	global $isUser_registered;
	global $baseUrl; 
	global $wpmks_webforms_userinfo;
	if(isset($_POST['wpmks_webform_submitted'])){
		$hidden_field = esc_html($_POST['wpmks_webform_submitted']);
		if($hidden_field == 'Y' && isset($_POST['wpmks_webform_username']) && isset($_POST['wpmks_webform_password'])){

			$wpmks_webform_username = esc_html($_POST['wpmks_webform_username']);
			$wpmks_webform_password = esc_html($_POST['wpmks_webform_password']);
			$wpmks_webforms_userinfo = wpmks_webforms_get_userinfo($wpmks_webform_username,$wpmks_webform_password);
			if(!empty($wpmks_webforms_userinfo->{'bmsToken'})){
				$options['wpmks_webform_username'] = $wpmks_webform_username;
				$options['wpmks_webform_password'] = $wpmks_webform_password;
				//$options['$wpmks_webforms_userinfo'] = $wpmks_webforms_userinfo;
				$wpmks_webforms_getBasicFields = wpmks_webforms_get_basicfields($wpmks_webforms_userinfo->{'bmsToken'},$wpmks_webforms_userinfo->{'userKey'},$wpmks_webform_username);
				$wpmks_webforms_getMergeTags = wpmks_webforms_get_mergetags($wpmks_webforms_userinfo->{'bmsToken'},$wpmks_webforms_userinfo->{'userKey'},$wpmks_webform_username);
				$options['wpmks_webform_basicfields'] = $wpmks_webforms_getBasicFields;
				$options['wpmks_webform_mergetags'] = $wpmks_webforms_getMergeTags;
				update_option('wpmks_webforms_userinfo',$options);
			}else{
				delete_option('wpmks_webforms_userinfo');
				$isUser_registered = false;
			}

		}

	}
	$options = get_option('wpmks_webforms_userinfo');

	if($options != ''){
			$isUser_registered = true;
			$wpmks_webform_username = $options['wpmks_webform_username'];
			$wpmks_webform_password = $options['wpmks_webform_password'];
			$wpmks_webforms_userinfo = wpmks_webforms_get_userinfo($wpmks_webform_username,$wpmks_webform_password);
			$_SESSION['bmsToken'] = $wpmks_webforms_userinfo->{'bmsToken'};
			
	}else{
		delete_option('wpmks_webforms_userinfo');
		session_unset(); 
	 	$isUser_registered = false;
	}

	require('inc/options-page-wrapper.php');

}

/*=========Create New User=========*/
function wpmks_webforms_post_newuser($fields_list){
	global $baseUrl; 
	$json_login_url = 'https://www.bridgemailsystem.com/pms/trial';
	//url-ify the data for the POST
			foreach($fields_list as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
			rtrim($fields_string,'&');

	$response = wp_remote_post( $json_login_url, array(
		'method' => 'POST',
		'timeout' => 45,
		'redirection' => 5,
		'httpversion' => '1.0',
		'blocking' => true,
		'headers' => array(),
		'body' => $fields_string
		)
	);

	if ( is_wp_error( $response ) ) {
		$error_message = $response->get_error_message();
		echo "Something went wrong: $error_message";
	} else {

		$wpmks_webforms_decodeinfo = json_decode($response['body'],true) ;
		return $wpmks_webforms_decodeinfo;
	}
}


/*=========Get User Information from admin panel=========*/
function wpmks_webforms_get_userinfo($wpmks_username,$wpmks_password){
	global $baseUrl; 
	$json_login_url = $baseUrl.'/mobile/mobileService/mobileLogin';
	$response = wp_remote_post( $json_login_url, array(
		'method' => 'POST',
		'timeout' => 45,
		'redirection' => 5,
		'httpversion' => '1.0',
		'blocking' => true,
		'headers' => array(),
		'body' => array( 'userId' => $wpmks_username, 'password' => $wpmks_password )
		)
	);

	if ( is_wp_error( $response ) ) {
		$error_message = $response->get_error_message();
		echo "Something went wrong: $error_message";
	} else {

		$wpmks_webforms_decodeinfo = json_decode($response['body']) ;
		return $wpmks_webforms_decodeinfo;
	}
}
/*======================Get Basic fields===============================*/ 
function wpmks_webforms_get_basicfields($bms_token,$uKey,$username){
		global $baseUrl; 
		//echo "token : ".$bms_token . " uKey = ".$uKey." baseurl : ". $baseUrl."<br/>";
		//http://localhost/pms/json/forms.jsp?&BMS_REQ_TK=GKwVnK1etweg3jeWG3ZNItq8OQugJL&ukey=35Xbbrtr&action=fields
		$url = $baseUrl."/json/forms.jsp?BMS_REQ_TK=".$bms_token."&ukey=".$uKey."&action=fields&isMobile=Y&userId=".$username;
		//echo $url."<hr/>";
		$response = wp_remote_get( $url, array( 'timeout' => 120, 'httpversion' => '1.1' ) );
		return $response['body'];
}
/*======================Get Merge Tags===============================*/ 
function wpmks_webforms_get_mergetags($bms_token,$uKey,$username){
		global $baseUrl; 
		$url = $baseUrl."/json/metadata.jsp?BMS_REQ_TK=".$bms_token."&ukey=".$uKey."&type=merge_tags&isMobile=Y&userId=".$username;
		$response = wp_remote_get( $url, array( 'timeout' => 120, 'httpversion' => '1.1' ) );
		return $response['body'];
}


/*
*  Rendered Form Builder
*/
function wpmks_webforms_builder($wpmks_webforms_userinfo){
	global $plugin_url;
	$bms_user_token = $wpmks_webforms_userinfo->{'bmsToken'};
	$bms_user_key = $wpmks_webforms_userinfo->{'userKey'};
	$bms_user_name = $wpmks_webforms_userinfo->{'userId'};
	require_once('inc/wpmks_webform.php');
}
/*
* Providing all css files for admin area
*/
function wpmks_webforms_styles(){
	wp_enqueue_style('wpmks_webforms_formbuilder',plugins_url('wpmks-webforms/css/formbuilder.css')); 
	wp_enqueue_style('wpmks_webforms_icons',plugins_url('wpmks-webforms/css/icons.css')); 
	wp_enqueue_style('wpmks_webforms_jPicker',plugins_url('wpmks-webforms/css/jPicker-1.1.6.min.css')); 
}


/*
* Providing all script files for admin area
*/
function wpmks_webforms_scripts(){
	wp_enqueue_script('wpmks_webforms_jQuery',plugins_url('wpmks-webforms/js/jquery.js')); 
	wp_enqueue_script('wpmks_webforms_jQuery_ui',plugins_url('wpmks-webforms/js/jquery-ui-1.8.11.custom.min.js')); 
	wp_enqueue_script('wpmks_webforms_formbuilder',plugins_url('wpmks-webforms/js/formbuilder.js')); 
	wp_enqueue_script('wpmks_webforms_mks_wf_script',plugins_url('wpmks-webforms/js/mks_wf_script.js')); 
	wp_enqueue_script('wpmks_webforms_jpicker',plugins_url('wpmks-webforms/js/jpicker-1.1.6.min.js')); 
	wp_enqueue_script('wpmks_webforms_highlight',plugins_url('wpmks-webforms/js/jquery.highlight.js')); 
}

/*
* Ajax Call from admin page 
* Get Basic Fields
*/
/* Client side
jQuery.ajax({
          type:'POST',
  data:{action:'my_action',whatever:2},
          url: "http://localhost/mks_plugin/wp-admin/admin-ajax.php",
          success: function(value) {
            console.log(value);
          }
        });*/

function basic_fields_callback() {
	global $wpdb; // this is how you get access to the database
	global $options;
	$options = get_option('wpmks_webforms_userinfo');
	if($options != ''){
		echo $options['wpmks_webform_basicfields'];
	}
	
	wp_die(); // this is required to terminate immediately and return a proper response
}
function merge_tags_callback() {
	global $wpdb; // this is how you get access to the database
	global $options;
	$options = get_option('wpmks_webforms_userinfo');
	if($options != ''){
		echo $options['wpmks_webform_mergetags'];
	}
	
	wp_die(); // this is required to terminate immediately and return a proper response
}

function webforms_list_callback() {
	global $wpdb; // this is how you get access to the database
	global $options;
	global $baseUrl;
	global $wpmks_webforms_userinfo; 

	$options = get_option('wpmks_webforms_userinfo');
	print_r($wpmks_webforms_userinfo);
	$url = $baseUrl."/io/form/getSignUpFormData/?BMS_REQ_TK=".$_SESSION['bmsToken']."&type=search&isMobile=Y&userId=".$options['wpmks_webform_username']."&offset=".$_GET['offset']."&bucket=20";
	//echo $url;
	$response = wp_remote_get( $url, array( 'timeout' => 120, 'httpversion' => '1.1' ) );
	print_r($response['body']);
	//$options = get_option('wpmks_webforms_userinfo');
	//if($options != ''){
	//	echo $options['wpmks_webform_mergetags'];
	//}
	
	wp_die(); // this is required to terminate immediately and return a proper response
}

function save_form_name_callback(){
	global $wpdb; // this is how you get access to the database
	
	
	wp_die(); // this is required to terminate immediately and return a proper response
}

function create_user_callback(){
	global $wpdb; // this is how you get access to the database
	//echo 'Got the request for the form';
	extract($_POST);
	$fields = array(
			  'email'=>urlencode($email),
			  'pwd'=>urlencode($pwd),
			  'userID'=>urlencode($email),
			  'lastName'=>urlencode($lname),
			  'firstName'=>urlencode($fname),
			  'company'=>'singup_plugin',
			  'phone'=>urlencode($phone),
			  'uText'=>urlencode($uText),
			  'chValue'=>urlencode($chValue),
			  'type'=>'cr',
			  'isPluginUser'=>'Y',
			  'frmFld_lead_source'=>urlencode($src),
			  'frmFld_Current Provider'=>urlencode($provider),
			  'frmFld_Other Text'=>urlencode('Short Trial Form'),
			  'frmFld_MKS Package'=>urlencode('short trial'),
			  'frmFld_Bundle Choice'=>urlencode(''),
			  'frmFld_Monthly Volume'=>urlencode('0-500'),
			  'frmFld_CRM Tool'=>urlencode('None'),
			  'frmFld_Number of Sales Reps'=>urlencode('1 - 4'),
			  'frmFld_Topic of Interest'=>urlencode('Drip Marketing'),
			  'frmFld_Source'=>urlencode($source)
			);
	$returnval = wpmks_webforms_post_newuser($fields);
	//$arrayN();
	foreach ( $returnval as $key => $value) {
			$arrayN['key_value'] = $key;
			$arrayN['response'] = $value;
	}
	echo json_encode($arrayN);
	
	wp_die(); // this is required to terminate immediately and return a proper response
}
/*
* Ajax Call from admin page 
* Get MERGE Fields
*/

/*
* Actions for the plugin
*/
add_action('admin_menu','wpmks_webforms_menu');
add_action('admin_print_styles','wpmks_webforms_styles');
add_action('admin_enqueue_scripts','wpmks_webforms_scripts');
add_action( 'wp_ajax_basic_fields', 'basic_fields_callback' );
add_action( 'wp_ajax_merge_tags', 'merge_tags_callback' );
add_action( 'wp_ajax_webforms_list', 'webforms_list_callback' );
add_action( 'wp_ajax_webforms_createuser', 'create_user_callback' );
?>