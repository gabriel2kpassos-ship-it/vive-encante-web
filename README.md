# Vive Encante Web (Next.js 16 App Router) — Documentação Completa “single-file”

> Objetivo: este README é a documentação *única* (single-file) do projeto.  
> Público-alvo: *dev com maturidade* + *IA* (não é tutorial “iniciante”).  
> Fonte de verdade: *código do repositório*. Este README descreve a estrutura real encontrada em src/ (conforme sua árvore).

---

## TL;DR

- *Público*: catálogo, galeria, contato, como-funciona  
- *Admin*: login + CRUD de produtos/kits/galeria + upload de imagem (Cloudinary)  
- *Auth: Firebase Auth (client) + **Session Cookie* no backend (Firebase Admin SDK)  
- *Proteção do /admin*: src/proxy.ts (Next 16 “proxy”)  
- *Dados*: Firestore (via services em src/lib/services)  
- *UI*: componentes em src/components/* + Tailwind + globals.css  
- *Deploy*: Vercel (push → build → deploy)

---

# 1) Mapa do Projeto

## 1.1 Estrutura (fonte: árvore real)

src/ proxy.ts

app/ favicon.ico globals.css layout.tsx page.tsx

(admin)/
  layout.tsx
  admin/
    page.tsx
    login/page.tsx

    api/
      session/route.ts
      logout/route.ts
      produtos/route.ts
      produtos/[id]/route.ts
      kits/route.ts
      kits/[id]/route.ts
      galeria/route.ts
      galeria/[id]/route.ts

    produtos/page.tsx
    produtos/novo/page.tsx
    produtos/[id]/page.tsx

    kits/page.tsx
    kits/novo/page.tsx
    kits/[id]/page.tsx

    galeria/page.tsx
    galeria/novo/page.tsx
    galeria/[id]/page.tsx

(public)/
  layout.tsx
  catalogo/page.tsx
  catalogo/produtos/page.tsx
  catalogo/produtos/[id]/page.tsx
  catalogo/kits/page.tsx
  catalogo/kits/[id]/page.tsx
  como-funciona/page.tsx
  contato/page.tsx
  galeria/page.tsx

api/
  public/galeria/route.ts

components/ admin/ DeleteGaleriaButton.tsx DeleteKitButton.tsx DeleteProdutoButton.tsx GaleriaForm.tsx GaleriaTable.tsx ImageUploader.tsx KitForm.tsx KitTable.tsx ProdutoForm.tsx ProdutoTable.tsx

catalog/
  KitCard.tsx
  KitDetail.tsx
  ProdutoCard.tsx
  ProdutoDetail.tsx

gallery/
  GalleryGrid.tsx

layout/
  Container.tsx
  PublicFooter.tsx
  PublicHeader.tsx

ui/
  BackToCatalog.tsx
  Badge.tsx
  Button.tsx
  Card.tsx

config/ site.ts

lib/ cloudinary.ts

auth/
  auth.ts

firebase/
  admin.ts
  client.ts

services/
  counter.service.ts
  galeria.public.service.ts
  kit.admin.service.ts
  kit.public.service.ts
  kit.service.ts
  produto.public.service.ts
  produto.service.ts

utils/
  whatsapp.ts

types/ galeria.ts kit.ts produto.ts

---

# 2) Rotas e Responsabilidades

## 2.1 Público (Route Group (public))

*Layout*: src/app/(public)/layout.tsx  
*Header/Footer*: src/components/layout/PublicHeader.tsx, PublicFooter.tsx

Rotas (páginas):
- /catalogo → src/app/(public)/catalogo/page.tsx
- /catalogo/produtos → src/app/(public)/catalogo/produtos/page.tsx
- /catalogo/produtos/[id] → src/app/(public)/catalogo/produtos/[id]/page.tsx
- /catalogo/kits → src/app/(public)/catalogo/kits/page.tsx
- /catalogo/kits/[id] → src/app/(public)/catalogo/kits/[id]/page.tsx
- /galeria → src/app/(public)/galeria/page.tsx
- /contato → src/app/(public)/contato/page.tsx
- /como-funciona → src/app/(public)/como-funciona/page.tsx

API pública:
- GET /api/public/galeria → src/app/api/public/galeria/route.ts  
  (backend server-side, normalmente usando Admin SDK/Firestore)

Componentes principais do público:
- Cards/detalhes: src/components/catalog/*
- Grid da galeria: src/components/gallery/GalleryGrid.tsx
- Botão voltar: src/components/ui/BackToCatalog.tsx

---

## 2.2 Admin (Route Group (admin))

*Layout*: src/app/(admin)/layout.tsx

Rotas (páginas):
- /admin → src/app/(admin)/admin/page.tsx
- /admin/login → src/app/(admin)/admin/login/page.tsx

CRUD Produtos:
- /admin/produtos → listagem page.tsx
- /admin/produtos/novo → criação page.tsx
- /admin/produtos/[id] → edição page.tsx

CRUD Kits:
- /admin/kits → listagem
- /admin/kits/novo → criação
- /admin/kits/[id] → edição

CRUD Galeria:
- /admin/galeria → listagem
- /admin/galeria/novo → criação
- /admin/galeria/[id] → edição

APIs Admin (Route Handlers):
- POST /admin/api/session → src/app/(admin)/admin/api/session/route.ts
- POST /admin/api/logout → src/app/(admin)/admin/api/logout/route.ts

Produtos:
- GET/POST /admin/api/produtos → .../produtos/route.ts
- GET/PATCH/DELETE /admin/api/produtos/[id] → .../produtos/[id]/route.ts

Kits:
- GET/POST /admin/api/kits
- GET/PATCH/DELETE /admin/api/kits/[id]

Galeria:
- GET/POST /admin/api/galeria
- GET/PATCH/DELETE /admin/api/galeria/[id]

Componentes principais do admin:
- Forms: ProdutoForm.tsx, KitForm.tsx, GaleriaForm.tsx
- Tables: ProdutoTable.tsx, KitTable.tsx, GaleriaTable.tsx
- Delete buttons: DeleteProdutoButton.tsx, etc.
- Upload: ImageUploader.tsx

---

# 3) Segurança, Auth e Controle de Acesso

## 3.1 “Porta” do Admin: src/proxy.ts (Next.js 16)

Este projeto usa *proxy* (Next 16) para proteger /admin/*.

Requisitos funcionais mínimos:
- Proteger *tudo* em /admin/*
- Liberar /admin/login
- (opcional) liberar /admin/api/* para permitir chamadas internas (mas **a API deve validar sessão** de qualquer jeito)
- Se não houver sessão → redireciona para /admin/login?next=<path>

A regra de ouro:
> *Tela* pode ser acessada/servidor redirecionar.  
> Mas *a segurança real* é: API admin valida sessão + autorização.

### 3.1.1 Matcher
O proxy precisa ter matcher para /admin/:path*.  
Se você mexer nisso e “abrir demais”, vai aplicar em rotas públicas.

---

## 3.2 Sessão via Firebase Admin Session Cookie

Fluxo típico (alto nível):
1) Admin faz login no frontend (Firebase Auth client).
2) Frontend obtém idToken do Firebase.
3) Envia idToken para POST /admin/api/session.
4) Backend valida token e decide se é admin (whitelist).
5) Backend cria *session cookie* e seta cookie session (httpOnly).
6) Proxy e APIs usam esse cookie para permitir/negarem acesso.

### 3.2.1 Whitelist de emails (autorização)
Existe uma whitelist em:
- src/lib/auth/auth.ts
Variável de ambiente:
- ADMIN_ALLOWED_EMAILS (geralmente lista separada por vírgula)

Padrão recomendado:
- Normalizar: trim, lowercase
- Comparar email do token
- Não confiar em email vindo do client

---

## 3.3 Firebase Admin SDK vs Firebase Client SDK

### Client SDK (navegador)
Arquivo:
- src/lib/firebase/client.ts

Usado para:
- Login admin (UI)
- obter idToken

*Observação*: variáveis NEXT_PUBLIC_* são expostas ao navegador (isso é normal para Firebase client).

### Admin SDK (servidor)
Arquivo:
- src/lib/firebase/admin.ts

Usado para:
- Validar idToken
- Criar Session Cookie
- Ler/Escrever Firestore com privilégios do servidor
- Operações “privilegiadas”

Fonte da credencial:
- FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON (produção; recomendado)
- fallback local (ex.: arquivo local) *somente dev* (nunca comitar)

---

## 3.4 Cookies e Boas práticas

Cookie session deve ser:
- httpOnly: true (frontend não lê)
- secure: true em produção (HTTPS)
- sameSite: pelo menos lax
- path: / (ou /admin dependendo da estratégia)
- expiração coerente (ex.: horas/dias)

Logout:
- POST /admin/api/logout remove cookie (set maxAge=0 ou expiração no passado)

---

## 3.5 Threat Model (resumo honesto)

### O que este projeto já faz bem
- Bloqueia acesso casual ao /admin
- Usa sessão server-side (melhor do que “token no localStorage”)
- Centraliza CRUD em APIs

### O que você deve checar/fortalecer (se quiser nível “empresa”)
- APIs admin validam de fato o cookie (não só “existe cookie”)
- Whitelist aplicada no servidor
- Rate limit em endpoints de sessão (mitigar brute force)
- Log de auditoria (quem criou/editou/excluiu)
- Upload cloudinary com regras fortes (presets com restrições)

---

# 4) Firestore: Modelos de Dados (Types) + Convenções

Os tipos ficam em src/types/*. A modelagem real deve estar nesses arquivos.

## 4.1 Produto — src/types/produto.ts
Campos esperados (baseado no uso do projeto e forms):
- nome: string
- descricao?: string
- quantidade?: number
- ativo: boolean
- publicado: boolean
- ordem: number
- fotoUrl?: string
- fotoPublicId?: string
- codigo?: string
- preco?: number

Convenções:
- publicado=true → aparece no catálogo público
- ativo=false → item “some” (não listar)
- ordem asc → define prioridade no catálogo

## 4.2 Kit — src/types/kit.ts
Campos esperados:
- nome: string
- descricao?: string
- ativo: boolean
- publicado: boolean
- ordem: number
- fotoUrl?: string
- fotoPublicId?: string
- codigo?: string
- preco?: number
- itens?: unknown[] (o projeto usa unknown[] no form; ideal tipar como KitItem[])

Recomendação:
- Criar tipo explícito KitItem (id do produto, nome, qtd, preço snapshot se necessário)

## 4.3 Galeria — src/types/galeria.ts
Campos esperados:
- fotoUrl: string
- fotoPublicId: string
- (provável) titulo?: string, descricao?: string
- ativo: boolean
- ordem: number

---

# 5) Camada de Serviços (Data Access Layer)

Local:
- src/lib/services/*

Objetivo:
- isolar acesso ao Firestore
- padronizar queries/validações
- reusar em API e páginas server/client

Lista real:
- counter.service.ts
- galeria.public.service.ts
- kit.admin.service.ts
- kit.public.service.ts
- kit.service.ts
- produto.public.service.ts
- produto.service.ts

## 5.1 Separação “public” vs “admin”
Esse projeto já sugere separação:
- *.public.service.ts → somente itens “publicados/ativos”
- *.admin.service.ts → acesso total/CRUD

Isso é excelente: evita “vazar rascunhos” no público por acidente.

## 5.2 Counter Service (códigos automáticos)
Arquivo:
- counter.service.ts

Provável função:
- gerar codigo incremental para produto/kit (ex.: PROD-0001, KIT-0001)
- usa documento de contador no Firestore (ex.: _counters)

Recomendação de robustez:
- usar transação (transaction) para incrementar contador
- garantir atomicidade sob concorrência

---

# 6) APIs: Contratos, Padrões e Regras

As APIs admin ficam em:
- src/app/(admin)/admin/api/.../route.ts

As APIs públicas ficam em:
- src/app/api/public/.../route.ts

## 6.1 Padrões recomendados (se você mexer)
- *Sempre* validar sessão no server antes de CRUD
- *Sempre* validar payload (tipo, ranges, campos obrigatórios)
- *Sempre* normalizar strings (trim)
- *Sempre* tratar erros com status correto (400, 401, 403, 404, 500)
- *Nunca* retornar stack trace em produção

## 6.2 Regras de publicação (já usadas no projeto)
Nos forms:
- não publicar sem imagem (em produto/kit/galeria, conforme implementado)

Isso deve ser reforçado no backend também (API), para não depender só do client.

---

# 7) Upload de Imagens (Cloudinary)

Arquivos:
- src/components/admin/ImageUploader.tsx
- src/lib/cloudinary.ts

## 7.1 Estratégia atual: unsigned upload presets
Variáveis:
- NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_KITS
- NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PRODUTOS

Como funciona:
- O browser envia direto ao Cloudinary usando preset
- Retorna secure_url (ou url) e public_id
- Esses valores são salvos no Firestore via API

## 7.2 Risco e mitigação
Unsigned upload significa:
- qualquer um com o preset consegue tentar upload (se descobrir)

Mitigações:
- presets restritos por:
  - pasta fixa (folder)
  - formatos (allowed_formats)
  - tamanho máximo
  - transformação/limitação
- rotacionar preset se vazar
- alternativa “empresa”: signed upload via backend (assinar request)

---

# 8) UI / Design System (funcional)

## 8.1 Fundamentos
- Tailwind via classes
- Base global: src/app/globals.css

## 8.2 Componentes reutilizáveis (UI)
Pasta:
- src/components/ui

Itens:
- Button.tsx, Card.tsx, Badge.tsx, BackToCatalog.tsx

Regra:
> Se um padrão se repetir 3+ vezes, vira componente UI.

## 8.3 Layout público
Pasta:
- src/components/layout

Itens:
- PublicHeader.tsx
- PublicFooter.tsx
- Container.tsx

Mudança frequente:
- link da logo (ex.: apontar para /catalogo)

## 8.4 Catálogo (cards/detalhes)
Pasta:
- src/components/catalog

Itens:
- ProdutoCard.tsx, ProdutoDetail.tsx
- KitCard.tsx, KitDetail.tsx

## 8.5 Admin (forms/tabelas)
Pasta:
- src/components/admin

Itens:
- ProdutoForm.tsx, ProdutoTable.tsx
- KitForm.tsx, KitTable.tsx
- GaleriaForm.tsx, GaleriaTable.tsx
- Delete*Button.tsx

---

# 9) Home do Next e Redirecionamento

src/app/page.tsx é a rota /.

Se você não quer cair em “página default”:
- Opção A (recomendada UX): logo aponta para /catalogo (em PublicHeader)
- Opção B (blindagem): / redireciona para /catalogo

Implementação típica (B):
```ts
import { redirect } from "next/navigation";
export default function Home() { redirect("/catalogo"); }


---

10) Variáveis de Ambiente (definição completa)

> O repositório deve conter apenas .env.example.
Nunca commitar .env.local e nem credenciais.



10.1 Firebase Client (públicas)

Usadas em src/lib/firebase/client.ts:

NEXT_PUBLIC_FIREBASE_API_KEY

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN

NEXT_PUBLIC_FIREBASE_PROJECT_ID

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID

NEXT_PUBLIC_FIREBASE_APP_ID


10.2 Cloudinary (públicas)

Usadas em upload:

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_KITS

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_PRODUTOS


10.3 Site (pública)

NEXT_PUBLIC_SITE_URL (links, WhatsApp, etc.)


10.4 Admin (sensíveis)

ADMIN_ALLOWED_EMAILS (whitelist)

FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON (sensível)


10.4.1 FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON “em uma linha”

O valor é um JSON inteiro “stringificado” numa linha. Se tiver \n, deve ficar escapado. O código normalmente faz:

replace(/\\n/g, '\n')



---

11) Rodar Localmente (dev)

11.1 Instalar

npm install

11.2 Configurar env

Crie .env.local a partir de .env.example.

11.3 Rodar

npm run dev

Acessos:

Público: http://localhost:3000/catalogo

Admin: http://localhost:3000/admin → deve redirecionar para /admin/login (sem sessão)



---

12) Build e Execução (produção local)

Antes de deploy, rode:

npm run build
npm start

Regra:

> Se falha local, falha na Vercel.




---

13) Deploy (Vercel)

Fluxo:

1. Repo no GitHub


2. Importar na Vercel


3. Configurar Environment Variables (Production + Preview, conforme necessidade)


4. git push → build e deploy automáticos



Checklist pré-deploy:

.env.local fora do repo

nenhum serviceAccount*.json no repo

build local ok

proxy ok



---

14) Fluxos Internos Detalhados (end-to-end)

14.1 Login Admin (sessão)

1. /admin/login


2. Firebase Auth client autentica


3. Client envia idToken para POST /admin/api/session


4. Server valida:

token ok

email ∈ ADMIN_ALLOWED_EMAILS



5. Server seta cookie session


6. Navegação para /admin passa



Falhas comuns:

ADMIN_ALLOWED_EMAILS vazio ou email com espaço

service account inválida

clock skew / token expirado

cookie não setado por configuração de domínio


14.2 Criar Produto

1. /admin/produtos/novo


2. Preenche form (nome/descrição/status/ordem/qtd/preço)


3. Upload foto:

Cloudinary retorna url e publicId



4. Submit chama API:

POST /admin/api/produtos



5. Backend:

valida sessão

valida payload

gera codigo via counter.service.ts (se implementado assim)

salva no Firestore



6. Público lista conforme:

ativo=true e publicado=true

ordenado por ordem asc




14.3 Editar Produto

Página /admin/produtos/[id]

Busca dados pela API

PATCH em /admin/api/produtos/[id]


14.4 Criar/Editar Kit

Mesmo padrão:

/admin/kits/novo

/admin/kits/[id]


14.5 Galeria (publicação)

Admin gerencia em /admin/galeria

Público consome via página /galeria e API GET /api/public/galeria



---

15) Observabilidade e Debug (prático)

15.1 Onde olhar erros

Console do browser (client)

Logs do Vercel (server)

npm run build local (falhas de build)

Firebase console (Firestore / Auth)


15.2 Falhas clássicas

(A) Proxy vs Middleware

Next 16 não aceita conflito. Regra:

Use src/proxy.ts

Não mantenha middleware.ts em paralelo


(B) Inputs number “não dá pra digitar”

Causa: Number(e.target.value) || 0 no onChange. Correção: guardar string e converter no submit (vocês já corrigiram nos forms).

(C) Index do Firestore

Queries com where + orderBy pedem índice. Crie pelo link que o Firebase mostra no erro.


---

16) Convenções do Código (para dev/IA)

16.1 Separação de responsabilidades

src/app/** → rotas, páginas, handlers

src/components/** → UI e composição

src/lib/services/** → Firestore / regras de negócio

src/lib/firebase/** → setup Firebase

src/types/** → tipos e contratos


16.2 Padrão de nome

Services: *.service.ts

Public vs Admin: *.public.service.ts / *.admin.service.ts

Route handlers: route.ts

Pages: page.tsx

Layouts: layout.tsx


16.3 Regra de ouro

> O backend é autoridade final.
Não confie no client para regras críticas (publicar, autorização, etc.)




---

17) Hardening “empresa” (se quiser elevar o nível)

17.1 Validar sessão de verdade em todas APIs admin

verificar cookie

verificar session cookie no Firebase Admin (verifySessionCookie)

negar com 401/403


17.2 Auditoria

Guardar:

updatedAt, updatedBy

createdBy

trilha de alterações (opcional)


17.3 Rate limiting

Em:

/admin/api/session

endpoints de CRUD


17.4 Signed uploads

Se quiser evitar qualquer risco com unsigned presets:

mover upload para backend assinado (Cloudinary signature)



---

18) Checklist de Segurança (operacional)

[ ] .env.local nunca vai para git

[ ] FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON só na Vercel (env)

[ ] ADMIN_ALLOWED_EMAILS configurado corretamente

[ ] Proxy protege /admin/*

[ ] API valida sessão + autorização

[ ] Presets Cloudinary restritos

[ ] Teste em aba anônima:

/admin redireciona para /admin/login

CRUD sem sessão falha (401/403)




---

19) “Guia para IA” (como entender rápido)

19.1 Entradas mais importantes

1. src/proxy.ts (segurança /admin)


2. src/app/(admin)/admin/api/session/route.ts (sessão)


3. src/lib/firebase/admin.ts (credencial/SDK)


4. src/lib/services/*.service.ts (regras de dados)


5. src/types/* (modelos)


6. src/components/admin/*Form.tsx (contratos de payload/UX)


7. src/app/(public)/catalogo/* (consumo público)



19.2 Como modificar com segurança

mexer nos services antes das páginas

atualizar types

atualizar forms

garantir validação nas APIs



---

20) Roadmap técnico (sugestões)

Tipar itens do kit (remover unknown[])

Auditoria (createdBy/updatedBy)

Testes (unit para services, e2e para rotas admin)

Upload assinado

RBAC (roles além de whitelist)



---

Licença

Defina conforme necessidade (MIT / Proprietária / etc.)

---

Esse README tem:

Mapa completo do projeto (todas as pastas/arquivos relevantes e o que cada um faz).

Rotas públicas e admin (páginas e APIs, com os caminhos reais).

Arquitetura (como o fluxo roda: Next.js → proxy → APIs → Firebase/Firestore → Cloudinary).

Segurança e autenticação (Firebase Auth no client + criação de Session Cookie no server + proteção do /admin via src/proxy.ts + whitelist ADMIN_ALLOWED_EMAILS).

Modelos de dados do Firestore (produto/kit/galeria, campos e regras como ativo/publicado/ordem).

Camada de services (src/lib/services/*): separação admin vs public, contador automático (counter.service.ts), boas práticas.

Upload de imagem (Cloudinary presets, ImageUploader.tsx, riscos e mitigação).

Design system funcional (Tailwind + components/ui, components/layout, components/catalog, components/admin).

Variáveis de ambiente (o que é público NEXT_PUBLIC_*, o que é sensível, como configurar .env.local e Vercel).

Fluxos end-to-end (login admin, criar/editar produto/kit/galeria, publicação no catálogo).

Debug/Troubleshooting (proxy vs middleware, índices Firestore, build, cookies).

Hardening “nível empresa” (validação real de sessão nas APIs, auditoria, rate limit, upload assinado).


Qualquer IA decente vai entender e conseguir propor melhorias, porque o README aponta onde está cada peça crítica (proxy, session route, admin/firebase, services, types, forms) e como elas se conectam. Ele é útil para “navegação” + “mudança segura”: o dev/IA sabe exatamente onde mexer para cada tipo de alteração.

O que eu analisei para criar esse README:

A árvore real do projeto que você enviou (tree src /F) — isso define rotas, grupos (admin)/(public), APIs, services, components e types.

O ZIP do projeto que você enviou (para confirmar estrutura e nomes dos módulos citados, como proxy.ts, firebase/admin.ts, auth/auth.ts, cloudinary.ts, services/, types/).
