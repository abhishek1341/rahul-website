import { BOOK_A_CALL_HREF } from '@/lib/site';

export { BOOK_A_CALL_HREF };

export type ServiceCta = {
  label: string;
  href: string;
};

export type ServiceList = {
  title: string;
  items: string[];
};

export type ServiceProofVideo = {
  src: string;
  caption: string;
};

export type ServiceProofMetric = {
  value: string;
  label: string;
};

export type Service = {
  id: string;
  number: string;
  title: string;
  hook: string;
  intro: string[];
  lists: ServiceList[];
  afterLists?: string[];
  quote?: string;
  cta?: ServiceCta;
  /** Short real-work proof shown when the card is open — video preview. */
  proofVideo?: ServiceProofVideo;
  /** Real number already surfaced elsewhere on this page (never invented). */
  proofMetric?: ServiceProofMetric;
};

export const services: Service[] = [
  {
    id: 'content-creation',
    number: '01',
    title: 'Content Creation',
    hook: 'Content people actually want to watch.',
    intro: [
      'We create social-first content designed around your brand, audience and business objectives.',
      'From concept development to final delivery, we create content that feels native to the platform while staying consistent with your brand identity.',
    ],
    lists: [
      {
        title: 'What We Create',
        items: [
          'Instagram Reels',
          'Short-form videos',
          'Product content',
          'Lifestyle content',
          'UGC-style videos',
          'Founder-led content',
          'Behind-the-scenes content',
          'Promotional content',
          'Ad creatives',
          'Static creatives',
          'Carousels',
          'Motion graphics',
          'Hooks and concepts',
          'Script writing',
          'Video editing',
        ],
      },
    ],
    afterLists: ['Whether the goal is awareness, engagement or sales, every piece of content is created with purpose.'],
    proofVideo: {
      src: '/Low%20mb%20videos/Coffee/COFFEE%20MAKING%201.mp4',
      caption: 'A recent short-form piece — the same style we build for every brand.',
    },
    cta: { label: 'VIEW OUR WORK', href: '/portfolio' },
  },
  {
    id: 'video-production',
    number: '02',
    title: 'Video Production',
    hook: 'From idea to final frame.',
    intro: [
      'We produce professional videos built around strong storytelling, visual direction and brand identity.',
      'From social campaigns to brand films and product videos, our team handles the complete production process.',
    ],
    lists: [
      {
        title: 'Video Production Services',
        items: [
          'Brand films',
          'Commercial videos',
          'Product videos',
          'Corporate videos',
          'Social media campaigns',
          'Promotional videos',
          'Founder videos',
          'Testimonial videos',
          'Restaurant and hospitality videos',
          'Fashion shoots',
          'Jewellery shoots',
          'Real estate videos',
          'Event coverage',
          'Interview-style videos',
          'Podcast production',
          'Cinematic reels',
        ],
      },
      {
        title: 'Production Includes',
        items: [
          'Concept development',
          'Creative direction',
          'Script development',
          'Storyboarding',
          'Shoot planning',
          'Location planning',
          'Production',
          'Direction',
          'Cinematography',
          'Editing',
          'Color grading',
          'Sound design',
          'Motion graphics',
          'Final delivery',
        ],
      },
    ],
    quote:
      "We don't just shoot videos. We create visuals that make people stop, watch and remember the brand.",
    proofVideo: {
      src: '/Low%20mb%20videos/Gym/NIKE%20X%20ON%20TOUR.mp4',
      caption: 'Full production, one team — from concept to final grade.',
    },
  },
  {
    id: 'social-media-management',
    number: '03',
    title: 'Social Media Management',
    hook: 'More than just posting.',
    intro: [
      "Social media works best when every post is part of a bigger strategy.",
      "We manage your brand's presence across social platforms with consistent content, communication and performance tracking.",
    ],
    lists: [
      {
        title: "What's Included",
        items: [
          'Monthly social media strategy',
          'Content calendars',
          'Instagram management',
          'Facebook management',
          'LinkedIn management',
          'Content planning',
          'Caption writing',
          'Posting and scheduling',
          'Keyword strategy',
          'Story planning',
          'Community management',
          'Profile optimization',
          'Trend research',
          'Monthly performance analysis',
          'Growth recommendations',
        ],
      },
    ],
    afterLists: ['Our focus is building a brand people recognize, remember and trust.'],
    proofVideo: {
      src: '/Low%20mb%20videos/Coffee/COFFEE%20PARTY.mp4',
      caption: 'Part of a live monthly content calendar in the field.',
    },
  },
  {
    id: 'meta-ads',
    number: '04',
    title: 'Meta Ads & Performance Marketing',
    hook: 'Turn attention into measurable growth.',
    intro: [
      'Strong creative is only part of the equation.',
      'We build and manage Facebook and Instagram advertising campaigns designed around real business objectives.',
    ],
    lists: [
      {
        title: 'Campaign Objectives',
        items: [
          'Lead generation',
          'Online sales',
          'WhatsApp enquiries',
          'Website conversions',
          'Store visits',
          'Brand awareness',
          'Website traffic',
          'Retargeting',
          'Event promotion',
          'Product launches',
        ],
      },
      {
        title: 'What We Handle',
        items: [
          'Campaign strategy',
          'Audience research',
          'Campaign setup',
          'Tracking and pixel review',
          'Creative testing',
          'Audience testing',
          'Offer testing',
          'Retargeting',
          'Budget optimization',
          'Daily monitoring',
          'Campaign optimization',
          'Scaling winning campaigns',
          'Reporting and insights',
        ],
      },
    ],
    afterLists: ['We continuously test creative, audience, messaging and offers to improve performance.'],
    proofMetric: { value: '₹1Cr+', label: 'Ad spend managed across live campaigns.' },
  },
  {
    id: 'lead-generation',
    number: '05',
    title: 'Lead Generation',
    hook: 'Generate enquiries that can become customers.',
    intro: [
      'We create performance-driven lead generation systems designed to connect businesses with potential customers.',
      'Instead of chasing only likes, reach and impressions, we build campaigns focused on generating meaningful enquiries.',
    ],
    lists: [
      {
        title: 'Lead Generation Services',
        items: [
          'Meta lead campaigns',
          'WhatsApp lead generation',
          'Landing-page campaigns',
          'Lead forms',
          'Audience targeting',
          'Retargeting',
          'Funnel strategy',
          'Creative development',
          'Campaign optimization',
          'Lead quality improvement',
          'Conversion tracking',
        ],
      },
      {
        title: 'Industries We Work With',
        items: [
          'Real Estate',
          'Recruitment',
          'Restaurants & Hospitality',
          'Jewellery',
          'Education',
          'Financial Services',
          'Professional Services',
          'Local Businesses',
          'B2B Companies',
          'E-commerce Brands',
        ],
      },
    ],
    proofMetric: { value: '50,000+', label: 'Leads generated for clients to date.' },
  },
  {
    id: 'influencer-marketing',
    number: '06',
    title: 'Influencer Marketing',
    hook: 'Put your brand in front of the right audience.',
    intro: [
      "Influencer marketing isn't about working with the biggest creator.",
      "It's about finding the right creator for the right audience.",
      'We help brands plan and execute influencer campaigns that feel authentic, generate attention and support broader marketing goals.',
    ],
    lists: [
      {
        title: 'What We Handle',
        items: [
          'Influencer campaign strategy',
          'Creator research',
          'Influencer shortlisting',
          'Micro and macro influencer campaigns',
          'Creator outreach',
          'Negotiation and coordination',
          'Campaign briefing',
          'Content guidelines',
          'Deliverable planning',
          'Campaign management',
          'Influencer event collaborations',
          'Product seeding campaigns',
          'UGC creator campaigns',
          'Content approvals',
          'Performance tracking',
          'Campaign reporting',
        ],
      },
      {
        title: 'Campaign Goals Can Include',
        items: [
          'Brand awareness',
          'Product launches',
          'Restaurant promotions',
          'Event promotion',
          'Store visits',
          'Social proof',
          'UGC generation',
          'Product discovery',
          'Audience growth',
        ],
      },
    ],
    afterLists: [
      'The goal is not simply to get influencers to post.',
      "It's to create collaborations that make sense for the brand and the audience.",
    ],
    proofVideo: {
      src: '/Low%20mb%20videos/Influencer/Brands/brands-clip-03.mp4',
      caption: 'A recent influencer activation we produced end to end.',
    },
  },
  {
    id: 'personal-branding',
    number: '07',
    title: 'Personal Branding',
    hook: 'Build authority around the person behind the brand.',
    intro: [
      'People connect with people.',
      'We help founders, entrepreneurs, executives and professionals build personal brands that create credibility, trust and business opportunities.',
    ],
    lists: [
      {
        title: 'What We Handle',
        items: [
          'Personal brand positioning',
          'Content strategy',
          'Founder-led content',
          'Reel concepts',
          'Script writing',
          'Shoot planning',
          'Talking-head videos',
          'Podcast-style content',
          'Educational content',
          'Storytelling',
          'Editing',
          'LinkedIn content',
          'Instagram content',
          'Thought-leadership strategy',
        ],
      },
    ],
    afterLists: [
      'Whether the objective is generating business, building credibility or growing an audience, we create a content system around your personality and expertise.',
    ],
    proofVideo: {
      src: '/Low%20mb%20videos/Influencer/Seriers/day-07.mp4',
      caption: 'A founder-led series episode, built entirely in-house.',
    },
  },
  {
    id: 'website-development',
    number: '08',
    title: 'Website Development',
    hook: 'Your website should do more than just look good.',
    intro: [
      'We design and develop modern websites built to strengthen your brand, improve credibility and turn visitors into customers.',
      'Every website is designed around the user journey and your business goals.',
    ],
    lists: [
      {
        title: 'Website Development Services',
        items: [
          'Business websites',
          'Corporate websites',
          'Portfolio websites',
          'Landing pages',
          'E-commerce websites',
          'Shopify development',
          'WordPress development',
          'Custom website development',
          'Website redesign',
          'Mobile-responsive development',
          'UI/UX improvements',
          'Lead-generation websites',
          'Conversion-focused landing pages',
        ],
      },
      {
        title: 'What We Focus On',
        items: [
          'Premium visual design',
          'Mobile-first experience',
          'Clear navigation',
          'Fast loading',
          'Strong calls-to-action',
          'SEO-friendly structure',
          'Conversion optimization',
          'Brand consistency',
          'User experience',
          'Responsive design',
        ],
      },
    ],
    afterLists: [
      'From strategy and structure to design, development and launch, we create websites that properly represent your business.',
    ],
    cta: { label: 'DISCUSS YOUR WEBSITE', href: BOOK_A_CALL_HREF },
  },
  {
    id: 'ai-video-generation',
    number: '09',
    title: 'AI Video Generation',
    hook: "Create what traditional production can't.",
    intro: [
      'We combine emerging AI technology with human creative direction to create visuals, videos and concepts that would otherwise require significantly larger production setups.',
      "AI is not the strategy.",
      "It's another tool we use to execute bigger ideas.",
    ],
    lists: [
      {
        title: 'AI Creative Services',
        items: [
          'AI-generated brand videos',
          'AI commercials',
          'Cinematic AI videos',
          'AI social media content',
          'AI ad creatives',
          'AI product videos',
          'AI fashion visuals',
          'AI model videos',
          'Product visualization',
          'Image-to-video animation',
          'AI storytelling',
          'AI avatars',
          'AI voiceovers',
          'AI-enhanced editing',
          'AI motion concepts',
          'Concept visualization',
        ],
      },
      {
        title: 'Ideal For',
        items: [
          'Product launches',
          'Advertising campaigns',
          'Social media campaigns',
          'Fashion',
          'Jewellery',
          'Restaurants',
          'Real estate',
          'Events',
          'Personal brands',
          'Concept-driven campaigns',
          'High-volume creative testing',
        ],
      },
    ],
    afterLists: [
      'Our focus is making AI content feel intentional, premium and brand-led, rather than obviously AI-generated.',
    ],
    proofVideo: {
      src: '/Low%20mb%20videos/Jewelery/OLD%20SCHOOL%20ERA.mp4',
      caption: 'A taste of the visual polish behind every deliverable.',
    },
  },
  {
    id: 'creative-strategy',
    number: '10',
    title: 'Creative Strategy & Campaigns',
    hook: 'Good marketing starts before the camera turns on.',
    intro: [
      'A strong campaign needs more than a good-looking creative.',
      'We develop ideas, messaging and campaign concepts around a clear objective before execution begins.',
    ],
    lists: [
      {
        title: 'Creative Strategy Services',
        items: [
          'Campaign concepts',
          'Creative direction',
          'Brand campaign strategy',
          'Product-launch campaigns',
          'Promotional campaigns',
          'Seasonal campaigns',
          'Festive campaigns',
          'Event campaigns',
          'Offer campaigns',
          'Ad creative strategy',
          'Content concepts',
          'Campaign messaging',
          'Copy direction',
          'Visual direction',
          'Multi-platform campaign planning',
        ],
      },
    ],
    afterLists: ['From the first idea to the final execution, every campaign is designed to communicate one clear message.'],
    quote: "Ideas don't build brands. Execution does.",
    proofVideo: {
      src: '/Low%20mb%20videos/bts/STORY%20BTS.mp4',
      caption: 'Behind the scenes on a live campaign shoot.',
    },
  },
];

export const processSteps = [
  {
    number: '01',
    title: 'Understand',
    body: 'We start by understanding your business, audience, competition, challenges and goals.',
  },
  {
    number: '02',
    title: 'Strategize',
    body: 'We identify the content, platforms, campaigns and opportunities that make the most sense for your brand.',
  },
  {
    number: '03',
    title: 'Create',
    body: 'Our team develops the concepts, scripts, designs, shoots, videos, websites and creative assets needed for execution.',
  },
  {
    number: '04',
    title: 'Execute',
    body: 'Content goes live, campaigns launch, influencers activate and digital experiences are delivered.',
  },
  {
    number: '05',
    title: 'Optimize',
    body: 'We analyze performance, test new ideas and continuously improve based on what the data tells us.',
  },
];

export const whyPoints = [
  {
    title: 'Strategy Before Execution',
    body: 'We understand the objective before deciding what needs to be created.',
  },
  {
    title: 'Creative + Performance',
    body: 'Creative decisions are made with performance and business outcomes in mind.',
  },
  {
    title: 'Production Under One Roof',
    body: 'From concepts and shoots to editing, campaigns and digital execution, our capabilities work together.',
  },
  {
    title: 'Modern Technology',
    body: 'We combine traditional production with modern tools, including AI, to execute ideas faster and more creatively.',
  },
  {
    title: 'Constant Testing',
    body: "We don't rely on assumptions. We test creatives, messaging, audiences and campaigns.",
  },
  {
    title: 'Built Around Your Brand',
    body: 'No copy-paste strategies.\nEvery brand has a different audience, challenge and opportunity.',
  },
];

export const serviceStats = [
  { value: 1, prefix: '₹', suffix: 'Cr+', label: 'Ad Spend Managed' },
  { value: 50000, prefix: '', suffix: '+', label: 'Leads Generated', format: 'locale' as const },
  { value: 3, prefix: '', suffix: '+', label: 'Years — Performance Marketing Experience' },
];
