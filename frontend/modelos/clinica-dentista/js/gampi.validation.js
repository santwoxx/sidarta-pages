/*
####### GERAL #######
Para utilizar o validador, inicialmente é necessário adicionar o default.js

as validações dos campos funcionam basicamente pelos seus IDs que lhe dão os atributos para máscara e validação
da seguinte forma:

Ex: <input type="text" id="nome_TXT1" name="nome" alt="Nome do funcionário" />

os dados antes da primeira underline são para nomenclatura do campo com diferentes ids.
as três seguintes letras, TXT são a máscara e validação, no caso TXT não possui mascara, é um campos texto
o caractere seguinte, o 1, significa que é obrigatório, caso fosse 0, não seria obrigatório
também é possível atribuir um tamanho mínimo aos campos, utilizando mais um underline e um valor numérico após ele

concluindo: ID:   nomedomeucampo   _    CPF   1   _   20
				  |				   | 	|	  |	  |	  |--->mínimo de caracteres
				  |				   |	|	  |	  |------->separador
				  |				   |	|	  |----------->obrigatório sim(1) não(0)
				  |				   |	|----------------->três caracteres para validação e máscara
				  |				   |---------------------->separador
				  |--------------------------------------->id/label do campo, quantos caracteres forem necessários

PS: o id/label pode ser utilizado para não existir a necessidade de utilizar o atributo alt para exibição das mensagens
	contudo, é limite a valores exatos que seguem:
	os campos da esquerda são os ids válidos, e os da direita o alt que seria atribuido.

'nome'			:	'Nome'
'endereco'		:	'Endereço'
'telefone'		:	'Telefone'
'celular'		:	'Celular'
'complemento'	:	'Complemento'
'numero'		:	'Número'
'estado'		:	'Estado'
'cep'			:	'CEP'
'cidade'		:	'Cidade'
'email'			:	'E-mail'
'celular'		:	'Celular'
'enviar'		:	'Enviar'
'alterar'		:	'Alterar'
'data'			:	'Data'
'sexo'			:	'Sexo'
'login'			:	'Login'
'senha'			:	'Senha'
'comentario'	:	'Comentário'
'mensagem'		:	'Mensagem'

Caso alguém ache interessante adicionar mais opções, esta lista encontra-se na função '_parseId' deste validador.


!!!!!!! ATENÇÃO !!!!!!!
o atributo ALT é utilizado para mostrar a mensagem conforme a validação do campo. é importante que o atributo seja sempre utilizado, inclusive em selects e inputs do tipo radio.


####### AS VALIDAÇÕES POSSÍVEIS #######

FIL: para campos type file, se pode adicionar as extensões possíveis dentro do parametro accept.
Ex: <input type="file" id="curriculo_FIL1" name="curriculo" alt="Currículo" accept="doc,pdf" />

TXT: para campos de texto, a utilidade seria a obrigatoriedade ou não.
EX: <input type="text" id="comentario_TXT1" name="comentariosimples" alt="Comentário simples" />

NUM: para campos que só se permita números inteiros, sem virgula ou ponto.
Ex: <input type="text" id="quantidade_NUM1" name="quantidade" alt="Quantidade máxima permitida" />

DIN: para campos com formatação de dinheiro no formato 1.005.500,99, separador de milhar '.', separador decimal ','
Ex: <input type="text" id="valor_DIN1" name="valor" alt="Valor" />

FLO: para campos com formatação de decimal, é semalhante ao NUM, contudo, permite casas depois da vírgula.
Ex: <input type="text" id="valor_FLO1" name="valor" alt="Valor" />

TEL: para campos com formatação de telefone: (51) 5164.6547
Ex: <input type="text" id="fone_TEL1" name="telefone" alt="Telefone comercial" />

CEP: para campos com formatação de cep: 93410040-040
Ex: <input type="text" id="cep_CEP1" name="cep" alt="CEP" />

PW1: para campos de password, caso possua confirmação de password, se utilizando juntamente com o PW2
PW2: confirmação desenha do PW1
Ex: <input type="password" id="senha_PW11" name="senha" alt="Senha" />
	<input type="password" id="senha_PW21" name="confirmacao" alt="Confirmação de senha" />

DAT: para campos com formatação de data: dd/mm/yyyy
Ex:	<input type="text" id="data_DAT1" name="datanascimento" alt="Data de nascimento" />

DDM: para campos com formatação de data: dd/mm
Ex:	<input type="text" id="data_DDM1" name="datanascimento" alt="Data de nascimento" />

DTH: para campos com formatação de data e hora: dd/mm/yyyy HH:ii
Ex:	<input type="text" id="quando_DTH1" name="quanto" alt="Quando ocorre o evento?" />

HOR: para campos com formatação de hora sem os segundos: HH:ii
Ex:	<input type="text" id="hora_HOR1" name="horario" alt="Horário marcado" />

HO2: para campos com formatação de hora COM os segundos: HH:ii:ss
Ex:	<input type="text" id="hora_HO21" name="horario" alt="Horário marcado" />

EML: para campos com formatação de e-mail, é validado se possui '@' e ao menos um '.'
Ex:	<input type="text" id="email_EML1" name="email" alt="E-mail de contato" />

CPF: para campos com formatação de CPF, é validado o cpf, apenas o cpf 000.000.000-00 não é validado
Ex:	<input type="text" id="cpf_CPF1" name="cpf" alt="seu CPF" />

CNP: para campos com formatação de CNPJ, é validado o cnpj, apenas o cnpj 00-000-000/0000-00 não é validade
Ex:	<input type="text" id="cnpj_CNP1" name="cnpj" alt="CNPJ da empresa" />

CMB: validação para selects, verifica se é obrigatório e se o option selecionado possui valor diferente de vazio
	<select id="estado_CMB1" name="estado" alt="Unidade federativa">
		<option value="">selecione</option>
		<option value="">---</option>
		<option value="RS">Rio Grande do Sul</option>
	</select>

RDO: validação para radio buttons, valida se ao menos um foi selecionado. Os names dos campos devem ser iguais
Ex:	<input type="radio" id="radio1_RDO" name="status" value="0" alt="Status" />
	<input type="radio" id="radiooutro_RDO" name="status" value="1" alt="Status" />
	<input type="radio" id="radio12_RDO" name="status" value="2" alt="Status" />
	<input type="radio" id="radio10_RDO" name="status" value="3" alt="Status" />

	repare que os ids são distindos mas o name permanece o mesmo.


####### SOBRE TEXTAREAS #######

		é possível definir um valor máximo de caracteres para textareas, basta inserir um atributo maxlength
		com o número inteiro e/ou, ajustar o tamanho nos atributos cols e rows, no caso o maxlength será a
		multiplicação de cols por rows.

Ex(s):	<textarea id="mensagem_TXT1" name="mensagem" alt="Mensagem" cols="60" rows="3"></textarea> - neste caso, o maxlength = 60 * 3 = 180
		<textarea id="mensagem_TXT1" name="mensagem" alt="Mensagem" maxlength="1500"></textarea> - neste caso, o maxlength é dado diretamente pelo atributo

		como adicional, é possível criar uma div com o ID: idDoTextarea+'_counter', dentro dela será mostrado a quantidade ainda possível de caracteres para inserção.
		lembre-se que o textarea adquire tamanho variado se utilizar os atributos rows e cols, no entando, o tamanho dele será fixado
		utilizando o style com width e height.
		a maneira recomendada e válida pela w3c é utilizar os atributos rows e cols para atribuir o maxlength


####### VISUALIZAÇÃO DAS MENSAGENS DE ERRO #######

		inicialmente é utilizada a função

		é possível criar um elemento que contenha a propriedade 'innerHTML' para receber as mensagens ao invés de usar o alert.
		cada form terá um elemento desses onde o ID do mesmo será: idDoForm+'_messagebox'

*/
function Form() {
    var formeu = this;
    this.language = 1; //1 => port
    this.form_id = '';

    this.sendAction = function(tmp_id, tmp_action, tmp_return) {
        var form = gebi(tmp_id);
        form.action = tmp_action;
        return this.send(tmp_id, tmp_return);
    }
    this.sendAjax = function(tmp_id) {

		// console.log(tmp_id);
        // loader
        var $form = $('#' + tmp_id);
        if (!$form.find('a.submit').hasClass('sending')) {
            $form.find('a.submit').addClass('sending');
            var var_return = this.send(tmp_id, true);
            if (var_return != false) {
                var url = $('#' + tmp_id).attr('action');
                // ADAPTAR PARA FILE POST
                var formData = new FormData($('#' + tmp_id)[0]);

                $.ajax({
                    url: url,
                    type: 'POST',
                    data: formData,
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    success: function(data) {
                        // loader
                        $form.find('a.submit').removeClass('sending');
                        openSuccess(data.tipo_return, data.msg, data.form, data.redir);
                    }
                });
            } else {
                // loader
                $form.find('a.submit').removeClass('sending');
                return false;
            }
        } else {
            return false;
        }
    }
    this.sendAjaxNoticia = function(tmp_id) {
        // loader
        var $form = $('#' + tmp_id);
        if (!$form.find('a.submit').hasClass('sending')) {
            $form.find('a.submit').addClass('sending');
            var var_return = this.send(tmp_id, true);
            if (var_return != false) {
                this.send(tmp_id);
            } else {
                // loader
                $form.find('a.submit').removeClass('sending');
                return false;
            }
        } else {
            return false;
        }
    }
    this.send = function(tmp_id, tmp_return) {
        this.form_id = tmp_id; //mantem o id do form para futuros usos

        if (tmp_return == undefined) {
            tmp_return = false;
        }

        var i = 0;
        var error = false;
        var form = gebi(tmp_id);
        var valid_numbers = '0123456789,.';
        var valid_telphone = '0123456789. ()';
        var valid_cep = '0123456789-';
        var tmp_pass = '';
        var param_id;
        var param_type;
        var param_name;
        var param_value;
        var param_testDV;
        var obj;
        var r_parse;

        var label;
        var type;
        var required;
        var minchars;


        //adiciona evento anonimo com return false (evitar troca de pagina quando se clica em num input[type]'submit' dentro de um form
        form.onsubmit = function() { return false; }
        addEvent(form, 'submit', function() { return false; });


        //elements loop
        formeu.msgObj = undefined;
        while (form.elements[i]) {
            obj = form.elements[i];
            formeu.msgObj = obj;

            param_id = obj.id;
            param_type = obj.type;
            param_name = obj.name;
            param_value = obj.value;
            param_testDV = false;
            param_isDisabled = ($(obj).attr('disabled')) ? true : false;
            param_isReadonly = ($(obj).attr('readonly')) ? true : false;

            if ((param_type != 'checkbox') && (param_type != 'submit') && (param_type != 'image') && (param_type != 'button') && (param_type != 'reset') && (!param_isDisabled) && (!param_isReadonly)) {

                if (obj.attributes["testDV"]) {
                    if (obj.attributes["testDV"].value != 'false') {
                        param_testDV = true;
                    }
                }

                r_parse = this._parseId(obj);

                label = r_parse[0];
                type = r_parse[1];
                required = r_parse[2];
                minchars = r_parse[3];

                switch (type) {
                    case "FIL":
                        if ((required) && (!param_value)) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        } else if ((required) || (param_value)) {
                            arr_types = [];
                            if (obj.accept != "") {
                                arr_types = obj.accept.split(",");
                                arr_file = param_value.split(".");
                                valid = false;
                                if (arr_file.length > 1) {
                                    for (cont = 0; cont < arr_types.length; cont++) {
                                        if (arr_types[cont].toLowerCase() == arr_file[arr_file.length - 1].toLowerCase()) {
                                            valid = true;
                                        }
                                    }
                                }
                                if (!valid) {
                                    obj.value = "";
                                    this._showMessage(12, label, arr_types);
                                    // obj.focus();
                                    return false;
                                }
                            }
                        }
                        break;
                    case "TXT":
                    case "NUM":
                    case "NU2":
                    case "DIN":
                    case "FLO":
                    case "TEL":
                    case "CEP":
                        if (((required) && (!param_value)) || ((required) && ((param_testDV) && (param_value == obj.defaultValue)))) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "PW1":
                        if (((required) && (!param_value)) || ((required) && ((param_testDV) && (param_value == obj.defaultValue)))) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        } else {
                            tmp_pass = param_value;
                        }

                        break;
                    case "PW2":
                        if (param_value != tmp_pass) {
                            this._showMessage(3);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "DTH":
                        var aux = param_value.split(' ');
                        if (param_value) {
                            if (aux.length == 2) {
                                var date = aux[0];
                                var hour = aux[1];

                                var day = date.split('/')[0] * 1;
                                var month = date.split('/')[1] * 1;
                                var year = date.split('/')[2] * 1;

                                if ((date.length == 10) && (date.charAt(2) == '/') && (date.charAt(5) == '/') && (day <= 31) && (day > 0) && (month <= 12) && (month > 0) && (year >= 1800)) {
                                    if (hour) {
                                        if ((hour.length == 5) && (hour.charAt(2) == ':') && (hour.split(':')[0] * 1 <= 24) && (hour.split(':')[1] * 1 <= 59)) {
                                            //Valid Hour
                                        } else {
                                            this._showMessage(8, label);
                                            obj.focus();
                                            return false;
                                        }
                                    } else if (required) {
                                        this._showMessage(0, label);
                                        obj.focus();
                                        return false;
                                    }
                                } else {
                                    this._showMessage(4, label);
                                    obj.focus();
                                    return false;
                                }
                            } else if (required) {
                                this._showMessage(13, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(13, label);
                            obj.focus();
                            return false;
                        }
                        break;
                    case "DAT":
                        if (param_value) {
                            var day = param_value.split('/')[0] * 1;
                            var month = param_value.split('/')[1] * 1;
                            var year = param_value.split('/')[2] * 1;

                            if ((param_value.length == 10) && (param_value.charAt(2) == '/') && (param_value.charAt(5) == '/') && (day <= 31) && (day > 0) && (month <= 12) && (month > 0) && (year >= 1800)) {
                                //Valid Date
                            } else {
                                this._showMessage(4, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "DDM":
                        if (param_value) {
                            var day = param_value.split('/')[0] * 1;
                            var month = param_value.split('/')[1] * 1;

                            if ((param_value.length == 5) && (param_value.charAt(2) == '/') && (day <= 31) && (day > 0) && (month <= 12) && (month > 0)) {
                                //Valid Date
                            } else {
                                this._showMessage(14, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "HOR":
                        if (param_value) {
                            if ((param_value.length == 5) && (param_value.charAt(2) == ':') && (param_value.split(':')[0] * 1 <= 24) && (param_value.split(':')[1] * 1 <= 59)) {
                                //Valid Hour
                            } else {
                                this._showMessage(8, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "HO2":
                        if (param_value) {
                            if ((param_value.length == 8) && (param_value.charAt(2) == ':') && (param_value.charAt(5) == ':') && (param_value.split(':')[0] * 1 <= 24) && (param_value.split(':')[1] * 1 <= 59) && (param_value.split(':')[2] * 1 <= 59)) {
                                //Valid Hour
                            } else {
                                this._showMessage(10, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                    case "TEU":
                        if (param_value) {

                            if ((param_value.length == 16) && (param_value.charAt(14) == '-')) {
                                //Valid TEU
                            } else {
                                this._showMessage(17, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "EML":
                        if (param_value) {
                            if ((param_value.indexOf(".") > 0) && (param_value.indexOf("@") > 0) && (param_value.length > 3) && (param_value != "@.")) {
                                //Valid e-mail
                            } else {
                                this._showMessage(5, label);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "PLA":
                        if (((required) && (!param_value)) || ((required) && ((param_testDV) && (param_value == obj.defaultValue)))) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        } else if (param_value) {
                            if ((param_value.length == 8) && (param_value.indexOf('-') > 0)) {
                                var aux = param_value.split('-');
                                if ((aux.length == 2) && (aux[0].length == 3) && (aux[1] < 10000)) {
                                    // placa valida
                                } else {
                                    this._showMessage(15, label);
                                    obj.focus();
                                    return false;
                                }
                            } else {
                                this._showMessage(15, label);
                                obj.focus();
                                return false;
                            }
                        }

                        break;
                    case "CPF":
                        if (param_value) {
                            var p1 = param_value.substring(0, 3);
                            var p2 = param_value.substring(4, 7);
                            var p3 = param_value.substring(8, 11);
                            var p4 = param_value.substring(12, 14);
                            var cpf = p1 + p2 + p3 + p4;
                            var cpf_verif = cpf.substring(9, 11);
                            var c = 0;
                            var position = 1;

                            for (var cont = 0; cont < 9; cont++) {
                                c += cpf.substring(cont, position) * (10 - cont);
                                position++;
                            }

                            c = (11 - (c % 11));
                            if (c > 9) { c = 0; }
                            if (cpf_verif.substring(0, 1) != c) {
                                this._showMessage(6);
                                obj.focus();
                                return false;
                            }

                            c *= 2;
                            position = 1;
                            for (var cont = 0; cont < 9; cont++) {
                                c += cpf.substring(cont, position) * (11 - cont);
                                position++;
                            }

                            c = (11 - (c % 11));
                            if (c > 9) { c = 0; }

                            if (cpf_verif.substring(1, 2) != c) {
                                this._showMessage(6);
                                obj.focus();
                                return false;
                            }

                            if ((cpf == '99999999999') || (cpf == '88888888888') || (cpf == '77777777777') || (cpf == '66666666666') || (cpf == '55555555555') || (cpf == '44444444444') || (cpf == '33333333333') || (cpf == '22222222222') || (cpf == '11111111111')) {
                                this._showMessage(6);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }

                        break;

                    case "CNP":
                        if (param_value) {
                            var p1 = param_value.substring(0, 2);
                            var p2 = param_value.substring(3, 6);
                            var p3 = param_value.substring(7, 10);
                            var p4 = param_value.substring(11, 15);
                            var digitoverificador = param_value.substring(16, 18);
                            var cnpj = p1 + p2 + p3 + p4;
                            var position = 1;
                            var arr_multiplicadores1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
                            var arr_multiplicadores2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
                            var soma = 0;
                            var divisao = 0;
                            var resto = 0;
                            var verificador1;
                            var verificador2;

                            //---------- PRIMEIRO DIGITO -----------------
                            for (var cont = 0; cont < 12; cont++) {
                                soma += (cnpj.substring(cont, position) * (arr_multiplicadores1[cont]));
                                position++;
                            }

                            divisao = parseInt(soma / 11);
                            resto = soma % 11;

                            if (resto > 1) {
                                verificador1 = 11 - resto
                            } else {
                                verificador1 = 0;
                            }
                            //---------- / PRIMEIRO DIGITO -----------------

                            //---------- SEGUNDO DIGITO -----------------
                            soma = 0;
                            position = 1;
                            for (var cont = 0; cont < 12; cont++) {
                                soma += (cnpj.substring(cont, position) * (arr_multiplicadores2[cont]));
                                position++;
                            }

                            soma += verificador1 * arr_multiplicadores2[12];

                            divisao = parseInt(soma / 11);
                            resto = soma % 11;

                            if (resto > 1) {
                                verificador2 = 11 - resto
                            } else {
                                verificador2 = 0;
                            }
                            //---------- SEGUNDO DIGITO -----------------

                            if (digitoverificador != (verificador1 + '' + verificador2)) {
                                this._showMessage(11);
                                obj.focus();
                                return false;
                            }
                        } else if (required) {
                            this._showMessage(0, label);
                            obj.focus();
                            return false;
                        }
                        break;
                    case "CMB":
                        if (((obj.value == '')) && (required)) {
                            this._showMessage(7, label);
                            obj.focus();
                            return false;
                        }

                        break;
                    case "RDO":
                        var ok = 0;
                        var el = document.getElementsByName(param_name);

                        for (var i_el = 0; i_el < el.length; i_el++) {
                            var tmp = el[i_el].checked;
                            if (tmp) { ok = 1; }
                        }

                        if ((required) && (ok == 0)) {
                            this._showMessage(7, label);
                            obj.focus();
                            return false;
                        }

                        break;
                }

                //filter min chars
                if ((minchars > 0) && (param_value.length < minchars) && (required)) {
                    this._showMessage(9, label, minchars);
                    obj.focus();
                    return false;
                }
            }
            i++;
        }

        $('input:file').each(function() {
            var me = $(this);
            if (!me.val().trim()) {
                me.attr('disabled', 'disabled');
            }
        });

        if (tmp_return) {
            return true;
        } else {
            form.submit();
        }
    }

    this.maskFields = function() {
        var inputs = document.getElementsByTagName('input');
        var textareas = document.getElementsByTagName('textarea');
        var length = inputs.length;
        var el;
        var type;
        var id;
        var r_parse;
        var i = 0;

        for (i = 0; i < textareas.length; i++) {
            el = textareas[i];
            id = el.id;

            r_parse = f._parseId(el);
            type = r_parse[1];
            switch (type) {
                case "TXT":
                    addEvent(el, 'keyup blur', function() { f._maxlength(this); });

                    break;
            }
        }

        for (i = 0; i < length; i++) {
            el = inputs[i];
            id = el.id;

            if ((el.type !== 'submit') && (el.type !== 'hidden') && (el.type !== 'image') && (el.type !== 'reset')) {
                //apenas campos type text, radio, password, checkbox, file
                r_parse = f._parseId(el);

                type = r_parse[1];
                switch (type) {
                    case "CPF":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('CPF', this.id); });
                        el.maxLength = 14;

                        break;
                    case "PLA":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('PLA', this.id); });
                        el.maxLength = 10;

                        break;
                    case "DAT":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('DAT', this.id); });
                        el.maxLength = 10;

                        break;
                    case "DDM":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('DDM', this.id); });
                        el.maxLength = 10;

                        break;
                    case "HOR":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('HOR', this.id); });
                        el.maxLength = 5;

                        break;
                    case "DTH":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('DTH', this.id); });
                        el.maxLength = 16;

                        break;

                    case "HO2":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('HO2', this.id); });
                        el.maxLength = 8;

                        break;

                    case "TEL":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('TEL', this.id); });
                        el.maxLength = 16;

                        break;
                    case "TEU":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('TEU', this.id); });
                        el.maxLength = 16;

                        break;
                    case "CNP":
                        addEvent(el, 'keyup keypress keydown', function() { f._mask('CNP', this.id); });
                        el.maxLength = 18;

                        break;
                    case "CEP":
                        addEvent(el, "keyup keypress keydown", function() { f._mask('CEP', this.id); });
                        el.maxLength = 9;

                        break;
                    case "NU2":
                        addEvent(el, 'keyup', function() { f._mask('NU2', this.id); });

                        break;
                    case "NUM":
                        addEvent(el, 'keyup', function() { f._mask('NUM', this.id); });

                        break;
                    case "FLO":
                        addEvent(el, 'keyup', function() { f._mask('FLO', this.id); });

                        break;
                    case "DIN":
                        addEvent(el, 'keyup', function() { f._mask('DIN', this.id); });
                        el.maxLength = 15;

                        break;
                }
            }
        }
    }

    this._showMessage = function(tmp_index) {
        var msgs = [];

        if (this.language == 1) {
            msgs[0] = 'Por favor complete o campo "%1"';
            msgs[1] = 'Caracter inválido colocado no campo %1';
            msgs[2] = 'Você precisa digitar uma senha.';
            msgs[3] = 'A confirmação da senha não é válida.';
            msgs[4] = 'Por favor complete o campo "%1" com formato dd/mm/aaaa';
            msgs[5] = 'Dados inválidos colocados no campo %1';
            msgs[6] = 'CPF Inválido!';
            msgs[7] = 'Por favor selecione uma opção para o campo "%1"';
            msgs[8] = 'Por favor complete o campo "%1" com formato hh:mm';
            msgs[9] = 'O campo "%1" deve conter pelo menos %2 caracteres.';
            msgs[10] = 'Por favor complete o campo "%1" com formato hh:mm:ss';
            msgs[11] = 'CNPJ Inválido!';
            msgs[12] = 'Tipo de arquivo inválido. \nO campo "%1" aceita somente arquivos com as extensões "%2".';
            msgs[13] = 'Por favor, complete o campo "%1" com formato dd/mm/aaaa hh:mm.';
            msgs[14] = 'Por favor, complete o campo "%1" com formato dd/mm.';
            msgs[15] = 'Por favor, complete o campo "%1" com formato AAA-9999.';
            msgs[16] = 'Mensagem de aviso.';
            msgs[17] = 'O campo do número do cartão TEU está incompleto.';
        } else if (this.language == 2) {
            msgs[0] = 'Please fill in the field "%1"';
            msgs[1] = 'Invalid character placed in the field %1';
            msgs[2] = 'You must enter a password.';
            msgs[3] = 'The confirmation password is not valid.';
            msgs[4] = 'Please fill in the field "%1" format dd/mm/aaaa';
            msgs[5] = 'Invalid data placed on the field %1';
            msgs[6] = 'CPF Invalid!';
            msgs[7] = 'Please select an option for the field "%1"';
            msgs[8] = 'Please fill in the field "%1" format hh:mm';
            msgs[9] = 'The field "%1" must contain at least %2 characters.';
            msgs[10] = 'Please fill in the field "%1" format hh:mm:ss';
            msgs[11] = 'CNPJ Invalid!';
            msgs[12] = 'Invalid file type. \nThe field "%1" accepts only files with the extensions "%2".';
            msgs[13] = 'Please, fill in the field "%1" format dd/mm/aaaa hh:mm.';
            msgs[14] = 'Please, fill in the field "%1" format dd/mm.';
            msgs[15] = 'Please, fill in the field "%1" format AAA-9999.';
            msgs[16] = 'Warning message.';
            msgs[17] = 'O campo do número do cartão TEU está incompleto.';
        } else if (this.language == 3) {
            msgs[0] = 'Por favor complete el campo "%1"';
            msgs[1] = 'Datos inválidos colocados en el campo %1';
            msgs[2] = 'Debe introducir una contraseña.';
            msgs[3] = 'La confirmación de la contraseña no es válida.';
            msgs[4] = 'Por favor complete el campo "%1" formato dd/mm/aaaa';
            msgs[5] = 'Datos inválidos colocados en el campo %1';
            msgs[6] = 'CPF Inválido!';
            msgs[7] = 'Por favor seleccione una opción para el campo "%1"';
            msgs[8] = 'Por favor complete el campo "%1" formato hh:mm';
            msgs[9] = 'El campo "%1" debe contener al menos %2 caracteres.';
            msgs[10] = 'Por favor complete el campo "%1" formato hh:mm:ss';
            msgs[11] = 'CNPJ Inválido!';
            msgs[12] = 'Tipo de archivo no válido. \nEl campo "%1" sólo acepta archivos con las extensiones "%2".';
            msgs[13] = 'Por favor, complete el campo "%1" formato dd/mm/aaaa hh:mm.';
            msgs[14] = 'Por favor, complete el campo "%1" formato dd/mm.';
            msgs[15] = 'Por favor, complete el campo "%1" formato AAA-9999.';
            msgs[16] = 'Mensaje de advertencia.';
            msgs[17] = 'O campo do número do cartão TEU está incompleto.';
        }

        var r = String(msgs[tmp_index]);
        for (var i = 1; i <= 5; i++) {
            r = r.replace("%" + i, arguments[i]);
        }
        if (typeof openAlert != 'undefined') {
            openAlert({ message: r, template: 'alert', width: '', height: '', overflow: '', titulo: msgs[16], input: formeu.msgObj });
        } else {
            alert(r);
        }
    }

    this._parseId = function(tmp_obj) {
        //TODO: multiplaslinguas
        var arrCommonLabel = {
            'nome': 'Nome',
            'endereco': 'Endereço',
            'telefone': 'Telefone',
            'celular': 'Celular',
            'complemento': 'Complemento',
            'numero': 'Número',
            'estado': 'Estado',
            'cep': 'CEP',
            'cidade': 'Cidade',
            'email': 'E-mail',
            'celular': 'Celular',
            'enviar': 'Enviar',
            'alterar': 'Alterar',
            'data': 'Data',
            'teu': 'Teu',
            'sexo': 'Sexo',
            'login': 'Login',
            'senha': 'Senha',
            'comentario': 'Comentário',
            'mensagem': 'Mensagem'
        };
        var tmp_id = tmp_obj.id;
        var i = 0;
        var underline = 0;
        var min_underline = (tmp_id.split(/_/g).length - 1);

        var type = '';
        var required;
        var label = '';
        var minchars = '';

        while (i < tmp_id.length) {
            if ((tmp_id.charAt(i) != '_') && (underline < min_underline)) {
                label = label + tmp_id.charAt(i);
            } else if (tmp_id.charAt(i) == '_') {
                underline++;
            } else if (underline == min_underline) {
                if (type.length < 3) {
                    type = type + tmp_id.charAt(i);
                } else {
                    if (tmp_id.charAt(i) == '0') {
                        required = false;
                    } else {
                        required = true;
                    }
                }
            }
            i++;
        }

        //format minchars
        if (minchars == '') {
            minchars = 0;
        }
        minchars = parseInt(minchars);

        //parse name
        if (tmp_obj.attributes['alt']) {
            if (tmp_obj.attributes['alt'].value !== '') {
                label = tmp_obj.attributes['alt'].value;
            } else {
                for (var i in arrCommonLabel) {
                    if (label === i) {
                        label = arrCommonLabel[i];
                        tmp_obj.setAttribute('alt', label);
                    }
                }
            }
        } else {
            for (var i in arrCommonLabel) {
                if (label === i) {
                    label = arrCommonLabel[i];
                    tmp_obj.setAttribute('alt', label);
                }
            }
        }

        return [label, type, required, minchars];
    }

    this._mask = function(tmp_type, tmp_id) {
        var obj = gebi(tmp_id);

        switch (tmp_type) {
            case "CPF":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XXX.XXX.XXX-XX");
                obj.value = value;

                break;
            case "PLA":
                var value = f._filterChars(obj.value.toUpperCase(), "QWERTYUIOPASDFGHJKLZXCVBNM0123456789");
                value = f._filterMask(value, "XXX-XXXX");
                obj.value = value;

                break;
            case "DAT":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XX/XX/XXXX");
                obj.value = value;

                break;
            case "DDM":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XX/XX");
                obj.value = value;

                break;
            case "DTH":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XX/XX/XXXX XX:XX");
                obj.value = value;

                break;
            case "HOR":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XX:XX");
                obj.value = value;

                break;
            case "HO2":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XX:XX:XX");
                obj.value = value;

                break;
            case "TEL":
                var value = f._filterChars(obj.value, "0123456789");
                // value = f._filterMask(value, "(XX) XXXXX-XXXX");
				if((value.length) == 10){
					value = f._filterMask(value, "(XX) XXXX-XXXX");
				}else{
					value = f._filterMask(value, "(XX) XXXXX-XXXX");
				}

                obj.value = value;

                break;
            case "CNP":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XX-XXX-XXX/XXXX-XX");
                obj.value = value;

                break;
            case "CEP":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XXXXX-XXX");
                obj.value = value;

                break;
            case "NUM":
                var value = f._filterChars(obj.value, "0123456789");
                obj.value = value;

                break;
            case "TEU":
                var value = f._filterChars(obj.value, "0123456789");
                value = f._filterMask(value, "XXXXXXXXXXXXXX-X");
                obj.value = value;

                break;

            case "NU2":
                var value = f._filterChars(obj.value, "-0123456789");
                obj.value = value;

                break;

            case "FLO":
                var value = f._filterChars(obj.value, "0123456789,");
                obj.value = value;

                break;
            case "DIN":
                var possui_menos = false;
                var n = '__0123456789-';
                var d = obj.value;
                var l = d.length;
                var r = '';
                var len = 15;
                var wa, wb, w, verificador, z, c, n, a;
                if (l > 0) {
                    z = d.substr(0, l - 1);
                    s = '';
                    a = 2;
                    for (var i = 0; i < l; i++) {
                        c = d.charAt(i);
                        if (n.indexOf(c) > a) {
                            a = 1;
                            s += c;
                            if (c == '-') { possui_menos = true; };
                        };
                    };
                    l = s.length;
                    t = len - 1;
                    if (l > t) {
                        l = t;
                        s = s.substr(0, t);
                    };
                    if (l > 2) { r = s.substr(0, l - 2) + ',' + s.substr(l - 2, 2); } else { if (l == 2) { r = '0,' + s; } else { if (l == 1) { r = '0,0' + s; }; }; };
                    if (r == '') { r = '0,00'; } else {
                        l = r.length;
                        if (possui_menos) { verificador = 7; } else { verificador = 6; }
                        if (l > verificador) {
                            j = l % 3;
                            w = r.substr(0, j);
                            wa = r.substr(j, l - j - 6);
                            wb = r.substr(l - 6, 6);
                            if (j > 0) { w += '.'; };
                            k = (l - j) / 3 - 2;
                            for (i = 0; i < k; i++) { w += wa.substr(i * 3, 3) + '.'; };
                            r = w + wb;
                        };
                    };
                };
                if (r.length <= len) { obj.value = r; } else { obj.value = z; };

                break;

        }
    }

    this._filterChars = function(tmp_valor, tmp_mask) {
        var txt = "";
        var i = 0;
        var c;

        while (i < tmp_valor.length) {
            c = tmp_valor.charAt(i);

            if (tmp_mask.indexOf(c) != -1) {
                txt += c;
            }

            i++;
        }

        return txt;
    }

    this._filterMask = function(tmp_valor, tmp_mask) {
        var txt = "";
        var txt2 = "";
        var i = 0;
        var c;
        var i2 = 0;
        var i_ultimo;
        var i_ultimo2 = 0;
        var i_ultimo_fake = true;

        while (i < tmp_mask.length) {
            c = tmp_mask.charAt(i);

            if (c == 'X') {
                if (tmp_valor.charAt(i2) != '') {
                    txt += tmp_valor.charAt(i2);
                    txt2 += tmp_valor.charAt(i2);
                    i2++;
                    i_ultimo = i;
                    i_ultimo2 = i2;
                } else {
                    i_ultimo_fake = false;
                }
            } else {
                if (i_ultimo2 < tmp_valor.length) {
                    txt2 += c;
                }
                txt += c;
            }

            i++;
        }

        if (i_ultimo_fake) {
            txt2 = txt;
        }

        return txt2;
    }

    this._maxlength = function(tmp_obj) {
        var tmp_obj
        var max = 0;
        var rows = 0;
        var cols = 0;

        if (tmp_obj.attributes['maxlength']) {
            max = tmp_obj.attributes['maxlength'].value;
        } else {
            cols = tmp_obj.cols;
            rows = tmp_obj.rows;
            if (typeOf(cols) === 'number') {
                cols++;
                cols--;
            }
            if (typeOf(rows) === 'number') {
                rows++;
                rows--;
            }
            max = cols * rows;
        }

        max++;
        max--;
        if (max > 0) {
            var content = tmp_obj.value;
            var counter = gebi(tmp_obj.id + '_counter');
            if (!(counter)) {
                return;
            }
            if (tmp_obj.value.length < (max + 1)) {
                if (counter) {
                    //counter.style.color = "#006400";
                }
            } else {
                if (counter) {
                    //counter.style.color = "#CC0000";
                }
                tmp_obj.value = content.substr(0, max);
            }
            if (counter) {
                counter.innerHTML = "" + (max - tmp_obj.value.length) + " caracteres";
            }
        }
    }
}
var f = new Form();
addEvent(window, 'load', f.maskFields);