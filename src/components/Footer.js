"use client";
import Link from "next/link";
import { FiTwitter, FiYoutube, FiTwitch, FiMail } from "react-icons/fi";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0a0e27] border-t border-white/10 mt-auto">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#ff4655] to-[#e63946] rounded-lg flex items-center justify-center font-bold text-2xl">
                                SC
                            </div>
                            <div>
                                <div className="font-rajdhani font-bold text-2xl text-white">
                                    SoulCity Valorant League
                                </div>
                                <div className="text-sm text-gray-400">
                                    Premier Competitive Tournament
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm max-w-md">
                            Experience the ultimate Valorant competition with top teams battling for glory and prizes.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-rajdhani font-bold text-lg mb-4 text-white">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-400 hover:text-[#ff4655] transition-colors text-sm"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/teams"
                                    className="text-gray-400 hover:text-[#ff4655] transition-colors text-sm"
                                >
                                    Teams
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/streams"
                                    className="text-gray-400 hover:text-[#ff4655] transition-colors text-sm"
                                >
                                    Live Streams
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 className="font-rajdhani font-bold text-lg mb-4 text-white">
                            Connect
                        </h3>
                        <div className="flex gap-3">
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-[#ff4655] rounded-lg flex items-center justify-center transition-colors"
                                aria-label="Twitter"
                            >
                                <FiTwitter size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-[#ff4655] rounded-lg flex items-center justify-center transition-colors"
                                aria-label="YouTube"
                            >
                                <FiYoutube size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-[#ff4655] rounded-lg flex items-center justify-center transition-colors"
                                aria-label="Twitch"
                            >
                                <FiTwitch size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 bg-white/5 hover:bg-[#ff4655] rounded-lg flex items-center justify-center transition-colors"
                                aria-label="Email"
                            >
                                <FiMail size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-sm">
                        © {currentYear} SoulCity Valorant League. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <a href="#" className="hover:text-[#ff4655] transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-[#ff4655] transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
