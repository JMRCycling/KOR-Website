export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: 'maintenance' | 'ride-planning' | 'cycling-basics';
  tags: string[];
  datePublished: string;
  dateModified: string;
  heroImage: string;
  heroImageAlt: string;
  author: string;
  schemaType: 'Article' | 'HowTo' | 'FAQPage';
  readingTime: number;
  related: string[];
}

export const articles: ArticleMeta[] = [
  {
    slug: 'bottom-bracket-creaking',
    title: 'Bottom Bracket Creaking? Diagnosis & Replacement Guide',
    description:
      'A creaking BB often isn\'t the BB. Diagnose the 5 most common creak sources, check bearing wear, and know when your 3,000–10,000-mile bottom bracket is due.',
    category: 'maintenance',
    tags: ['bottom bracket', 'bottom bracket creaking', 'bike maintenance', 'press-fit', 'drivetrain'],
    datePublished: '2026-06-21',
    dateModified: '2026-06-21',
    heroImage: '/images/articles/bottom-bracket-creaking.webp',
    heroImageAlt:
      'Bike mechanic working on a bicycle drivetrain in a clean professional workshop with tools organized on the wall',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'when-to-replace-cassette'],
  },
  {
    slug: 'dropper-post-maintenance',
    title: 'Dropper Post Maintenance: Service Intervals & Care',
    description:
      'Service your dropper post every 100–200 ride hours. Learn the sag and slow-return warning signs, daily care tips, and when a shop visit saves the post.',
    category: 'maintenance',
    tags: ['dropper post', 'dropper post maintenance', 'mountain bike', 'MTB', 'bike maintenance'],
    datePublished: '2026-06-20',
    dateModified: '2026-06-20',
    heroImage: '/images/articles/dropper-post-maintenance.webp',
    heroImageAlt:
      'Mountain biker descending a technical trail with dropper post visible, natural outdoor lighting, action shot',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'suspension-service-intervals'],
  },
  {
    slug: 'suspension-service-intervals',
    title: 'Fork & Shock Service Intervals: The Hour-Based Guide',
    description:
      'Service your MTB fork every 50 hours, full damper rebuild at 100–200 hours. Learn the symptoms, Fox vs. RockShox intervals, and why delay costs more.',
    category: 'maintenance',
    tags: ['MTB suspension', 'fork service', 'shock service', 'suspension maintenance', 'mountain bike'],
    datePublished: '2026-06-19',
    dateModified: '2026-06-19',
    heroImage: '/images/articles/suspension-service-intervals.webp',
    heroImageAlt:
      'Mountain bike fork suspension detail close-up on a trail, natural outdoor lighting, ultra-realistic 16:9',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 8,
    related: ['bike-maintenance-schedule', 'dropper-post-maintenance'],
  },
  {
    slug: 'tubeless-sealant-how-often',
    title: 'How Often to Add Tubeless Sealant (Hours & Months)',
    description:
      'Refresh tubeless sealant every 2–6 months or 40–60 ride hours. Learn the dipstick check, when to top up vs. fully refresh, and signs sealant has dried out.',
    category: 'maintenance',
    tags: ['tubeless sealant', 'tubeless tires', 'maintenance', 'MTB', 'tire maintenance'],
    datePublished: '2026-06-18',
    dateModified: '2026-06-18',
    heroImage: '/images/articles/tubeless-sealant-how-often.webp',
    heroImageAlt:
      'Mountain bike tire on rocky trail showing knobby tread close-up, outdoor natural lighting',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'when-to-replace-bike-tires'],
  },
  {
    slug: 'when-to-replace-bike-tires',
    title: 'When to Replace Bike Tires: Mileage & 6 Wear Signs',
    description:
      'Bike tires last 1,000–3,000 miles on the road, less for MTB. Six wear signs — squared tread, casing threads, sidewall cracks — tell you when to replace.',
    category: 'maintenance',
    tags: ['bike tires', 'tire wear', 'maintenance', 'MTB', 'road bike'],
    datePublished: '2026-06-17',
    dateModified: '2026-06-17',
    heroImage: '/images/articles/when-to-replace-bike-tires.webp',
    heroImageAlt:
      'Mountain bike tire on rocky trail showing knobby tread close-up, outdoor natural lighting, ultra-realistic 16:9',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 8,
    related: ['bike-maintenance-schedule', 'tubeless-sealant-how-often', 'pre-ride-bike-check'],
  },
  {
    slug: 'how-often-bleed-disc-brakes',
    title: 'How Often to Bleed Disc Brakes (MTB & Road)',
    description:
      'Bleed disc brakes every 6–12 months or when the lever feels spongy. Learn mineral oil vs. DOT fluid intervals, warning signs, and when to visit a shop.',
    category: 'maintenance',
    tags: ['disc brakes', 'brake bleed', 'brake maintenance', 'mineral oil', 'DOT fluid'],
    datePublished: '2026-06-16',
    dateModified: '2026-06-16',
    heroImage: '/images/articles/how-often-bleed-disc-brakes.webp',
    heroImageAlt: 'Mountain bike hydraulic disc brake caliper and rotor detail close-up on a dusty trail, natural light',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'when-to-replace-brake-pads', 'when-to-replace-brake-rotors'],
  },
  {
    slug: 'when-to-replace-brake-rotors',
    title: 'When to Replace Bike Brake Rotors (Thickness Guide)',
    description:
      'Bike rotors need replacement at 1.5 mm thickness. Learn to measure with calipers, spot warping vs. contamination, and use the 2–4 pad-set lifespan rule.',
    category: 'maintenance',
    tags: ['brake rotors', 'disc brakes', 'brakes', 'maintenance', 'rotor wear'],
    datePublished: '2026-06-13',
    dateModified: '2026-06-13',
    heroImage: '/images/articles/when-to-replace-brake-rotors.webp',
    heroImageAlt: 'Mountain bike disc brake rotor and hydraulic caliper close-up with trail background, natural light',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'when-to-replace-brake-pads', 'how-often-bleed-disc-brakes'],
  },
  {
    slug: 'when-to-replace-brake-pads',
    title: 'When to Replace Bike Brake Pads: Wear Signs & Intervals',
    description:
      'Resin pads last 500–1,000 miles; metallic up to 1,500. Learn the 1.5 mm minimum, how to spot worn pads by sound and feel, and how to bed in replacements.',
    category: 'maintenance',
    tags: ['brake pads', 'disc brakes', 'brakes', 'maintenance', 'brake wear'],
    datePublished: '2026-06-12',
    dateModified: '2026-06-12',
    heroImage: '/images/articles/when-to-replace-brake-pads.webp',
    heroImageAlt: 'Mountain bike disc brake rotor and caliper close-up detail on a trail, shallow depth of field',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'when-to-replace-brake-rotors', 'how-often-bleed-disc-brakes'],
  },
  {
    slug: 'when-to-replace-cassette',
    title: 'When to Replace Your Cassette (and Chainrings)',
    description:
      'Replace your cassette every 2–3 chains to avoid skipping and expensive repairs. Learn the wear signs, shark-tooth test, and chainring replacement timing.',
    category: 'maintenance',
    tags: ['cassette', 'chainring', 'drivetrain', 'maintenance', 'cassette wear'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/when-to-replace-cassette.webp',
    heroImageAlt: 'Bicycle cassette showing worn teeth and drivetrain close-up on a mountain bike',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'when-to-replace-bike-chain', 'how-to-measure-chain-wear'],
  },
  {
    slug: 'how-to-measure-chain-wear',
    title: 'How to Measure Chain Wear: Checker Tool & Ruler Methods',
    description:
      'Step-by-step guide to measuring bike chain wear with a chain checker or 12-inch ruler. Know the 0.5% threshold and when to replace before cassette damage occurs.',
    category: 'maintenance',
    tags: ['chain wear', 'chain checker', 'drivetrain', 'maintenance', 'chain measurement'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/how-to-measure-chain-wear.webp',
    heroImageAlt:
      'Red Park Tool chain wear indicator gauge inserted into bicycle chain links, macro close-up',
    author: 'KOR Cycling Team',
    schemaType: 'HowTo',
    readingTime: 6,
    related: ['bike-maintenance-schedule', 'when-to-replace-bike-chain', 'when-to-replace-cassette'],
  },
  {
    slug: 'when-to-replace-bike-chain',
    title: 'When to Replace Your Bike Chain (Mileage + Wear Signs)',
    description:
      'Know exactly when to replace your bike chain: the 0.5% wear rule, mileage ranges by speed, and the cost of waiting too long. Drivetrain lifespan explained.',
    category: 'maintenance',
    tags: ['chain', 'drivetrain', 'maintenance', 'chain wear', 'chain replacement'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/when-to-replace-bike-chain.webp',
    heroImageAlt: 'Close-up of a bicycle chain and cassette showing drivetrain wear on a mountain bike',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 7,
    related: ['bike-maintenance-schedule', 'how-to-measure-chain-wear', 'when-to-replace-cassette'],
  },
  {
    slug: 'bike-maintenance-schedule',
    title: 'Bike Maintenance Schedule: What to Service and When',
    description:
      'Complete bike maintenance schedule: chain, cassette, brakes, tires, suspension & more — with mileage intervals, checklists, and a master component table.',
    category: 'maintenance',
    tags: ['maintenance', 'bike care', 'chain', 'brakes', 'tires', 'suspension'],
    datePublished: '2026-06-11',
    dateModified: '2026-06-11',
    heroImage: '/images/articles/bike-maintenance-schedule.webp',
    heroImageAlt: 'Cyclist performing maintenance on a clean mountain bike outdoors in natural light',
    author: 'KOR Cycling Team',
    schemaType: 'Article',
    readingTime: 12,
    related: ['when-to-replace-bike-chain', 'how-to-measure-chain-wear', 'when-to-replace-cassette'],
  },
];
