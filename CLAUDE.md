<!-- POLITICA-INGENIERIA-GLOBAL:INICIO v1 (instalada desde paquete-ingenieria; no editar dentro de estas marcas: se reemplazan al reinstalar) -->
# Política global de ingeniería profesional

Se aplica a **todos los proyectos** salvo que el `CLAUDE.md` del proyecto diga otra cosa: las instrucciones del proyecto (su `CLAUDE.md`, sus skills en `.claude/skills/` y lo que pida el usuario en la conversación) **prevalecen** sobre esta política y la concretan. Esta política nunca autoriza a sobrescribir configuraciones ni instrucciones de un proyecto.

## 1. Cuándo se aplica

Automáticamente, sin que haya que pedirlo, en cualquier trabajo de **ingeniería, arquitectura, diseño técnico, desarrollo de software, bases de datos, sistemas, infraestructura, estructuras, instalaciones o procesos técnicos**. No se aplica a conversación general, preguntas de información o redacción no técnica.

## 2. Metodología obligatoria (7 fases)

1. **Análisis de requisitos**: objetivo, alcance, criterios de aceptación verificables, supuestos y preguntas abiertas.
2. **Diseño técnico y arquitectura**: dónde va cada responsabilidad, contratos, alternativas cuando la decisión no es trivial.
3. **Identificación de riesgos**: técnicos, de seguridad y datos, legales/normativos, de compatibilidad y de producción; cada uno con su mitigación.
4. **Implementación controlada**: alcance mínimo, cambios reversibles, sin refactors ni dependencias no pedidos; primero inspeccionar, después cambiar.
5. **Verificación y pruebas**: comprobaciones ejecutadas de verdad (lint, tipos, build, tests, pruebas de permisos, ensayos), comparadas con el punto de partida.
6. **Auditoría técnica**: revisión crítica del resultado antes de darlo por terminado.
7. **Documentación y trazabilidad**: qué se cambió, por qué, cómo se verificó y qué queda pendiente; requisito → cambio → prueba.

## 3. Proporcionalidad (obligatoria)

El rigor se ajusta al riesgo. **No se genera documentación innecesaria.**

| Nivel | Ejemplos | Qué se exige |
|---|---|---|
| **Bajo** | texto, estilo, ajuste local reversible, script de un solo uso | Las 7 fases se resuelven mentalmente; en la respuesta solo: qué se hizo y cómo se comprobó (1–3 líneas). Sin documentos. |
| **Medio** | componente o pantalla nueva, columna o tabla nueva, dependencia, configuración | Criterios breves, diseño en pocas líneas, riesgos principales, verificación ejecutada, informe corto. |
| **Alto** | datos existentes, dinero, permisos, seguridad, integraciones, cambios multi-módulo, normativa | Fases completas con las skills correspondientes, pruebas de permisos y regresión, informe completo. |
| **Crítico** | producción, borrados o migraciones destructivas, secretos, despliegues, datos personales, operaciones irreversibles | Todo lo anterior **más autorización previa del usuario** (§ 4), copia de seguridad y vuelta atrás documentada. |

En caso de duda entre dos niveles, se aplica el superior.

## 4. Autorización obligatoria

**Antes** de cualquiera de estas acciones se describe qué se va a hacer, su impacto y su vuelta atrás, y **se espera la autorización explícita del usuario**:

- escribir, migrar o borrar datos en una base de datos de producción;
- desplegar o publicar en producción, o fusionar en la rama que despliega automáticamente, si el usuario no lo ha pedido expresamente para esa tarea;
- operaciones destructivas o irreversibles (`DROP`, `DELETE`/`TRUNCATE` masivos, `rm -rf`, `git push --force` sobre ramas ajenas, reescritura de historial, borrado de ramas, recursos o archivos que no se han creado en esta sesión);
- crear, rotar o exponer secretos y credenciales; cambiar permisos o roles en producción;
- acciones con coste económico o que envían comunicaciones externas.

Una autorización vale para la acción y el contexto concretos en que se dio, no para otras posteriores. Nunca se desactivan controles de seguridad (verificación TLS, seguridad por filas, tests, lint) para conseguir un resultado.

## 5. Skills de ingeniería (activación automática por contexto)

Las skills se usan **sin que el usuario tenga que pedirlas** cuando la tarea entra en su ámbito. Si el proyecto tiene una skill con el mismo nombre, se usa la del proyecto.

| Situación | Skill que lidera | Apoyo |
|---|---|---|
| Petición nueva, ambigua o incompleta | `requirements-engineer` | `systems-architect` |
| Diseño de módulo, sistema, integración o instalación; decidir dónde va la lógica | `systems-architect` | `database-architect`, `security-auditor` |
| Esquema, migraciones, permisos de datos, funciones, disparadores, rendimiento SQL | `database-architect` | `security-auditor`, `qa-test-engineer` |
| Pantallas, formularios, navegación, paneles, accesibilidad | `ui-ux-engineer` | `qa-test-engineer` |
| Autenticación, permisos, secretos, datos personales | `security-auditor` | `database-architect`, `devops-engineer` |
| Verificar, probar, reproducir errores, regresión | `qa-test-engineer` | la especialidad afectada |
| Build, despliegue, CI, dependencias, entorno, incidencias de producción | `devops-engineer` | `security-auditor` |
| Revisión final, PR, auditoría | `technical-auditor` | todas |

Cadena para cambios de riesgo alto o crítico:
`requirements-engineer → systems-architect → database-architect / ui-ux-engineer → implementación → qa-test-engineer → security-auditor → devops-engineer → technical-auditor`.
En riesgo bajo o medio se usan solo las skills que aporten algo; no se encadenan todas por rutina.

**Prioridad cuando dos criterios chocan:** seguridad y protección de datos → integridad de datos y reglas de negocio → corrección funcional → mantenibilidad → experiencia de usuario → rendimiento.

## 6. Reglas de verificación y honestidad

- Nada se declara terminado ni verificado sin haberlo ejecutado; si una comprobación falla o no se pudo ejecutar, se dice explícitamente con el motivo.
- Con errores heredados en el proyecto, el criterio es «sin errores nuevos» frente al punto de partida medido.
- Nunca se omite, desactiva o pone en cuarentena un test para obtener verde.
- Se distingue siempre entre **dato verificado**, **estimación**, **supuesto** y **«no verificado — confirmar fuente»**.
- Datos personales y financieros reales nunca en logs, fixtures, ejemplos, issues ni documentación.

## 7. Informe final (proporcional al nivel)

**Qué se cambió · Cómo se verificó (comando y resultado real) · Qué no se pudo verificar y por qué · Riesgos pendientes.** En riesgo bajo, una o dos líneas bastan.
<!-- POLITICA-INGENIERIA-GLOBAL:FIN -->
