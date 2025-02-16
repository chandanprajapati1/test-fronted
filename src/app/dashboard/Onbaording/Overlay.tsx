import React, { ReactNode } from 'react'

const Overlay: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50">
            <div>
                {children}
            </div>
        </div>
    )
}

export default Overlay
