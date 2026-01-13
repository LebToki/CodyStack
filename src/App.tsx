import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import Agents from './pages/Agents'
import Settings from './pages/Settings'
import Projects from './pages/Projects'
import IDE from './pages/IDE'

type Page = 'dashboard' | 'marketplace' | 'agents' | 'workflows' | 'settings' | 'projects' | 'ide'

function App() {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard')

    const renderPage = () => {
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard />
            case 'marketplace':
                return <Marketplace />
            case 'agents':
                return <Agents />
            case 'settings':
                return <Settings />
            case 'projects':
                return <Projects />
            case 'ide':
                return <IDE />
            default:
                return <Dashboard />
        }
    }

    return (
        <>
            {/* Background Effects */}
            <div className="bg-grid" />
            <div className="bg-glow bg-glow--primary" />
            <div className="bg-glow bg-glow--secondary" />

            {/* App Layout */}
            <div className="app-layout">
                <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
                <main className="main-content">
                    {renderPage()}
                </main>
            </div>
        </>
    )
}

export default App
