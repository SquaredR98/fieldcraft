---
title: Conditional logic
description: Show or hide questions and sections based on earlier answers using condition expressions, compound logic, and jump rules.
---

## Condition expressions

A `ConditionExpression` is the building block for all conditional logic in FieldCraft. It can be a simple comparison or a compound expression combining multiple conditions.

### Simple condition

```ts
type ConditionExpression = {
  field: string              // Field ID to check
  operator: ConditionOperator
  value: unknown             // Value to compare against
}
```

```ts
// Show this field only when "role" equals "developer"
showIf: { field: 'role', operator: 'eq', value: 'developer' }
```

### Compound condition

```ts
type ConditionExpression = {
  combine: 'and' | 'or'
  conditions: ConditionExpression[]    // Recursive — can nest arbitrarily
}
```

```ts
// Show when role is developer AND experience is 5+ years
showIf: {
  combine: 'and',
  conditions: [
    { field: 'role', operator: 'eq', value: 'developer' },
    { field: 'years_experience', operator: 'gte', value: 5 },
  ],
}
```

Compound conditions nest arbitrarily — you can put `and` inside `or` inside `and`.

## Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `eq` | Equals | `{ field: 'status', operator: 'eq', value: 'active' }` |
| `neq` | Not equals | `{ field: 'status', operator: 'neq', value: 'inactive' }` |
| `gt` | Greater than | `{ field: 'age', operator: 'gt', value: 18 }` |
| `gte` | Greater than or equal | `{ field: 'score', operator: 'gte', value: 80 }` |
| `lt` | Less than | `{ field: 'quantity', operator: 'lt', value: 100 }` |
| `lte` | Less than or equal | `{ field: 'rating', operator: 'lte', value: 3 }` |
| `in` | Value is in array | `{ field: 'country', operator: 'in', value: ['US', 'CA', 'UK'] }` |
| `notIn` | Value is not in array | `{ field: 'plan', operator: 'notIn', value: ['free', 'trial'] }` |
| `exists` | Field has a value | `{ field: 'email', operator: 'exists', value: true }` |
| `notExists` | Field has no value | `{ field: 'phone', operator: 'notExists', value: true }` |
| `contains` | String contains substring | `{ field: 'notes', operator: 'contains', value: 'urgent' }` |
| `notContains` | String doesn't contain | `{ field: 'name', operator: 'notContains', value: 'test' }` |
| `startsWith` | String starts with | `{ field: 'code', operator: 'startsWith', value: 'PRO-' }` |
| `endsWith` | String ends with | `{ field: 'email', operator: 'endsWith', value: '@company.com' }` |
| `between` | Value is between two bounds | `{ field: 'age', operator: 'between', value: [18, 65] }` |
| `matches` | Regex match | `{ field: 'id', operator: 'matches', value: '^[A-Z]{3}-\\d{4}$' }` |

## Where conditions are used

### Field visibility — `showIf`

```ts
{
  id: 'medication_details',
  type: 'long_text',
  label: 'List your current medications',
  showIf: { field: 'takes_medication', operator: 'eq', value: true },
}
```

When `showIf` evaluates to `false`:
- The field is hidden from the UI
- Its value is excluded from validation
- Its value is excluded from the submission response

If the user fills in the field, then changes an earlier answer so the field becomes hidden, the value is still in memory but won't be submitted.

### Conditional required

```ts
{
  id: 'phone',
  type: 'phone',
  label: 'Phone number',
  required: { field: 'contact_method', operator: 'eq', value: 'phone' },
}
```

The field is only required when the condition is `true`. If `required` is `false` or the condition evaluates to `false`, the field is optional.

### Conditional disabled

```ts
{
  id: 'custom_amount',
  type: 'number',
  label: 'Custom amount',
  disabled: { field: 'plan', operator: 'eq', value: 'fixed' },
}
```

### Section visibility

```ts
{
  id: 'developer_questions',
  title: 'Developer Experience',
  showIf: { field: 'role', operator: 'eq', value: 'developer' },
  questions: [/* ... */],
}
```

When a section's `showIf` is `false`, the section is removed from navigation entirely. If the user was currently on that section, the engine moves them to the first visible section.

### Jump rules

```ts
{
  id: 'triage',
  title: 'Triage',
  questions: [/* ... */],
  onExit: {
    rules: [
      {
        condition: { field: 'severity', operator: 'eq', value: 'critical' },
        jumpTo: 'escalation',
      },
      {
        condition: { field: 'severity', operator: 'eq', value: 'low' },
        jumpTo: 'self_service',
      },
    ],
    default: 'general_support',
  },
}
```

Jump rules are evaluated in order when the user leaves a section. The first matching rule wins.

## Evaluation behaviour

Conditions are re-evaluated on every value change. When the user types into a field, the engine:

1. Updates `state.values`
2. Re-evaluates all `showIf` conditions
3. Re-evaluates all conditional `required` and `disabled` properties
4. Recalculates visible sections and navigation state
5. Notifies subscribers (React re-renders)

This cascade happens synchronously and is fast — the condition evaluator is a pure function with no side effects.

## Next steps

- [Validation](/docs/core-concepts/validation) — validate field values with 19 built-in rule types
- [Computed fields](/docs/core-concepts/computed-fields) — derive values from expressions
- [Multi-step forms](/docs/core-concepts/multi-step-forms) — navigation, progress, and jump rules

## Related reading

- [Build a Multi-Step Survey in 5 Minutes](/blog/build-multi-step-survey) — practical tutorial using `showIf` conditions
- [6 Hard-Won UX Lessons](/blog/form-ux-lessons) — why conditional fields should hide, not disable
