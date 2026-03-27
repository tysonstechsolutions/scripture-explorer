// lib/story/images.ts
// Public domain images from Wikimedia Commons for Story chapters

export interface StoryImageData {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
}

export const STORY_IMAGES: Record<string, StoryImageData> = {
  // Chapter 1: The World Before Israel
  'ziggurat-ur': {
    id: 'ziggurat-ur',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Ziggurat_of_ur.jpg/1280px-Ziggurat_of_ur.jpg',
    alt: 'The Ziggurat of Ur in modern-day Iraq',
    caption: 'The Great Ziggurat of Ur, built around 2100 BCE. This is the city Abraham would have known.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
  'mesopotamia-map': {
    id: 'mesopotamia-map',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Fertile_Crescent_map.png/1280px-Fertile_Crescent_map.png',
    alt: 'Map of the Fertile Crescent and ancient Mesopotamia',
    caption: 'The Fertile Crescent: where civilization began and where the biblical story unfolds.',
    credit: 'Map: Wikimedia Commons (Public Domain)',
  },
  'cuneiform-tablet': {
    id: 'cuneiform-tablet',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Cuneiform_tablet-_administrative_account_of_barley_distribution_with_cylinder_seal_impression_of_a_male_figure%2C_hunting_dogs%2C_and_boars_MET_DP163974.jpg/1024px-Cuneiform_tablet-_administrative_account_of_barley_distribution_with_cylinder_seal_impression_of_a_male_figure%2C_hunting_dogs%2C_and_boars_MET_DP163974.jpg',
    alt: 'Ancient Sumerian cuneiform tablet',
    caption: 'A cuneiform tablet from ancient Sumer—the world\'s first writing system.',
    credit: 'Metropolitan Museum of Art (Public Domain)',
  },
  'pyramids-giza': {
    id: 'pyramids-giza',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/1280px-Kheops-Pyramid.jpg',
    alt: 'The Great Pyramid of Giza',
    caption: 'The Great Pyramid at Giza—already a thousand years old by Abraham\'s time.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
  'ancient-near-east': {
    id: 'ancient-near-east',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ancient_Orient.png/1280px-Ancient_Orient.png',
    alt: 'Map of the Ancient Near East',
    caption: 'The ancient Near East: empires rose and fell while Israel\'s story unfolded.',
    credit: 'Map: Wikimedia Commons (Public Domain)',
  },
  'standard-of-ur': {
    id: 'standard-of-ur',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Standard_of_Ur_-_War.jpg/1280px-Standard_of_Ur_-_War.jpg',
    alt: 'The Standard of Ur showing war scenes',
    caption: 'The Standard of Ur (c. 2600 BCE)—showing the sophisticated civilization Abraham left behind.',
    credit: 'British Museum (Public Domain)',
  },
  'code-hammurabi': {
    id: 'code-hammurabi',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/P1050763_Louvre_code_Hammurabi_face_rwk.JPG/800px-P1050763_Louvre_code_Hammurabi_face_rwk.JPG',
    alt: 'The Code of Hammurabi stele',
    caption: 'The Code of Hammurabi (c. 1750 BCE)—one of the earliest written law codes.',
    credit: 'Louvre Museum (Public Domain)',
  },

  // Chapter 2: The Patriarchs
  'canaan-landscape': {
    id: 'canaan-landscape',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/View_of_Judean_desert_from_Mount_Yair.jpg/1280px-View_of_Judean_desert_from_Mount_Yair.jpg',
    alt: 'Landscape of ancient Canaan',
    caption: 'The Judean wilderness—the land Abraham wandered as a nomad.',
    credit: 'Photo: Wikimedia Commons (CC BY-SA)',
  },

  // Egypt
  'egypt-nile': {
    id: 'egypt-nile',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Nile_River_and_delta_from_orbit.jpg/800px-Nile_River_and_delta_from_orbit.jpg',
    alt: 'The Nile River and delta from space',
    caption: 'The Nile River—lifeline of ancient Egypt, where Israel would be enslaved.',
    credit: 'NASA (Public Domain)',
  },
  'egyptian-hieroglyphs': {
    id: 'egyptian-hieroglyphs',
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Hieroglyphs_from_the_tomb_of_Seti_I.jpg/1024px-Hieroglyphs_from_the_tomb_of_Seti_I.jpg',
    alt: 'Egyptian hieroglyphs from the tomb of Seti I',
    caption: 'Egyptian hieroglyphs from the tomb of Seti I—the sophisticated culture Joseph entered.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
};

export function getStoryImage(id: string): StoryImageData | undefined {
  return STORY_IMAGES[id];
}
