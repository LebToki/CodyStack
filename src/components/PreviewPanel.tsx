import { useState, useEffect, useRef } from 'react'
import { Eye, EyeOff, RefreshCw, Maximize2, Code2, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// ============================================
// TYPES
// ============================================

interface PreviewPanelProps {
    filename: string
    content: string
    language: 'html' | 'markdown' | 'css' | 'javascript' | 'react'
}

// ============================================
// MARKDOWN PREVIEW
// ============================================

function MarkdownPreview({ content }: { content: string }) {
    return (
        <div style={{
            padding: '24px',
            color: 'var(--text-primary)',
            lineHeight: 1.7,
            fontSize: '0.9rem',
            overflow: 'auto',
            height: '100%'
        }} className="markdown-preview">
            {/* Simple markdown renderer - in production use react-markdown */}
            <div dangerouslySetInnerHTML={{
                __html: content
                    .replace(/^### (.*$)/gim, '<h3 style="margin: 1em 0 0.5em; font-size: 1.1rem; color: var(--text-primary);">$1</h3>')
                    .replace(/^## (.*$)/gim, '<h2 style="margin: 1.2em 0 0.5em; font-size: 1.3rem; color: var(--text-primary);">$1</h2>')
                    .replace(/^# (.*$)/gim, '<h1 style="margin: 1.5em 0 0.5em; font-size: 1.6rem; color: var(--text-primary);">$1</h1>')
                    .replace(/\*\*(.*)\*\*/gim, '<strong style="color: var(--accent-primary);">$1</strong>')
                    .replace(/\*(.*)\*/gim, '<em>$1</em>')
                    .replace(/`([^`]+)`/gim, '<code style="background: var(--glass-bg); padding: 2px 6px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85em;">$1</code>')
                    .replace(/```(\w+)?\n([\s\S]*?)```/gim, '<pre style="background: var(--glass-bg); padding: 16px; border-radius: 8px; overflow-x: auto; margin: 1em 0;"><code style="font-family: var(--font-mono); font-size: 0.85em;">$2</code></pre>')
                    .replace(/^- (.*$)/gim, '<li style="margin: 0.3em 0;">$1</li>')
                    .replace(/\n/gim, '<br/>')
            }} />
        </div>
    )
}

// ============================================
// HTML PREVIEW (IFRAME)
// ============================================

function HTMLPreview({ content, css }: { content: string; css?: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useEffect(() => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument
            if (doc) {
                doc.open()
                doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 16px;
                background: white;
                color: #1a1a1a;
              }
              ${css || ''}
            </style>
          </head>
          <body>${content}</body>
          </html>
        `)
                doc.close()
            }
        }
    }, [content, css])

    return (
        <iframe
            ref={iframeRef}
            title="Preview"
            style={{
                width: '100%',
                height: '100%',
                border: 'none',
                background: 'white',
                borderRadius: '4px'
            }}
            sandbox="allow-scripts"
        />
    )
}

// ============================================
// PREVIEW PANEL COMPONENT
// ============================================

export default function PreviewPanel({ filename, content, language }: PreviewPanelProps) {
    const [isLive, setIsLive] = useState(true)
    const [lastContent, setLastContent] = useState(content)

    useEffect(() => {
        if (isLive) {
            setLastContent(content)
        }
    }, [content, isLive])

    const handleRefresh = () => {
        setLastContent(content)
    }

    const renderPreview = () => {
        switch (language) {
            case 'markdown':
                return <MarkdownPreview content={lastContent} />

            case 'html':
                return <HTMLPreview content={lastContent} />

            case 'css':
                return (
                    <HTMLPreview
                        content="<div class='demo-box'>CSS Preview</div><p>Your styles are applied to this demo content.</p>"
                        css={lastContent}
                    />
                )

            case 'react':
                return (
                    <div style={{
                        padding: 24,
                        color: 'var(--text-secondary)',
                        textAlign: 'center'
                    }}>
                        <Code2 size={32} style={{ marginBottom: 12, opacity: 0.5 }} />
                        <div>React component preview</div>
                        <div style={{ fontSize: '0.8rem', marginTop: 8 }}>
                            Requires build step - use browser dev tools
                        </div>
                    </div>
                )

            default:
                return (
                    <div style={{
                        padding: 24,
                        color: 'var(--text-muted)',
                        textAlign: 'center'
                    }}>
                        No preview available for this file type
                    </div>
                )
        }
    }

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--bg-secondary)',
            borderLeft: '1px solid var(--glass-border)'
        }}>
            {/* Toolbar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 12px',
                background: 'var(--glass-bg)',
                borderBottom: '1px solid var(--glass-border)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Eye size={16} color="var(--accent-secondary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Preview</span>
                    <span className="tag">{language.toUpperCase()}</span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className={`btn btn--ghost`}
                        style={{
                            padding: '4px 8px',
                            color: isLive ? 'var(--accent-success)' : 'var(--text-muted)'
                        }}
                        title={isLive ? 'Live preview enabled' : 'Live preview disabled'}
                    >
                        {isLive ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="btn btn--ghost"
                        style={{ padding: '4px 8px' }}
                        title="Refresh preview"
                    >
                        <RefreshCw size={14} />
                    </button>
                    <button
                        className="btn btn--ghost"
                        style={{ padding: '4px 8px' }}
                        title="Open in new window"
                    >
                        <ExternalLink size={14} />
                    </button>
                </div>
            </div>

            {/* Preview Content */}
            <div style={{ flex: 1, overflow: 'auto' }}>
                {renderPreview()}
            </div>

            {/* Status Bar */}
            <div style={{
                padding: '4px 12px',
                background: 'var(--glass-bg)',
                borderTop: '1px solid var(--glass-border)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                display: 'flex',
                justifyContent: 'space-between'
            }}>
                <span>{isLive ? '🟢 Live' : '⏸️ Paused'}</span>
                <span>{filename}</span>
            </div>
        </div>
    )
}

// ============================================
// UTILITY: Detect if file needs preview
// ============================================

export function getPreviewLanguage(filename: string): 'html' | 'markdown' | 'css' | 'javascript' | 'react' | null {
    const ext = filename.split('.').pop()?.toLowerCase()

    switch (ext) {
        case 'html':
        case 'htm':
            return 'html'
        case 'md':
        case 'markdown':
            return 'markdown'
        case 'css':
        case 'scss':
            return 'css'
        case 'jsx':
        case 'tsx':
            return 'react'
        default:
            return null
    }
}
