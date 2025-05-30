# SiteHotLap
Projeto web simples para cadastro e visualização de tempos de pilotos em corridas de HotLap


Este sistema permite:

✅ Cadastrar pilotos com informações como nome, carro, número do cronômetro, potência, categoria e melhor tempo
✅ Visualizar a lista completa de pilotos cadastrados
✅ Ver o ranking geral dos melhores tempos
✅ Filtrar por categorias e ver os 5 melhores de cada
✅ Atualização automática dos rankings a cada 5 segundos
✅ Validações para evitar duplicidade de cronômetro
✅ Edição e exclusão de pilotos diretamente na tela de cadastro

🛠 Tecnologias Utilizadas
HTML5 – Estrutura das páginas
CSS / Bootstrap 5 – Estilização responsiva
JavaScript – Lógica do front-end e manipulação de dados via localStorage
LocalStorage – Armazenamento temporário dos dados (sem backend)

/projeto-hotlap/
├── index.html                  # Tela inicial com listagem de todos os pilotos
├── CadPiloto.html              # Cadastro e edição de pilotos
├── ranking_geral.html          # Ranking geral dos melhores tempos
├── ranking.html                # Ranking por categoria selecionada
├── /css/
│   └── style.css              # Estilos customizados
├── /js/
│   └── funcoes.js             # Funções JavaScript reutilizáveis
└── /img/
    └── icone.jpg              # Imagem usada no navbar
