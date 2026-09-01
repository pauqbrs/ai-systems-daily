#!/usr/bin/env node
/**
 * Crea el esqueleto de una pieza con todos los campos del esquema presentes,
 * para no tener que recordarlos. Uso:
 *
 *   bun run new:pill "Título de la pieza" agentes
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

const SECTIONS = ['gestorias', 'agentes', 'datos-tokens', 'prompting-claude'];

const [title, section = 'agentes'] = process.argv.slice(2);

if (!title) {
  console.error('Uso: bun run new:pill "Título de la pieza" [seccion]');
  console.error(`Secciones: ${SECTIONS.join(', ')}`);
  process.exit(1);
}

if (!SECTIONS.includes(section)) {
  console.error(`Sección desconocida: ${section}`);
  console.error(`Secciones válidas: ${SECTIONS.join(', ')}`);
  process.exit(1);
}

const slugify = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const day = new Date().toISOString().slice(0, 10);
const slug = `${day}-${slugify(title)}`;
const dir = join(process.cwd(), 'src', 'content', 'pills');
const file = join(dir, `${slug}.md`);

try {
  await access(file);
  console.error(`Ya existe: ${file}`);
  process.exit(1);
} catch {
  // No existe: seguimos.
}

const template = `---
title: '${title.replace(/'/g, "''")}'
date: ${day}
section: ${section}
depth: pill
readingMinutes: 2
tldr: 'Una o dos frases: qué es y por qué importa. Es lo que se lee en la portada.'
source:
  url: 'https://'
  author: ''
  platform: blog
tags: []
projects: []
glossary:
  - term: ''
    definition: 'Qué significa, en una frase, sin dar nada por supuesto.'
apply:
  - 'Paso concreto y ejecutable hoy.'
quiz:
  - question: 'Pregunta de aplicación, no de memoria.'
    options:
      - ''
      - ''
      - ''
    answer: 0
    explanation: 'Por qué esa es correcta y por qué las otras no.'
---

## El problema

## Cómo funciona

## Por qué te importa
`;

await mkdir(dir, { recursive: true });
await writeFile(file, template, 'utf8');
console.log(`Creado: src/content/pills/${slug}.md`);
