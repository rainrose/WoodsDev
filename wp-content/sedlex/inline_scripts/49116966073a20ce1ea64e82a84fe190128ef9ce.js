
/*====================================================*/
/* FILE /plugins/shorten-url/core/js/progressbar_admin.js*/
/*====================================================*/
/* =====================================================================================
*
*  Modify the progression
*
*/

function progressBar_modifyProgression(newPercentage,id) {
	id = typeof(id) != 'undefined' ? id : "progressbar";
	jQuery("#"+id+"_image").animate({width: newPercentage+'%'}, 500, function() {  });
}

/* =====================================================================================
*
*  Modify the text
*
*/

function progressBar_modifyText(newText, id) {
	id = typeof(id) != 'undefined' ? id : "progressbar";
	jQuery("#"+id+"_text").html(newText);
}


/*====================================================*/
/* FILE /plugins/shorten-url/core/js/parameters_admin.js*/
/*====================================================*/
/* =====================================================================================
*
*  Toggle folder
*
*/

function activateDeactivate_Params(param, toChange) {
	isChecked = jQuery("#"+param).is(':checked');
	for (i=0; i<toChange.length; i++) {
		if (!isChecked) {
			if (toChange[i].substring(0, 1)!="!") {
				jQuery("label[for='"+toChange[i]+"']").parents("tr").eq(0).hide() ; 
				jQuery("#"+toChange[i]).attr('disabled', 'disabled') ; 
				jQuery("#"+toChange[i]+"_workaround").attr('disabled', 'disabled') ; 
			} else {
				jQuery("label[for='"+toChange[i].substring(1)+"']").parents("tr").eq(0).show() ; 
				jQuery("#"+toChange[i].substring(1)).removeAttr('disabled') ;
				jQuery("#"+toChange[i].substring(1)+"_workaround").removeAttr('disabled') ;
			}
		} else {
			if (toChange[i].substring(0, 1)!="!") {
				jQuery("label[for='"+toChange[i]+"']").parents("tr").eq(0).show() ; 
				jQuery("#"+toChange[i]).removeAttr('disabled') ;
				jQuery("#"+toChange[i]+"_workaround").removeAttr('disabled') ;
			} else {
				jQuery("label[for='"+toChange[i].substring(1)+"']").parents("tr").eq(0).hide() ; 
				jQuery("#"+toChange[i].substring(1)).attr('disabled', 'disabled') ; 
				jQuery("#"+toChange[i].substring(1)+"_workaround").attr('disabled', 'disabled') ; 
			}
		}
	}
	return isChecked ; 
}

/* =====================================================================================
*
*  Remove param
*
*/

function del_param(param, md5, pluginID) {

	jQuery("#wait_"+md5).show();
		
	var arguments = {
		action: 'del_param', 
		pluginID: pluginID, 
		param : param
	} 
	
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		if (response=="ok") {
			document.location = document.location ; 
		}
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			remove_param(param) ; 
		} 
	});    
}

/* =====================================================================================
*
*  Add param
*
*/

function add_param(param, md5, pluginID) {

	jQuery("#wait_"+md5).show();
		
	var arguments = {
		action: 'add_param', 
		pluginID: pluginID, 
		param : param
	} 
	
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		if (response=="ok") {
			document.location = document.location ; 
		}
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			remove_param(param) ; 
		} 
	});    
}

/* =====================================================================================
*
*  Pour ajouter un media
*
*/

var paramMediaReturn = "" ; 

jQuery(document).ready(function() {
 
	window.send_to_editor = function(html) {
	    imgurl = jQuery('img',html).attr('src');
	    jQuery('#'+paramMediaReturn).val(imgurl);
	    tb_remove();
	}
 
});

/*====================================================*/
/* FILE /plugins/shorten-url/core/js/translation_admin.js*/
/*====================================================*/

/* =====================================================================================
*
*  Add a new translation
*
*/

function translate_add(plug_param,dom_param,is_framework) {
	if (is_framework!="false") {
		var num = jQuery("#new_translation_frame option:selected").val() ;
		jQuery("#wait_translation_add_frame").show();
	} else {
		var num = jQuery("#new_translation option:selected").val() ;
		jQuery("#wait_translation_add").show();
	}	
	var arguments = {
		action: 'translate_add', 
		idLink : num,
		isFramework : is_framework,
		plugin : plug_param, 
		domain : dom_param
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_translation_add").fadeOut();
		jQuery("#wait_translation_add_frame").fadeOut();
		jQuery("#zone_edit").html(response);
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			jQuery("#zone_edit").html("Error 500: The ajax request is retried");
			translate_add(plug_param,dom_param,is_framework) ; 
		} else {
			jQuery("#zone_edit").html("Error "+x.status+": No data retrieved");
		}
	});    
}

/* =====================================================================================
*
*  Save the new translation
*
*/

function translate_create(plug_param,dom_param,is_framework, lang_param, nombre) {

	jQuery("#wait_translation_create").show();
	
	var result = new Array() ; 
	for (var i=0 ; i<nombre ; i++) {
		result[i] = jQuery("#trad"+i).val()  ;
	}
	
	var arguments = {
		action: 'translate_create', 
		idLink : result,
		isFramework : is_framework,
		name : jQuery("#nameAuthor").val(), 
		email : jQuery("#emailAuthor").val(), 
		lang : lang_param, 
		plugin : plug_param, 
		domain : dom_param
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_translation_create").fadeOut();
		jQuery("#zone_edit").html("");
		jQuery("#summary_of_translations").html(response);
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			jQuery("#summary_of_translations").html("Error 500: The ajax request is retried");
			translate_create(plug_param,dom_param,is_framework, lang_param, nombre) ; 
		} else {
			jQuery("#summary_of_translations").html("Error "+x.status+": No data retrieved");
		}
	});   
}

/* =====================================================================================
*
*  Modify a translation
*
*/

function modify_trans(plug_param,dom_param,is_framework,lang_param) {
	jQuery("#wait_translation_create").show();
	
	var arguments = {
		action: 'translate_modify', 
		isFramework : is_framework,
		lang : lang_param, 
		plugin : plug_param, 
		domain : dom_param
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_translation_create").fadeOut();
		jQuery("#zone_edit").html(response);
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			jQuery("#zone_edit").html("Error 500: The ajax request is retried");
			modify_trans(plug_param,dom_param,is_framework,lang_param) ; 
		} else {
			jQuery("#zone_edit").html("Error "+x.status+": No data retrieved");
		}
	});    
}

/* =====================================================================================
*
*  Save the modification of the translation
*
*/

function translate_save_after_modification (plug_param,dom_param,is_framework,lang_param, nombre) {

	jQuery("#wait_translation_modify").show();
	
	var result = new Array() ; 
	for (var i=0 ; i<nombre ; i++) {
		result[i] = jQuery("#trad"+i).val()  ;
	}
		
	var arguments = {
		action: 'translate_create', 
		idLink : result,
		isFramework : is_framework,
		name : jQuery("#nameAuthor").val(), 
		email : jQuery("#emailAuthor").val(), 
		lang : lang_param, 
		plugin : plug_param, 
		domain : dom_param
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_translation_modify").fadeOut();
		jQuery("#zone_edit").html("");
		jQuery("#summary_of_translations").html(response);
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			jQuery("#summary_of_translations").html("Error 500: The ajax request is retried");
			translate_save_after_modification (plug_param,dom_param,is_framework,lang_param, nombre) ; 
		} else {
			jQuery("#summary_of_translations").html("Error "+x.status+": No data retrieved");
		}
	});    
}

/* =====================================================================================
*
*  Send the modified translation
*
*/

function send_trans(plug_param,dom_param, is_framework, lang_param) {

	jQuery("#wait_translation_modify").show();
	jQuery(".tobehiddenOnSent").hide();
		
	var arguments = {
		action: 'send_translation', 
		lang : lang_param, 
		isFramework : is_framework,
		plugin : plug_param, 
		domain : dom_param
	} 
	
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_translation_modify").fadeOut();
		jQuery("#zone_edit").html(response);
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			jQuery("#zone_edit").html("Error 500: The ajax request is retried");
			send_trans(plug_param,dom_param, is_framework, lang_param)  ; 
		} else {
			jQuery("#zone_edit").html("Error "+x.status+": No data retrieved");
		}
	});    
}


/*====================================================*/
/* FILE /plugins/shorten-url/core/js/feedback_admin.js*/
/*====================================================*/



/* =====================================================================================
*
*  Send the modified translation
*
*/

function send_feedback(plug_param, plug_ID) {
	jQuery("#wait_feedback").show();
	jQuery("#feedback_submit").remove() ;
		
	var arguments = {
		action: 'send_feedback', 
		name : jQuery("#feedback_name").val(), 
		mail : jQuery("#feedback_mail").val(), 
		comment : jQuery("#feedback_comment").val(), 
		plugin : plug_param,
		pluginID : plug_ID
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_feedback").fadeOut();
		jQuery("#form_feedback_info").html(response);
		window.location = String(window.location).replace(/\#.*$/, "") + "#top_feedback";
	}).error(function(x,e) { 
		if (x.status==0){
			//Offline
		} else if (x.status==500){
			jQuery("#form_feedback_info").html("Error 500: The ajax request is retried");
			send_feedback(plug_param, plug_ID) ; 
		} else {
			jQuery("#form_feedback_info").html("Error "+x.status+": No data retrieved");
		}
	});  
}

function modifyFormContact() {
	name = jQuery("#feedback_name").val() ; 
	mail = jQuery("#feedback_mail").val() ;
	var emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	
	if ((name.length!=0)&&(mail.length!=0)&&(mail.search(emailRegEx)!=-1)) {
		jQuery("#feedback_submit_button").removeAttr('disabled');
	} else {
		jQuery("#feedback_submit_button").attr('disabled', 'disabled') ; 	
	}
	
}

/*====================================================*/
/* FILE /plugins/shorten-url/js/js_admin.js*/
/*====================================================*/
/* =====================================================================================
*
*  Permet le reset d'une URL courte
*
*/

function resetLink (num) {
	jQuery("#wait"+num).show();
	jQuery("#lien"+num).html("Reset in progress...");
	//Supprime la ligne
	var arguments = {
		action: 'reset_link', 
		idLink : num
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait"+num).fadeOut();
		jQuery("#lien"+num).html(response);
	});    
}

/* =====================================================================================
*
*  Affiche le formulaire de changement de url force
*
*/

function forceLink (num) {
	var response = "<label for='shorturl"+num+"'>"+site+"/</label><input name='tag-name' id='shorturl"+num+"' value='' size='10' type='text'><input type='submit' name='' id='valid"+num+"' class='button-primary validButton' value='Update' onclick='validButtonF(this);' /><input type='submit' name='' id='cancel"+num+"' class='button cancelButton' value='Cancel' onclick='cancelButtonF(this);' />" ; 
	jQuery("#lien"+num).html(response);
}

/* =====================================================================================
*
*  Cancel du formulaire
*
*/

function cancelButtonF (element) {
	var num = element.getAttribute("id").replace("cancel","") ;
	jQuery("#wait"+num).show();
	
	var arguments = {
		action: 'cancel_link', 
		idLink : num
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait"+num).fadeOut();
		jQuery("#lien"+num).html(response);
	});    
}

/* =====================================================================================
*
*  Valid du formulaire
*
*/

function validButtonF (element) {
	var num = element.getAttribute("id").replace("valid","") ;
	jQuery("#wait"+num).show();
	var arguments = {
		action: 'valid_link', 
		idLink : num,
		link : document.getElementById("shorturl"+num).value
	} 
	
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait"+num).fadeOut();
		jQuery("#lien"+num).html(response);
	});    
}








/* =====================================================================================
*
*  Permet le reset d'une URL courte
*
*/

function resetLink_external (num) {
	jQuery("#wait_external"+num).show();
	jQuery("#lien_external"+num).html("Reset in progress...");
	var arguments = {
		action: 'reset_link_external', 
		idLink : num
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_external"+num).fadeOut();
		jQuery("#lien_external"+num).html(response);
	});    
}

/* =====================================================================================
*
*  Affiche le formulaire de changement de url force
*
*/

function forceLink_external (num) {
	var response = "<label for='shorturl_external"+num+"'>"+site+"/</label><input name='tag-name' id='shorturl_external"+num+"' value='' size='10' type='text'><input type='submit' name='' id='valid_external"+num+"' class='button-primary validButton' value='Update' onclick='validButtonF_external(\""+num+"\");' /><input type='submit' name='' id='cancel_external"+num+"' class='button cancelButton' value='Cancel' onclick='cancelButtonF_external(\""+num+"\");' />" ; 
	jQuery("#lien_external"+num).html(response);
}

/* =====================================================================================
*
*  Cancel du formulaire
*
*/

function cancelButtonF_external (num) {
	jQuery("#wait_external"+num).show();
	
	var arguments = {
		action: 'cancel_link_external', 
		idLink : num
	} 
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_external"+num).fadeOut();
		jQuery("#lien_external"+num).html(response);
	});    
}

/* =====================================================================================
*
*  Valid du formulaire
*
*/

function validButtonF_external (num) {
	jQuery("#wait_external"+num).show();
	var arguments = {
		action: 'valid_link_external', 
		idLink : num,
		link : document.getElementById("shorturl_external"+num).value
	} 
	
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_external"+num).fadeOut();
		jQuery("#lien_external"+num).html(response);
	});    
}

/* =====================================================================================
*
*  Delete an entry
*
*/

function deleteLink_external (num) {
	jQuery("#wait_external"+num).show();
	var arguments = {
		action: 'delete_link_external', 
		idLink : num
	} 
	
	//POST the data and append the results to the results div
	jQuery.post(ajaxurl, arguments, function(response) {
		jQuery("#wait_external"+num).fadeOut();
		jQuery("#lien_external"+num).html("Deleted");
		jQuery("#ligne"+num).fadeOut() ; 
	});    
}
