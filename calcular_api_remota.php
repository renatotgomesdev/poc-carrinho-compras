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

$frete_pac = $obCorreios->calcularFrete(
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

$codigoServico = Correios::SERVICO_SEDEX;

$frete_sedex = $obCorreios->calcularFrete(
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
if (!$frete_pac || !$frete_sedex) {
    die('Problemas ao calcular o frete');
}

// Verifica o erro
if (strlen($frete_pac->MsgErro)) {
    die('Erro: ' . $frete_pac->MsgErro);
}

if (strlen($frete_sedex->MsgErro)) {
    die('Erro: ' . $frete_sedex->MsgErro);
}

$frete = [];
array_push($frete, $frete_pac);
array_push($frete, $frete_sedex);

echo json_encode($frete);
