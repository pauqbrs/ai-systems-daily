# Proyectos activos

Cada pieza de la newsletter **baja a uno de estos proyectos** (`CLAUDE.md` §2.5).
El campo `project` del frontmatter tiene que ser uno de los slugs de aquí.

> Los proyectos y su objetivo los definió Pau. Los apartados de *qué material le
> sirve* los derivó Claude de ese objetivo. Las *preguntas abiertas* son
> candidatas: están sin confirmar y hay que corregirlas.

---

## `customlab`

**Qué es:** empresa de merchandising para empresas. Producto promocional
personalizado con la identidad del cliente.

**Qué quiere Pau:** automatizar al máximo el embudo entero — **marketing**,
**inbound de clientes** y **pedidos**. No son tres proyectos: es una sola cadena,
y lo que entra por marketing tiene que llegar hasta el pedido sin que alguien lo
retranscriba a mano en cada salto.

**En qué fase está:** objetivo declarado, todavía por construir. *(Confirmar si ya
hay alguna parte funcionando.)*

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

- ¿Dónde está hoy el cuello de botella real: en generar marketing, en atender lo
  que entra, o en pasar de conversación a pedido?
- ¿Qué parte puede ir sin humano delante y cuál no?

---

## `sistema-gestorias`

**Qué es:** la **base genérica desde la que Pau monta el pipeline a medida de cada
gestoría**. Sin nombre todavía — cuando lo tenga, se renombra el slug aquí y en las
piezas ya publicadas.

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
  taxonomías de error, formatos oficiales) y cuáles son siempre distintas (criterios
  contables del despacho, sus proveedores, sus manías).
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

## Cómo rellenar las *preguntas abiertas*

Es el apartado que más rinde. Van las dudas concretas que tengas hoy sin resolver,
escritas tal cual las dirías: *"no sé si me sale más a cuenta un modelo grande de
una pasada o uno pequeño con validación encima"*, *"no tengo forma de saber si se
ha equivocado sin revisarlo todo"*.

Cuando una fuente responde una de estas, la pieza se escribe sola y el aterrizaje
deja de ser genérico.
