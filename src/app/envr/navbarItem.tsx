import React from "react";

interface NavbarItemProps {
  href: string;
  text: string;
  isActive: boolean;
  closeSidebar?: () => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  href,
  text,
  isActive,
  closeSidebar,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Prevent default anchor behavior
    if (closeSidebar) closeSidebar(); // Close the sidebar if provided
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`block font-inter text-sm md:text-[18px] transition-colors duration-300 ${
        isActive ? "text-black" : "text-[#979797] hover:text-black"
      }`}
      aria-current={isActive ? "page" : undefined} // Accessibility feature
    >
      {text}
    </a>
  );
};

export default NavbarItem;
