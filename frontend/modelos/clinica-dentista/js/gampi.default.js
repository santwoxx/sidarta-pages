var nothing = function(){};
function url(string){
	window.location = string;
}
//exclui todos os options de um select
function resetSelect(tmp_select){
	tmp_select.disabled = true;
	for(var x=(tmp_select.options.length-1);x > 0;x--){
		if(tmp_select.options[x].value != ''){
			tmp_select.remove(x);
		}
	}
}

function fillSelect(myId,routine,dataToSend,selectedValue,callback,carregando){
	var me = gebi(myId);

	if(!carregando){
		carregando = 'Carregando...';
	}
	var firstOption =  me.options[0];
	var firstTxt = '&nbsp;';
	if(firstOption){
		firstTxt = firstOption.text;
		firstOption.text = carregando;
	}
	return $.ajax({
		url: routine,
		dataType: 'json',
		data: dataToSend,
		success: function(data){
			var ops = '';
			if(firstOption){
				ops += '<option value="">'+firstTxt+'</opiton>';
			}
			for(var x=0;x<data.length;x++){
				ops += '<option alt="'+((data[x].alt != undefined)?data[x].alt:'')+'" title="'+((data[x].alt != undefined)?data[x].alt:'')+'" value="'+data[x].value+'" '+(((selectedValue != undefined) && (data[x].value == selectedValue))?'selected':'')+'>'+data[x].text+'</opiton>';
			}
			$('#'+myId).html(ops).change();
			if(callback){
				callback();
			}
		}
	});
}

function loadChild(myId,childId,routine,dataToSend,callback,carregando,extraFirstOptionDiv){
	var me = gebi(myId);

	if(!carregando){
		carregando = 'Carregando...';
	}
	if(!extraFirstOptionDiv){
		extraFirstOptionDiv = '<span class="sbaixo"></span>';
	}

	if(me.value != ''){
		var firstOption = gebi(childId).options[0];
		var firstOptionDiv = gebi(childId+'_div');
		var firstTxt = '';
		if(firstOption){
			firstTxt = firstOption.text;
			firstOption.text = carregando;
			if(firstOptionDiv)
				firstOptionDiv.innerHTML = carregando;
		}
		return $.ajax({
			url: routine,
			dataType: 'json',
			data: dataToSend,
			success: function(data){
				var ops = '';
				if(firstOption){
					ops += '<option value="">'+firstTxt+'</opiton>';
					if(firstOptionDiv)
						firstOptionDiv.innerHTML = firstTxt+extraFirstOptionDiv;
				}
				for(var x=0;x<data.length;x++){
					ops += '<option value="'+data[x].value+'">'+data[x].text+'</opiton>';
				}
				$('#'+childId).html(ops);
				if(callback){
					callback();
				}
			}
		});
	}
}

// function returnAjax(routine,dataToSend,type){
	// $.ajax({
		// url: routine,
		// dataType: type,
		// data: dataToSend,
		// success: function(data){
			// return data;
		// }
	// });
// }

//carrega os elementos de um select via ajax
//PS: a pagina de rotina deve estar devidamente configurada, e verifique o 'estilo' de concatenação dos registros.
function loadSelect(tmp_args,tmp_action,tmp_select,tmp_routinePage,tmp_eval){
	if(!tmp_routinePage){
		tmp_routinePage = 'rotina_default.php?action=';
	}
	var select = gebi(tmp_select);
	if(select){
		if(select.type == 'select-one'){
			resetSelect(select);

			var strArgs = '';
			for(k in tmp_args){
				strArgs += '&'+k+'='+tmp_args[k];
			}

			var a = new Ajax();
			a.onLoad = function(){
				var ret = this.html.trim();
				if(ret.length > 0){
					select.disabled = '';
					var arr = ret.split('###');
					for(var x=0;x<arr.length;x++){
						aux = arr[x].split('...');
						addOption(select,aux[1],aux[0]);
					}

					select.disabled = '';
				} else {
					alert('Nenhum registro encontrado');
					select.disabled = true;
				}
				if(tmp_eval){
					eval(tmp_eval);
				}
			}
			a.get(tmp_routinePage+tmp_action+strArgs);
		}
	}
}

//adiciona um option a um select
function addOption(tmp_select,tmp_text,tmp_value){
	var option = document.createElement('option');
	option.value = tmp_value;
	option.text = tmp_text;

	try {
		tmp_select.add(option,null);
	} catch(ex) {//para IE
		tmp_select.add(option);
	}
}

//atalho para 'document.getElementById'
function gebi(tmp_id){
	return document.getElementById(tmp_id);
}

//função não faz nada para os hrefs
function nothing_func() { }

var undefined = undefined;//agiliza o processo de identificação de um undefined

//uma espécie de alert para visualizar um elemento em js com mais facilidade
var showMe = function (tmp_obj, tmp_alert) {
	var that = this;
	this.msg = '';
	this.makeMsg = function(tmp_obj){
		var these = that;
		var msg = '';
		var type;
		var typeObj = typeOf(tmp_obj);
		// msg = typeObj;
		if(tmp_obj){
			// var typeObj = typeOf(tmp_obj[v]);
			if((typeObj === 'object') || (typeObj === 'array')){
				for (var v in tmp_obj) {
					// msg += 'entra no for in ('+v+') \n';
					if((v != 'selectionStart') && (v != 'selectionEnd')){
						type = typeOf(tmp_obj[v]);
						// msg += 'entra no for in ('+type+') ['+v+'] \n';
						if(type === 'array'){
							msg += '('+type+')	['+v+'] =>	'+that.makeMsg(tmp_obj[v])+'\n';
						} else if(type === 'function'){
							msg += '';
						} else if(type === 'null'){
							msg += '('+type+')		['+v+'] =>	'+(tmp_obj[v]+'')+'\n';
						} else {
							msg += '('+type+')	['+v+'] =>	'+(tmp_obj[v]+'')+'\n';
						}
					}
				}
			} else if(typeObj === 'funciton'){
				// msg += '('+type+')	['+v+'] =>	'+(tmp_obj[v]+'')+'\n';
			} else if(typeObj === 'undefined'){
				msg += '('+type+')	['+v+'] =>	'+(tmp_obj[v]+'')+'\n';
			}
		} else {
			msg = 'null';
		}
		return (msg+'');
	}
	this.msg = that.makeMsg(tmp_obj);

	if (tmp_alert == true) {
		alert('Object	(' + tmp_obj + '):\n' + this.msg);
	} else {
		var div = document.createElement('div');
		div.id = 'showMe_' + Math.round(Math.random() * 99999);
		div.style.position = 'absolute';
		div.style.top = '0px';
		div.style.left = '0px';
		div.style.padding = '10px';
		div.style.border = '1px solid #666666';
		div.style.background = '#EEEEEE';
		div.innerHTML = '<a href="javascript:nothing();" onclick="javascript: removeElement(gebi(\''+div.id+'\'))">fechar <big>X</big></a><br /><pre style="font-family: Tahoma; font-size: 9px; line-height:13px;">' + this.msg + '</pre>';

		document.getElementsByTagName('body')[0].appendChild(div);
	}
}

//funcções relacionadas a evento//
//adiciona um evento a um elemento
function addEvent(tmp_obj, tmp_event, tmp_function) {
	var f = function (e) {
		tmp_function.apply(tmp_obj, [e || event]);
	};

	if (typeof tmp_event == "string") {
		if (tmp_event.indexOf(" ") > -1) {
			var arr = tmp_event.split(" ");
			for (var i = 0; i < arr.length; i++) {
				addEvent(tmp_obj, arr[i], tmp_function);
			}

			return true;
		}
	} else if (typeof tmp_event == "object") {
		for (var i = 0; i < tmp_event.length; i++) {
			addEvent(tmp_obj, tmp_event[i], tmp_function);
		}

		return true;
	}

	if (tmp_obj) {
		try {
			tmp_obj.addEventListener(tmp_event, f, false);
		} catch (e) {
			try {
				tmp_obj.attachEvent("on" + tmp_event, f);
			} catch (e2) {
				return false;
			}
		}

		return true;
	} else {
		return false;
	}
}
//remove um evento de um elemento
function removeEvent(tmp_obj, tmp_type, tmp_function) {
	try {
		tmp_obj.detachEvent("on" + tmp_type, tmp_function);
	} catch (e) {
		tmp_obj.removeEventListener(tmp_type, tmp_function, false);
	}
}

function redir(tmp_pagina) {
	document.location = tmp_pagina;
}

//Prototypes e utilidades básicas com entidades (elementos)
function removeElement(tmp_obj) {
	if((tmp_obj) && (tmp_obj.parentNode)){
		tmp_obj.parentNode.removeChild(tmp_obj);
	}
}

//Verifica se uma variavel é um inteiro
function isInt(x){
	try {
		var y = parseInt(x);
		if (isNaN(y)) return false;
		return ((x == y) && (x.toString() == y.toString()));
	} catch (e) {
		return false;
	}
}

//verifica o type sem a confusão de null também ser um object assim como o array as vezes se torna um object
function typeOf(value) {
    var s = typeof value;
    if (s === 'object') {
        if (value) {
            if ((typeof value.length === 'number') && (!(value.propertyIsEnumerable('length'))) && (typeof value.splice === 'function')) {
                s = 'array';
            }
        } else {
            s = 'null';
        }
    }
    return s;
}

if (!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s*(\S*(?:\s+\S+)*)\s*$/, "$1");
	}
}

var formToObj = function(id){
	var form = gebi(id);
	var objs = {};
	for(var x=0;x<form.elements.length;x++){
		var e = form.elements[x];
		switch(e.type){
			case 'submit':
				break
			default:
					objs[e.name] = e.value;
				break;
		}
	}
	return objs;
};

//verifica se o type é igual a um array
function is_object (mixed_var) {
    if (mixed_var instanceof Array) {
		return false;
    } else {
        return (mixed_var !== null) && (typeof(mixed_var) == 'object');
    }
}