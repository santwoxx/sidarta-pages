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
