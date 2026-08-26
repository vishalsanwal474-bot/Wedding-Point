export const WHY_CHOOSE_ITEMS = [
  {
    title: 'Personalized Planning',
    description:
      'Every celebration is tailored to your story, style, and the details that matter most to you.',
    icon: 'HeartHandshake',
  },
  {
    title: 'Attention to Detail',
    description:
      'From décor to timelines, we refine every element so your day feels seamless and beautifully composed.',
    icon: 'Sparkles',
  },
  {
    title: 'Experienced Team',
    description:
      'A dedicated team with years of wedding expertise guiding you with calm confidence.',
    icon: 'Users',
  },
  {
    title: 'Flexible Packages',
    description:
      'Choose what you need — intimate gatherings or grand celebrations, shaped around your priorities.',
    icon: 'Layers',
  },
  {
    title: 'Stress-Free Experience',
    description:
      'We coordinate the moving pieces so you can be present with the people you love.',
    icon: 'Leaf',
  },
];

export const HERO_SUPPORT = 'Planning · Decorations · Photography · Catering · Entertainment';

export function resolveMediaUrl(path) {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) {
    return path;
  }

  return path.startsWith('/') ? path : `/${path}`;
}
