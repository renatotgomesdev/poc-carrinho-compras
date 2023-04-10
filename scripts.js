window.onload = function() {
    document.querySelectorAll('.btn-adicionar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            var id = this.getAttribute('data-id');
            var valor = this.getAttribute('data-value');
            addCarrinho(id, valor);
        });
    });

    document.querySelectorAll('.btn-qtd').forEach(function(botao) {
        botao.addEventListener('click', function() {
            reset();
            var op = this.textContent;
            if (op == '-') {
                var qtd = parseInt(this.nextSibling.value) - 1;
                if (qtd < 1) qtd = 1;
                this.nextSibling.value = qtd;
                var valor = this.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value;
                //var valor_unit = valor;
                var cod = this.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-cod');
                var id = this.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-id');
                valor = multiplicarFormatBr(valor, qtd);
                this.nextSibling.nextSibling.nextSibling.nextSibling.textContent = valor;
            } else {
                var qtd = parseInt(this.previousSibling.value) + 1;
                this.previousSibling.value = qtd;
                var valor = this.nextSibling.nextSibling.nextSibling.value;
                //var valor_unit = valor;
                var cod = this.nextSibling.nextSibling.nextSibling.getAttribute('data-cod');
                var id = this.nextSibling.nextSibling.nextSibling.getAttribute('data-id');
                valor = multiplicarFormatBr(valor, qtd);
                this.nextSibling.nextSibling.textContent = valor;
            }
            document.querySelector('#total-carrinho').textContent = calculaTextContent(".valor-item");
            console.log('Operação: ' + op + '\nQuantidade: ' + qtd + '\nValor: R$ ' + multiplicarFormatBr(valor, qtd));
            let db = new dbStorage("itens");
            var item = {
                id: id,
                qtd: qtd,
                valor: valor
            };
            db.add(itens, item, cod);
        });
    });

    document.querySelectorAll('.box-qtd').forEach(function(botao) {
        botao.addEventListener('blur', function() {
            reset();
            var qtd = this.value;
            if (qtd < 1) {
                qtd = 1;
                this.value = qtd;
            }
            var op = 0;
            var valor = this.nextSibling.nextSibling.nextSibling.nextSibling.value;
            var cod = this.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-cod');
            valor = multiplicarFormatBr(valor, qtd);
            this.nextSibling.nextSibling.nextSibling.textContent = valor;
            document.querySelector('#total-carrinho').textContent = calculaTextContent(".valor-item");
            console.log('Operação: ' + op + '\nQuantidade: ' + qtd + '\nValor: R$ ' + multiplicarFormatBr(valor, qtd));
        });
    });

    const btnLimpar = document.querySelector('#btn-limpar');
    btnLimpar.addEventListener('click', function() {
        limparCarrinho();
    });

    if (document.querySelector('#btn-calcula-frete')) {
        const btnCalculaFrete = document.querySelector('#btn-calcula-frete');
        btnCalculaFrete.addEventListener('click', function() {
            calcularFrete();
            setTimeout(atualizaTotalCarrinho, 1200);
        });
    }

    let db = new dbStorage("itens");
    let itens = db.all();
    if (itens) {
        document.querySelector('.carrinho').textContent = itens.length;
        document.querySelector('#carrinho').value = JSON.stringify(itens);
    } else {
        document.querySelector('.carrinho').textContent = 0;
        document.querySelector('#carrinho').value = 0;
    }

    if (document.querySelector('#total-carrinho')) {
        document.querySelector('#total-carrinho').textContent = calculaTextContent(".valor-item");
    }


    //debugger
    document.querySelectorAll('.valorUnitario').forEach(function(el) {
        let valorTotal = el.value;
        let valorQtd = el.getAttribute('data-qtd');
        el.value = dividirFormatBr(valorTotal, valorQtd);
    });

}

function dbStorage(table) {
    function all() {
        if (JSON.parse(localStorage.getItem(table)) === null) {
            return 0;
        } else {
            return JSON.parse(localStorage.getItem(table));
        }
    }

    function add(data, reg, cod) {
        if (cod !== "") {
            data[cod] = reg;
        } else {
            data.push(reg);
        }
        localStorage.setItem(table, JSON.stringify(data));
    }

    function del() {
        localStorage.removeItem(table);
    }

    return {
        all,
        add,
        del
    }
}

function addCarrinho(id, valor) {
    var db = new dbStorage("itens");
    var itemExist = false;

    if (db.all()) {
        var itens = db.all();
    } else {
        var itens = [];
    }

    var item = {
        id: id,
        qtd: 1,
        valor: valor
    };

    if (itens.length > 0) {
        itens.forEach(function(value, index) {
            if (value.id == id) {
                itemExist = true;
            }
        });
    }

    if (itemExist) {
        alert("Este item já está em seu carrinho.");
    } else {
        db.add(itens, item, "");
        itens = db.all();
        if (itens) {
            document.querySelector('.carrinho').textContent = itens.length;
            document.querySelector('#carrinho').value = JSON.stringify(itens);;
        } else {
            document.querySelector('.carrinho').textContent = 0;
            document.querySelector('#carrinho').value = 0;
        }

        alert("Item incluído no carrinho com sucesso.");
    }

}

function limparCarrinho() {
    var db = new dbStorage("itens");
    db.del();
    itens = db.all();
    if (itens) {
        document.querySelector('.carrinho').textContent = itens.length;
    } else {
        document.querySelector('.carrinho').textContent = 0;
    }
    //alert("Itens excluídos com sucesso.");
    //locatin.reload();
    location.href = "/";
}

function multiplicarFormatBr(valor, multiplicador) {
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");
    num = parseFloat(valor);
    res = num * multiplicador;
    resFormatado = res.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return resFormatado;
}

function dividirFormatBr(valor, divisor) {
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");
    num = parseFloat(valor);
    res = num / divisor;
    resFormatado = res.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return resFormatado;
}

function calculaTextContent(el) {
    let soma = 0;
    document.querySelectorAll(el).forEach(function(elemento) {
        conteudo = elemento.textContent;
        conteudo = conteudo.replace(".", "");
        conteudo = conteudo.replace(",", ".");
        valor = parseFloat(conteudo);
        soma += valor;
    });
    return soma.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
}

function calcularValue(el) {
    let soma = 0;
    document.querySelectorAll(el).forEach(function(elemento) {
        conteudo = elemento.value;
        conteudo = conteudo.replace(".", "");
        conteudo = conteudo.replace(",", ".");
        valor = parseFloat(conteudo);
        soma += valor;
    });
    return soma.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
}

function convertNumberBRparaFloat(num) {
    conteudo = num;
    conteudo = conteudo.replace(".", "");
    conteudo = conteudo.replace(",", ".");
    valor = parseFloat(conteudo);
    return valor;
}

function convertNumberFormatBR(num) {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calcularFrete() {
    // Captura o valor do input cep
    var cep = document.getElementById("cep").value;

    // Cria uma solicitação AJAX
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            // Atualiza o valor do span valor-frete com a resposta do servidor
            document.getElementById("valor-frete").innerHTML = xhr.responseText;
        }
    };
    xhr.open('GET', 'calcular.php?cep=' + cep, true);
    xhr.send();
}

function reset() {
    document.getElementById('valor-frete').innerHTML = '';
    document.getElementById('total-geral').innerHTML = '';
    document.getElementById('hr-total').style.display = 'none';
}

function atualizaTotalCarrinho() {
    let valorFrete = '';
    if (document.querySelector('#total-carrinho')) {
        let totalCarrinho = document.querySelector('#total-carrinho').textContent;
        if (document.querySelector('#total-carrinho')) {
            valorFrete = document.querySelector('#retorno-valor-frete-pac').textContent;
            //valorFrete = document.querySelector('#retorno-valor-frete-sedex').textContent;
        }

        let valorAtualizado = convertNumberBRparaFloat(totalCarrinho) + convertNumberBRparaFloat(valorFrete);
        document.querySelector('#total-geral').textContent = 'Total da Compra: R$ ' + convertNumberFormatBR(valorAtualizado);
        document.getElementById('hr-total').style.display = 'block';
    }
}

function atualizaTotalCarrinhoRadio(inputRadio) {
    let valorFrete = '';
    if (document.querySelector('#total-carrinho')) {
        let totalCarrinho = document.querySelector('#total-carrinho').textContent;
        if (document.querySelector('#total-carrinho')) {
            // Remove o atributo "checked" de todos os inputs com o mesmo nome
            var inputs = document.getElementsByName(inputRadio.name);
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].removeAttribute("checked");
            }
            // Adiciona o atributo "checked" no input clicado
            inputRadio.setAttribute("checked", true);
            // Obtém o valor do input clicado e exibe no console
            valorFrete = inputRadio.value;
            //console.log(valor);
        }

        let valorAtualizado = convertNumberBRparaFloat(totalCarrinho) + convertNumberBRparaFloat(valorFrete);
        document.querySelector('#total-geral').textContent = 'Total da Compra: R$ ' + convertNumberFormatBR(valorAtualizado);
        document.getElementById('hr-total').style.display = 'block';
    }
}