;(function($) {

 $.LoadBigLocalizeContent = function(from, count, LMSG){
	var langhtml = "";
	var langfrom = from;
	
	for (var i = 0; i <= count; i++){
		langhtml = langhtml + "<option param=''" + i + "''>" + LMSG[(langfrom + i) + ""] + "</option>";
	};
	
	return langhtml;
 };

 $.MCLocalize = function(SetOptions) { // localLang, UserDefinedLocalizeZone){
 	var Options = $.extend({
		LocalizeFile : "ru.json",
		UserDefinedLocalizeZone : undefined,
		LocalizeSource : undefined,
		UseHTML : false
	}, SetOptions || {});
	
	var lMsg = "";
	var LMSG = {};
	
	$.ajax({
		type	: "GET",
		url		: Options.LocalizeFile,
		async	: false, 
		success	: function(html){
			lMsg = html;
		}
	});
	
	try {
		LMSG = JSON.parse(lMsg);
	} catch (e) {
		if (typeof lMsg === "object") {
			LMSG = lMsg;
		};
	};
	
	if (!LMSG) {// если что-то не так - выходим из функции, и локализации не будет, вообще
		return false;
	};
	
	$("msg", Options.LocalizeSource).each(function(){
		var numb = $(this).attr("n");

		$(this).replaceWith(LMSG[numb]);
	});
	
	if (Options.UserDefinedLocalizeZone) {
		$(Options.UserDefinedLocalizeZone, Options.LocalizeSource).each(function(){
			var nmsg = (!$(this).attr("nmsg")) ? "" : $(this).attr("nmsg");
			
			if (nmsg != "") {
				switch ($(this)[0].nodeName){
					case "OPTION":
						(Options.UseHTML) ? $(this).html(LMSG[nmsg]) : $(this).text(LMSG[nmsg]);
					break;
					
					case "DIV":
						(Options.UseHTML) ? $(this).html(LMSG[nmsg]) : $(this).text(LMSG[nmsg]);
					break;
					
					case "INPUT":
				        $(this).val(LMSG[nmsg]);
					break;
					
					case "IMG":
						$(this).attr("title", LMSG[nmsg]);
					break;
					
					default: 
						(Options.UseHTML) ? $(this).html(LMSG[nmsg]) : $(this).text(LMSG[nmsg]);
					break;
				};
			} else {
                nmsg = (!$(this).attr("nmsg-hold")) ? "" : $(this).attr("nmsg-hold");
                
                if ((nmsg != "") && ($(this)[0].nodeName === "INPUT")) {$(this).prop("placeholder", LMSG[nmsg])};
			};
		});
	};
 
 	return LMSG;
 };	

})(jQuery);