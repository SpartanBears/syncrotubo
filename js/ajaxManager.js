//ajax call storage
var ajaxCalls = {};

//aborts current call from caller, and saves the new one
//unhandled exception ajaxCalls[caller] = undefined
function storeAjaxCall(caller, call){

	if(ajaxCalls[caller] !== undefined){
		
		ajaxCalls[caller].abort();
	}
	
	ajaxCalls[caller] = call;
}

function abortAllAjaxCalls(){

	var callers = Object.keys(ajaxCalls);

	callers.forEach(abortCallerAjax);
}

function abortCallerAjaxCalls(caller){

	ajaxCalls[caller].abort();
}