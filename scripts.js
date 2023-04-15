window.onload = function() {

    /**
     * Seleciona todos os elementos com a classe "btn-adicionar" e adiciona um evento de clique a eles.
     * Quando clicado, é capturado o ID e o valor do atributo "data" do botão clicado e passado para a função "addCarrinho".
     * @returns {void}
     */
    document.querySelectorAll('.btn-adicionar').forEach(function(botao) {
        botao.addEventListener('click', function() {
            var id = this.getAttribute('data-id');
            var valor = this.getAttribute('data-value');
            addCarrinho(id, valor);
        });
    });

    /**
     * Adiciona eventos de clique aos botões de alteração da quantidade de itens no carrinho.
     * Atualiza o valor total do carrinho e armazena as alterações no armazenamento local.
     * @function
     */
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

    /**
     * Adiciona um listener de evento blur em todos os elementos com classe "box-qtd", que executa ações como resetar o carrinho,
     * verificar a quantidade digitada pelo usuário, calcular o valor do produto a partir da quantidade, atualizar o valor exibido na página
     * e exibir um log no console com informações sobre a operação realizada.
     */
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

    /**
     * Seleciona o botão de limpar carrinho e adiciona um listener de clique que chama a função "limparCarrinho".
     */
    const btnLimpar = document.querySelector('#btn-limpar');
    btnLimpar.addEventListener('click', function() {
        limparCarrinho();
    });

    /**
     * Verifica se o botão de cálculo de frete existe na página e adiciona um ouvinte de evento de clique.
     * Quando o botão é clicado, chama as funções calcularFrete() e atualizaTotalCarrinho() com um atraso de 1.2 segundos.
     */
    if (document.querySelector('#btn-calcula-frete')) {
        const btnCalculaFrete = document.querySelector('#btn-calcula-frete');
        btnCalculaFrete.addEventListener('click', function() {
            calcularFrete();
            setTimeout(atualizaTotalCarrinho, 1200);
            setTimeout(atualizaTotalCarrinhoQuantidade, 2000);
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

/**
 * Cria e retorna um objeto com funções para manipulação de dados em localStorage.
 * @param {string} table - O nome da tabela a ser criada ou manipulada.
 * @returns {Object} - O objeto com funções para manipulação de dados.
 */
function dbStorage(table) {

    /**
     * Retorna todos os dados de uma tabela em localStorage.
     * @returns {Array|Number} - Um array com todos os dados da tabela ou 0 caso a tabela não exista.
     */
    function all() {
        if (JSON.parse(localStorage.getItem(table)) === null) {
            return 0;
        } else {
            return JSON.parse(localStorage.getItem(table));
        }
    }

    /**
     * Adiciona um novo registro em uma tabela em localStorage.
     * @param {Array} data - O array de dados da tabela.
     * @param {Object} reg - O objeto com os dados do novo registro.
     * @param {string} cod - O código do registro, se existir.
     */
    function add(data, reg, cod) {
        if (cod !== "") {
            data[cod] = reg;
        } else {
            data.push(reg);
        }
        localStorage.setItem(table, JSON.stringify(data));
    }

    /**
     * Exclui uma tabela em localStorage.
     */
    function del() {
        localStorage.removeItem(table);
    }

    return {
        all,
        add,
        del
    }
}

/**
 * Adiciona um item ao carrinho de compras.
 * @param {string} id - O identificador do item a ser adicionado.
 * @param {string} valor - O valor do item a ser adicionado.
 * @returns {void}
 */
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

/**
 * Limpa o carrinho de compras removendo todos os itens armazenados na base de dados local e atualiza a quantidade de itens exibida no ícone do carrinho.
 */
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

/**
 * Multiplica um número no formato "R$ X,XX" por outro número e retorna o resultado formatado como "R$ Y,YY".
 * @param {string} valor - O valor a ser multiplicado no formato "R$ X,XX".
 * @param {number} multiplicador - O número pelo qual o valor será multiplicado.
 * @returns {string} - O resultado da multiplicação formatado como "R$ Y,YY".
 */
function multiplicarFormatBr(valor, multiplicador) {
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");
    num = parseFloat(valor);
    res = num * multiplicador;
    resFormatado = res.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return resFormatado;
}

/**
 * Divide um número no formato "R$ X,XX" por outro número e retorna o resultado formatado como "R$ Y,YY".
 * @param {string} valor - O valor a ser dividido no formato "R$ X,XX".
 * @param {number} divisor - O número pelo qual o valor será dividido.
 * @returns {string} - O resultado da divisão formatado como "R$ Y,YY".
 */
function dividirFormatBr(valor, divisor) {
    valor = valor.replace(".", "");
    valor = valor.replace(",", ".");
    num = parseFloat(valor);
    res = num / divisor;
    resFormatado = res.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return resFormatado;
}

/**
 * Função que recebe um seletor CSS como parâmetro e calcula a soma dos valores contidos no textContent dos elementos selecionados pelo seletor.
 * @param {string} el - Seletor CSS que define os elementos a serem selecionados para o cálculo.
 * @returns {string} - Retorna uma string formatada como valor monetário em reais (R$) com duas casas decimais separadas por vírgula e pontos para separar milhares.
 */
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

/**
 * Calcula a soma dos valores numéricos contidos em um conjunto de elementos HTML.
 * @param {string} el - O seletor CSS dos elementos a serem somados.
 * @returns {string} - O valor da soma formatado em moeda brasileira.
 */
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

/**
 * Converte um número no formato brasileiro (com vírgula como separador decimal) para um número de ponto flutuante.
 * @param {string} num - O número no formato brasileiro.
 * @returns {number} - O número de ponto flutuante equivalente.
 */
function convertNumberBRparaFloat(num) {
    conteudo = num;
    conteudo = conteudo.replace(".", "");
    conteudo = conteudo.replace(",", ".");
    valor = parseFloat(conteudo);
    return valor;
}

/**
 * Converte um número para o formato brasileiro (com vírgula como separador decimal e dois dígitos após a vírgula).
 * @param {number} num - O número a ser convertido.
 * @returns {string} - O número no formato brasileiro.
 */
function convertNumberFormatBR(num) {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Faz uma solicitação AJAX para calcular o valor do frete com base no CEP informado pelo usuário.
 */
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

/**
 * Reseta os valores exibidos na tela de cálculo de frete.
 */
function reset() {
    document.getElementById('valor-frete').innerHTML = '';
    document.getElementById('total-geral').innerHTML = '';
    document.getElementById('hr-total').style.display = 'none';
}

/**
 * Atualiza o valor total do carrinho de compras com base no valor do frete selecionado.
 */
function atualizaTotalCarrinho() {
    let valorFrete = '';
    if (document.querySelector('#total-carrinho')) {
        let totalCarrinho = document.querySelector('#total-carrinho').textContent;
        if (document.querySelector('#total-carrinho')) {
            if (document.querySelector('#retorno-valor-frete-pac')) {
                valorFrete = document.querySelector('#retorno-valor-frete-pac').textContent;
            }

            //valorFrete = document.querySelector('#retorno-valor-frete-sedex').textContent;
        }

        let valorAtualizado = convertNumberBRparaFloat(totalCarrinho) + convertNumberBRparaFloat(valorFrete);
        document.querySelector('#total-geral').innerHTML = 'Total da Compra: R$ <span>' + convertNumberFormatBR(valorAtualizado) + '</span>';
        document.getElementById('hr-total').style.display = 'block';
    }
}

function atualizaTotalCarrinhoQuantidade() {
    let quantidade_total = 0;
    document.querySelectorAll('.box-qtd').forEach(function(el) {
        quantidade_total += parseInt(el.value);
    });
    console.log(quantidade_total);

    total_carrinho = convertNumberBRparaFloat(document.querySelector('#total-carrinho').textContent);
    frete_pac = convertNumberBRparaFloat(document.querySelector('#retorno-valor-frete-pac').textContent);
    frete_sedex = convertNumberBRparaFloat(document.querySelector('#retorno-valor-frete-sedex').textContent);
    if (document.querySelector('#total-geral')) {
        total_geral = convertNumberBRparaFloat(document.querySelector('#total-geral > span').textContent);
    }


    frete_pac = frete_pac * quantidade_total;
    frete_sedex = frete_sedex * quantidade_total;
    total_geral = total_geral + frete_pac;

    document.querySelector('#retorno-valor-frete-pac').textContent = convertNumberFormatBR(frete_pac);
    document.querySelector('#retorno-valor-frete-sedex').textContent = convertNumberFormatBR(frete_sedex);
    document.querySelector('#pac').value = convertNumberFormatBR(frete_pac);
    document.querySelector('#sedex').value = convertNumberFormatBR(frete_sedex);
    document.querySelector('#total-geral > span').textContent = convertNumberFormatBR(total_geral);

}

/**
 * Atualiza o valor total do carrinho de compras com base no valor do frete selecionado através de um input radio.
 * @param {HTMLInputElement} inputRadio - O input radio clicado que contém o valor do frete selecionado.
 */
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
        document.querySelector('#total-geral').innerHTML = 'Total da Compra: R$ <span>' + convertNumberFormatBR(valorAtualizado) + '</span>';
        document.getElementById('hr-total').style.display = 'block';
    }
}