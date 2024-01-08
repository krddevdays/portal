import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{js,ts,jsx,tsx}'],
    plugins: [require('@tailwindcss/typography')],
}
export default config
