
interface TeamMember {
  name: string;
  roleKey: string;
  linkedinUrl: string;
  imageUrl?: string;
}

export const teamData: TeamMember[] = [
  {
    name: 'Shashwat Kumar',
    roleKey: 'founderAndCEO',
    linkedinUrl: 'https://www.linkedin.com/in/shashwat-kumar-a615721bb',
    // REPLACE THIS URL with the actual path or URL to your photo. 
    // Example: '/assets/shashwat.jpg' or a hosted link.
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhOcUkkWvLV6KFVvOxyKAmiwDVjpfkDpWUVuHbITOK_ZTreJfLxnS6SIDlaWdXFpZYJymW2KqW3BiJpXC3aiJbKEqE-D4TB_pK2g36zehQTvV0rj_eydu76STL6cqt--LEUskyOAhhU9f3TZ78pWgA_KBqTRJBlheOo-oe6zn5t-CvZ2O2KAKCjwuXiQ3dngeAoSkQHkbaCPgw0z0rHgh3J4-9Af5l-0MhBfMDj3w7_uGYhoDdEO18FLRB_Q6ot7H1yr2aRXGl_g-Q', 
  },
  {
    name: 'Progyan Boruah',
    roleKey: 'coFounder',
    linkedinUrl: 'https://www.linkedin.com/in/progyan-boruah-801630343?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Viplove Sayre',
    roleKey: 'coFounder',
    linkedinUrl: 'https://www.linkedin.com/in/viplove-sayre-766462170?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Rohit Ahirwar',
    roleKey: 'coFounder',
    linkedinUrl: 'https://www.linkedin.com/in/rohit-kumar-808368378?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
  {
    name: 'Sagar Shrey',
    roleKey: 'coFounder',
    linkedinUrl: 'https://www.linkedin.com/in/sagar-shrey?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app',
  },
];
