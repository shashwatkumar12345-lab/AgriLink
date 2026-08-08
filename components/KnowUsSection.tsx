
import React from 'react';
import { teamData } from '../teamData';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

const KnowUsSection: React.FC<{ t: (key: string) => string }> = ({ t }) => {
  if (!teamData || teamData.length === 0) {
    return null;
  }

  const founder = teamData.find(m => m.roleKey === 'founderAndCEO');
  const coFounders = teamData.filter(m => m.roleKey !== 'founderAndCEO');

  return (
    <div className="mt-12 space-y-12">
      <h3 className="text-2xl font-black text-gray-800 dark:text-gray-200 border-b-2 border-emerald-500 pb-2 mb-8 text-center uppercase tracking-wider">
        {t('knowOurTeam')}
      </h3>

      {/* Founder & CEO Spotlight Section */}
      {founder && (
        <div className="flex flex-col items-center justify-center text-center p-6 glass-card rounded-[2.5rem] max-w-2xl mx-auto">
          {/* Custom Styled Photo Container with Holographic/Glow Effects */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-8 opacity-100 dark:mix-blend-screen mix-blend-normal">
            {/* Emerald Glow Aura */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-3xl animate-pulse"></div>
            
            {/* Glassmorphic Container with Mask */}
            <div className="relative w-full h-full rounded-full border border-emerald-500/30 overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(16,185,129,0.3)]">
              <img 
                alt="Shashwat Kumar Portrait" 
                className="w-full h-full object-cover grayscale contrast-125 brightness-75 hover:grayscale-0 transition-all duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhOcUkkWvLV6KFVvOxyKAmiwDVjpfkDpWUVuHbITOK_ZTreJfLxnS6SIDlaWdXFpZYJymW2KqW3BiJpXC3aiJbKEqE-D4TB_pK2g36zehQTvV0rj_eydu76STL6cqt--LEUskyOAhhU9f3TZ78pWgA_KBqTRJBlheOo-oe6zn5t-CvZ2O2KAKCjwuXiQ3dngeAoSkQHkbaCPgw0z0rHgh3J4-9Af5l-0MhBfMDj3w7_uGYhoDdEO18FLRB_Q6ot7H1yr2aRXGl_g-Q" 
                referrerPolicy="no-referrer"
              />
              {/* Holographic Scanline Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-full w-full animate-[spin_10s_linear_infinite] opacity-30"></div>
            </div>
            
            {/* Decorative Hexagonal Frame */}
            <div className="absolute -inset-4 border border-emerald-600/20 rounded-full rotate-45 animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute -inset-8 border border-emerald-500/10 rounded-full -rotate-45 animate-[spin_30s_linear_infinite_reverse]"></div>
          </div>

          <h4 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase leading-none mb-2">
            {founder.name}
          </h4>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-black uppercase tracking-widest mb-3">
            {t(founder.roleKey)}
          </p>
          <a 
            href={founder.linkedinUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-full text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm hover:shadow-md transition-all duration-200"
            aria-label={`${founder.name}'s LinkedIn Profile`}
          >
            <LinkedInIcon className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">LinkedIn</span>
          </a>
        </div>
      )}

      {/* Co-Founders Grid */}
      {coFounders.length > 0 && (
        <div className="space-y-6 pt-6">
          <h4 className="text-xs font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 text-center">
            {t('coFounders') || 'Co-Founders'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {coFounders.map((member, index) => (
              <div key={index} className="group glass-card rounded-2xl p-5 text-center transition-all duration-300">
                <div className="overflow-hidden mb-4 mx-auto w-24 h-24 rounded-full border-4 border-slate-50 dark:border-slate-800 shadow-inner">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name} 
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-transform duration-500 group-hover:scale-110">
                       <UserCircleIcon className="w-20 h-20 text-slate-400 dark:text-slate-500" />
                    </div>
                  )}
                </div>
                <h5 className="font-black text-slate-900 dark:text-white tracking-tight text-sm uppercase">{member.name}</h5>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-1">{t(member.roleKey)}</p>
                <a 
                  href={member.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block mt-3 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                  aria-label={`${member.name}'s LinkedIn Profile`}
                >
                  <LinkedInIcon className="w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowUsSection;
