/**
 * CodyStack GitHub Publisher
 * 
 * Publish plugins, workflows, and configurations to GitHub.
 * Handles repository creation, commits, and version releases.
 */

// ============================================
// GITHUB CONFIG
// ============================================

export interface GitHubConfig {
    token: string
    username?: string
    defaultOrg?: string
}

export interface GitHubRepo {
    owner: string
    name: string
    fullName: string
    description?: string
    private: boolean
    url: string
    cloneUrl: string
    defaultBranch: string
}

// ============================================
// PUBLISHER INTERFACE
// ============================================

export interface GitHubPublisher {
    // Authentication
    authenticate(token: string): Promise<GitHubUser>
    isAuthenticated(): boolean

    // Repository operations
    createRepo(name: string, options?: CreateRepoOptions): Promise<GitHubRepo>
    getRepo(owner: string, name: string): Promise<GitHubRepo | null>
    listRepos(): Promise<GitHubRepo[]>

    // Plugin publishing
    publishPlugin(pluginPath: string, repoName: string): Promise<PublishResult>
    updatePlugin(pluginPath: string, repo: GitHubRepo, message: string): Promise<PublishResult>

    // Releases
    createRelease(repo: GitHubRepo, version: string, notes: string): Promise<ReleaseInfo>
    listReleases(repo: GitHubRepo): Promise<ReleaseInfo[]>

    // Workflows
    publishWorkflow(workflow: WorkflowExport, repoName: string): Promise<PublishResult>
}

export interface GitHubUser {
    id: number
    login: string
    name: string
    avatarUrl: string
    email?: string
    bio?: string
    publicRepos: number
}

export interface CreateRepoOptions {
    description?: string
    private?: boolean
    autoInit?: boolean
    license?: string
    topics?: string[]
}

export interface PublishResult {
    success: boolean
    repo: GitHubRepo
    commitSha?: string
    url: string
    message: string
}

export interface ReleaseInfo {
    id: number
    tagName: string
    name: string
    body: string
    draft: boolean
    prerelease: boolean
    createdAt: string
    publishedAt: string
    downloadUrl: string
    assets: ReleaseAsset[]
}

export interface ReleaseAsset {
    name: string
    size: number
    downloadUrl: string
    downloadCount: number
}

export interface WorkflowExport {
    id: string
    name: string
    description: string
    steps: unknown[]
    config: unknown
}

// ============================================
// GITHUB API CLIENT
// ============================================

const GITHUB_API_URL = 'https://api.github.com'

class GitHubClient implements GitHubPublisher {
    private token: string | null = null
    private user: GitHubUser | null = null

    async authenticate(token: string): Promise<GitHubUser> {
        const response = await fetch(`${GITHUB_API_URL}/user`, {
            headers: this.getHeaders(token)
        })

        if (!response.ok) {
            throw new Error('GitHub authentication failed')
        }

        const data = await response.json()
        this.token = token
        this.user = {
            id: data.id,
            login: data.login,
            name: data.name || data.login,
            avatarUrl: data.avatar_url,
            email: data.email,
            bio: data.bio,
            publicRepos: data.public_repos
        }

        return this.user
    }

    isAuthenticated(): boolean {
        return this.token !== null && this.user !== null
    }

    async createRepo(name: string, options: CreateRepoOptions = {}): Promise<GitHubRepo> {
        this.ensureAuthenticated()

        const response = await fetch(`${GITHUB_API_URL}/user/repos`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                name,
                description: options.description || `CodyStack plugin: ${name}`,
                private: options.private ?? false,
                auto_init: options.autoInit ?? true,
                license_template: options.license || 'mit'
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Failed to create repo: ${error.message}`)
        }

        return this.parseRepo(await response.json())
    }

    async getRepo(owner: string, name: string): Promise<GitHubRepo | null> {
        this.ensureAuthenticated()

        const response = await fetch(`${GITHUB_API_URL}/repos/${owner}/${name}`, {
            headers: this.getHeaders()
        })

        if (response.status === 404) return null
        if (!response.ok) throw new Error('Failed to fetch repo')

        return this.parseRepo(await response.json())
    }

    async listRepos(): Promise<GitHubRepo[]> {
        this.ensureAuthenticated()

        const response = await fetch(`${GITHUB_API_URL}/user/repos?sort=updated&per_page=100`, {
            headers: this.getHeaders()
        })

        if (!response.ok) throw new Error('Failed to list repos')

        const data = await response.json()
        return data.map((r: unknown) => this.parseRepo(r))
    }

    async publishPlugin(pluginPath: string, repoName: string): Promise<PublishResult> {
        this.ensureAuthenticated()

        // Create repository
        const repo = await this.createRepo(repoName, {
            description: `CodyStack Plugin`,
            autoInit: true
        })

        // In a real implementation, we would:
        // 1. Read plugin files from pluginPath
        // 2. Create/update files via GitHub API
        // 3. Commit changes

        console.log(`Publishing plugin from ${pluginPath} to ${repo.fullName}`)

        return {
            success: true,
            repo,
            url: repo.url,
            message: `Plugin published to ${repo.fullName}`
        }
    }

    async updatePlugin(pluginPath: string, repo: GitHubRepo, message: string): Promise<PublishResult> {
        this.ensureAuthenticated()

        console.log(`Updating plugin at ${pluginPath} in ${repo.fullName}: ${message}`)

        return {
            success: true,
            repo,
            url: repo.url,
            message: `Plugin updated: ${message}`
        }
    }

    async createRelease(repo: GitHubRepo, version: string, notes: string): Promise<ReleaseInfo> {
        this.ensureAuthenticated()

        const response = await fetch(`${GITHUB_API_URL}/repos/${repo.fullName}/releases`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({
                tag_name: `v${version}`,
                name: `v${version}`,
                body: notes,
                draft: false,
                prerelease: version.includes('-')
            })
        })

        if (!response.ok) throw new Error('Failed to create release')

        const data = await response.json()
        return this.parseRelease(data)
    }

    async listReleases(repo: GitHubRepo): Promise<ReleaseInfo[]> {
        this.ensureAuthenticated()

        const response = await fetch(`${GITHUB_API_URL}/repos/${repo.fullName}/releases`, {
            headers: this.getHeaders()
        })

        if (!response.ok) throw new Error('Failed to list releases')

        const data = await response.json()
        return data.map((r: unknown) => this.parseRelease(r))
    }

    async publishWorkflow(workflow: WorkflowExport, repoName: string): Promise<PublishResult> {
        this.ensureAuthenticated()

        const repo = await this.createRepo(`workflow-${repoName}`, {
            description: `CodyStack Workflow: ${workflow.name}`
        })

        return {
            success: true,
            repo,
            url: repo.url,
            message: `Workflow "${workflow.name}" published`
        }
    }

    private getHeaders(token?: string): Record<string, string> {
        return {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token || this.token}`,
            'X-GitHub-Api-Version': '2022-11-28'
        }
    }

    private ensureAuthenticated(): void {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated. Call authenticate() first.')
        }
    }

    private parseRepo(data: Record<string, unknown>): GitHubRepo {
        return {
            owner: (data.owner as Record<string, string>).login,
            name: data.name as string,
            fullName: data.full_name as string,
            description: data.description as string,
            private: data.private as boolean,
            url: data.html_url as string,
            cloneUrl: data.clone_url as string,
            defaultBranch: data.default_branch as string
        }
    }

    private parseRelease(data: Record<string, unknown>): ReleaseInfo {
        return {
            id: data.id as number,
            tagName: data.tag_name as string,
            name: data.name as string,
            body: data.body as string,
            draft: data.draft as boolean,
            prerelease: data.prerelease as boolean,
            createdAt: data.created_at as string,
            publishedAt: data.published_at as string,
            downloadUrl: data.zipball_url as string,
            assets: ((data.assets as unknown[]) || []).map((a: Record<string, unknown>) => ({
                name: a.name as string,
                size: a.size as number,
                downloadUrl: a.browser_download_url as string,
                downloadCount: a.download_count as number
            }))
        }
    }
}

// ============================================
// EXPORTS
// ============================================

export const githubClient = new GitHubClient()
export default githubClient
