'use client'

import { useState, useEffect, useCallback } from 'react'
import { Zap, Plus, Play, Pause, AlertCircle, Clock, X, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Skeleton from '@/components/ui/Skeleton'
import { formatDate } from '@/lib/utils'

interface Workflow {
  id: string
  name: string
  status: 'active' | 'paused' | 'error' | 'draft'
  last_run: string | null
  created_at: string
  steps: unknown[]
}

const TEMPLATES = [
  {
    id: 'veille',
    name: 'Veille concurrentielle',
    description: 'Surveille tes concurrents automatiquement et recois des rapports quotidiens.',
    steps: 'Perplexity → Claude → Email',
    color: 'cyan' as const,
    icon: '🔍',
  },
  {
    id: 'social',
    name: 'Social media autopilote',
    description: 'Genere et publie du contenu multimedia sur toutes les plateformes.',
    steps: 'Claude → FLUX → Publication',
    color: 'pink' as const,
    icon: '📱',
  },
  {
    id: 'support',
    name: 'Support client 24/7',
    description: 'Reponds automatiquement aux emails clients avec l\'IA.',
    steps: 'Email → Claude → Reply',
    color: 'green' as const,
    icon: '🎧',
  },
  {
    id: 'rapport',
    name: 'Rapport hebdomadaire',
    description: 'Genere et envoie des rapports analytics complets chaque semaine.',
    steps: 'Analytics → Claude → PDF',
    color: 'gold' as const,
    icon: '📊',
  },
  {
    id: 'lead',
    name: 'Lead nurturing',
    description: 'Automatise le suivi de tes prospects avec des sequences email IA.',
    steps: 'Contact → Series emails IA',
    color: 'purple' as const,
    icon: '🎯',
  },
]

const STATUS_CONFIG = {
  active: { label: 'Actif', color: 'green' as const, dot: 'bg-green-400' },
  paused: { label: 'En pause', color: 'default' as const, dot: 'bg-gray-400' },
  error: { label: 'Erreur', color: 'default' as const, dot: 'bg-red-400' },
  draft: { label: 'Brouillon', color: 'default' as const, dot: 'bg-yellow-400' },
}

export default function AutomationPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'my' | 'templates'>('my')
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)

  const supabase = createClient()

  const fetchWorkflows = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('workflows')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) setWorkflows(data as Workflow[])
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    fetchWorkflows()
  }, [fetchWorkflows])

  const handleCreateWorkflow = async () => {
    if (!user || !newName.trim()) return
    setCreating(true)
    const { error } = await supabase.from('workflows').insert({
      user_id: user.id,
      name: newName.trim(),
      status: 'draft',
      steps: [],
    })
    if (error) {
      toast.error('Erreur lors de la creation')
    } else {
      toast.success('Workflow cree !')
      setShowModal(false)
      setNewName('')
      fetchWorkflows()
    }
    setCreating(false)
  }

  const handleUseTemplate = async (template: typeof TEMPLATES[0]) => {
    if (!user) {
      toast.error('Connecte-toi pour utiliser ce modele')
      return
    }
    const { error } = await supabase.from('workflows').insert({
      user_id: user.id,
      name: template.name,
      status: 'draft',
      steps: [{ type: 'template', template_id: template.id, description: template.steps }],
    })
    if (error) {
      toast.error('Erreur lors de la creation')
    } else {
      toast.success(`Workflow "${template.name}" cree ! Retrouve-le dans "Mes workflows".`)
      setActiveTab('my')
      fetchWorkflows()
    }
  }

  const handleToggleStatus = async (w: Workflow) => {
    const newStatus = w.status === 'active' ? 'paused' : 'active'
    const { error } = await supabase
      .from('workflows')
      .update({ status: newStatus })
      .eq('id', w.id)
    if (error) {
      toast.error('Erreur')
    } else {
      toast.success(newStatus === 'active' ? 'Workflow active' : 'Workflow mis en pause')
      fetchWorkflows()
    }
  }

  return (
    <div className="flex flex-col gap-6" data-testid="automation-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] font-[family-name:var(--font-display)]">
            Automatisation
          </h1>
          <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
            Automatise tes taches repetitives avec des workflows IA
          </p>
        </div>
        <Button
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setShowModal(true)}
          data-testid="new-workflow-btn"
        >
          Nouveau workflow
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/5 p-1 w-fit">
        {([['my', 'Mes workflows'], ['templates', 'Templates']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-testid={`tab-${tab}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-[var(--cyan)] text-black shadow'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* My Workflows Tab */}
      {activeTab === 'my' && (
        <div data-testid="my-workflows-tab">
          {loading ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-2xl" />
              ))}
            </div>
          ) : workflows.length === 0 ? (
            <EmptyState
              icon={<Zap className="h-10 w-10" />}
              title="Aucun workflow"
              description="Cree ton premier workflow ou utilise un template pour commencer."
              action={
                <Button onClick={() => setShowModal(true)} icon={<Plus className="h-4 w-4" />}>
                  Creer un workflow
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workflows.map((w) => {
                const s = STATUS_CONFIG[w.status] ?? STATUS_CONFIG.draft
                return (
                  <Card key={w.id} className="flex flex-col gap-4 p-5" data-testid={`workflow-card-${w.id}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-2.5 w-2.5 rounded-full ${s.dot} shadow-[0_0_6px_currentColor]`} />
                        <p className="font-semibold text-[var(--text-primary)] truncate">{w.name}</p>
                      </div>
                      <Badge variant={s.color}>{s.label}</Badge>
                    </div>

                    {w.last_run && (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                        <Clock className="h-3.5 w-3.5" />
                        Derniere exec. {formatDate(w.last_run)}
                      </div>
                    )}

                    <div className="flex gap-2 mt-auto">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleToggleStatus(w)}
                        icon={w.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        data-testid={`toggle-workflow-${w.id}`}
                      >
                        {w.status === 'active' ? 'Pause' : 'Activer'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toast.info('Editeur bientot disponible')}
                        icon={<ChevronRight className="h-3.5 w-3.5" />}
                      >
                        Editer
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="templates-tab">
          {TEMPLATES.map((t) => (
            <Card key={t.id} className="flex flex-col gap-4 p-5" data-testid={`template-card-${t.id}`}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{t.icon}</div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{t.name}</p>
                  <Badge variant={t.color} className="mt-0.5">{t.steps}</Badge>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{t.description}</p>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleUseTemplate(t)}
                data-testid={`use-template-${t.id}`}
                className="mt-auto w-full"
              >
                Utiliser ce modele
              </Button>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          data-testid="create-workflow-modal"
        >
          <Card className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[var(--text-primary)]">Nouveau workflow</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                  Nom du workflow
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateWorkflow()}
                  placeholder="Ex: Veille produit quotidienne"
                  autoFocus
                  className="w-full rounded-xl border border-[var(--border)] bg-white/5 px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--cyan)] focus:outline-none"
                  data-testid="workflow-name-input"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setShowModal(false)}>
                  Annuler
                </Button>
                <Button
                  onClick={handleCreateWorkflow}
                  loading={creating}
                  disabled={!newName.trim()}
                  data-testid="create-workflow-confirm"
                >
                  Creer
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
