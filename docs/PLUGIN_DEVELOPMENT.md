# CodyStack Plugin Development Guide

Build custom plugins to extend CodyStack with new agents, integrations, and tools.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Plugin Structure](#plugin-structure)
3. [Plugin Interface](#plugin-interface)
4. [Categories](#categories)
5. [Examples](#examples)
6. [API Reference](#api-reference)
7. [Publishing](#publishing)

---

## Quick Start

### 1. Create Plugin Directory

```bash
mkdir my-plugin
cd my-plugin
npm init -y
```

### 2. Create Plugin File

```typescript
// index.ts
import { createPlugin, PluginContext } from '@codystack/core';

export default createPlugin(
  {
    id: 'my-awesome-plugin',
    name: 'My Awesome Plugin',
    version: '1.0.0',
    description: 'Does awesome things!',
    category: 'integrations',
    author: { name: 'Your Name' }
  },
  {
    onActivate: async (context: PluginContext) => {
      context.log('Plugin activated! 🎉');
    }
  }
);
```

### 3. Register with CodyStack

```typescript
import { pluginRegistry } from '@codystack/core';
import MyPlugin from './my-plugin';

pluginRegistry.register(MyPlugin);
pluginRegistry.activate('my-awesome-plugin');
```

---

## Plugin Structure

```
my-plugin/
├── package.json       # Plugin manifest
├── index.ts           # Main entry point
├── README.md          # Documentation
├── src/
│   ├── commands.ts    # Command handlers
│   ├── views.tsx      # UI components
│   └── utils.ts       # Helpers
└── assets/
    └── icon.png       # Plugin icon
```

### package.json

```json
{
  "name": "@yourname/my-plugin",
  "version": "1.0.0",
  "main": "index.ts",
  "codystack": {
    "category": "integrations",
    "displayName": "My Plugin",
    "icon": "🔌",
    "activationEvents": ["onStartup"]
  }
}
```

---

## Plugin Interface

```typescript
interface CodyPlugin {
  metadata: PluginMetadata;
  onActivate(context: PluginContext): Promise<void>;
  onDeactivate(): Promise<void>;
  contributes?: PluginContributions;
}
```

### PluginMetadata

| Field         | Type           | Required | Description       |
|---------------|----------------|----------|-------------------|
| `id`          | string         | ✅        | Unique identifier |
| `name`        | string         | ✅        | Display name      |
| `version`     | string         | ✅        | Semantic version  |
| `description` | string         | ✅        | Short description |
| `category`    | PluginCategory | ✅        | Plugin category   |
| `author`      | PluginAuthor   | ✅        | Author info       |
| `icon`        | string         | ❌        | Emoji or icon URL |
| `repository`  | string         | ❌        | GitHub URL        |

### PluginContext

The context provides APIs for interacting with CodyStack:

```typescript
interface PluginContext {
  // State management
  getState<T>(key: string): T | undefined;
  setState<T>(key: string, value: T): void;
  
  // UI
  showNotification(message: string, type?: 'info' | 'success' | 'warning' | 'error'): void;
  showModal(component: () => JSX.Element): void;
  
  // Commands
  registerCommand(command: Command): void;
  executeCommand(commandId: string): Promise<void>;
  
  // Agents
  invokeAgent(agentId: string, prompt: string): Promise<string>;
  
  // Logging
  log(message: string, level?: 'debug' | 'info' | 'warn' | 'error'): void;
}
```

---

## Categories

| Category        | ID             | Use Case                     |
|-----------------|----------------|------------------------------|
| 🤖 AI Agents    | `ai-agents`    | Custom AI assistants         |
| 🔗 Integrations | `integrations` | External service connections |
| ✨ Formatters    | `formatters`   | Code styling tools           |
| 🧪 Test Suites  | `test-suites`  | Testing frameworks           |
| 🚀 DevOps       | `devops`       | Deployment tools             |
| 🎨 Themes       | `themes`       | UI customization             |
| 🔧 Custom       | `custom`       | Other                        |

---

## Examples

### AI Agent Plugin

```typescript
createPlugin(
  { id: 'my-agent', name: 'My Agent', category: 'ai-agents', ... },
  {
    onActivate: async (ctx) => {
      ctx.log('Agent ready!');
    }
  },
  {
    agents: [{
      id: 'my-agent',
      name: 'My Agent',
      specialty: 'Code review',
      model: 'gpt-5',
      systemPrompt: 'You are a code review expert...'
    }]
  }
);
```

### Integration Plugin

```typescript
createPlugin(
  { id: 'slack-notify', name: 'Slack Notifications', category: 'integrations', ... },
  {
    onActivate: async (ctx) => {
      ctx.registerCommand({
        id: 'slack.notify',
        title: 'Send to Slack',
        handler: async () => {
          // Send notification to Slack
        }
      });
    }
  }
);
```

---

## API Reference

### createPlugin()

```typescript
function createPlugin(
  metadata: PluginMetadata,
  handlers: {
    onActivate: (context: PluginContext) => Promise<void>;
    onDeactivate?: () => Promise<void>;
  },
  contributions?: PluginContributions
): CodyPlugin;
```

### pluginRegistry

```typescript
const pluginRegistry = {
  register(plugin: CodyPlugin): Promise<void>;
  activate(pluginId: string): Promise<void>;
  deactivate(pluginId: string): Promise<void>;
  getPlugins(): PluginMetadata[];
  isActive(pluginId: string): boolean;
};
```

---

## Publishing

1. **Test locally** in CodyStack dev mode
2. **Create GitHub repo** with your plugin
3. **Submit PR** to [CodyStack Plugins Registry](https://github.com/LebToki/CodyStack/plugins)
4. **Community review** and approval
5. **Published** to marketplace! 🎉

---

## Need Help?

- 💬 [GitHub Discussions](https://github.com/LebToki/CodyStack/discussions)
- 🐛 [Report Issues](https://github.com/LebToki/CodyStack/issues)
- 📖 [Full API Docs](https://codystack.dev/docs)

---

**Happy Coding! 🚀**
