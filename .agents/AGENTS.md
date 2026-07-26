# Diretrizes de Segurança para IA

## Documentação de bibliotecas
Ao usar ou instalar uma biblioteca/framework, consulte a documentação oficial ou busque exemplos atualizados antes de escrever código que dependa da API dela (evita usar métodos deprecados/inseguros).

## Auditoria de dependências
Sempre que instalar, atualizar ou revisar dependências:
- Projeto Node/TS: rode `npm audit --audit-level=high` (ou `pnpm audit` / `yarn audit`, conforme o gerenciador do projeto) depois de qualquer `install`/`add`.
- Projeto Python: rode `pip-audit` (instale com `pip install pip-audit` se não existir) depois de qualquer alteração em `requirements.txt` / `pyproject.toml`.
- Se houver vulnerabilidade CRITICAL ou HIGH, não finalize a tarefa sem antes: (a) tentar atualizar para a versão corrigida, ou (b) avisar explicitamente o usuário sobre o risco e por que não foi possível corrigir.
- Nunca ignore/suprima um alerta de auditoria silenciosamente.

## TDD (obrigatório para funcionalidades novas e correções de bug)
Ao implementar uma funcionalidade nova ou corrigir um bug:
1. **Red** — escreva primeiro um teste que reproduza o requisito/bug e falhe (rode o teste e confirme que ele falha antes de escrever a implementação).
2. **Green** — escreva o menor código possível para o teste passar.
3. **Refactor** — limpe o código mantendo os testes verdes.

Não escreva código de implementação antes de existir um teste falhando para ele, a menos que o usuário peça explicitamente para pular essa etapa (ex: protótipo descartável). Rode a suíte de testes completa antes de considerar a tarefa concluída.
