---
title: 'La memoria que hace vendible tu auditoría es la que te obliga a poder borrarla entrada por entrada'
date: 2026-09-05
section: agentes
depth: analisis
readingMinutes: 3
tldr: 'La AEPD propone cuatro niveles de memoria compartimentada —organización, tratamiento, caso y persona usuaria— y exige que desde el diseño se puedan ejercer acceso, rectificación, supresión, limitación y oposición sobre lo que el agente recuerda.'
sources:
  - title: 'Inteligencia artificial agéntica desde la perspectiva de protección de datos (V1.2, febrero de 2026)'
    url: 'https://www.aepd.es/guias/orientaciones-ia-agentica.pdf'
    author: 'Agencia Española de Protección de Datos (AEPD)'
    platform: docs
    publishedAt: 2026-02-18
tags: ['memoria', 'agentes', 'aepd', 'rgpd', 'arquitectura', 'retencion']
project: auditoria-gestorias
projectTakeaway: 'Da el esquema de datos de la memoria entre sesiones antes de escribirla: cuatro compartimentos con retención propia, y la capacidad de borrar por cliente sin tocar lo aprendido del método. Volver a un despacho tres meses después es la parte con valor comercial, y es también la que trae el requisito legal.'
glossary:
  - term: memoria semántica
    definition: 'La que guarda hechos y conceptos sueltos sobre alguien o algo, y con la que el agente construye un perfil que va actualizando entre conversaciones.'
  - term: memoria episódica
    definition: 'La que guarda eventos y acciones pasadas para que el agente recuerde cómo hizo bien una tarea, a menudo usándolos como ejemplos.'
  - term: memoria procedimental
    definition: 'La que guarda las reglas con las que se ejecuta una tarea. El agente puede afinar sus propias instrucciones a partir de lo que le ha ido pasando.'
  - term: no log policy
    definition: 'Política de cero retención en un componente: ese componente registra de dónde vino la petición y de qué tipo era, pero no su contenido.'
  - term: sanitization
    definition: 'Higienización: limpiar periódicamente una memoria de entradas obsoletas, incoherentes, sesgadas o maliciosas, en vez de dejarla crecer indefinidamente.'
apply:
  - 'Antes de escribir una línea de memoria, dibuja los cuatro compartimentos: lo que vale para todos los despachos (tu método), lo que vale para un despacho, lo que vale para una auditoría concreta y lo que es de la persona con la que hablas. Son cuatro tablas, no una.'
  - 'Pon plazo de retención distinto a cada compartimento. El método no caduca; las respuestas de una entrevista concreta sí, y el plazo lo decides tú antes de que te lo pregunten.'
  - 'Prueba hoy la operación que te van a pedir: borrar todo lo de un despacho sin perder lo que aprendiste del método. Si no se puede hacer con una consulta, la compartimentación está mal y arreglarla después cuesta una migración.'
  - 'Separa la memoria de personalización de la que influye en las conclusiones. Que el sistema recuerde que el gestor prefiere respuestas cortas está bien; que eso cambie qué procesos clasifica como automatizables, no.'
quiz:
  - question: 'Tu sistema recuerda entre sesiones. Un despacho al que auditaste hace tres meses te pide que borres todos sus datos. ¿Qué determina si puedes hacerlo?'
    options:
      - 'Tener copias de seguridad recientes.'
      - 'Que la memoria esté compartimentada por tratamiento y por caso, para poder borrar lo suyo sin llevarte lo aprendido del método.'
      - 'Que el proveedor del modelo ofrezca cero retención.'
      - 'Que el borrado se pida por escrito.'
    answer: 1
    explanation: 'La guía pide que la memoria contemple desde el diseño la capacidad de ejercer acceso, rectificación, supresión, limitación y oposición, y propone compartimentar por tratamiento, por caso y por persona usuaria. Si todo vive en un repositorio único, «borra lo de este cliente» no es una consulta: es leer el montón entero a mano. Las copias de seguridad son el problema contrario, porque conservan lo que quieres eliminar. La cero retención del proveedor evita que el modelo guarde los prompts, pero tu memoria persistente es tuya y sigue ahí. Y la forma de la petición no cambia si el sistema es capaz de atenderla.'
  - question: 'Diseñando la memoria de la auditoría, ¿qué NO debería ir en el mismo compartimento que lo demás?'
    options:
      - 'Las cifras de volumen que te dio el despacho.'
      - 'Las preferencias de la persona con la que hablaste, porque no deben influir en qué procesos se clasifican como automatizables.'
      - 'El guion de la entrevista.'
      - 'La fecha de la sesión.'
    answer: 1
    explanation: 'La guía pide separar la memoria de la persona usuaria de la de la organización, y limitar que la primera influya en aspectos sustanciales: división en subtareas, acceso a herramientas o decisiones finales. Una preferencia de estilo contaminando la clasificación es justo el efecto que hay que impedir, y además rompe la comparabilidad entre despachos, que es la métrica del proyecto. Las cifras, el guion y la fecha son datos del caso o del método: van en su compartimento y no hay razón para aislarlos de sí mismos.'
  - question: 'Tu componente de inferencia registra en su log el contenido de todos los prompts, de todos los despachos, en el mismo sitio. ¿Qué recomienda la guía?'
    options:
      - 'Cifrar ese log y restringir quién lo lee.'
      - 'Una política de «no log» selectiva en el componente: que registre origen y tipo de petición, no el contenido, y que el contenido se registre por tratamiento y por separado.'
      - 'Reducir el nivel de log a errores.'
      - 'Rotar el log cada semana.'
    answer: 1
    explanation: 'La guía recomienda cero retención a nivel de componente cuando ese componente sirve a varios tratamientos: registra el origen y el tipo, no el contenido, y el contenido se registra a nivel de cada tratamiento de forma independiente. Cifrar y restringir accesos protege el log, pero deja intacto el problema de fondo, que es tener mezclados en un mismo sitio datos de despachos distintos. Bajar a errores pierde la trazabilidad que la propia guía exige. Y rotar acorta la ventana sin separar nada: durante esa semana la mezcla sigue existiendo.'
---

## El problema, en el sitio donde está el dinero

De todo lo que hace útil una auditoría automatizada, lo que más valor comercial tiene es volver tres meses después y que el sistema recuerde qué se dijo, qué se propuso y qué se implementó. Sin eso vendes un informe; con eso vendes una relación.

Y resulta que esa memoria es justo la parte con requisitos legales más incómodos, porque **lo que el agente recuerda son datos personales que alguien puede pedirte que borres**.

Las orientaciones de la AEPD dedican dos capítulos a esto: uno a las vulnerabilidades de la memoria y otro a las medidas. Juntos son, básicamente, un esquema de datos.

## Los tres tipos de memoria a largo plazo

Conviene tener el vocabulario claro, porque cada tipo se borra distinto:

- **Semántica**: hechos y conceptos. La guía avisa de que sirve *«para personalizar aplicaciones recordando hechos de interacciones pasadas creando un "perfil" actualizado continuamente»*. Es la que más se parece a un perfilado, con lo que eso arrastra.
- **Episódica**: eventos y acciones pasadas, para recordar cómo se hizo bien una tarea. Suele implementarse metiendo ejemplos anteriores en el prompt.
- **Procedimental**: las reglas con las que se ejecuta la tarea, que el agente puede ir afinando sobre sí mismo.

La distinción importa para tu caso: **la episódica y la procedimental son tu activo** —lo que aprendes del método auditando despachos— y **la semántica es la que contiene a personas concretas**. Si viven mezcladas, cada solicitud de supresión te obliga a elegir entre incumplir o tirar aprendizaje.

## Los cuatro compartimentos

Aquí está la parte que se puede copiar tal cual como diseño. La guía clasifica la información almacenada en cuatro niveles:

| Compartimento | Qué contiene en tu caso | Retención |
| --- | --- | --- |
| **Memoria de la organización**, común a todos los tratamientos | Tu método: guion, taxonomías de proceso, umbrales de amortización | No caduca |
| **Memoria por tratamiento** | Lo específico de un despacho: su plan contable, sus manías, su software | Mientras dure la relación |
| **Memoria por caso** | Una auditoría concreta: cifras de volumen, horas declaradas, decisiones tomadas ese día | Plazo corto y explícito |
| **Memoria de la persona usuaria** | Con quién hablaste y cómo prefiere trabajar | Plazo corto, y aislada de las conclusiones |

Y describe los dos extremos posibles de organización: un único repositorio lógico donde se vuelca todo *«dejando a la agéntica el control de qué datos va a hacer uso en cada momento»*, o una división lógica —o física— por tratamiento, por caso y por persona.

El primer extremo es el que sale solo cuando empiezas con un fichero de memoria y vas añadiendo. Es cómodo durante seis semanas y después es una migración.

## La prueba que hay que hacer el primer día

La guía pide que la memoria contemple **desde el diseño** la capacidad de ejercer *«todos los derechos del RGPD, entre ellos, acceso, rectificación, supresión, limitación y oposición»*.

Tradúcelo a una operación concreta y pruébala antes de tener clientes:

> Borrar todo lo de un despacho, conservando lo que el sistema aprendió sobre cómo auditar.

Si eso es una consulta con un `WHERE`, la compartimentación está bien. Si implica leer entradas a mano para decidir cuáles eran suyas, está mal, y el momento de descubrirlo no es cuando te llega la petición.

## Dos medidas que valen aunque no te importara el RGPD

**Higienización periódica.** La guía llama *sanitization* a depurar la memoria a largo plazo: caducar entradas sin uso u obsoletas, comprobar coherencia, buscar contenido dañino, eliminar credenciales que se colaron, detectar sesgos. Sin esto, una memoria que crece durante un año se convierte en un almacén de cosas que ya no son verdad —el despacho cambió de software y tu agente sigue recordando el anterior.

**Separar personalización de decisión.** Que la memoria de la persona usuaria no influya en *«la división en subtareas, acceso a determinadas herramientas o sobre decisiones finales»*. Para una auditoría esto no es un matiz legal: si lo que el gestor comentó de pasada en la sesión anterior cambia qué procesos se clasifican como automatizables, **has perdido la comparabilidad entre despachos**, que es la métrica del proyecto. El regulador y tu caso de negocio piden aquí exactamente lo mismo.

Y una advertencia que la guía deja escrita en una nota al pie, por si acaso: desactivar el almacenamiento en memoria es una cosa, y *«enviar un prompt diciendo que la información que sí ha sido almacenada no se tenga en cuenta»* es otra muy distinta. Lo segundo no es una medida.
