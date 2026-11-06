import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidLanguage, LANGUAGES } from "../lib/i18n/types";
import { getInviteI18n, localizedDateParts } from "../lib/i18n/invitation";
import { getSiteI18n } from "../lib/i18n/site";
import { normalizeInvite } from "../lib/defaults";

describe("Internationalization (i18n) Suite", () => {
  it("Validates supported language codes", () => {
    assert.equal(isValidLanguage("en"), true);
    assert.equal(isValidLanguage("tr"), true);
    assert.equal(isValidLanguage("es"), true);
    assert.equal(isValidLanguage("fr"), true);
    assert.equal(isValidLanguage("de"), true);
    assert.equal(isValidLanguage("it"), false);
    assert.equal(isValidLanguage(""), false);
    assert.equal(isValidLanguage(null), false);
    assert.equal(LANGUAGES.length, 5);
  });

  it("Provides complete invitation translations for all 5 languages", () => {
    for (const l of ["en", "tr", "es", "fr", "de"] as const) {
      const inv = getInviteI18n(l);
      assert.ok(inv.env.openCta.length > 0);
      assert.ok(inv.nav.rsvp.length > 0);
      assert.ok(inv.countdown.daysRemaining(10).includes("10"));
      assert.ok(inv.rsvp.heading.length > 0);
      assert.ok(inv.rsvp.fullName.length > 0);
      assert.ok(inv.footer.hopeToSee.length > 0);
    }
  });

  it("Provides complete site translations for all 5 languages", () => {
    for (const l of ["en", "tr", "es", "fr", "de"] as const) {
      const site = getSiteI18n(l);
      assert.ok(site.nav.designs.length > 0);
      assert.ok(site.hero.title.length > 0);
      assert.equal(site.features.length, 4);
      assert.equal(site.steps.length, 3);
      assert.equal(site.faq.items.length, 8);
      assert.ok(site.cta.buyOnEtsy.length > 0);
    }
  });

  it("Formats localized date parts accurately per language", () => {
    const testDate = "2027-07-04"; // July 4, 2027 (Sunday)
    const en = localizedDateParts(testDate, "en");
    assert.equal(en?.weekday, "Sunday");
    assert.equal(en?.month, "July");

    const tr = localizedDateParts(testDate, "tr");
    assert.equal(tr?.weekday, "Pazar");
    assert.equal(tr?.month, "Temmuz");

    const es = localizedDateParts(testDate, "es");
    assert.ok(es?.weekday.toLowerCase().includes("domingo"));
    assert.ok(es?.month.toLowerCase().includes("julio"));

    const fr = localizedDateParts(testDate, "fr");
    assert.ok(fr?.weekday.toLowerCase().includes("dimanche"));
    assert.ok(fr?.month.toLowerCase().includes("juillet"));

    const de = localizedDateParts(testDate, "de");
    assert.ok(de?.weekday.toLowerCase().includes("sonntag"));
    assert.ok(de?.month.toLowerCase().includes("juli"));
  });

  it("Normalizes and persists invitation language", () => {
    const d1 = normalizeInvite({ language: "tr" });
    assert.equal(d1.language, "tr");

    const d2 = normalizeInvite({ language: "invalid" });
    assert.equal(d2.language, "en");
  });
});
