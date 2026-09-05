import type { CategorySlug } from './portfolio';

export interface PortfolioVideoMeta {
  id: string;
  src: string;
  title: string;
  category: CategorySlug;
}

export const PORTFOLIO_VIDEOS: PortfolioVideoMeta[] = [
  // Coffee — titles taken from the filenames you already renamed.
  { id: 'coffee-avara-coffee', src: '/Low%20mb%20videos/Coffee/AVARA%20COFFEE.mp4', title: 'Avara Coffee', category: 'coffee' },
  { id: 'coffee-avara-coffee-2', src: '/Low%20mb%20videos/Coffee/AVARA%20COFFEE%202.mp4', title: 'Avara Coffee 2', category: 'coffee' },
  { id: 'coffee-black-slate-coffee', src: '/Low%20mb%20videos/Coffee/BLACK%20SLATE%20COFFEE.mp4', title: 'Black Slate Coffee', category: 'coffee' },
  { id: 'coffee-brew-1', src: '/Low%20mb%20videos/Coffee/BREW%201.mp4', title: 'Brew 1', category: 'coffee' },
  { id: 'coffee-brew-2', src: '/Low%20mb%20videos/Coffee/BREW%202.mp4', title: 'Brew 2', category: 'coffee' },
  { id: 'coffee-coffee-making-1', src: '/Low%20mb%20videos/Coffee/COFFEE%20MAKING%201.mp4', title: 'Coffee Making 1', category: 'coffee' },
  { id: 'coffee-coffee-making-2', src: '/Low%20mb%20videos/Coffee/COFFEE%20MAKING%202.mp4', title: 'Coffee Making 2', category: 'coffee' },
  { id: 'coffee-coffee-party', src: '/Low%20mb%20videos/Coffee/COFFEE%20PARTY.mp4', title: 'Coffee Party', category: 'coffee' },
  { id: 'coffee-coffee-school', src: '/Low%20mb%20videos/Coffee/COFFEE%20SCHOOL.mp4', title: 'Coffee School', category: 'coffee' },
  { id: 'coffee-motion-graphic', src: '/Low%20mb%20videos/Coffee/MOTION%20GRAPHIC.mp4', title: 'Motion Graphic', category: 'coffee' },

  // Gym — titles taken from the filenames you already renamed.
  { id: 'gym-dedication', src: '/Low%20mb%20videos/Gym/DEDICATION.mp4', title: 'Dedication', category: 'gym' },
  { id: 'gym-just-feel-it', src: '/Low%20mb%20videos/Gym/JUST%20FEEL%20IT.mp4', title: 'Just Feel It', category: 'gym' },
  { id: 'gym-motivation', src: '/Low%20mb%20videos/Gym/MOTIVATION.mp4', title: 'Motivation', category: 'gym' },
  { id: 'gym-muscle-mommy', src: '/Low%20mb%20videos/Gym/MUSCLE%20MOMMY.mp4', title: 'Muscle Mommy', category: 'gym' },
  { id: 'gym-nike-x-on-tour', src: '/Low%20mb%20videos/Gym/NIKE%20X%20ON%20TOUR.mp4', title: 'Nike x On Tour', category: 'gym' },

  // BTS — titles taken from the filenames you already renamed.
  { id: 'bts-random-saturday', src: '/Low%20mb%20videos/bts/RANDOM%20SATURDAY.mp4', title: 'Random Saturday', category: 'bts' },
  { id: 'bts-story-bts', src: '/Low%20mb%20videos/bts/STORY%20BTS.mp4', title: 'Story BTS', category: 'bts' },

  // Influencer — titles drafted from on-screen captions / visible brand cues.
  { id: 'influencer-street-college-interview', src: '/Low%20mb%20videos/Influencer/Brands/20m-view.mp4', title: 'Have You Studied From a College?', category: 'influencer' },
  { id: 'influencer-dream11-victory-night', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-01.mp4', title: 'Dream11 Victory Night', category: 'influencer' },
  { id: 'influencer-first-date-story', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-02.mp4', title: 'It Was My First Date', category: 'influencer' },
  { id: 'influencer-690-points-challenge', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-03.mp4', title: '690 Points Challenge', category: 'influencer' },
  { id: 'influencer-which-college', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-04.mp4', title: 'Which College Are You From?', category: 'influencer' },
  { id: 'influencer-street-cash-challenge', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-05.mp4', title: 'Street Cash Challenge', category: 'influencer' },
  { id: 'influencer-two-random-kids', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-06.mp4', title: 'Two Random Kids', category: 'influencer' },
  { id: 'influencer-that-one-girl', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-07.mp4', title: 'What Is That One Girl?', category: 'influencer' },
  { id: 'influencer-puts-in-his-kart', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-08.mp4', title: 'Puts In His Kart', category: 'influencer' },
  { id: 'influencer-one-girl-name', src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-09.mp4', title: 'One Girl Name', category: 'influencer' },
  { id: 'influencer-ham-logon-se', src: '/Low%20mb%20videos/Influencer/Brands/campaign-reel-1.mp4', title: 'Ham Logon Se', category: 'influencer' },
  { id: 'influencer-riyaa-street-interview', src: '/Low%20mb%20videos/Influencer/Brands/final-riyaaa.mp4', title: 'Riyaa Street Interview', category: 'influencer' },
  { id: 'influencer-a-secret-from-strangers', src: '/Low%20mb%20videos/Influencer/Brands/final-video-divya-loreal-1.mp4', title: 'A Secret From Random People', category: 'influencer' },
  { id: 'influencer-mumbai-to-mahakumbh', src: '/Low%20mb%20videos/Influencer/Brands/mumbai-to-mahakumbh.mp4', title: 'Mumbai to Mahakumbh', category: 'influencer' },
  { id: 'influencer-lets-play-a-fun-game', src: '/Low%20mb%20videos/Influencer/Brands/president-of-india.mp4', title: "Let's Play a Fun Game", category: 'influencer' },
  { id: 'influencer-prime-giveaway', src: '/Low%20mb%20videos/Influencer/Brands/prime.mp4', title: 'Prime Giveaway', category: 'influencer' },
  { id: 'influencer-pringles-tongue-twister', src: '/Low%20mb%20videos/Influencer/Brands/pringles.mp4', title: 'Pringles Tongue Twister', category: 'influencer' },
  { id: 'influencer-tongue-twister-take', src: '/Low%20mb%20videos/Influencer/Brands/raw-cut-pringlee-5.mp4', title: 'Tongue Twister Take', category: 'influencer' },
  { id: 'influencer-the-next-24-hours', src: '/Low%20mb%20videos/Influencer/Brands/uppercase-01.mp4', title: 'The Next 24 Hours', category: 'influencer' },
  { id: 'influencer-a-random-wedding', src: '/Low%20mb%20videos/Influencer/Brands/wedding-crash.mp4', title: 'A Random Wedding', category: 'influencer' },
  { id: 'influencer-that-one-guy-name', src: '/Low%20mb%20videos/Influencer/Brands/xiaomi01.mp4', title: 'That One Guy Name', category: 'influencer' },
  { id: 'influencer-for-every-step', src: '/Low%20mb%20videos/Influencer/Brands/xiaomi02.mp4', title: 'For Every Step', category: 'influencer' },
  { id: 'influencer-day-six', src: '/Low%20mb%20videos/Influencer/Seriers/day-06-2.mp4', title: 'Day Six', category: 'influencer' },
  { id: 'influencer-day-seven', src: '/Low%20mb%20videos/Influencer/Seriers/day-07.mp4', title: 'Day Seven', category: 'influencer' },
  { id: 'influencer-day-eight', src: '/Low%20mb%20videos/Influencer/Seriers/day-08-2.mp4', title: 'Day Eight', category: 'influencer' },
  { id: 'influencer-day-four', src: '/Low%20mb%20videos/Influencer/Seriers/divya-day-03.mp4', title: 'Day Four', category: 'influencer' },
  { id: 'influencer-day-five', src: '/Low%20mb%20videos/Influencer/Seriers/final-final-5.mp4', title: 'Day Five', category: 'influencer' },

  // Jewelery — titles taken from the filenames you already renamed.
  { id: 'jewelery-ds-jewells', src: '/Low%20mb%20videos/Jewelery/DS%20JEWELLS.mp4', title: 'DS Jewells', category: 'jewelery' },
  { id: 'jewelery-ek-noor', src: '/Low%20mb%20videos/Jewelery/EK%20NOOR.mp4', title: 'Ek Noor', category: 'jewelery' },
  { id: 'jewelery-old-school-era', src: '/Low%20mb%20videos/Jewelery/OLD%20SCHOOL%20ERA.mp4', title: 'Old School Era', category: 'jewelery' },
  { id: 'jewelery-ootd', src: '/Low%20mb%20videos/Jewelery/OOTD.mp4', title: 'OOTD', category: 'jewelery' },

  // Real estate — mix of your renamed files + titles from on-screen captions.
  { id: 'realestate-this-house-was-old', src: '/Low%20mb%20videos/real%20estate/chanchi-baa-01.mp4', title: 'Vintage House', category: 'realestate' },
  { id: 'realestate-heritage-house-restored', src: '/Low%20mb%20videos/real%20estate/chanchi-baa-02.mp4', title: 'Heritage House Restored', category: 'realestate' },
  { id: 'realestate-construction-approach-1', src: '/Low%20mb%20videos/real%20estate/CONSTRUCTION%20APPROACH%201.mp4', title: 'Construction Approach 1', category: 'realestate' },
  { id: 'realestate-construction-approach-2', src: '/Low%20mb%20videos/real%20estate/CONSTRUCTION%20APPROACH%202.mp4', title: 'Construction Approach 2', category: 'realestate' },
  { id: 'realestate-dobariya-since-1989', src: '/Low%20mb%20videos/real%20estate/day-03-2.mp4', title: 'Dobariya Since 1989', category: 'realestate' },
  { id: 'realestate-open-space-first', src: '/Low%20mb%20videos/real%20estate/dev-06-02.mp4', title: 'Build From Nothing', category: 'realestate' },
  { id: 'realestate-built-easy-in-ahmedabad', src: '/Low%20mb%20videos/real%20estate/dev-construction-01.mp4', title: 'Built Easy in Ahmedabad', category: 'realestate' },
  { id: 'realestate-this-place-was-empty', src: '/Low%20mb%20videos/real%20estate/dev-construction-bunglow-01.mp4', title: 'Zero to Hero', category: 'realestate' },
  { id: 'realestate-client-first', src: '/Low%20mb%20videos/real%20estate/dev-construction-bunglow-02.mp4', title: 'Client First', category: 'realestate' },
  { id: 'realestate-site-prep', src: '/Low%20mb%20videos/real%20estate/dev-construction-cafe-01.mp4', title: 'Site Prep', category: 'realestate' },
  { id: 'realestate-dobariya-2026', src: '/Low%20mb%20videos/real%20estate/final-video-day-2-sample.mp4', title: 'Dobariya 2026', category: 'realestate' },
  { id: 'realestate-ahmedabad-on-the-map', src: '/Low%20mb%20videos/real%20estate/highlight-4.mp4', title: 'Ahmedabad on the Map', category: 'realestate' },
  { id: 'realestate-restoring-a-heritage-house', src: '/Low%20mb%20videos/real%20estate/kanu-kaka-01.mp4', title: 'Restoring a Heritage House', category: 'realestate' },
  { id: 'realestate-making-it-liveable-again', src: '/Low%20mb%20videos/real%20estate/kanu-kaka-02.mp4', title: 'Making It Liveable Again', category: 'realestate' },
  { id: 'realestate-dobariya-x-krivam', src: '/Low%20mb%20videos/real%20estate/reel-01.mp4', title: 'Dobariya x Krivam', category: 'realestate' },
];
