import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from "@carbon/icons-react";

interface ScrollableContainerProps {
	children: React.ReactNode;
	className?: string;
}

export const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children, className = '' }) => {
	const [showNavigation, setShowNavigation] = useState(false);
	const [canScrollLeft, setCanScrollLeft] = useState(false);
	const [canScrollRight, setCanScrollRight] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const checkScroll = () => {
		if (containerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
			setCanScrollLeft(scrollLeft > 0);
			setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
			setShowNavigation(scrollWidth > clientWidth);
		}
	};

	useEffect(() => {
		const handleResize = () => {
			checkScroll();
		};

		window.addEventListener('resize', handleResize);
		checkScroll(); // Initial check

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	const scroll = (direction: 'left' | 'right') => {
		if (containerRef.current) {
			const scrollAmount = 200;
			const newScrollLeft = direction === 'left'
				? containerRef.current.scrollLeft - scrollAmount
				: containerRef.current.scrollLeft + scrollAmount;

			containerRef.current.scrollTo({
				left: newScrollLeft,
				behavior: 'smooth'
			});
		}
	};

	return (
		<div className="relative flex items-center">
			{showNavigation && canScrollLeft && (
				<button
					onClick={() => scroll('left')}
					className="absolute left-0 z-10 p-1 bg-white shadow-md rounded-full"
					aria-label="Scroll left"
				>
					<ChevronLeft className="w-5 h-5" />
				</button>
			)}

			<div
				ref={containerRef}
				className={`flex overflow-x-auto hide-scrollbar whitespace-nowrap scroll-smooth ${className}`}
				onScroll={checkScroll}
			>
				{children}
			</div>

			{showNavigation && canScrollRight && (
				<button
					onClick={() => scroll('right')}
					className="absolute right-0 z-10 p-1 bg-white shadow-md rounded-full -mr-3"
					aria-label="Scroll right"
				>
					<ChevronRight className="w-5 h-5" />
				</button>
			)}
		</div>
	);
};
