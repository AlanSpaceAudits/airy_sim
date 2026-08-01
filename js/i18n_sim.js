(function(){
/* Sim-side translation. The sim draws most of its text on <canvas>, which the
 * deck's DOM translator cannot reach, so the sim carries its own dictionary.
 * AIY.L(s) returns the translation of s for the current AIY.lang, or s itself
 * when English / not found. util.js routes every AIY.text() through it, and the
 * DOM-panel builders wrap their labels in AIY.L too. The deck's language toggle
 * sets AIY.lang on this iframe (see i18n.js). Numbers/symbols stay English. */
'use strict';
const AIY = window.AIY = window.AIY || {};
AIY.lang = 'en';
const norm = s => (''+s).replace(/\s+/g,' ').trim();

const T = {
cz:{
// theory dropdown
"Aberration — Air":"Aberace — vzduch","Emission theory":"Emisní teorie","Klinkerfues 1867":"Klinkerfues 1867",
"Undulatory (wave)":"Vlnová (undulační)","Snell (classical)":"Snell (klasický)","Snell × γ (velocity comp.)":"Snell × γ (skládání rychlostí)",
"Special Relativity":"Speciální relativita","Pauli 1921 §36γ":"Pauli 1921 §36γ","Rosser 1964 §4.4":"Rosser 1964 §4.4",
"Jones 1972 (transverse drag, measured)":"Jones 1972 (příčné strhávání, naměřeno)","Geocentric":"Geocentrický",
"Micrometer — meridian transit":"Mikrometr — průchod poledníkem",
// panel controls
"Stellar Aberration":"Hvězdná aberace","Theory / prediction":"Teorie / předpověď","Show":"Zobrazit",
"Reads — calibrated (θ_int × n)":"Čtení — kalibrované (θ_int × n)","Reads — raw (air scale)":"Čtení — surové (stupnice vzduchu)",
"θ_int — predicted internal angle":"θ_int — předpovězený vnitřní úhel","Micrometer — plate drift (µm)":"Mikrometr — posun na desce (µm)",
"Star latitude:":"Šířka hvězdy:","Orbital phase (months):":"Orbitální fáze (měsíce):","Aberration exaggeration:":"Zvětšení aberace:",
"Animate":"Animovat","True star / incoming":"Skutečná hvězda / příchozí","Apparent / refracted":"Zdánlivá / lomená",
"Earth velocity":"Rychlost Země","Sky velocity":"Rychlost oblohy","Star":"Hvězda","Velocity":"Rychlost",
"Full data & derivations:":"Úplná data a odvození:","Math in use":"Použitá matematika",
"Heliocentric":"Heliocentrický","Water at rest":"Voda v klidu","Water in motion":"Voda v pohybu","Earth at rest":"Země v klidu","Earth moving":"Země v pohybu","Same aberrated incidence 20.55″. Stationary Earth → Snell 15.45″ (reads 20.55″). Moving Earth → drag 11.88″ (reads 15.80″).":"Stejný aberovaný dopad 20,55″. Nehybná Země → Snell 15,45″ (čte 20,55″). Pohybující se Země → strhávání 11,88″ (čte 15,80″).","20.55″ for a moving Earth is recovered only by transforming to the Earth-rest frame.":"20,55″ pro pohybující se Zemi se získá jen transformací do klidové soustavy Země.","Air":"Vzduch","Water":"Voda",
// math legend labels
"this theory predicts":"tato teorie předpovídá","θ_int (in water)":"θ_int (ve vodě)","plate drift":"posun na desce",
"speed in water":"rychlost ve vodě","medium":"prostředí","air, n = 1":"vzduch, n = 1","water, n = 1.33":"voda, n = 1,33",
"1 · displacement (measured)":"1 · posun (naměřeno)","2 · celestial arc (reads)":"2 · nebeský oblouk (čtení)",
"3 · internal tilt (implied)":"3 · vnitřní náklon (odvozeno)","physical tube length":"fyzická délka trubice",
"MICROMETER SCALE (Airy p.39)":"STUPNICE MIKROMETRU (Airy s.39)","raw angle (air scale)":"surový úhel (stupnice vzduchu)",
"water scale":"stupnice vody","calibrated reads":"kalibrované čtení","SAME PLATE DISPLACEMENT":"STEJNÝ POSUN NA DESCE",
"OFFSET → READING":"POSUN → ČTENÍ","air (tube 706 mm)":"vzduch (trubice 706 mm)","water (tube 940 mm)":"voda (trubice 940 mm)",
"both read":"obojí čte",
// canvas
"AIR TUBE":"TRUBICE SE VZDUCHEM","WATER TUBE":"TRUBICE S VODOU","air reference":"reference (vzduch)",
"incoming starlight, aberrated by α = 20.55″":"příchozí hvězdné světlo, aberované o α = 20,55″",
"× n finer scale":"× n jemnější stupnice","meridian":"poledník","AIR TELESCOPE — eyepiece":"DALEKOHLED SE VZDUCHEM — okulár",
"WATER-FILLED TELESCOPE — eyepiece":"DALEKOHLED S VODOU — okulár",
"transits 0.9′ from the zenith — Airy’s chosen star":"prochází 0,9′ od zenitu — Airyho zvolená hvězda",
"current":"aktuální","expected transit":"očekávaný průchod",
"★ caught at transit — plate position is the measurement":"★ zachyceno při průchodu — poloha na desce je měření",
"MICROMETER READING → CELESTIAL ARC":"ČTENÍ MIKROMETRU → NEBESKÝ OBLOUK",
"1 · measured on the plate":"1 · naměřeno na desce","2 · convert to a sky angle — the reading":"2 · převod na nebeský úhel — čtení",
"3 · internal tilt — implied afterward (or via Snell)":"3 · vnitřní náklon — odvozený až potom (nebo Snellem)",
"the star's offset from the meridian wire at transit":"posun hvězdy od poledníkového vlákna při průchodu",
"same celestial arc, different plate":"stejný nebeský oblouk, jiná deska",
"Airy's reading":"Airyho čtení",
"What do \u201creading\u201d and \u201cinternal angle\u201d mean?":"Co znamená \u201ečtení\u201c a \u201evnitřní úhel\u201c?",
"plate displacement, measured (µm)":"posun na desce, naměřeno (µm)",
"focal length, air-equivalent = 706 mm":"ohnisková vzdálenost, ekvivalent ve vzduchu = 706 mm",
"physical tube length — air 706 mm, water 940 mm":"fyzická délka trubice — vzduch 706 mm, voda 940 mm",
"measured":"naměřeno","requires":"vyžaduje","predicts":"předpovídá","prediction matches Airy":"předpověď souhlasí s Airym",
"cali":"kalib.","raw":"surové","benchmark":"základ","micro":"mikro","drift":"posun","predicted":"předpovězeno",
"Airy's lab frame value":"Airyho hodnota v lab. soustavě",
"needs 1.33 c — Foucault measured 0.75 c":"vyžaduje 1,33 c – Foucault naměřil 0,75 c",
"Reading":"Čtení","Internal angle (θ_int)":"Vnitřní úhel (θ_int)","Aberration":"Aberace","Micrometer × n":"Mikrometr × n",
"— the celestial arc the micrometer reports: the star's sideways drift on the wire plate divided by that telescope's own scale. Airy's 20.55″ is a reading, not a direct angle.":"– nebeský oblouk, který mikrometr hlásí: boční posun hvězdy na drátkové desce dělený vlastní stupnicí toho dalekohledu. Airyho 20,55″ je údaj, ne přímý úhel.",
"— the physical tilt the ray must take inside the tube to produce that reading. It is implied, not measured; a 20.55″ reading needs 15.45″ inside the water.":"– fyzický náklon, který musí paprsek zaujmout uvnitř trubice, aby vznikl tento údaj. Je odvozený, ne měřený; údaj 20,55″ vyžaduje uvnitř vody 15,45″.",
"— the incoming tilt θ_ext = arctan(v/c) = 20.55″, set by the observer's velocity. The reading recovers it.":"– příchozí náklon θ_ext = arctan(v/c) = 20,55″, daný rychlostí pozorovatele. Údaj jej obnoví.",
"— the water plate is calibrated n times finer than air (Airy p.39: 27.8-inch air-equivalent vs 37.0-inch tube), so 15.45″ inside reads the same 20.55″ as air. That × n scaling is the whole reason the water null holds.":"– vodní deska je kalibrována n-krát jemněji než vzduch (Airy s.39: 27,8 palce vzduchu odpovídající vs 37,0 palce trubice), takže 15,45″ uvnitř čte tentýž 20,55″ jako vzduch. Toto škálování × n je celý důvod, proč platí vodní nula.",
"Starlight aberrates by α = arctan(v/c) before it reaches any telescope. Air adds nothing.":"Hvězdné světlo aberuje o α = arctan(v/c), než dosáhne jakéhokoli dalekohledu. Vzduch nic nepřidává.",
"Corpuscular refraction is Snell, so the angle is right. It dies on speed: it needs 1.33 c, and Foucault measured 0.75 c.":"Korpuskulární lom je Snell, takže úhel je správný. Padá na rychlosti: vyžaduje 1,33 c, a Foucault naměřil 0,75 c.",
"The original 1867 wave prediction Airy tested. Light slows to v/n, so the water telescope should read n²α = 36.35″. Airy measured 20.55″, unchanged. Falsified by a factor of n².":"Původní vlnová předpověď z roku 1867, kterou Airy testoval. Světlo se zpomalí na v/n, takže vodní dalekohled by měl číst n²α = 36,35″. Airy naměřil 20,55″, beze změny. Vyvráceno faktorem n².",
"Wave slowed to c/n while the tube keeps moving. The internal tilt grows to 27.33″; reads 36.35″.":"Vlna zpomalená na c/n, zatímco se trubice dál pohybuje. Vnitřní náklon roste na 27,33″; čte 36,35″.",
"Identical to the wave prediction: 27.33″ inside, reads 36.35″.":"Totožné s vlnovou předpovědí: 27,33″ uvnitř, čte 36,35″.",
"γ in front moves the answer by a ten-millionth of an arcsec. Still 27.33″, reads 36.35″.":"γ vpředu posune odpověď o desetimiliontinu obloukové vteřiny. Stále 27,33″, čte 36,35″.",
"Rest frame reproduces Airy: 15.45″ → 20.55″. Moving frame gives 11.88″ → 15.80″, never measured.":"Klidová soustava reprodukuje Airyho: 15,45″ → 20,55″. Pohybující se soustava dává 11,88″ → 15,80″, nikdy nenaměřeno.",
"His own equation gives 15.45″ in the water's rest frame. §36γ stops before the moving case.":"Jeho vlastní rovnice dává 15,45″ v klidové soustavě vody. §36γ končí před pohybujícím se případem.",
"§4.4.5 argues Airy in the water's rest frame with no equation. Rest 15.45″, moving 11.88″.":"§4.4.5 řeší Airyho v klidové soustavě vody bez rovnice. V klidu 15,45″, v pohybu 11,88″.",
"The moving-frame transverse drag, measured directly in Airy's geometry to 0.02%. θ_int = 11.88″ reads 15.80″, not 20.55″. Read as a speed the moving frame needs 1.73c; the real speed is 0.75c.":"Příčné strhávání v pohybující se soustavě, změřené přímo v Airyho geometrii s přesností 0,02 %. θ_int = 11,88″ čte 15,80″, ne 20,55″. Čteno jako rychlost, pohybující se soustava vyžaduje 1,73c; skutečná rychlost je 0,75c.",
"Earth and water at rest. Ordinary Snell: 15.45″ inside, reads 20.55″. Matches, in one frame.":"Země a voda v klidu. Obyčejný Snell: 15,45″ uvnitř, čte 20,55″. Souhlasí, v jedné soustavě.",
"γ Draconis drifts to the meridian wire and is caught at the predicted transit instant. Airy read the star’s plate displacement, not an angle, then converted it to a celestial arc. The internal tilt is only known afterwards, by implication. Air (tube 706 mm) and water (tube 940 mm) land at the same displacement, so both read 20.55″.":"γ Draconis se posouvá k poledníkovému vláknu a je zachycena v předpovězeném okamžiku průchodu. Airy odečetl posun hvězdy na desce, ne úhel, a pak jej převedl na nebeský oblouk. Vnitřní náklon je znám až potom, odvozením. Vzduch (trubice 706 mm) a voda (trubice 940 mm) dopadnou na stejný posun, takže obojí čte 20,55″."
},
sk:{
"Aberration — Air":"Aberácia — vzduch","Emission theory":"Emisná teória","Klinkerfues 1867":"Klinkerfues 1867",
"Undulatory (wave)":"Vlnová (undulačná)","Snell (classical)":"Snell (klasický)","Snell × γ (velocity comp.)":"Snell × γ (skladanie rýchlostí)",
"Special Relativity":"Špeciálna relativita","Pauli 1921 §36γ":"Pauli 1921 §36γ","Rosser 1964 §4.4":"Rosser 1964 §4.4",
"Jones 1972 (transverse drag, measured)":"Jones 1972 (priečne strhávanie, namerané)","Geocentric":"Geocentrický",
"Micrometer — meridian transit":"Mikrometer — prechod poludníkom",
"Stellar Aberration":"Hviezdna aberácia","Theory / prediction":"Teória / predpoveď","Show":"Zobraziť",
"Reads — calibrated (θ_int × n)":"Čítanie — kalibrované (θ_int × n)","Reads — raw (air scale)":"Čítanie — surové (stupnica vzduchu)",
"θ_int — predicted internal angle":"θ_int — predpovedaný vnútorný uhol","Micrometer — plate drift (µm)":"Mikrometer — posun na doske (µm)",
"Star latitude:":"Šírka hviezdy:","Orbital phase (months):":"Orbitálna fáza (mesiace):","Aberration exaggeration:":"Zväčšenie aberácie:",
"Animate":"Animovať","True star / incoming":"Skutočná hviezda / prichádzajúci","Apparent / refracted":"Zdanlivá / lomená",
"Earth velocity":"Rýchlosť Zeme","Sky velocity":"Rýchlosť oblohy","Star":"Hviezda","Velocity":"Rýchlosť",
"Full data & derivations:":"Úplné dáta a odvodenia:","Math in use":"Použitá matematika",
"Heliocentric":"Heliocentrický","Water at rest":"Voda v pokoji","Water in motion":"Voda v pohybe","Earth at rest":"Zem v pokoji","Earth moving":"Zem v pohybe","Same aberrated incidence 20.55″. Stationary Earth → Snell 15.45″ (reads 20.55″). Moving Earth → drag 11.88″ (reads 15.80″).":"Rovnaký aberovaný dopad 20,55″. Nehybná Zem → Snell 15,45″ (číta 20,55″). Pohybujúca sa Zem → strhávanie 11,88″ (číta 15,80″).","20.55″ for a moving Earth is recovered only by transforming to the Earth-rest frame.":"20,55″ pre pohybujúcu sa Zem sa získa len transformáciou do pokojovej sústavy Zeme.","Air":"Vzduch","Water":"Voda",
"this theory predicts":"táto teória predpovedá","θ_int (in water)":"θ_int (vo vode)","plate drift":"posun na doske",
"speed in water":"rýchlosť vo vode","medium":"prostredie","air, n = 1":"vzduch, n = 1","water, n = 1.33":"voda, n = 1,33",
"1 · displacement (measured)":"1 · posun (namerané)","2 · celestial arc (reads)":"2 · nebeský oblúk (čítanie)",
"3 · internal tilt (implied)":"3 · vnútorný náklon (odvodené)","physical tube length":"fyzická dĺžka trubice",
"MICROMETER SCALE (Airy p.39)":"STUPNICA MIKROMETRA (Airy s.39)","raw angle (air scale)":"surový uhol (stupnica vzduchu)",
"water scale":"stupnica vody","calibrated reads":"kalibrované čítanie","SAME PLATE DISPLACEMENT":"ROVNAKÝ POSUN NA DOSKE",
"OFFSET → READING":"POSUN → ČÍTANIE","air (tube 706 mm)":"vzduch (trubica 706 mm)","water (tube 940 mm)":"voda (trubica 940 mm)",
"both read":"obe čítajú",
"AIR TUBE":"TRUBICA SO VZDUCHOM","WATER TUBE":"TRUBICA S VODOU","air reference":"referencia (vzduch)",
"incoming starlight, aberrated by α = 20.55″":"prichádzajúce hviezdne svetlo, aberované o α = 20,55″",
"× n finer scale":"× n jemnejšia stupnica","meridian":"poludník","AIR TELESCOPE — eyepiece":"ĎALEKOHĽAD SO VZDUCHOM — okulár",
"WATER-FILLED TELESCOPE — eyepiece":"ĎALEKOHĽAD S VODOU — okulár",
"transits 0.9′ from the zenith — Airy’s chosen star":"prechádza 0,9′ od zenitu — Airyho zvolená hviezda",
"current":"aktuálne","expected transit":"očakávaný prechod",
"★ caught at transit — plate position is the measurement":"★ zachytené pri prechode — poloha na doske je meranie",
"MICROMETER READING → CELESTIAL ARC":"ČÍTANIE MIKROMETRA → NEBESKÝ OBLÚK",
"1 · measured on the plate":"1 · namerané na doske","2 · convert to a sky angle — the reading":"2 · prevod na nebeský uhol — čítanie",
"3 · internal tilt — implied afterward (or via Snell)":"3 · vnútorný náklon — odvodený až potom (alebo Snellom)",
"the star's offset from the meridian wire at transit":"posun hviezdy od poludníkového vlákna pri prechode",
"same celestial arc, different plate":"rovnaký nebeský oblúk, iná doska",
"Airy's reading":"Airyho čítanie",
"What do \u201creading\u201d and \u201cinternal angle\u201d mean?":"Čo znamená \u201ečítanie\u201c a \u201evnútorný uhol\u201c?",
"plate displacement, measured (µm)":"posun na doske, namerané (µm)",
"focal length, air-equivalent = 706 mm":"ohnisková vzdialenosť, ekvivalent vo vzduchu = 706 mm",
"physical tube length — air 706 mm, water 940 mm":"fyzická dĺžka trubice — vzduch 706 mm, voda 940 mm",
"measured":"namerané","requires":"vyžaduje","predicts":"predpovedá","prediction matches Airy":"predpoveď súhlasí s Airym",
"cali":"kalib.","raw":"surové","benchmark":"základ","micro":"mikro","drift":"posun","predicted":"predpovedané",
"Airy's lab frame value":"Airyho hodnota v lab. sústave",
"needs 1.33 c — Foucault measured 0.75 c":"vyžaduje 1,33 c – Foucault nameral 0,75 c",
"Reading":"Čítanie","Internal angle (θ_int)":"Vnútorný uhol (θ_int)","Aberration":"Aberácia","Micrometer × n":"Mikrometer × n",
"— the celestial arc the micrometer reports: the star's sideways drift on the wire plate divided by that telescope's own scale. Airy's 20.55″ is a reading, not a direct angle.":"– nebeský oblúk, ktorý mikrometer hlási: bočný posun hviezdy na drôtikovej doske delený vlastnou stupnicou toho ďalekohľadu. Airyho 20,55″ je údaj, nie priamy uhol.",
"— the physical tilt the ray must take inside the tube to produce that reading. It is implied, not measured; a 20.55″ reading needs 15.45″ inside the water.":"– fyzický náklon, ktorý musí lúč zaujať vnútri trubice, aby vznikol tento údaj. Je odvodený, nie meraný; údaj 20,55″ vyžaduje vnútri vody 15,45″.",
"— the incoming tilt θ_ext = arctan(v/c) = 20.55″, set by the observer's velocity. The reading recovers it.":"– prichádzajúci náklon θ_ext = arctan(v/c) = 20,55″, daný rýchlosťou pozorovateľa. Údaj ho obnoví.",
"— the water plate is calibrated n times finer than air (Airy p.39: 27.8-inch air-equivalent vs 37.0-inch tube), so 15.45″ inside reads the same 20.55″ as air. That × n scaling is the whole reason the water null holds.":"– vodná doska je kalibrovaná n-krát jemnejšie než vzduch (Airy s.39: 27,8 palca vzduchu zodpovedajúci vs 37,0 palca trubice), takže 15,45″ vnútri číta ten istý 20,55″ ako vzduch. Toto škálovanie × n je celý dôvod, prečo platí vodná nula.",
"Starlight aberrates by α = arctan(v/c) before it reaches any telescope. Air adds nothing.":"Hviezdne svetlo aberuje o α = arctan(v/c), než dosiahne akýkoľvek ďalekohľad. Vzduch nič nepridáva.",
"Corpuscular refraction is Snell, so the angle is right. It dies on speed: it needs 1.33 c, and Foucault measured 0.75 c.":"Korpuskulárny lom je Snell, takže uhol je správny. Padá na rýchlosti: vyžaduje 1,33 c, a Foucault nameral 0,75 c.",
"The original 1867 wave prediction Airy tested. Light slows to v/n, so the water telescope should read n²α = 36.35″. Airy measured 20.55″, unchanged. Falsified by a factor of n².":"Pôvodná vlnová predpoveď z roku 1867, ktorú Airy testoval. Svetlo sa spomalí na v/n, takže vodný ďalekohľad by mal čítať n²α = 36,35″. Airy nameral 20,55″, bez zmeny. Vyvrátené faktorom n².",
"Wave slowed to c/n while the tube keeps moving. The internal tilt grows to 27.33″; reads 36.35″.":"Vlna spomalená na c/n, kým sa trubica ďalej pohybuje. Vnútorný náklon rastie na 27,33″; číta 36,35″.",
"Identical to the wave prediction: 27.33″ inside, reads 36.35″.":"Totožné s vlnovou predpoveďou: 27,33″ vnútri, číta 36,35″.",
"γ in front moves the answer by a ten-millionth of an arcsec. Still 27.33″, reads 36.35″.":"γ vpredu posunie odpoveď o desaťmilióntinu oblúkovej sekundy. Stále 27,33″, číta 36,35″.",
"Rest frame reproduces Airy: 15.45″ → 20.55″. Moving frame gives 11.88″ → 15.80″, never measured.":"Pokojová sústava reprodukuje Airyho: 15,45″ → 20,55″. Pohybujúca sa sústava dáva 11,88″ → 15,80″, nikdy nameraná.",
"His own equation gives 15.45″ in the water's rest frame. §36γ stops before the moving case.":"Jeho vlastná rovnica dáva 15,45″ v pokojovej sústave vody. §36γ končí pred pohybujúcim sa prípadom.",
"§4.4.5 argues Airy in the water's rest frame with no equation. Rest 15.45″, moving 11.88″.":"§4.4.5 rieši Airyho v pokojovej sústave vody bez rovnice. V pokoji 15,45″, v pohybe 11,88″.",
"The moving-frame transverse drag, measured directly in Airy's geometry to 0.02%. θ_int = 11.88″ reads 15.80″, not 20.55″. Read as a speed the moving frame needs 1.73c; the real speed is 0.75c.":"Priečne strhávanie v pohybujúcej sa sústave, zmerané priamo v Airyho geometrii s presnosťou 0,02 %. θ_int = 11,88″ číta 15,80″, nie 20,55″. Čítané ako rýchlosť, pohybujúca sa sústava vyžaduje 1,73c; skutočná rýchlosť je 0,75c.",
"Earth and water at rest. Ordinary Snell: 15.45″ inside, reads 20.55″. Matches, in one frame.":"Zem a voda v pokoji. Obyčajný Snell: 15,45″ vnútri, číta 20,55″. Súhlasí, v jednej sústave.",
"γ Draconis drifts to the meridian wire and is caught at the predicted transit instant. Airy read the star’s plate displacement, not an angle, then converted it to a celestial arc. The internal tilt is only known afterwards, by implication. Air (tube 706 mm) and water (tube 940 mm) land at the same displacement, so both read 20.55″.":"γ Draconis sa posúva k poludníkovému vláknu a je zachytená v predpovedanom okamihu prechodu. Airy odčítal posun hviezdy na doske, nie uhol, a potom ho previedol na nebeský oblúk. Vnútorný náklon je známy až potom, odvodením. Vzduch (trubica 706 mm) a voda (trubica 940 mm) dopadnú na rovnaký posun, takže obe čítajú 20,55″."
}
};

AIY.L = function(s){
  if(AIY.lang === 'en' || s == null) return s;
  const d = T[AIY.lang]; if(!d) return s;
  const v = d[norm(s)];
  return v !== undefined ? v : s;
};

const PH = {
cz:[["(measured on the plate)","(naměřeno na desce)"],["(tangential velocity conserved)","(tečná rychlost zachována)"],["(wave slows)","(vlna se zpomaluje)"],["water at rest, no drag term","voda v klidu, bez členu strhávání"],["water at rest:","voda v klidu:"],["water moving:","voda v pohybu:"],["speed in water","rychlost ve vodě"],["focal length","ohnisková vzdálenost"],["tube length","délka trubice"],["displacement","posun"],["reads","čte"],["measured","naměřeno"],["(implied)","(odvozeno)"],["rest ","v klidu "],["moving","v pohybu"]],
sk:[["(measured on the plate)","(namerané na doske)"],["(tangential velocity conserved)","(dotyčnicová rýchlosť zachovaná)"],["(wave slows)","(vlna sa spomaľuje)"],["water at rest, no drag term","voda v pokoji, bez člena strhávania"],["water at rest:","voda v pokoji:"],["water moving:","voda v pohybe:"],["speed in water","rýchlosť vo vode"],["focal length","ohnisková vzdialenosť"],["tube length","dĺžka trubice"],["displacement","posun"],["reads","číta"],["measured","namerané"],["(implied)","(odvodené)"],["rest ","v pokoji "],["moving","v pohybe"]]
};
AIY.Lf = function(s){
  if(AIY.lang==='en'||s==null) return s;
  const list = PH[AIY.lang]; if(!list) return s;
  let out=''+s; for(let i=0;i<list.length;i++) out=out.split(list[i][0]).join(list[i][1]); return out;
};

// Static panel labels are plain DOM the sim never regenerates, so translate
// their leading/trailing text nodes in place (preserving nested inputs/selects).
AIY.translateStatic = function(root){
  root = root || document;
  root.querySelectorAll('h2, li, label, p.src, .help summary, .help p, .help p b').forEach(el=>{
    [...el.childNodes].forEach(nd=>{
      if(nd.nodeType !== 3 || !/[A-Za-z]/.test(nd.nodeValue)) return;
      if(nd.__en === undefined) nd.__en = nd.nodeValue;
      const pre = nd.__en.match(/^\s*/)[0], post = nd.__en.match(/\s*$/)[0];
      const key = norm(nd.__en);
      if(AIY.lang === 'en'){ nd.nodeValue = nd.__en; return; }
      const tr = AIY.L(key);
      nd.nodeValue = (tr && tr !== key) ? pre + tr + post : nd.__en;
    });
  });
};
})();
