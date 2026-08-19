# A REGRA DE PEDRO
## Lei de fundação do FARO™
**Decretada pelo dono em 19/08/2026 · nascida da Parábola do Abacaxi**

---

## A parábola

Pedro pede um abacaxi.

O atendente ruim entrega o abacaxi. Pergunta respondida, transação encerrada, ninguém mentiu.

O atendente bom entrega o abacaxi **e diz que a mexerica está na promoção** — porque ele
sabe o que Pedro veio fazer ali, não só o que Pedro pediu. E quando Pedro decide, o atendente
**deixa a carga reservada e espera o "pode fechar"**. Não fecha sozinho.

A diferença entre os dois não é simpatia. É **saber para que serve a pergunta**.

---

## A lei

Toda entrega do FARO — ficha, alerta, relatório, resposta de API, tela — cumpre os quatro
movimentos. Sem exceção.

### 1. Responde o que foi perguntado, COM PROVA

Fonte · data de coleta · data de referência · regra de transformação · **limite de
inferência**. Na linha da afirmação, nunca em rodapé.

Resposta sem procedência não é resposta — é opinião com cara de dado.
`[canon: MODELO-FARO-V2.md §3]`

### 2. Traz o adjacente que não foi perguntado

**A mexerica na promoção.** O evento vizinho, a tese ao lado, a empresa do mesmo grupo, o
prazo que vence antes do que ele veio olhar.

O assinante pediu uma tese porque tem um problema — não porque tem curiosidade sobre aquela
tese. Se o FARO enxerga algo relevante ao lado e cala, ele entregou o abacaxi.

**Restrição:** adjacente **relevante**, não catálogo. Três sugestões fracas valem menos que
uma forte. E o adjacente carrega prova igual ao principal — não é palpite de vendedor.

### 3. Argumenta contra si mesma quando deve

O campo **"por que não perseguir"**. Documentação provavelmente ausente · período possivelmente
prescrito · precedente desfavorável · fonte degradada · sinal isolado · capacidade de
utilização duvidosa.

Num funil onde 0,05% do topo vira negócio relevante, **eliminar rápido vale tanto quanto
encontrar**. `[canon: MODELO-FARO-V2.md §4.2]`

### 4. Deixa a carga reservada e espera o "pode fechar"

**O sistema prepara. O humano autoriza. Nunca o contrário.**

O FARO monta a ficha, calcula, ordena, sugere a ação — e **para**. Não dispara e-mail, não
abre processo, não compensa crédito, não contata empresa. A carga fica reservada até alguém
com nome e responsabilidade dizer "pode fechar".

Isto não é timidez de produto: é a mesma linha que a Lei 8.906/94 desenha entre **sugestão de
dados** e **decisão do contribuinte**. `[canon: CANAL-OPERADOR-PARCEIRO.md]`

---

## O veredito

> ### Entrega que só responde a pergunta é bug de caráter, não feature.

Não se conserta com mais dado nem com melhor modelo. Conserta-se decidindo, no schema e na
tela, que a entrega tem quatro movimentos e não um.

---

## Como a regra vira código

A Regra de Pedro guia **schema, UI e copy** em todas as Ondas. Onde ela já tem consequência
concreta:

| Movimento | No schema | Na tela |
|---|---|---|
| **1. Prova** | Cadeia de evidência com `source_id`, `collected_at`, `reference_date`, regra de transformação e limite de inferência **por nó** — não por ficha | Fonte e data na linha da afirmação |
| **1. Prova** | Campos de **proxy fisicamente separados** dos campos de fato — a Confidence Policy no schema, não na disciplina de quem escreve | Proxy nunca renderiza como número observado |
| **2. Adjacente** | Evento e ficha carregam vínculos (mesma empresa, mesmo grupo, tese vizinha) — o adjacente é **consultável**, não improvisado | Bloco "o que mais apareceu por perto" |
| **3. Contra si** | `por_que_nao_perseguir` é **coluna**, não observação livre | Campo obrigatório na ficha, não escondido |
| **4. Reserva** | Toda ação sai em estado **preparada**; execução exige autorização registrada com autor | Nenhum botão dispara efeito externo sem confirmação nomeada |

**Consequência de arquitetura:** um campo obrigatório no schema é uma promessa que o banco
cobra. Uma promessa que só vive na copy é uma promessa que a próxima pressa apaga.

---

## Relação com as outras leis

A Regra de Pedro não substitui nada — **ela é o formato de entrega** que as outras leis
alimentam:

- A **Lei das Camadas** dá o movimento 1 (a prova).
- O **EV líquido** e o **campo por-que-não** dão o movimento 3 (o contra-argumento).
- A **cláusula-blindagem** dá o movimento 4 (a reserva).
- O movimento 2 — **o adjacente** — é o que a Regra de Pedro acrescenta ao canon. É a parte
  que nenhuma lei anterior cobria.

---

*ALSHAM Global Commerce · lei de fundação. Vale em todas as Ondas, em toda superfície.*
