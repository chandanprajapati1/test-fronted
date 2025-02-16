import React, { useEffect } from 'react';

const Modal = ({ isOpen, onClose, children }:any) => {
	useEffect(() => {
		if (isOpen) {
			// Save current scroll position and prevent scrolling
			const scrollY = window.scrollY;
			document.body.style.position = 'fixed';
			document.body.style.top = `-${scrollY}px`;
			document.body.style.width = '100%';
		} else {
			// Restore scroll position when modal closes
			const scrollY = document.body.style.top;
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
			window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
		}

		// Cleanup function
		return () => {
			document.body.style.position = '';
			document.body.style.top = '';
			document.body.style.width = '';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto">
			<div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>

			<div className="flex min-h-full items-center justify-center p-4">
				<div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
					<button
						onClick={onClose}
						className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
					>
						×
					</button>
					{children}
				</div>
			</div>
		</div>
	);
};