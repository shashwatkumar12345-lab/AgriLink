import React from 'react';
import Card from './Card';

const WeatherSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mx-auto"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-md w-3/4 mx-auto mt-2"></div>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="ml-4 rtl:ml-0 rtl:mr-4 space-y-2">
              <div className="h-14 bg-gray-300 dark:bg-gray-700 rounded-md w-24"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-md w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm w-40">
            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
            <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded-md"></div>
            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
          </div>
        </div>
      </Card>

      <Card>
         <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-md w-1/3 mb-4"></div>
        <div className="flex overflow-x-auto space-x-2 pb-4 -mx-4 px-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 p-2 rounded-lg bg-gray-200 dark:bg-gray-700/50 flex-shrink-0 w-20 h-32 border dark:border-gray-700">
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded-md w-1/3 mb-4"></div>
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700/50 p-3 rounded-lg h-12"></div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WeatherSkeleton;