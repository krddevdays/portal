import {
    MaskitoOptions,
    MaskitoPreprocessor,
    maskitoTransform,
} from '@maskito/core'
import {
    maskitoCaretGuard,
    maskitoPrefixPostprocessorGenerator,
} from '@maskito/kit'

const prefix = '+7 '

export const phoneMaskOptions = {
    mask: [
        '+',
        '7',
        ' ',
        '(',
        '9',
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
    ],
    // non-removable country prefix
    postprocessors: [maskitoPrefixPostprocessorGenerator(prefix)],
    preprocessors: [
        // Avoids to put 8 as prefix
        createAvoidOfEightPrefixPreprocessor(),
        // // Allows to insert complete phone number
        createCompletePhoneInsertionPreprocessor(),
    ],
    plugins: [
        // Forbids to put caret before non-removable country prefix
        // But allows to select all value!
        maskitoCaretGuard((value, [from, to]) => [
            from === to ? prefix.length : 0,
            value.length,
        ]),
    ],
} satisfies MaskitoOptions

function createAvoidOfEightPrefixPreprocessor(): MaskitoPreprocessor {
    const trimPrefix = (value: string): string =>
        value.replace(/^(\+?7?\s?8?)\s?/, '')

    return ({ elementState, data }) => {
        const { value, selection } = elementState

        if (data.length === 1 && data !== '9' && trimPrefix(value) === '') {
            return {
                elementState: {
                    selection,
                    value: '',
                },
                data: prefix,
            }
        }

        return { elementState, data }
    }
}

function createCompletePhoneInsertionPreprocessor(): MaskitoPreprocessor {
    const trimPrefix = (value: string): string =>
        value.replace(/^(\+?7?\s?8?\(?9?)\s?/, '')
    const countDigits = (value: string): number => clearPhone(value).length

    return ({ elementState, data }) => {
        const { value, selection } = elementState

        return {
            elementState: {
                selection,
                value: countDigits(value) > 11 ? trimPrefix(value) : value,
            },
            data: countDigits(data) >= 11 ? trimPrefix(data) : data,
        }
    }
}

export const clearPhone = (value: string): string => value.replace(/\D/g, '')

export const validatePhone = (value: string): boolean => {
    const digits = clearPhone(value)
    return digits.length === 11 && digits[0] === '7' && digits[1] === '9'
}

export const formatPhone = (value: string): string => {
    return maskitoTransform(value, phoneMaskOptions)
}
