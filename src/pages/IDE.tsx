import { useState } from 'react'
import FileBrowser, { FileNode } from '../components/FileBrowser'
import CodeEditor from '../components/CodeEditor'
import GlassCard from '../components/GlassCard'
import { Bot, Sparkles, X, Send, Terminal } from 'lucide-react'

// ============================================
// MOCK FILE SYSTEM
// ============================================

const mockFiles: FileNode[] = [
    {
        id: '1',
        name: 'src',
        path: 'E:\\platform\\CodyStack\\src',
        type: 'directory',
        children: [
            {
                id: '2',
                name: 'components',
                path: 'E:\\platform\\CodyStack\\src\\components',
                type: 'directory',
                children: [
                    { id: '3', name: 'FileBrowser.tsx', path: 'E:\\platform\\CodyStack\\src\\components\\FileBrowser.tsx', type: 'file', extension: 'tsx' },
                    { id: '4', name: 'CodeEditor.tsx', path: 'E:\\platform\\CodyStack\\src\\components\\CodeEditor.tsx', type: 'file', extension: 'tsx' },
                    { id: '5', name: 'GlassCard.tsx', path: 'E:\\platform\\CodyStack\\src\\components\\GlassCard.tsx', type: 'file', extension: 'tsx' },
                    { id: '6', name: 'Sidebar.tsx', path: 'E:\\platform\\CodyStack\\src\\components\\Sidebar.tsx', type: 'file', extension: 'tsx' },
                ]
            },
            {
                id: '7',
                name: 'pages',
                path: 'E:\\platform\\CodyStack\\src\\pages',
                type: 'directory',
                children: [
                    { id: '8', name: 'Dashboard.tsx', path: 'E:\\platform\\CodyStack\\src\\pages\\Dashboard.tsx', type: 'file', extension: 'tsx' },
                    { id: '9', name: 'IDE.tsx', path: 'E:\\platform\\CodyStack\\src\\pages\\IDE.tsx', type: 'file', extension: 'tsx' },
                    { id: '10', name: 'Projects.tsx', path: 'E:\\platform\\CodyStack\\src\\pages\\Projects.tsx', type: 'file', extension: 'tsx' },
                ]
            },
            {
                id: '11',
                name: 'core',
                path: 'E:\\platform\\CodyStack\\src\\core',
                type: 'directory',
                children: [
                    { id: '12', name: 'AIProviders.ts', path: 'E:\\platform\\CodyStack\\src\\core\\AIProviders.ts', type: 'file', extension: 'ts' },
                    { id: '13', name: 'PluginSystem.ts', path: 'E:\\platform\\CodyStack\\src\\core\\PluginSystem.ts', type: 'file', extension: 'ts' },
                ]
            },
            { id: '14', name: 'App.tsx', path: 'E:\\platform\\CodyStack\\src\\App.tsx', type: 'file', extension: 'tsx' },
            { id: '15', name: 'main.tsx', path: 'E:\\platform\\CodyStack\\src\\main.tsx', type: 'file', extension: 'tsx' },
            { id: '16', name: 'index.css', path: 'E:\\platform\\CodyStack\\src\\index.css', type: 'file', extension: 'css' },
        ]
    },
    { id: '17', name: 'package.json', path: 'E:\\platform\\CodyStack\\package.json', type: 'file', extension: 'json' },
    { id: '18', name: 'tsconfig.json', path: 'E:\\platform\\CodyStack\\tsconfig.json', type: 'file', extension: 'json' },
    { id: '19', name: 'README.md', path: 'E:\\platform\\CodyStack\\README.md', type: 'file', extension: 'md' },
    { id: '20', name: 'vite.config.ts', path: 'E:\\platform\\CodyStack\\vite.config.ts', type: 'file', extension: 'ts' },
]

const mockFileContents: Record<string, string> = {
    'E:\\platform\\CodyStack\\src\\App.tsx': `import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import IDE from './pages/IDE'

type Page = 'dashboard' | 'ide' | 'projects'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <div className="app-layout">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="main-content">
        {/* Page content */}
      </main>
    </div>
  )
}

export default App`,
    'E:\\platform\\CodyStack\\package.json': `{
  "name": "codystack",
  "version": "0.1.0",
  "description": "AI-Native IDE with Multi-Agent Orchestration",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "lucide-react": "^0.294.0"
  }
}`,
    'E:\\platform\\CodyStack\\README.md': `# CodyStack

AI-Native IDE with Multi-Agent Orchestration

## Features
- 🤖 7 Specialized AI Agents
- 🔌 Plugin Marketplace
- 🎨 GlassMorphic UI

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`
`,
}

// ============================================
// COMPONENT
// ============================================

export default function IDE() {
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
    const [fileContent, setFileContent] = useState('')
    const [showAIPanel, setShowAIPanel] = useState(true)
    const [aiPrompt, setAiPrompt] = useState('')

    const handleFileSelect = (file: FileNode) => {
        setSelectedFile(file)
        // Load file content (mock)
        const content = mockFileContents[file.path] || `// ${file.name}\n// File content would be loaded here`
        setFileContent(content)
    }

    const handleSave = (content: string) => {
        console.log(`Saving ${selectedFile?.path}:`, content)
        // In real implementation, save to file system
    }

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 32px)',
            gap: '1px',
            background: 'var(--glass-border)'
        }}>
            {/* File Browser Panel */}
            <div style={{ width: 260, flexShrink: 0 }}>
                <FileBrowser
                    rootPath="E:\\platform\\CodyStack"
                    files={mockFiles}
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile?.path}
                    onRefresh={() => console.log('Refreshing...')}
                />
            </div>

            {/* Editor Panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedFile ? (
                    <CodeEditor
                        filename={selectedFile.name}
                        content={fileContent}
                        onChange={(content) => setFileContent(content)}
                        onSave={handleSave}
                    />
                ) : (
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-muted)'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <Sparkles size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                            <div style={{ fontSize: '1.1rem', marginBottom: 8 }}>Select a file to start editing</div>
                            <div style={{ fontSize: '0.85rem' }}>Or use the AI assistant to generate code</div>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Assistant Panel */}
            {showAIPanel && (
                <div style={{
                    width: 320,
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'var(--glass-bg)'
                }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        borderBottom: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Bot size={18} color="var(--accent-primary)" />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Assistant</span>
                        </div>
                        <button
                            onClick={() => setShowAIPanel(false)}
                            className="btn btn--ghost"
                            style={{ padding: '4px' }}
                        >
                            <X size={14} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
                        <GlassCard>
                            <div style={{ padding: '12px', fontSize: '0.85rem' }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px',
                                    marginBottom: '12px'
                                }}>
                                    <div style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        background: 'rgba(255, 51, 102, 0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <Bot size={14} color="var(--accent-primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Cody</div>
                                        <div style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            Welcome! I'm your AI coding assistant. I can help you:
                                            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                                <li>Write and refactor code</li>
                                                <li>Debug issues</li>
                                                <li>Explain complex logic</li>
                                                <li>Generate tests</li>
                                            </ul>
                                            Select a file and ask me anything!
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: '12px',
                        borderTop: '1px solid var(--glass-border)'
                    }}>
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '8px 12px'
                        }}>
                            <input
                                type="text"
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="Ask AI anything..."
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    outline: 'none',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.85rem'
                                }}
                            />
                            <button className="btn btn--primary" style={{ padding: '4px 12px' }}>
                                <Send size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toggle AI Panel Button (when hidden) */}
            {!showAIPanel && (
                <button
                    onClick={() => setShowAIPanel(true)}
                    style={{
                        position: 'fixed',
                        right: 16,
                        bottom: 16,
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--glow-primary)'
                    }}
                >
                    <Bot size={24} color="white" />
                </button>
            )}
        </div>
    )
}
