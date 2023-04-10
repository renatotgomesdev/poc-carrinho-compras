<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>POC - Carrinho de Compras</title>
    <link rel="stylesheet" href="styles.css">
    <style>

    </style>
</head>

<body>
    <h1>POC - Carrinho de Compras com Cálculo de Envio pelos Correios</h1>
    <hr>
    <div style="display: inline-block;">
        <a href="/" class="btn btn-primary">Início</a>
        <button class="btn btn-danger" id="btn-limpar">Limpar Dados</button>
    </div>
    <div style="display: inline-block;">
        <form action="resultado.php" method="GET">
            <div class="carrinho-compras">
                <input type="hidden" id="carrinho" name="carrinho" value="0">
                <button type="submit" class="btn alert-dark label-carrinho">Carrinho de Compras</button>
                <button type="submit" class="btn alert-dark carrinho label-carrinho btn-label-carrinho">0</button>
            </div>
        </form>
    </div>
    <hr>
    <h1>Carrinho de Compras</h1>
    <?php
    $teste = json_decode($_GET['carrinho']);
    //echo var_dump($teste);

    if ($teste) {
        foreach ($teste as $index => $rs) {
            echo '<p>Produto: ' . $rs->id
                . ' - Quantidade: <button type="button" class="btn-qtd btn-border-start">-</button><input type="text" class="text-center box-qtd" value="' . $rs->qtd . '"><button type="button" class="btn-qtd btn-border-end">+</button> - R$ <span class="valor-item">' . $rs->valor . '</span><input type="hidden" class="valorUnitario" data-qtd="' . $rs->qtd . '" data-id="' . $rs->id . '" data-cod="' . $index . '" value="' . ($rs->valor) . '"></p>';
        }
        echo '<hr class="m-0">';
    ?>
        <form class="mt-1">
            <label for="cep">Informe seu CEP</label>
            <input type="text" id="cep" placeholder="Informe seu CEP" class="btn form-control">
            <button type="button" class="btn btn-primary" id="btn-calcula-frete">Calcular Frete</button>
        </form>
        <hr>
        <h4 class="m-0 mt-1">Total Produtos: R$ <span id="total-carrinho">2</span></h4>
        <hr>
        <h5 class="m-0 mt-1" id="valor-frete"></h5>
        <hr id="hr-total" class="mt-1" style="display: none;">
        <h3 class="m-0" id="total-geral" style="color: red;"></h3>
    <?php
    } else {
        echo 'Carrinho vazio.';
    }
    ?>
    <script src="scripts.js"></script>
</body>

</html>