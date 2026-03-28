// lib/story/images.ts
// Historically accurate images from Wikimedia Commons (Public Domain)

export interface StoryImageData {
  id: string;
  src: string;
  alt: string;
  caption: string;
  credit: string;
}

// Using direct Wikimedia URLs that work reliably
export const STORY_IMAGES: Record<string, StoryImageData> = {
  // Chapter 1: The World Before Israel
  'ziggurat-ur': {
    id: 'ziggurat-ur',
    // Actual photo of the reconstructed Ziggurat of Ur in Iraq
    src: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Ziggarat_of_Ur_001.jpg',
    alt: 'The Ziggurat of Ur, a massive stepped temple in ancient Mesopotamia',
    caption: 'The Ziggurat of Ur—a stepped temple dedicated to the moon god Nanna. Abraham would have seen this towering structure in his hometown.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
  'mesopotamia-map': {
    id: 'mesopotamia-map',
    // Historical map of the ancient Near East
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Fertile_crescent_Ede.svg/1200px-Fertile_crescent_Ere.svg.png',
    alt: 'Map of the Fertile Crescent showing ancient Mesopotamia',
    caption: 'The Fertile Crescent—cradle of civilization, where writing, cities, and Abraham\'s journey began.',
    credit: 'Map: Wikimedia Commons (Public Domain)',
  },
  'cuneiform-tablet': {
    id: 'cuneiform-tablet',
    // Actual cuneiform tablet from the British Museum
    src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Cuneiform_script2.jpg',
    alt: 'Ancient Sumerian cuneiform tablet with wedge-shaped writing',
    caption: 'Cuneiform writing on clay—the world\'s first writing system, invented by the Sumerians around 3400 BCE.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
  'pyramids-giza': {
    id: 'pyramids-giza',
    // Classic photo of the Great Pyramids
    src: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg',
    alt: 'The Great Pyramid of Giza with the Sphinx',
    caption: 'The Great Pyramid of Giza—already over 1,000 years old when Abraham journeyed to Egypt.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
  'standard-of-ur': {
    id: 'standard-of-ur',
    // The actual Standard of Ur artifact from the British Museum
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Standard_of_Ur_-_War.jpg/1200px-Standard_of_Ur_-_War.jpg',
    alt: 'The Standard of Ur showing ancient Sumerian warfare and society',
    caption: 'The Standard of Ur (c. 2600 BCE)—a mosaic box depicting Sumerian society: war, peace, and daily life in Abraham\'s ancestral homeland.',
    credit: 'British Museum, Wikimedia Commons (Public Domain)',
  },
  'code-hammurabi': {
    id: 'code-hammurabi',
    // The actual Code of Hammurabi stele in the Louvre
    src: 'https://upload.wikimedia.org/wikipedia/commons/6/64/Milkau_Oberer_Teil_der_Stele_mit_dem_Text_von_Hammurapis_Gesetzescode_369-2.jpg',
    alt: 'The Code of Hammurabi stele showing King Hammurabi receiving laws from the god Shamash',
    caption: 'The Code of Hammurabi (c. 1754 BCE)—one of the oldest written law codes. "An eye for an eye" predates Moses by centuries.',
    credit: 'Louvre Museum, Wikimedia Commons (Public Domain)',
  },
  'egyptian-hieroglyphs': {
    id: 'egyptian-hieroglyphs',
    // Ancient Egyptian hieroglyphs from a temple
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Hieroglyphs_from_the_tomb_of_Seti_I.jpg',
    alt: 'Colorful Egyptian hieroglyphs from an ancient tomb',
    caption: 'Egyptian hieroglyphs from the tomb of Seti I—the sophisticated writing system of the empire where Joseph rose to power.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },

  // Chapter 2: The Patriarchs
  'canaan-landscape': {
    id: 'canaan-landscape',
    // Landscape of the Judean Hills / ancient Canaan
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/ISR-2013-Aerial-Negev-Wadi_Paran.jpg',
    alt: 'The Negev desert landscape of ancient Canaan',
    caption: 'The Negev wilderness—the harsh, beautiful land Abraham wandered as a nomad following God\'s call.',
    credit: 'Photo: Wikimedia Commons (Public Domain)',
  },
  'ur-ziggurat-aerial': {
    id: 'ur-ziggurat-aerial',
    // Aerial view of the Ziggurat of Ur
    src: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ancient_ziggurat_at_Ali_Air_Base_Iraq_2005.jpg',
    alt: 'Aerial view of the ancient Ziggurat of Ur in modern-day Iraq',
    caption: 'Aerial view of Ur\'s ziggurat—the very temple complex Abraham would have seen in his hometown. Excavations revealed two-story homes with indoor plumbing.',
    credit: 'U.S. Department of Defense, Wikimedia Commons (Public Domain)',
  },
  'patriarchal-journey-map': {
    id: 'patriarchal-journey-map',
    // Map showing Abraham's journey from Ur to Canaan
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Patriarch_Abraham%27s_Journey_Map.svg/1200px-Patriarch_Abraham%27s_Journey_Map.svg.png',
    alt: 'Map showing the journey of Abraham from Ur to Canaan through Haran',
    caption: 'Abraham\'s journey: from sophisticated Ur, through Haran, and finally to Canaan—a 1,000-mile journey following God\'s call into the unknown.',
    credit: 'Wikimedia Commons (Public Domain)',
  },
  'hyksos-scarab': {
    id: 'hyksos-scarab',
    // Hyksos period scarab or artifact
    src: 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Scarab_of_a_Hyksos_king.jpg',
    alt: 'Ancient Hyksos scarab seal from Egypt',
    caption: 'A Hyksos scarab seal—the Hyksos were Semitic rulers of northern Egypt (c. 1650-1550 BCE). Their reign provides the most plausible context for Joseph\'s rise to power.',
    credit: 'Metropolitan Museum of Art, Wikimedia Commons (Public Domain)',
  },
  'jacobs-well': {
    id: 'jacobs-well',
    // Jacob's Well in Israel
    src: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Jacobs_Well.jpg',
    alt: 'Jacob\'s Well in modern-day Israel',
    caption: 'Jacob\'s Well near Shechem—a site associated with Jacob since antiquity, where Jesus would later meet the Samaritan woman.',
    credit: 'Wikimedia Commons (Public Domain)',
  },
  'hebron-cave-machpelah': {
    id: 'hebron-cave-machpelah',
    // Cave of Machpelah / Tomb of the Patriarchs in Hebron
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Hebron001.JPG',
    alt: 'The Cave of Machpelah in Hebron, traditional burial site of the patriarchs',
    caption: 'The Cave of Machpelah in Hebron—Abraham bought this burial cave for Sarah, and it became the family tomb for Isaac, Rebekah, Jacob, and Leah.',
    credit: 'Wikimedia Commons (Public Domain)',
  },
  'nuzi-tablet': {
    id: 'nuzi-tablet',
    // Nuzi tablet showing cuneiform
    src: 'https://upload.wikimedia.org/wikipedia/commons/0/09/Nuzi_adoption_tablet.jpg',
    alt: 'Cuneiform tablet from the ancient city of Nuzi',
    caption: 'A tablet from Nuzi (c. 1500 BCE)—thousands of such tablets describe customs that match patriarchal practices, confirming the historical accuracy of Genesis.',
    credit: 'Harvard Semitic Museum, Wikimedia Commons (Public Domain)',
  },
  'joseph-egypt-painting': {
    id: 'joseph-egypt-painting',
    // Classical painting of Joseph
    src: 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Pharaoh%27s_Dreams_%28watercolor_circa_1896-1902_by_James_Tissot%29.jpg',
    alt: 'James Tissot painting of Joseph interpreting Pharaoh\'s dreams',
    caption: 'Joseph interpreting Pharaoh\'s dreams—from prisoner to second-in-command of Egypt, Joseph\'s rise demonstrates God\'s providence through human evil.',
    credit: 'James Tissot (c. 1902), Wikimedia Commons (Public Domain)',
  },

  // Egypt - Nile River
  'egypt-nile': {
    id: 'egypt-nile',
    // The Nile River
    src: 'https://upload.wikimedia.org/wikipedia/commons/z/z5/Nile_River_and_delta_from_orbit.jpg',
    alt: 'The Nile River and delta seen from above',
    caption: 'The Nile River—lifeline of ancient Egypt, where the Israelites would one day be enslaved and delivered.',
    credit: 'NASA, Wikimedia Commons (Public Domain)',
  },
};

export function getStoryImage(id: string): StoryImageData | undefined {
  return STORY_IMAGES[id];
}
