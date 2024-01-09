'use client'

import * as React from 'react'

import { Input, InputProps } from '@/components/ui/input'
import { MaskitoElementPredicate, MaskitoOptions } from '@maskito/core'
import { useMergedRef } from '@mantine/hooks'
import { useMaskito } from '@maskito/react'

export interface MaskedInputProps extends InputProps {
    options?: MaskitoOptions | undefined
    elementPredicate?: MaskitoElementPredicate | undefined
}

const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
    ({ onChange, options, elementPredicate, ...props }, ref) => {
        const maskedInputRef = useMaskito({ options, elementPredicate })

        const mergedRef = useMergedRef(maskedInputRef, ref)

        return <Input ref={mergedRef} {...props} onInput={onChange} />
    }
)
MaskedInput.displayName = 'MaskedInput'

export { MaskedInput }
