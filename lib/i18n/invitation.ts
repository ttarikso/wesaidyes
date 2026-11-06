import type { Language } from "./types";
import { parseWhen } from "../format";

export interface InvitationTranslations {
  env: {
    openAria: string;
    openCta: string;
    musicOn: string;
    musicOff: string;
    pauseMusic: string;
    playMusic: string;
  };
  nav: {
    story: string;
    day: string;
    details: string;
    rsvp: string;
  };
  countdown: {
    daysRemaining: (days: number) => string;
    today: string;
    yesterday: string;
    pastDays: (days: number) => string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    untilWedding: string;
    replyBtn: string;
    addToCalendar: string;
    directions: string;
  };
  sections: {
    schedule: string;
    whereAndWhen: string;
    accommodation: string;
    dressCode: string;
    faq: string;
  };
  rsvp: {
    heading: string;
    replyBy: (date: string) => string;
    replySoon: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    attending: string;
    yes: string;
    no: string;
    additionalGuests: string;
    additionalGuestsNote: (max: number) => string;
    guestNames: string;
    guestNamesPlaceholder: string;
    meal: string;
    selectMeal: string;
    dietary: string;
    dietaryPlaceholder: string;
    song: string;
    songPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    sendAnother: string;
  };
  footer: {
    hopeToSee: string;
    sendYourReply: string;
    noReplyNeeded: string;
    byDate: (d: string) => string;
  };
}

export const INVITATION_TRANSLATIONS: Record<Language, InvitationTranslations> = {
  en: {
    env: {
      openAria: "Open the invitation",
      openCta: "Tap the seal to open",
      musicOn: "Music on",
      musicOff: "Music off",
      pauseMusic: "Pause the music",
      playMusic: "Play the music",
    },
    nav: {
      story: "Story",
      day: "Day",
      details: "Details",
      rsvp: "RSVP",
    },
    countdown: {
      daysRemaining: (d) => `IN ${d} DAYS`,
      today: "TODAY",
      yesterday: "YESTERDAY",
      pastDays: (d) => `${d} DAYS AGO`,
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
      untilWedding: "until the wedding",
      replyBtn: "Reply to the invitation",
      addToCalendar: "Add to calendar",
      directions: "Directions",
    },
    sections: {
      schedule: "Schedule of the day",
      whereAndWhen: "Where & when",
      accommodation: "Where to stay",
      dressCode: "Dress code",
      faq: "Questions & answers",
    },
    rsvp: {
      heading: "RSVP",
      replyBy: (date) => `Please reply by ${date}.`,
      replySoon: "Please reply as soon as you know.",
      fullName: "Your full name",
      fullNamePlaceholder: "e.g. Eleanor Vance",
      email: "Email address",
      emailPlaceholder: "For your confirmation",
      attending: "Will you attend?",
      yes: "Yes, joyfully accept",
      no: "Regretfully decline",
      additionalGuests: "Number of additional guests",
      additionalGuestsNote: (max) => `Up to ${max} additional guests`,
      guestNames: "Names of your guests",
      guestNamesPlaceholder: "First and last names",
      meal: "Meal preference",
      selectMeal: "Select a meal",
      dietary: "Dietary requirements",
      dietaryPlaceholder: "e.g. Vegetarian, nut allergy",
      song: "Song request",
      songPlaceholder: "A song that gets you on the dance floor",
      message: "Leave a message for the couple",
      messagePlaceholder: "Warm wishes, a memory, or excitement",
      submit: "Send reply",
      submitting: "Sending...",
      successTitle: "Thank you!",
      successDesc: "Your reply has been received.",
      sendAnother: "Send another reply",
    },
    footer: {
      hopeToSee: "We hope you can join us.",
      sendYourReply: "Send your reply",
      noReplyNeeded: "No reply needed",
      byDate: (d) => `by ${d}`,
    },
  },
  tr: {
    env: {
      openAria: "Davetiyeyi aç",
      openCta: "Mührü açmak için dokunun",
      musicOn: "Müzik açık",
      musicOff: "Müzik kapalı",
      pauseMusic: "Müziği duraklat",
      playMusic: "Müziği çal",
    },
    nav: {
      story: "Hikayemiz",
      day: "Program",
      details: "Detaylar",
      rsvp: "LCV",
    },
    countdown: {
      daysRemaining: (d) => `${d} GÜN KALDI`,
      today: "BUGÜN",
      yesterday: "DÜN",
      pastDays: (d) => `${d} GÜN ÖNCE`,
      days: "gün",
      hours: "saat",
      minutes: "dakika",
      seconds: "saniye",
      untilWedding: "düğün gününe kadar",
      replyBtn: "Daveti cevapla",
      addToCalendar: "Takvime ekle",
      directions: "Yol Tarifi",
    },
    sections: {
      schedule: "Günün Programı",
      whereAndWhen: "Nerede & Ne Zaman",
      accommodation: "Konaklama",
      dressCode: "Kıyafet Kuralı",
      faq: "Sıkça Sorulan Sorular",
    },
    rsvp: {
      heading: "Katılım Durumu (LCV)",
      replyBy: (date) => `Lütfen en geç ${date} tarihine kadar yanıtlayınız.`,
      replySoon: "Lütfen katılım durumunuzu en kısa sürede bildiriniz.",
      fullName: "Adınız ve Soyadınız",
      fullNamePlaceholder: "örn. Ayşe Yılmaz",
      email: "E-posta adresiniz",
      emailPlaceholder: "Onay bildirimi için",
      attending: "Katılacak mısınız?",
      yes: "Evet, mutlulukla katılıyorum",
      no: "Maalesef katılamıyorum",
      additionalGuests: "İlave konuk sayısı",
      additionalGuestsNote: (max) => `En fazla ${max} ilave konuk`,
      guestNames: "Konuklarınızın isimleri",
      guestNamesPlaceholder: "Ad ve soyadları",
      meal: "Yemek tercihi",
      selectMeal: "Menü seçiniz",
      dietary: "Özel beslenme / Alerjiler",
      dietaryPlaceholder: "örn. Vejetaryen, fıstık alerjisi",
      song: "Şarkı isteği",
      songPlaceholder: "Sizi dans pistine çıkaracak bir şarkı",
      message: "Çifte bir tebrik mesajı bırakın",
      messagePlaceholder: "Güzel dilekleriniz veya sevgi dolu notunuz",
      submit: "Yanıtı Gönder",
      submitting: "Gönderiliyor...",
      successTitle: "Teşekkür Ederiz!",
      successDesc: "Katılım yanıtınız başarıyla kaydedildi.",
      sendAnother: "Başka bir yanıt gönder",
    },
    footer: {
      hopeToSee: "Bu özel günümüzde yanımızda olmanız dileğiyle.",
      sendYourReply: "Yanıtınızı gönderin",
      noReplyNeeded: "Yanıt gerekmiyor",
      byDate: (d) => `en geç ${d}`,
    },
  },
  es: {
    env: {
      openAria: "Abrir la invitación",
      openCta: "Toca el sello para abrir",
      musicOn: "Música activada",
      musicOff: "Música desactivada",
      pauseMusic: "Pausar música",
      playMusic: "Reproducir música",
    },
    nav: {
      story: "Historia",
      day: "Programa",
      details: "Detalles",
      rsvp: "Confirmar",
    },
    countdown: {
      daysRemaining: (d) => `EN ${d} DÍAS`,
      today: "HOY",
      yesterday: "AYER",
      pastDays: (d) => `HACE ${d} DÍAS`,
      days: "días",
      hours: "horas",
      minutes: "minutos",
      seconds: "segundos",
      untilWedding: "hasta la boda",
      replyBtn: "Responder a la invitación",
      addToCalendar: "Añadir al calendario",
      directions: "Cómo llegar",
    },
    sections: {
      schedule: "Programa del día",
      whereAndWhen: "Dónde y cuándo",
      accommodation: "Dónde alojarse",
      dressCode: "Código de vestimenta",
      faq: "Preguntas y respuestas",
    },
    rsvp: {
      heading: "Confirmación de asistencia",
      replyBy: (date) => `Por favor responde antes del ${date}.`,
      replySoon: "Por favor responde tan pronto como lo sepas.",
      fullName: "Nombre completo",
      fullNamePlaceholder: "ej. María García",
      email: "Correo electrónico",
      emailPlaceholder: "Para tu confirmación",
      attending: "¿Asistirás?",
      yes: "Sí, asistiré encantado/a",
      no: "No podré asistir",
      additionalGuests: "Número de acompañantes",
      additionalGuestsNote: (max) => `Hasta ${max} acompañantes`,
      guestNames: "Nombres de tus acompañantes",
      guestNamesPlaceholder: "Nombres y apellidos",
      meal: "Preferencia de menú",
      selectMeal: "Selecciona un menú",
      dietary: "Requisitos dietéticos / Alergias",
      dietaryPlaceholder: "ej. Vegetariano, sin gluten",
      song: "Petición de canción",
      songPlaceholder: "Una canción para la pista de baile",
      message: "Deja un mensaje para la pareja",
      messagePlaceholder: "Tus mejores deseos o palabras de cariño",
      submit: "Enviar respuesta",
      submitting: "Enviando...",
      successTitle: "¡Muchas gracias!",
      successDesc: "Tu respuesta ha sido recibida con éxito.",
      sendAnother: "Enviar otra respuesta",
    },
    footer: {
      hopeToSee: "Esperamos celebrar este gran día contigo.",
      sendYourReply: "Enviar respuesta",
      noReplyNeeded: "No se requiere respuesta",
      byDate: (d) => `antes del ${d}`,
    },
  },
  fr: {
    env: {
      openAria: "Ouvrir l'invitation",
      openCta: "Touchez le sceau pour ouvrir",
      musicOn: "Musique activée",
      musicOff: "Musique désactivée",
      pauseMusic: "Mettre la musique en pause",
      playMusic: "Lancer la musique",
    },
    nav: {
      story: "Histoire",
      day: "Programme",
      details: "Détails",
      rsvp: "Réponse",
    },
    countdown: {
      daysRemaining: (d) => `DANS ${d} JOURS`,
      today: "AUJOURD'HUI",
      yesterday: "HIER",
      pastDays: (d) => `IL Y A ${d} JOURS`,
      days: "jours",
      hours: "heures",
      minutes: "minutes",
      seconds: "secondes",
      untilWedding: "jusqu'au mariage",
      replyBtn: "Répondre à l'invitation",
      addToCalendar: "Ajouter au calendrier",
      directions: "Itinéraire",
    },
    sections: {
      schedule: "Programme de la journée",
      whereAndWhen: "Où et quand",
      accommodation: "Où loger",
      dressCode: "Code vestimentaire",
      faq: "Questions & réponses",
    },
    rsvp: {
      heading: "Confirmez votre présence",
      replyBy: (date) => `Merci de répondre avant le ${date}.`,
      replySoon: "Merci de répondre dès que possible.",
      fullName: "Nom et prénom",
      fullNamePlaceholder: "ex. Camille Laurent",
      email: "Adresse e-mail",
      emailPlaceholder: "Pour votre confirmation",
      attending: "Serez-vous présent(e) ?",
      yes: "Oui, avec grand plaisir",
      no: "Non, je ne pourrai pas venir",
      additionalGuests: "Nombre d'accompagnants",
      additionalGuestsNote: (max) => `Jusqu'à ${max} accompagnants`,
      guestNames: "Noms de vos accompagnants",
      guestNamesPlaceholder: "Prénoms et noms",
      meal: "Choix du menu",
      selectMeal: "Sélectionnez un menu",
      dietary: "Régimes particuliers / Allergies",
      dietaryPlaceholder: "ex. Végétarien, sans gluten",
      song: "Suggestion de chanson",
      songPlaceholder: "Une chanson qui vous fera danser",
      message: "Laissez un mot pour les mariés",
      messagePlaceholder: "Vœux chaleureux, souvenirs ou félicitations",
      submit: "Envoyer la réponse",
      submitting: "Envoi en cours...",
      successTitle: "Merci beaucoup !",
      successDesc: "Votre réponse a bien été enregistrée.",
      sendAnother: "Envoyer une autre réponse",
    },
    footer: {
      hopeToSee: "Au plaisir de vous compter parmi nous.",
      sendYourReply: "Envoyer votre réponse",
      noReplyNeeded: "Pas de réponse nécessaire",
      byDate: (d) => `avant le ${d}`,
    },
  },
  de: {
    env: {
      openAria: "Einladung öffnen",
      openCta: "Tippen Sie auf das Siegel zum Öffnen",
      musicOn: "Musik an",
      musicOff: "Musik aus",
      pauseMusic: "Musik anhalten",
      playMusic: "Musik abspielen",
    },
    nav: {
      story: "Geschichte",
      day: "Ablauf",
      details: "Details",
      rsvp: "Rückmeldung",
    },
    countdown: {
      daysRemaining: (d) => `IN ${d} TAGEN`,
      today: "HEUTE",
      yesterday: "GESTERN",
      pastDays: (d) => `VOR ${d} TAGEN`,
      days: "Tage",
      hours: "Stunden",
      minutes: "Minuten",
      seconds: "Sekunden",
      untilWedding: "bis zur Hochzeit",
      replyBtn: "Einladung beantworten",
      addToCalendar: "Zum Kalender hinzufügen",
      directions: "Anfahrt",
    },
    sections: {
      schedule: "Tagesablauf",
      whereAndWhen: "Wann & Wo",
      accommodation: "Unterkunft",
      dressCode: "Dresscode",
      faq: "Fragen & Antworten",
    },
    rsvp: {
      heading: "Rückmeldung (u.A.w.g.)",
      replyBy: (date) => `Bitte antworten Sie bis zum ${date}.`,
      replySoon: "Bitte antworten Sie sobald wie möglich.",
      fullName: "Vollständiger Name",
      fullNamePlaceholder: "z.B. Anna Schmidt",
      email: "E-Mail-Adresse",
      emailPlaceholder: "Für Ihre Bestätigung",
      attending: "Nehmen Sie teil?",
      yes: "Ja, ich nehme gerne teil",
      no: "Nein, leider kann ich nicht teilnehmen",
      additionalGuests: "Anzahl weiterer Gäste",
      additionalGuestsNote: (max) => `Bis zu ${max} zusätzliche Gäste`,
      guestNames: "Namen Ihrer Begleitpersonen",
      guestNamesPlaceholder: "Vor- und Nachnamen",
      meal: "Menüauswahl",
      selectMeal: "Menü auswählen",
      dietary: "Besondere Ernährung / Allergien",
      dietaryPlaceholder: "z.B. Vegetarisch, glutenfrei",
      song: "Musikwunsch",
      songPlaceholder: "Ein Lied, das Sie auf die Tanzfläche bringt",
      message: "Nachricht an das Brautpaar",
      messagePlaceholder: "Herzliche Glückwünsche oder liebe Worte",
      submit: "Antwort senden",
      submitting: "Wird gesendet...",
      successTitle: "Vielen Dank!",
      successDesc: "Ihre Rückmeldung wurde erfolgreich übermittelt.",
      sendAnother: "Weitere Antwort senden",
    },
    footer: {
      hopeToSee: "Wir freuen uns sehr darauf, mit Ihnen zu feiern.",
      sendYourReply: "Antwort senden",
      noReplyNeeded: "Keine Rückmeldung erforderlich",
      byDate: (d) => `bis ${d}`,
    },
  },
};

export function getInviteI18n(lang: Language): InvitationTranslations {
  return INVITATION_TRANSLATIONS[lang] || INVITATION_TRANSLATIONS.en;
}

export function localizedDateParts(date: string, lang: Language) {
  const d = parseWhen(date, "12:00");
  if (!d) return null;
  const localeMap: Record<Language, string> = {
    en: "en-US",
    tr: "tr-TR",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
  };
  const loc = localeMap[lang] || "en-US";
  return {
    weekday: d.toLocaleDateString(loc, { weekday: "long" }),
    day: d.getDate(),
    month: d.toLocaleDateString(loc, { month: "long" }),
    year: d.getFullYear(),
    long: d.toLocaleDateString(loc, { weekday: "long", month: "long", day: "numeric", year: "numeric" }),
    short: d.toLocaleDateString(loc, { month: "long", day: "numeric", year: "numeric" }),
    dots: `${String(d.getDate()).padStart(2, "0")} . ${String(d.getMonth() + 1).padStart(2, "0")} . ${String(d.getFullYear()).slice(2)}`,
  };
}
