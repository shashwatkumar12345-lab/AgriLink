
import React, { useState, useEffect } from 'react';
import { Harvest, Animal, User, MarketPriceData } from '../types';
import { getMarketPrice } from '../services/geminiService';
import Spinner from './Spinner';

interface MarketPriceProps {
  item: Harvest | Animal;
  user: User;
  t: (key: string) => string;
}

const MarketPrice: React.FC<MarketPriceProps> = ({ item, user, t }) => {
  const [priceData, setPriceData] = useState<MarketPriceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const itemName = 'crop' in item ? item.crop : item.name;
  
  // Logic to exclude cows, but allow "Cowpea" (a crop)
  const isAnimal = !('crop' in item);
  const isCow = isAnimal && itemName.toLowerCase().includes('cow');

  useEffect(() => {
    if (isCow) return; // Skip fetching for cows

    let isMounted = true;
    const fetchPrice = async () => {
      setIsLoading(true);
      setError('');
      try {
        const itemType = 'crop' in item ? 'crop' : 'animal';
        const itemBreed = 'breed' in item ? item.breed : undefined;
        
        const data = await getMarketPrice(itemName, itemType, itemBreed, user);
        if (isMounted) {
          setPriceData(data);
        }
      } catch (e) {
        if (isMounted) {
          setError('Could not fetch price.');
        }
        console.error("Price fetch error:", e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchPrice();

    return () => {
      isMounted = false;
    };
  }, [item, user, itemName, isCow]);

  if (isCow) return null; // Don't render anything for cows

  if (isLoading) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Spinner />
            <span>Loading market price...</span>
        </div>
      </div>
    );
  }
  
  if (!priceData || (!priceData.regional && !priceData.national)) {
    // Don't show an error, just show nothing if no price is found.
    return null;
  }

  // Determine the date to display (prioritize regional, fallback to national)
  const displayDate = priceData.regional?.date || priceData.national?.date;

  return (
    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('marketPrice')}</h4>
          {displayDate && <span className="text-xs text-gray-400">Updated: {displayDate}</span>}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-sm">
        {priceData.regional && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">{t('regional')} ({priceData.regional.location}): </span>
            <strong className="text-gray-800 dark:text-gray-200">{priceData.regional.price}</strong>
          </div>
        )}
        {priceData.national && (
          <div>
            <span className="text-gray-500 dark:text-gray-400">{t('national')} ({priceData.national.location}): </span>
            <strong className="text-gray-800 dark:text-gray-200">{priceData.national.price}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPrice;
