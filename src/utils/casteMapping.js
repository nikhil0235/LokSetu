// Caste to Category Mapping
export const CASTE_CATEGORIES = {
  GENERAL: 'General',
  OBC: 'OBC',
  SC: 'SC',
  ST: 'ST',
  EBC: 'EBC'
};

export const CASTE_MAPPING = {
  // General Category
  'Brahmin': CASTE_CATEGORIES.GENERAL,
  'Rajput': CASTE_CATEGORIES.GENERAL,
  'Kayastha': CASTE_CATEGORIES.GENERAL,
  'Bania': CASTE_CATEGORIES.GENERAL,
  'Agarwal': CASTE_CATEGORIES.GENERAL,
  'Sharma': CASTE_CATEGORIES.GENERAL,
  'Gupta': CASTE_CATEGORIES.GENERAL,
  'General': CASTE_CATEGORIES.GENERAL,

  // OBC Category
  'Yadav': CASTE_CATEGORIES.OBC,
  'Kurmi': CASTE_CATEGORIES.OBC,
  'Koeri': CASTE_CATEGORIES.OBC,
  'Kushwaha': CASTE_CATEGORIES.OBC,
  'Teli': CASTE_CATEGORIES.OBC,
  'Nai': CASTE_CATEGORIES.OBC,
  'Kumhar': CASTE_CATEGORIES.OBC,
  'Mallah': CASTE_CATEGORIES.OBC,
  'OBC': CASTE_CATEGORIES.OBC,

  // SC Category
  'Chamar': CASTE_CATEGORIES.SC,
  'Paswan': CASTE_CATEGORIES.SC,
  'Dusadh': CASTE_CATEGORIES.SC,
  'Musahar': CASTE_CATEGORIES.SC,
  'Bhumihar': CASTE_CATEGORIES.SC,
  'SC': CASTE_CATEGORIES.SC,

  // ST Category
  'Santhal': CASTE_CATEGORIES.ST,
  'Oraon': CASTE_CATEGORIES.ST,
  'Munda': CASTE_CATEGORIES.ST,
  'Ho': CASTE_CATEGORIES.ST,
  'ST': CASTE_CATEGORIES.ST,

  // EBC Category
  'Extremely Backward': CASTE_CATEGORIES.EBC,
  'EBC': CASTE_CATEGORIES.EBC,
};

export const getCasteCategory = (caste) => {
  return CASTE_MAPPING[caste] || CASTE_CATEGORIES.GENERAL;
};

export const getCastesByCategoryForFilter = () => {
  const categories = {};
  
  Object.entries(CASTE_MAPPING).forEach(([caste, category]) => {
    if (!categories[category]) {
      categories[category] = [];
    }
    if (!categories[category].includes(caste)) {
      categories[category].push(caste);
    }
  });
  
  return categories;
};