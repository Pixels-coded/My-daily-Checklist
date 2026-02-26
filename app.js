const form = document.getElementById('formularioTarefa');
const btnAbrir = document.getElementById('btnAbrirForm');
const inputTarefa = document.getElementById('novaTarefa');
const lista = document.getElementById('listaContainer');


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

function confirmarTarefa() {
    const texto = inputTarefa.value;

    if (texto.trim() !== "") {
        const novoCard = document.createElement('div');
        novoCard.classList.add('atividade-card');
        novoCard.innerHTML = `
            <span>${texto}</span>
            <input type="checkbox" class="check-custom">
        `;
        const checkbox = novoCard.querySelector('.check-custom');

        checkbox.addEventListener('change', atualizarProgresso);

        lista.appendChild(novoCard);
        
        esconderFormulario(); 

        atualizarProgresso();

    } else {
        alert("Digite algo antes de confirmar!");
    }
}

let tarefasSelecionadasParaDeletar = [];

function abrirModalExclusao() {
    const modal = document.getElementById('modalExclusao');
    const listaExclusao = document.getElementById('listaParaExcluir');
    const todasAsTarefas = document.querySelectorAll('.atividade-card');

    listaExclusao.innerHTML = "";
    tarefasSelecionadasParaDeletar = [];

  
    todasAsTarefas.forEach((tarefa, index) => {
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
        atualizarProgresso();
    });

    fecharModalExclusao();
}