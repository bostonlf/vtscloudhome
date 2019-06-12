/*****************************************************************
consent_v18.js
Author: giuliana_enea@it.ibm.com
Updated: 2018 April 19 18:00 CET
*****************************************************************/

function consent_callTask(url, parameters, successFunc, failFunc) {
	var xhr = createXMLHTTP(failFunc);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4 && xhr.status == 200) {
			successFunc(xhr);
		}
	}
	xhr.open("GET", url+urlParameters(parameters), true);
	xhr.send(null);
}

function urlParameters(parameters) {
	var paramString = '';
	for (var key in parameters) {
		paramString += '&'+key+'='+parameters[key];
	}
	return paramString;
}

function createXMLHTTP(failFunc) {
 var xmlhttp = null;
 if(window.ActiveXObject) {
  try {xmlhttp=new ActiveXObject("Msxml2.XMLHTTP");}
  catch(e){try{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
  catch(e){}}
 } else if(window.XMLHttpRequest) {
  xmlhttp = new XMLHttpRequest();
  if(xmlhttp.overrideMimeType) {
   xmlhttp.overrideMimeType('text/xml');
  }
    xmlhttp.onerror = function(error) {
		if (failFunc==undefined)
			console.log("error: " + error);
		else
			failFunc(error);
    }
 } else {alert("Create XMLHttpRequest object false!");return false;} 
    return xmlhttp;
}

function consent_hide_overlay() {
  IBMCore.common.widget.overlay.hide('overlay-consent',true);
}

function consent_show_overlay(message) {
  ovc = jQuery('#overlay-consent-content');
  if (ovc.length>0) {
    ovc.html(message);
    jQuery('#overlay-consent-content h1').addClass('ibm-h1');
    jQuery('#overlay-consent-content h2:not([class])').addClass('ibm-h2');
  } else {
    myov = IBMCore.common.widget.overlay.createOverlay({
      id: 'overlay-consent',
      contentHtml: message,
      classes: 'ibm-common-overlay ibm-overlay-alt-three',
      type: 'alert'		
    });
    myov.init();
    jQuery('#overlay-consent-content h1').addClass('ibm-h1');
    jQuery('#overlay-consent-content h2:not([class])').addClass('ibm-h2');
    try {
      myov.show();
	} catch(e) {
      jQuery(document).ready(function() {
        myov.show();
        jQuery('#overlay-consent-content h1').addClass('ibm-h1');
        jQuery('#overlay-consent-content h2:not([class])').addClass('ibm-h2');
      });
    }
  }
}

function consent_show_spinner() {
  var message = '<p class="ibm-center"><span class="ibm-spinner ibm-h1 ibm-center"></span></p>';
  consent_show_overlay(message);
}