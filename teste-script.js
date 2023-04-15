/**
 * Script utilizado para testar via console do navegador a atualização dos valores de frete de acordo com a quantidade
 * de produtos.
 */

// classe box-qtd input value que contém as quantidades
// Obter o total de quantidades

// id total-carrinho que contém a soma dos produtos (textContent)
// id retorno-valor-frete-pac que contém o valor do frete PAC (textContent)
// id retorno-valor-frete-sedex que contém o valor do frete SEDEX (textContent)
// id total-geral que contém o valor total do carrinho de compras (frete + produtos) dentro da tag <span></span> (textContent)

// ### Funções ###
//convertNumberFormatBR(num) - Converte float 9.99 ou int 9 em string no formato brasileiro "9,99"
// convertNumberBRparaFloat(num) - Converte string do formato brasileiro "9,99" para float 9.99

let quantidade_total = 0;
document.querySelectorAll('.box-qtd').forEach(function(el) {
    quantidade_total += parseInt(el.value);
});
console.log(quantidade_total);

total_carrinho = convertNumberBRparaFloat(document.querySelector('#total-carrinho').textContent);
frete_pac = convertNumberBRparaFloat(document.querySelector('#retorno-valor-frete-pac').textContent);
frete_sedex = convertNumberBRparaFloat(document.querySelector('#retorno-valor-frete-sedex').textContent);
total_geral = convertNumberBRparaFloat(document.querySelector('#total-geral > span').textContent);

frete_pac = frete_pac * quantidade_total;
frete_sedex = frete_sedex * quantidade_total;
total_geral = total_geral + frete_pac;

document.querySelector('#retorno-valor-frete-pac').textContent = convertNumberFormatBR(frete_pac);
document.querySelector('#retorno-valor-frete-sedex').textContent = convertNumberFormatBR(frete_sedex);
document.querySelector('#pac').value = convertNumberFormatBR(frete_pac);
document.querySelector('#sedex').value = convertNumberFormatBR(frete_sedex);
document.querySelector('#total-geral > span').textContent = convertNumberFormatBR(total_geral);