<div class="wrap">
	<input type="hidden" id="userInfoExists" value="<?php echo $isUser_registered; ?>" />
	<div id="icon-options-general" class="icon32"></div>
	<h1><?php esc_attr_e( 'Makesbridge Form Builder', 'wp_admin_style' ); ?></h1>

	<div id="poststuff">

		<div id="post-body" class="metabox-holder columns-1">
			<!-- sidebar -->
			<div id="postbox-container-1" class="postbox-container">

				<div class="meta-box-sortables">
					<?php if(isset($wpmks_webforms_userinfo->{'bmsToken'}) && !empty($wpmks_webforms_userinfo->{'bmsToken'}) && $isUser_registered==true):  ?> 
					<div class="postbox">

						<div class="handlediv" title="Click to toggle"><br></div>
						<!-- Toggle -->

						<h2 class="hndle"><span><?php esc_attr_e(
									'User information', 'wp_admin_style'
								); ?></span></h2>

						<div class="inside">
							<form name="wpmks_username_form" method="post" action="">
											<input type="hidden" name="wpmks_webform_submitted" value="Y" />
											
											<p><label for="wpmks_webform_username">Username</label></p>
											<p><input type="text" id="wpmks_webform_username" name="wpmks_webform_username" value="<?php echo $wpmks_webform_username; ?>" placeholder="" /></p>
											<p><label for="wpmks_webform_password">Password</label></p>
											<p><input type="password" name="wpmks_webform_password" id="wpmks_webform_password" value="<?php echo $wpmks_webform_password; ?>" placeholder="" /></p>	
											<p><input class="button-primary" type="submit" name="wpmks_username_submit" value="Update" /></p>
										</form>
							</div>
						<!-- .inside -->

					</div>
					<!-- .postbox -->
				<?php endif; ?>
				</div>
				<!-- .meta-box-sortables -->

			</div>
			<!-- #postbox-container-1 .postbox-container -->
			<!-- main content -->
			<div id="post-body-content">

				<div class="meta-box-sortables ui-sortable">
					<!-- ========== Login Form ========== -->
						<?php if(!isset($wpmks_webforms_userinfo->{'bmsToken'}) && empty($wpmks_webforms_userinfo->{'bmsToken'}) && $isUser_registered==false): ?>
									<?php if(isset($wpmks_webforms_userinfo)){ ?>
											<?php if(empty($wpmks_webforms_userinfo->{'bmsToken'})) : ?>
												<div class="notice notice-error"><p> <?php echo $wpmks_webforms_userinfo->{'errorDetail'}; ?></p></div>
												<div class="notice notice-success" style="display:none;"><p></p></div>
											<?php endif; ?>


									<?php } ?>
					<div class="postbox">

						<div class="handlediv" title="Click to toggle"><br></div>
						<!-- Toggle -->

						<h2 class="hndle"><span>Please provide your bridgemail system login credentials</span>
						</h2>

						<div class="inside">
							<form method="POST" action="" name="wpmks_webform">
							<table class="form-table">
									<input type="hidden" name="wpmks_webform_submitted" value="Y" />
									<tr>
										<td><label for="wpmks_webform_username">Username</label></td>
										<td><input type="text" name="wpmks_webform_username" id="wpmks_webform_username" value="" placeholder="Enter your bridgemailsystem username" class="regular-text" /></td>
									</tr>
									<tr valign="top">
										<td scope="row">
											<label for="wpmks_webform_password">Password</label>
										</td>
										<td>
											<input type="password" name="wpmks_webform_password" id="wpmks_webform_password" value="" placeholder="Enter your bridgemailsystem password" class="regular-text" />
										</td>
									</tr>
								</table>
								<p>
									<input class="button-primary" type="submit" name="wpmks_webform_submit" value="<?php esc_attr_e( 'Login' ); ?>" />
									<input class="button-primary" type="button" id="signup-trial" name="wpmks_webform_submit" value="<?php esc_attr_e( 'New Signup' ); ?>" />
								</p>
							</form><!-- form -->
						</div>
						<!-- .inside -->

					</div>  
						 <!-- END OF JSON OBJ -->
					<!-- .postbox -->
					<div class="postbox" id="New-Signup-form" style="position:relative;display:none;">
						<div class="notice notice-error response-error" style="display:none;"><p> </p></div>
						<div class="handlediv" title="Click to toggle"><br></div>
						<!-- Toggle -->

						<h2 class="hndle"><span>Signup for Makesbridge</span>
						</h2>

						<div class="inside">
							<form method="POST" action="" id="signup_form" name="signup_form">
								<input type="hidden" id="admin-src-path" value="<?php echo get_site_url(); ?>" />
								<input type="hidden" name="formId" value="BzAEqwsFl20Ej21Tp30Xq33BdTMyio">
	                            <input type="hidden" name="pageId" value="">
	                              <input id="source" type="hidden" value="<?php echo $source; ?>" name="source">
	                              <input id="action" type="hidden" value="webforms_createuser" name="action">
							<table class="form-table">
									<input type="hidden" name="wpmks_webform_submitted" value="Y" />
									<tr>
										<td><label for="wpmks_webform_username">First Name <i>*</i></label></td>
										<td><input type="text" id="fname" name="fname" id="wpmks_webform_username" value="" placeholder="" class="regular-text" /></td>
									</tr>
									<tr>
										<td><label for="wpmks_webform_username">Last Name <i>*</i></label></td>
										<td><input type="text" id="lname" name="lname" id="wpmks_webform_username" value="" placeholder="" class="regular-text" /></td>
									</tr>
									<tr>
										<td><label for="wpmks_webform_username">Work Email <i>*</i></label></td>
										<td><input type="text" id="email" name="email" id="wpmks_webform_username" value="" placeholder="" class="regular-text" /></td>
									</tr>
									<tr>
										<td><label for="wpmks_webform_username">Phone Number <i>*</i></label></td>
										<td><input type="text" id="phone" name="phone" id="wpmks_webform_username" value="" placeholder="" class="regular-text" /></td>
									</tr>
									<tr>
										<td><label for="wpmks_webform_username">Password <i>*</i></label></td>
										<td><input type="password" name="pwd" id="pwd" value="" placeholder="" class="regular-text" /></td>
									</tr>
									<tr>
										<td><label for="wpmks_webform_username">Confirm Password <i>*</i></label></td>
										<td><input type="password" name="pwd2" id="pwd2" value="" placeholder="" class="regular-text" /></td>
									</tr>
									<tr>
										<td><label for="wpmks_webform_username">Security Code <i>*</i></label></td>
										<td><img border="1" src="//www.bridgemailsystem.com/pms/challenge?c=_DEFAULT" alt="" id="image"
                                                          style="margin-bottom:10px;"></div>
                                                        <div class="row">
                                                            <input type="text" id="uText" placeholder="" name="uText" value="" class="regular-text">
                                                            <input type="hidden" value="_DEFAULT" name="chValue" id="chValue">
                                                            <input type="hidden" id="pgsrc" name="src" value="mksignup">
                                                            <input type="checkbox" style="display:none;" value="qcWWk30Wh33qDF" id="26657d5ff9020d2abefe558796b99584" name="lists" checked="checked">
                                                           <span data-original-title="" data-container="body" data-placement="right" data-trigger="hover" data-toggle="popover" title="" id="uText_erroricon" class="erroricon popOver"></span>
                                                        </div> <!--  row  -->
                                                    </td>
									</tr>
								</table>
								<p>
									<input class="button-primary" type="button" id="signUpButtonTrial" name="wpmks_webform_submit" value="<?php esc_attr_e( 'Register' ); ?>" />
								</p>
							</form><!-- form -->
						</div>
						<!-- .inside -->

					</div>  
						 <!-- END OF JSON OBJ -->
					<!-- .postbox -->

					<!-- ========== End Login AND Signup Form========== -->
				<?php else: ?>

					
						<!-- ========== Web Form builder ========== -->
								
					<div class="postbox">
							
						<div class="handlediv" title="Click to toggle"><br></div>
						<!-- Toggle -->

						<h2 class="hndle"><span>Makesbridge Form Builder Panel</span>
						</h2>

						<div class="inside">
							
							<?php wpmks_webforms_builder($wpmks_webforms_userinfo); ?>
							
						</div>
						<!-- .inside -->

					</div>
					<!-- .postbox -->
				<?php endif; ?>

				<?php if($display_json == true) : ?>
						<!-- ==========Json Feed Form========== -->
							<div class="postbox">

									<h2 class="hndle"><span><?php esc_attr_e(
									'JSON Feeds', 'wp_admin_style'
								); ?></span></h2>
									<div class="inside">
										<?php echo $wpmks_webforms_userinfo->{'password'}; ?>
										<pre>
											<code>
												<?php var_dump($wpmks_webforms_userinfo); ?>
											</code>
										</pre>
									</div>
									<!-- .inside -->

								</div>

								<!-- .postbox -->
						<?php endif; ?>		
				</div>
				<!-- .meta-box-sortables .ui-sortable -->

			</div>
			<!-- post-body-content -->

			

		</div>
		<!-- #post-body .metabox-holder .columns-2 -->

		<br class="clear">
	</div>
	<!-- #poststuff -->

</div> <!-- .wrap -->
<style type="text/css">

.formoverlay .spinnerloading {
    animation: 0.6s linear 0s normal none infinite running rotation;
    border-color: rgba(0, 174, 239, 0.8) rgba(0, 174, 239, 0.15) rgba(0, 174, 239, 0.15);
    border-radius: 100%;
    border-style: solid;
    border-width: 3px;
    height: 60px;
    left: 50%;
    margin: -33px 0 0 -33px;
    position: absolute;
    top: 50%;
    width: 60px;
}
@keyframes rotation {
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(359deg);
}
}
@keyframes rotation {
0% {
    transform: rotate(0deg);
}
100% {
    transform: rotate(359deg);
}
}
.formoverlay {
    background: rgba(255, 255, 255, 0.9) none repeat scroll 0 0;
    border-radius: 2px;
    height: 98%;
    left: 0;
    position: absolute;
    top: 0;
    width: 98%;
    z-index: 999;
}
.formoverlay p {
    font-size: 16px;
    left: 0;
    margin-top: -30px;
    padding: 20px;
    position: absolute;
    text-align: center;
    top: 35%;
    width: 100%;
}
.has-error > input{
	border: 1px solid #D54E21;
}
</style>
