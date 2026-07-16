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
| Undulatory / Snell / Snell·γ | 27.33″ | 36.35″ | c/n | ✗ |
| Special Relativity / Pauli / Rosser — water at rest | 15.45″ | 20.55″ | c/n | ✓ |
| Special Relativity / Pauli / Rosser — water in motion | 11.88″ | 15.80″ | c/n | ✗ |
| Geocentric | 15.45″ | 20.55″ | c/n | ✓ |

The frame-transform theories (SR, Pauli, Rosser) carry a **water at rest / water in
motion** toggle. Only the rest frame reproduces Airy. That frame is the one in
which the water, and the Earth carrying it, is at rest.

## Run

Open `index.html` in any modern browser. No build step, no dependencies.

## Files

    index.html        markup, controls, live math legend
    css/style.css     styling
    js/util.js        vectors, projection, canvas helpers
    js/theories.js    every theory's formula and predicted angles
    js/sky.js         orbital aberration scene
    js/tube.js        air-vs-water telescope scene
    js/main.js        state, controls, animation loop
    assets/           logo

## Constants

    c = 299,792.458 km/s      v_earth = 29.87 km/s      n_water = 1.33
    β = v/c = 9.96×10⁻⁵       α = arctan(β) = 20.55″     L_tube = 37 in

Angles are exaggerated on screen for visibility; the underlying values are fixed
by the formulas above and match a physical Airy telescope (plate drift ≈ 70.4 µm
for the 15.45″ ray).
