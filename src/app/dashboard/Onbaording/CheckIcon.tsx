import React from 'react'

const CheckIcon = (props: any) => {
    return (
        <>
            {props.value === "success" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect width="16" height="16" fill="white" />
                <path d="M8 1C6.61553 1 5.26216 1.41054 4.11101 2.17971C2.95987 2.94888 2.06266 4.04213 1.53285 5.32122C1.00303 6.6003 0.86441 8.00776 1.13451 9.36563C1.4046 10.7235 2.07129 11.9708 3.05026 12.9497C4.02922 13.9287 5.2765 14.5954 6.63437 14.8655C7.99224 15.1356 9.3997 14.997 10.6788 14.4672C11.9579 13.9373 13.0511 13.0401 13.8203 11.889C14.5895 10.7378 15 9.38447 15 8C15 6.14348 14.2625 4.36301 12.9497 3.05025C11.637 1.7375 9.85652 1 8 1ZM7 10.7954L4.5 8.2954L5.2953 7.5L7 9.2046L10.705 5.5L11.5029 6.29295L7 10.7954Z" fill="#57CC99" />
            </svg>}
            {props.value === "error" && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect width="16" height="16" fill="white" />
                <path d="M8 1C4.15 1 1 4.15 1 8C1 11.85 4.15 15 8 15C11.85 15 15 11.85 15 8C15 4.15 11.85 1 8 1ZM7.45 4H8.55V9.5H7.45V4ZM8 12.5C7.6 12.5 7.25 12.15 7.25 11.75C7.25 11.35 7.6 11 8 11C8.4 11 8.75 11.35 8.75 11.75C8.75 12.15 8.4 12.5 8 12.5Z" fill="#BF3636" />
            </svg>}
            {props.value === "process" && <img src='/hourglass.png' alt='process' className='w-l h-l' />}
        </>
    )
}

export default CheckIcon