import type { Language } from "./types";

export interface SiteTranslations {
  nav: {
    designs: string;
    songs: string;
    questions: string;
    signIn: string;
    buyOnEtsy: string;
  };
  hero: {
    title: string;
    subtitle: string;
    badges: string;
    openSample: string;
    buyOnEtsy: string;
  };
  liveDemo: {
    partner1Label: string;
    partner2Label: string;
    openBtn: string;
  };
  features: {
    name: string;
    text: string;
    media: string;
  }[];
  steps: {
    verb: string;
    text: string;
    img: string;
    alt: string;
  }[];
  songs: {
    heading: string;
    subheading: string;
    stop: string;
    listen: string;
  };
  faq: {
    heading: string;
    items: [string, string][];
  };
  cta: {
    title: string;
    desc: string;
    buyOnEtsy: string;
    signIn: string;
  };
  footer: {
    copyright: string;
  };
}

export const SITE_TRANSLATIONS: Record<Language, SiteTranslations> = {
  en: {
    nav: {
      designs: "Designs",
      songs: "Songs",
      questions: "Questions",
      signIn: "Sign in",
      buyOnEtsy: "Buy on Etsy",
    },
    hero: {
      title: "We said yes",
      subtitle: "A wedding invitation website that feels like an heirloom.",
      badges: "Pressed wax seal · Original soundtrack · Live countdown · Guest RSVP",
      openSample: "Open sample",
      buyOnEtsy: "Buy on Etsy",
    },
    liveDemo: {
      partner1Label: "Your first name",
      partner2Label: "Your partner’s first name",
      openBtn: "Open your invitation",
    },
    features: [
      { name: "The envelope opens", text: "Your initials are pressed into the wax seal. One tap and the flap lifts, the card slides out and your song begins.", media: "video" },
      { name: "The day, in order", text: "Ceremony, dinner, dancing: each with its time and place, the venue as a map link, and a calendar file in one tap.", media: "/site/frag-day.webp" },
      { name: "A countdown on every phone", text: "Days, hours, minutes and seconds to the wedding, live on each guest’s screen, under the words you choose.", media: "/site/frag-countdown.webp" },
      { name: "Every reply, in one list", text: "Guests answer with a plus-one, a meal and a song request. You see each reply as it arrives and can download the list as a spreadsheet.", media: "/site/frag-guests.webp" },
    ],
    steps: [
      { verb: "Buy", text: "Order it on Etsy. Your order number opens your own studio straight away, with no account to create.", img: "/site/couple-home.webp", alt: "A couple on a sofa setting up their invitation on a laptop" },
      { verb: "Write", text: "Pick a design, then add your names, date, venue, story and photos. Every change shows on the phone beside it.", img: "/site/write-editor.webp", alt: "The studio: design choices on the left, the invitation on a phone on the right" },
      { verb: "Send", text: "Publish, then send one link by WhatsApp, text or email, or print its QR code on your save-the-dates.", img: "/site/send-hero.webp", alt: "An opened invitation with the couple's names over their photograph" },
    ],
    songs: {
      heading: "An original soundtrack for your invitation",
      subheading: "Twenty acoustic and ambient pieces, written specifically for slow, romantic websites.",
      stop: "Stop",
      listen: "Listen",
    },
    faq: {
      heading: "Frequently Asked Questions",
      items: [
        ["Do our guests need an app or an account?", "No. The invitation opens in any phone or computer browser from the link you send."],
        ["How long does the invitation stay online?", "Until 7 days after your wedding, for up to 45 days from the day you first publish it. Publish within about six weeks of the wedding and it stays online through the day."],
        ["Can we change details after sending the link?", "Yes. Change the time, the venue or anything else, and everyone sees the update on the same link."],
        ["How many guests can reply?", "As many as you invite. There is no limit on guests or replies."],
        ["Can we switch to another design later?", "At any time. Your names, words and photos move to the new design as they are."],
        ["Can we use our own song?", "Not yet. Choose one of the twenty original tracks, or turn the music off."],
        ["Which languages does it support?", "English, Turkish, Spanish, French, and German! Guests can switch languages directly on the invitation, and all your custom text can be in any language."],
        ["How do we get in after buying?", "Go to wesaidyes.site/redeem and enter your Etsy order number and email. Use the same two to sign in again on any device."],
      ],
    },
    cta: {
      title: "Ready to begin?",
      desc: "Order on Etsy to open your studio straight away.",
      buyOnEtsy: "Buy on Etsy",
      signIn: "Sign in",
    },
    footer: {
      copyright: "We Said Yes · An heirloom wedding invitation for the web",
    },
  },
  tr: {
    nav: {
      designs: "Tasarımlar",
      songs: "Müzikler",
      questions: "Sorular",
      signIn: "Giriş yap",
      buyOnEtsy: "Etsy'den Satın Al",
    },
    hero: {
      title: "Evet dedik",
      subtitle: "Kuşaklar boyu hatırlanacak, yadigar gibi bir dijital düğün davetiyesi.",
      badges: "Kabartma mum mühür · Orijinal müzikler · Canlı geri sayım · LCV katılım formu",
      openSample: "Örneği İncele",
      buyOnEtsy: "Etsy'den Satın Al",
    },
    liveDemo: {
      partner1Label: "Adınız",
      partner2Label: "Eşinizin adı",
      openBtn: "Davetiyenizi açın",
    },
    features: [
      { name: "Zarf açılıyor", text: "Baş harfleriniz balmumu mührün üzerinde yer alır. Tek dokunuşla kapak açılır, mektup yukarı kayar ve özel şarkınız başlar.", media: "video" },
      { name: "Günün akışı sırasıyla", text: "Nikah, akşam yemeği ve parti: her biri saati ve konumuyla, tek dokunuşla harita linki ve takvime ekleme dosyasıyla sunulur.", media: "/site/frag-day.webp" },
      { name: "Her ekranda canlı geri sayım", text: "Düğüne kalan gün, saat, dakika ve saniyeler; seçtiğiniz romantik başlığın altında misafirlerinizin ekranında canlı işler.", media: "/site/frag-countdown.webp" },
      { name: "Tüm yanıtlar tek listede", text: "Konuklarınız ek misafir, menü tercihi ve şarkı istekleriyle katılım bildirir. Yanıtları anlık görür ve Excel tablosu olarak indirebilirsiniz.", media: "/site/frag-guests.webp" },
    ],
    steps: [
      { verb: "Satın Alın", text: "Etsy üzerinden sipariş verin. Sipariş numaranızla hesap oluşturmaya gerek kalmadan stüdyonuz anında açılır.", img: "/site/couple-home.webp", alt: "Bir çift koltukta dizüstü bilgisayardan davetiyesini hazırlıyor" },
      { verb: "Düzenleyin", text: "Bir tasarım seçin; isimlerinizi, tarihi, mekanı, hikayenizi ve fotoğraflarınızı ekleyin. Her değişiklik yandaki telefonda anında görünür.", img: "/site/write-editor.webp", alt: "Stüdyo: solda tasarım seçenekleri, sağda telefon önizlemesi" },
      { verb: "Paylaşın", text: "Yayınlayın ve WhatsApp, SMS veya e-posta ile tek bir link gönderin; dilerseniz QR kodunu save-the-date kartınıza basın.", img: "/site/send-hero.webp", alt: "Fotoğraf üzerinde çiftin isimlerinin yer aldığı açılmış davetiye" },
    ],
    songs: {
      heading: "Davetiyeniz için özel bestelenmiş müzikler",
      subheading: "Yavaş ve romantik web siteleri için özenle kaydedilmiş yirmi akustik ve enstrümantal parça.",
      stop: "Durdur",
      listen: "Dinle",
    },
    faq: {
      heading: "Sıkça Sorulan Sorular",
      items: [
        ["Misafirlerimizin bir uygulama indirmesi veya hesap açması gerekir mi?", "Hayır. Gönderdiğiniz linke tıklayan herkes herhangi bir telefon veya bilgisayar tarayıcısından davetiyenizi anında açabilir."],
        ["Davetiye ne kadar süre yayında kalır?", "Düğününüzden sonraki 7 güne kadar ve ilk yayınladığınız günden itibaren 45 güne kadar yayında kalır. Düğünden yaklaşık 6 hafta önce yayınladığınızda gün boyunca kesintisiz çevrimiçi kalır."],
        ["Linki gönderdikten sonra bilgileri değiştirebilir miyiz?", "Evet. Saati, mekanı veya dilediğiniz herhangi bir detayı güncellediğinizde herkes aynı link üzerinden güncel hali görür."],
        ["Kaç misafir katılım bildirebilir (LCV)?", "Dilediğiniz kadar misafir. Katılım sayısı veya konuk kotası sınırı yoktur."],
        ["Daha sonra başka bir tasarıma geçebilir miyiz?", "İstediğiniz zaman. İsimleriniz, metinleriniz ve fotoğraflarınız yeni tasarıma olduğu gibi aktarılır."],
        ["Kendi şarkımızı yükleyebilir miyiz?", "Şu an için stüdyodaki 20 özel besteden birini seçebilir veya müziği kapatabilirsiniz."],
        ["Hangi dilleri destekliyor?", "Türkçe, İngilizce, İspanyolca, Fransızca ve Almanca! Davetiyeyi açan konuklar tek tıkla kendi dilini seçebilir ve tüm özel metinleriniz istediğiniz dilde yazılabilir."],
        ["Satın aldıktan sonra stüdyoya nasıl giriş yaparım?", "wesaidyes.site/redeem sayfasına gidin ve Etsy sipariş numaranız ile e-posta adresinizi girin. Aynı bilgilerle dilediğiniz cihazdan tekrar giriş yapabilirsiniz."],
      ],
    },
    cta: {
      title: "Başlamaya hazır mısınız?",
      desc: "Stüdyonuzu hemen açmak için Etsy üzerinden siparişinizi verin.",
      buyOnEtsy: "Etsy'den Satın Al",
      signIn: "Giriş yap",
    },
    footer: {
      copyright: "We Said Yes · Kuşaklar boyu saklanacak dijital düğün davetiyeniz",
    },
  },
  es: {
    nav: {
      designs: "Diseños",
      songs: "Música",
      questions: "Preguntas",
      signIn: "Iniciar sesión",
      buyOnEtsy: "Comprar en Etsy",
    },
    hero: {
      title: "Dijimos que sí",
      subtitle: "Una página web de invitación de boda diseñada como un recuerdo inolvidable.",
      badges: "Sello de cera en relieve · Banda sonora original · Cuenta atrás en vivo · Confirmación RSVP",
      openSample: "Ver ejemplo",
      buyOnEtsy: "Comprar en Etsy",
    },
    liveDemo: {
      partner1Label: "Tu nombre",
      partner2Label: "Nombre de tu pareja",
      openBtn: "Abrir tu invitación",
    },
    features: [
      { name: "El sobre se abre", text: "Vuestras iniciales van grabadas en el sello de cera. Un toque y el sobre se abre, la tarjeta se desliza y comienza vuestra canción.", media: "video" },
      { name: "El gran día, en orden", text: "Ceremonia, banquete y fiesta: cada momento con su hora y lugar, mapa con un toque y archivo para el calendario.", media: "/site/frag-day.webp" },
      { name: "Cuenta atrás en cada móvil", text: "Días, horas, minutos y segundos para la boda, en directo en la pantalla de cada invitado, con vuestro texto preferido.", media: "/site/frag-countdown.webp" },
      { name: "Todas las respuestas reunidas", text: "Los invitados confirman acompañante, menú y petición musical. Consulta las respuestas al instante y descárgalas en Excel.", media: "/site/frag-guests.webp" },
    ],
    steps: [
      { verb: "Comprar", text: "Haz tu pedido en Etsy. Tu número de pedido abre tu propio estudio de inmediato, sin necesidad de crear cuenta.", img: "/site/couple-home.webp", alt: "Pareja en el sofá preparando su invitación en un portátil" },
      { verb: "Personalizar", text: "Elige un diseño y añade vuestros nombres, fecha, lugar, historia y fotos. Cada cambio se refleja al instante en el móvil.", img: "/site/write-editor.webp", alt: "Estudio: opciones de diseño a la izquierda, vista previa del móvil a la derecha" },
      { verb: "Compartir", text: "Publica y envía un solo enlace por WhatsApp, SMS o correo, o imprime el código QR en tus tarjetas de invitación.", img: "/site/send-hero.webp", alt: "Invitación abierta con los nombres de la pareja sobre su fotografía" },
    ],
    songs: {
      heading: "Una banda sonora original para vuestra invitación",
      subheading: "Veinte piezas acústicas e instrumentales creadas especialmente para webs románticas e íntimas.",
      stop: "Detener",
      listen: "Escuchar",
    },
    faq: {
      heading: "Preguntas Frecuentes",
      items: [
        ["¿Nuestros invitados necesitan una app o cuenta?", "No. La invitación se abre en cualquier navegador de móvil u ordenador desde el enlace que enviéis."],
        ["¿Cuánto tiempo permanece online la invitación?", "Hasta 7 días después de la boda y hasta 45 días desde la fecha de publicación. Publicad unas seis semanas antes y estará activa durante todo el evento."],
        ["¿Podemos cambiar detalles después de enviar el enlace?", "Sí. Podéis actualizar el horario, el lugar o cualquier detalle y todos verán los cambios en el mismo enlace."],
        ["¿Cuántos invitados pueden responder (RSVP)?", "Tantos como queráis. No hay límite de invitados ni de confirmaciones."],
        ["¿Podemos cambiar de diseño más adelante?", "En cualquier momento. Vuestros nombres, textos y fotos se adaptarán al nuevo diseño automáticamente."],
        ["¿Podemos usar nuestra propia canción?", "Por ahora podéis elegir entre 20 composiciones exclusivas o desactivar la música."],
        ["¿Qué idiomas admite?", "Español, turco, inglés, francés y alemán. Los invitados pueden cambiar de idioma con un clic y vuestros textos pueden estar en cualquier idioma."],
        ["¿Cómo accedemos tras la compra?", "Visita wesaidyes.site/redeem e introduce tu número de pedido de Etsy y correo electrónico."],
      ],
    },
    cta: {
      title: "¿Listos para empezar?",
      desc: "Haz tu pedido en Etsy para abrir tu estudio al instante.",
      buyOnEtsy: "Comprar en Etsy",
      signIn: "Iniciar sesión",
    },
    footer: {
      copyright: "We Said Yes · Una invitación de boda digital para recordar siempre",
    },
  },
  fr: {
    nav: {
      designs: "Modèles",
      songs: "Musiques",
      questions: "Questions",
      signIn: "Connexion",
      buyOnEtsy: "Acheter sur Etsy",
    },
    hero: {
      title: "Nous avons dit oui",
      subtitle: "Un site de faire-part de mariage conçu comme un précieux souvenir de famille.",
      badges: "Sceau de cire pressé · Bande originale · Compte à rebours en direct · Confirmation RSVP",
      openSample: "Voir un exemple",
      buyOnEtsy: "Acheter sur Etsy",
    },
    liveDemo: {
      partner1Label: "Votre prénom",
      partner2Label: "Prénom de votre partenaire",
      openBtn: "Ouvrir votre invitation",
    },
    features: [
      { name: "L'enveloppe s'ouvre", text: "Vos initiales sont gravées dans le sceau de cire. Un clic et le rabat se lève, le faire-part glisse et votre mélodie commence.", media: "video" },
      { name: "La journée, dans l'ordre", text: "Cérémonie, dîner, soirée dansante : chaque moment avec son horaire et son lieu, itinéraire et ajout au calendrier en un clic.", media: "/site/frag-day.webp" },
      { name: "Un compte à rebours en direct", text: "Jours, heures, minutes et secondes jusqu'au mariage, en temps réel sur l'écran de chaque invité.", media: "/site/frag-countdown.webp" },
      { name: "Toutes les réponses réunies", text: "Vos invités confirment leur présence, accompagnants, repas et suggestions musicales. Téléchargez la liste en un clic.", media: "/site/frag-guests.webp" },
    ],
    steps: [
      { verb: "Commander", text: "Commandez sur Etsy. Votre numéro de commande débloque immédiatement votre studio, sans création de compte.", img: "/site/couple-home.webp", alt: "Un couple sur un canapé préparant son faire-part sur un ordinateur portable" },
      { verb: "Personnaliser", text: "Choisissez un thème, ajoutez vos prénoms, date, lieu, histoire et photos. Chaque retouche apparaît en direct sur le smartphone.", img: "/site/write-editor.webp", alt: "Studio : choix de design à gauche, aperçu mobile à droite" },
      { verb: "Partager", text: "Publiez et partagez un lien unique par WhatsApp, SMS ou e-mail, ou imprimez le code QR sur vos cartons d'invitation.", img: "/site/send-hero.webp", alt: "Faire-part ouvert avec les prénoms des mariés sur leur photo" },
    ],
    songs: {
      heading: "Une bande originale sur mesure pour votre mariage",
      subheading: "Vingt compositions acoustiques et douces, créées tout particulièrement pour des sites romantiques et raffinés.",
      stop: "Arrêter",
      listen: "Écouter",
    },
    faq: {
      heading: "Foire Aux Questions",
      items: [
        ["Nos invités ont-ils besoin d'une application ou d'un compte ?", "Non. Le faire-part s'ouvre instantanément dans n'importe quel navigateur mobile ou ordinateur."],
        ["Combien de temps l'invitation reste-t-elle en ligne ?", "Jusqu'à 7 jours après votre mariage et jusqu'à 45 jours après la première publication."],
        ["Pouvons-nous modifier les informations après envoi ?", "Oui. Modifiez l'horaire, le lieu ou tout autre texte, et tout le monde verra la mise à jour sur le même lien."],
        ["Combien d'invités peuvent répondre (RSVP) ?", "Autant que vous le souhaitez, sans aucune limite."],
        ["Pouvons-nous changer de modèle plus tard ?", "À tout moment. Vos prénoms, textes et photographies s'adapteront fidèlement au nouveau modèle."],
        ["Peut-on utiliser notre propre musique ?", "Vous pouvez choisir parmi nos 20 musiques originales ou désactiver le fond sonore."],
        ["Quelles sont les langues disponibles ?", "Français, turc, anglais, espagnol et allemand ! Vos invités peuvent changer de langue d'un simple clic."],
        ["Comment accéder au studio après l'achat ?", "Rendez-vous sur wesaidyes.site/redeem et saisissez votre numéro de commande Etsy et votre adresse e-mail."],
      ],
    },
    cta: {
      title: "Prêts à commencer ?",
      desc: "Commandez sur Etsy pour ouvrir votre studio en quelques secondes.",
      buyOnEtsy: "Acheter sur Etsy",
      signIn: "Connexion",
    },
    footer: {
      copyright: "We Said Yes · Un faire-part de mariage numérique inoubliable",
    },
  },
  de: {
    nav: {
      designs: "Designs",
      songs: "Musik",
      questions: "Fragen",
      signIn: "Anmelden",
      buyOnEtsy: "Auf Etsy kaufen",
    },
    hero: {
      title: "Wir haben Ja gesagt",
      subtitle: "Eine Hochzeitseinladungs-Website, die sich wie ein edles Erbstück anfühlt.",
      badges: "Geprägtes Wachssiegel · Eigener Soundtrack · Live-Countdown · RSVP-Gästeliste",
      openSample: "Beispiel ansehen",
      buyOnEtsy: "Auf Etsy kaufen",
    },
    liveDemo: {
      partner1Label: "Ihr Vorname",
      partner2Label: "Vorname Ihres Partners",
      openBtn: "Ihre Einladung öffnen",
    },
    features: [
      { name: "Der Umschlag öffnet sich", text: "Ihre Initialen sind im Wachssiegel geprägt. Ein Fingertipp und die Klappe öffnet sich, die Karte gleitet heraus und Ihre Musik ertönt.", media: "video" },
      { name: "Der Tag im Überblick", text: "Trauung, Dinner, Party: alle Programmpunkte mit Zeit und Ort, Routenplaner und Kalendereintrag mit einem Klick.", media: "/site/frag-day.webp" },
      { name: "Ein Countdown auf jedem Handy", text: "Tage, Stunden, Minuten und Sekunden bis zur Hochzeit – live auf dem Bildschirm jedes Gastes unter Ihren persönlichen Worten.", media: "/site/frag-countdown.webp" },
      { name: "Alle Rückmeldungen in einer Liste", text: "Gäste antworten mit Begleitung, Menüwunsch und Musikvorschlag. Behalten Sie den Überblick und exportieren Sie als Excel-Tabelle.", media: "/site/frag-guests.webp" },
    ],
    steps: [
      { verb: "Bestellen", text: "Auf Etsy bestellen. Ihre Bestellnummer öffnet sofort Ihr persönliches Studio – ganz ohne Registrierung.", img: "/site/couple-home.webp", alt: "Ein Paar auf dem Sofa gestaltet seine Einladung am Laptop" },
      { verb: "Gestalten", text: "Design auswählen, Namen, Datum, Ort, Kennenlerngeschichte und Fotos hinzufügen. Jede Änderung ist live am Smartphone sichtbar.", img: "/site/write-editor.webp", alt: "Studio: Designauswahl links, Smartphone-Vorschau rechts" },
      { verb: "Versenden", text: "Veröffentlichen und den Link per WhatsApp, SMS oder E-Mail teilen oder als QR-Code auf Ihre Save-the-Date-Karten drucken.", img: "/site/send-hero.webp", alt: "Geöffnete Einladung mit den Namen des Paares über ihrem Foto" },
    ],
    songs: {
      heading: "Ein exklusiver Soundtrack für Ihre Einladung",
      subheading: "Zwanzig akustische und stimmungsvolle Stücke, eigens für romantische Hochzeits-Websites komponiert.",
      stop: "Stopp",
      listen: "Anhören",
    },
    faq: {
      heading: "Häufig gestellte Fragen",
      items: [
        ["Benötigen unsere Gäste eine App oder ein Konto?", "Nein. Die Einladung öffnet sich in jedem mobilen oder Desktop-Browser über den Link."],
        ["Wie lange bleibt die Einladung online?", "Bis zu 7 Tage nach Ihrer Hochzeit und bis zu 45 Tage ab der Veröffentlichung."],
        ["Können wir Details nach dem Versenden noch ändern?", "Ja. Ändern Sie Uhrzeiten, Ort oder Texte – alle Gäste sehen sofort die aktuellen Angaben."],
        ["Wie viele Gäste können antworten (RSVP)?", "So viele Sie möchten. Es gibt kein Limit für Rückmeldungen."],
        ["Können wir das Design später noch wechseln?", "Jederzeit. Ihre Namen, Texte und Fotos werden nahtlos in das neue Design übernommen."],
        ["Können wir ein eigenes Lied hochladen?", "Sie können aus 20 wunderschönen Originalstücken wählen oder die Musik ausschalten."],
        ["Welche Sprachen werden unterstützt?", "Deutsch, Türkisch, Englisch, Spanisch und Französisch! Gäste können direkt auf der Einladung die Sprache wechseln."],
        ["Wie erhalten wir nach dem Kauf Zugang?", "Besuchen Sie wesaidyes.site/redeem und geben Sie Ihre Etsy-Bestellnummer sowie E-Mail-Adresse ein."],
      ],
    },
    cta: {
      title: "Bereit loszulegen?",
      desc: "Bestellen Sie auf Etsy, um Ihr Studio sofort zu öffnen.",
      buyOnEtsy: "Auf Etsy kaufen",
      signIn: "Anmelden",
    },
    footer: {
      copyright: "We Said Yes · Eine unvergessliche Hochzeits-Website für immer",
    },
  },
};

export function getSiteI18n(lang: Language): SiteTranslations {
  return SITE_TRANSLATIONS[lang] || SITE_TRANSLATIONS.en;
}
