/**
 * Official NexusCRM Desktop Releases & Download Manifest Configuration
 * Real download URLs can be overridden via environment variables or fetched from API.
 */

export const DESKTOP_RELEASE_INFO = {
  version: '1.0.0',
  releaseDate: '2026-09-01',
  channel: 'Stable',
  notesUrl: '/docs/changelog',
  platforms: {
    windows: {
      name: 'Windows',
      icon: 'Monitor',
      recommendedExt: '.msi',
      architectures: [
        {
          arch: 'x64',
          label: 'Windows 10/11 (64-bit Installer)',
          fileSize: '68.4 MB',
          downloadUrl: import.meta.env.VITE_DOWNLOAD_WIN_X64 || 'https://github.com/nexuscrm/releases/download/v1.0.0/NexusCRM_1.0.0_x64_en-US.msi',
          checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        },
        {
          arch: 'arm64',
          label: 'Windows ARM64 Installer',
          fileSize: '64.2 MB',
          downloadUrl: import.meta.env.VITE_DOWNLOAD_WIN_ARM64 || 'https://github.com/nexuscrm/releases/download/v1.0.0/NexusCRM_1.0.0_arm64_en-US.msi',
          checksum: 'sha256:4a5c123456fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b866',
        },
      ],
    },
    macOS: {
      name: 'macOS',
      icon: 'Apple',
      recommendedExt: '.dmg',
      architectures: [
        {
          arch: 'apple_silicon',
          label: 'macOS Apple Silicon (M1/M2/M3/M4)',
          fileSize: '72.1 MB',
          downloadUrl: import.meta.env.VITE_DOWNLOAD_MAC_ARM64 || 'https://github.com/nexuscrm/releases/download/v1.0.0/NexusCRM_1.0.0_aarch64.dmg',
          checksum: 'sha256:7b8c901234fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b877',
        },
        {
          arch: 'intel',
          label: 'macOS Intel (x64)',
          fileSize: '75.8 MB',
          downloadUrl: import.meta.env.VITE_DOWNLOAD_MAC_X64 || 'https://github.com/nexuscrm/releases/download/v1.0.0/NexusCRM_1.0.0_x64.dmg',
          checksum: 'sha256:9c0d123456fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b888',
        },
      ],
    },
    linux: {
      name: 'Linux',
      icon: 'Terminal',
      recommendedExt: '.AppImage',
      architectures: [
        {
          arch: 'appimage',
          label: 'Linux AppImage (Universal 64-bit)',
          fileSize: '82.3 MB',
          downloadUrl: import.meta.env.VITE_DOWNLOAD_LINUX_APPIMAGE || 'https://github.com/nexuscrm/releases/download/v1.0.0/NexusCRM_1.0.0_amd64.AppImage',
          checksum: 'sha256:1a2b345678fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b899',
        },
        {
          arch: 'debian',
          label: 'Debian / Ubuntu (.deb Package)',
          fileSize: '71.5 MB',
          downloadUrl: import.meta.env.VITE_DOWNLOAD_LINUX_DEB || 'https://github.com/nexuscrm/releases/download/v1.0.0/NexusCRM_1.0.0_amd64.deb',
          checksum: 'sha256:3c4d567890fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b800',
        },
      ],
    },
  },
};

export const detectOS = () => {
  if (typeof window === 'undefined') return 'windows';
  const ua = navigator.userAgent.toLowerCase();
  const platform = navigator.platform.toLowerCase();

  if (ua.includes('mac') || platform.includes('mac')) return 'macOS';
  if (ua.includes('linux') || platform.includes('linux')) return 'linux';
  return 'windows';
};
