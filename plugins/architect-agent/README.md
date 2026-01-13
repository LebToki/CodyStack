# Architect Agent Plugin

🏗️ **System design expert for CodyStack**

## Features

- **Project Analysis**: Scan and analyze project structure
- **Architecture Diagrams**: Generate visual system diagrams
- **Pattern Suggestions**: Recommend design patterns

## Commands

| Command                      | Description                   |
|------------------------------|-------------------------------|
| `architect.analyze`          | Analyze project structure     |
| `architect.diagram`          | Generate architecture diagram |
| `architect.suggest-patterns` | Recommend design patterns     |

## Configuration

```typescript
// In your codystack.config.ts
{
  plugins: {
    'architect-agent': {
      model: 'claude-3.5-sonnet', // or 'gpt-5', 'local-llama'
      temperature: 0.3,
      autoAnalyze: true
    }
  }
}
```

## Usage

1. Open CodyStack
2. Go to **AI Agents** panel
3. Activate the **Architect** agent
4. Use the command palette (`Ctrl+Shift+P`) to run commands

## License

MIT © CodyStack Core Team
