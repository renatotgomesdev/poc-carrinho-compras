<?php

$cep = $_GET['cep'];

$frete_pac = simplexml_load_string(file_get_contents('retorno_api_pac.xml'));
$frete_sedex = simplexml_load_string(file_get_contents('retorno_api_sedex.xml'));

$frete = [];
array_push($frete, $frete_pac);
array_push($frete, $frete_sedex);
echo json_encode($frete);
