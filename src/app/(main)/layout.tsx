import * as React from 'react'
import Link from 'next/link'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white flex flex-col">
            <header className="bg-indigo-600">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="w-full py-6 flex items-center justify-between border-b border-indigo-500 lg:border-none">
                        <div className="flex items-center">
                            <Link
                                href="/"
                                className="text-white font-medium font-mono"
                            >
                                krd.dev
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>
            <div className="mt-12 flex-grow">{children}</div>
            <footer className="bg-white">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        {externalLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-gray-400 hover:text-gray-500"
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <span className="sr-only">{item.name}</span>
                                <item.icon className="h-6" aria-hidden="true" />
                            </a>
                        ))}
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-gray-400">
                            krd.dev
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

const externalLinks = [
    {
        name: 'Telegram',
        href: 'https://t.me/krddevdays',
        icon: function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.6 6.8c-.2 1.6-.8 5.4-1.1 7.2-.1.7-.4 1-.7 1-.6.1-1-.4-1.6-.8-.9-.6-1.4-.9-2.2-1.5-1-.7-.3-1 .2-1.6.1-.2 2.7-2.5 2.8-2.7v-.2c-.1-.1-.1 0-.2 0s-1.5.9-4.2 2.8c-.4.3-.8.4-1.1.4-.4 0-1-.2-1.6-.4-.6-.2-1.1-.3-1.1-.7 0-.2.3-.4.7-.6 2.9-1.3 4.9-2.1 5.8-2.5 2.8-1 3.4-1.2 3.8-1.2.1 0 .3 0 .4.1.1.1.1.2.1.3v.4z"
                        clipRule="evenodd"
                    />
                </svg>
            )
        },
    },
    {
        name: 'VK',
        href: 'https://vk.com/krddevdays',
        icon: function VKIcon(props: React.SVGProps<SVGSVGElement>) {
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M20.6 3.4C19.2 2 16.9 2 12.4 2h-.8C7.1 2 4.8 2 3.4 3.4 2 4.8 2 7.1 2 11.6v.8c0 4.5 0 6.8 1.4 8.2C4.8 22 7.1 22 11.6 22h.8c4.5 0 6.8 0 8.2-1.4 1.4-1.4 1.4-3.7 1.4-8.2v-.8c0-4.5 0-6.8-1.4-8.2zm-2.3 12.8h-1.5c-.6 0-.7-.4-1.7-1.4-.9-.8-1.2-.9-1.5-.9-.3 0-.4.1-.4.5v1.3c0 .4-.1.6-1 .6-1.5 0-3.2-.9-4.4-2.7C6 11 5.5 9 5.5 8.7c0-.2.1-.4.5-.4h1.5c.4 0 .5.2.7.6.7 2.1 1.9 3.9 2.4 3.9.2 0 .3-.1.3-.6V10c-.1-1-.6-1.1-.6-1.4 0-.2.1-.3.4-.3H13c.3 0 .4.2.4.5v2.9c0 .3.1.4.2.4.2 0 .3-.1.7-.4 1.1-1.2 1.8-3 1.8-3 .1-.2.3-.4.6-.4H18c.4 0 .5.2.4.5-.2.8-2 3.4-2 3.4-.2.2-.2.4 0 .6.2.2.7.6 1 1.1.6.7 1.1 1.3 1.2 1.7.3.4.1.6-.3.6z"
                        clipRule="evenodd"
                    />
                </svg>
            )
        },
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/c/krddevdays',
        icon: function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
            return (
                <svg fill="currentColor" viewBox="0 0 33 24" {...props}>
                    <path d="M30 5.12a3.55 3.55 0 00-2.55-2.52C25.22 2 16.29 2 16.29 2s-8.94 0-11.17.6A3.56 3.56 0 002.6 5.12 37 37 0 002 12a37 37 0 00.6 6.88 3.56 3.56 0 002.52 2.52c2.23.6 11.17.6 11.17.6s8.93 0 11.16-.6A3.55 3.55 0 0030 18.88a37 37 0 00.6-6.88 37 37 0 00-.6-6.88zM13.43 16.29V7.71L20.85 12z" />
                </svg>
            )
        },
    },
    {
        name: 'GitHub',
        href: 'https://github.com/krddevdays',
        icon: function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
            return (
                <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                    <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                    />
                </svg>
            )
        },
    },
]
