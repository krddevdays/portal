import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function RouterListener() {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        ym(53951545, 'hit', window.location.toString())
        _tmr.push({ type: 'pageView' })
    }, [pathname, searchParams])

    return null
}
