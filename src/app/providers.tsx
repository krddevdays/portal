'use client'

import { IntlProvider } from 'react-intl'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <IntlProvider locale="ru" timeZone="Europe/Moscow">
                {children}
            </IntlProvider>
        </>
    )
}
