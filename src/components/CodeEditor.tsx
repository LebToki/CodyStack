import { useState, useEffect } from 'react'
import { Save, Copy, Undo, Redo, Search, X } from 'lucide-react'

// ============================================
// TYPES
// ============================================

interface CodeEditorProps {
    filename: string
    content: string
    language?: string
    onChange?: (content: string) => void
    onSave?: (content: string) => void
    readOnly?: boolean
}

// ============================================
// LANGUAGE DETECTION
// ============================================

const getLanguageFromExtension = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
        'ts': 'typescript',
        'tsx': 'typescript',
        'js': 'javascript',
        'jsx': 'javascript',
        'json': 'json',
        'css': 'css',
        'scss': 'scss',
        'html': 'html',
        'md': 'markdown',
        'py': 'python',
        'rs': 'rust',
        'go': 'go',
        'yaml': 'yaml',
        'yml': 'yaml',
        'sh': 'bash',
        'sql': 'sql'
    }
    return languageMap[ext || ''] || 'plaintext'
}

// ============================================
// LINE NUMBERS
// ============================================

function LineNumbers({ count }: { count: number }) {
    return (
        <div style={{
            padding: '16px 0',
            textAlign: 'right',
            paddingRight: '12px',
            paddingLeft: '12px',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            lineHeight: '1.6',
            userSelect: 'none',
            borderRight: '1px solid var(--glass-border)',
            minWidth: '48px'
        }}>
            {Array.from({ length: count }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
            ))}
        </div>
    )
}

// ============================================
// CODE EDITOR COMPONENT
// ============================================

export default function CodeEditor({
    filename,
    content,
    onChange,
    onSave,
    readOnly = false
}: CodeEditorProps) {
    const [value, setValue] = useState(content)
    const [modified, setModified] = useState(false)
    const language = getLanguageFromExtension(filename)
    const lineCount = value.split('\n').length

    useEffect(() => {
        setValue(content)
        setModified(false)
    }, [content, filename])

    const handleChange = (newValue: string) => {
        setValue(newValue)
        setModified(newValue !== content)
        onChange?.(newValue)
    }

    const handleSave = () => {
        onSave?.(value)
        setModified(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Ctrl+S to save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            handleSave()
        }
        // Tab for indentation
        if (e.key === 'Tab') {
            e.preventDefault()
            const target = e.target as HTMLTextAreaElement
            const start = target.selectionStart
            const end = target.selectionEnd
            const newValue = value.substring(0, start) + '  ' + value.substring(end)
            setValue(newValue)
            // Reset cursor position
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 2
            }, 0)
        }
    }

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-secondary)'
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 16px',
                background: 'var(--glass-bg)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        color: 'var(--text-primary)'
                    }}>
                        {filename}
                    </span>
                    {modified && (
                        <span style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'var(--accent-primary)'
                        }} title="Unsaved changes" />
                    )}
                    <span className="tag" style={{ marginLeft: '8px' }}>
                        {language}
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        className="btn btn--ghost"
                        style={{ padding: '4px 8px' }}
                        onClick={handleSave}
                        disabled={!modified}
                        title="Save (Ctrl+S)"
                    >
                        <Save size={14} />
                    </button>
                    <button
                        className="btn btn--ghost"
                        style={{ padding: '4px 8px' }}
                        onClick={() => navigator.clipboard.writeText(value)}
                        title="Copy all"
                    >
                        <Copy size={14} />
                    </button>
                    <button className="btn btn--ghost" style={{ padding: '4px 8px' }} title="Undo">
                        <Undo size={14} />
                    </button>
                    <button className="btn btn--ghost" style={{ padding: '4px 8px' }} title="Redo">
                        <Redo size={14} />
                    </button>
                    <button className="btn btn--ghost" style={{ padding: '4px 8px' }} title="Search">
                        <Search size={14} />
                    </button>
                </div>
            </div>

            {/* Editor Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                overflow: 'hidden'
            }}>
                {/* Line Numbers */}
                <LineNumbers count={lineCount} />

                {/* Text Area */}
                <textarea
                    value={value}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    readOnly={readOnly}
                    spellCheck={false}
                    style={{
                        flex: 1,
                        padding: '16px',
                        background: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.85rem',
                        lineHeight: '1.6',
                        resize: 'none',
                        whiteSpace: 'pre',
                        overflowX: 'auto'
                    }}
                />
            </div>

            {/* Status Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '4px 16px',
                background: 'var(--glass-bg)',
                borderTop: '1px solid var(--glass-border)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)'
            }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <span>Lines: {lineCount}</span>
                    <span>Characters: {value.length}</span>
                </div>
                <div>
                    <span>{readOnly ? 'Read Only' : 'UTF-8'}</span>
                </div>
            </div>
        </div>
    )
}
