import React from 'react';
import { MoonIcon } from './MoonIcon';

interface WeatherIconProps extends React.SVGProps<SVGSVGElement> {
  iconName: string;
}

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </svg>
);

const CloudIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.5 4.5 0 002.25 15z" />
    </svg>
);

const PartlyCloudyDayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" className="text-yellow-500" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.5 4.5 0 002.25 15z" fill="currentColor" fillOpacity="0.4" className="text-gray-400" />
  </svg>
);

const PartlyCloudyNightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" className="text-indigo-300" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.5 4.5 0 002.25 15z" fill="currentColor" fillOpacity="0.4" className="text-slate-600" />
  </svg>
);

const RainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 100 15h5.25a3.75 3.75 0 003.75-3.75V11.25A3.75 3.75 0 0015.75 7.5h-1.875a.375.375 0 01-.375-.375V6.375A3.75 3.75 0 0010.5 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5v5M9 14.5v3M15 14.5v3" />
    </svg>
);

const WindIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12H9m12 0h-3.75" />
    </svg>
);

const SnowIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m15.364-6.364l-12.728 12.728m12.728 0L5.636 5.636" />
    </svg>
);

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, ...props }) => {
  if (!iconName) return <CloudIcon {...props} className={(props.className || '') + ' text-gray-400'} />;
  
  const name = iconName.toLowerCase();
  
  // Mapping logic based on common condition strings
  if (name.includes('sunny') || name.includes('clear-day')) {
    return <SunIcon {...props} className={(props.className || '') + ' text-yellow-500'} />;
  }
  
  if (name.includes('clear-night') || name.includes('starry')) {
    return <MoonIcon {...props} className={(props.className || '') + ' text-blue-300'} />;
  }
  
  if (name.includes('partly-cloudy-day') || (name.includes('cloud') && name.includes('sun'))) {
    return <PartlyCloudyDayIcon {...props} />;
  }
  
  if (name.includes('partly-cloudy-night') || (name.includes('cloud') && name.includes('moon'))) {
    return <PartlyCloudyNightIcon {...props} />;
  }
  
  if (name.includes('rain') || name.includes('shower') || name.includes('drizzle') || name.includes('storm')) {
    return <RainIcon {...props} className={(props.className || '') + ' text-blue-500'} />;
  }
  
  if (name.includes('snow') || name.includes('ice') || name.includes('hail')) {
    return <SnowIcon {...props} className={(props.className || '') + ' text-cyan-200'} />;
  }
  
  if (name.includes('wind') || name.includes('haze') || name.includes('fog') || name.includes('mist')) {
    return <WindIcon {...props} className={(props.className || '') + ' text-gray-400'} />;
  }
  
  if (name.includes('cloud')) {
    return <CloudIcon {...props} className={(props.className || '') + ' text-gray-500'} />;
  }

  // Fallback
  return <CloudIcon {...props} className={(props.className || '') + ' text-gray-400'} />;
};
