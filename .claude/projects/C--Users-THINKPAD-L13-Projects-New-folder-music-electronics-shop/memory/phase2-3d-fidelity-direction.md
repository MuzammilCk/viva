---
name: phase2-3d-fidelity-direction
description: Chosen 3D fidelity + interaction direction for Phase 2 (drives Phases 2, 5)
metadata:
  type: project
---

Phase 2 (3D Audio Hardware Engine & Models) direction — chosen by user 2026-08-15:

FIDELITY: **Cybernetic-matched stylized** (NOT photoreal PBR).
- Lacquered panels → MeshPhysicalMaterial with clearcoat + clearcoatRoughness.
- Brushed anodized metal → anisotropy where applicable.
- Emissive HUD screens/LEDs → emissive + emissiveIntensity, cyan/amber, with a scanline overlay (reuse .bg-scanline concept in-3D via a screen texture/shader).
- Glowing knob rings + status LEDs matching the accent palette (--color-accent-cyan/amber/coral/emerald/violet via THREE.Color).
- Goal: cohesive with the cybernetic UI language, fast to render. Avoid full PBR texture-map realism.

INTERACTION: **Interactive now** (NOT visual-only, NOT auto-animate).
- Wire the existing stubbed callbacks: onKnobTurn (drag-rotate), onKeyPress (click+animate, fire MIDI note+velocity), onFaderMove (drag-slide → 0..1).
- Pads light on hover. Knobs rotate on drag. This is groundwork for the Phase 5 3D configurator.
- Real value ranges: knobs/faders emit 0..1, keys emit MIDI note numbers + velocity.

Why: user explicitly chose these two via AskUserQuestion; they cohere (stylized + interactive = showroom that responds).

How to apply: when uplifting geometry/index.ts materials and the 4 product models (SynthesizerModel, MidiControllerModel, AudioInterfaceModel, EurorackModuleModel), keep MeshPhysicalMaterial (not MeshStandardMaterial) for chassis/panels; add emissive materials for screens/LEDs; wire pointer events (onPointerDown/Move/Up) on knobs/keys/faders to call the existing callback props. See [[repo-root-is-outer]].
