import { useState, useEffect } from 'react'
import FileBrowser, { FileNode } from '../components/FileBrowser'
import CodeEditor from '../components/CodeEditor'
import GlassCard from '../components/GlassCard'
import { Bot, Sparkles, X, Send, FolderOpen, RefreshCw } from 'lucide-react'
import { openProject, readFileContent, saveFileContent, fileSystem } from '../core/FileSystemService'

// ============================================
// COMPONENT
// ============================================

export default function IDE() {
    const [files, setFiles] = useState<FileNode[]>([])
    const [rootPath, setRootPath] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
    const [fileContent, setFileContent] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [showAIPanel, setShowAIPanel] = useState(true)
    const [aiPrompt, setAiPrompt] = useState('')
    const [hasProject, setHasProject] = useState(false)

    const handleOpenProject = async () => {
        setIsLoading(true)
        const result = await openProject()
        if (result) {
            setFiles(result.files)
            setRootPath(result.rootPath)
            setHasProject(true)
            setSelectedFile(null)
            setFileContent('')
        }
        setIsLoading(false)
    }

    const handleFileSelect = async (file: FileNode) => {
        if (file.type === 'directory') return

        setSelectedFile(file)
        setIsLoading(true)

        const content = await readFileContent(file.path)
        if (content !== null) {
            setFileContent(content)
        } else {
            setFileContent(`// Could not read file: ${file.name}`)
        }
        setIsLoading(false)
    }

    const handleSave = async (content: string) => {
        if (!selectedFile) return

        const success = await saveFileContent(selectedFile.path, content)
        if (success) {
            console.log(`Saved: ${selectedFile.path}`)
        } else {
            console.error(`Failed to save: ${selectedFile.path}`)
        }
    }

    const handleRefresh = async () => {
        if (!hasProject) return
        // Re-open the project to refresh file tree
        handleOpenProject()
    }

    // Check if File System Access API is supported
    const isSupported = fileSystem.isSupported

    return (
        <div style={{
            display: 'flex',
            height: 'calc(100vh - 32px)',
            gap: '1px',
            background: 'var(--glass-border)'
        }}>
            {/* File Browser Panel */}
            <div style={{ width: 260, flexShrink: 0 }}>
                {hasProject ? (
                    <FileBrowser
                        rootPath={rootPath}
                        files={files}
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile?.path}
                        onRefresh={handleRefresh}
                    />
                ) : (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'var(--glass-bg)',
                        borderRight: '1px solid var(--glass-border)',
                        padding: '24px',
                        textAlign: 'center'
                    }}>
                        <FolderOpen size={48} color="var(--text-muted)" style={{ marginBottom: 16, opacity: 0.5 }} />
                        <div style={{ fontSize: '0.9rem', marginBottom: 8, color: 'var(--text-secondary)' }}>
                            No project open
                        </div>
                        <button
                            className="btn btn--primary"
                            onClick={handleOpenProject}
                            disabled={!isSupported || isLoading}
                        >
                            <FolderOpen size={16} />
                            {isLoading ? 'Opening...' : 'Open Folder'}
                        </button>
                        {!isSupported && (
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--accent-warning)',
                                marginTop: 12
                            }}>
                                ⚠️ File System API not supported in this browser.
                                <br />Use Chrome, Edge, or Opera.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Editor Panel */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedFile && fileContent !== '' ? (
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
                            {isLoading ? (
                                <>
                                    <RefreshCw size={48} style={{ marginBottom: 16, opacity: 0.5, animation: 'spin 1s linear infinite' }} />
                                    <div style={{ fontSize: '1.1rem' }}>Loading...</div>
                                </>
                            ) : hasProject ? (
                                <>
                                    <Sparkles size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <div style={{ fontSize: '1.1rem', marginBottom: 8 }}>Select a file to start editing</div>
                                    <div style={{ fontSize: '0.85rem' }}>Or use the AI assistant to generate code</div>
                                </>
                            ) : (
                                <>
                                    <FolderOpen size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
                                    <div style={{ fontSize: '1.1rem', marginBottom: 8 }}>Open a project folder to begin</div>
                                    <button
                                        className="btn btn--primary"
                                        onClick={handleOpenProject}
                                        disabled={!isSupported}
                                    >
                                        <FolderOpen size={16} />
                                        Open Folder
                                    </button>
                                </>
                            )}
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
                                            {hasProject ? (
                                                <>
                                                    Project <strong>{rootPath}</strong> loaded!
                                                    <br /><br />
                                                    Select a file to edit, or ask me to:
                                                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                                        <li>Explain the code</li>
                                                        <li>Find bugs</li>
                                                        <li>Refactor</li>
                                                        <li>Generate tests</li>
                                                    </ul>
                                                </>
                                            ) : (
                                                <>
                                                    Welcome! Open a project folder to start.
                                                    <br /><br />
                                                    I can help you:
                                                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                                                        <li>Write and refactor code</li>
                                                        <li>Debug issues</li>
                                                        <li>Explain complex logic</li>
                                                        <li>Generate tests</li>
                                                    </ul>
                                                </>
                                            )}
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
