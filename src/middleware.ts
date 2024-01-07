import { NextRequest, NextResponse } from 'next/server'

const metricaSrc = [
    'https://mc.yandex.ru',
    'https://mc.yandex.az',
    'https://mc.yandex.by',
    'https://mc.yandex.co.il',
    'https://mc.yandex.com',
    'https://mc.yandex.com.am',
    'https://mc.yandex.com.ge',
    'https://mc.yandex.com.tr',
    'https://mc.yandex.ee',
    'https://mc.yandex.fr',
    'https://mc.yandex.kg',
    'https://mc.yandex.kz',
    'https://mc.yandex.lt',
    'https://mc.yandex.lv',
    'https://mc.yandex.md',
    'https://mc.yandex.tj',
    'https://mc.yandex.tm',
    'https://mc.yandex.ua',
    'https://mc.yandex.uz',
    'https://mc.webvisor.com',
    'https://mc.webvisor.org',
    'https://yastatic.net',
].join(' ')

const vkSrc = 'https://top-fwz1.mail.ru'

export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64')

    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' ${vkSrc} ${metricaSrc} 'nonce-${nonce}' 'strict-dynamic';
    style-src 'self' 'unsafe-inline';
    connect-src 'self' ${vkSrc} ${metricaSrc};
    child-src 'self' blob: ${vkSrc} ${metricaSrc};
    frame-src 'self' blob: ${vkSrc} ${metricaSrc};
    img-src 'self' blob: data: ${vkSrc} ${metricaSrc};
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
`
    // Replace newline characters and spaces
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim()

    const requestHeaders = new Headers(request.headers)

    requestHeaders.set('x-nonce', nonce)

    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })

    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue
    )

    return response
}

export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
            missing: [
                { type: 'header', key: 'next-router-prefetch' },
                { type: 'header', key: 'purpose', value: 'prefetch' },
            ],
        },
    ],
}
