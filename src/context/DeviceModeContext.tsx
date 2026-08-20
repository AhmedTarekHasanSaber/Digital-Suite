import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type DeviceModeSetting = 'auto' | 'pc' | 'mobile';
export type EffectiveDeviceMode = 'pc' | 'mobile';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DetectedOS = 'iOS' | 'Android' | 'macOS' | 'Windows' | 'Linux' | 'Other';

interface DeviceModeContextType {
  modeSetting: DeviceModeSetting;
  effectiveMode: EffectiveDeviceMode;
  deviceType: DeviceType;
  detectedOS: DetectedOS;
  isTouch: boolean;
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  setModeSetting: (mode: DeviceModeSetting) => void;
  cycleMode: () => void;
  deviceInfoSummary: string;
}

const DeviceModeContext = createContext<DeviceModeContextType | undefined>(undefined);

const STORAGE_KEY = 'boubyan_device_mode_setting_v1';

export const DeviceModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modeSetting, setModeSettingState] = useState<DeviceModeSetting>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'auto' || saved === 'pc' || saved === 'mobile') {
      return saved;
    }
    return 'auto';
  });

  const [dimensions, setDimensions] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  }));

  const [detectedOS, setDetectedOS] = useState<DetectedOS>('Other');
  const [isTouch, setIsTouch] = useState(false);

  // Detect platform & OS on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || navigator.vendor || (window as unknown as { opera?: string }).opera || '';
    
    // Detect OS
    let os: DetectedOS = 'Other';
    if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      os = 'iOS';
    } else if (/Android/.test(ua)) {
      os = 'Android';
    } else if (/Macintosh|Mac OS X/.test(ua)) {
      os = 'macOS';
    } else if (/Windows|Win32|Win64/.test(ua)) {
      os = 'Windows';
    } else if (/Linux/.test(ua)) {
      os = 'Linux';
    }
    setDetectedOS(os);

    // Detect touch capability
    const touchCapable = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touchCapable);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Compute device type from dimensions & touch
  const deviceType: DeviceType = (() => {
    if (dimensions.width < 768) return 'mobile';
    if (dimensions.width < 1024) return 'tablet';
    return 'desktop';
  })();

  const isLandscape = dimensions.width > dimensions.height;

  // Compute effective active mode
  const effectiveMode: EffectiveDeviceMode = (() => {
    if (modeSetting === 'pc') return 'pc';
    if (modeSetting === 'mobile') return 'mobile';
    
    // Auto Mode:
    // If screen width < 1024px or (touch device with small/portrait screen) -> mobile mode
    // Otherwise desktop PC mode
    if (dimensions.width < 1024) return 'mobile';
    if (isTouch && (detectedOS === 'iOS' || detectedOS === 'Android') && dimensions.width < 1200) {
      return 'mobile';
    }
    return 'pc';
  })();

  const setModeSetting = useCallback((newSetting: DeviceModeSetting) => {
    setModeSettingState(newSetting);
    localStorage.setItem(STORAGE_KEY, newSetting);
  }, []);

  const cycleMode = useCallback(() => {
    setModeSettingState(current => {
      let next: DeviceModeSetting = 'auto';
      if (current === 'auto') next = 'pc';
      else if (current === 'pc') next = 'mobile';
      else next = 'auto';

      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const deviceInfoSummary = `${detectedOS} • ${dimensions.width}x${dimensions.height} • ${
    modeSetting === 'auto' ? `Auto (${effectiveMode.toUpperCase()})` : `Forced ${effectiveMode.toUpperCase()}`
  }`;

  return (
    <DeviceModeContext.Provider
      value={{
        modeSetting,
        effectiveMode,
        deviceType,
        detectedOS,
        isTouch,
        screenWidth: dimensions.width,
        screenHeight: dimensions.height,
        isLandscape,
        setModeSetting,
        cycleMode,
        deviceInfoSummary
      }}
    >
      {children}
    </DeviceModeContext.Provider>
  );
};

export const useDeviceMode = () => {
  const context = useContext(DeviceModeContext);
  if (!context) {
    throw new Error('useDeviceMode must be used within a DeviceModeProvider');
  }
  return context;
};
