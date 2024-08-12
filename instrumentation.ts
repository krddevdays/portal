import * as Sentry from '@sentry/nextjs'

export function register() {
    Sentry.init({
        dsn: 'https://d2d5c188ea43ce985bbf00dfb9748990@o260762.ingest.sentry.io/4506539734859777',
        tracesSampleRate: 0.1,
    })
}
