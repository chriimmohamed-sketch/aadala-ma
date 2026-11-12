"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Users, DollarSign, ArrowUpRight,
  ArrowDown, Upload, Lock, Search, Home, Heart, Plus, User, Bell,
  Folder, TrendingUp, Phone
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ==========================================
// 1. Stats Card
// ==========================================
export const StatsCard = ({ title, value, change, icon: Icon }: any) => {
  return (
    <motion.div whileHover={{ y: -5 }} className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-64 text-white shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/60 mb-1">{title}</p>
          <h2 className="text-2xl font-bold text-white mb-2">{value}</h2>
          <p className="flex items-center gap-1 text-sm text-emerald-400">
            <ArrowUpRight size={16} /> {change}%
          </p>
        </div>
        {Icon && <div className="p-3 bg-white/10 rounded-full"><Icon size={24} /></div>}
      </div>
    </motion.div>
  );
};

// ==========================================
// 2. Lamp Login Animation
// ==========================================
export const LampLogin = () => {
  const [isOn, setIsOn] = useState(false);
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px] bg-[#111] overflow-hidden rounded-xl border border-white/10 w-full max-w-sm">
      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute top-20 w-64 h-64 bg-yellow-500/20 blur-[80px] rounded-full pointer-events-none"
          />
        )}
      </AnimatePresence>

      <motion.div
        className="cursor-pointer z-10 relative"
        onClick={() => setIsOn(!isOn)}
        animate={{ rotate: isOn ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="w-32 h-16 bg-zinc-800 rounded-t-full border-b-4 border-yellow-600 flex justify-center items-end pb-2 shadow-2xl">
          <div className="w-4 h-4 bg-yellow-400 rounded-full shadow-[0_0_15px_#facc15]" />
        </div>
        <div className="w-1 h-8 bg-zinc-700 mx-auto" />
      </motion.div>

      <AnimatePresence>
        {isOn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="mt-12 p-6 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl w-4/5 z-10"
          >
            <h2 className="text-white text-center mb-4 font-semibold">Welcome Back</h2>
            <input type="text" placeholder="Email" className="w-full mb-3 p-2 rounded bg-white/5 border border-white/10 text-white outline-none" />
            <input type="password" placeholder="Password" className="w-full mb-4 p-2 rounded bg-white/5 border border-white/10 text-white outline-none" />
            <button className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium">Login</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==========================================
// 3. Download Button Animation
// ==========================================
export const DownloadButton = () => {
  return (
    <div className="flex items-center justify-center p-8 bg-zinc-900 rounded-xl w-full max-w-sm border border-white/10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="rounded-full border-2 border-emerald-500 text-emerald-500 flex items-center justify-center gap-2 px-8 py-3 font-semibold overflow-hidden relative group"
      >
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "auto" }}
          className="flex items-center gap-2"
        >
          <ArrowDown size={20} className="group-hover:animate-bounce" />
          <span>Download</span>
        </motion.div>
      </motion.button>
    </div>
  );
};

// ==========================================
// 4. Basketball Upload Animation
// ==========================================
export const BasketballUpload = () => {
  return (
    <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-xl">Upload files</h3>
        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-500">Uploaded 3</span>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-xl h-64 relative flex flex-col items-center justify-center bg-gray-50/50">
        <Upload className="text-gray-400 mb-2" size={32} />
        <p className="font-semibold text-gray-700">Drop files here</p>
        <p className="text-sm text-gray-400">or take the shot</p>

        <div className="absolute bottom-0 flex flex-col items-center">
          <div className="w-16 h-10 border-2 border-b-0 border-gray-400 rounded-t-sm relative">
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-8 border-2 border-gray-400 rounded-b-full border-t-0 flex flex-col justify-end items-center overflow-hidden">
               <div className="w-full h-[1px] bg-gray-300 absolute top-2" />
               <div className="w-full h-[1px] bg-gray-300 absolute top-4" />
            </div>
          </div>
        </div>

        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          className="absolute bottom-10 left-10 bg-white p-2 rounded shadow-lg cursor-grab active:cursor-grabbing border border-gray-200"
        >
          <Folder size={24} className="text-blue-500" />
          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1 rounded mt-1 block">PDF</span>
        </motion.div>
      </div>
      <p className="text-center text-xs text-gray-400 mt-4">Aim the file & release to shoot into the basket</p>
    </div>
  );
};

// ==========================================
// 5. Hanging Card
// ==========================================
export const HangingCard = () => {
  return (
    <div className="flex flex-col items-center pt-10 h-[400px] bg-gray-100 rounded-xl w-full max-w-sm relative">
      <div className="w-full h-2 bg-gray-300 absolute top-8" />
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="flex flex-col items-center origin-top z-10"
      >
        <div className="w-6 h-20 bg-gray-800 text-[8px] text-white flex items-center justify-center [writing-mode:vertical-lr] rotate-180">Business Days</div>
        <div className="w-56 h-80 bg-zinc-900 rounded-xl p-5 text-white shadow-2xl relative flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">twnty.</h2>
              <span className="text-[10px] text-gray-400">ID *1137</span>
            </div>
            <p className="text-xs text-gray-300 mb-1">10th International</p>
            <p className="text-xs text-gray-300 mb-1">Digital Business Days 2019</p>
            <p className="text-xs text-gray-400">13. - 15. November</p>
          </div>
          <div>
            <p className="text-sm font-semibold">Dr. Evelyn Vance</p>
            <p className="text-[10px] text-gray-400 mb-2">Quantum Studio</p>
            <h1 className="text-3xl font-bold">Speaker</h1>
            <p className="text-[10px] text-gray-400 tracking-widest">STAGE ACCESS</p>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500 mt-4">
            <span>twnty.de</span>
            <span className="text-white font-bold">1.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// ==========================================
// 6. Sharingan Loading Animation
// ==========================================
export const SharinganLoader = () => {
  return (
    <div className="bg-black w-full max-w-sm h-64 flex items-center justify-center gap-8 rounded-xl border border-white/10 relative overflow-hidden">
      {[1, 2].map((eye) => (
        <div key={eye} className="relative w-24 h-12 bg-purple-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-purple-400">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 border border-purple-500 rounded-full"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full border border-purple-300" />
              <div className="absolute bottom-2 left-1 w-2 h-2 bg-black rounded-full border border-purple-300" />
              <div className="absolute bottom-2 right-1 w-2 h-2 bg-black rounded-full border border-purple-300" />
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 7. OTP Animations
// ==========================================
export const OtpV15 = () => {
  const [otp, setOtp] = useState(['1', '2', '3', '']);
  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm flex flex-col items-center border border-gray-100">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
        <Lock className="text-blue-600" size={24} />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Verify it's you</h2>
      <p className="text-xs text-gray-500 mb-6 text-center">Enter the 4-digit code we just sent to <br/><strong>s*******@gmail.com</strong></p>

      <div className="flex gap-3 mb-6">
        {otp.map((digit, i) => (
          <div key={i} className={`w-14 h-16 border-2 rounded-xl flex items-center justify-center text-2xl font-bold ${digit ? 'border-blue-500 text-gray-800' : 'border-gray-200 text-gray-300'}`}>
            {digit || '-'}
          </div>
        ))}
      </div>

      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div className="w-3/4 h-full bg-blue-600 rounded-full" />
      </div>
      <p className="text-xs text-gray-500">Didn't get a code? <span className="text-blue-600 font-semibold cursor-pointer">Resend in 0:16</span></p>
    </div>
  );
};

export const GlassyOtpV4 = () => {
  return (
    <div className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-3xl shadow-2xl w-full max-w-sm relative overflow-hidden border border-white/10">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 backdrop-blur-sm shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Lock className="text-cyan-400" size={20} />
        </div>
        <h2 className="text-white font-bold text-lg mb-1">Verify Your Number</h2>
        <p className="text-xs text-gray-400 mb-6">We've sent a 4-digit code to +1(555)****42</p>

        <div className="flex gap-3 mb-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className={`w-12 h-14 rounded-xl flex items-center justify-center border ${i === 0 ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] bg-cyan-500/10' : 'border-white/10 bg-white/5'} text-white`}>
              {i === 0 ? <span className="animate-pulse w-[2px] h-6 bg-cyan-400" /> : ''}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">Didn't receive the code? <span className="text-white cursor-pointer">Resend</span></p>
      </div>
    </div>
  );
};

// ==========================================
// 8. Glassy Navigation Tabs
// ==========================================
export const GlassyNavV5 = () => {
  return (
    <div className="w-full max-w-md bg-zinc-900 p-8 rounded-3xl flex flex-col gap-6 items-center border border-white/10">
      <div className="flex items-center justify-between w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-full p-2 px-4 shadow-lg">
        <div className="flex flex-col items-center text-cyan-400"><Home size={20} /><span className="text-[10px] mt-1">Home</span></div>
        <div className="flex flex-col items-center text-gray-400"><Search size={20} /><span className="text-[10px] mt-1">Search</span></div>
        <div className="flex flex-col items-center text-gray-400"><Plus size={20} /><span className="text-[10px] mt-1">Add</span></div>
        <div className="flex flex-col items-center text-gray-400"><User size={20} /><span className="text-[10px] mt-1">Profile</span></div>
        <div className="flex flex-col items-center text-gray-400"><Bell size={20} /><span className="text-[10px] mt-1">Alerts</span></div>
      </div>
    </div>
  );
};

export const GlassyNavV7 = () => {
  return (
    <div className="w-full max-w-lg flex flex-col gap-4 items-center">
      <div className="flex items-center gap-6 bg-[#e0e0e0]/80 backdrop-blur-lg px-6 py-3 rounded-full shadow-xl border border-white/50 text-gray-700">
        <div className="flex items-center gap-2"><Home size={16} /> <span className="text-sm font-medium">Home</span></div>
        <div className="flex items-center gap-2"><Search size={16} /> <span className="text-sm font-medium">Discover</span></div>
        <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm"><Folder size={16} /> <span className="text-sm font-medium">Library</span></div>
        <div className="flex items-center gap-2 text-gray-500"><User size={16} /> <span className="text-sm font-medium">Profile</span></div>
      </div>

      <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl px-4 py-2 rounded-full shadow-lg border border-white/60 text-gray-700">
        <div className="flex items-center gap-2"><User size={16} /> <span className="text-sm font-medium">User</span></div>
        <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2 rounded-full shadow-md"><Folder size={16} /> <span className="text-sm font-medium">Overview</span></div>
        <div className="flex items-center gap-2 text-gray-600"><Folder size={16} /> <span className="text-sm font-medium">Projects</span></div>
      </div>
    </div>
  );
};

// ==========================================
// Demo gallery (default export)
// ==========================================
export default function UIKitDemo() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8 flex flex-col gap-12 items-center">
      <h1 className="text-3xl font-bold mb-8">كل الأكواد في مكان واحد</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Dashboard Stats Card</h2>
          <StatsCard title="Total Projects" value="12" change="+20" icon={Folder} />
          <StatsCard title="Active Tasks" value="8" change="+12" icon={TrendingUp} />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Lamp Login</h2>
          <LampLogin />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Download Button</h2>
          <DownloadButton />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Basketball Upload</h2>
          <BasketballUpload />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Hanging Card</h2>
          <HangingCard />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Loading Animation</h2>
          <SharinganLoader />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">OTP V15</h2>
          <OtpV15 />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-gray-400">Glassy OTP V4</h2>
          <GlassyOtpV4 />
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <h2 className="text-xl text-gray-400">Glassy Navigation Tabs</h2>
          <GlassyNavV5 />
          <GlassyNavV7 />
        </div>
      </div>
    </div>
  );
}
