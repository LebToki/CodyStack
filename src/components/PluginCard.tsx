import { Star, Download, User } from 'lucide-react'
import GlassCard from './GlassCard'

export interface PluginData {
    id: string
    name: string
    description: string
    author: string
    icon: string
    category: string
    downloads: number
    rating: number
    installed?: boolean
}

interface PluginCardProps {
    plugin: PluginData
    onInstall?: (id: string) => void
}

export default function PluginCard({ plugin, onInstall }: PluginCardProps) {
    return (
        <GlassCard className="plugin-card" glow>
            <div className="plugin-card__header">
                <div className="plugin-card__icon">
                    {plugin.icon}
                </div>
                <div className="plugin-card__meta">
                    <div className="plugin-card__name">{plugin.name}</div>
                    <div className="plugin-card__author">
                        <User size={12} style={{ marginRight: 4 }} />
                        {plugin.author}
                    </div>
                </div>
            </div>

            <p className="plugin-card__description">{plugin.description}</p>

            <div className="plugin-card__footer">
                <div className="plugin-card__stats">
                    <span className="plugin-card__stat">
                        <Star size={14} />
                        {plugin.rating.toFixed(1)}
                    </span>
                    <span className="plugin-card__stat">
                        <Download size={14} />
                        {plugin.downloads.toLocaleString()}
                    </span>
                </div>

                <button
                    className={`btn ${plugin.installed ? 'btn--ghost' : 'btn--primary'}`}
                    onClick={() => onInstall?.(plugin.id)}
                >
                    {plugin.installed ? 'Installed' : 'Install'}
                </button>
            </div>
        </GlassCard>
    )
}
