import { blankInvite } from "./defaults";
import type { InviteData } from "./types";
import type { Language } from "./i18n/types";

const LOCALIZED_DEMO: Record<Language, Partial<InviteData>> = {
  en: {
    partner1: "Amelia",
    partner2: "Julian",
    initials: "A&J",
    hostLine: "Together with their families",
    inviteLine: "request the pleasure of your company at the celebration of their marriage",
    venueName: "The Garden Estate",
    venueAddress: "12 Rosewood Lane, Napa, California",
    storyTitle: "Our Story",
    storyText:
      "We met on a rainy afternoon in a tiny bookshop and never stopped talking. Years of adventures, quiet Sundays and one very nervous question later, we're getting married, and we would love for you to be there.",
    schedule: [
      { time: "16:00", title: "Ceremony", note: "Rose Garden" },
      { time: "17:00", title: "Cocktail Hour", note: "The Terrace" },
      { time: "18:30", title: "Dinner & Toasts", note: "Grand Hall" },
      { time: "20:30", title: "Dancing", note: "Until late" },
    ],
    dressCode: "Formal attire. We kindly ask our guests to wear soft, muted tones.",
    accommodation: "We have reserved a block of rooms at a nearby boutique hotel. Please mention our names when booking.",
    closingLine: "We can't wait to celebrate with you",
    faqs: [
      { q: "Can I bring a plus one?", a: "Your invitation will show how many seats are reserved for you in the RSVP form." },
      { q: "Are children welcome?", a: "We love your little ones, but we have chosen to make our day an adults-only celebration." },
      { q: "Is there parking available?", a: "Yes, complimentary valet and self-parking are provided at the venue." },
    ],
  },
  tr: {
    partner1: "Defne",
    partner2: "Emre",
    initials: "D&E",
    hostLine: "Ailelerimizle birlikte",
    inviteLine: "düğün törenimizde sizleri aramızda görmekten mutluluk duyarız",
    venueName: "Sait Halim Paşa Yalısı",
    venueAddress: "Köybaşı Caddesi No:83, Yeniköy, Sarıyer, İstanbul",
    storyTitle: "Bizim Hikayemiz",
    storyText:
      "Yağmurlu bir sonbahar gününde küçük bir kitapçıda karşılaştık ve sohbetimiz hiç bitmedi. Yıllar süren maceralar, huzurlu pazarlar ve heyecan dolu bir evlilik teklifinin ardından evleniyoruz. Bu özel günümüzde yanımızda olmanız bizi çok mutlu edecek.",
    schedule: [
      { time: "16:00", title: "Nikah Töreni", note: "Boğaz Manzaralı Bahçe" },
      { time: "17:00", title: "Kokteyl Saati", note: "Rıhtım Terası" },
      { time: "18:30", title: "Akşam Yemeği & Kutlama", note: "Büyük Balo Salonu" },
      { time: "20:30", title: "Dans & Parti", note: "Gecenin sonuna kadar" },
    ],
    dressCode: "Resmi kıyafet (Formal). Misafirlerimizden soft ve pastel tonları tercih etmelerini rica ederiz.",
    accommodation: "Şehir dışından gelecek konuklarımız için yakındaki otelde özel indirim tanımlanmıştır.",
    closingLine: "Bu özel günümüzde yanımızda olmanız dileğiyle",
    faqs: [
      { q: "Yanımda ek misafir getirebilir miyim?", a: "LCV formunda adınıza kaç kişilik yer ayrıldığı açıkça belirtilmiştir." },
      { q: "Çocuklar davetli mi?", a: "Minikleri çok seviyoruz ancak düğünümüzün sadece yetişkinlere özel bir kutlama olmasını arzu ettik." },
      { q: "Otopark ve vale hizmeti var mı?", a: "Evet, mekanda davetlilerimiz için ücretsiz otopark ve vale hizmeti bulunmaktadır." },
    ],
  },
  es: {
    partner1: "Amelia",
    partner2: "Julián",
    initials: "A&J",
    hostLine: "Junto con sus familias",
    inviteLine: "tienen el placer de invitarte a la celebración de su boda",
    venueName: "Finca El Olivar",
    venueAddress: "Camino de las Rosas 12, Ronda, Málaga",
    storyTitle: "Nuestra Historia",
    storyText:
      "Nos conocimos una tarde de lluvia en una pequeña librería y desde entonces no hemos dejado de hablar. Tras años de aventuras y una pregunta muy especial, nos casamos y nos encantaría compartir este día tan especial contigo.",
    schedule: [
      { time: "16:00", title: "Ceremonia", note: "Jardín de las Rosas" },
      { time: "17:00", title: "Cóctel de bienvenida", note: "La Terraza" },
      { time: "18:30", title: "Banquete y brindis", note: "Salón Principal" },
      { time: "20:30", title: "Fiesta y baile", note: "Hasta el amanecer" },
    ],
    dressCode: "Traje formal. Agradecemos a nuestros invitados vestir tonos suaves y elegantes.",
    accommodation: "Hemos reservado un bloque de habitaciones en un hotel cercano. Por favor, mencionad nuestros nombres al reservar.",
    closingLine: "Esperamos con ilusión celebrar este gran día contigo",
    faqs: [
      { q: "¿Puedo llevar acompañante?", a: "Tu formulario de confirmación indicará cuántos asientos están reservados para ti." },
      { q: "¿Están invitados los niños?", a: "Nos encantan los pequeños, pero hemos decidido celebrar una boda solo para adultos." },
      { q: "¿Hay aparcamiento en el lugar?", a: "Sí, el recinto dispone de aparcamiento gratuito para los invitados." },
    ],
  },
  fr: {
    partner1: "Amélie",
    partner2: "Julien",
    initials: "A&J",
    hostLine: "Avec leurs familles",
    inviteLine: "ont le plaisir de vous convier à la célébration de leur mariage",
    venueName: "Château de la Roseraie",
    venueAddress: "12 Route des Vignes, Bordeaux, France",
    storyTitle: "Notre Histoire",
    storyText:
      "Nous nous sommes rencontrés par un après-midi pluvieux dans une petite librairie, et la conversation ne s'est jamais arrêtée. Des années d'aventures et une demande inoubliable plus tard, nous nous marions et nous serions ravis de vous compter parmi nous.",
    schedule: [
      { time: "16:00", title: "Cérémonie", note: "Jardin des Roses" },
      { time: "17:00", title: "Cocktail", note: "La Terrasse" },
      { time: "18:30", title: "Dîner et discours", note: "Grand Salon" },
      { time: "20:30", title: "Soirée dansante", note: "Jusqu'au bout de la nuit" },
    ],
    dressCode: "Tenue de soirée élégante. Nous prions nos invités de privilégier des tons doux et naturels.",
    accommodation: "Des chambres ont été pré-réservées dans un hôtel à proximité. Mentionnez nos noms lors de votre réservation.",
    closingLine: "Au grand plaisir de célébrer ce jour unique avec vous",
    faqs: [
      { q: "Puis-je venir avec un(e) accompagnant(e) ?", a: "Votre formulaire de réponse indique le nombre de places réservées pour vous." },
      { q: "Les enfants sont-ils conviés ?", a: "Nous adorons les petits, mais nous avons choisi de célébrer cette journée entre adultes." },
      { q: "Y a-t-il un parking sur place ?", a: "Oui, un parking gratuit est à votre entière disposition sur place." },
    ],
  },
  de: {
    partner1: "Amelia",
    partner2: "Julian",
    initials: "A&J",
    hostLine: "Gemeinsam mit ihren Familien",
    inviteLine: "geben sich die Ehre, Sie zu ihrer Hochzeit einzuladen",
    venueName: "Schloss Rosengarten",
    venueAddress: "Rosenweg 12, 69117 Heidelberg, Deutschland",
    storyTitle: "Unsere Geschichte",
    storyText:
      "Wir trafen uns an einem regnerischen Nachmittag in einer kleinen Buchhandlung und konnten nicht mehr aufhören zu reden. Nach vielen gemeinsamen Abenteuern und einer ganz besonderen Frage heiraten wir nun – und freuen uns sehr darauf, diesen Tag mit euch zu feiern.",
    schedule: [
      { time: "16:00", title: "Trauung", note: "Rosengarten" },
      { time: "17:00", title: "Sektempfang", note: "Terrasse" },
      { time: "18:30", title: "Festliches Abendessen", note: "Großer Saal" },
      { time: "20:30", title: "Party & Tanz", note: "Bis in die Nacht" },
    ],
    dressCode: "Festliche Abendkleidung. Wir bitten unsere Gäste höflich um dezente und sanfte Farbtöne.",
    accommodation: "Im nahegelegenen Hotel ist ein Zimmerkontingent für unsere Gäste reserviert. Bitte gebt bei der Buchung unsere Namen an.",
    closingLine: "Wir freuen uns von Herzen darauf, mit euch zu feiern",
    faqs: [
      { q: "Darf ich eine Begleitperson mitbringen?", a: "In Ihrem RSVP-Formular sehen Sie genau, für wie viele Personen Plätze reserviert sind." },
      { q: "Sind Kinder eingeladen?", a: "Wir lieben die Kleinen, haben uns jedoch für eine Feier nur für Erwachsene entschieden." },
      { q: "Gibt es Parkplätze vor Ort?", a: "Ja, kostenfreie Parkmöglichkeiten stehen direkt an der Location zur Verfügung." },
    ],
  },
};

/** Sample content for /demo (the Etsy "try before you buy" link). */
export function demoInvite(lang: Language = "en"): InviteData {
  const b = blankInvite();
  const loc = LOCALIZED_DEMO[lang] || LOCALIZED_DEMO.en;
  return {
    ...b,
    ...loc,
    language: lang,
    heroPhoto: "/demo/hero.webp",
    storyPhotos: ["/demo/story-1.webp", "/demo/story-2.webp", "/demo/story-3.webp"],
    gallery: ["/demo/gallery-1.webp", "/demo/story-1.webp", "/demo/story-2.webp", "/demo/hero.webp"],
    rsvp: { ...b.rsvp, askMeal: true, maxGuests: 2 },
  };
}
