---
title: "Auditoría rápida de un flujo documental con IA"
date: 2026-09-02
summary: "Cómo medir en media jornada si un pipeline de extracción documental es fiable de verdad, y dónde poner el umbral de revisión humana."
basedOn: []
project: sin-definir
readingMinutes: 9
tags: ["gestorias", "evaluacion", "extraccion"]
---

Un pipeline de extracción documental casi siempre demuestra bien. Le pasas cinco
facturas, saca los campos, todo el mundo asiente. El problema aparece tres meses
después, cuando alguien descubre que lleva desde marzo leyendo mal la base
imponible de un proveedor concreto y nadie lo vio porque el número **era
plausible**.

Esta guía es el chequeo mínimo para saber si eso te está pasando. Media jornada
de trabajo, sin montar infraestructura de evaluación.

## Cuándo usar esto

- Antes de meter un flujo de extracción en producción con documentos reales.
- Cuando ya está en producción y nadie sabe decir su tasa de error.
- Después de cambiar de modelo, de prompt o de proveedor de OCR. **Sobre todo
  aquí**: es el momento en que más se rompe algo sin que nadie se entere.

**Cuándo NO:** si el volumen es de diez documentos al mes, no auditas, revisas los
diez. La auditoría sale a cuenta cuando revisar todo deja de salir a cuenta.

## Antes de empezar

Necesitas dos cosas, y la segunda es la que la gente se salta:

1. **Entre 50 y 100 documentos reales.** Reales, no los de la demo.
2. **Una definición escrita de qué es un valor correcto, campo por campo.**
   ¿La fecha es la de emisión o la de operación? ¿El importe lleva IVA? ¿Un
   proveedor con dos razones sociales cuenta como acierto si devuelve la otra?

Si no fijas esto antes de mirar los resultados, vas a decidir sobre la marcha si
cada fallo "cuenta o no cuenta", y siempre acabará contando menos de lo que
debería. Escríbelo antes de ver nada.

## Pasos

### 1. Congela una muestra estratificada

No cojas los últimos 50 documentos: los últimos 50 se parecen entre sí. Estratifica
por lo que de verdad cambia el resultado:

- Tipo de documento (factura, nómina, extracto, modelo tributario…).
- Origen: PDF nativo vs. escaneo vs. foto de móvil. Es la variable que más pesa.
- Proveedor o emisor, incluyendo los tres o cuatro con formato más raro.
- Trimestre, si el formato cambió en algún momento del año.

Mete a propósito los casos feos: el documento a dos columnas, el que tiene una
tabla partida entre dos páginas, el que viene rotado. Si tu muestra solo tiene
documentos limpios, vas a medir el mejor caso y llamarlo "la tasa de error".

Guarda esa muestra congelada en algún sitio. La vas a reutilizar cada vez que
cambies algo, y ahí es donde está su valor.

### 2. Construye el gold set a mano

Alguien que sepa del dominio rellena los campos correctos, **sin ver la salida del
sistema**. Esto es innegociable: si la persona ve primero lo que extrajo el modelo,
va a validarlo en vez de transcribirlo. El sesgo de anclaje se come la auditoría
entera y te deja con un gold set que dice que el sistema acierta siempre.

Con 50 documentos y 8 campos son 400 valores. Se hace en dos o tres horas.

### 3. Clasifica los errores en tres cubos, no en uno

Aquí está el núcleo de la guía. "Tasa de acierto: 94 %" no sirve para decidir nada,
porque mezcla tres cosas con consecuencias muy distintas:

| Cubo | Qué es | Qué cuesta |
|---|---|---|
| **Ausente** | El campo sale vacío o el sistema dice que no lo encuentra | Barato: se ve, alguien lo rellena |
| **Ilegible** | El documento no permitía sacarlo (escaneo cortado, sello encima) | Barato, y además no es culpa del modelo |
| **Plausible y falso** | Un valor con la forma correcta, pero equivocado | **Caro. Es el único que importa de verdad** |

Un NIF ausente lo caza cualquier validación. Un NIF con formato válido que
pertenece a otra empresa se cuela hasta el modelo 347.

Cuenta los tres por separado y no vuelvas a mirar el número global.

### 4. Mide por campo, y pondera por lo que cuesta el fallo

Un 3 % de error repartido uniforme entre ocho campos es una cosa. Un 3 % que está
concentrado en la base imponible es otra muy distinta, y la media aritmética las
representa igual.

Saca una tabla de error por campo y ordénala por *coste del fallo*, no por
frecuencia: cuánto trabajo cuesta detectarlo aguas abajo y cuánto cuesta si no se
detecta. El campo que aparezca arriba es tu único objetivo de mejora; los demás
pueden esperar.

### 5. Separa el fallo del modelo del fallo de la fuente

Coge los errores y pregunta, documento a documento: **¿un humano competente habría
podido sacar este dato de este documento?**

- Si la respuesta es no, el problema es de captura. Cambiar de modelo no lo
  arregla; arreglar el escáner sí.
- Si es sí, ahí sí tienes margen con prompt, contexto o modelo.

Este paso reordena las prioridades más veces de lo que parece. Es habitual
descubrir que media tasa de error es gente fotografiando papeles con el móvil.

### 6. Mide coste y latencia por documento, con la factura real

Tokens de entrada y de salida por documento, multiplicado por volumen mensual.
Si reenvías el mismo contexto en cada llamada (instrucciones largas, ejemplos, un
manual de criterios), mira si el `prompt caching` aplica: es la optimización con
mejor relación esfuerzo/ahorro en este tipo de flujo, porque el prefijo es
idéntico entre documentos y solo cambia el final.

> `prompt caching`: reutilizar el prefijo ya procesado de un prompt entre llamadas
> para no volver a pagar por esos tokens ni por su latencia.

### 7. Fija el umbral de revisión humana con datos, no con intuición

Ahora ya puedes decidir lo único que importa operativamente: **qué se revisa**.

Ordena los documentos por la señal de confianza que tengas (la del propio modelo,
un segundo pase, una validación aritmética como que las líneas sumen el total) y
mira dónde caen los errores del cubo "plausible y falso". Busca el corte que
captura la mayoría de esos errores revisando la menor fracción del volumen.

Si los errores están repartidos por igual entre confianza alta y baja, tu señal de
confianza no vale y estás eligiendo al azar qué revisar. Antes de ajustar el
umbral, consigue una señal que discrimine — normalmente una validación aritmética
del propio documento discrimina mejor que la confianza autodeclarada del modelo.

## Cómo sabes que ha funcionado

Al terminar deberías poder responder estas cuatro sin dudar:

1. Tasa de error "plausible y falso", por campo.
2. Qué campo concentra el coste, y por qué.
3. Qué fracción del error es de captura y no del modelo.
4. Qué porcentaje del volumen hay que revisar a mano para cazar la mayoría de los
   errores caros.

Si alguna se responde con "depende" o con una media global, la auditoría no está
terminada.

## Dónde falla

- **Muestra no representativa.** El fallo más común y el más caro: mides el mejor
  caso y das una cifra que no aguanta el mes que viene.
- **Gold set contaminado.** Alguien validó en vez de transcribir. Detección: si el
  sistema "acierta" más del 98 % a la primera, sospecha del gold set antes que
  celebrarlo.
- **Optimizar la media.** Subes dos puntos el acierto global tocando campos que no
  le importan a nadie, mientras la base imponible sigue igual.
- **Auditar una vez.** Esto no es un hito, es la muestra congelada del paso 1 que
  se vuelve a pasar cada vez que cambias modelo, prompt o proveedor. Sin eso, la
  próxima regresión la vas a descubrir en una inspección.
