---
title: 'Construir el agente de auditoría rápida de gestorías'
date: 2026-09-01
project: 'auditoria-gestorias'
summary: 'Plan de implementación para el sistema que diagnostica un despacho en una sesión y devuelve un plan de automatización priorizado por horas recuperables. Combina el marco de negocio con las tres palancas de contexto y el enrutamiento determinista.'
basedOn:
  - 2026-09-01-back-office-gestoria-que-automatizar-primero
  - 2026-09-01-contratos-de-tools-y-routing
  - 2026-09-01-compaction-clearing-memory
  - 2026-09-01-prompt-caching-bucles-agente
---

Esta guía es un ejemplo funcionando de lo que produce el flujo de selección: coges varias piezas, eliges proyecto y sale un plan de implementación con las decisiones de diseño explícitas.

## Qué tiene que producir el sistema

No un informe bonito. Un entregable de cinco bloques, en este orden:

1. **Inventario de procesos** — cada proceso repetitivo del despacho, con volumen mensual y horas dedicadas.
2. **Clasificación** — mecánico (automatizable hoy), de criterio (asistible), de relación (no tocar).
3. **Horas recuperables** por proceso, separando facturables de no facturables.
4. **Orden de ataque** — los dos o tres que superan el umbral de amortización. Ninguno más en la fase 1.
5. **Estado Verifactu** — dónde está el despacho y qué le queda antes de 2027.

Si el sistema no produce los cinco, no es una auditoría: es una conversación.

## Arquitectura: qué decide el modelo y qué decide el código

Este es el reparto, y es la decisión de diseño que más va a determinar si el sistema es fiable.

| Paso | Quién decide | Por qué |
| --- | --- | --- |
| Conducir la entrevista | Modelo | Requiere repreguntar según lo que conteste el cliente |
| Clasificar un proceso | Modelo | Es un juicio sobre naturaleza del trabajo |
| Calcular horas recuperables | **Código** | Es aritmética: volumen × tiempo unitario × factor de automatización |
| Ordenar por amortización | **Código** | Regla fija: horas facturables recuperadas vs. coste del proyecto |
| Decidir el umbral de corte | **Código** | ≥15 h/mes es una constante de negocio, no una opinión |
| Redactar el informe | Modelo | Es redacción sobre datos ya cerrados |

La regla general del artículo de MLflow, aplicada aquí: **todo lo que siempre tiene la misma respuesta sale del prompt y entra en el código.** Si el cálculo de amortización lo hace el modelo, dos ejecuciones sobre los mismos datos pueden dar números distintos, y ese es exactamente el tipo de error que te cuesta un cliente.

## Las tools que necesita

Cada una con su contrato explícito, incluido el caso de fallo:

- `registrar_proceso(nombre, volumen_mensual, horas_mensuales, tipo)` → confirma o devuelve qué campo falta. Nunca acepta un registro incompleto en silencio.
- `calcular_recuperables(proceso_id, factor_automatizacion)` → devuelve horas y el desglose del cálculo, para que sea auditable.
- `consultar_benchmark(proceso)` → rangos de referencia del sector. Si no hay dato, devuelve explícitamente "sin referencia", no una estimación inventada.
- `generar_informe(inventario)` → el entregable final.

El caso de fallo importa más que el camino feliz. Una tool que lanza una excepción cruda deja al modelo razonando sobre basura, y tomará una decisión mala con toda la confianza del mundo.

## Gestión de contexto

Una auditoría real es una sesión larga: entrevista + revisión de documentos que el despacho te enseña. Las tres palancas, cada una en su sitio:

- **Clearing** con `exclude_tools: ["memory"]`. Los documentos que el agente lee son re-consultables; sus cuerpos no tienen por qué seguir ocupando contexto una vez extraído el dato.
- **Compaction** con `instructions` explícitas: *"conserva todo volumen mensual, todas las horas declaradas y el nombre de cada proceso registrado"*. Un resumen que se come las cifras invalida la auditoría entera.
- **Memory** con un fichero por despacho. Aquí está el valor comercial: volver tres meses después y que el agente recuerde qué se dijo y qué se implementó no es una demo, es retención.

## Caché

El system prompt con el marco de auditoría, las definiciones de tools y el checklist son idénticos en todas las llamadas de la sesión. Van al principio, con el cache breakpoint justo al final de ese bloque. El nombre del despacho, la fecha y las respuestas van **después**.

El error a evitar es el de manual: meter `"Auditoría de {nombre_despacho}, {fecha}"` en la primera línea del system prompt. Eso invalida el prefijo entero en cada cliente y en cada día, y el ahorro desaparece sin que salte ningún error.

## Orden de construcción sugerido

1. El cálculo determinista (horas recuperables + orden de amortización) **como código puro, sin modelo**. Pruébalo con datos inventados hasta que los números sean correctos.
2. El guion de entrevista como lista fija de preguntas. Recórrelo tú con un despacho de verdad antes de automatizarlo.
3. El agente que conduce esa entrevista y llama a `registrar_proceso`.
4. El informe.
5. Memoria entre sesiones, cuando ya haya un segundo despacho.

La tentación es empezar por el 3, que es la parte divertida. Empezar por el 1 es lo que hace que el 3 sirva para algo: **si la aritmética no está cerrada, un agente que la ejecuta solo te da errores más rápido.**

## Comprueba que lo tienes

Antes de escribir código, contéstate estas tres:

1. Un despacho te dice que dedica 30 h/mes a registrar facturas y 4 h/mes a responder dudas repetidas. ¿Por cuál empiezas y qué dato te falta todavía para decidirlo?
2. El agente tiene que garantizar que ningún proceso con menos de 15 h/mes recuperables entre en la fase 1. ¿Lo pones en el system prompt o en el código, y por qué?
3. Llevas 40 minutos de entrevista y el contexto va por 120K tokens. Disparas compaction. ¿Qué escribes en `instructions` para no romper la auditoría?

Si alguna te ha costado, la pieza correspondiente está enlazada arriba.
