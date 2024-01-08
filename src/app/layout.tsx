import type { Metadata } from 'next'
import Script from 'next/script'
import { stripIndent } from 'common-tags'
import { headers } from 'next/headers'
import { Providers } from './providers'

import './globals.css'
import './legacy.css'

export const metadata: Metadata = {
    title: { default: 'krd.dev', template: '%s — krd.dev' },
    metadataBase: new URL('https://krd.dev'),
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const nonce = headers().get('x-nonce')

    return (
        <html lang="ru">
            <Script
                id="vk-ads-pixel"
                nonce={nonce ?? undefined}
                dangerouslySetInnerHTML={{
                    __html: stripIndent`
                        var _tmr = _tmr || (_tmr = []);
                        _tmr.push({id: "3469783", type: "pageView", start: (new Date()).getTime()});
                        (function (d, w, id) {
                          if (d.getElementById(id)) return;
                          var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
                          ts.src = "https://top-fwz1.mail.ru/js/code.js";
                          var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
                          if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
                        })(document, window, "tmr-code");
                        `,
                }}
            />
            <Script
                id="ym-counter"
                nonce={nonce ?? undefined}
                dangerouslySetInnerHTML={{
                    __html: stripIndent`
                       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                       m[i].l=1*new Date();
                       for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                       k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                    
                       ym(53951545, "init", {
                            clickmap:true,
                            trackLinks:true,
                            accurateTrackBounce:true,
                            webvisor:true
                       });
                    `,
                }}
            />
            <body className={'antialiased font-sans'}>
                <noscript>
                    <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://mc.yandex.ru/watch/53951545"
                            style={{
                                position: 'absolute',
                                left: '-9999px',
                            }}
                            alt=""
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="https://top-fwz1.mail.ru/counter?id=3469783;js=na"
                            style={{
                                position: 'absolute',
                                left: '-9999px',
                            }}
                            alt=""
                        />
                    </div>
                </noscript>
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
