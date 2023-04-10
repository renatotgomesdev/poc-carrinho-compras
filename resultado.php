<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultado</title>
    <link rel="stylesheet" href="styles.css">
</head>

<body>
    <form action="resultado.php" method="GET">
        <input type="hidden" id="carrinho" name="carrinho" value="0">
        <button type="submit" class="btn btn-warning">Carrinho de Compras <span class="carrinho">0</span></button>
    </form>
    <br>
    <br>
    <div>
        <a href="/" class="btn btn-primary">Início</a>
        <button class="btn btn-danger" id="btn-limpar">Limpar Dados</button>
    </div>
    <hr>
    <h1>Carrinho de Compras</h1>
    <?php
    $teste = json_decode($_GET['carrinho']);
    //echo var_dump($teste);

    if ($teste) {
        foreach ($teste as $index => $rs) {
            echo '<p>Produto Código: ' . $rs->id 
            . ' - Quantidade: <button type="button" class="btn-qtd btn-border-start">-</button><input type="text" class="text-center box-qtd" value="' . $rs->qtd . '"><button type="button" class="btn-qtd btn-border-end">+</button> - R$ <span class="valor-item">' . $rs->valor . '</span><input type="hidden" class="valorUnitario" data-qtd="' . $rs->qtd . '" data-id="' . $rs->id . '" data-cod="' . $index . '" value="' . ($rs->valor) . '"></p>';
        }
        echo '<hr class="m-0">';
        echo '<h3 class="mt-1">Total R$ <span id="total-carrinho">2</span></h3>';
    } else {
        echo 'Carrinho vazio.';
    }
    ?>
    <script src="scripts.js"></script>
</body>

</html>