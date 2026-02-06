import { location } from '@shopware-ag/meteor-admin-sdk'
;(async () => {
  // Run bootstrap only in the hidden iframe
  if (location.is(location.MAIN_HIDDEN)) {
    const bootstrap = await import('./bootstrap.ts')
    bootstrap.default()
  } else {
    // Render the different locations for each iframe
    const runApp = await import('./app.ts')
    await runApp.default()
  }
})()
