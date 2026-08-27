import {
  CarIcon,
  BusIcon,
  HomeIcon,
  CoffeeIcon,
  Building2Icon,
  ChurchIcon,
  RadioTowerIcon,
} from "lucide-react"

const ENVIRONMENTS = [
  {
    icon: CarIcon,
    name: "Cars & Sedans",
    tagline: "Cabin Acoustics & Custom Fitment",
    description: "Door component staging, under-seat active subs, trunk box fabrications, and butyl damping.",
  },
  {
    icon: BusIcon,
    name: "Buses & Heavy Vehicles",
    tagline: "High-Output Passenger Audio",
    description: "Distributed multi-speaker roof lines, high-headroom amplifiers, and engine noise suppression.",
  },
  {
    icon: RadioTowerIcon,
    name: "Auto Rickshaws",
    tagline: "Custom High-SPL Pods",
    description: "Custom sealed fiberglass/wood pod fabrication, weather-resistant terminals, and open-air tuning.",
  },
  {
    icon: HomeIcon,
    name: "Home Theatres & Living Rooms",
    tagline: "Cinematic Surround & Calibration",
    description: "Multi-channel receiver setup, dedicated subwoofer low-end calibration, and concealed conduit wiring.",
  },
  {
    icon: CoffeeIcon,
    name: "Cafés & Restaurants",
    tagline: "Balanced Multi-Zone Background",
    description: "Even acoustic coverage across dining and outdoor seating areas without harsh conversational hot-spots.",
  },
  {
    icon: Building2Icon,
    name: "Commercial Spaces & Auditoriums",
    tagline: "Public Address & Speech Clarity",
    description: "Multi-zone PA systems, vocal projection microphones, and acoustic zoning for retail and halls.",
  },
]

export function EnvironmentsSection() {
  return (
    <section aria-labelledby="environments-heading" className="border-b py-16 sm:py-20">
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            Environments Served
          </p>
          <h2
            id="environments-heading"
            className="font-display mt-1.5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
          >
            Acoustics engineered for the physics of each space.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Vehicle cabins, dining rooms, and commercial halls reflect sound in fundamentally different ways. We tailor power, dispersion, and crossover frequencies to match the exact environment.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ENVIRONMENTS.map((env) => {
            const Icon = env.icon
            return (
              <div
                key={env.name}
                className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-2xs transition-all hover:border-ring/40"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-muted/40 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{env.name}</h3>
                      <p className="text-[11px] font-medium text-primary">{env.tagline}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {env.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
