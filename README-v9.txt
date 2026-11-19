TradeForge v9 changes:
1. Net at Active Stop is now a headline result card and updates when current/trailed stop changes.
2. Enter Manual Exit Price in Real-Fill Risk & Profit; Net at Manual Exit shows estimated P/L. The exit price is saved locally and syncs through the existing v8 cloud snapshot when enabled. Send to Trade Review copies manual exit price. Fill actual fees in Trade Review for final broker-accurate P/L.
3. Net Risk : Reward moved from headline cards to Actual Execution Breakdown.

DEPLOY:
Upload ONLY index.html and service-worker.js to the existing GitHub Pages repo root, replacing both. Do not delete icon.svg or manifest.webmanifest. Keep your current Supabase project/database unchanged; v9 uses the v8 auth/project settings and schema.

After uploading, refresh TradeForge or restart the installed PWA to load the new service worker. Existing saved positions remain in localStorage. Export a backup before updating if desired.

The backend sync feature requires the Supabase setup from v8 and is not activated simply by uploading these files.
