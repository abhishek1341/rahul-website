import type { Metadata } from "next";
import PortfolioLookbook from "./PortfolioLookbook";

const clients = [
  {
    id: 'vrundavan',
    name: 'Vrundavan Restaurant',
    desc: 'Pure Veg Restaurant Brand',
    tags: ['Food Reels', 'Branding', 'Ads'],
    niches: ['reels', 'branding', 'ads'],
    logo: '/clients/vrundavan-logo.png',
  },
  {
    id: 'krystal',
    name: 'Krystal Dental Clinic',
    desc: 'Dental Clinic & Implant Specialist',
    tags: ['Lead Gen', 'Educational Reels', 'Brand Videos'],
    niches: ['reels', 'branding', 'testimonials'],
    logo: '/clients/krystal_logo.png',
  },
  {
    id: 'pihu',
    name: 'Pihu Ethnic Wear',
    desc: 'Ethnic Fashion Brand',
    tags: ['Product Reels', 'Campaigns', 'Photoshoots'],
    niches: ['reels', 'campaigns', 'offers'],
    logo: '/clients/PIHU_LOGO.png',
  },
];

const niches = [
  { id: 'reels', label: 'Reels', icon: '▶' },
  { id: 'branding', label: 'Branding', icon: '✦' },
  { id: 'offers', label: 'Offers', icon: '◈' },
  { id: 'testimonials', label: 'Testimonials', icon: '◯' },
  { id: 'ads', label: 'Ads', icon: '◬' },
  { id: 'campaigns', label: 'Campaigns', icon: '⚑' },
];

const portfolioVideos = {
  vrundavan: {
    reels: [
      { id: 1, title: 'Restaurant Ambience Reel', subtitle: 'Showcasing the pure veg experience.', thumb: '/portfolio/vrundavan/r1.jpg' },
      { id: 2, title: 'Chef Special of the Week', subtitle: 'Behind the kitchen scenes.', thumb: '/portfolio/vrundavan/r2.jpg' },
      { id: 3, title: 'Customer Testimonial Cut', subtitle: 'Real guests, real reactions.', thumb: '/portfolio/vrundavan/r3.jpg' },
      { id: 4, title: 'Festival Menu Launch', subtitle: 'Navratri special highlights.', thumb: '/portfolio/vrundavan/r4.jpg' },
    ],
    branding: [
      { id: 1, title: 'Brand Story Intro', subtitle: 'A warm first impression for new audiences.', thumb: '/portfolio/vrundavan/b1.jpg' },
      { id: 2, title: 'Interior Highlight Cut', subtitle: 'Visual identity across the restaurant space.', thumb: '/portfolio/vrundavan/b2.jpg' },
      { id: 3, title: 'Menu Identity Reel', subtitle: 'Signature dishes with branded pacing.', thumb: '/portfolio/vrundavan/b3.jpg' },
      { id: 4, title: 'Family Dining Moment', subtitle: 'Positioning the brand around shared meals.', thumb: '/portfolio/vrundavan/b4.jpg' },
    ],
    ads: [
      { id: 1, title: 'Weekend Offer Ad', subtitle: 'Short-form offer creative for local reach.', thumb: '/portfolio/vrundavan/a1.jpg' },
      { id: 2, title: 'Thali Promotion Cut', subtitle: 'Conversion-focused food showcase.', thumb: '/portfolio/vrundavan/a2.jpg' },
      { id: 3, title: 'Delivery Campaign Ad', subtitle: 'Performance creative for online orders.', thumb: '/portfolio/vrundavan/a3.jpg' },
      { id: 4, title: 'Festive Booking Ad', subtitle: 'Promoting group reservations and events.', thumb: '/portfolio/vrundavan/a4.jpg' },
    ],
  },
  krystal: {
    reels: [
      { id: 1, title: 'Smile Transformation Reel', subtitle: 'Before-and-after story sequence.', thumb: '/portfolio/krystal/r1.jpg' },
      { id: 2, title: 'Implant Awareness Reel', subtitle: 'Educating patients in a simple format.', thumb: '/portfolio/krystal/r2.jpg' },
      { id: 3, title: 'Clinic Walkthrough Cut', subtitle: 'A friendly tour of the treatment space.', thumb: '/portfolio/krystal/r3.jpg' },
      { id: 4, title: 'Doctor Explainer Reel', subtitle: 'Expert-led content for trust building.', thumb: '/portfolio/krystal/r4.jpg' },
    ],
    branding: [
      { id: 1, title: 'Clinic Brand Introduction', subtitle: 'Positioning the practice with clarity.', thumb: '/portfolio/krystal/b1.jpg' },
      { id: 2, title: 'Doctor Profile Video', subtitle: 'Humanizing the specialist behind the clinic.', thumb: '/portfolio/krystal/b2.jpg' },
      { id: 3, title: 'Patient Comfort Story', subtitle: 'Reducing hesitation through brand messaging.', thumb: '/portfolio/krystal/b3.jpg' },
      { id: 4, title: 'Service Overview Cut', subtitle: 'A clean overview of key dental treatments.', thumb: '/portfolio/krystal/b4.jpg' },
    ],
    testimonials: [
      { id: 1, title: 'Implant Patient Story', subtitle: 'A patient shares their treatment journey.', thumb: '/portfolio/krystal/t1.jpg' },
      { id: 2, title: 'Smile Correction Review', subtitle: 'Social proof for cosmetic dentistry.', thumb: '/portfolio/krystal/t2.jpg' },
      { id: 3, title: 'Family Dental Feedback', subtitle: 'Trust-building testimonial for families.', thumb: '/portfolio/krystal/t3.jpg' },
      { id: 4, title: 'Clinic Experience Review', subtitle: 'Highlighting comfort and care quality.', thumb: '/portfolio/krystal/t4.jpg' },
    ],
  },
  pihu: {
    reels: [
      { id: 1, title: 'Festive Outfit Reel', subtitle: 'Ethnic looks styled for celebrations.', thumb: '/portfolio/pihu/r1.jpg' },
      { id: 2, title: 'New Arrival Showcase', subtitle: 'Product-first motion for fresh drops.', thumb: '/portfolio/pihu/r2.jpg' },
      { id: 3, title: 'Styling Transition Reel', subtitle: 'Quick transitions across outfit options.', thumb: '/portfolio/pihu/r3.jpg' },
      { id: 4, title: 'Detail Closeup Cut', subtitle: 'Fabric, embroidery, and finish highlights.', thumb: '/portfolio/pihu/r4.jpg' },
    ],
    campaigns: [
      { id: 1, title: 'Wedding Season Campaign', subtitle: 'Collection launch creative for bridal shoppers.', thumb: '/portfolio/pihu/c1.jpg' },
      { id: 2, title: 'Navratri Lookbook Cut', subtitle: 'Campaign sequence for festive demand.', thumb: '/portfolio/pihu/c2.jpg' },
      { id: 3, title: 'Influencer Try-On Edit', subtitle: 'Creator-led campaign content.', thumb: '/portfolio/pihu/c3.jpg' },
      { id: 4, title: 'Collection Teaser Video', subtitle: 'Building anticipation before launch.', thumb: '/portfolio/pihu/c4.jpg' },
    ],
    offers: [
      { id: 1, title: 'Festive Sale Offer', subtitle: 'Offer-led reel for quick conversions.', thumb: '/portfolio/pihu/o1.jpg' },
      { id: 2, title: 'Buy More Save More Cut', subtitle: 'Clear promo creative for social ads.', thumb: '/portfolio/pihu/o2.jpg' },
      { id: 3, title: 'Weekend Drop Offer', subtitle: 'Urgency-led content for limited stock.', thumb: '/portfolio/pihu/o3.jpg' },
      { id: 4, title: 'Store Visit Promo', subtitle: 'Driving local visits with offer messaging.', thumb: '/portfolio/pihu/o4.jpg' },
    ],
  },
};

export const metadata: Metadata = {
  title: "Portfolio | Suntrix Media",
  description: "Browse our portfolio by client and service type.",
};

export default function PortfolioPage() {
  return (
    <PortfolioLookbook
      clients={clients}
      niches={niches}
      portfolioVideos={portfolioVideos}
    />
  );
}
