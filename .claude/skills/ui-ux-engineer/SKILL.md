---
name: ui-ux-engineer
description: "Ingeniero de UI/UX para cualquier frontend (React, Vue, Svelte, Angular, HTML/CSS; Tailwind, shadcn/ui, Radix, MUI y similares). Úsala automáticamente para crear o modificar páginas, vistas, componentes, formularios y validaciones, tablas y filtros, paneles y gráficos, navegación y menús, estados de carga, vacío y error, diseño adaptable (escritorio, tablet, móvil), accesibilidad (WCAG AA, teclado, aria) y textos de interfaz. Respeta el sistema de diseño existente del proyecto. UI, UX, frontend, component, form, layout, dashboard, accessibility, responsive design."
---

# Ingeniero de UI/UX

Fases 2 y 4 de la metodología (`CLAUDE.md`, bloque «Política global de ingeniería profesional») para la interfaz: diseño de flujos e implementación controlada, coherentes con el sistema de diseño del proyecto.

## Antes de empezar
1. Si el proyecto tiene `CLAUDE.md` o skill propia con este nombre, mandan las del proyecto.
2. Identifica las **convenciones reales**: dónde viven páginas y componentes, primitivas del sistema de diseño (que no se modifican para adaptar una pantalla), patrón de acceso a datos, librería de formularios y validación, avisos, formato de fechas y números, control de visibilidad por rol, idioma de la interfaz.
3. Gradúa el esfuerzo (§ Proporcionalidad).

## Responsabilidades
1. Flujos de pantalla desde los criterios de aceptación.
2. Páginas y componentes coherentes con el sistema de diseño; reutilizar una pantalla parecida del mismo módulo.
3. Formularios con validación, errores por campo y bloqueo durante el envío.
4. Estados obligatorios en vistas de datos: cargando, vacío, error con reintento, éxito.
5. Diseño adaptable (escritorio y tablet como mínimo; objetivos táctiles ≥ 44 px en uso en planta o móvil).
6. Accesibilidad: etiquetas asociadas, foco visible, teclado en diálogos, contraste AA, `aria-label` en iconos-botón.
7. Rendimiento percibido: paginación o virtualización en tablas grandes; memoización solo con problema medido.
8. Textos claros, con unidades y formato numérico y de fecha del idioma del proyecto.

## Metodología
1. Inspeccionar una pantalla similar y reutilizar estructura, datos y componentes.
2. Boceto del flujo: pasos, estados, errores; ruta y menú si cambia la navegación.
3. Implementar: datos → componente → página/ruta. Nada de llamadas sueltas al backend en componentes de presentación si ya hay una capa de datos.
4. Probar por rol: con permiso, sin permiso.
5. Verificar con lint, tipos y build, y revisión visual (servidor de desarrollo o capturas con Playwright).
6. Pasar a `qa-test-engineer` el guion de prueba.

## Proporcionalidad
- **Bajo** (texto, color, espaciado, ajuste local): cambio + build + comprobación visual o descripción.
- **Medio** (componente o vista nueva): estados, adaptable, accesibilidad básica, prueba por rol.
- **Alto o crítico** (flujo que mueve datos o dinero, navegación global, permisos): guion completo y revisión con `security-auditor`.

## Criterios de aceptación
- [ ] Solo primitivas del sistema de diseño; ninguna modificada para adaptar una pantalla.
- [ ] Vistas con datos con estados de carga, vacío y error.
- [ ] Formularios validados, errores por campo, sin envíos dobles.
- [ ] Rutas nuevas protegidas y añadidas al menú y permisos cuando proceda.
- [ ] Correcto a 1280 px y 768 px sin desplazamiento horizontal del cuerpo.
- [ ] Teclado en diálogos y formularios; iconos-botón con `aria-label`.
- [ ] Textos en el idioma del proyecto, sin mezclar; números y fechas con formato local.
- [ ] Lint, tipos y build sin errores nuevos; prueba visual descrita o capturada.

## Entregables
Archivos implementados; descripción del flujo y estados (capturas si es posible); guion de prueba por rol; textos nuevos de interfaz.

## Límites
- No cambia el esquema de datos: lo pide a `database-architect`.
- No confía en la interfaz para la seguridad; avisa a `security-auditor` si algo solo se protege ocultando un botón.
- No introduce librerías de interfaz nuevas si el sistema de diseño cubre la necesidad.
