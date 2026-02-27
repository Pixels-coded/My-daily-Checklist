const form = document.getElementById('formularioTarefa');
const btnAbrir = document.getElementById('btnAbrirForm');
const inputTarefa = document.getElementById('novaTarefa');
const lista = document.getElementById('listaContainer');

// --- FUNÇÕES DE PERSISTÊNCIA (LocalStorage) ---

function salvarNoLocalStorage() {
    const tarefas = [];
    document.querySelectorAll('.atividade-card').forEach(card => {
        tarefas.push({
            texto: card.querySelector('span').innerText,
            concluida: card.querySelector('.check-custom').checked
        });
    });
    localStorage.setItem('minhasTarefas', JSON.stringify(tarefas));
}

function carregarDoLocalStorage() {
    const dados = localStorage.getItem('minhasTarefas');
    if (dados) {
        const tarefas = JSON.parse(dados);
        tarefas.forEach(t => {
            renderizarTarefa(t.texto, t.concluida);
        });
    }
    atualizarProgresso(); // Garante que a barra comece correta
}

// --- FUNÇÕES DE INTERFACE ---

function atualizarProgresso() {
    const totalTarefas = document.querySelectorAll('.atividade-card').length;
    const tarefasConcluidas = document.querySelectorAll('.check-custom:checked').length;
    
    const barra = document.getElementById('barraProgresso');
    const texto = document.getElementById('textoProgresso');
    
    let porcentagem = 0;
    if (totalTarefas > 0) {
        porcentagem = Math.round((tarefasConcluidas / totalTarefas) * 100);
    }
    
    barra.style.width = porcentagem + "%";
    texto.innerText = porcentagem + "%";
}

function mostrarFormulario() {
    form.style.display = 'flex';
    btnAbrir.style.display = 'none';
    inputTarefa.focus();
}

function esconderFormulario() {
    form.style.display = 'none';
    btnAbrir.style.display = 'block';
    inputTarefa.value = "";
}

// --- LÓGICA DE TAREFAS ---

function renderizarTarefa(texto, concluida = false) {
    const novoCard = document.createElement('div');
    novoCard.classList.add('atividade-card');
    novoCard.innerHTML = `
        <span>${texto}</span>
        <input type="checkbox" class="check-custom" ${concluida ? 'checked' : ''}>
    `;

    const checkbox = novoCard.querySelector('.check-custom');
    
    // Salva sempre que o status do checkbox mudar
    checkbox.addEventListener('change', () => {
        atualizarProgresso();
        salvarNoLocalStorage();
    });

    lista.appendChild(novoCard);
}

function confirmarTarefa() {
    const texto = inputTarefa.value;

    if (texto.trim() !== "") {
        renderizarTarefa(texto);
        esconderFormulario(); 
        atualizarProgresso();
        salvarNoLocalStorage(); // Salva após adicionar
    } else {
        alert("Digite algo antes de confirmar!");
    }
}

// --- EXCLUSÃO ---

let tarefasSelecionadasParaDeletar = [];

function abrirModalExclusao() {
    const modal = document.getElementById('modalExclusao');
    const listaExclusao = document.getElementById('listaParaExcluir');
    const todasAsTarefas = document.querySelectorAll('.atividade-card');

    listaExclusao.innerHTML = "";
    tarefasSelecionadasParaDeletar = [];

    todasAsTarefas.forEach((tarefa) => {
        const nomeTarefa = tarefa.querySelector('span').innerText;
        
        const divItem = document.createElement('div');
        divItem.classList.add('item-excluir');
        divItem.innerText = nomeTarefa;

        divItem.onclick = () => {
            divItem.classList.toggle('selecionado');
            if (divItem.classList.contains('selecionado')) {
                tarefasSelecionadasParaDeletar.push(tarefa);
            } else {
                tarefasSelecionadasParaDeletar = tarefasSelecionadasParaDeletar.filter(t => t !== tarefa);
            }
        };
        
        listaExclusao.appendChild(divItem);
    });

    modal.style.display = 'flex';
}

function fecharModalExclusao() {
    document.getElementById('modalExclusao').style.display = 'none';
}

function executarExclusao() {
    if (tarefasSelecionadasParaDeletar.length === 0) {
        alert("Nenhuma tarefa selecionada!");
        return;
    }

    tarefasSelecionadasParaDeletar.forEach(tarefa => {
        tarefa.remove();
    });

    salvarNoLocalStorage(); // Atualiza o storage removendo as deletadas
    atualizarProgresso();
    fecharModalExclusao();
}

// --- INICIALIZAÇÃO ---
// Carrega os dados assim que o navegador ler o arquivo JS
carregarDoLocalStorage();
