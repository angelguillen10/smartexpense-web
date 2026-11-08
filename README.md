# SmartExpense Web

Interfaz de SmartExpense: registro de gastos, presupuestos por categoría y visualización de consumo.

Next.js con App Router, estado en Zustand y gráficos con Recharts. Consume la [API](https://github.com/angelguillen10/smartexpense-api).

---

## Estructura

```
app/
├── page.tsx           Landing
├── login/             Ingreso
├── register/          Alta de cuenta
└── dashboard/         Panel principal

components/
├── ExpenseList        Listado con filtros
├── AddExpenseModal    Alta de gasto
└── ExpenseChart       Visualización por categoría

store/
├── authStore          Sesión y token
└── expenseStore       Gastos y presupuestos

lib/
└── api                Cliente HTTP con interceptor de autenticación
```

---

## Funcionalidad

**Autenticación** — login y registro contra la API, token persistido, rutas protegidas.

**Gastos** — alta con validación, listado con filtros por fecha y categoría.

**Presupuestos** — límites por categoría con indicador de consumo.

**Visualización** — distribución de gastos por categoría y evolución en el tiempo.

---

## Stack

Next.js · TypeScript · Tailwind CSS · Zustand · Recharts · React Hook Form · Axios

---

## Correrlo

```bash
cp .env.example .env.local    # apuntar a la URL de la API
npm install
npm run dev
```

Queda en `http://localhost:3000`. Necesita la API corriendo.

---

## Decisiones

**Zustand en vez de Context.** El estado de sesión y el de gastos son independientes. Con Context habría que anidar providers o re-renderizar de más; con Zustand cada store se suscribe por separado.

**Cliente HTTP centralizado.** Un solo lugar donde vive el interceptor que adjunta el token y maneja el 401. Los componentes no saben de headers.

**React Hook Form.** Los formularios se validan sin re-renderizar en cada tecla.
