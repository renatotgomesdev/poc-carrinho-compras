// ===== [ Inicio - window.onload ] - Executa somente depois que toda a página HTML é completamente carregada =====
window.onload = function () { // Contruct
    // Executa somente se o elemento com id "itens-total" existir
    if (document.getElementById('itens-total')) {
        elItensTotal = document.getElementById('itens-total'); // Atribui a variável elItensTotal o elemento
        elItensTotal.textContent = totalItens(); // Atualizar o total de itens/produtos do carrinho de compras
    }

    // Executa as funções
    botaoAjusteQuantidade();
    boxAjusteQuantidade();
    adicionaCarrinhoCompra();
    elRadioFrete();

    // Define a função no botão "Limpar Dados"
    const btnLimpar = document.querySelector('#btn-limpar');
    btnLimpar.addEventListener('click', function () {
        limparCarrinho(); // Função deleta os dados do localStorage
    });

    // Botão Calcular Frete
    if (document.querySelector('#btn-calcula-frete')) {
        btnCalculaFrete = document.querySelector('#btn-calcula-frete');
        btnCalculaFrete.addEventListener('click', function () {
            calcularFrete(); // Executa a função
        });
    }

    let db = new dbStorage("itens"); // Instancia a função dbStorage
    let itens = db.all(); // Atribui todos os registros do localStorge na variável itens
    
    if (itens) { // Executa se a variável itens não for vazia
        document.querySelector('.carrinho').textContent = itens.length; // Atualiza a quantidade de itens no botão carrinho de compras
        document.querySelector('#carrinho').value = JSON.stringify(itens); // Atualiza o value da input carrinho
    }
    else { // Executa se a variável itens estiver vazia
        document.querySelector('.carrinho').textContent = 0; // Define 0 no botão carrinho de compras
        document.querySelector('#carrinho').value = 0; // Define 0 no value da inputa carrinho
    }

    // Executa de o elemnto id="total-produtos" existir na página
    if (document.querySelector('#total-produtos')) {
        document.querySelector('#total-produtos').textContent = calculaTextContent(".valor-item"); // Atualiza o valor total de produtos
    }

    // Atualizar o valor unitário do produto na value das inputs com classe "valorUnitario"
    document.querySelectorAll('.valorUnitario').forEach(function (el) {
        let valorTotal = el.value;
        let valorQtd = el.getAttribute('data-qtd');
        el.value = dividirFormatBr(valorTotal, valorQtd);
    });

} // ===== [Fim - window.load] =====

// ===== [Inicio - Funções de manipulação do localStorage] =====
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
        itens.forEach(function (value, index) {
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
 * Função responsável por atualizar a quantidade e valor de um produto no localStorage.
 *
 * @param {string} id - O id do produto a ser atualizado.
 * @param {number} qtd - A nova quantidade do produto.
 * @param {number} valor - O novo valor do produto.
 * @param {string} index - O index é o indice do array.
 * @returns {void}
 *
 * @example
 * // Atualiza a quantidade e o valor do produto com id "1" para 3 unidades, R$ 50,00 e indice 1 do array.
 * atualizaQuantidadelocalStorage("2", 3, 50.00, "1");
 */
 function atualizaQuantidadelocalStorage(id, qtd, valor, index) {
    // Atualizar a quantidade e o valor do produto no localStorage
    let db = new dbStorage("itens");
    let itens = db.all();
    var item = {
        id: id,
        qtd: qtd,
        valor: valor
    };
    db.add(itens, item, index);
}

// ===== [Fim - Funções de manipulação no localStorage] =====

// ===== [Inicio - Funções Auxiliáres] =====

/**
 * Adicionar item ao Carrinho de Compras
 * @returns {void}
 */
function adicionaCarrinhoCompra() {
    document.querySelectorAll('.btn-adicionar').forEach(function (botao) {
        botao.addEventListener('click', function () {
            var id = this.getAttribute('data-id');
            var valor = this.getAttribute('data-value');
            addCarrinho(id, valor);
        });
    });
}

/**
 * Calcula o total de itens/produtos somando as quantidades de cada item/produto presentes em elementos com a classe '.box-qtd'.
 * @return {number} Retorna o total de itens/produtos.
 */
function totalItens() {
    let total = 0;
    /**
     * Atribui a variável inputQuantidadeItens todos os elementos do documento que possuem a classe CSS '.box-qtd'.
     * A classe '.box-qtd' é onde fica armazenado o valor da quantidade de cada item/produto
     */
    let inputQuantidadeItens = document.querySelectorAll('.box-qtd');
    inputQuantidadeItens.forEach(function (el) {
        total += parseInt(el.value);
    });
    return total;
}

/**
 * Função que atrubui a funcionalidade nos botões de ajuste de quantidade de itens/produtos
 *
 * @returns {void}
 */
function botaoAjusteQuantidade() {
    document.querySelectorAll('.btn-qtd').forEach(function (botao) {
        botao.addEventListener('click', function () {
            ocultaFrete();
            var op = this.textContent;
            if (op == '-') { // Executa se for pressionado o botão de diminuir quantidade
                var qtd = parseInt(this.nextSibling.value) - 1;
                if (qtd < 1) qtd = 1; // Impede que a quantidade seja menor que 1
                this.nextSibling.value = qtd;
                var valor = this.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.value;
                //var valor_unit = valor;
                var cod = this.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-cod');
                var id = this.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-id');
                valor = multiplicarFormatBr(valor, qtd);
                this.nextSibling.nextSibling.nextSibling.nextSibling.textContent = valor;
            } else { // Executa se for clicado o botão de aumentar quantidade
                var qtd = parseInt(this.previousSibling.value) + 1;
                this.previousSibling.value = qtd;
                var valor = this.nextSibling.nextSibling.nextSibling.value;
                //var valor_unit = valor;
                var cod = this.nextSibling.nextSibling.nextSibling.getAttribute('data-cod');
                var id = this.nextSibling.nextSibling.nextSibling.getAttribute('data-id');
                valor = multiplicarFormatBr(valor, qtd);
                this.nextSibling.nextSibling.textContent = valor;
            }

            // Atualiza o valor total do produto de acordo com a quantidade
            document.querySelector('#total-produtos').textContent = calculaTextContent(".valor-item");

            atualizaQuantidadelocalStorage(id, qtd, valor, cod);

            // ======= [ Ínicio - Testes ] =======

            // Atualia a quantidade total de itens/produtos do carrinho de compras
            if (elItensTotal) elItensTotal.textContent = totalItens();

            // ======= [ Fim - Testes ] =======
        });
    });
}

/**
 * Função que atualiza a quantidade de itens/produtos digitados diretamente na box (input) quantidade
 * 
 * @returns {void}
 */
function boxAjusteQuantidade() {
    // Atualizar a quantiade e o valor digitado diretamente no campo (input)
    document.querySelectorAll('.box-qtd').forEach(function (botao) {
        botao.addEventListener('blur', function () {
            ocultaFrete();
            var qtd = this.value; // Obtém a quantidade

            // Impede que a quantidade seja menor que 1
            if (qtd < 1) {
                qtd = 1;
                this.value = qtd;
            }
            var valor = this.nextSibling.nextSibling.nextSibling.nextSibling.value; // Obtém o valor do produto
            var id = this.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-id'); // Obtém o id do produto
            var cod = this.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute('data-cod'); // Obtém o indice do array
            valor = multiplicarFormatBr(valor, qtd); // Função que multiplica o valor pela quantidade e retorna o resultado
            this.nextSibling.nextSibling.nextSibling.textContent = valor; // Atualizar o valor de acordo com a quantidade
            document.querySelector('#total-produtos').textContent = calculaTextContent(".valor-item"); // Atualizar o valor total do carrinho de compras

            atualizaQuantidadelocalStorage(id, qtd, valor, cod);

            // ======= [ Ínicio - Testes ] =======

            // Atualia a quantidade total de itens/produtos do carrinho de compras
            if (elItensTotal) elItensTotal.textContent = totalItens();

            // ======= [ Fim - Testes ] =======
        });
    });
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
    document.querySelectorAll(el).forEach(function (elemento) {
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
    document.querySelectorAll(el).forEach(function (elemento) {
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
// ===== [Fim - Funções para tratamento com localStorage] =====


// ===== [Inicio - Funções manipulação do frete] =====

/**
 * Faz uma solicitação AJAX para calcular o valor do frete com base no CEP informado pelo usuário.
 */
function calcularFrete() {
    let loading = document.querySelector('.carregando');
    loading.style.display = 'inline-block';
    btnCalculaFrete.style.display = 'none';

    var cep = document.getElementById("cep").value; // Captura o valor do input cep

    // Cria uma solicitação AJAX
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                try {
                    dados_frete = JSON.parse(xhr.responseText);
                    //return dados_frete;
                    let valorFretePac = multiplicarFormatBr(dados_frete[0].Valor, totalItens());
                    let valorFreteSedex = multiplicarFormatBr(dados_frete[1].Valor, totalItens());
                    document.getElementById('radio-pac').value = valorFretePac;
                    document.getElementById('valor-pac').textContent = valorFretePac;
                    document.getElementById('prazo-pac').textContent = dados_frete[0].PrazoEntrega;
                    document.getElementById('radio-sedex').value = valorFreteSedex;
                    document.getElementById('valor-sedex').textContent = valorFreteSedex;
                    document.getElementById('prazo-sedex').textContent = dados_frete[1].PrazoEntrega;
                    elRadioFrete();
                    loading.style.display = 'none';
                    btnCalculaFrete.style.display = 'inline-block';
                    document.getElementById('exibeFrete').style.display = "block";
                } catch (e) {
                    alert('Verifique se você informou o CEP corretamente.\nSe o erro persistir, comunique o suporte técnico.')
                    console.log('Erro: O retorno não é um formato JSON válido');
                    console.log('Erro retornado: ' + e);
                    loading.style.display = 'none';
                    btnCalculaFrete.style.display = 'inline-block';
                }
            } else {
                alert('Verifique se você informou o CEP corretamente.\nSe o erro persistir, comunique o suporte técnico.')
                console.log('Erro de solicitação: ' + xhr.status);
                loading.style.display = 'none';
                btnCalculaFrete.style.display = 'inline-block';
            }
        }

    };
    xhr.open('GET', 'calcular_api_remota.php?cep=' + cep, true);
    xhr.send();
}

/**
 * Oculta informações de frete
 */
function ocultaFrete() {
    document.getElementById('exibeFrete').style.display = 'none';
}

/**
 * Atualiza o valor total do carrinho com base no valor do frete.
 * @param {string} valorFrete - O valor do frete a ser adicionado ao total do carrinho.
 * @returns {void}
 */
function atualizaTotalCarrinho(valorFrete) {
    if (document.querySelector('#total-produtos')) {
        let elTotalProdutos = document.querySelector('#total-produtos');
        let elTotalCarrinho = document.querySelector('#total-carrinho');
        let valorTotalProdutos = elTotalProdutos.textContent;
        let valorTotalCarrinho = 0;
        if (valorFrete) {
            valorTotalCarrinho = convertNumberBRparaFloat(valorTotalProdutos) + convertNumberBRparaFloat(valorFrete);
            elTotalCarrinho.innerHTML = 'Total da Compra: R$ <span>' + convertNumberFormatBR(valorTotalCarrinho) + '</span>';
        } else {
            elTotalCarrinho.innerHTML = 'Total da Compra: R$ <span>' + valorTotalProdutos + '</span>';
        }
    }
}

/**
 * Atualizar o valor total do Carrinho de Compra de acordo com a opção de frete selecionado
 * @returns {void}
 */
function elRadioFrete() {
    if (document.querySelectorAll('input[type=radio][name=envio]')) {
        const inputsRadio = document.querySelectorAll('input[type=radio][name=envio]');
        inputsRadio.forEach(function (radio) {
            atualizaTotalCarrinho(inputsRadio[0].value);
            radio.addEventListener('click', function () {
                atualizaTotalCarrinho(radio.value);
            });
        });
    }
}

// ===== [Fim - Funções manipulação do frete] =====