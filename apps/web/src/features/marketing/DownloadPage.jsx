import React, { useState, useEffect } from 'react';
import { DESKTOP_RELEASE_INFO, detectOS } from '../../services/downloadsConfig';
import { Monitor, Apple, Terminal, Download, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const DownloadPage = () => {
  const [detectedPlatform, setDetectedPlatform] = useState('windows');

  useEffect(() => {
    setDetectedPlatform(detectOS());
  }, []);

  const currentPlatform = DESKTOP_RELEASE_INFO.platforms[detectedPlatform] || DESKTOP_RELEASE_INFO.platforms.windows;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Download Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          <ShieldCheck className="w-3.5 h-3.5" />
          Official Release v{DESKTOP_RELEASE_INFO.version}
        </span>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Download NexusCRM Desktop
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Experience ultra-fast native desktop performance, local offline SQLite storage, and automatic sync across all your devices.
        </p>
      </div>

      {/* Recommended Platform Card */}
      <div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500 shadow-xl relative overflow-hidden">
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
          Recommended for your OS
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold">
            {detectedPlatform === 'macOS' ? (
              <Apple className="w-8 h-8" />
            ) : detectedPlatform === 'linux' ? (
              <Terminal className="w-8 h-8" />
            ) : (
              <Monitor className="w-8 h-8" />
            )}
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              NexusCRM for {currentPlatform.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Version {DESKTOP_RELEASE_INFO.version} • Published {DESKTOP_RELEASE_INFO.releaseDate}
            </p>
          </div>
        </div>

        {/* Download Architectures Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {currentPlatform.architectures.map((arch) => (
            <a key={arch.arch} href={arch.downloadUrl} download className="block">
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
                    {arch.label}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{arch.fileSize}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Download Installer
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">SHA-256</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* All Available Platform Downloads Grid */}
      <div className="space-y-6">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white text-center">
          All Supported Desktop Platforms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(DESKTOP_RELEASE_INFO.platforms).map(([key, plat]) => (
            <div
              key={key}
              className={`p-6 rounded-2xl border bg-white dark:bg-slate-900 space-y-4 ${
                detectedPlatform === key ? 'border-indigo-500/80 shadow-md' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{plat.name}</h4>
                <span className="text-xs font-mono text-slate-400">{plat.recommendedExt}</span>
              </div>

              <div className="space-y-2">
                {plat.architectures.map((arch) => (
                  <a
                    key={arch.arch}
                    href={arch.downloadUrl}
                    download
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-semibold"
                  >
                    <span>{arch.label}</span>
                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Requirements */}
      <div className="p-6 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto space-y-3">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-600" /> System Requirements
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">OS:</span> Windows 10/11 (64-bit), macOS 11+ (Big Sur+), Linux (Ubuntu 20.04+)
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">RAM:</span> Minimum 2 GB (4 GB recommended)
          </div>
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Storage:</span> 150 MB available disk space
          </div>
        </div>
      </div>
    </div>
  );
};
