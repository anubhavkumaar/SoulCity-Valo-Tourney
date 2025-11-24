"use client";
import { useState } from "react";
import { useTournament } from "@/context/TournamentContext";

export default function RegisterPage() {
  const { registerPlayer, siteConfig, loading } = useTournament();
  const [formData, setFormData] = useState({
    name: "",
    discordId: "",
    valorantId: "",
    currentRank: "",
    peakRank: "",
    youtubeLink: "",
  });
  const [status, setStatus] = useState("idle"); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState("");

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading...</div>;

  // Check if page is enabled
  if (siteConfig && !siteConfig.showRegister) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#0f1923] text-white text-center p-4">
            <h1 className="text-4xl font-black uppercase text-[#ff4655] mb-4">Registration Closed</h1>
            <p className="text-gray-400">Player registration is currently unavailable.</p>
        </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    // Basic validation
    if (!formData.name || !formData.discordId || !formData.valorantId || !formData.currentRank || !formData.peakRank) {
      setErrorMessage("Please fill in all required fields.");
      setStatus("error");
      return;
    }

    try {
      const result = await registerPlayer(formData);
      if (result.success) {
        setStatus("success");
        setFormData({
          name: "",
          discordId: "",
          valorantId: "",
          currentRank: "",
          peakRank: "",
          youtubeLink: "",
        });
      } else {
        setErrorMessage("Failed to register. Please try again.");
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1923] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-[#1c2733] p-8 rounded-lg border border-white/10 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff4655] to-[#0f1923]"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#ff4655]/5 rounded-full blur-2xl"></div>

        <div>
          <h2 className="mt-2 text-center text-3xl font-black uppercase tracking-tight text-white">
            Player Registration
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Join the SoulCity Valorant Protocol
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-8 space-y-4 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 text-green-500 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Registration Successful!</h3>
            <p className="text-gray-400">Thank you for registering. Good luck, Agent.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-4 text-[#ff4655] hover:text-white font-bold text-sm uppercase tracking-wider underline"
            >
              Register another player
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              
              {/* Name */}
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-[#0f1923] rounded focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] sm:text-sm transition-colors"
                  placeholder="Full Name / IGN"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Discord ID */}
              <div>
                <label htmlFor="discordId" className="sr-only">Discord ID</label>
                <input
                  id="discordId"
                  name="discordId"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-[#0f1923] rounded focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] sm:text-sm transition-colors"
                  placeholder="Discord ID (e.g., user#1234)"
                  value={formData.discordId}
                  onChange={handleChange}
                />
              </div>

              {/* Valorant ID */}
              <div>
                <label htmlFor="valorantId" className="sr-only">Valorant ID</label>
                <input
                  id="valorantId"
                  name="valorantId"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-[#0f1923] rounded focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] sm:text-sm transition-colors"
                  placeholder="Valorant ID (Name#Tag)"
                  value={formData.valorantId}
                  onChange={handleChange}
                />
                <p className="text-[10px] text-gray-500 mt-1 italic">* Cannot be changed during tournament</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Current Rank */}
                <div>
                  <label htmlFor="currentRank" className="sr-only">Current Rank</label>
                  <select
                    id="currentRank"
                    name="currentRank"
                    required
                    className="block w-full px-3 py-3 border border-gray-600 text-gray-400 bg-[#0f1923] rounded focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] sm:text-sm transition-colors"
                    value={formData.currentRank}
                    onChange={handleChange}
                  >
                    <option value="">Current Rank</option>
                    <option value="Iron">Iron</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Ascendant">Ascendant</option>
                    <option value="Immortal">Immortal</option>
                    <option value="Radiant">Radiant</option>
                  </select>
                </div>

                {/* Peak Rank */}
                <div>
                  <label htmlFor="peakRank" className="sr-only">Peak Rank</label>
                  <select
                    id="peakRank"
                    name="peakRank"
                    required
                    className="block w-full px-3 py-3 border border-gray-600 text-gray-400 bg-[#0f1923] rounded focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] sm:text-sm transition-colors"
                    value={formData.peakRank}
                    onChange={handleChange}
                  >
                    <option value="">Peak Rank</option>
                    <option value="Iron">Iron</option>
                    <option value="Bronze">Bronze</option>
                    <option value="Silver">Silver</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Diamond">Diamond</option>
                    <option value="Ascendant">Ascendant</option>
                    <option value="Immortal">Immortal</option>
                    <option value="Radiant">Radiant</option>
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 italic text-center">* Be honest. Smurfing is not cool.</p>

              {/* Youtube Link */}
              <div>
                <label htmlFor="youtubeLink" className="sr-only">Youtube Link (Optional)</label>
                <input
                  id="youtubeLink"
                  name="youtubeLink"
                  type="url"
                  className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-white bg-[#0f1923] rounded focus:outline-none focus:border-[#ff4655] focus:ring-1 focus:ring-[#ff4655] sm:text-sm transition-colors"
                  placeholder="Youtube Channel Link (Optional)"
                  value={formData.youtubeLink}
                  onChange={handleChange}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded border border-red-500/20">
                {errorMessage}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === "submitting"}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase tracking-widest rounded-sm text-white bg-[#ff4655] hover:bg-[#d93542] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4655] transition-all ${status === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {status === "submitting" ? "Submitting..." : "Register Now"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}