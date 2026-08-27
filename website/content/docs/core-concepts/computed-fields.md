---
title: Computed fields
description: Auto-calculate values from expressions like {price} * {quantity}, with aggregate functions (SUM, AVG, COUNT, MIN, MAX) for repeater fields. The engine parses them safely — no eval() — and tracks dependencies so computed fields update when their inputs change.
---

## How computed fields work

A `calculated` field takes an `expression` string that references other field IDs. The engine parses the expression, resolves field references, and evaluates the result whenever a referenced field changes.

```ts
{
  id: 'total',
  type: 'calculated',
  label: 'Total',
  config: {
    type: 'calculated',
    expression: '{price} * {quantity}',
    format: 'currency',
    decimalPlaces: 2,
    prefix: '$',
    visible: true,
  },
}
```

When the user changes `price` or `quantity`, the engine recalculates `total` automatically.

## Expression syntax

Field references use curly braces: `{field_id}`. Standard arithmetic operators are supported.

| Operator | Description | Example |
|----------|-------------|---------|
| `+` | Addition | `{subtotal} + {tax}` |
| `-` | Subtraction | `{total} - {discount}` |
| `*` | Multiplication | `{price} * {quantity}` |
| `/` | Division | `{weight} / ({height} * {height})` |
| `( )` | Grouping | `({a} + {b}) / 2` |

### Examples

```ts
// BMI calculator
expression: '{weight} / ({height} * {height})'

// Price with tax
expression: '{subtotal} * (1 + {tax_rate} / 100)'

// Average of three scores
expression: '({score_1} + {score_2} + {score_3}) / 3'

// Percentage
expression: '{completed} / {total_items} * 100'
```

## Repeater aggregates

Aggregate functions let you compute values across rows in a [repeater](/docs/core-concepts/field-types) field. Use dot-notation to reference sub-fields: `{repeaterId.subFieldId}`.

| Function | Description | Example |
|----------|-------------|---------|
| `SUM()` | Sum of values | `SUM({items.price})` |
| `AVG()` | Average of values | `AVG({items.score})` |
| `COUNT()` | Number of rows | `COUNT({items.price})` |
| `MIN()` | Minimum value | `MIN({items.price})` |
| `MAX()` | Maximum value | `MAX({items.quantity})` |

### Per-row expressions

You can combine sub-fields inside an aggregate to compute per-row, then aggregate:

```ts
// Multiply price × quantity per row, then sum all rows
expression: 'SUM({order_items.unit_price} * {order_items.quantity})'

// Combine an aggregate with a simple field reference
expression: 'SUM({items.price} * {items.qty}) * (1 + {tax_rate} / 100)'
```

All dot-notation references inside a single aggregate must belong to the same repeater. Empty repeaters return `0`.

### Example: order total with tax

```ts
// Subtotal — sum of each item's line total
{
  id: 'subtotal',
  type: 'calculated',
  config: {
    type: 'calculated',
    expression: 'SUM({order_items.unit_price} * {order_items.quantity})',
    format: 'currency',
    decimalPlaces: 2,
    prefix: '$',
  },
}

// Tax — 8.5% of subtotal
{
  id: 'tax',
  type: 'calculated',
  config: {
    type: 'calculated',
    expression: '{subtotal} * 0.085',
    format: 'currency',
    decimalPlaces: 2,
    prefix: '$',
  },
}

// Order total — subtotal + tax
{
  id: 'order_total',
  type: 'calculated',
  config: {
    type: 'calculated',
    expression: '{subtotal} + {tax}',
    format: 'currency',
    decimalPlaces: 2,
    prefix: '$',
  },
}
```

## Safety

Expressions are parsed by the expression parser — not evaluated with `eval()` or `new Function()`. The parser understands numeric literals, field references, aggregate functions, and arithmetic operators. Anything else is rejected.

This means you cannot inject arbitrary code through an expression. A schema loaded from an untrusted source (user input, CMS, API) is safe from expression-based attacks.

## Display options

| Config property | Type | Description |
|----------------|------|-------------|
| `expression` | `string` | The expression to evaluate (required) |
| `format` | `'number' \| 'currency' \| 'percentage'` | Display format |
| `decimalPlaces` | `number` | Decimal precision |
| `prefix` | `string` | Text before the value (e.g., "$") |
| `suffix` | `string` | Text after the value (e.g., "kg") |
| `visible` | `boolean` | Whether to show the computed value. Default `true`. Set to `false` for intermediate values used only in conditions. |

## Hidden computed fields

Set `visible: false` to compute a value without showing it. This is useful for intermediate calculations or values used in conditional logic.

```ts
// Hidden computed field for conditional branching
{
  id: 'risk_score',
  type: 'calculated',
  label: 'Risk score',
  config: {
    type: 'calculated',
    expression: '{age_factor} + {bmi_factor} + {history_factor}',
    visible: false,
  },
}

// Show a section based on the computed risk score
{
  id: 'high_risk_section',
  title: 'Additional Assessment',
  showIf: { field: 'risk_score', operator: 'gte', value: 10 },
  questions: [/* ... */],
}
```

## Error handling

If an expression can't be evaluated (missing field, non-numeric value, division by zero), the engine returns `null` for the computed value and stores a warning in `state.warnings[fieldId]`. The form continues to work — a failed computation doesn't block submission.

## Dependencies

The engine builds a dependency graph at schema creation time. When `setValue` is called for a field that other computed fields depend on, only the affected computed fields are recalculated — not all of them.

```
User changes {height}
    │
    ▼
Engine checks dependency map: height → [bmi]
    │
    ▼
Recalculates {bmi} only
    │
    ▼
State updated, React re-renders
```

## Next steps

- [Multi-step forms](/docs/core-concepts/multi-step-forms) — section navigation and progress tracking
- [FormRenderer](/docs/react/form-renderer) — component API and props
