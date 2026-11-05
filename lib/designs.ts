// Copy for the twenty design pages (/designs/[id]). One entry per theme id in lib/themes.ts.
// `keyword` is the phrase a couple would search for; `text` describes what a guest actually sees.

export type DesignCopy = {
  keyword: string; // e.g. "dusty blue wedding invitation"
  colours: string;
  flowers: string;
  seal: string;
  bestFor: string;
  text: string;
};

export const DESIGN_COPY: Record<string, DesignCopy> = {
  "dusty-blue": {
    keyword: "dusty blue wedding invitation",
    colours: "Dusty blue, soft grey and silver",
    flowers: "Eucalyptus with small white blooms",
    seal: "Silver wax pressed with a laurel wreath",
    bestFor: "Spring and summer weddings, garden and coastal venues",
    text: "A slate-blue paper envelope closed with a silver laurel seal, a spray of eucalyptus at its corner. Inside, the invitation is set in Newsreader, a calm book serif, on cool blue and ivory pages.",
  },
  "olive-grove": {
    keyword: "olive green wedding invitation",
    colours: "Olive green, cream and warm white",
    flowers: "White garden roses and olive branches",
    seal: "Deep olive wax with a laurel ring",
    bestFor: "Vineyard, farm and Mediterranean weddings",
    text: "Olive-green paper, white garden roses and silver-leaved olive branches, sealed in dark green wax. The type is Sentient, a warm serif that suits a long table under the trees.",
  },
  "blush-peony": {
    keyword: "blush pink wedding invitation",
    colours: "Blush pink, rose gold and ivory",
    flowers: "Pink and white peonies",
    seal: "Rose-gold wax with a ring of small roses",
    bestFor: "Spring weddings, romantic and garden celebrations",
    text: "Soft blush paper with full peonies and a rose-gold seal. The names are set in Boska, an elegant high-contrast serif, and the pages stay light and airy.",
  },
  "desert-boho": {
    keyword: "boho terracotta wedding invitation",
    colours: "Terracotta, sand and cream",
    flowers: "Pampas grass, dried palms and burnt-orange roses",
    seal: "Terracotta wax with a leaf wreath",
    bestFor: "Desert, boho and outdoor autumn weddings",
    text: "Burnt-orange paper, pampas grass and dried palm leaves, sealed in terracotta wax. Set in Bricolage Grotesque, a relaxed modern face, for a warm, sun-baked feel.",
  },
  "midnight-gold": {
    keyword: "navy and gold wedding invitation",
    colours: "Midnight navy, gold and champagne",
    flowers: "Magnolia and gold-leaf foliage",
    seal: "Gold wax with moons and stars",
    bestFor: "Evening, winter and celestial-themed weddings",
    text: "Deep navy paper scattered with gold leaf, white magnolia and a gold seal stamped with moons and stars. The names are set in Zodiak capitals, fine and formal.",
  },
  "burgundy-rose": {
    keyword: "burgundy wedding invitation",
    colours: "Burgundy, wine red and blush",
    flowers: "Wine-dark roses and dark ranunculus",
    seal: "Burgundy wax with a ring of roses",
    bestFor: "Autumn and winter weddings, candlelit evening receptions",
    text: "Wine-red paper with dark roses and a burgundy seal ringed with carved roses. Set in Gambarino, a modern serif with soft curves, on deep red and blush pages.",
  },
  "provence-lavender": {
    keyword: "lavender wedding invitation",
    colours: "Lavender, lilac and white",
    flowers: "Lavender, wisteria and sweet peas",
    seal: "Lilac wax with a laurel wreath",
    bestFor: "Summer weddings, countryside and French-inspired celebrations",
    text: "Lilac paper with lavender, wisteria and sweet peas, closed with a pale purple seal. The names are set in Imbue, a tall condensed serif, in the colours of a Provence field.",
  },
  "black-tie": {
    keyword: "black and white wedding invitation",
    colours: "Black, white and silver",
    flowers: "White calla lilies and orchids",
    seal: "Black wax with an Art Deco sunburst",
    bestFor: "Formal, black-tie and city evening weddings",
    text: "A black paper envelope with white calla lilies and a black seal pressed with an Art Deco sunburst. Set in Bodoni capitals for a formal, high-contrast invitation.",
  },
  "emerald-gold": {
    keyword: "emerald green and gold wedding invitation",
    colours: "Emerald green, gold and white",
    flowers: "White orchids and gold-leaf ferns",
    seal: "Gold wax with a fern wreath",
    bestFor: "Luxury, tropical and evening weddings",
    text: "Velvet-green paper with white orchids and gilded ferns, sealed in gold. Bodoni capitals and emerald pages give it the feel of a grand hotel ballroom.",
  },
  "ivory-pearl": {
    keyword: "ivory wedding invitation",
    colours: "Ivory, pearl and soft green",
    flowers: "White roses and lily of the valley",
    seal: "Pearl-white wax with a beaded rim",
    bestFor: "Classic, church and all-white weddings",
    text: "Cream paper with white roses and lily of the valley, closed with a pearl seal. Set in Erode, a gentle serif, it is the quietest and most classic of the twenty.",
  },
  "champagne-gold": {
    keyword: "champagne and gold wedding invitation",
    colours: "Champagne, cream and gold",
    flowers: "Cream ranunculus and gilded eucalyptus",
    seal: "Gold wax with a wheat wreath",
    bestFor: "Elegant neutral weddings in any season",
    text: "Champagne paper with cream ranunculus and gilded eucalyptus under a gold seal. The names are set in Imbue, tall and refined, on warm neutral pages.",
  },
  "marble-gold": {
    keyword: "marble and gold wedding invitation",
    colours: "White marble, grey veining and gold",
    flowers: "White tulips",
    seal: "Bright gold wax with a Greek key border",
    bestFor: "Modern, minimalist and city weddings",
    text: "Carrara marble with white tulips and a bright gold seal edged with a Greek key. Zodiak capitals keep it clean and modern.",
  },
  "plum-gold": {
    keyword: "plum wedding invitation",
    colours: "Plum, aubergine and gold",
    flowers: "Dark dahlias, blackberries and gold leaves",
    seal: "Gold wax with a floral ring",
    bestFor: "Autumn, winter and moody evening weddings",
    text: "Deep plum paper with dark dahlias, blackberries and a gold seal. Set in Gambarino, it is rich and dramatic without being heavy.",
  },
  "mocha-cream": {
    keyword: "brown and cream wedding invitation",
    colours: "Mocha brown, café au lait and cream",
    flowers: "Café-au-lait roses",
    seal: "Bronze wax with a beaded ring",
    bestFor: "Autumn weddings, rustic and earthy palettes",
    text: "Chocolate-brown paper with café-au-lait roses and a bronze seal. The type is Sentient, warm and readable, on cream and mocha pages.",
  },
  "slate-silver": {
    keyword: "grey and silver wedding invitation",
    colours: "Slate grey, silver and white",
    flowers: "White anemones and dusty miller",
    seal: "Silver wax with a floral ring",
    bestFor: "Winter, modern and understated weddings",
    text: "Slate-grey paper with white anemones and silver dusty miller, sealed in silver. Set in Erode for a cool, modern invitation.",
  },
  "peacock-gold": {
    keyword: "teal and gold wedding invitation",
    colours: "Peacock teal, gold and white",
    flowers: "Peacock feathers and white roses",
    seal: "Gold wax with a rosette ring",
    bestFor: "Bold, colourful and destination weddings",
    text: "Deep teal paper with peacock feathers, white roses and a gold seal. Zodiak capitals give the jewel tones a crisp frame.",
  },
  "ice-blue": {
    keyword: "light blue winter wedding invitation",
    colours: "Ice blue, silver and white",
    flowers: "White roses and frosted leaves",
    seal: "Pale blue wax with a starry rim",
    bestFor: "Winter weddings and snowy venues",
    text: "Pale ice-blue paper with white roses and frosted leaves under a pale blue seal. Set in Newsreader, it feels like a clear winter morning.",
  },
  "ivory-noir": {
    keyword: "ivory and black wedding invitation",
    colours: "Ivory, black and white",
    flowers: "White peonies",
    seal: "Black wax",
    bestFor: "Modern classic and formal weddings",
    text: "Ivory paper with white peonies closed with a glossy black seal. Bodoni capitals make the contrast sharp and timeless.",
  },
  "sage-gold": {
    keyword: "sage green wedding invitation",
    colours: "Sage green, ivory and gold",
    flowers: "Ivory roses and eucalyptus",
    seal: "Gold wax with a floral ring",
    bestFor: "Spring and summer weddings, greenery and garden themes",
    text: "Soft sage paper with ivory roses, eucalyptus and a gold seal. Set in Boska, it is fresh, green and gently formal.",
  },
  "dusty-mauve": {
    keyword: "dusty mauve wedding invitation",
    colours: "Dusty mauve, rose and blush",
    flowers: "Mauve roses",
    seal: "Rose-gold wax with a ring of small flowers",
    bestFor: "Romantic weddings in late summer and autumn",
    text: "Muted mauve paper with mauve roses and a rose-gold seal. The names are set in Imbue, tall and graceful, on rose and blush pages.",
  },
};
