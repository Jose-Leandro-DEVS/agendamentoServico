# Sistema de Agendamentos

Aplicação web completa para gerenciamento de agendamentos, contendo interface para o cliente final realizar marcações e um painel administrativo para controle e gestão dos atendimentos.

---

## 🛠️ Tecnologias Utilizadas

* **Node.js** - Ambiente de execução JavaScript para o backend.
* **Express** - Framework web para construção da API REST.
* **Prisma ORM** - Mapeamento objeto-relacional para comunicação com o banco de dados.
* **PostgreSQL** - Banco de dados relacional hospedado na nuvem.
* **Tailwind CSS** - Framework CSS utilitário para estilização moderna e responsiva da interface e do painel.

---

## 🤖 Ferramentas de IA Utilizadas

* **GEMINE** Ferramentas de Inteligência Artificial utilizadas como suporte para estruturação de código, resolução de erros de banco de dados/Prisma e auxílio no desenvolvimento geral do projeto.

---

## ⚙️ Instruções para Executar o Projeto Localmente

Instale as dependências:

Bash
npm install
Configure as variáveis de ambiente:

Crie um arquivo chamado .env na raiz do projeto.

Adicione a URL de conexão com o seu banco PostgreSQL:

Snippet de código
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
Sincronize o banco de dados:

Bash
npx prisma db push
Inicie o servidor localmente:

Bash
npm start
O sistema estará acessível em: http://localhost:3000

O painel administrativo pode ser acessado em: http://localhost:3000/admin.html
Siga os passos abaixo para rodar a aplicação na sua máquina:

---

1. **Clone o repositório:**
   ```bash
git clone https://github.com/Jose-Leandro-DEVS/agendamentoServico.git

cd agendamentoServico

---

🔑 Credenciais de Acesso
O sistema de agendamentos e o painel administrativo operam de forma aberta para fins de testes e agilidade de uso, não exigindo credenciais de login/senha pré-cadastradas.

---

💡 Decisões Técnicas
Hospedagem no Render: Escolhido pela facilidade, suporte nativo a aplicações Node.js e banco de dados PostgreSQL, além de permitir um deploy contínuo rápido integrado ao GitHub.

Prisma ORM: Adotado para garantir um mapeamento relacional robusto, segurança tipada e facilidade nas sincronizações de schema via comandos como db push.

Arquitetura Leve: Separação clara entre a API REST em Node.js/Express e o frontend estático servido pela pasta public, garantindo simplicidade de manutenção e alta performance.
