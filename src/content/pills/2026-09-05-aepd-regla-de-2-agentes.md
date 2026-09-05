---
title: 'La regla de 2 de la AEPD: tu pipeline documental tiene las tres propiedades prohibidas'
date: 2026-09-05
section: gestorias
depth: analisis
readingMinutes: 3
tldr: 'La Agencia de Protección de Datos ha adoptado un umbral de diseño concreto para agentes: entrada no controlada, acceso a datos sensibles y acción automática, nunca las tres a la vez. Un flujo de facturas de proveedor las cumple las tres por defecto.'
sources:
  - title: 'Inteligencia artificial agéntica desde la perspectiva de protección de datos (V1.2, febrero de 2026)'
    url: 'https://www.aepd.es/guias/orientaciones-ia-agentica.pdf'
    author: 'Agencia Española de Protección de Datos (AEPD)'
    platform: docs
    publishedAt: 2026-02-18
  - title: 'La Agencia publica unas orientaciones sobre Inteligencia Artificial agéntica desde la perspectiva de protección de datos'
    url: 'https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/la-agencia-publica-unas-orientaciones-sobre-inteligencia'
    author: 'Agencia Española de Protección de Datos (AEPD)'
    platform: docs
    publishedAt: 2026-02-18
tags: ['gestorias', 'aepd', 'rgpd', 'agentes', 'seguridad', 'arquitectura', 'normativa']
project: sistema-gestorias
projectTakeaway: 'Convierte una decisión de arquitectura discutible en un umbral que el regulador ya ha escrito: el pipeline documental se parte en dos agentes con permisos distintos, y esa partición pasa al núcleo del andamiaje porque el motivo es normativo y por tanto idéntico en todos los despachos.'
glossary:
  - term: prompt injection
    definition: 'Colar instrucciones dentro de un contenido que el agente va a leer —un correo, un PDF, una página web— para que las obedezca como si vinieran de su dueño.'
  - term: shadow leak
    definition: 'Una fuga en la que el agente, manipulado desde el contenido que procesa, saca información fuera de la organización sin que nadie vea una brecha clásica: la exfiltración va disfrazada de acción normal del agente.'
  - term: PET
    definition: 'Privacy Enhancing Technology. Tecnología cuyo propósito es reducir la exposición de datos personales. La AEPD señala que un agente bien diseñado puede ser una de ellas, no solo un riesgo.'
  - term: EIPD
    definition: 'Evaluación de Impacto para la Protección de Datos. El análisis formal previo que exige el RGPD cuando un tratamiento es de alto riesgo.'
apply:
  - 'Coge tu flujo de facturas y marca cuál de las tres propiedades cumple cada paso: procesa contenido de terceros, toca datos personales, ejecuta acciones con efecto. Si un solo componente marca las tres, ahí está el problema y ya sabes dónde cortar.'
  - 'Parte el agente en dos con permisos distintos: uno que lee el documento del proveedor y solo puede devolver campos extraídos, sin acceso al fichero de clientes ni a herramientas de escritura; otro que valida y escribe, y que nunca ve el texto original del documento.'
  - 'Si no puedes partirlo, aplica el caso 1-2 de la regla: ninguna acción automática sin supervisión humana. Y dilo en la propuesta, porque cambia el ahorro de horas que estás vendiendo.'
  - 'Anota en la documentación del tratamiento cuál de las tres combinaciones has elegido y por qué. La AEPD pide decisiones «basadas en evidencias y documentadas»: si el criterio no está escrito, no existe.'
quiz:
  - question: 'Tu agente lee el PDF que manda un proveedor, consulta el histórico fiscal del cliente para clasificar el gasto y anota el asiento en el sistema contable. ¿Qué dice la regla de 2?'
    options:
      - 'Que está bien mientras el proveedor sea de confianza.'
      - 'Que es una configuración que no se debería permitir: cumple las tres propiedades a la vez.'
      - 'Que hace falta una EIPD, y con eso queda cubierto.'
      - 'Que hay que cifrar el PDF antes de procesarlo.'
    answer: 1
    explanation: 'Las tres propiedades están: contenido no controlado (el PDF viene de fuera), acceso a información sensible (el histórico del cliente) y acción automática con efecto (el asiento). La guía dice literalmente que esa combinación «no se debería permitir». La confianza en el proveedor no sirve como control: el atacante no tiene que ser el proveedor, basta con que alguien meta instrucciones en un documento que pase por ahí. Una EIPD es un análisis, no una medida: te dice que el riesgo existe, no lo elimina. Y el cifrado protege el documento en tránsito, no del contenido que lleva dentro.'
  - question: 'Decides que el agente sí necesita leer documentos de fuera y sí necesita escribir en el sistema contable. ¿Qué te obliga a hacer la regla?'
    options:
      - 'Nada más: dos propiedades están permitidas.'
      - 'Impedirle el acceso a información sensible y datos personales, que es el caso 1-3.'
      - 'Meter supervisión humana en cada factura.'
      - 'Reducir el número de pasos del agente.'
    answer: 1
    explanation: 'La guía enumera las tres combinaciones gestionables, y la 1-3 dice exactamente eso: si tratas automáticamente información incontrolada que puede desencadenar acciones automáticas, el agente ha de impedir el acceso a información sensible o datos personales. En la práctica significa que ese agente trabaja sobre el documento y devuelve campos, sin poder consultar la ficha del cliente. La supervisión humana en cada factura es la salida del caso 1-2, más cara en horas y por tanto peor si puedes partir el agente. Y limitar pasos es una buena práctica que la guía también recoge, pero no es lo que esta regla exige.'
  - question: 'Un despacho te dice que su proveedor de software «ya cumple el RGPD», así que la responsabilidad es de ellos. ¿Qué le respondes?'
    options:
      - 'Que es correcto: el encargado responde del tratamiento que ejecuta.'
      - 'Que incorporar un agente cambia al menos la naturaleza del tratamiento, y eso obliga al responsable a rehacer su ciclo de gestión del riesgo.'
      - 'Que solo importa si hay transferencias internacionales.'
      - 'Que basta con firmar un anexo al contrato.'
    answer: 1
    explanation: 'La guía lo dice sin rodeos: incluir un sistema de IA agéntica «cambia, al menos, la naturaleza del tratamiento» y puede reducir, aumentar o crear riesgos, lo que implica que el responsable debe realizar un nuevo ciclo de gestión del riesgo. El cumplimiento del proveedor cubre lo que el proveedor hace, no la decisión del despacho de meter un agente en su flujo. Las transferencias internacionales son un capítulo aparte de la misma guía, no el criterio general. Y el contrato reparte responsabilidades entre responsable y encargado; no sustituye al análisis de riesgo que la norma pide al responsable.'
---

## Un regulador que publica una regla de diseño

Lo raro de este documento no es que exista, es lo concreto que es. La AEPD publicó el 18 de febrero de 2026 unas orientaciones sobre IA agéntica de 76 páginas, y en el capítulo de gestión del riesgo adopta un umbral de arquitectura que se puede aplicar hoy, con un lápiz, sobre el diagrama de tu pipeline.

Se llama **regla de 2**. Viene de una regla de seguridad de Chromium de 2021 y ha sido reformulada para agentes. La AEPD la presenta como *«una aproximación simplificada para fijar un umbral mínimo de garantías que jamás hay que traspasar»*.

## Las tres propiedades

Un agente puede tener, como mucho, dos de estas tres a la vez:

1. **Tratar automáticamente información no controlada** — contenido que viene de fuera y del que no puedes garantizar que no lleve un ataque técnico o de ingeniería social.
2. **Acceder a información sensible o datos personales** de la organización o del usuario.
3. **Ejecutar acciones automáticas con efecto**, dentro o fuera de la organización.

El ejemplo que usa la guía es un agente que responde correos automáticamente. Si recibe correos sin garantías, puede acceder sin restricciones a información sensible y puede iniciar acciones por su cuenta —responder, escribir en su memoria a largo plazo, reescribir información en otros repositorios—, entonces *«tendríamos una configuración del agente que no se debería permitir»*.

Y detalla las tres combinaciones que sí son gestionables:

| Combinación | Qué obliga |
| --- | --- |
| **1-2** entrada no controlada + datos sensibles | Ninguna acción automática sin supervisión humana, ni dentro ni fuera |
| **2-3** datos sensibles + acción automática | Nada se ejecuta sin garantías de integridad y seguridad de la información, interna o externa |
| **1-3** entrada no controlada + acción automática | El agente tiene prohibido el acceso a información sensible o datos personales |

## Ahora míralo con el flujo de una gestoría

El pipeline documental estándar de un despacho es, literalmente, el ejemplo malo:

- **Entrada no controlada**: la factura la manda un proveedor del cliente. No la controlas tú, ni el despacho. Un PDF puede llevar texto invisible con instrucciones.
- **Datos sensibles**: para clasificar el gasto, el agente consulta el histórico del cliente, su plan contable, su fichero de proveedores.
- **Acción automática**: anota el asiento, marca la factura como registrada, dispara el flujo de pago.

Las tres. Por defecto y sin que nadie lo haya decidido, que es lo incómodo: nadie diseñó ese agente para violar la regla, sale así de construir lo obvio.

## La partición que resuelve, y por qué va al núcleo

La salida barata es la 1-3: **partir el agente en dos con permisos distintos**.

- **Extractor.** Ve el documento del proveedor. No tiene acceso al fichero de clientes ni herramientas de escritura. Su única salida son campos extraídos: NIF, base, cuota, fecha, concepto.
- **Clasificador y escritor.** Recibe esos campos, ya estructurados. Consulta el histórico y escribe el asiento. **Nunca ve el texto original del documento**, así que la instrucción escondida en el PDF no llega hasta aquí.

Fíjate en lo que ha pasado con la salida del primer agente: pasa de texto libre —donde cabe una instrucción— a un conjunto de campos con tipos. El vector de ataque no desaparece porque hayamos añadido una validación; desaparece porque el componente que puede actuar ya no lee texto de nadie de fuera.

La alternativa es el caso 1-2, un humano aprobando cada factura. Funciona, es legítimo, y hay que decirlo en la propuesta porque **cambia el número de horas recuperadas que estás vendiendo**.

Esta partición es material de núcleo, no de trabajo a medida. No la impone el criterio contable de un despacho ni el ERP que use: la impone una interpretación del regulador que es igual para todos. Todo lo que sea idéntico en todos los clientes *y* obligatorio es exactamente lo que hay que escribir una vez.

## Lo que la guía te obliga a documentar

Un detalle que se pasa por alto: la AEPD insiste en que el grado de autonomía del agente lo decide el responsable del tratamiento, y que esa decisión debe estar *«apropiadamente justificado basado en evidencias y documentada»*.

Los cuatro niveles que enumera son un vocabulario útil para la propuesta, porque cada uno tiene un precio distinto en horas:

- El agente propone, el humano opera.
- El agente y el humano colaboran.
- El agente opera, el humano es consultado o aprueba.
- El agente opera, el humano observa.

Elegir uno y escribir por qué no es papeleo: es la misma decisión que fija el ahorro que le prometes al despacho. Que además el regulador te la exija por escrito solo significa que tienes una excusa para tenerla clara antes de firmar.
