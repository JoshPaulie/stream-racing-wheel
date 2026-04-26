# Stream a Racing Wheel gamepad overlay on PC

> [!note]
> This is a fork for **personal use**, I have no intention of merging it back to the upstream project. Agentically extended to suit my needs. Please refrain from PRs or issues, but feel free to fork/clone/modify for your own use, as I have.
>
> Thank you to joetex for the upstream project which this is build upon

A React app that connects to a racing wheel gamepad (G920 or any compatible controller) and renders a visual overlay for streaming. Add it as a browser source in OBS — no extra cameras needed.

## How it works

The app has two modes that persist across page refreshes:

**Configure mode** — the default view on first load. Set up your source here:
- **Controller UI** — choose which controller to display: Wheel, Pedals, or Shifter
- **Gamepad** — select the connected gamepad to read input from
- **Max Rotation** — maximum steering wheel rotation in degrees (e.g. 900)
- **Show Wheel Button Presses** — toggle button press highlights on/off
- **Rebind Inputs** — map gamepad axes/buttons to the correct controls, invert axes, and replace any image asset with a custom URL

Click the controller preview to enter **overlay mode**.

**Overlay mode** — the controller UI is centered on a green screen, ready to be chroma-keyed in OBS. Click anywhere on the overlay to return to configure mode.

All settings (selected controller, rotation, overlay state, bindings, images) are saved to browser `localStorage` and restored automatically on refresh.

## OBS setup

Add one browser source per controller you want to show (e.g. one for wheel, one for pedals). Each source remembers its own settings independently as long as OBS keeps separate storage contexts per source.

## Install and run locally

Requires Node v18+.

```bash
npm install
npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173).
