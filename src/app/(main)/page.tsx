import Image from 'next/image'

import heroImage from './hero.jpg'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Некоммерческое ИТ-сообщество Краснодара',
    description:
        'Создано чтобы аккумулировать знания и опыт, поддерживать специалистов из сферы информационных технологий и создавать для них благоприятную среду',
}

export default function Main() {
    return (
        <main className="relative">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
                    <div className="absolute inset-0">
                        <Image
                            loading="lazy"
                            placeholder="blur"
                            src={heroImage}
                            alt=""
                            fill
                            sizes="100vw"
                            style={{
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                        />
                        <div className="absolute inset-0 bg-indigo-700 mix-blend-multiply" />
                    </div>
                    <div className="relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8">
                        <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                            <span className="block text-white">
                                Некоммерческое ИТ-сообщество
                            </span>
                            <span className="block text-indigo-200">
                                Краснодара
                            </span>
                        </h1>
                        <p className="mt-6 max-w-lg mx-auto text-center text-xl text-indigo-200 sm:max-w-3xl">
                            Создано чтобы аккумулировать знания и опыт,
                            поддерживать специалистов из сферы информационных
                            технологий и создавать для них благоприятную среду
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
