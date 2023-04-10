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

$msg = '<div class="form-group">
                <label for="envio" class="form-label">Selecione a forma de envio:</label>
            </div>';

$msg .= '<div class="form-check mt-1">
            <input class="form-check-input" type="radio" name="envio" id="pac" value="' . $frete_pac->Valor . '" onclick="atualizaTotalCarrinhoRadio(this)" checked>
            <label class="form-check-label" for="pac">';

$msg .= 'Valor do Frete PAC: R$ <span id="retorno-valor-frete-pac">' . $frete_pac->Valor . '</span> - ';
if ($frete_pac->PrazoEntrega > 1) {
    $msg .= "Prazo de entrega: " . $frete_pac->PrazoEntrega . " dias úteis";
} else {
    $msg .= "Prazo de entrega: " . $frete_pac->PrazoEntrega . " dia útil";
}

$msg .= '</label></div>';

$msg .= '<div class="form-check mt-1">
            <input class="form-check-input" type="radio" name="envio" id="sedex" value="' . $frete_sedex->Valor . '" onclick="atualizaTotalCarrinhoRadio(this)">
            <label class="form-check-label" for="sedex">';

$msg .= 'Valor do Frete SEDEX: R$ <span id="retorno-valor-frete-sedex">' . $frete_sedex->Valor . '</span> - ';
if ($frete_sedex->PrazoEntrega > 1) {
    $msg .= "Prazo de entrega: " . $frete_sedex->PrazoEntrega . " dias úteis";
} else {
    $msg .= "Prazo de entrega: " . $frete_sedex->PrazoEntrega . " dia útil";
}

$msg .= '</label></div>';

$msg .= '<div class="form-check mt-1">
<input class="form-check-input" type="radio" name="envio" id="outra-forma" value="0,00" onclick="atualizaTotalCarrinhoRadio(this)">
<label class="form-check-label" for="outra-forma">
    Outra forma de envio
</label>
</div>';

echo $msg;
