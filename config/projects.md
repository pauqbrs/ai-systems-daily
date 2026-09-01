# Proyectos activos

Contra estos se cruza cada aprendizaje. Mantener actualizado: una guía solo es
buena si el contexto del proyecto lo es.

---

## `auditoria-gestorias` — Auditoría rápida de gestorías

**Estado: por construir. Prioridad alta.**

Diagnosticar en una sesión corta los cuellos de botella de un despacho y devolver
un plan de automatización priorizado por horas recuperables.

Entregable en cinco bloques: inventario de procesos con volumen y horas →
clasificación (mecánico / de criterio / de relación) → horas recuperables
separando facturables → orden de ataque (solo los 2-3 que superan el umbral) →
estado de Verifactu.

Cifras de referencia del sector:

- Un despacho de 4-10 personas recupera 20-40 h/mes automatizando 2-3 procesos.
- Un proyecto de back-office ronda 5.000-12.000 € y se amortiza con ≥15 h/mes
  de trabajo facturable recuperado.
- OCR + IA extrae datos de factura con >95% de precisión en facturas estándar.

Plan de implementación detallado: `src/content/guides/auditoria-rapida-gestoria-v1.md`.

**Qué le sirve de la newsletter:** todo lo de agentes con entrevista estructurada,
gestión de contexto en sesiones largas, memoria entre sesiones, y cualquier caso
real de despacho automatizando.

---

## `sistemas-gestorias` — Sistemas de productividad para gestorías

**Estado: línea principal de negocio, en marcha.**

Automatizaciones que se instalan y se mantienen en despachos pequeños y medianos.
Los cuatro procesos que concentran las horas: entrada y registro de facturas,
conciliación bancaria, clasificación documental y respuestas a dudas repetidas.

Software del sector con el que hay que convivir: A3 Asesor, Holded, Sage, Contasol.

**Qué le sirve:** fiabilidad en producción, manejo de errores, umbrales de
confianza, observabilidad, coste por ejecución. Todo lo que separa una demo de
algo que un despacho puede usar sin supervisión constante.

---

## `customlab` — CustomLab

**Estado: en producción.**

Personalización textil bajo demanda. Web en Vite + React + TypeScript + Tailwind
+ shadcn/ui (repo `pauqbrs/pixel-perfect`), con precios por volumen, descuentos
escalonados, presupuestos automáticos y control de redenciones vía Upstash.
Técnicas de estampado: DTF y vinilo.

**Qué le sirve:** generación de contenido y SEO, atención automatizada,
presupuestación asistida, generación de mockups, y cualquier cosa que reduzca el
coste por consulta de cliente.

---

## Cómo añadir un proyecto

1. Añade su id a `PROJECTS` en `src/content.config.ts`.
2. Añade su entrada a `PROJECT_META` en `src/lib/site.ts`.
3. Documéntalo aquí con estado, contexto y qué tipo de material le sirve.
