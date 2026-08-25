import { useState, Suspense, useMemo, useRef } from "react"
import { Group } from "three"
import { Grid } from "@/components/ui/Grid"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs"
import { ShoppingCart, Plus, Trash2, CheckCircle, Zap, Box, HelpCircle } from "lucide-react"
import { ThreeCanvas } from "@/components/three/Canvas"
import { StudioLighting } from "@/components/three/Lighting"
import { CameraControls } from "@/components/three/CameraControls"
import { formatPrice, cn } from "@/lib/utils"
import { useCartStore } from "@/store/cartStore"
import { useUIStore } from "@/store/uiStore"
import { createEurorackCase } from "@/components/three/models/geometry"
import { EurorackModuleModel } from "@/components/three/models/products/EurorackModuleModel"

type Module = typeof eurorackModules[0] & { position: { row: number; hp: number }; rotation?: number }

type EurorackCase = typeof eurorackCases[0]

type PowerUsage = { plus12: number; minus12: number; plus5: number }
type PowerPercent = { plus12: number; minus12: number; plus5: number }

const eurorackModules = [
  { id: "vco-1", name: "VCO-1", type: "vco", hp: 10, price: 249, description: "Analog VCO with sine, triangle, saw, square outputs and FM input" },
  { id: "vco-2", name: "VCO-2", type: "vco", hp: 8, price: 199, description: "Digital wavetable VCO with 100+ wavetables and morphing" },
  { id: "vcf-1", name: "VCF-1", type: "vcf", hp: 12, price: 299, description: "4-pole ladder filter with resonance compensation and drive" },
  { id: "vcf-2", name: "VCF-2", type: "vcf", hp: 8, price: 179, description: "Multimode state-variable filter with 12/24 dB modes" },
  { id: "vca-1", name: "VCA-1", type: "vca", hp: 4, price: 129, description: "Linear/exponential VCA with CV control and bias" },
  { id: "vca-2", name: "VCA-2", type: "vca", hp: 6, price: 159, description: "Quad VCA with mix output and individual level controls" },
  { id: "env-1", name: "ENV-1", type: "env", hp: 10, price: 229, description: "ADSR envelope with loop, delay, and velocity tracking" },
  { id: "env-2", name: "ENV-2", type: "env", hp: 6, price: 149, description: "Dual AD envelope with gate/trigger inputs" },
  { id: "lfo-1", name: "LFO-1", type: "lfo", hp: 6, price: 139, description: "Multi-wave LFO with sync, reset, and 8 waveforms" },
  { id: "seq-1", name: "SEQ-1", type: "seq", hp: 14, price: 349, description: "64-step sequencer with probability, ratchet, and CV/gate outs" },
  { id: "util-1", name: "MIX-1", type: "util", hp: 4, price: 99, description: "4-channel mixer with level, pan, and mute per channel" },
  { id: "util-2", name: "MULT-1", type: "util", hp: 2, price: 49, description: "Passive multiple with 4 jacks (1-to-3 or 2-to-2)" },
  { id: "util-3", name: "OUT-1", type: "util", hp: 6, price: 169, description: "Stereo output module with headphone amp and level meter" },
]

const eurorackCases = [
  { id: "case-84-3u", name: "84HP 3U Case", hp: 84, rows: 3, price: 449, power: { plus12: 2000, minus12: 1500, plus5: 1000 }, color: "dark" },
  { id: "case-104-3u", name: "104HP 3U Case", hp: 104, rows: 3, price: 549, power: { plus12: 3000, minus12: 2000, plus5: 1500 }, color: "dark" },
  { id: "case-84-6u", name: "84HP 6U Case", hp: 84, rows: 6, price: 799, power: { plus12: 4000, minus12: 3000, plus5: 2000 }, color: "dark" },
]

export function ConfigurePage() {
  const [selectedCase, setSelectedCase] = useState(eurorackCases[0])
  const [modules, setModules] = useState<Module[]>([])
  const [activeTab, setActiveTab] = useState("modules")
  const [showPowerDetails, setShowPowerDetails] = useState(false)
  const { addItem } = useCartStore()
  const { addToast } = useUIStore()

  // Calculate power usage
  const powerUsage = modules.reduce((acc, module) => {
    // Estimate power per module type (mA)
    const estimates: Record<string, { plus12: number; minus12: number; plus5: number }> = {
      vco: { plus12: 80, minus12: 60, plus5: 0 },
      vcf: { plus12: 40, minus12: 30, plus5: 0 },
      vca: { plus12: 30, minus12: 20, plus5: 0 },
      env: { plus12: 25, minus12: 20, plus5: 0 },
      lfo: { plus12: 35, minus12: 25, plus5: 0 },
      seq: { plus12: 100, minus12: 50, plus5: 50 },
      util: { plus12: 20, minus12: 10, plus5: 0 },
    }
    const est = estimates[module.type] || { plus12: 30, minus12: 20, plus5: 0 }
    return {
      plus12: acc.plus12 + est.plus12,
      minus12: acc.minus12 + est.minus12,
      plus5: acc.plus5 + est.plus5,
    }
  }, { plus12: 0, minus12: 0, plus5: 0 })

  const powerPercent = {
    plus12: (powerUsage.plus12 / selectedCase.power.plus12) * 100,
    minus12: (powerUsage.minus12 / selectedCase.power.minus12) * 100,
    plus5: (powerUsage.plus5 / selectedCase.power.plus5) * 100,
  }

  const totalHP = modules.reduce((sum, m) => sum + m.hp, 0)
  const usedHP = totalHP
  const availableHP = selectedCase.hp * selectedCase.rows - usedHP

  const totalPrice = modules.reduce((sum, m) => sum + m.price, 0) + selectedCase.price

  const handleAddModule = (module: typeof eurorackModules[0]) => {
    // Find first available position
    for (let row = 0; row < selectedCase.rows; row++) {
      const occupiedHP = modules
        .filter((m) => m.position.row === row)
        .reduce((sum, m) => sum + m.hp, 0)
      if (occupiedHP + module.hp <= selectedCase.hp) {
        const newModule = {
          ...module,
          position: { row, hp: occupiedHP },
        }
        setModules([...modules, newModule])
        return
      }
    }
    addToast({
      type: "warning",
      title: "No space available",
      description: `Not enough HP in any row for ${module.name} (${module.hp} HP)`,
    })
  }

  const handleRemoveModule = (moduleId: string) => {
    setModules(modules.filter((m) => m.id !== moduleId))
  }

  const handleMoveModule = (moduleId: string, newPosition: { row: number; hp: number }) => {
    // Check for collisions
    const module = modules.find((m) => m.id === moduleId)
    if (!module) return

    const collision = modules.find(
      (m) => m.id !== moduleId && m.position.row === newPosition.row &&
        newPosition.hp < m.position.hp + m.hp &&
        newPosition.hp + module.hp > m.position.hp
    )

    if (!collision && newPosition.hp + module.hp <= selectedCase.hp) {
      setModules(modules.map((m) => m.id === moduleId ? { ...m, position: newPosition } : m))
    }
  }

  const handleAddToCart = () => {
    const configuration = {
      caseId: selectedCase.id,
      modules: modules.map((m) => ({
        id: m.id,
        productId: m.id,
        position: m.position,
      })),
    }
    addItem({
      productId: "eurorack-build",
      variantId: "custom",
      quantity: 1,
      configuration,
    })
    addToast({
      type: "success",
      title: "Added to cart",
      description: `Your custom Eurorack system (${totalHP} HP) has been added to cart for ${formatPrice(totalPrice)}.`,
    })
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <header className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] sticky top-16 z-[var(--z-sticky)]">
        <div className="container px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl lg:text-3xl text-[var(--color-fg-primary)]">
                Eurorack Configurator
              </h1>
              <p className="text-[var(--color-fg-secondary)] text-sm">
                Build your modular system — drag modules into the case
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-display font-bold text-2xl text-[var(--color-fg-primary)]">{formatPrice(totalPrice)}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">Total with case</p>
              </div>
              <Button size="lg" onClick={handleAddToCart} className="gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 lg:py-10">
        {/* Power Budget Bar */}
        <div className="mb-6">
          <Card className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Zap className="w-6 h-6 text-[var(--color-accent-amber)]" />
                  <div>
                    <p className="font-medium text-[var(--color-fg-primary)]">Power Budget</p>
                    <p className="text-sm text-[var(--color-fg-secondary)]">
                      +12V: {powerUsage.plus12}mA / {selectedCase.power.plus12}mA ({powerPercent.plus12.toFixed(0)}%) •
                      -12V: {powerUsage.minus12}mA / {selectedCase.power.minus12}mA ({powerPercent.minus12.toFixed(0)}%) •
                      +5V: {powerUsage.plus5}mA / {selectedCase.power.plus5}mA ({powerPercent.plus5.toFixed(0)}%)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => setShowPowerDetails(!showPowerDetails)}>
                    {showPowerDetails ? <HelpCircle className="w-4 h-4 mr-1" /> : <Zap className="w-4 h-4 mr-1" />}
                    {showPowerDetails ? "Hide Details" : "Show Details"}
                  </Button>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-[var(--color-fg-secondary)]">HP Used:</span>
                    <span className="font-bold text-[var(--color-fg-primary)]">{usedHP} / {selectedCase.hp * selectedCase.rows}</span>
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      availableHP < 0 ? "bg-[var(--color-error)]/20 text-[var(--color-error)]" :
                      availableHP < 20 ? "bg-[var(--color-accent-amber)]/20 text-[var(--color-accent-amber)]" :
                      "bg-[var(--color-success)]/20 text-[var(--color-success)]"
                    )}>
                      {availableHP >= 0 ? `${availableHP} HP free` : `${Math.abs(availableHP)} HP over`}
                    </span>
                  </div>
                </div>
              </div>

              {showPowerDetails && (
                <div className="mt-4 grid sm:grid-cols-3 gap-4">
                  <PowerBar label="+12V" used={powerUsage.plus12} max={selectedCase.power.plus12} color="var(--color-accent-coral)" />
                  <PowerBar label="-12V" used={powerUsage.minus12} max={selectedCase.power.minus12} color="var(--color-accent-cyan)" />
                  <PowerBar label="+5V" used={powerUsage.plus5} max={selectedCase.power.plus5} color="var(--color-accent-emerald)" />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Grid columns={{ base: 1, lg: 3 }} gap="lg">
          {/* Case & Rack */}
          <div className="lg:col-span-2 space-y-6">
            {/* Case Selector */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--color-fg-primary)]">Select Case</h3>
                  <Badge variant="outline">{selectedCase.hp} HP × {selectedCase.rows}U</Badge>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {eurorackCases.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={cn(
                        "flex-shrink-0 px-4 py-3 rounded-lg border-2 transition-all min-w-[160px] text-left",
                        selectedCase.id === c.id
                          ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5"
                          : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]"
                      )}
                    >
                      <p className="font-medium text-[var(--color-fg-primary)]">{c.name}</p>
                      <p className="text-sm text-[var(--color-fg-secondary)]">{c.hp} HP × {c.rows}U</p>
                      <p className="text-sm font-bold text-[var(--color-accent-cyan)]">{formatPrice(c.price)}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rack Visualization */}
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  {/* 3D View */}
                  <div className="aspect-[2/1] lg:aspect-[3/1] rounded-xl bg-[var(--color-bg-tertiary)] overflow-hidden">
                    <ThreeCanvas
                      className="w-full h-full"
                      camera={{ position: [0, 1.5, 4], fov: 40 }}
                      shadows
                    >
                      <StudioLighting intensity={1.2} preset="product" />
                      <CameraControls
                        enableDamping
                        dampingFactor={0.05}
                        autoRotate={modules.length === 0}
                        autoRotateSpeed={0.2}
                        minDistance={2}
                        maxDistance={10}
                        minPolarAngle={0.2}
                        maxPolarAngle={Math.PI / 2 - 0.1}
                      />
                      <Suspense fallback={<RackSkeleton />}>
                        <EurorackCase3D
                          caseConfig={selectedCase}
                          modules={modules}
                        />
                      </Suspense>
                    </ThreeCanvas>

                    {/* Empty state overlay */}
                    {modules.length === 0 && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                        <Box className="w-16 h-16 text-[var(--color-fg-muted)]/50 mb-4" />
                        <p className="text-[var(--color-fg-secondary)] mb-2">Add modules from the palette</p>
                        <p className="text-sm text-[var(--color-fg-muted)]">then drag to position them in the rack</p>
                      </div>
                    )}
                  </div>

                  {/* HP Grid Overlay (for drag positioning) */}
                  <HPGridOverlay
                    caseConfig={selectedCase}
                    modules={modules}
                    onDrop={handleMoveModule}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Palette */}
          <div className="lg:col-span-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="mb-4">
                <TabsTrigger value="modules" className="flex-1">Modules ({eurorackModules.length})</TabsTrigger>
                <TabsTrigger value="case" className="flex-1">Case</TabsTrigger>
              </TabsList>

              <TabsContent value="modules" className="h-[calc(100vh-300px)] overflow-y-auto">
                <ModulePalette
                  modules={eurorackModules}
                  onAddModule={handleAddModule}
                  onRemoveModule={handleRemoveModule}
                  disabledModules={modules.map((m) => m.id)}
                />
              </TabsContent>

              <TabsContent value="case" className="h-[calc(100vh-300px)] overflow-y-auto">
                <CaseSettings
                  selectedCase={selectedCase}
                  onChange={setSelectedCase}
                  modules={modules}
                  powerUsage={powerUsage}
                  powerPercent={powerPercent}
                />
              </TabsContent>
            </Tabs>
          </div>
        </Grid>
      </main>
    </div>
  )
}

function PowerBar({ label, used, max, color }: { label: string; used: number; max: number; color: string }) {
  const percent = Math.min((used / max) * 100, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-[var(--color-fg-secondary)]">{label}</span>
        <span className="font-medium text-[var(--color-fg-primary)]">{used}mA / {max}mA</span>
      </div>
      <div className="h-3 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <div className="flex justify-between text-xs text-[var(--color-fg-muted)]">
        <span>0</span>
        <span>{Math.round(percent)}%</span>
        <span>{max}mA</span>
      </div>
    </div>
  )
}

function ModulePalette({ modules, onAddModule, onRemoveModule, disabledModules }: { modules: typeof eurorackModules; onAddModule: (m: typeof eurorackModules[0]) => void; onRemoveModule: (id: string) => void; disabledModules: string[] }) {
  const typeColors = {
    vco: "bg-[var(--color-accent-coral)]/20 border-[var(--color-accent-coral)]",
    vcf: "bg-[var(--color-accent-cyan)]/20 border-[var(--color-accent-cyan)]",
    vca: "bg-[var(--color-accent-emerald)]/20 border-[var(--color-accent-emerald)]",
    env: "bg-[var(--color-accent-amber)]/20 border-[var(--color-accent-amber)]",
    lfo: "bg-[var(--color-accent-violet)]/20 border-[var(--color-accent-violet)]",
    seq: "bg-gradient-to-r from-[var(--color-accent-violet)]/20 to-[var(--color-accent-cyan)]/20 border-[var(--color-accent-violet)]",
    util: "bg-[var(--color-fg-muted)]/20 border-[var(--color-fg-muted)]",
  }

  const grouped = modules.reduce((acc, m) => {
    if (!acc[m.type]) acc[m.type] = []
    acc[m.type].push(m)
    return acc
  }, {} as Record<string, typeof eurorackModules>)

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([type, mods]) => (
        <div key={type} className="space-y-3">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-[var(--color-fg-secondary)] uppercase tracking-wider">
            <span className="w-2 h-2 rounded" style={{ backgroundColor: typeColors[type as keyof typeof typeColors]?.split(" ")[1]?.replace("border-", "") || "#666" }} />
            {type.toUpperCase()} ({mods.length})
          </h4>
          <div className="space-y-2">
            {mods.map((module) => (
              <ModulePaletteItem
                key={module.id}
                module={module}
                disabled={disabledModules.includes(module.id)}
                onAdd={onAddModule}
                onRemove={onRemoveModule}
                typeColor={typeColors[type as keyof typeof typeColors] || ""}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ModulePaletteItem({ module, disabled, onAdd, onRemove, typeColor }: { module: typeof eurorackModules[0]; disabled: boolean; onAdd: (m: typeof eurorackModules[0]) => void; onRemove: (id: string) => void; typeColor: string }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-disabled={disabled}
      onClick={() => !disabled && onAdd(module)}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onAdd(module)
        }
      }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border transition-all select-none",
        "hover:bg-[var(--color-bg-tertiary)]",
        disabled
          ? "cursor-default opacity-70 hover:border-[var(--color-border-strong)]"
          : "cursor-pointer hover:border-[var(--color-border-strong)]",
        typeColor
      )}
    >
      <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
        background: typeColor.replace("/20", "/40").replace("border-", "bg-"),
      }}>
        <Zap className="w-6 h-6" style={{ color: typeColor.replace("/20", "").replace("border-", "text-") }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-[var(--color-fg-primary)] truncate">{module.name}</span>
          <Badge variant="outline" className="text-xs">{module.hp} HP</Badge>
        </div>
        <p className="text-sm text-[var(--color-fg-secondary)] truncate">{module.description}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-bold text-[var(--color-fg-primary)]">{formatPrice(module.price)}</span>
        {disabled ? (
          <>
            <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />
            <Button
              size="sm"
              variant="outline"
              className="h-8 hover:border-[var(--color-error)] hover:text-[var(--color-error)]"
              onClick={(e) => { e.stopPropagation(); onRemove(module.id) }}
              aria-label={`Remove ${module.name} from case`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Button size="sm" variant="outline" className="h-8" onClick={(e) => { e.stopPropagation(); onAdd(module) }} aria-label={`Add ${module.name} to case`}>
            <Plus className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

function CaseSettings({ selectedCase, onChange, modules, powerUsage, powerPercent }: { selectedCase: EurorackCase; onChange: (c: EurorackCase) => void; modules: Module[]; powerUsage: PowerUsage; powerPercent: PowerPercent }) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-[var(--color-fg-primary)] mb-3">Case Options</h4>
        <div className="space-y-3">
          {eurorackCases.map((c) => (
            <label
              key={c.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer",
                selectedCase.id === c.id
                  ? "border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5"
                  : "border-[var(--color-border-default)] hover:border-[var(--color-border-strong)]"
              )}
            >
              <input
                type="radio"
                name="case"
                checked={selectedCase.id === c.id}
                onChange={() => onChange(c)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-[var(--color-fg-primary)]">{c.name}</p>
                  <Badge variant="outline" className="text-sm">{c.hp} HP × {c.rows}U</Badge>
                </div>
                <p className="text-sm text-[var(--color-fg-secondary)] mt-1">
                  +12V: {c.power.plus12}mA • -12V: {c.power.minus12}mA • +5V: {c.power.plus5}mA
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[var(--color-fg-primary)]">{formatPrice(c.price)}</p>
                <p className="text-xs text-[var(--color-fg-muted)]">+ {formatPrice(c.price - selectedCase.price)}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--color-border-subtle)] pt-6">
        <h4 className="font-semibold text-[var(--color-fg-primary)] mb-3">Power Supply Details</h4>
        <PowerBar label="+12V" used={powerUsage.plus12} max={selectedCase.power.plus12} color="var(--color-accent-coral)" />
        <PowerBar label="-12V" used={powerUsage.minus12} max={selectedCase.power.minus12} color="var(--color-accent-cyan)" />
        <PowerBar label="+5V" used={powerUsage.plus5} max={selectedCase.power.plus5} color="var(--color-accent-emerald)" />
      </div>

      <div>
        <h4 className="font-semibold text-[var(--color-fg-primary)] mb-3">Current Build</h4>
        <div className="space-y-2">
          {modules.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-3 bg-[var(--color-bg-tertiary)] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center bg-[var(--color-accent-cyan)]/20">
                  <Zap className="w-4 h-4 text-[var(--color-accent-cyan)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--color-fg-primary)] text-sm">{m.name}</p>
                  <p className="text-xs text-[var(--color-fg-muted)]">{m.hp} HP • Row {m.position.row + 1}</p>
                </div>
              </div>
              <span className="font-bold text-[var(--color-fg-primary)]">{formatPrice(m.price)}</span>
            </div>
          ))}
          {modules.length === 0 && (
            <p className="text-center text-[var(--color-fg-muted)] py-8">No modules added yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

// 3D Components
// Per-row height in meters — standard 3U = 128.5mm panel + rail allowance.
const ROW_HEIGHT = 0.133
const HP_M = 0.00508 // 1 HP = 5.08mm
const CASE_DEPTH = 0.2
const MODULE_DEPTH = 0.035

// Variant → accent panel tint. Three.js MeshStandardMaterial cannot resolve CSS
// var() strings (no DOM/color-name lookup at GL time), so these are token-derived
// hex values — each accent hue darkened toward the chassis base so the panel reads
// as a distinct subsystem without garish whole-PCB colour. Accent proper shows on
// the knob indicators/jacks the model already builds.
const MODULE_PANEL_TINT: Record<string, string> = {
  vco: "#08111a", // cyan-tinted
  vcf: "#120a1f", // violet-tinted
  vca: "#06140e", // emerald-tinted
  env: "#161005", // amber-tinted
  lfo: "#16080a", // coral-tinted
  seq: "#0a1418", // cyan-tinted (sequencer — display module)
  util: "#181a1f", // neutral muted
}

function EurorackCase3D({ caseConfig, modules }: { caseConfig: EurorackCase; modules: Module[] }) {
  // Case body — built once per case selection.
  const caseGroup = useMemo(() => {
    const g = new Group()
    const eurorack = createEurorackCase({
      hp: caseConfig.hp,
      rows: caseConfig.rows,
      height: ROW_HEIGHT * caseConfig.rows, // total interior height
      depth: CASE_DEPTH,
      railHeight: 0.008,
      railWidth: 0.008,
      screwSpacing: 0.0254,
      color: "#1a1a1a",
      metalness: 0.8,
      roughness: 0.3,
    })
    g.add(eurorack)
    return g
  }, [caseConfig])

  // Lay out modules inside the case. Case interior spans:
  //   x ∈ [-hpW/2, +hpW/2]   y ∈ [-rows*H/2, +rows*H/2]   (centered on origin)
  // row 0 → top, so row r maps to y = ((rows-1)/2 - r) * ROW_HEIGHT.
  // hp slot h (left edge) maps the module CENTER to x = (h + hp/2 - hpTotal/2) * HP_M.
  // The EurorackModuleModel places its panel front at local z ≈ MODULE_DEPTH (front
  // positive), so to make that panel sit just behind the front rail (~z 0.07 world)
  // and let the PCB/body recess into the case interior, the module origin goes to
  //   z = (front-rail z) − MODULE_DEPTH  ≈ 0.07 − 0.035 = 0.035.
  const caseHpW = caseConfig.hp * HP_M
  const moduleZ = 0.07 - MODULE_DEPTH
  return (
    <group>
      <primitive object={caseGroup} />
      {modules.map((m) => {
        const centerX = (m.position.hp + m.hp / 2 - caseConfig.hp / 2) * HP_M
        const centerY = ((caseConfig.rows - 1) / 2 - m.position.row) * ROW_HEIGHT
        return (
          <group key={m.id} position={[centerX, centerY, moduleZ]} rotation={[0, 0, (m.rotation ?? 0) * Math.PI / 180]}>
            <EurorackModuleModel
              variant={m.type as any}
              hp={m.hp}
              animated={false}
              panelColor={MODULE_PANEL_TINT[m.type] ?? "#1f2024"}
            />
          </group>
        )
      })}
      {/* Subtle floor reflection plane for grounding */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -(caseConfig.rows * ROW_HEIGHT) / 2 - 0.01, 0]} receiveShadow>
        <planeGeometry args={[caseHpW * 2.5, CASE_DEPTH * 4]} />
        <meshStandardMaterial color="#06070a" metalness={0.2} roughness={0.85} transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function HPGridOverlay({ caseConfig, modules, onDrop }: { caseConfig: EurorackCase; modules: Module[]; onDrop: (id: string, pos: { row: number; hp: number }) => void }) {
  const [dragId, setDragId] = useState<string | null>(null)
  const [hover, setHover] = useState<{ row: number; hp: number } | null>(null)
  const surfaceRef = useRef<HTMLDivElement | null>(null)

  // The overlay mirrors the rack as a percentage grid: `caseConfig.hp` columns ×
  // `caseConfig.rows` rows. Each module is an absolutely-positioned chip spanning
  // its HP width + 1/rows height, so the 2D overlay tracks the 3D layout exactly.
  // The surface stays pointer-events:none so camera orbit/passthrough works over
  // empty rack area; chip pointer-down captures the pointer on the surface so
  // move/up events route here (orbit paused for the drag) and snap to the nearest
  // free (row,hp) cell on release.
  const beginDrag = (e: React.PointerEvent, id: string) => {
    e.preventDefault()
    e.stopPropagation()
    setDragId(id)
    // Route all subsequent move/up to the surface regardless of pointer position.
    surfaceRef.current?.setPointerCapture(e.pointerId)
  }
  const endDrag = (e: React.PointerEvent) => {
    if (surfaceRef.current?.hasPointerCapture(e.pointerId)) {
      surfaceRef.current?.releasePointerCapture(e.pointerId)
    }
    if (dragId && hover) {
      const mod = modules.find((m) => m.id === dragId)
      if (mod && hover.hp + mod.hp <= caseConfig.hp) {
        onDrop(dragId, hover)
      }
    }
    setDragId(null)
    setHover(null)
  }
  const trackPointer = (e: React.PointerEvent) => {
    if (!dragId) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top
    const hpSlot = Math.floor((px / rect.width) * caseConfig.hp)
    const row = Math.floor((py / rect.height) * caseConfig.rows)
    setHover({
      row: Math.max(0, Math.min(caseConfig.rows - 1, row)),
      hp: Math.max(0, Math.min(caseConfig.hp - 1, hpSlot)),
    })
  }

  return (
    <div
      ref={surfaceRef}
      className="absolute inset-0"
      style={{ display: modules.length > 0 ? "block" : "none", pointerEvents: dragId ? "auto" : "none" }}
      onPointerMove={trackPointer}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="grid"
      aria-label="Eurorack rack grid — drag a module to reposition it"
    >
      {/* Drag-handle chips overlaid on each module so the 2D overlay matches 3D. */}
      {modules.map((m) => {
        const left = (m.position.hp / caseConfig.hp) * 100
        const top = (m.position.row / caseConfig.rows) * 100
        const width = (m.hp / caseConfig.hp) * 100
        const height = (1 / caseConfig.rows) * 100
        return (
          <button
            key={m.id}
            type="button"
            onPointerDown={(e) => beginDrag(e, m.id)}
            className="absolute rounded-sm border border-[var(--color-accent-cyan)]/40 bg-[var(--color-accent-cyan)]/10 cursor-grab active:cursor-grabbing touch-none hover:bg-[var(--color-accent-cyan)]/20 transition-colors"
            style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, pointerEvents: "auto" }}
            aria-label={`${m.name} — drag to reposition (row ${m.position.row + 1}, ${m.hp} HP)`}
            aria-grabbed={dragId === m.id}
          >
            <span className="block w-full h-full px-1 flex items-center justify-start text-[10px] font-medium text-[var(--color-fg-primary)]/80 truncate pointer-events-none">
              {m.name}
            </span>
          </button>
        )
      })}

      {/* Snap-target highlight while dragging. */}
      {dragId && hover && (() => {
        const mod = modules.find((m) => m.id === dragId)
        if (!mod) return null
        const left = (hover.hp / caseConfig.hp) * 100
        const top = (hover.row / caseConfig.rows) * 100
        const width = (mod.hp / caseConfig.hp) * 100
        const height = (1 / caseConfig.rows) * 100
        return (
          <div
            className="absolute rounded-sm border border-dashed border-[var(--color-accent-cyan)] bg-[var(--color-accent-cyan)]/5"
            style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%`, pointerEvents: "none" }}
            aria-hidden
          />
        )
      })()}
    </div>
  )
}

function RackSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[var(--color-bg-tertiary)]">
      <div className="animate-pulse w-3/4 h-1/2 bg-[var(--color-border-default)] rounded-xl" />
    </div>
  )
}