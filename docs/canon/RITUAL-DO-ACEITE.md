# RITUAL DO ACEITE — como se compra uma Caçada

> **Canon.** Decretado pelo dono em 19/08/2026.
> Companheiro obrigatório de [`MODELO-DE-NEGOCIO.md`](./MODELO-DE-NEGOCIO.md) §D:
> lá está *quanto custa*, aqui está *como se compra*.

---

## §1 — O PROBLEMA QUE ESTE RITUAL RESOLVE

O cliente não sabe montar uma tese boa. E não é falha dele: a tese é o produto
mais difícil do FARO, e quem chega chega com uma frase — *"quero empresas que
pagaram imposto a mais"*, *"quero indústria que exporta"*.

Uma frase não é uma tese. Vira uma se alguém a traduzir em parâmetros, disser
quais têm prova e quais são proxy, e conferir se existe território.

Sem isso, a sequência é sempre a mesma:

```
tese ruim  →  entrega frustrada  →  pedido de reembolso  →  cliente perdido
                                                            + reputação gasta
```

E o pior: **o dinheiro já foi cobrado quando o problema aparece.** O reembolso
vira discussão jurídica sobre uma coisa que era só um mal-entendido de escopo.

**O ritual resolve isso ANTES de cobrar.** Ele empurra a frustração para antes do
pagamento, onde ela custa uma conversa em vez de custar um cliente.

> Este não é um documento de UX. É a peça comercial que impede o produto de
> vender o que não pode entregar.

---

## §2 — OS QUATRO PASSOS

**Toda compra passa pelos quatro. Sem exceção, sem atalho para cliente conhecido,
sem "esse aqui a gente já sabe o que quer".** A exceção de hoje é o processo
padrão de daqui a um ano.

### Passo 1 — A PRESA EM LÍNGUA DE GENTE

Campo livre. O cliente escreve o que procura como falaria com um sócio.

> *"Indústria no interior de SP que importa insumo e provavelmente pagou PIS/
> Cofins a mais na entrada."*

**Login obrigatório ANTES deste passo.** Nenhum passo do ritual roda anônimo — e
a razão está no §3: o funil inteiro é gratuito até o Aceite, e gratuito+anônimo é
convite ao garimpo.

Nada de formulário com trinta campos. Formulário longo faz o cliente desistir ou
mentir, e a tradução é trabalho do próximo passo.

### Passo 2 — O ESPELHO DO REFINADOR

A IA da casa traduz a frase em tese paramétrica e devolve **duas colunas, lado a
lado**:

| O que tu pediste | O que dá para caçar COM PROVA |
|---|---|
| "indústria no interior de SP" | CNAE industrial × UF=SP × município fora da RMSP — **fato** (cadastro oficial) |
| "que importa insumo" | **`PROXY`** — não observamos importação. Observamos CNAE de atividade importadora e porte. Limite: uma empresa pode ter o CNAE e não importar |
| "pagou PIS/Cofins a mais" | **`PROXY`** — não observamos apuração. Observamos regime, porte e setor com histórico de tese. Limite: só a documentação da empresa confirma |

**Todo proxy sai declarado como proxy, na tela, na hora.** É a Confidence Policy
operando na **venda**, não só na entrega — e é aqui que ela vale mais: um proxy
declarado antes do pagamento é uma expectativa calibrada; o mesmo proxy declarado
depois é uma desculpa.

**Refino é grátis e ilimitado ANTES da caçada.** O cliente reescreve quantas
vezes quiser; o Espelho responde quantas vezes for preciso. É a parte barata do
processo e a que mais determina se a entrega vai prestar.

> ⛔ **Tese nova DEPOIS da entrega é Caçada nova.** Não é rigidez comercial: uma
> tese diferente é uma varredura diferente, com custo de computação diferente.
> "Refinar depois" seria caçar de novo de graça, e isso torna a Caçada
> impagável.

### Passo 3 — O CENSO PRÉVIO

Antes de cobrar, o FARO conta o território na jazida e mostra **só a ordem de
grandeza**:

> **Território estimado: entre 300 e 1.000 empresas** compatíveis com esta tese.

Nunca o número exato. Nunca a lista. Nunca nome de empresa. O porquê está no §3.

**Se o território for magro, o sistema RECUSA a venda** e sugere alargar a tese:

> *"Encontramos menos de 30 empresas com este recorte. Uma Caçada aqui provavelmente
> entregaria menos de 3 alvos com evidência suficiente. Sugestões para alargar:
> incluir municípios vizinhos · aceitar dois CNAEs próximos · ampliar a faixa de
> porte."*

**Esta é a linha mais importante do ritual.** É onde o reembolso se evita — na
contagem, não no jurídico. Um "não" aqui custa uma venda; o mesmo "não" depois do
pagamento custa a venda, o reembolso, o tempo de disputa e a indicação que o
cliente não vai fazer.

Vender uma caçada num território vazio é vender uma rede num lago sem peixe. A
rede funciona. O lago é que não tem peixe.

### Passo 4 — O ACEITE DA CAÇADA

Página gerada na hora, com quatro blocos:

**1 · A tese final por extenso** — em português, não em parâmetros. O cliente
precisa reconhecer a própria intenção no texto.

**2 · O que será entregue** — quantidade de alvos, prazo, formato, e as fontes
**em nível de categoria** ("cadastros públicos federais", "dados setoriais de
energia"). Categoria, não receita: o método fino é o que se está vendendo.

**3 · O que NÃO é** — no mesmo tamanho de fonte que o resto, não em rodapé de
6pt:

> - **Não é parecer tributário nem jurídico.** Não substitui profissional
>   habilitado.
> - **Não garante conversão, contrato ou recuperação de valor.**
> - O que se entrega são **sinais compatíveis para investigação** — hipóteses com
>   procedência, para o profissional decidir se investe tempo.
> - Os valores exibidos são **estimativas de ordem de grandeza**, calculadas sobre
>   dado público. Não são apuração.

**4 · O aceite** — checkbox + botão **"Aprovo esta caçada"**. E **só então**
pagamento e execução.

O aceite grava na trilha imutável: **quem** aprovou, **quando**, e **qual versão
da tese**. As teses são versionadas desde a fundação do schema justamente para
isto — em caso de disputa, a pergunta é sempre *"o que exatamente foi acordado?"*,
e a resposta é um registro que ninguém pode reescrever, nem nós.

---

## §3 — A DEFESA DO FUNIL

O funil é gratuito até o Aceite. Isso é deliberado, e cria um risco óbvio: alguém
usa o Refinador e o Censo repetidamente para mapear o território de graça, sem
nunca comprar.

As defesas, em ordem de dureza:

**1 · Censo só em faixa.** Sem número exato, sem recorte por sub-critério, sem
nome de empresa, sem export. Faixa responde *"vale a pena?"* sem responder
*"quem?"* — e é o "quem" que se vende.

**2 · Identificação verificada antes do censo, e 3 censos de cortesia por conta.**
Do quarto em diante, só dentro de uma Caçada. Três é o bastante para um comprador
honesto testar duas ou três formulações; é pouco para quem quer mapear um estado.

**3 · O `usage_ledger` vigia o padrão censo-sem-compra** e corta o funil
educadamente. O abuso não é só bloqueado — **vira dado**. Quem faz 20 censos e
zero compras está dizendo alguma coisa: ou o preço está errado, ou o censo está
entregando demais, ou aquele perfil não é cliente. As três hipóteses só se
distinguem com o registro.

**4 · O método fino só aparece na ficha PAGA.** Quais fontes exatas, quais campos,
como se cruzam, qual a regra de transformação. O Espelho diz *o que* dá para
provar; a ficha diz *como se provou*.

### ⚖️ A calibragem — e o argumento contra defender demais

> **A contagem é quase-commodity.** Quem tiver a Base Aberta da RFB e paciência
> chega a um número parecido. O fosso do FARO **não é contar** — é o ranqueamento,
> o EV líquido, o evento que disparou, a cadeia de evidência e o "por que não
> perseguir". Isso mora atrás do pagamento e não vaza pelo censo.

Então **não se deve sobre-defender o funil a ponto de criar atrito para o
honesto.** Cada trava a mais protege contra um garimpeiro que ia copiar algo
quase-commodity, e cobra pedágio de dez compradores legítimos. É um mau negócio
disfarçado de prudência.

A régua: **defender o que é caro de produzir e difícil de copiar; deixar aberto o
que é barato e óbvio.**

---

## §4 — SIMETRIA COM A REGRA DE PEDRO

O [`REGRA-DE-PEDRO.md`](./REGRA-DE-PEDRO.md) governa a entrega. Este documento
governa a compra. **São o mesmo gesto, em direções opostas:**

| | Quem prepara | Quem autoriza | O gesto |
|---|---|---|---|
| **Entrega** (Regra de Pedro, mov. 4) | o sistema monta a ficha e a ação | **o humano** da casa | a carga fica reservada esperando o "pode fechar" |
| **Compra** (este ritual, passo 4) | o sistema monta a tese e o escopo | **o cliente** | a caçada fica reservada esperando o "Aprovo" |

Nos dois casos: **o motor nunca dispara sozinho.** Na entrega, para não abordar
uma empresa sem um humano ter olhado. Na compra, para não gastar computação — e
cobrar por ela — sem alguém ter dito que era isto mesmo.

É a mesma desconfiança produtiva apontada para os dois lados.

---

## §5 — PENDÊNCIAS DECLARADAS

### 🔴 L5 do LEXIS — o aceite e o direito de arrependimento

**Frente jurídica nova, adicionada à lista LEXIS em 19/08/2026.**

O CDC (art. 49) dá sete dias de arrependimento em compra fora do estabelecimento.
A Caçada é executada **imediatamente** após o aceite — a computação acontece, o
custo é real e não se desfaz. A peça que concilia as duas coisas é uma **cláusula
de execução imediata mediante consentimento expresso**, que precisa de redação
jurídica: quem a escreve, como aparece na tela, e o que se faz se o cliente pedir
arrependimento depois da entrega.

> ❔ **NÃO VERIFICADO.** Nada aqui é opinião jurídica. A cláusula não existe, e o
> ritual **não deve ir ao ar em autoatendimento** antes de L5 fechar. Ver
> [`DOSSIE-DE-BORDO.md`](../DOSSIE-DE-BORDO.md) §10.

### Na Fase 1, o ritual roda À MÃO

Enquanto não há tela, não há bloqueio: o ritual é um **processo**, e processo roda
com gente.

| Passo | Como roda na Fase 1 |
|---|---|
| 1 · A presa | a conversa inicial com o design partner |
| 2 · O Espelho | **leitura conjunta** — sentar, traduzir a frase em parâmetros na frente dele, apontar cada proxy em voz alta |
| 3 · O Censo | consulta manual à jazida, resultado dito em faixa |
| 4 · O Aceite | **proposta assinada**, com os quatro blocos do §2 escritos nela |

Rodar à mão primeiro não é gambiarra — é como se descobre o que a tela precisa
ter. Automatizar um ritual que nunca foi executado é automatizar um palpite.

---

## §6 — O QUE ESTE DOCUMENTO NÃO DECIDE

| Aberto | Quem fecha |
|---|---|
| A redação da cláusula de execução imediata | LEXIS L5 + advogado |
| O limite de 3 censos de cortesia | Calibragem pelo `uso.ledger` na Fase 1 |
| A largura da faixa do censo ("300–1.000" ou "centenas") | Teste com cliente real |
| O piso de território que dispara a recusa | Hoje é palpite; vira número quando houver histórico de entrega |

---

*ALSHAM Global Commerce · canon vivo. O sistema prepara; o humano autoriza —
dos dois lados do balcão.*
