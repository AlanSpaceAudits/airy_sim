# Stellar Aberration — Predictions, Air vs Water

A browser demonstration by the **Aether Cosmology Research Group**.

Full data and derivations:
[Google Sheet](https://docs.google.com/spreadsheets/d/1ztxCRJBzytxn6jICCrBjRUU67HcBrKAw_xMz9tPLZGw/edit?gid=0#gid=0)

Starlight aberrates by α = arctan(v/c) = 20.55″ before it reaches any telescope.
Airy (1871) filled a telescope with water and measured the same 20.55″. This sim
shows what each theory predicts the water column does to that ray, and what the
air-calibrated micrometer then reads.

## Two scenes

**Aberration — Air** (default). The orbital view: the Earth (helio) or the sky
(geo) carries velocity v⃗, and the apparent star direction tilts toward it by
α = arctan(v/c). The frame toggle changes which body moves, not the measured angle.

    ŝ_app = normalize( c·ŝ + v⃗ )        α = arctan(v/c) = 20.55″

**Water telescope** (every other theory). Side-by-side air tube and water tube.
Both receive the same 20.55″ ray; the water tube refracts it to the theory's
internal angle θ_int, and the micrometer reads θ_int · n. The travelling photon
moves at the light speed the theory needs in the water.

| Theory | θ_int | reads | speed in water | matches Airy |
|---|---|---|---|---|
| Emission | 15.45″ | 20.55″ | 1.33 c | angle ✓, speed ✗ (Foucault: 0.75 c) |
| Klinkerfues 1867 | 27.33″ | 36.35″ (n²α) | c/n | ✗ |
| Undulatory / Snell / Snell·γ | 27.33″ | 36.35″ | c/n | ✗ |
| Special Relativity / Pauli / Rosser / Franco — water at rest | 15.45″ | 20.55″ | c/n | ✓ |
| Special Relativity / Pauli / Rosser / Franco — water in motion | 11.88″ | 15.80″ | c/n | ✗ |
| Geocentric | 15.45″ | 20.55″ | c/n | ✓ |

The frame-transform theories (SR, Pauli, Rosser, Franco) carry a **water at rest / water in
motion** toggle. Only the rest frame reproduces Airy. That frame is the one in
which the water, and the Earth carrying it, is at rest.

## What "reading" means

**Reading** is the celestial arc the telescope's micrometer reports. It is not a direct
angle measurement. It is the star's sideways drift on the wire plate, divided by that
telescope's own scale to give an angle in the sky. Airy's 20.55″ is a reading.

**Internal angle (θ_int)** is the physical tilt the ray actually takes inside the tube. Airy
never measured it; it is the angle the ray would have to make to produce the observed
reading. In water, a 20.55″ reading requires 15.45″ inside.

**Aberration** is the incoming tilt of the starlight, θ_ext = arctan(v/c) = 20.55″, set by the
observer's velocity. The reading recovers that arc, and the internal angle is the refracted
angle inside the medium that, run through the scale, reproduces it.

**Micrometer × n.** The water plate is calibrated n times finer than air (Airy p.39:
air-equivalent length 27.8 in vs physical tube 37.0 in, ratio n). This is why a smaller
internal angle (15.45″) in water reads the same 20.55″ as air. That equal reading is Airy's
null result, and it exists only because of the × n scale. Strip the scale and the water tube
reports its raw internal angle (15.45″, 27.33″, or 11.88″), which differs from air's 20.55″.

## Run

Open `index.html` in any modern browser. No build step, no dependencies.

## Presentation

`airy_prezzie/airy.html` is a self-contained slide deck covering the experiment: what
aberration is, what Airy built and measured, what each theory predicted, and which frame
reproduces the reading. It carries a **Presentation / Simulation** toggle that runs the
simulation below in an isolated frame, so one file holds both.

Everything is inlined (fonts, logo, the full simulation), so it works offline from a phone
with no server and no network. Open `airy_prezzie/airy.html` directly.

    Presentation / Simulation   toggle at the top, or press S
    #sim                        opens straight into the simulation
    #12                         deep-links to a slide
    arrows / swipe              navigate      L  contents      F  fullscreen

The deck is generated from a separate source project and published here as a single built
file. Its build step re-reads the simulation from this repo and asserts the embedded copy is
byte-for-byte identical to the source, so simulation changes propagate to the deck.

## Files

    index.html        markup, controls, live math legend
    css/style.css     styling
    js/util.js        vectors, projection, canvas helpers
    js/theories.js    every theory's formula and predicted angles
    js/sky.js         orbital aberration scene
    js/tube.js        air-vs-water telescope scene
    js/main.js        state, controls, animation loop
    assets/           logo

    airy_prezzie/
      airy.html       the built deck, self-contained

    project_sources/  primary sources: the papers themselves
      pics/           page captures and figures

## Constants

    c = 299,792.458 km/s      v_earth = 29.87 km/s      n_water = 1.33
    β = v/c = 9.96×10⁻⁵       α = arctan(β) = 20.55″     L_tube = 37 in

Angles are exaggerated on screen for visibility; the underlying values are fixed
by the formulas above and match a physical Airy telescope (plate drift ≈ 70.4 µm
for the 15.45″ ray).
