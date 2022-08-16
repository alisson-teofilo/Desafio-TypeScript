const d=document;

let $botaoAtualizar = d.getElementById('atualizar-saldo')!;
let $botaoLimpar = d.getElementById('limpar-saldo')!;
let $soma = d.getElementById('soma')! as HTMLInputElement;
let $campoSaldo = d.getElementById('campo-saldo')!;

let saldo = 0

limparSaldo()

function somarAoSaldo(soma: number) {
        saldo += soma
        $campoSaldo.innerHTML = saldo.toString();
        $soma.value = "";
}

function limparSaldo() {
        saldo=0;
        $campoSaldo.innerHTML = saldo.toString();
}

$botaoAtualizar.addEventListener('click', () => {
    somarAoSaldo(Number($soma.value));
});

$botaoLimpar.addEventListener('click', () => {
    limparSaldo();
});