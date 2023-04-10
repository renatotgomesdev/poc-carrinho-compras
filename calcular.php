<?php

require __DIR__ . '/vendor/autoload.php';

use \App\WebService\Correios;

$cep = $_GET['cep'];

// Nova instancia dos Correios sem contrato
$obCorreios = new Correios();

// Dados para cálculo do frete
$codigoServico = Correios::SERVICO_PAC;
$cepOrigem = "15047421";
$cepDestino = $cep;
$peso = 3;
$formato = Correios::FORMATO_CAIXA_PACOTE;
$comprimento = 15;
$altura = 15;
$largura = 15;
$diametro = 0;
$maoPropria = false;
$valorDeclarado = 0;
$avisoRecebimento = false;

$frete = $obCorreios->calcularFrete(
    $codigoServico,
    $cepOrigem,
    $cepDestino,
    $peso,
    $formato,
    $comprimento,
    $altura,
    $largura,
    $diametro,
    $maoPropria,
    $valorDeclarado,
    $avisoRecebimento
);

// echo "<pre>";
// print_r($frete);
// echo "</pre>"; exit;

// Verifica o resultado
if (!$frete) {
    die('Problemas ao calcular o frete');
}

// Verifica o erro
if (strlen($frete->MsgErro)) {
    die('Erro: ' . $frete->MsgErro);
}

// echo "<p>CEP de Origem: " . $cepOrigem . "</p>";
// echo "<p>CEP de Destino: " . $cepDestino . "</p>";
$msg = 'Valor do Frete: R$ <span id="retorno-valor-frete">' . $frete->Valor . '</span> - ';
if ($frete->PrazoEntrega > 1) {
    $msg .= "Prazo de entrega: " . $frete->PrazoEntrega . " dias úteis";
} else {
    $msg .= "Prazo de entrega: " . $frete->PrazoEntrega . " dia útil";
}

echo $msg;
