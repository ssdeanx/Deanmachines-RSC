---
applyTo: "**/*.{ts,tsx}"
---
# Inline Copilot Directive Comments

Whenever you (the Copilot Chat agent) see comments starting with `// copilot:` in a TypeScript or TSX file, you must:

1. Extract every line between `// copilot: start-task` and `// copilot: end-task` (inclusive).  
2. Treat those lines as the **specification** for the very next code block or component.  
3. Generate or complete that function or React component exactly according to the spec in those comments.  
4. Ignore any other comments that don’t begin with `// copilot:`.

---

### Example Usage in TSX

```tsx
// copilot: start-task "Implement WeatherCard"
// copilot: Should render location, temperature, and icon based on props.
// copilot: Return type: JSX.Element
// copilot: end-task
export function WeatherCard(props: WeatherData) {
  // <Copilot Chat will fill this component body>
}
