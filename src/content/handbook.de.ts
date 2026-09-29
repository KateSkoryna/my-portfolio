import type { HandbookContent } from './handbook';

/**
 * German text of the Prompting Handbook, verbatim from the published
 * `index.html` (`data-de` attributes). Same keys as `handbook.en.ts`.
 */
export const handbookDe: HandbookContent = {
  l1f_kicker_1: 'Feldnotizen',
  l1f_h1_2: 'Das Prompting-Handbuch<br/>für Entwickler:innen',
  l1f_sub_3: 'Wie ich LLM-Ausgaben verlässlich genug für den Produktionseinsatz mache.',
  l1f_turnhint_4: 'Umblättern →',
  l1b_insideJoke_5:
    'Ich diskutierte eine Stunde mit einer KI.<br/>Am Ende lagen wir beide falsch – sie war nur selbstbewusster.',
  l1b_tiny_6: '— Innenseite —',
  l2f_eyebrow_7: '<span class="num">01</span> Grundlagen <span class="rule"></span>',
  l2f_title_8: 'Die Anatomie eines guten Prompts',
  l2f_lead_9:
    'Bevor meine eigenen Methoden ins Spiel kommen, gilt diese Grundlage fast überall: Ein guter Prompt besteht aus klar benannten Teilen. Nicht alle sind immer nötig – nur die <b>Aufgabe</b> ist unverzichtbar. Je mehr du ausdrücklich formulierst, desto weniger muss das Modell erraten.',
  l2f_block_10:
    '<span class="k">Rolle</span><span class="d">Sag dem Modell, wer es sein soll. Das prägt Wortwahl, Tiefe und Ton. <span class="aside">Bei starken Modellen beeinflusst das vor allem Stil und Format, weniger die reine Genauigkeit.</span></span>',
  l2f_block_11:
    '<span class="k req">Aufgabe</span><span class="d">Was genau soll es tun? Der einzige zwingende Teil.</span>',
  l2f_block_12:
    '<span class="k">Kontext</span><span class="d">Zweck, Zielgruppe und Einschränkungen. Hier scheitern viele schwache Prompts.</span>',
  l2f_block_13:
    '<span class="k">Format</span><span class="d">Wie die Ausgabe aussehen soll: JSON, Stichpunkte, Tabelle oder feste Länge.</span>',
  l2f_block_14:
    '<span class="k">Beispiele</span><span class="d">Ein oder zwei Eingabe→Ausgabe-Beispiele. Zeigen ist besser als beschreiben.</span>',
  l2f_block_15:
    '<span class="k">Denken</span><span class="d">Bei komplexen Aufgaben: erst schrittweise analysieren, dann antworten.</span>',
  l2f_tip_16:
    '<b>Reihenfolge</b> – es gibt keine einzig richtige. Setze Kontext und Daten zuerst, die Anweisung zuletzt, damit das Modell erst handelt, nachdem es alles gelesen hat.',
  l2f_head_17: '<span class="badge">✦</span><span>Beispiel</span>',
  l2f_prow_18:
    '<b>Rolle:</b> Senior Full-Stack Engineer (React + Express), mit Fokus auf Performance.',
  l2f_prow_19:
    '<b>Kontext:</b> Die Seite lädt langsam – das Start-Bundle enthält Bibliotheken, die für den ersten Render nicht nötig sind.',
  l2f_prow_20:
    '<b>Aufgabe:</b> Imports in <code>&lt;code&gt;</code> refaktorieren, um das Start-Bundle zu verkleinern (Lazy Loading / Code Splitting), ohne öffentliche Props zu ändern.',
  l2f_prow_21:
    '<b>Format:</b> Nur den korrigierten Code in <code>&lt;answer&gt;</code> zurückgeben; dazu ein einzeiliger Kommentar, was ausgelagert wurde.',
  l2b_eyebrow_22: '<span class="num">02</span> Meine Regeln <span class="rule"></span>',
  l2b_title_23: 'Meine Regeln – und die Fehler, aus denen sie entstanden',
  l2b_lead_24:
    'Die Grundlagen ergeben einen brauchbaren Prompt; diese Gewohnheiten machen die Ausgabe verlässlich genug, um darauf aufzubauen. Für mich ist ein Prompt wie Produktionscode: versioniert, getestet und anhand echter Fehler verbessert.',
  l2b_colhead_25: 'Was ich tue',
  l2b_sg_26: 'Richtig starten',
  l2b_li_27:
    '<b>Zuerst ein gemeinsames Aufgabenverständnis.</b> Ich kläre nach, bis das Modell die Aufgabe so versteht wie ich.',
  l2b_li_28:
    '<b>Stabile Regeln dauerhaft speichern</b> – im System-Prompt, Gem oder Projekt – und dem Modell sagen, wer <em>du</em> bist.',
  l2b_li_29:
    '<b>Wiederverwenden – Assistenten bauen.</b> Gems ≈ Projekte ≈ Custom GPTs; ein Meta-Prompt erstellt neue Entwürfe.',
  l2b_sg_30: 'Präzise sein',
  l2b_li_31: '<b>Exakte Länge</b> („3 Punkte, ≤12 Wörter“), nie nur „kurz“.',
  l2b_li_32:
    '<b>Dinge beim Namen oder mit Nummer nennen</b> – das Modell sieht deinen Bildschirm nicht.',
  l2b_li_33: '<b>Eingaben isolieren</b> – Daten ≠ Befehle.',
  l2b_sg_34: 'Wie Code behandeln',
  l2b_li_35: '<b>Temperatur = Vielfalt</b>, nicht Qualität.',
  l2b_li_36: '<b>Prompt korrigieren und neu generieren</b> – nicht mit der Ausgabe diskutieren.',
  l2b_li_37: '<b>Wenige Regeln</b>, keine Widersprüche.',
  l2b_colhead_38: 'Wie ich es gelernt habe',
  l2b_fail_39:
    '<span class="arrow">→</span> Temperatur <code>1.2</code> erfand eine falsche Tatsache → auf <code>0.9</code> gesenkt <b>plus</b> eine klare Regel zur <b>FAKTENGENAUIGKEIT</b>. <span class="paren">(mehrschichtige Absicherung)</span>',
  l2b_fail_40:
    '<span class="arrow">→</span> Ein Freitextfeld erlaubte beliebige Eingaben → eine enge <b>CONTENT-MODERATION</b>-Regel <b>plus</b> ein dauerhafter Regressionstest.',
  l2b_fail_41:
    '<span class="arrow">→</span> „Fortgeschritten“ war zu unklar → eine Beispielfrage pro Niveau. <span class="paren">(ein Beispiel ist stärker als ein Adjektiv)</span>',
  l2b_handnote_42:
    'Nichts davon stammt einfach aus einem Leitfaden. Ich lese echte Ausgaben, führe jeden Fehler auf eine Lücke zurück, schließe sie und schreibe einen Test, damit sie geschlossen bleibt. Genau darin liegt die Fähigkeit.',
  l3f_eyebrow_43: '<span class="num">03</span> Formate <span class="rule"></span>',
  l3f_title_44: 'Dasselbe Denken für drei Arten von Ausgabe',
  l3f_lead_45:
    'Prompting ist nicht nur Chat. Hier setze ich diese Prinzipien ein – mit dem wichtigsten Tipp für jedes Format.',
  l3f_t_46: 'Code',
  l3f_line_47:
    '<span class="lbl">Anwendungsfall:</span> Entwickler-Quizze in quizdom generieren und bewerten – typisiertes JSON (mit Zod validiert) plus ein zweites „Judge“-Modell, das das erste bewertet.',
  l3f_line_48:
    '<span class="lbl tip">Tipp</span> <b>Strukturierte Ausgabe gegen ein Schema erzwingen</b>, damit Abweichungen direkt am Aufruf abgefangen werden – statt drei Komponenten später einen Absturz auszulösen.',
  l3f_t_49: 'Präsentationen',
  l3f_line_50:
    '<span class="lbl">Anwendungsfall:</span> Engineering-Design-Reviews und Erklärungen technischer Architekturen.',
  l3f_line_51:
    '<span class="lbl tip">Tipp</span> <b>Das Modell soll mich zuerst interviewen</b> – mit „Stelle mir vor der Erstellung alle nötigen Rückfragen.“ Danach: zuerst Gliederung, eine Idee pro Folie, exakte Anzahl („8 Folien“).',
  l3f_t_52: 'Infografiken',
  l3f_line_53:
    '<span class="lbl">Anwendungsfall:</span> Eine Spezifikation oder ein Dokument in eine klare Visualisierung für nichttechnische Personen verwandeln.',
  l3f_line_54:
    '<span class="lbl tip">Tipp</span> Es ist <b>quellenbasiert</b> (saubere Quellen rein = gute Visualisierung raus) und rendert über Nano Banana Pro. Schreibe den Bild-Prompt wie ein Regiebriefing: Zweck → Motiv → Stil → Komposition → Licht → Palette → Format. Beschreibe, was du willst, nicht was du vermeiden willst („eine leere Straße“, nicht „keine Autos“).',
  l3b_eyebrow_55: '<span class="num">04</span> Meine Gems <span class="rule"></span>',
  l3b_title_56: 'Spezialisten, die ich einmal gebaut habe und wiederverwende',
  l3b_gt_57: 'Gem-Architekt',
  l3b_row_58:
    '<span class="k">Zweck —</span> erstellt erste Anweisungsentwürfe für andere Gems (Meta-Prompting statt leerer Seite).',
  l3b_row_59:
    '„Du bist Prompt-Engineer. Wenn ich einen Assistenten beschreibe, stelle Rückfragen und gib dann ein vollständiges Gem-Set aus: Rolle, Regeln, Ton, Ausgabeformat, zwei Beispielinteraktionen.“',
  l3b_row_60:
    '<span class="k">Nutzen —</span> „Ich möchte ein Gem, das X tut“ → sofort einsetzbare Konfiguration.',
  l3b_gt_61: 'Persönliche Ernährungsberatung',
  l3b_row_62:
    '<span class="k">Zweck —</span> personalisierte Ernährungstipps, ohne meine Situation jedes Mal neu zu erklären.',
  l3b_row_63:
    '„Du bist mein Ernährungscoach. Mein Ziel: fit bleiben. Praktische, konkrete Vorschläge; frage lieber nach, statt etwas anzunehmen; realistisch für einen vollen Terminkalender.“',
  l3b_row_64:
    '<span class="k">Nutzen —</span> konsistente, passende Antworten – der Kontext bleibt im Gem.',
  l3b_gt_65: 'Senior Full-Stack Architekt',
  l3b_row_66:
    '<span class="k">Zweck —</span> Sparringspartner für Designentscheidungen, ohne meinen Stack jedes Mal neu zu erklären.',
  l3b_row_67:
    '„…stelle zuerst Rückfragen, schlage dann 2–3 Ansätze mit Abwägungen vor, bevor du einen empfiehlst. Weise auf Skalierungsrisiken &amp; Overengineering hin. Stack: React/Next + Node.js.“',
  l3b_row_68:
    '<span class="k">Nutzen —</span> eine zweite Meinung, die blinde Flecken und Overengineering früh erkennt.',
  l3b_pattern_69:
    '<b>Das Muster:</b> Rolle + Regeln + Kontext + Ausgabeformat – schnell mit dem Architekten entworfen und bei der Nutzung verfeinert.',
  l4f_eyebrow_70: '<span class="num">05</span> Checkliste <span class="rule"></span>',
  l4f_title_71: 'Das ganze Handbuch auf einer Seite',
  l4f_modelNote_72:
    '<b>Das Modell passend zur Aufgabe wählen.</b> Zuerst entscheide ich: schneller Fix oder komplexe Lösung? Für einfache Arbeit nehme ich ein schnelles, leichtes Modell; bei Unklarheit, Abwägungen oder mehreren Schritten eines mit stärkerem Reasoning.',
  l4f_check_73:
    '<span class="box"></span><span>Grundlagen abgedeckt – <b>Rolle, Aufgabe, Kontext, Format</b>?</span>',
  l4f_check_74:
    '<span class="box"></span><span><b>Kontext und Warum</b> genannt, nicht nur die Aufgabe?</span>',
  l4f_check_75:
    '<span class="box"></span><span>Stabile Regeln stehen im <b>System-Prompt, Gem oder Projekt</b>?</span>',
  l4f_check_76:
    '<span class="box"></span><span>Jede Länge als <b>exakte Zahl</b>, nie nur „kurz“?</span>',
  l4f_check_77:
    '<span class="box"></span><span>Dinge mit <b>klarem Namen oder Nummer</b> bezeichnet?</span>',
  l4f_check_78:
    '<span class="box"></span><span>Nicht vertrauenswürdige Daten <b>isoliert</b> und als Daten statt Befehle markiert?</span>',
  l4f_check_79:
    '<span class="box"></span><span><b>Temperatur passend</b> zur Aufgabe (hoch = Vielfalt, niedrig = reproduzierbar)?</span>',
  l4f_check_80:
    '<span class="box"></span><span>Ausgabe mit einem <b>Schema validiert</b>, wenn sie in Code fließt?</span>',
  l4f_check_81:
    '<span class="box"></span><span>Bei Fehlern den <b>Prompt ändern und neu generieren</b> – statt zu diskutieren?</span>',
  l4f_check_82:
    '<span class="box"></span><span>Jede Regel aus einem <b>echten Fehler</b> abgeleitet – und keine Widersprüche?</span>',
  l4f_closequote_83:
    '<span>"Jeder Fehler lehrt mich doppelt: Ich trainiere das Modell – und währenddessen lerne ich selbst. Es ist eine kontinuierliche Schleife: integrieren, ausliefern, lernen, wiederholen."</span>',
  l4b_insideJoke_84: 'Ich bat die KI um sauberen Code.<br/>Sie gab mir eine leere Datei.',
  alt_gemArchitect: 'Porträt des Gems „Gem-Architekt“',
  alt_gemNutritionist: 'Porträt des Gems „Persönliche Ernährungsberatung“',
  alt_gemFullstack: 'Porträt des Gems „Senior Full-Stack Architekt“',
};
