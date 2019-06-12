/*****************************************************************
xPlatform xwse.js
Author: lisacast@it.ibm.com
Updated: giuliana_enea@it.ibm.com 15 April 2018 31:20 CET
*****************************************************************/
/*String.prototype._xtrim = function() { return this.replace(/^\s+|\s+$/g, ''); } */
String.prototype._xtrim = function() { return this.replace(/^\s+|\s+$/g, ''); }
String.prototype._xtrimAll = function() { return this.replace(/\s/g, ''); }

var _xMenu= new Array();
var instantDelay = 500;
var _xtra = "IBMV18";
var _xfw = "jQuery";
var _xconfirm;

/*********************************************************************************
* Northstar
/*********************************************************************************/
function _xsetCards(widgetBox) {
	IBMCore.common.widget.masonry.init(jQuery(widgetBox));
}
/*********************************************************************************
* set RTF value
/*********************************************************************************/
function _xsetRTF(djtid){
	if(typeof dijit == "object")  {
		var editor = dijit.byId(djtid+"-Editor");
		textObj = dojo.byId(djtid)
		textObj.value = editor.attr("value");
	}
}
/////////////////////////////////////////////////////////////////////////////////WARNING: TO BE MIGRATED
/*********************************************************************************
*  _xempty(node)
/*********************************************************************************/
function _xempty(mynode) {
	//return dojo.empty(mynode);	
	return jQuery("#" + mynode).empty()
}
/********************************************************************************* 21/05/2015
*  _xgetParsedNode(nodeid)
*  function placeholder for dijit.byId
/*********************************************************************************/
function _xgetParsedNode(nodeid) {
	if(typeof dijit == "object") d= dijit.byId(nodeid);	
	else d = document.getElementById(nodeid);
	return d;
}
/*********************************************************************************
*  _xarrayIndexOf(array, string)
*  returns the array index of element = string  
/*********************************************************************************/
function _xarrayIndexOf(arr, str) {
	//return dojo.indexOf(arr, str);	
	return jQuery.inArray(str, arr);
}
///////////////////////////////////////////
/* ADDED TOI DOJO VERSION */
function _xaddClass(obid, classname) {
	jQuery("#"+obid).addClass(classname);
	
}
function _xremoveClass(obid, classname) {
	jQuery("#"+obid).removeClass(classname);
	
}
function _xsubscribe(evt,context,func) {
	jQuery(document).bind(evt,context,func);
}
function _xunsubscribe(evt) {
	jQuery(document).unbind(evt);
}
function _xpublish(evt) {
	jQuery(document).trigger(evt);
}
/* END */
//jQuery(document).ready(function(){
	//jQuery("[class*='ibm-common-overlay']").overlay();
//});

/*********************************************************************************
*  _xready replaces the dojo.ready method
/*********************************************************************************/
function _xready(func) {
	jQuery(document).ready(func);
}
/*********************************************************************************
*  _xrequire replaces the dojo.require method
/*********************************************************************************/
function _xrequire(dojoClass) {
	//return dojo.require (dojoClass);
	return;
}

/*********************************************************************************
*  _xhasClass replaces the dojo.hasClass method
/*********************************************************************************/
function _xhasClass(objid, classname) {
	return jQuery("#" + objid).hasClass(classname);
	//dojo.hasClass(dojo.byId('xForm'),'ibm-styled-form')
}

/*********************************************************************************
*  _xmaximizeEditor
/*********************************************************************************/
function _xmaximizeEditor() {
    _xconnect(toolbar+"-showhide", "onclick", function(){
    			jQuery("secondcolumn-2").toggleClass("ibm-col-6-4");
    			jQuery("secondcolumn-2").toggleClass("ibm-col-1-1");
    			jQuery("firstcolumn-1").toggleClass("hidden"); 
            	if (this.iconClass == "dijitSliderDecrementIconH") {
            		this.set("iconClass", "dijitSliderIncrementIconH");
            		}
            	else
            		{this.set("iconClass", "dijitSliderDecrementIconH");}
            		resizeEditor();
            		jQuery("#"+toolbar).css("width",jQuery("_xeditor"+toolbar).css("width")+"px"); 
            });
}
/*********************************************************************************
* instantSearch connecting
/*********************************************************************************/
_xready(function(){
	/* dojo.subscribe('/ibmweb/form/initialized', null,function(){ */
	 	var xinstantFields = jQuery("*[data-x-props*='instantSearch']");
	 	//console.log(xinstantFields);
	 	xinstantFields.each(function(item){
	         //console.log(item,item.id, typeof item);
	         _xconnect(this, "keyup", this, function(evt){ _xinstantSearch(this.id);})
	     });
	 /* }); */
	});
/*********************************************************************************
* function set Cookie
/*********************************************************************************/
_xsetCookie = function(cknam,ckval,args0) {
	if (arguments.length >= 2) {
	    jQuery.cookie(cknam, ckval, args0);
	    return jQuery.cookie(cknam);
	}
	else return undefined;
};
/*********************************************************************************
* function get Cookie
/*********************************************************************************/
_xgetCookie = function(cknam) {
	if (arguments.length > 0) return jQuery.cookie(cknam);
	else return undefined;
};
/*********************************************************************************
* function delete Cookie
/*********************************************************************************/
_xdeleteCookie = function(cknam) {
	if (cknam != undefined) {
		jQuery.cookie(cknam, "", {expires: -1});
		return true
	}
	else return false;
     
};
/*********************************************************************************
* function log
/*********************************************************************************/
function log() {
    if (typeof console == 'undefined') {
        return;
    }
    console.log(arguments);
}
/*********************************************************************************
* function style
/*********************************************************************************/
function _xstyle(did,styleName, styleValue) {
	ret = true;
	//console.log("INSIDE",did, typeof did, typeof dojo.byId(did),dojo.byId(did));
	switch(typeof did){
	case "string":
		if (did != "" && jQuery("#" + did) != null) jQuery("#" + did).css(styleName,styleValue);
		else ret=false;
		break;
	case "object":
		if (did != null) jQuery("#" + did).css(styleName,styleValue);
		else ret=false;
		break;
	default:
		ret=false;
	} 
	if(!ret) log("Setting style error: warning the referenced object: "+did+" is null.");
    return;
}
/*********************************************************************************
* function _xquery returns the dojo.query array
/*********************************************************************************/
function _xquery(criterias){
	var retArray = new Array;
	retArray = jQuery(criterias);
	return retArray;
	
}
/*********************************************************************************
* function _forEach returns the dojo.query array
/*********************************************************************************/
function _xforEach(arrayOfItems, func){
	return jQuery.each(arrayOfItems, func);
	
}
/*********************************************************************************
* function _xvalidateTrim: trim all fields in profile.trim 
/*********************************************************************************/
function _xvalidateTrim() {
	var res = [];
	for(i=0; i < this.length; i++) {
		elem = document.getElementsByName(this[i])[0];
		if(elem != undefined) v = _xgetValue(this[i]);
		if (v != "") _xsetValue(this[i], v.replace(/^\s+|\s+$/g, ''));
	}
	return true;
	
}
/*********************************************************************************
* function getJSON(string): given a string with single quotes returns the correct JSON 
* 					format replacing the single with double quotes
/*********************************************************************************/
function _xgetJSON(xprops) {
	if (xprops[0] == "{") xprops = xprops.substr(1);
	if (xprops[xprops.length] == "}") xprops = xprops.substr(0,xprops.length-1);
	pArr = xprops.split(":");
				for(k=0; k < pArr.length; k=k+2) {
					pArr[k] = pArr[k].replace(/\'/g,"\"");
				}
				for(k=1; k < pArr.length; k=k+2) {
	s = pArr[k]._xtrimAll().split("','");
					s[0] = s[0].replace(/\'/,"\"");
					s[1] = s[1].replace(/\'$/,"\"");
	pArr[k] = s.join('","');
				}
	xprops = pArr.join(":");
	return "{" +xprops +" }";
	}
/*********************************************************************************
* function _xvalidateConstraints: validate all fields in profile.constraints 
/*********************************************************************************/
//to do: manage custom languages
//this = constraints:{"phone":_xvalidate,"email":_xvalidate,"code":_xvalidate,
//this["constraintKeys"]="phone","email",...
//var profile = {trim:["name","code"],required: required,dependencies: {"city":"address"},constraints:{"phone":_xvalidate,"email":_xvalidate,"code":_xvalidate,"x_role":[mycheck,{"message":"please fill at least one of those 2 fields: email or phone"}]}};
function _xvalidateConstraints() {
	var res = false;
	var invalidFields = [];
	for (var field in this) {
		elem = document.getElementsByName(field)[0];
		funcName = eval("this." + field);
		if (typeof funcName[0] == "function") f = funcName[0];
		else if (typeof funcName == "function") f = funcName;
	//	if (typeof funcName == "string") fname = funcName;
		if(elem != undefined && f != undefined) {
			newfunc = jQuery.proxy(f,elem);
			res = newfunc();
			if(!res) invalidFields.push(elem);
		}
	}
	return invalidFields;
	
}
/*********************************************************************************
* function xvalidate()  validate all fields in profile.constraints using the
* 						function defined in profile.constraints["contraintKeys"]
/*********************************************************************************/
function _xvalidate(){
		var inputString = _xgetValue(this.id);
		if(inputString._xtrimAll() != "") {
			xprops =  jQuery("#"+this.id).attr("data-dojo-props");
			//jstr = _xgetJSON(xprops);
			//var jsonObj = jQuery.parseJSON(jstr.replace(/\'/g,"\\\\'"));
			var jsonObj = eval("({" + xprops + "})");
			regExp = jsonObj.regExp;
	        if (regExp != undefined) {
	                var re = new RegExp(regExp);
	                res = inputString.match(re);
	                if(res != null) return true;
	                else return false;
	            }
		}
	return true;
}
/*********************************************************************************
* function _xvalidateDependencies
* If you fill the address field then the field city IS mandatory
* dependencies: {"city":"address"}
/*********************************************************************************/
//to do: manage custom languages
//this = constraints:{"phone":_xvalidate,"email":_xvalidate,"code":_xvalidate,
//this["constraintKeys"]="phone","email",...
//var profile = {trim:["name","code"],required: required,dependencies: {"city":"address"},constraints:{"phone":_xvalidate,"email":_xvalidate,"code":_xvalidate,"x_role":[mycheck,{"message":"please fill at least one of those 2 fields: email or phone"}]}};
function _xvalidateDependencies() {
	var res = false;
	var dependencyFields = [];
	for (var field in this) {
		elem = document.getElementsByName(field)[0]; 
		keyfieldname = eval("this." + field);		
		if(_xgetValue(keyfieldname) != "") {
			if(_xgetValue(field) != "") res = true;
			else res = false;
			if(!res) dependencyFields.push(elem);
		}
		
		}
	return dependencyFields;
	
}
/***********************************************************************************/
/* If item.checkField is a valid expression then the item.required must be filled  */
/* changed to: if item.required is filled then item.checkfield must be validated    */
/***********************************************************************************/
function _xvalidateConditioned(){
			var results = new Array();
			jQuery.each(this, function(index,item){
	             if (_xgetValue(item.required)._xtrim() !="" ) {
	            	 var checkField = item.checkField;
		             var checkValue = _xgetValue(checkField)._xtrim();
		             if (checkValue == "") { results.push(document.getElementsByName(item.checkField)[0]);}
		             else {
		            	 if (item.regExp != null) {
		            		 var re = new RegExp(item.regExp);
				             res = checkValue.match(re);
				             if (res == null) {
				                	 results.push(document.getElementsByName(item.checkField)[0]);
				             }
		            	 }
		             }
	             }
         });
     return results;
}


/*********************************************************************************
* function xcheckForm(frm)
/*********************************************************************************/
function _xcheckForm() {
	var s = "";
	
	if (arguments.length == 0) { alert('The form to check has not been specified'); return;}
	var frm = arguments[0];
	profileLoc =  (arguments.length >= 2) ? arguments[1] : profile;
	var s1 = (arguments.length >= 3) ? arguments[2] : 'The following fields are missing:' + '\n';
	var s2 = (arguments.length >= 4) ? arguments[3] : 'This field is not valid: ';
	var s3 = (arguments.length >= 5) ? arguments[4] : 'The following fields are missing or not valid:'+ '\n';
	var s4 = (arguments.length >= 6) ? arguments[5] : 'The form to check does not exist.' + '\n';
	
	var missing = new Array;
	var missingFields = new Array;
	var invalidList = new Array();
	var condResults = new Array();
	var isMissing;
	if (typeof frm == "object") {
		if (document.getElementById(frm.id) == null) { alert(s4); return;}
	}
	 else {
		 if (document.getElementById(frm) == null) { alert(s4); return;}
	 } 
	
	if(typeof profileLoc == "object") {
/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' CONSTRAINTS VALIDATION */
		
		if(typeof profileLoc.constraints != "undefined") {
		//	profile.constraints["constraintKeys"] = new Array;
		//	for (var ckey in profile.constraints){ if (ckey != "constraintKeys") profile.constraints["constraintKeys"].push(ckey);}
			
			 boundConstraints = jQuery.proxy(_xvalidateConstraints, profileLoc.constraints);
			 invalidList = boundConstraints();
			 
		}
/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' DEPENDENCIES VALIDATION */
		var dependencyFields = [];
		if(typeof profileLoc.dependencies != "undefined") {
			
			 boundDependencies = jQuery.proxy(_xvalidateDependencies, profileLoc.dependencies);
			 dependencyFields = boundDependencies();
			 
		}
				
		/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' MISSING VALIDATION */		
		
		    if(typeof profileLoc.required != "undefined") {
		    	var fields = profileLoc.required;
		    	for(k=0; k < fields.length; k++ )
		    	{   var elem = fields[k];
		    		var DOMelem = document.getElementsByName(elem);
		            isMissing = true;
		    			 for(var i = 0; i < DOMelem.length; i++){
		    		            var DOMelem_i = DOMelem[i];
		    		            switch(DOMelem_i.type) {
		    		            	    		            		
		    		            	case("radio"):
		    		            		if (DOMelem_i.checked) isMissing= false;
		    		            		break;
		    		            	case("checkbox"):
		    		            		if (DOMelem_i.checked) isMissing= false;
		    		            		break;
		    		            	default:
		    		            		v = DOMelem_i.value;
		    		            		if (v != undefined )
		    		            		if (v._xtrim() != "") isMissing= false;
		    		            /* For these kinds of fields the validation is delegated to dojo */
		    		            }
		    		        }
		    			//console.log(DOMelem, "is missing?", isMissing);
		    			 if (isMissing) {
		    				missingFields.push(DOMelem[0]);
		    			}
		    				
		    		
		    	};
		    }
		     
		    missing = missingFields.concat(dependencyFields);
		    
/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' CONDITIONED VALIDATION */		
		    
		    if (profileLoc.conditioned != undefined) {
			    var boundFunction = jQuery.proxy(_xvalidateConditioned, profileLoc.conditioned);
		        condResults = boundFunction();
		    }

/******* End additional check ******************************************************/		    
		    if(missing.length == 0 && condResults.length == 0 && invalidList.length == 0){
		    	return true;
			} 
		    else {
						
						if(missing.length != 0){
							s += '\n'+ s1;
							jQuery.each(missing, function(index,field){
								var labels =  jQuery("label[for='"+ field.name +"']");
								if(labels[0] == undefined) label = field.name;
								else label = labels[0].innerHTML.substr(0,labels[0].innerHTML.indexOf(":")) ;
								s +=  '- ' + label  +'\n';
							});
						}
						if(invalidList.length != 0){
							
							jQuery.each(invalidList, function(index,field){
								var labels =   jQuery("label[for='"+ field.name +"']");
								if(labels[0] == undefined) label = field.name;
								else label = labels[0].innerHTML.substr(0,labels[0].innerHTML.indexOf(":")) ;
								if (profileLoc.constraints[field.name][1] != undefined ) s += '\n'+profileLoc.constraints[field.name][1].message + '\n';
								else s +='\n'+ s2 + " " + label + '\n';
								
							});
							
						}
						
						if(condResults.length != 0 ){
							s += '\n'+ s3;
							jQuery.each(condResults, function(index,field){
								
								var labels =   jQuery("label[for='"+ field.name +"']");
								if(labels[0] == undefined) label = field.name;
								else label = labels[0].innerHTML.substr(0,labels[0].innerHTML.indexOf(":")) ;
								
								s +=  '- ' + label  +'\n';
							});
							
						
						}
				
/* '''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''' TRIM OPERATION */	
						if (profileLoc.trim != undefined) {
						    boundTrim = jQuery.proxy(_xvalidateTrim, profileLoc.trim);
						    boundTrim();
					    }	
						

				
				alert(s);
		        return false;
		    }
			}
    return true;
}
///////////////////////////////////////////////
/*********************************************************************************/
/* function _xparseNode(nodeId) */
/*********************************************************************************/  	  		
  	  		function _xparseNode(){
  	  		if(typeof dojo != "undefined") 
  	  		  if(arguments.length == 0) dojo.parser.parse();
  	  		  else {
  	  			  nodeId = arguments[0];
  	  			  if (typeof dijit.byId(arguments[0]) == 'object') return; 
  	  			  else dojo.parser.parse(dojo.byId(nodeId).parentNode);
  	  		  		}  
  	  		         
  	  		}
  	  		
  	  	
/*********************************************************************************
* function _xdestroyNodes(nodetype,fromnodeid)
* destroy nodes type <nodetype> from parent node id <fromnodeid>
*********************************************************************************/ 	  		
  	  	function _xdestroyNodes(nodetype,fromnodeid)  {
  	      jQuery(nodetype,fromnodeid).each(function(opt){
  	        //  console.log(opt);
  	          opt.remove();
  	    });
  	   }  
 /*********************************************************************************
* function _xdestroyNodes(nodetype,fromnodeid)
* destroy nodes type <nodetype> from parent node id <fromnodeid>
*********************************************************************************/ 	  		
	  	function _xdestroy(nodeid)  {
	     // console.log("destroy");
	  		jQuery("#" +nodeid).remove();
	   }    	  	
 /*********************************************************************************
 * function __xparseDate(tmp, outdateFormat)
 * destroy existing dijits if existing included into tmp Array of ids 
 * create date time boxes dijits for each one of the ids included in tmp
 * formatting the dates according to the element labels or, if labels do not exist, according to the param outdateFormat
 * Example:  var tmp=dojo.query(".ibm-date-picker",  dojo.byId('boxDisplayContent'));
                    if(tmp.length>0){_xparseDate(tmp,"[?userDateFormat]")};
 *******************************************************************************/ 	  		  	  	
  	  function _xparseDate(tmp, outdateFormat) {
  		if(typeof dijit == "object")  {
	  		if (tmp.length >0) {
	  		 _xforEach(tmp,function(i,elem) {
	              w = dijit.byId(elem.id);
	              if (typeof w == 'object'){
	                  w.destroyRecursive(true);
	              }
	      });
	  		for(k=0; k< tmp.length; k++) {var elem=tmp[k];var _27d={srcNodeRef:elem,disabled:elem.disabled,name:elem.name,id:elem.id,style:"width: 196px"};
			 dateFormat = (elem.getAttribute('data-format')==null)?outdateFormat:elem.getAttribute('data-format');
			_27d.constraints={datePattern:dateFormat};
			_27d.serialize=function(_27e){return dojo.date.locale.format(_27e,{datePattern:"yyyy-MM-dd",selector:"date"});};
			if(elem.value){
	         var val=elem.value,_27f=Date.parseString(val);
			    if(!isNaN(_27f) && _27f instanceof Date)
	             {val=dojo.date.locale.format(_27f,{datePattern:dateFormat,selector:"date"});}
			        _27d.value=dojo.date.locale.parse(val,{datePattern:dateFormat,selector:"date"});}
			
	             var dtb=new dijit.form.DateTextBox(_27d);};
	 		} 
  		}
     }
  	function _xparseAllDates() {
  		if(typeof dijit == "object")  {
  		
  		var tmp=dojo.query(".ibm-date-picker");  		
  		if (arguments.length == 0) outdateFormat="yyyy-MM-dd";
  		else outdateFormat= arguments[0];
  		
  		if (tmp.length >0) {
		  
	      tmp.forEach(function(elem) {
	          w = dijit.byId(elem.id);
	         // console.log("w",w,typeof w);
	          if (typeof w == 'object'){
	              w.destroyRecursive(true);
	          }
      	});
	      
    for(k=0; k< tmp.length; k++) {var elem=tmp[k];var _27d={srcNodeRef:elem,disabled:elem.disabled,name:elem.name,id:elem.id,style:"width: 196px"};
		 dateFormat = (elem.getAttribute('data-format')==null)?outdateFormat:elem.getAttribute('data-format');
		_27d.constraints={datePattern:dateFormat};
		_27d.serialize=function(_27e){return dojo.date.locale.format(_27e,{datePattern:"yyyy-MM-dd",selector:"date"});};
		if(elem.value){
          var val=elem.value,_27f=Date.parseString(val);
		    if(!isNaN(_27f) && _27f instanceof Date)
              {val=dojo.date.locale.format(_27f,{datePattern:dateFormat,selector:"date"});}
		        _27d.value=dojo.date.locale.parse(val,{datePattern:dateFormat,selector:"date"});}
		
              var dtb=new dijit.form.DateTextBox(_27d);};
  		}         
      }
  	} 
  	  

/**********************************************************************/
/* _xsetValue DRAFT									                  */
/**********************************************************************/
function _xsetValue( did, newval ){
			var obj = 	jQuery("#" + did);
			if (obj != null) obj.val(newval);
}
/**********************************************************************/
/* IBMV17 workaround for attaching events to dijits                   */
/**********************************************************************/
function _xconnectDelayedDijit( did, evdijit,  func ){
	var ret = false;
	if (did != "" ) {
		
				_xsubscribe('/ibmweb/form/initialized', null,function(){
					ret = _xconnect(did, evdijit ,null,func);
				});
				/*
				dojo.subscribe('/ibmweb/form/initialized', null,function(){
					ret = _xconnect(did, evdijit ,null,func);
				});
				*/
			}
		else {
			log("_xconnect");
			ret= _xconnect(did, evdijit ,null,func);
			}
	log("ret",ret);
	return ret;
}
/**********************************************************************/
/* _xconnect     									                  */
/**********************************************************************/
function _xconnect() {
	var handle = {"id":"", "event":""};
	var did = arguments[0];
	var evt = arguments[1];
	evt = evt.toLowerCase();
	if (evt.substr(0,2) == "on") evt = evt.substr(2);
	if (arguments.length == 3) {
		var func = arguments[2];
		var context = null;
	}
	else if (arguments.length == 4) {
		var context = arguments[2];
		var func = arguments[3];
	}
	if (did != "")
		switch(typeof did) {
		case ("string"):
			
					el = jQuery("#" +did);
					if (el != null) {
						
						jQuery("#" + did).bind(evt, context,func);
						handle = {"id": did, "event":evt};
					}
			break;
		case ("object"):
				var elId = did.id;
				jQuery("#" + elId).bind(evt, context,func);
				handle = {"id": elId, "event":evt}
				
			break;
		default:
			
		}
	return handle;
}

/**********************************************************************/
/* _xdisconnect     									               */
/**********************************************************************/
function _xdisconnect(handle) {
	//if handle is a string disconnect all events from the element with id=handle
	//if handle is a json structure then unbinds the event from the element 
	if(typeof handle == "string") jQuery( "#" + handle).unbind(); 
	else jQuery( "#" + handle.id).unbind( handle.event ); 
	return;
	
}
/**********************************************************************/
/* _xgetAttribute 								                      */
/**********************************************************************/
function _xgetAttr(){
	attrValue = null;
	if (arguments.length >= 2) {
		var nodeid = arguments[0];
		var attrname = arguments[1];
		if (nodeid != '') {
					var xnode = jQuery("#"+nodeid);
					attrValue = xnode.attr(attrname);
			}
	}
	return attrValue;
}
/**********************************************************************/
/* _xsetAttribute 								                      */
/**********************************************************************/
function _xsetAttr(){
	attrValue = null;
	if (arguments.length >= 3) {
		var nodeid = arguments[0];
		var attrname = arguments[1];
		var attrval = arguments[2];
		if (nodeid != '') {
					var xnode = jQuery("#"+nodeid);
					attrValue = xnode.attr(attrname,attrval);
			}
	}
	return attrValue;
}
/**********************************************************************/
/* _xgetElement 								                          */
/**********************************************************************/
function _xgetElement(id, opt){
	if (opt == undefined) opt = 'first'
	var o = jQuery("#" + id);
	if (opt == 'first')
		if (o.length > 0)
			o = o[0];
	return o;
}
/**********************************************************************/
/* _xgetValue 								                          */
/**********************************************************************/
function _xgetValue(){
	var idVal = arguments[0];
    var d = false
	var val = "";
	var sep  = "";
	if (arguments[1] != undefined) sep = arguments[1];
	else sep="";
	if (typeof dijit == "object") {
	    var obj = dijit.byId(idVal);
	    if (obj != undefined) {val = obj.attr('value');d = true;}
            
	}
	if(!d)
		{	
			var DOMelem = document.getElementsByName(idVal);
			
			for(var i=0; i < DOMelem.length;i++){
				//console.log("type=", DOMelem[i].type);
				switch(DOMelem[i].type){
					case ("text"):
						val = DOMelem[i].value ;
						return val;
						break;
					case ("email"):
						val = DOMelem[i].value ;
						return val;
						break;						
					case ("hidden"):
						val = DOMelem[i].value + sep;
						
						break;
					case ("radio"):
						
						if(DOMelem[i].checked){ 
							val += DOMelem[i].value;
							return val;
						}
						break;	
					case ("checkbox"):
						if(DOMelem[i].checked){ 
							val += DOMelem[i].value + sep;
							
						}
						break;
					case ("textarea"):
						val = DOMelem[i].value;
						return val;
						break;
					case ("select"):
						if(DOMelem[i].selected){ 
							val += DOMelem[i].value + sep;
							
						}
						break;	
					case ("select-one"):
						val += DOMelem[i].options[DOMelem[i].selectedIndex].value + sep;
						return val; 
					break;	
					case ("select-multiple"):
						var j;
						for (j=0; j < DOMelem[i].options.length; j++) {
					    if (DOMelem[i].options[j].selected) {
					      val += DOMelem[i].options[j].value + sep;
					    }
					  }
					break;	
					
				}
			}
		}
	if (sep == arguments[1]) {val = val.substring(0,val.length-1);}
	return val;
}
/**********************************************************************/
/* Toggle system checkboxes in collections                            */
/**********************************************************************/
function _xtoggleChecked(mycoll){
    var cbArray = jQuery("input[type='checkbox'][id*='x_docPath'][id*='"+ mycoll +"']");
    jQuery.each(cbArray ,function(key,item){
        item.checked= !item.checked;                
    })
 }
/**********************************************************************/
/* Check if at least one item was checked in collections              */
/**********************************************************************/
		 function _xselectedItem(mycoll){
		     var cbArray = jQuery("input[type='checkbox'][id*='x_docPath'][id*='"+ mycoll +"']:checked");

		     if ( cbArray.length == 0) return false;
		     else return true;
		 }	
 /**********************************************************************/
 /* Return the number of selected items in collections                 */
 /**********************************************************************/
	 function _xselectedItemNumber(mycoll){
	     var cbArray = jQuery("input[type='checkbox'][id*='x_docPath'][id*='"+ mycoll +"']:checked");
	    return cbArray.length;
	 }	
/**********************************************************************/
/* Return the array of selected items in collections                 */
/**********************************************************************/
	 function _xselectedItemArray(mycoll){
	     var cbArray = jQuery("input[type='checkbox'][id*='x_docPath'][id*='"+ mycoll +"']:checked");
	    return cbArray;
	 }	 
/***********************************************************************/
/* Check if at least one ATTACHED FILE item was checked in collections */
/***********************************************************************/
	 function _xselectedFileItem(mycoll){
	     var cbArray = jQuery("input[type='checkbox'][id*='x_fileIdPath'][id*='FileItem']:checked");

	     if ( cbArray.length == 0) return false;
	     else return true;
	 }		 		 
		 
///////////////////////////////////////////////
function _xshowHide(objId) {
	var e=document.getElementById('error');
	e.style.display=(e.style.display=='none'?'':'none');
	return false;
	
}

function _xWSESetBusyForAWhile(){
	this.disabled=!this.disabled;	
	oid=this.id;	
	stm="document.getElementById('"+oid+"').disabled=!document.getElementById('"+oid+"').disabled";
	setTimeout(stm,5000);	
		}
/**********************************************************************/
/* Get true or false on typeof obj                                    */
/**********************************************************************/
function _xWSEisIt (obj, what) {	
			return typeof obj==what  ? true : false;
				}
/**********************************************************************/
/* Dijit  Dialogs                               					 */
 /*********************************************************************/
function _xshowDialog (dialogId,title,href,w,h){
	if (dialogId == undefined || dialogId=="") dialogId ="_xWSEdialog"
	w = w || "390";
	h = h || "400";	
	if (typeof _xgetElement(dialogId) == 'object') {
		var d = jQuery("#"+dialogId);
		d.css('height', h+"px");
		d.css('width', w+"px");
		d.css('overflow', "auto");
	if (href != undefined && href!="") d.attr("href", href);
	if (title != undefined && title!="") d.attr("title", title);
	d.show();
	}
	return false;
}
/**********************************************************************/
/* xWSE Confirm                               					 */
 /*********************************************************************/
function _xshowConfirm (msg){
	_xconfirm = confirm(msg);
	return _xconfirm;
}

/**********************************************************************/
/* JQuery  Dialogs              					                  */
 /*********************************************************************/
function _xshowModal(d,obj){
	//ibmweb.overlay.show(dialogId,obj);
	//IBMCore.common.widget.overlay.show(dialogId);
	jQuery("#ibm-overlaywidget-" + d).data("widget").show();
	setTimeout(function(){ jQuery("#ibm-overlaywidget-" +d)[0].style.top=100; }, 300);
	return false;
	
}
function _xhideModal(dialogId){
	//ibmweb.overlay.show(dialogId,obj);
	//IBMCore.common.widget.overlay.show(dialogId);
	jQuery("#ibm-overlaywidget-" + dialogId).data("widget").hide();
	return false;
	
}
/***********************************************************************/
/* xWSE Popup              					                           */
/***********************************************************************/
function _xopenPopup(href,name,argsO){	
	argsO['location']=argsO['location']||"no";
	if (argsO['toolbar'] == '') argsO['toolbar']='no';
	argsO['menubar']=argsO['menubar']||'no';
	argsO['scrollbars']=argsO['scrollbars']||'auto';
	argsO['top']=argsO['top']||'30';
	argsO['left']=argsO['left']||'20';
	argsO['screenX']=argsO['screenX']||'30';
	argsO['screenY']=argsO['screenY']||'20';
	argsO['fullscreen']=argsO['fullscreen']||'no';
	argsO['width']=argsO['width']||'390';
	argsO['height']=argsO['height']||'400';
	argsO['resizable']=argsO['resizable']||'yes';
	argsO['status']=argsO['status']||'no';
	argsO['directories']=argsO['directories']||'no';
	var winOptions = "'"
	for (prop in argsO){
		winOptions=winOptions + prop +"="+ argsO[prop] +",";		
	}
	winOptions = winOptions.substr(0,winOptions.length -1) +"'";
	_xwin=window.open(href,name,winOptions);
	return !_xwin;	
}

/**********************************************************************/
/* strrpos changes the return value of the lastIndexOf js function    */
/**********************************************************************/
function strrpos(haystack, needle, offset) {
			var i = (haystack+'').lastIndexOf( needle, offset );
			return i >= 0 ? i : false;
				}
/**********************************************************************/
/* fileClean(obj)removes / and \ from obj.value                       */
/**********************************************************************/
 function fileClean(obj) {
		var file = obj.value;
		var length = file.length;
		var slash = strrpos(file, '/');
		var backslash = strrpos(file, '\\');
		if (slash) {
				file = file.substring(slash + 1, length);
				} else if (backslash) {
					file = file.substring( backslash + 1, length);
					}
		return file;
	}
function _xbindMenu(menu,nodeid){
			_xMenu[menu].bindDomNode(jQuery("#" +nodeid));
		};
function _xunbindMenu(menu,nodeid){
			_xMenu[menu].unbindDomNode(jQuery("#" +nodeid));
		};
/**********************************************************************/
/*_xbindNodes() binds node to contextual menus (used by transformers)  */
/**********************************************************************/
		function _xbindNodes(menu){
					/*
						dojo.forEach(_xmenuNodes, function(item){
							_xMenu[item.menu].bindDomNode(dojo.byId(item.node));
						});
					*/
					  _xmenuNewNodes = jQuery("*[data-x-menu='" + menu +"']");
					  _xmenuNewNodes.each(function(item){
			    			menuObj = _xMenu[_xgetAttr(this.id,'data-x-menu')];
			    			if (menuObj != undefined) {
			    				_xMenu[menu].bindDomNode(this);
			    			} 
							
						});
					}			

/******************************************************************************************* get last line for a multiple line input text */
	function _xgetLastLine(nodeid) {
		var ret="";
		var currValue = _xgetValue(nodeid);
		var currValueLines = currValue.split("\n");
		if (currValueLines.length > 0) ret = currValueLines[currValueLines.length-1];
		return ret ;
		
	}
/******************************************************************************************* INSTANT SEARCH COLLATERAL */
function _xcheckInstant(nodeid){
    var ret= false;
    var xprops = _xgetAttr(nodeid ,'data-x-props'); 
    if (xprops != null) {
        xprops = xprops.replace(/'/g,'"');
        var jObj = jQuery.parseJSON(xprops); 
        instantObj =  jObj.instantSearch;
        if (instantObj != undefined ) {
        	if(instantObj.multiline == true) instantObj.searchString = _xgetLastLine(nodeid);
        	else instantObj.searchString = _xgetValue(nodeid);
            instantObj.qs = "";
            instantObj.searchString = instantObj.searchString.replace('?','_');
            instantObj.searchString = instantObj.searchString.replace('*','%');
            instantObj.searchString = encodeURIComponent(instantObj.searchString);/*console.log("encoded instantObj.searchString", instantObj.searchString); */
            if (instantObj.searchString != '' && (instantObj.searchString.length >= instantObj.nchar)) {
            /* dojo.style(instantObj.sourceid, "background","url('/xwse/images/indicator.gif') right center no-repeat"); */
            	_xaddClass(instantObj.sourceid, "indicator");
            	if(instantObj.params != undefined) 
            		for (key in instantObj.params){if (typeof instantObj.params[key] == "string" ) instantObj.qs += "&" + key +"="+ _xgetValue(instantObj.params[key]) };
            //console.log(instantObj);
            //Defining the X resource type
            if (instantObj.searchWidget != null) instantObj.xresource = 'widget';
            else instantObj.xresource = 'service';
            self.instantObj =instantObj;
            
            ret = true;
             }
            }
    }
     return ret;
}
function _xresetInstant(instantObj,nodetype){
     _xdestroyNodes(nodetype,instantObj.targetid);
     //console.log("resetInstant",nodetype,instantObj.targetid);
     _xstyle(jQuery("#" +instantObj.targetid),"display", "none");
    /* dojo.style(dojo.byId(instantObj.sourceid),"background", ""); */
     _xremoveClass(instantObj.sourceid, "indicator");
 }


 function _xinstantSearch(nodeid) {
    var xprops = _xgetAttr(nodeid ,'data-x-props'); 
   //  console.log("_xinstantSearch", xprops);
    if (xprops != null) {
        xprops = xprops.replace(/'/g,'"');
        var jObj = jQuery.parseJSON(xprops); 
        instantObj =  jObj.instantSearch;
      //  console.log("_xinstantSearch", instantObj);
        if (instantObj != undefined ) {
            if (instantObj.delay == undefined) instantObj.delay = instantDelay;
            var displayAs = self.instantObj.displayAs;
            switch(displayAs) {
            case "table":
            	if (typeof instantSearchT == 'function') wait = setTimeout(function(){instantSearchT(nodeid, instantObj.delay)});
            	else log("Please include the proper instantSearch function");
            	break;
            default:
            	if (typeof instantSearch == 'function') wait = setTimeout(function(){instantSearch(nodeid, instantObj.delay)});
           	else log("Please include the proper instantSearch function");
            }
            
         } 
    }    
 }
 
 var _2a3="file|submit|image|reset|button|";
 Date.LZ=function(x){return (x<0||x>9?"":"0")+x;};
 Date.monthNames=new Array("January","February","March","April","May","June","July","August","September","October","November","December");
 Date.monthAbbreviations=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
 Date.dayNames=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
 Date.dayAbbreviations=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat");
 Date.preferAmericanFormat=true;
 if(!Date.prototype.getFullYear){Date.prototype.getFullYear=function(){var yy=this.getYear();return (yy<1900?yy+1900:yy);};}
 
 Date.parseString = function(val, _2a3) {
		if (typeof (_2a3) == "undefined" || _2a3 == null || _2a3 == "") {
			var _2a4 = new Array("y-M-d", "MMM d, y", "MMM d,y", "y-MMM-d",
					"d-MMM-y", "MMM d", "MMM-d", "d-MMM"), _2a5 = new Array(
					"M/d/y", "M-d-y", "M.d.y", "M/d", "M-d"), _2a6 = new Array(
					"d/M/y", "d-M-y", "d.M.y", "d/M", "d-M"), _2a7 = new Array(
					_2a4, Date.preferAmericanFormat ? _2a5 : _2a6,
					Date.preferAmericanFormat ? _2a6 : _2a5);
			for (var i = 0; i < _2a7.length; i++) {
				var l = _2a7[i];
				for (var j = 0; j < l.length; j++) {
					var d = Date.parseString(val, l[j]);
					if (d != null) {
						return d;
					}
				}
			}
			return null;
		}
		this.isInteger = function(val) {
			for (var i = 0; i < val.length; i++) {
				if ("1234567890".indexOf(val.charAt(i)) == -1) {
					return false;
				}
			}
			return true;
		};
		this.getInt = function(str, i, _2a8, _2a9) {
			for (var x = _2a9; x >= _2a8; x--) {
				var _2aa = str.substring(i, i + x);
				if (_2aa.length < _2a8) {
					return null;
				}
				if (this.isInteger(_2aa)) {
					return _2aa;
				}
			}
			return null;
		};
		val = val + "";
		_2a3 = _2a3 + "";
		var _2ab = 0, _2ac = 0, c = "", _2ad = "", _2ae = "", x, y, year = new Date()
				.getFullYear(), _2af = 1, date = 1, hh = 0, mm = 0, ss = 0, ampm = "";
		while (_2ac < _2a3.length) {
			c = _2a3.charAt(_2ac);
			_2ad = "";
			while ((_2a3.charAt(_2ac) == c) && (_2ac < _2a3.length)) {
				_2ad += _2a3.charAt(_2ac++);
			}
			switch (_2ad) {
			case "yyyy":
			case "yy":
			case "y":
				if (_2ad == "yyyy") {
					x = 4;
					y = 4;
				}
				if (_2ad == "yy") {
					x = 2;
					y = 2;
				}
				if (_2ad == "y") {
					x = 2;
					y = 4;
				}
				year = this.getInt(val, _2ab, x, y);
				if (year == null) {
					return null;
				}
				_2ab += year.length;
				if (year.length == 2) {
					if (year > 70) {
						year = 1900 + (year - 0);
					} else {
						year = 2000 + (year - 0);
					}
				}
				break;
			case "MMM":
			case "NNN":
				_2af = 0;
				var _2b0 = (_2ad == "MMM" ? (Date.monthNames.concat(Date.monthAbbreviations)) : Date.monthAbbreviations);
				for (var i = 0; i < _2b0.length; i++) {
					var _2b1 = _2b0[i];
					if (val.substring(_2ab, _2ab + _2b1.length).toLowerCase() == _2b1
							.toLowerCase()) {
						_2af = (i % 12) + 1;
						_2ab += _2b1.length;
						break;
					}
				}
				if ((_2af < 1) || (_2af > 12)) {
					return null;
				}
				break;
			case "EE":
			case "E":
				var _2b0 = (_2ad == "EE" ? Date.dayNames : Date.dayAbbreviations);
				for (var i = 0; i < _2b0.length; i++) {
					var _2b2 = _2b0[i];
					if (val.substring(_2ab, _2ab + _2b2.length).toLowerCase() == _2b2
							.toLowerCase()) {
						_2ab += _2b2.length;
						break;
					}
				}
				break;
			case "MM":
			case "M":
				_2af = this.getInt(val, _2ab, _2ad.length, 2);
				if (_2af == null || (_2af < 1) || (_2af > 12)) {
					return null;
				}
				_2ab += _2af.length;
				break;
			case "dd":
			case "d":
				date = this.getInt(val, _2ab, _2ad.length, 2);
				if (date == null || (date < 1) || (date > 31)) {
					return null;
				}
				_2ab += date.length;
				break;
			case "hh":
			case "h":
				hh = this.getInt(val, _2ab, _2ad.length, 2);
				if (hh == null || (hh < 1) || (hh > 12)) {
					return null;
				}
				_2ab += hh.length;
				break;
			case "HH":
			case "H":
				hh = this.getInt(val, _2ab, _2ad.length, 2);
				if (hh == null || (hh < 0) || (hh > 23)) {
					return null;
				}
				_2ab += hh.length;
				break;
			case "KK":
			case "K":
				hh = this.getInt(val, _2ab, _2ad.length, 2);
				if (hh == null || (hh < 0) || (hh > 11)) {
					return null;
				}
				_2ab += hh.length;
				hh++;
				break;
			case "kk":
			case "k":
				hh = this.getInt(val, _2ab, _2ad.length, 2);
				if (hh == null || (hh < 1) || (hh > 24)) {
					return null;
				}
				_2ab += hh.length;
				hh--;
				break;
			case "mm":
			case "m":
				mm = this.getInt(val, _2ab, _2ad.length, 2);
				if (mm == null || (mm < 0) || (mm > 59)) {
					return null;
				}
				_2ab += mm.length;
				break;
			case "ss":
			case "s":
				ss = this.getInt(val, _2ab, _2ad.length, 2);
				if (ss == null || (ss < 0) || (ss > 59)) {
					return null;
				}
				_2ab += ss.length;
				break;
			case "a":
				if (val.substring(_2ab, _2ab + 2).toLowerCase() == "am") {
					ampm = "AM";
				} else {
					if (val.substring(_2ab, _2ab + 2).toLowerCase() == "pm") {
						ampm = "PM";
					} else {
						return null;
					}
				}
				_2ab += 2;
				break;
			default:
				if (val.substring(_2ab, _2ab + _2ad.length) != _2ad) {
					return null;
				} else {
					_2ab += _2ad.length;
				}
			}
		}
		if (_2ab != val.length) {
			return null;
		}
		if (_2af == 2) {
			if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) {
				if (date > 29) {
					return null;
				}
			} else {
				if (date > 28) {
					return null;
				}
			}
		}
		if ((_2af == 4) || (_2af == 6) || (_2af == 9) || (_2af == 11)) {
			if (date > 30) {
				return null;
			}
		}
		if (hh < 12 && ampm == "PM") {
			hh = hh - 0 + 12;
		} else {
			if (hh > 11 && ampm == "AM") {
				hh -= 12;
			}
		}
		return new Date(year, _2af - 1, date, hh, mm, ss);
	};
	