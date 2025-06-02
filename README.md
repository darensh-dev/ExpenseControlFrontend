# ExpenseControlFrontend

ExpenseControlFrontend es una aplicación web desarrollada en Vue.js para la gestión de fondos monetarios, depósitos, presupuestos y gastos empresariales. Permite a los usuarios administrar diferentes tipos de fondos, registrar depósitos, asignar presupuestos mensuales y controlar los gastos, todo con una interfaz moderna y responsiva.

## Tecnologías utilizadas

- **Vue 3**: Framework principal para la construcción de la interfaz de usuario.
- **Vite**: Herramienta de build y desarrollo rápido.
- **Pinia**: Manejo de estado global.
- **PrimeVue**: Componentes UI avanzados y personalizables.
- **Tailwind CSS**: Utilidades CSS para estilos rápidos y responsivos.
- **Zod**: Validación de esquemas y formularios.
- **Luxon**: Manejo y formateo de fechas.
- **Axios**: Cliente HTTP para comunicación con APIs.
- **ESLint + Prettier**: Linting y formateo de código.
- **Docker**: Contenerización para despliegue y desarrollo.

## Estructura del Proyecto

```
src/
  assets/           # Archivos estáticos y estilos globales
  components/       # Componentes Vue reutilizables
  composables/      # Composables personalizados (hooks)
  config/           # Configuración de endpoints y constantes
  layout/           # Componentes de layout y estructura general
  router/           # Definición de rutas de la aplicación
  schemas/          # Esquemas de validación (Zod)
  service/          # Servicios para interacción con la API
  store/            # Stores de Pinia para manejo de estado
  views/            # Vistas principales de cada módulo
  App.vue           # Componente raíz
  main.js           # Punto de entrada de la aplicación
```

## Módulos principales

### 1. Fondos Monetarios (`monetaryFund`)
Permite crear, listar y administrar diferentes fondos monetarios. Cada fondo tiene un nombre, balance inicial y tipo de fondo.

- **Vista:** `src/views/monetaryFund/Index.vue`
- **Formulario:** `src/views/monetaryFund/ModalForm.vue`
- **Servicio:** [`useMonetaryFund`](src/service/useMonetaryFund.js)
- **Validación:** [`monetaryFundSchema`](src/views/monetaryFund/schemas.js)

### 2. Depósitos (`deposit`)
Registro de depósitos realizados a los fondos monetarios, con fecha, descripción y monto.

- **Vista:** `src/views/deposit/Index.vue`
- **Servicio:** [`useDeposit`](src/service/useDeposit.js)
- **Validación:** [`depositSchema`](src/views/deposit/schemas.js)

### 3. Presupuestos (`budget`)
Permite asignar presupuestos mensuales por tipo de gasto.

- **Vista:** `src/views/budget/Index.vue`
- **Servicio:** [`useBudget`](src/service/useBudget.js)
- **Validación:** [`monthlyBudgetSchema`](src/views/budget/schemas.js)

### 4. Gastos (`expense`)
Registro y control de gastos, asociados a fondos, tipos de gasto y presupuestos.

- **Vista:** `src/views/expense/Index.vue`
- **Servicio:** [`useExpense`](src/service/useExpense.js)
- **Validación:** [`movementSchema`](src/views/expense/schemas.js)

### 5. Tipos Comunes (`Common`)
Servicios para obtener tipos de fondos, tipos de gastos y tipos de documentos.

- **Servicio:** [`Common`](src/service/Common.js)

## Scripts principales

- `npm install` — Instala las dependencias.
- `npm run dev` — Inicia el servidor de desarrollo.
- `npm run build` — Genera la build de producción.
- `npm run lint` — Ejecuta el linter.

## Configuración

Las variables de entorno se encuentran en los archivos `.env` y `.env.example`. Modifica según tu entorno de desarrollo o producción.

## Despliegue

El proyecto puede ser desplegado en Vercel, Docker u otros servicios compatibles con aplicaciones Node.js/Vue.

---

> Para más detalles sobre la estructura de componentes y ejemplos de uso, revisa la documentación interna de cada módulo y los comentarios en el código fuente.