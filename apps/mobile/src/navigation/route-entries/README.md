# Platform route entries

Expo route files in `src/app/(app)` re-export these platform-specific modules.
Metro selects `.web.tsx` for browser screens and `.tsx` for native screens.
Keep the platform-specific implementations outside `src/app`: Expo Router includes
all files in its route context, so direct `.web.tsx` route imports can bring the
DOM feature graph into native bundles even when runtime routing ignores them.

Native Home and app layout retain the starter implementation. Other routes return
to native Home until native feature screens are implemented.
