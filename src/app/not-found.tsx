import Link from 'next/link'

export const dynamic = 'force-static'

export default function NotFound() {
    return (
        <div className="min-h-screen-safe bg-white flex flex-col justify-center items-center space-y-4">
            <h1 className="font-semibold">Страница не найдена :-(</h1>
            <p>Пошли на главную?</p>
            <Link href="/">Пошли!</Link>
        </div>
    )
}
