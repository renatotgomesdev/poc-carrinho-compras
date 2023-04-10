<?php

namespace App\WebService;

class Correios
{

    /**
     * URL base da API
     * @var string
     */
    const URL_BASE = 'http://ws.correios.com.br';

    /**
     * Código de serviços dos Correios
     */
    const SERVICO_SEDEX = '40010';
    const SERVICO_SEDEX_12 = '04782';
    const SERVICO_SEDEX_10 = '04790';
    const SERVICO_SEDEX_HOJE = '04804';
    const SERVICO_PAC = '04510';

    /**
     * Códigos dos formatos dos Correios
     */
    const FORMATO_CAIXA_PACOTE = 1;
    const FORMATO_ROLO_PRISMA = 2;
    const FORMATO_ENVELOPE = 3;

    /**
     * Código da empresa com contrato
     * @var string
     */
    private $codigoEmpresa = '';

    /**
     * Senha da empresa com contrato
     * @var string
     */
    private $senhaEmpresa = '';

    /**
     * Método responsávl pela definição dos dados de contrato do webservice dos Correios
     * @param string $codigoEmpresa
     * @param string $senhaEmpresa
     */
    public function __construct($codigoEmpresa = '', $senhaEmpresa = '')
    {
        $this->codigoEmpresa = $codigoEmpresa;
        $this->senhaEmpresa = $senhaEmpresa;
    }

    /**
     * Método responsável por calcular o frete no Correios
     * @param string $codigoServico
     * @param string $cepOrigem
     * @param string $cepDestino
     * @param float $peso
     * @param integer $formato
     * @param integer $comprimento
     * @param integer $altura
     * @param integer $largura
     * @param integer $diametro
     * @param boolean $maoPropria
     * @param integer $valorDeclarado
     * @param boolean $avisoRecebimento
     * @return object
     */
    public function calcularFrete(
        $codigoServico,
        $cepOrigem,
        $cepDestino,
        $peso,
        $formato,
        $comprimento,
        $altura,
        $largura,
        $diametro = 0,
        $maoPropria = false,
        $valorDeclarado = 0,
        $avisoRecebimento = false
    ) {
        // Parâmetros da URL de cálculo
        $parametros = [
            'nCdEmpresa' => $this->codigoEmpresa,
            'sDsSenha' => $this->senhaEmpresa,
            'nCdServico' => $codigoServico,
            'sCepOrigem' => $cepOrigem,
            'sCepDestino' => $cepDestino,
            'nVlPeso' => $peso,
            'nCdFormato' => $formato,
            'nVlComprimento' => $comprimento,
            'nVlAltura' => $altura,
            'nVlLargura' => $largura,
            'nVlDiametro' => $diametro,
            'sCdMaoPropria' => $maoPropria ? 'S' : 'N',
            'nVlValorDeclarado' => $valorDeclarado,
            'sCdAvisoRecebimento' => $avisoRecebimento ? 'S' : 'N',
            'StrRetorno' => 'xml'
        ];

        // Query
        $query = http_build_query($parametros);

        // Executa a consulta de frete
        $resultado = $this->get('/calculador/CalcPrecoPrazo.aspx?' . $query);

        // echo "<pre>";
        // print_r($resultado);
        // echo "</pre>";
        // exit;

        // Retorna os dados do frete calculado
        return $resultado ? $resultado->cServico : null;
    }

    /**
     * Método responsável por executar a consulta GET no webservice dos Correios
     * @param string $resource
     * @return object
     */
    public function get($resource)
    {
        // Endpoint Completo
        $endpoint = self::URL_BASE . $resource;

        // Inicia o curl
        $curl = curl_init();

        // Configurações do curl
        curl_setopt_array($curl, [
            CURLOPT_URL => $endpoint,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'GET'
        ]);

        // Executa a consulta curl
        $response = curl_exec($curl);

        // Fecha a conexão do curl
        curl_close($curl);

        // echo "<pre>";
        // print_r($response);
        // echo "</pre>"; exit;

        // Retorna o xml instanciado
        return strlen($response) ? simplexml_load_string($response) : null;
    }
}
