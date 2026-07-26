# Setup de Segurança para IA (Claude Code / assistentes de código)

> **Como usar:** copie este arquivo para a raiz de qualquer projeto seu e diga para a IA:
> *"Leia o arquivo AI-SECURITY-SETUP.md e implemente todas as seções nele."*
> Depois de implementado, pode apagar este arquivo (ou manter como documentação) — o que importa são os arquivos que ele gera.

## Instruções para a IA que for executar este arquivo

Antes de começar, faça o seguinte:

1. Detecte a stack do projeto (Node/TypeScript, Python, etc.) olhando `package.json`, `requirements.txt`, `pyproject.toml`, etc. Adapte os comandos de auditoria de dependências (seção 3) para a stack encontrada.
2. Implemente as 5 seções abaixo, uma por uma, criando/editando exatamente os arquivos indicados.
3. Não invente segredos, tokens ou chaves de API — onde um valor for necessário (ex: `ANTHROPIC_API_KEY`), deixe um placeholder e avise o usuário que ele precisa cadastrar o secret manualmente.
4. Ao final, rode um resumo do que foi criado/alterado.

---

## 1) Skill de revisão OWASP Top 10

Objetivo: sempre que a IA implementar autenticação, formulários, endpoints de API, upload de arquivos, queries de banco ou manipulação de dados sensíveis, ela deve revisar o código contra o OWASP Top 10:2021.

Crie o arquivo `.claude/skills/owasp-top-10/SKILL.md`:

```markdown
---
name: owasp-top-10
description: Use ao escrever ou revisar autenticação, autorização, formulários, endpoints de API, queries de banco, upload de arquivos, sessões/cookies, ou qualquer código que lide com dados de usuário. Aplica um checklist do OWASP Top 10:2021 antes de considerar o código pronto.
---

# Revisão OWASP Top 10:2021

Antes de finalizar qualquer código que toque em autenticação, dados de usuário,
banco de dados, uploads ou APIs, verifique cada item abaixo e corrija o que
for aplicável:

- **A01 – Broken Access Control**: toda rota/endpoint sensível checa
  permissão do usuário no backend (nunca confie só no frontend)? IDs de
  objetos não permitem acesso a recursos de outros usuários (IDOR)?
- **A02 – Cryptographic Failures**: dados sensíveis (senhas, tokens, PII)
  são armazenados com hash/criptografia adequados? Nada sensível vai em
  logs, URLs ou localStorage sem necessidade?
- **A03 – Injection**: toda query usa parametrização/ORM (nunca concatenação
  de string)? Inputs são validados/sanitizados (SQL, NoSQL, comandos de
  shell, HTML)?
- **A04 – Insecure Design**: existe validação de regras de negócio no
  backend (limites de rate, valores permitidos), não só na UI?
- **A05 – Security Misconfiguration**: segredos não estão hardcoded no
  código; variáveis de ambiente/`.env` estão fora do git; headers de
  segurança (CSP, CORS) estão configurados corretamente; modo debug
  desligado em produção?
- **A06 – Vulnerable and Outdated Components**: dependências novas foram
  checadas contra vulnerabilidades conhecidas (ver seção de auditoria)?
- **A07 – Identification and Authentication Failures**: senhas fortes
  exigidas, rate limit em login, tokens de sessão/JWT com expiração e
  invalidação corretas, MFA quando aplicável?
- **A08 – Software and Data Integrity Failures**: dependências vêm de
  fontes confiáveis com lockfile; deserialização de dados não confiáveis é
  evitada ou validada?
- **A09 – Security Logging and Monitoring Failures**: eventos sensíveis
  (login, falha de auth, mudanças de permissão) são logados sem expor
  dados sensíveis nos logs?
- **A10 – Server-Side Request Forgery (SSRF)**: URLs fornecidas pelo
  usuário para requisições server-side são validadas contra allowlist?

Ao final, resuma os itens verificados e liste qualquer risco encontrado que
não foi corrigido, explicando o motivo.
```

---

## 2) MCP do Context7 (documentação sempre atualizada)

Objetivo: evitar que a IA use APIs desatualizadas/inseguras de bibliotecas por "alucinação" — o Context7 injeta documentação atual da lib direto no contexto.

Rode um destes comandos (local via npx, não precisa de chave para uso básico):

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

Ou, se preferir o servidor remoto oficial (HTTP):

```bash
claude mcp add --transport http context7 https://mcp.context7.com/mcp
```

Depois, adicione ao `CLAUDE.md` do projeto (crie a seção se o arquivo já existir):

```markdown
## Documentação de bibliotecas
Ao usar ou instalar uma biblioteca/framework, consulte o MCP `context7`
para pegar a documentação e exemplos atualizados antes de escrever código
que dependa da API dela (evita usar métodos deprecados/inseguros).
```

Se o usuário quiser rate limit maior, ele pode gerar uma API key gratuita em
https://context7.com e configurar como variável de ambiente `CONTEXT7_API_KEY`
(não hardcode a chave no repositório).

---

## 3) Regras para auditoria de dependências (pip-audit / npm audit)

Objetivo: nenhuma dependência com vulnerabilidade conhecida (CVE) entra no projeto sem o usuário ser avisado.

Adicione ao `CLAUDE.md`:

```markdown
## Auditoria de dependências
Sempre que instalar, atualizar ou revisar dependências:
- Projeto Node/TS: rode `npm audit --audit-level=high` (ou `pnpm audit` /
  `yarn audit`, conforme o gerenciador do projeto) depois de qualquer
  `install`/`add`.
- Projeto Python: rode `pip-audit` (instale com `pip install pip-audit` se
  não existir) depois de qualquer alteração em `requirements.txt` /
  `pyproject.toml`.
- Se houver vulnerabilidade CRITICAL ou HIGH, não finalize a tarefa sem
  antes: (a) tentar atualizar para a versão corrigida, ou (b) avisar
  explicitamente o usuário sobre o risco e por que não foi possível corrigir.
- Nunca ignore/suprima um alerta de auditoria silenciosamente.
```

Opcional (recomendado): adicione um hook de pre-commit. Se o projeto usar
Husky (Node), crie `.husky/pre-commit`:

```bash
#!/usr/bin/env sh
npm audit --audit-level=high
```

Para Python, use um hook equivalente em `.pre-commit-config.yaml` com o
repositório `pypa/pip-audit`.

---

## 4) Code review automático de PR que bloqueia merge em falha crítica

Objetivo: todo Pull Request passa por revisão de segurança automática, e o merge fica bloqueado se for encontrada uma falha crítica.

Crie `.github/workflows/security-review.yml`:

```yaml
name: Claude Security Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  security-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run Claude Code Security Review
        uses: anthropics/claude-code-security-review@main
        with:
          claude-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
          comment-pr: true
          fail-on-severity: critical
```

Depois de criar o workflow, o usuário precisa:

1. Cadastrar o secret `ANTHROPIC_API_KEY` em *Settings → Secrets and
   variables → Actions* do repositório no GitHub.
2. Ir em *Settings → Branches → Branch protection rules* e marcar o job
   `security-review` como **required status check** na branch principal —
   é isso que efetivamente **bloqueia o merge** se o job falhar (ou seja,
   se uma falha crítica for encontrada).

> Se o repositório não estiver no GitHub, adapte o mesmo conceito (rodar
> revisão automática + falhar o pipeline em achado crítico + tornar o
> check obrigatório) para o CI usado (GitLab CI, etc.).

---

## 5) Regras para TDD (Test-Driven Development)

Objetivo: nenhuma funcionalidade nova é implementada sem teste, reduzindo regressões e comportamento inseguro não coberto por teste.

Adicione ao `CLAUDE.md`:

```markdown
## TDD (obrigatório para funcionalidades novas e correções de bug)
Ao implementar uma funcionalidade nova ou corrigir um bug:
1. **Red** — escreva primeiro um teste que reproduza o requisito/bug e
   falhe (rode o teste e confirme que ele falha antes de escrever a
   implementação).
2. **Green** — escreva o menor código possível para o teste passar.
3. **Refactor** — limpe o código mantendo os testes verdes.

Não escreva código de implementação antes de existir um teste falhando
para ele, a menos que o usuário peça explicitamente para pular essa etapa
(ex: protótipo descartável). Rode a suíte de testes completa antes de
considerar a tarefa concluída.
```

---

## Resumo do que este arquivo faz a IA criar

| # | Item | Arquivo(s) gerado(s) |
|---|------|----------------------|
| 1 | Skill OWASP Top 10 | `.claude/skills/owasp-top-10/SKILL.md` |
| 2 | MCP Context7 | registro via `claude mcp add` + trecho no `CLAUDE.md` |
| 3 | Auditoria de dependências | trecho no `CLAUDE.md` + (opcional) hook de pre-commit |
| 4 | PR review automático que bloqueia merge | `.github/workflows/security-review.yml` + branch protection manual |
| 5 | Regras de TDD | trecho no `CLAUDE.md` |
