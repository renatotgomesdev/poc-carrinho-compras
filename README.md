# Carrinho de Compras de uma Loja Virtual
## POC (Proof of Concept) - Prova de Conceito
##### Desenvolvido em HTML, CSS, JavaScript e PHP
### Objetivo: Simular um Carrinho de Compras de uma Loja Virtual implementando também a API dos Correios para cálcular o frete


#### Página Inicial
Na página inicial index.html é exibido 3 botões simulando os produtos (Item 1, Item 2 e Item 3).

Ao clicar nesses itens, é adicionado no localStorage através o JavaScript e atualizdo a quantidade no botão Carrinho de Compras.

Ao clicar no botão carrinho de compras é redirecionado para a página do Carrinho de Compras, onde é listado os dados dos produtos (itens) com a quantidade inicial de 1. 

#### Página Carrinho de Compras
O usuário poderá aumentar a quantidade ou diminuor clicando nos botões + e -. Também pode clicar direto no campo quantidade e digitar a nova quantidade.

Conforme o usuário aumenta ou diminui a quantidade do produto (item) os valores são atualizados automáticamente.

#### Implementação API Correios para calcular o frete de envio
O usuário poderá informar o CEP de destino que será feito o cálculo do frete (Para essa simulação, por enquanto somente considerano 1 item/produto).

### Refatorações
- 15/04/2023 - Criado função para atualizar o valor do frete de acordo com a quantidade de produtos.

- 20/04/2023 - Realizado melhoras e ajustes na obtenção, retorno e exibição dos valores de frete dos correios. O no retorno converte o XML para JSON e processa as informações e efetua os cálculos de acordo com a quantidade no JavaScript.
