import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: 'https://d2d5c188ea43ce985bbf00dfb9748990@o260762.ingest.sentry.io/4506539734859777',
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    tracesSampleRate: 0.1,
    profilesSampleRate: 1.0,

    integrations: [
        Sentry.replayIntegration({
            maskAllText: false,
            maskAllInputs: false,
            blockAllMedia: false,
        }),
    ],
})
