"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const leftLinks = [
        { href: "/", label: "Home" },
        { href: "/teams", label: "Teams" },
    ];

    const rightLinks = [
        { href: "/bracket", label: "Bracket" },
        { href: "/streams", label: "Streams" },
    ];

    const isActive = (path) => pathname === path;

    const NavLink = ({ href, label }) => (
        <Link href={href} className="relative group">
            <span className={`font-rajdhani font-medium text-lg tracking-wide transition-colors duration-300 ${isActive(href)
                ? "text-blue-600"
                : "text-gray-300 group-hover:text-white"
                }`}>
                {label}
            </span>
            {isActive(href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-blue-600"></span>
            )}
        </Link>
    );

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b-2 border-blue-700 h-20 flex items-center justify-center">
            <div className="flex items-center gap-8">
                {/* Left Navigation Links */}
                <nav className="flex items-center gap-8">
                    {leftLinks.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </nav>

                {/* Left Vertical Divider */}
                <div className="h-10 w-[2px] bg-blue-700"></div>

                {/* Centered Logo */}
                <Link href="/" className="relative group">
                    <div className="relative w-48 h-12 transition-transform duration-300 group-hover:scale-105">
                        <Image
                            src="/images/soulcity-new-logo.png"
                            alt="SoulCity Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Right Vertical Divider */}
                <div className="h-10 w-[2px] bg-blue-700"></div>

                {/* Right Navigation Links */}
                <nav className="flex items-center gap-8">
                    {rightLinks.map((link) => (
                        <NavLink key={link.href} {...link} />
                    ))}
                </nav>
            </div>
        </header>
    );
}
