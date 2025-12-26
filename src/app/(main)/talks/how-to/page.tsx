import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Стать спикером',
}

export default function TalksHowTo() {
    return (
        <div className="max-w-7xl sm:px-6 lg:px-8 mx-2 sm:mx-auto">
            <h1 className="text-lg leading-6 font-medium text-gray-900">
                Доклады
            </h1>
            <div className="mt-6">
                <div className="flex justify-center py-4">
                    <a
                        href="/cfp"
                        className="block p-4 bg-gradient-to-r from-[#b07ec5] to-[#55e3ca] text-white w-[300px] rounded-3xl text-center font-bold"
                    >
                        Подать доклад
                    </a>
                </div>

                <section className="mb-4">
                    <h3 className="font-bold">Содержание</h3>

                    <ul className="pl-4 list-disc">
                        <li>
                            <a
                                href="#topics"
                                className="underline hover:no-underline"
                            >
                                Темы
                            </a>
                        </li>
                        <li>
                            <a
                                href="#preparing-for-talk"
                                className="underline hover:no-underline"
                            >
                                Подготовка к выступлению
                            </a>

                            <ul className="pl-4 list-[circle]">
                                <li>
                                    <a
                                        href="#talk-stages"
                                        className="underline hover:no-underline"
                                    >
                                        Этапы
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#talk-info"
                                        className="underline hover:no-underline"
                                    >
                                        Необходимая информация
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#talk-presentation"
                                        className="underline hover:no-underline"
                                    >
                                        Презентация
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a
                                href="#contacts"
                                className="underline hover:no-underline"
                            >
                                Контакты
                            </a>
                        </li>
                    </ul>
                </section>

                <section className="mb-4">
                    <h2 id="topics" className="font-bold">
                        Темы
                    </h2>

                    <p>
                        Ниже приведен список тем, которые интересны нашему
                        сообществу:
                    </p>

                    <ul className="list-disc pl-4">
                        <li>Коммуникация и процессы</li>
                        <li>Архитектура</li>
                        <li>Инструменты разработки</li>
                        <li>Технологии</li>
                        <li>Производительность</li>
                        <li>DevOps</li>
                        <li>Тесты</li>
                    </ul>

                    <p>
                        Если ваш доклад не подпадает ни под одну тему, то все
                        равно подавайте заявку мы ее рассмотрим.
                    </p>
                </section>

                <section className="mb-4">
                    <h2 id="preparing-for-talk" className="font-bold">
                        Подготовка к выступлению
                    </h2>

                    <h3 id="talk-stages" className="font-bold">
                        Этапы
                    </h3>
                    <ol className="list-decimal pl-4 mb-4">
                        <li>
                            <p>Подача заявки</p>
                            <p>
                                Подробно опишите о чем хотите рассказать, можете
                                приложить какие угодно материалы, а так же
                                задать любые вопросы.
                            </p>
                        </li>
                        <li>
                            <p>Общение с программным комитетом</p>
                            <p>
                                Мы изучим вашу заявку, и свяжемся с вами в
                                течении нескольких дней и ответим вам либо на
                                почту (от{' '}
                                <a
                                    href="mailto:speakers@krd.dev"
                                    className="underline hover:no-underline"
                                >
                                    speakers@krd.dev
                                </a>
                                ), либо в телеграм.
                            </p>
                        </li>
                        <li>
                            <p>Принятие заявки</p>
                            <p>
                                Программный комитет принимает решение о принятии
                                доклада в программу.
                            </p>
                        </li>

                        <li>Подготовка к выступлению</li>
                    </ol>

                    <h3 id="talk-info" className="font-bold">
                        Необходимая информация
                    </h3>
                    <ul className="list-disc pl-4 mb-4">
                        <li>
                            <p>О вас</p>

                            <ul className="pl-4 list-[circle]">
                                <li>Фото</li>
                                <li>Название компании (Необязательно)</li>
                            </ul>
                        </li>
                        <li>
                            <p>О докладе</p>

                            <ul className="pl-4 list-[circle]">
                                <li>Название</li>
                                <li>Описание</li>
                            </ul>
                        </li>
                    </ul>

                    <h3 id="talk-presentation" className="font-bold">
                        Презентация
                    </h3>
                    <p className="mb-4">
                        Мы принимаем презентации в любых форматах, основные это:
                        Google Slides, PowerPoint, Keynote,{' '}
                        <a
                            href="https://shwr.me/"
                            className="underline hover:no-underline"
                        >
                            Shower
                        </a>
                        . Обязательно нужна версия в PDF для публикации на
                        сайте.
                    </p>

                    <h4 id="talk-presentation-advices" className="font-bold">
                        Советы по оформлению презентации:
                    </h4>
                    <ul className="mb-4">
                        <li>
                            <label>
                                <input type="checkbox" className="mr-1" />
                                <span>Титульный слайд</span>
                            </label>

                            <ul className="pl-4">
                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>Название доклада</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>Информация о спикере</span>
                                    </label>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <label>
                                <input type="checkbox" className="mr-1" />
                                <span>
                                    Все слайды пронумерованы. Лучшее
                                    местоположение номеров любой верхний угол
                                </span>
                            </label>
                        </li>

                        <li>
                            <label>
                                <input type="checkbox" className="mr-1" />
                                <span>Код на слайдах</span>
                            </label>

                            <ul className="pl-4">
                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>
                                            Используется{' '}
                                            <a href="https://fonts.google.com/?query=mono">
                                                моноширинный шрифт
                                            </a>
                                            . Например, Fira Code, JetBrains
                                            Mono, Roboto Mono
                                        </span>
                                    </label>
                                </li>

                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>Есть подсветка синтаксиса</span>
                                    </label>
                                </li>

                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>
                                            Желательно используется именно
                                            текст, а не скриншот
                                        </span>
                                    </label>
                                </li>
                            </ul>
                        </li>

                        <li>
                            <label>
                                <input type="checkbox" className="mr-1" />
                                <span>Последний слайд</span>
                            </label>

                            <ul className="pl-4">
                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>Контакты автора</span>
                                    </label>
                                </li>
                                <li>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="mr-1"
                                        />
                                        <span>
                                            Ссылки на материалы. Лучше QR-код на
                                            документ со всеми ссылками, либо же
                                            просто отдельный слайд с ссылками.
                                        </span>
                                    </label>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 id="contacts" className="font-bold">
                        Контакты
                    </h2>
                    <p>
                        Если остались вопросы вы можете обратиться к{' '}
                        <Link
                            href="/team"
                            className="underline hover:no-underline"
                        >
                            организаторам
                        </Link>{' '}
                        или написать на почту.
                    </p>
                </section>
            </div>
        </div>
    )
}
