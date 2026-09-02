# Proyectos activos

Cada pieza de la newsletter **baja a uno de estos proyectos** (`CLAUDE.md` §4). El
campo `project` del frontmatter tiene que ser uno de los slugs de aquí, y
`projectTakeaway` dice qué cambia esa pieza en ese proyecto. Uno solo, no tres:
etiquetarlos todos destruye la utilidad del campo.

> Los proyectos y su objetivo los definió Pau. Los apartados de *qué material le
> sirve* los derivó Claude de ese objetivo. Las *preguntas abiertas* son
> candidatas: están sin confirmar y hay que corregirlas.

---

## `auditoria-gestorias`

**Qué es:** el sistema que diagnostica un despacho en una sesión corta y devuelve
un plan de automatización priorizado.

**Qué quiere Pau:** dejar de auditar a mano. Que entrar en una gestoría nueva y
salir con una propuesta ordenada sea un proceso repetible, no una hoja en blanco
cada vez.

**En qué fase está:** por construir. **Es la prioridad actual.**

La métrica: que la auditoría de un despacho nuevo salga sola y sea **comparable**
con las anteriores. Sin comparabilidad no hay base de conocimiento, solo informes
sueltos.

**El entregable, en cinco bloques:**

1. Inventario de procesos con volumen mensual y horas dedicadas.
2. Clasificación: mecánico (automatizable hoy), de criterio (asistible), de
   relación (no tocar).
3. Horas recuperables por proceso, separando facturables de no facturables.
4. Orden de ataque: solo los 2-3 que superan el umbral de amortización.
5. Estado de Verifactu y qué le queda al despacho antes de 2027.

**Cifras de referencia del sector:**

- Un despacho de 4-10 personas recupera 20-40 h/mes automatizando 2-3 procesos.
- Un proyecto de back-office ronda 5.000-12.000 € y se amortiza con ≥15 h/mes de
  trabajo facturable recuperado.
- OCR + IA extrae datos de factura con >95% de precisión en facturas estándar.

**Qué material le sirve:**

- **Entrevista estructurada conducida por un modelo.** Preguntas fijas, respuestas
  numéricas, cálculo determinista al final. Cómo se evita que el modelo improvise
  el guion.
- **Sesiones largas sin perder datos.** Una auditoría real mezcla entrevista y
  revisión de documentos. Todo lo de compaction con instrucciones que protegen las
  cifras, y clearing de documentos re-consultables.
- **Memoria entre sesiones.** Volver tres meses después y que el sistema recuerde
  qué se dijo y qué se implementó. Es la parte con valor comercial.
- **Casos reales de despachos automatizando**, con horas y euros, no con adjetivos.

**Qué material NO le sirve:** frameworks de agentes genéricos sin caso de uso;
demos de razonamiento; nada que no acabe en un número que se pueda poner en una
propuesta.

Plan de implementación detallado: `src/content/guides/auditoria-rapida-gestoria-v1.md`.

**Preguntas abiertas** *(candidatas — corregir)*:

- ¿Cuántas auditorías has hecho ya a mano, y qué parte del guion se te repitió?
- ¿El despacho te enseña documentos durante la sesión, o los pides después?

---

## `sistema-gestorias`

**Qué es:** la **base genérica desde la que se monta el pipeline a medida de cada
gestoría**. Sin nombre todavía — cuando lo tenga, se renombra el slug aquí, en
`src/content.config.ts`, en `src/lib/site.ts` y en las piezas ya publicadas.

**Qué quiere Pau:** ahorrarse tiempo. Cada despacho acaba teniendo su pipeline
propio; lo que se construye una sola vez es el andamiaje. Esto manda sobre todo lo
demás: **la métrica del proyecto es cuánto se tarda en poner en pie una gestoría
nueva**, no lo bonito que sea el sistema.

De ahí sale el criterio para decidir qué entra en la base y qué se queda a medida:
solo generaliza lo que se repite despacho tras despacho. Meter en el núcleo algo
que en el segundo cliente hay que retorcer sale más caro que haberlo copiado.

**En qué fase está:** por construir. *(Confirmar si hay despacho piloto.)*

**Qué material le sirve:**

- **Piezas componibles, no un monolito.** Bloques que se recombinan por cliente:
  clasificar el documento, extraer campos, validar, escalar a humano. Cualquier
  patrón sobre cómo se trocea un pipeline para que la parte a medida sea lo más
  fina posible entra directo.
- **Configuración en vez de código.** Que el tipo de documento y sus campos se
  declaren en un archivo, no en una rama nueva del programa. Es lo que convierte
  cada cliente nuevo en horas en vez de semanas.
- **Un arnés de evaluación reutilizable.** Que montar la medición de un despacho
  nuevo sea meter su muestra y ya, con las métricas saliendo iguales para todos.
  Sin esto, cada cliente se audita a mano y el ahorro desaparece. Base:
  `auditoria-rapida-gestoria-v1`.
- **Qué generaliza y qué no.** Lo más valioso: material que muestre qué partes de
  un flujo documental son iguales en todas partes (validaciones aritméticas,
  taxonomías de error, formatos oficiales) y cuáles son siempre distintas
  (criterios contables del despacho, sus proveedores, sus manías).
- **Extracción documental y sus modos de fallo.** El caso feo — escaneo torcido,
  tabla partida, sello encima del dato — es el que decide si el andamiaje aguanta
  en el siguiente despacho o hay que rehacerlo.
- **Normativa que cambia la entrada.** Facturación electrónica, plazos y formatos
  de la AEAT, conservación documental, AI Act, encargado del tratamiento. Un cambio
  de formato obligatorio se arregla una vez en la base y llega a todos los clientes
  — o se arregla N veces, según lo bien montado que esté.

**Qué material NO le sirve:** demos de extracción sobre PDFs nativos y limpios;
arquitecturas de SaaS multi-tenant, porque cada gestoría tiene su pipeline y no
comparten ejecución; y optimizaciones que dependen de conocer el formato de antemano.

**Preguntas abiertas** *(candidatas — corregir)*:

- ¿Qué parte del trabajo se te repite de verdad entre despachos, y cuál creías que
  se repetía y luego no?
- ¿Cuántas horas te lleva hoy poner en pie una gestoría nueva, y en qué se van?

---

## `customlab`

**Qué es:** empresa de merchandising para empresas. Producto promocional
personalizado con la identidad del cliente.

**Qué quiere Pau:** automatizar al máximo el embudo entero — **marketing**,
**inbound de clientes** y **pedidos**. No son tres proyectos: es una sola cadena,
y lo que entra por marketing tiene que llegar hasta el pedido sin que alguien lo
retranscriba a mano en cada salto.

**En qué fase está:** objetivo declarado, todavía por construir. La web pública
existe (repo `pauqbrs/pixel-perfect`: Vite + React + TypeScript + Tailwind +
shadcn/ui, precios por volumen, descuentos escalonados, control de redenciones con
Upstash). *(Confirmar qué parte del embudo funciona ya de verdad.)*

**Qué material le sirve:**

- **Voz de marca a volumen.** Generar contenido de marketing que suene igual pieza
  tras pieza. Interesa cómo se ancla un estilo (ejemplos, guía de voz en el prompt)
  y sobre todo **cómo se comprueba** que el resultado sigue sonando a la marca, que
  es la parte que casi nadie mide.
- **Cualificación de lo que entra.** Un mensaje de formulario, email o WhatsApp se
  convierte en: qué quiere, cuántas unidades, para cuándo, con qué presupuesto — y
  si merece que lo coja una persona. Clasificación fiable con pocos ejemplos y
  umbrales de escalado a humano.
- **El fallo aquí es asimétrico.** Descartar un lead bueno cuesta mucho más que
  atender uno malo. Cualquier cosa sobre optimizar contra costes de error
  desiguales (en vez de contra la precisión media) entra directo.
- **Brief libre a pedido estructurado.** Prosa desordenada de un cliente convertida
  en campos: artículo, cantidades por talla, técnica de estampado, tintas, plazo,
  entrega. Extracción, validación, y confirmación con el cliente antes de producir.
- **Latencia y coste por interacción.** El inbound quiere respuesta en minutos, y
  el negocio es de muchas peticiones pequeñas: manda el céntimo por conversación,
  no la capacidad de razonamiento.

**Qué material NO le sirve:** benchmarks de razonamiento largo, agentes autónomos
de veinte pasos, contextos de un millón de tokens.

**Preguntas abiertas** *(candidatas — corregir)*:

- ¿Por dónde entra hoy la mayoría del inbound: formulario, email o WhatsApp?
- ¿Cuál es el salto del embudo donde más se retranscribe a mano ahora mismo?

---

## Cómo rellenar las *preguntas abiertas*

Es el apartado que más rinde. Van las dudas concretas que tengas hoy sin resolver,
escritas tal cual las dirías: *"no sé si me sale más a cuenta un modelo grande de
una pasada o uno pequeño con validación encima"*, *"no tengo forma de saber si se
ha equivocado sin revisarlo todo"*.

Cuando una fuente responde una de estas, la pieza se escribe sola y el aterrizaje
deja de ser genérico.

## Cómo añadir un proyecto

1. Añade su slug a `PROJECTS` en `src/content.config.ts`.
2. Añade su entrada a `PROJECT_META` en `src/lib/site.ts`, con su `metric`.
3. Documéntalo aquí con el mismo esqueleto: qué es, qué quiere Pau, en qué fase
   está, qué material le sirve, qué material NO le sirve, preguntas abiertas.
