// Base de dados dos Paladinos fornecida
const paladinos = [
    {
        nome: "pidge",
        leao: "Verde (Tecnologia)",
        img: "https://static.wikia.nocookie.net/voltron/images/c/c1/Pidge_%28Paladin%29_-_LD.png/revision/latest?cb=20160615043235"
    },
    {
        nome: "lance",
        leao: "Azul (Água / Gelo)",
        img: "https://static.wikia.nocookie.net/voltron/images/f/f3/Lance_%28Paladin%29_-_LD.png/revision/latest?cb=20160615052547"
    },
    {
        nome: "keith",
        leao: "Vermelho (Fogo)",
        img: "https://static.wikia.nocookie.net/voltron/images/b/b3/Keith_%28Paladin%29_-_LD.png/revision/latest?cb=20160615052007"
    },
    {
        nome: "shiro",
        leao: "Preto (Líder)",
        img: "https://static.wikia.nocookie.net/voltron/images/b/b6/Shiro_%28Paladin%29_-_LD.png/revision/latest?cb=20160615042432"
    },
    {
        nome: "hunk",
        leao: "Amarelo (Terra / Rocha)",
        img: "https://static.wikia.nocookie.net/voltron/images/6/65/Hunk_%28Paladin%29_-_LD.png/revision/latest?cb=20160615051521"
    }
];

const revelarBtn = document.getElementById('revelar-btn');
const proximoBtn = document.getElementById('proximo-btn');
const resetPlacarBtn = document.getElementById('reset-placar-btn');
const paladinoImg = document.getElementById('paladino-img');
const paladinoNome = document.getElementById('paladino-nome');
const paladinoLeao = document.getElementById('paladino-leao');
const paladinoInput = document.getElementById('paladino-input');
const scoreAcertosEl = document.getElementById('score-acertos');
const scoreErrosEl = document.getElementById('score-erros');
const missaoEspacialEl = document.getElementById('missao-espacial');

let paladinoAtual = {};
let acertos = parseInt(localStorage.getItem('voltron_acertos')) || 0;
let erros = parseInt(localStorage.getItem('voltron_erros')) || 0;

function iniciarJogo() {
    atualizarPlacarInterface();
    sortearPaladino();
    buscarDadosEspaciaisAPI();
}

function sortearPaladino() {
    const indiceAleatorio = Math.floor(Math.random() * paladinos.length);
    paladinoAtual = paladinos[indiceAleatorio];

    paladinoImg.src = paladinoAtual.img;
    paladinoImg.classList.add('silhueta');
    paladinoNome.textContent = "????";
    paladinoLeao.textContent = "????";
    paladinoInput.value = "";
    
    revelarBtn.classList.remove('hidden');
    proximoBtn.classList.add('hidden');
}

revelarBtn.addEventListener('click', () => {
    const palpiteUsuario = paladinoInput.value.trim().toLowerCase();
    
    if (!palpiteUsuario) {
        alert("Por favor, digite um palpite antes de revelar!");
        return;
    }

    paladinoImg.classList.remove('silhueta');
    paladinoNome.textContent = paladinoAtual.nome.toUpperCase();
    paladinoLeao.textContent = paladinoAtual.leao;

    if (palpiteUsuario === paladinoAtual.nome) {
        acertos++;
        localStorage.setItem('voltron_acertos', acertos);
        alert(`Excelente, Paladino! Você reconheceu o(a) ${paladinoAtual.nome.toUpperCase()}!`);
    } else {
        erros++;
        localStorage.setItem('voltron_erros', erros);
        alert(`Houve uma falha na identificação. Esse era o(a) ${paladinoAtual.nome.toUpperCase()}.`);
    }

    atualizarPlacarInterface();
    
    revelarBtn.classList.add('hidden');
    proximoBtn.classList.remove('hidden');
});

proximoBtn.addEventListener('click', sortearPaladino);

resetPlacarBtn.addEventListener('click', () => {
    acertos = 0;
    erros = 0;
    localStorage.setItem('voltron_acertos', 0);
    localStorage.setItem('voltron_erros', 0);
    atualizarPlacarInterface();
});

function atualizarPlacarInterface() {
    scoreAcertosEl.textContent = acertos;
    scoreErrosEl.textContent = erros;
}

function buscarDadosEspaciaisAPI() {
    missaoEspacialEl.innerHTML = "<em>Buscando dados da Aliança Galáctica...</em>";
    
    fetch('https://raw.githubusercontent.com/dfm/osmos/master/osmos/data/constellations.json')
        .then(response => {
            if (!response.ok) throw new Error('Erro na rede galáctica');
            return response.json();
        })
        .then(data => {
            const chaves = Object.keys(data);
            const constelacaoSorteada = chaves[Math.floor(Math.random() * chaves.length)];
            
            missaoEspacialEl.innerHTML = `
                <p>🚀 <strong>Status da Missão Espacial:</strong> Patrulhando o setor da constelação <strong>${constelacaoSorteada.toUpperCase()}</strong>.</p>
                <small>(Dados em tempo real obtidos via API externa Fetch)</small>
            `;
        })
}

window.onload = iniciarJogo;