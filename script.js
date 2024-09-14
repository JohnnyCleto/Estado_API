document.addEventListener('DOMContentLoaded', () => {
    const estadoSelect = document.getElementById("estado");
    const cidadeSelect = document.getElementById('cidade');
    const mostrarSelecaoBtn = document.getElementById('mostrarSelecaoBtn');
    const resultadoSelecao = document.getElementById('resultado-selecao');

    if (!estadoSelect || !cidadeSelect || !mostrarSelecaoBtn || !resultadoSelecao) {
        console.error('Elementos necessários não encontrados no DOM.');
        return;
    }

    function buscarEstados() {
        fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => response.json())
            .then(estados => {
                estados.sort((a, b) => a.nome.localeCompare(b.nome));
                estados.forEach(estado => {
                    const option = document.createElement('option');
                    option.value = estado.id;
                    option.textContent = estado.nome;
                    estadoSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar estados:', error);
                resultadoSelecao.textContent = 'Erro ao carregar estados. Tente novamente mais tarde.';
            });
    }

    function buscarCidades(estadoId) {
        fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoId}/municipios`)
            .then(response => response.json())
            .then(cidades => {
                cidadeSelect.innerHTML = ''; 
                const defaultOption = document.createElement('option');
                defaultOption.textContent = '--Selecione uma cidade--';
                defaultOption.value = 'default';
                cidadeSelect.appendChild(defaultOption);

                cidades.forEach(cidade => {
                    const option = document.createElement('option');
                    option.value = cidade.id;
                    option.textContent = cidade.nome;
                    cidadeSelect.appendChild(option);
                });

                cidadeSelect.disabled = false;
            })
            .catch(error => {
                console.error('Erro ao buscar cidades:', error);
                resultadoSelecao.textContent = 'Erro ao carregar cidades. Tente novamente mais tarde.';
            });
    }

    estadoSelect.addEventListener('change', (event) => {
        const estadoId = event.target.value;
        if (estadoId !== 'default') {
            cidadeSelect.disabled = true;
            buscarCidades(estadoId);
        } else {
            cidadeSelect.innerHTML = '<option value="default">--Selecione uma cidade--</option>';
            cidadeSelect.disabled = true;
        }
    });

    mostrarSelecaoBtn.addEventListener('click', () => {
        const estadoSelecionado = estadoSelect.options[estadoSelect.selectedIndex]?.text;
        const cidadeSelecionada = cidadeSelect.options[cidadeSelect.selectedIndex]?.text;

        if (estadoSelecionado === '--Selecione um estado--' || cidadeSelecionada === '--Selecione uma cidade--') {
            resultadoSelecao.textContent = 'Por favor, selecione tanto o estado quanto a cidade.';
        } else {
            resultadoSelecao.textContent = `Estado: ${estadoSelecionado}, Cidade: ${cidadeSelecionada}`;
        }
    });

    buscarEstados();
});
