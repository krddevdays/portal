'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        Sentry.captureException(error)
    }, [error])

    return (
        <html>
            <body>
                <h1>Что-то пошло не так</h1>
                <button onClick={() => reset()}>Попробовать еще раз?</button>
            </body>
        </html>
    )
}
