import * as React from 'react';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: any;
        }
    }
}

declare module 'react' {
    interface FormEvent<T = Element> {
        preventDefault(): void;
        stopPropagation(): void;
        target: T;
    }

    interface ChangeEvent<T = Element> {
        target: T & {
            value: string;
            checked?: boolean;
        };
    }
} 