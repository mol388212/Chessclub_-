"use strict";

/* =========================================================
   CHESS CLUB V2
   FULL 7-LANGUAGE TRANSLATION SYSTEM

   Languages:
   English 🇬🇧
   Persian  🇮🇷
   German  🇩🇪
   Norwegian 🇳🇴
   Spanish 🇪🇸
   Arabic  🇸🇦
   French  🇫🇷
========================================================= */


/* =========================================================
   1. TRANSLATIONS
========================================================= */

const V2_LANG = {

    en: {
        community: "COMMUNITY",
        communityHub: "Chess Club Community",
        communitySubtitle: "Friends, rankings, chess news and player blogs.",

        friends: "Friends",
        clubMembers: "Club Members",
        coaches: "Coaches",
        topPlayers: "Top Players",
        rankings: "Rankings",
        chessToday: "Chess Today",
        news: "News",
        blogs: "Blogs",

        merch: "MERCH",
        chessClubMerch: "Chess Club Merch",
        merchSubtitle: "Wear the club. Play the game.",
        clothing: "Chess Club Clothing",
        suit: "Chess Club Suit",
        backToSchool: "Back to School",
        special: "Chess Club Special",
        officialCollection: "Official Chess Club collection.",
        view: "View",
        merchPreview: "Chess Club merchandise preview.",

        soloChess: "SOLO CHESS",
        playYourself: "Play Chess With Yourself",
        soloSubtitle: "Control both sides. Your pieces can capture your own pieces.",
        newSoloGame: "New Solo Game",
        soloRules: "Solo Chess",
        selectPiece: "Select any piece.",
        selectDestination: "Select a destination.",
        ownPiece: "× own piece",

        puzzles: "PUZZLES",
        nineHundredPuzzles: "900 Puzzles",
        puzzleSubtitle: "A 900-puzzle Chess Club collection.",
        totalPuzzles: "Total puzzles",
        completed: "Completed",
        current: "Current",

        mateInOne: "Mate in One",
        knightFork: "Knight Fork",
        backRank: "Back Rank",
        winningCapture: "Winning Capture",
        endgameMove: "Endgame Move",
        openingIdea: "Opening Idea",
        sacrifice: "Sacrifice",
        queenTactic: "Queen Tactic",
        rookAttack: "Rook Attack",
        rating: "Rating",

        communityFriendsTitle: "Friends",
        communityFriendsText: "Your Chess Club friends.",
        communityMembersTitle: "Club Members",
        communityMembersText: "Players who are part of Chess Club.",
        communityCoachesTitle: "Coaches",
        communityCoachesText: "Chess Club coaches.",
        communityTopTitle: "Top Players",
        communityTopText: "The strongest Chess Club players.",
        communityRankingsTitle: "Chess Rankings",
        communityRankingsText: "Chess Club rankings.",
        communityTodayTitle: "Chess Today",
        communityTodayText: "Today's Chess Club activity.",
        communityNewsTitle: "Chess News",
        communityNewsText: "News from Chess Club.",
        communityBlogsTitle: "Player Blogs",
        communityBlogsText: "Chess Club member blogs.",
        noBlogs: "No blogs yet.",
        chessClubBlog: "Chess Club Blog"
    },

    fa: {
        community: "جامعه",
        communityHub: "جامعه Chess Club",
        communitySubtitle: "دوستان، رتبه‌بندی، اخبار شطرنج و وبلاگ بازیکنان.",

        friends: "دوستان",
        clubMembers: "اعضای باشگاه",
        coaches: "مربی‌ها",
        topPlayers: "بازیکنان برتر",
        rankings: "رتبه‌بندی",
        chessToday: "شطرنج امروز",
        news: "اخبار",
        blogs: "وبلاگ‌ها",

        merch: "فروشگاه",
        chessClubMerch: "محصولات Chess Club",
        merchSubtitle: "با باشگاه بازی کن، با باشگاه بپوش.",
        clothing: "لباس Chess Club",
        suit: "کت‌وشلوار Chess Club",
        backToSchool: "بازگشت به مدرسه",
        special: "محصول ویژه Chess Club",
        officialCollection: "مجموعه رسمی Chess Club.",
        view: "مشاهده",
        merchPreview: "پیش‌نمایش محصولات Chess Club.",

        soloChess: "شطرنج انفرادی",
        playYourself: "با خودت شطرنج بازی کن",
        soloSubtitle: "هر دو طرف را کنترل کن؛ مهره‌های خودت هم می‌توانند همدیگر را بگیرند.",
        newSoloGame: "بازی جدید",
        soloRules: "شطرنج انفرادی",
        selectPiece: "یک مهره را انتخاب کن.",
        selectDestination: "مقصد را انتخاب کن.",
        ownPiece: "× مهره خودی",

        puzzles: "پازل‌ها",
        nineHundredPuzzles: "۹۰۰ پازل",
        puzzleSubtitle: "مجموعه ۹۰۰ پازل Chess Club.",
        totalPuzzles: "تعداد کل پازل‌ها",
        completed: "تکمیل‌شده",
        current: "فعلی",

        mateInOne: "مات در یک حرکت",
        knightFork: "فورک اسب",
        backRank: "مات ردیف آخر",
        winningCapture: "گرفتن برنده",
        endgameMove: "حرکت آخر بازی",
        openingIdea: "ایده شروع بازی",
        sacrifice: "فداکاری",
        queenTactic: "تاکتیک وزیر",
        rookAttack: "حمله رخ",
        rating: "امتیاز",

        communityFriendsTitle: "دوستان",
        communityFriendsText: "دوستان Chess Club شما.",
        communityMembersTitle: "اعضای باشگاه",
        communityMembersText: "بازیکنانی که عضو Chess Club هستند.",
        communityCoachesTitle: "مربی‌ها",
        communityCoachesText: "مربی‌های Chess Club.",
        communityTopTitle: "بازیکنان برتر",
        communityTopText: "قوی‌ترین بازیکنان Chess Club.",
        communityRankingsTitle: "رتبه‌بندی شطرنج",
        communityRankingsText: "رتبه‌بندی Chess Club.",
        communityTodayTitle: "شطرنج امروز",
        communityTodayText: "فعالیت امروز Chess Club.",
        communityNewsTitle: "اخبار شطرنج",
        communityNewsText: "اخبار Chess Club.",
        communityBlogsTitle: "وبلاگ بازیکنان",
        communityBlogsText: "وبلاگ‌های اعضای Chess Club.",
        noBlogs: "هنوز وبلاگی وجود ندارد.",
        chessClubBlog: "وبلاگ Chess Club"
    },

    de: {
        community: "COMMUNITY",
        communityHub: "Chess Club Community",
        communitySubtitle: "Freunde, Ranglisten, Schachnachrichten und Spielerblogs.",

        friends: "Freunde",
        clubMembers: "Clubmitglieder",
        coaches: "Trainer",
        topPlayers: "Topspieler",
        rankings: "Rangliste",
        chessToday: "Schach heute",
        news: "Nachrichten",
        blogs: "Blogs",

        merch: "MERCH",
        chessClubMerch: "Chess Club Merch",
        merchSubtitle: "Trage den Club. Spiele Schach.",
        clothing: "Chess Club Kleidung",
        suit: "Chess Club Anzug",
        backToSchool: "Zurück zur Schule",
        special: "Chess Club Spezial",
        officialCollection: "Offizielle Chess Club Kollektion.",
        view: "Ansehen",
        merchPreview: "Vorschau der Chess Club Merchandise.",

        soloChess: "SOLOSCHACH",
        playYourself: "Schach gegen dich selbst",
        soloSubtitle: "Steuere beide Seiten. Deine Figuren können eigene Figuren schlagen.",
        newSoloGame: "Neues Spiel",
        soloRules: "Soloschach",
        selectPiece: "Wähle eine Figur.",
        selectDestination: "Wähle ein Zielfeld.",
        ownPiece: "× eigene Figur",

        puzzles: "PUZZLES",
        nineHundredPuzzles: "900 Puzzles",
        puzzleSubtitle: "900 Chess Club-Puzzles.",
        totalPuzzles: "Puzzles insgesamt",
        completed: "Abgeschlossen",
        current: "Aktuell",

        mateInOne: "Matt in einem Zug",
        knightFork: "Springergabel",
        backRank: "Grundreihe",
        winningCapture: "Gewinnender Schlag",
        endgameMove: "Endspielzug",
        openingIdea: "Eröffnungsidee",
        sacrifice: "Opfer",
        queenTactic: "Damentaktik",
        rookAttack: "Turmangriff",
        rating: "Bewertung",

        communityFriendsTitle: "Freunde",
        communityFriendsText: "Deine Chess Club-Freunde.",
        communityMembersTitle: "Clubmitglieder",
        communityMembersText: "Spieler, die Teil von Chess Club sind.",
        communityCoachesTitle: "Trainer",
        communityCoachesText: "Chess Club-Trainer.",
        communityTopTitle: "Topspieler",
        communityTopText: "Die stärksten Chess Club-Spieler.",
        communityRankingsTitle: "Schachrangliste",
        communityRankingsText: "Chess Club-Rangliste.",
        communityTodayTitle: "Schach heute",
        communityTodayText: "Die heutige Chess Club-Aktivität.",
        communityNewsTitle: "Schachnachrichten",
        communityNewsText: "Nachrichten von Chess Club.",
        communityBlogsTitle: "Spielerblogs",
        communityBlogsText: "Blogs von Chess Club-Mitgliedern.",
        noBlogs: "Noch keine Blogs.",
        chessClubBlog: "Chess Club Blog"
    },

    no: {
        community: "FELLESSKAP",
        communityHub: "Chess Club-fellesskap",
        communitySubtitle: "Venner, rangeringer, sjakknyheter og spillerblogger.",

        friends: "Venner",
        clubMembers: "Klubbmedlemmer",
        coaches: "Trenere",
        topPlayers: "Toppspillere",
        rankings: "Rangering",
        chessToday: "Sjakk i dag",
        news: "Nyheter",
        blogs: "Blogger",

        merch: "MERCH",
        chessClubMerch: "Chess Club-merch",
        merchSubtitle: "Bruk klubben. Spill sjakk.",
        clothing: "Chess Club-klær",
        suit: "Chess Club-dress",
        backToSchool: "Tilbake til skolen",
        special: "Chess Club-spesial",
        officialCollection: "Offisiell Chess Club-kolleksjon.",
        view: "Vis",
        merchPreview: "Forhåndsvisning av Chess Club-merch.",

        soloChess: "SOLOSJAKK",
        playYourself: "Spill sjakk med deg selv",
        soloSubtitle: "Kontroller begge sider. Dine brikker kan slå dine egne brikker.",
        newSoloGame: "Nytt parti",
        soloRules: "Solosjakk",
        selectPiece: "Velg en brikke.",
        selectDestination: "Velg et mål.",
        ownPiece: "× egen brikke",

        puzzles: "OPPGAVER",
        nineHundredPuzzles: "900 oppgaver",
        puzzleSubtitle: "900 Chess Club-oppgaver.",
        totalPuzzles: "Totalt",
        completed: "Fullført",
        current: "Nåværende",

        mateInOne: "Matt i ett",
        knightFork: "Springergaffel",
        backRank: "Bakerste rad",
        winningCapture: "Vinnende slag",
        endgameMove: "Sluttspilltrekk",
        openingIdea: "Åpningsidé",
        sacrifice: "Offer",
        queenTactic: "Dronningtaktikk",
        rookAttack: "Tårnangrep",
        rating: "Rating",

        communityFriendsTitle: "Venner",
        communityFriendsText: "Dine Chess Club-venner.",
        communityMembersTitle: "Klubbmedlemmer",
        communityMembersText: "Spillere som er en del av Chess Club.",
        communityCoachesTitle: "Trenere",
        communityCoachesText: "Chess Club-trenere.",
        communityTopTitle: "Toppspillere",
        communityTopText: "De sterkeste Chess Club-spillerne.",
        communityRankingsTitle: "Sjakk-rangering",
        communityRankingsText: "Chess Club-rangering.",
        communityTodayTitle: "Sjakk i dag",
        communityTodayText: "Dagens Chess Club-aktivitet.",
        communityNewsTitle: "Sjakknyheter",
        communityNewsText: "Nyheter fra Chess Club.",
        communityBlogsTitle: "Spillerblogger",
        communityBlogsText: "Blogger fra Chess Club-medlemmer.",
        noBlogs: "Ingen blogger ennå.",
        chessClubBlog: "Chess Club-blogg"
    },

    es: {
        community: "COMUNIDAD",
        communityHub: "Comunidad Chess Club",
        communitySubtitle: "Amigos, clasificaciones, noticias de ajedrez y blogs de jugadores.",

        friends: "Amigos",
        clubMembers: "Miembros",
        coaches: "Entrenadores",
        topPlayers: "Mejores jugadores",
        rankings: "Clasificación",
        chessToday: "Ajedrez hoy",
        news: "Noticias",
        blogs: "Blogs",

        merch: "MERCH",
        chessClubMerch: "Merch de Chess Club",
        merchSubtitle: "Viste el club. Juega al ajedrez.",
        clothing: "Ropa de Chess Club",
        suit: "Traje de Chess Club",
        backToSchool: "Vuelta al cole",
        special: "Especial Chess Club",
        officialCollection: "Colección oficial de Chess Club.",
        view: "Ver",
        merchPreview: "Vista previa del merchandising de Chess Club.",

        soloChess: "AJEDREZ SOLO",
        playYourself: "Juega al ajedrez contigo mismo",
        soloSubtitle: "Controla ambos bandos. Tus piezas pueden capturar tus propias piezas.",
        newSoloGame: "Nueva partida",
        soloRules: "Ajedrez solo",
        selectPiece: "Selecciona una pieza.",
        selectDestination: "Selecciona un destino.",
        ownPiece: "× pieza propia",

        puzzles: "PUZZLES",
        nineHundredPuzzles: "900 puzzles",
        puzzleSubtitle: "900 puzzles de Chess Club.",
        totalPuzzles: "Total",
        completed: "Completados",
        current: "Actual",

        mateInOne: "Mate en uno",
        knightFork: "Horquilla de caballo",
        backRank: "Última fila",
        winningCapture: "Captura ganadora",
        endgameMove: "Movimiento de final",
        openingIdea: "Idea de apertura",
        sacrifice: "Sacrificio",
        queenTactic: "Táctica de dama",
        rookAttack: "Ataque de torre",
        rating: "Clasificación",

        communityFriendsTitle: "Amigos",
        communityFriendsText: "Tus amigos de Chess Club.",
        communityMembersTitle: "Miembros",
        communityMembersText: "Jugadores que forman parte de Chess Club.",
        communityCoachesTitle: "Entrenadores",
        communityCoachesText: "Entrenadores de Chess Club.",
        communityTopTitle: "Mejores jugadores",
        communityTopText: "Los jugadores más fuertes de Chess Club.",
        communityRankingsTitle: "Clasificación de ajedrez",
        communityRankingsText: "Clasificación de Chess Club.",
        communityTodayTitle: "Ajedrez hoy",
        communityTodayText: "Actividad de Chess Club de hoy.",
        communityNewsTitle: "Noticias de ajedrez",
        communityNewsText: "Noticias de Chess Club.",
        communityBlogsTitle: "Blogs de jugadores",
        communityBlogsText: "Blogs de miembros de Chess Club.",
        noBlogs: "Todavía no hay blogs.",
        chessClubBlog: "Blog de Chess Club"
    },

    ar: {
        community: "المجتمع",
        communityHub: "مجتمع Chess Club",
        communitySubtitle: "الأصدقاء والتصنيفات وأخبار الشطرنج ومدونات اللاعبين.",

        friends: "الأصدقاء",
        clubMembers: "أعضاء النادي",
        coaches: "المدربون",
        topPlayers: "أفضل اللاعبين",
        rankings: "التصنيف",
        chessToday: "الشطرنج اليوم",
        news: "الأخبار",
        blogs: "المدونات",

        merch: "المنتجات",
        chessClubMerch: "منتجات Chess Club",
        merchSubtitle: "ارتدِ النادي والعب الشطرنج.",
        clothing: "ملابس Chess Club",
        suit: "بدلة Chess Club",
        backToSchool: "العودة إلى المدرسة",
        special: "منتج Chess Club الخاص",
        officialCollection: "مجموعة Chess Club الرسمية.",
        view: "عرض",
        merchPreview: "معاينة منتجات Chess Club.",

        soloChess: "شطرنج فردي",
        playYourself: "العب الشطرنج مع نفسك",
        soloSubtitle: "تحكم بالجانبين. يمكنك أخذ قطعك الخاصة.",
        newSoloGame: "لعبة جديدة",
        soloRules: "شطرنج فردي",
        selectPiece: "اختر قطعة.",
        selectDestination: "اختر الوجهة.",
        ownPiece: "× قطعة خاصة",

        puzzles: "الألغاز",
        nineHundredPuzzles: "900 لغز",
        puzzleSubtitle: "مجموعة من 900 لغز من Chess Club.",
        totalPuzzles: "إجمالي الألغاز",
        completed: "مكتمل",
        current: "الحالي",

        mateInOne: "كش مات في نقلة واحدة",
        knightFork: "شوكة الحصان",
        backRank: "الصف الخلفي",
        winningCapture: "أخذ رابح",
        endgameMove: "نقلة نهاية اللعبة",
        openingIdea: "فكرة الافتتاح",
        sacrifice: "تضحية",
        queenTactic: "تكتيك الوزير",
        rookAttack: "هجوم الرخ",
        rating: "التصنيف",

        communityFriendsTitle: "الأصدقاء",
        communityFriendsText: "أصدقاؤك في Chess Club.",
        communityMembersTitle: "أعضاء النادي",
        communityMembersText: "اللاعبون الذين ينتمون إلى Chess Club.",
        communityCoachesTitle: "المدربون",
        communityCoachesText: "مدربو Chess Club.",
        communityTopTitle: "أفضل اللاعبين",
        communityTopText: "أقوى لاعبي Chess Club.",
        communityRankingsTitle: "تصنيف الشطرنج",
        communityRankingsText: "تصنيف Chess Club.",
        communityTodayTitle: "الشطرنج اليوم",
        communityTodayText: "نشاط Chess Club اليوم.",
        communityNewsTitle: "أخبار الشطرنج",
        communityNewsText: "أخبار Chess Club.",
        communityBlogsTitle: "مدونات اللاعبين",
        communityBlogsText: "مدونات أعضاء Chess Club.",
        noBlogs: "لا توجد مدونات بعد.",
        chessClubBlog: "مدونة Chess Club"
    },

    fr: {
        community: "COMMUNAUTÉ",
        communityHub: "Communauté Chess Club",
        communitySubtitle: "Amis, classements, actualités et blogs des joueurs.",

        friends: "Amis",
        clubMembers: "Membres",
        coaches: "Entraîneurs",
        topPlayers: "Meilleurs joueurs",
        rankings: "Classement",
        chessToday: "Échecs aujourd’hui",
        news: "Actualités",
        blogs: "Blogs",

        merch: "MERCH",
        chessClubMerch: "Merch Chess Club",
        merchSubtitle: "Porte le club. Joue aux échecs.",
        clothing: "Vêtements Chess Club",
        suit: "Costume Chess Club",
        backToSchool: "Rentrée scolaire",
        special: "Spécial Chess Club",
        officialCollection: "Collection officielle Chess Club.",
        view: "Voir",
        merchPreview: "Aperçu des produits Chess Club.",

        soloChess: "ÉCHECS SOLO",
        playYourself: "Joue aux échecs contre toi-même",
        soloSubtitle: "Contrôle les deux camps. Tes pièces peuvent capturer tes propres pièces.",
        newSoloGame: "Nouvelle partie",
        soloRules: "Échecs solo",
        selectPiece: "Sélectionne une pièce.",
        selectDestination: "Sélectionne une destination.",
        ownPiece: "× pièce alliée",

        puzzles: "PUZZLES",
        nineHundredPuzzles: "900 puzzles",
        puzzleSubtitle: "900 puzzles Chess Club.",
        totalPuzzles: "Total",
        completed: "Terminés",
        current: "Actuel",

        mateInOne: "Mat en un",
        knightFork: "Fourchette de cavalier",
        backRank: "Dernière rangée",
        winningCapture: "Capture gagnante",
        endgameMove: "Coup de finale",
        openingIdea: "Idée d’ouverture",
        sacrifice: "Sacrifice",
        queenTactic: "Tactique de dame",
        rookAttack: "Attaque de tour",
        rating: "Classement",

        communityFriendsTitle: "Amis",
        communityFriendsText: "Tes amis de Chess Club.",
        communityMembersTitle: "Membres du club",
        communityMembersText: "Les joueurs qui font partie de Chess Club.",
        communityCoachesTitle: "Entraîneurs",
        communityCoachesText: "Les entraîneurs de Chess Club.",
        communityTopTitle: "Meilleurs joueurs",
        communityTopText: "Les joueurs les plus forts de Chess Club.",
        communityRankingsTitle: "Classement d’échecs",
        communityRankingsText: "Classement Chess Club.",
        communityTodayTitle: "Échecs aujourd’hui",
        communityTodayText: "Activité Chess Club du jour.",
        communityNewsTitle: "Actualités des échecs",
        communityNewsText: "Actualités de Chess Club.",
        communityBlogsTitle: "Blogs des joueurs",
        communityBlogsText: "Blogs des membres de Chess Club.",
        noBlogs: "Aucun blog pour le moment.",
        chessClubBlog: "Blog Chess Club"
    }
};


/* Make the dictionary accessible to the old HTML code too. */
window.V2_LANG = V2_LANG;


/* =========================================================
   2. LANGUAGE HELPERS
========================================================= */

const V2_LANGUAGE_NAMES = {
    en: "English",
    fa: "فارسی",
    de: "Deutsch",
    no: "Norsk",
    es: "Español",
    ar: "العربية",
    fr: "Français"
};

const V2_OLD_LANGUAGE_NAMES = {
    "English": "en",
    "فارسی": "fa",
    "Deutsch": "de",
    "Norsk": "no",
    "Español": "es",
    "العربية": "ar",
    "Français": "fr"
};

const V2_TEXT_SOURCE = new WeakMap();

function v2GetLanguage() {

    let lang =
        localStorage.getItem(
            "chessClubLanguage"
        ) || "en";

    if(V2_OLD_LANGUAGE_NAMES[lang]){
        lang =
            V2_OLD_LANGUAGE_NAMES[lang];
    }

    if(!V2_LANG[lang]){
        lang = "en";
    }

    return lang;
}

window.v2GetLanguage = v2GetLanguage;


/* =========================================================
   3. AUTOMATIC STATIC HTML TRANSLATION
========================================================= */

function v2GetEnglishTextMap(){

    const map = {};

    Object.entries(
        V2_LANG.en
    ).forEach(
        ([key,value]) => {

            if(
                typeof value === "string" &&
                !map[value]
            ){

                map[value] =
                    key;
            }
        }
    );

    return map;
}

const V2_ENGLISH_TEXT_MAP =
    v2GetEnglishTextMap();


function v2NormalizeText(text){

    return String(text || "")
        .replace(/\s+/g," ")
        .trim();
}


function v2GetV2Roots(){

    return [
        document.getElementById("v2Community"),
        document.getElementById("v2Merch"),
        document.getElementById("v2Solo"),
        document.getElementById("v2Puzzles")
    ].filter(Boolean);
}


function v2CaptureStaticText(){

    const roots =
        v2GetV2Roots();

    roots.forEach(root => {

        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT
            );

        let node;

        while(
            (node = walker.nextNode())
        ){

            if(
                !node.nodeValue ||
                !node.nodeValue.trim()
            ){
                continue;
            }

            const parent =
                node.parentElement;

            if(!parent){
                continue;
            }

            if(
                parent.closest(
                    "script,style"
                )
            ){
                continue;
            }

            if(
                parent.closest(
                    "[data-i18n]"
                )
            ){
                continue;
            }

            if(
                !V2_TEXT_SOURCE.has(node)
            ){

                V2_TEXT_SOURCE.set(
                    node,
                    node.nodeValue
                );
            }
        }
    });
}


function v2TranslateDataI18n(dictionary){

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset.i18n;

                if(
                    dictionary[key] !== undefined
                ){

                    element.textContent =
                        dictionary[key];
                }
            }
        );
}


function v2TranslateStaticText(dictionary){

    const roots =
        v2GetV2Roots();


    roots.forEach(root => {

        const walker =
            document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT
            );

        const nodes = [];

        let node;

        while(
            (node = walker.nextNode())
        ){

            nodes.push(node);
        }


        nodes.forEach(textNode => {

            const parent =
                textNode.parentElement;

            if(!parent){
                return;
            }

            if(
                parent.closest(
                    "script,style,[data-i18n]"
                )
            ){
                return;
            }


            let source =
                V2_TEXT_SOURCE.get(
                    textNode
                );


            if(
                source === undefined
            ){

                source =
                    textNode.nodeValue;

                V2_TEXT_SOURCE.set(
                    textNode,
                    source
                );
            }


            const clean =
                v2NormalizeText(
                    source
                );


            const key =
                V2_ENGLISH_TEXT_MAP[
                    clean
                ];


            if(
                key &&
                dictionary[key] !== undefined
            ){

                const leading =
                    source.match(
                        /^\s*/
                    )?.[0] || "";

                const trailing =
                    source.match(
                        /\s*$/
                    )?.[0] || "";


                textNode.nodeValue =
                    leading +
                    dictionary[key] +
                    trailing;
            }
        });
    });
}


/* =========================================================
   4. MAIN TRANSLATION
========================================================= */

function v2Translate(){

    const lang =
        v2GetLanguage();

    const dictionary =
        V2_LANG[lang];


    /*
       Remember the original English text before changing it.
       This lets you switch German → Spanish → French etc.
       without getting stuck in the first language.
    */
    v2CaptureStaticText();


    /*
       Translate normal data-i18n elements.
    */
    v2TranslateDataI18n(
        dictionary
    );


    /*
       Translate existing hard-coded V2 HTML text.
    */
    v2TranslateStaticText(
        dictionary
    );


    /*
       RTL languages.
    */
    const isRTL =
        lang === "fa" ||
        lang === "ar";


    document.documentElement.dir =
        isRTL ? "rtl" : "ltr";

    document.documentElement.lang =
        lang;


    document.body.classList.toggle(
        "rtl",
        isRTL
    );


    /*
       Sync V2 language selector.
    */
    const select =
        document.getElementById(
            "v2LanguageSelect"
        );

    if(select){
        select.value =
            lang;
    }


    /*
       Sync the main status label.
    */
    const status =
        document.getElementById(
            "languageStatus"
        );

    if(status){

        status.textContent =
            V2_LANGUAGE_NAMES[lang];
    }


    /*
       Re-render dynamic V2 content.
    */
    v2RenderMerch();
    v2RenderSolo();
    v2RenderPuzzleList();


    if(
        window.v2CurrentCommunitySection
    ){

        v2CommunityTab(
            window.v2CurrentCommunitySection
        );
    }
}


/* =========================================================
   5. LANGUAGE BUTTON
========================================================= */

function v2SetLanguage(lang){

    if(
        !V2_LANG[lang]
    ){
        lang = "en";
    }


    localStorage.setItem(
        "chessClubLanguage",
        lang
    );


    v2Translate();


    const select =
        document.getElementById(
            "v2LanguageSelect"
        );


    if(select){
        select.value =
            lang;
    }


    const status =
        document.getElementById(
            "languageStatus"
        );


    if(status){

        status.textContent =
            V2_LANGUAGE_NAMES[lang];
    }
}


/*
   Explicitly expose it globally.
   This makes old onchange="v2SetLanguage(...)"
   code work too.
*/
window.v2SetLanguage =
    v2SetLanguage;


/*
   Keep a private reference so an old inline function
   cannot break our event listener.
*/
const V2_INTERNAL_SET_LANGUAGE =
    v2SetLanguage;


/* =========================================================
   6. MERCH
========================================================= */

const V2_MERCH = [

    {
        file: "chessclothmerch.png",
        key: "clothing"
    },

    {
        file: "suitmerch.png",
        key: "suit"
    },

    {
        file: "backtoschoolmerch.png",
        key: "backToSchool"
    },

    {
        file: "chessclubspecial.png",
        key: "special"
    }
];


function v2RenderMerch(){

    const container =
        document.getElementById(
            "v2MerchGrid"
        );

    if(!container){
        return;
    }


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    container.innerHTML =
        "";


    V2_MERCH.forEach(item => {

        const name =
            dictionary[item.key];


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "v2-merch-card";


        card.innerHTML = `
            <img
                src="${item.file}"
                alt="${name}"
                loading="lazy"
            >

            <div class="v2-merch-info">

                <h3>${name}</h3>

                <p>
                    ${dictionary.officialCollection}
                </p>

                <button
                    class="v2-primary"
                    type="button"
                >
                    ${dictionary.view}
                </button>

            </div>
        `;


        const button =
            card.querySelector(
                "button"
            );


        if(button){

            button.addEventListener(
                "click",
                () =>
                    v2MerchPreview(
                        name
                    )
            );
        }


        container.appendChild(
            card
        );
    });
}


function v2MerchPreview(name){

    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    alert(
        name +
        "\n\n" +
        dictionary.merchPreview
    );
}


/* =========================================================
   7. SOLO CHESS
========================================================= */

const V2_PIECES = {

    w:{
        k:"♔",
        q:"♕",
        r:"♖",
        b:"♗",
        n:"♘",
        p:"♙"
    },

    b:{
        k:"♚",
        q:"♛",
        r:"♜",
        b:"♝",
        n:"♞",
        p:"♟"
    }
};


let v2SoloBoard = [];
let v2Selected = -1;
let v2SoloMoves = [];


function v2SoloReset(){

    v2SoloBoard = [

        "rnbqkbnr".split(""),
        "pppppppp".split(""),
        "........".split(""),
        "........".split(""),
        "........".split(""),
        "........".split(""),
        "PPPPPPPP".split(""),
        "RNBQKBNR".split("")

    ];


    v2Selected =
        -1;

    v2SoloMoves =
        [];


    v2RenderSolo();
}


function v2PieceColor(piece){

    if(piece === "."){
        return null;
    }


    return (
        piece ===
        piece.toUpperCase()
            ? "w"
            : "b"
    );
}


function v2PieceSymbol(piece){

    if(piece === "."){
        return "";
    }


    const color =
        v2PieceColor(
            piece
        );


    return V2_PIECES[color][
        piece.toLowerCase()
    ];
}


function v2GetPseudoMoves(square){

    const piece =
        v2SoloBoard[square];


    if(piece === "."){
        return [];
    }


    const type =
        piece.toLowerCase();


    const row =
        Math.floor(
            square / 8
        );


    const col =
        square % 8;


    const moves = [];


    function add(row2,col2){

        if(
            row2 >= 0 &&
            row2 < 8 &&
            col2 >= 0 &&
            col2 < 8
        ){

            moves.push(
                row2 * 8 +
                col2
            );
        }
    }


    if(type === "p"){

        const direction =
            v2PieceColor(piece) === "w"
                ? -1
                : 1;


        add(
            row + direction,
            col
        );

        add(
            row + direction,
            col - 1
        );

        add(
            row + direction,
            col + 1
        );

    }else if(type === "n"){

        [
            [-2,-1],
            [-2,1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,-1],
            [2,1]
        ].forEach(
            move =>
                add(
                    row + move[0],
                    col + move[1]
                )
        );

    }else if(type === "k"){

        for(
            let r = -1;
            r <= 1;
            r++
        ){

            for(
                let c = -1;
                c <= 1;
                c++
            ){

                if(
                    r !== 0 ||
                    c !== 0
                ){

                    add(
                        row + r,
                        col + c
                    );
                }
            }
        }

    }else{

        const directions = [];


        if(
            type === "b" ||
            type === "q"
        ){

            directions.push(
                [-1,-1],
                [-1,1],
                [1,-1],
                [1,1]
            );
        }


        if(
            type === "r" ||
            type === "q"
        ){

            directions.push(
                [-1,0],
                [1,0],
                [0,-1],
                [0,1]
            );
        }


        directions.forEach(
            direction => {

                let r =
                    row +
                    direction[0];

                let c =
                    col +
                    direction[1];


                while(
                    r >= 0 &&
                    r < 8 &&
                    c >= 0 &&
                    c < 8
                ){

                    moves.push(
                        r * 8 + c
                    );


                    if(
                        v2SoloBoard[
                            r * 8 + c
                        ] !== "."
                    ){

                        break;
                    }


                    r +=
                        direction[0];

                    c +=
                        direction[1];
                }
            }
        );
    }


    return [
        ...new Set(
            moves
        )
    ];
}


function v2RenderSolo(){

    const board =
        document.getElementById(
            "v2SoloBoard"
        );


    if(!board){
        return;
    }


    board.innerHTML =
        "";


    v2SoloBoard.forEach(
        (piece,index) => {

            const square =
                document.createElement(
                    "div"
                );


            square.className =
                "v2-square " +
                (
                    (
                        Math.floor(
                            index / 8
                        ) +
                        index % 8
                    ) % 2 === 0
                        ? "v2-light"
                        : "v2-dark"
                );


            if(
                index ===
                v2Selected
            ){

                square.classList.add(
                    "v2-selected"
                );
            }


            square.textContent =
                v2PieceSymbol(
                    piece
                );


            square.onclick =
                () =>
                    v2SoloClick(
                        index
                    );


            board.appendChild(
                square
            );
        }
    );


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    const status =
        document.getElementById(
            "v2SoloStatus"
        );


    if(status){

        status.textContent =
            v2Selected === -1
                ? dictionary.selectPiece
                : dictionary.selectDestination;
    }


    const moves =
        document.getElementById(
            "v2SoloMoves"
        );


    if(moves){

        moves.innerHTML =
            v2SoloMoves
                .map(
                    (move,index) =>
                        `${index + 1}. ${move}`
                )
                .join("<br>");
    }
}


function v2SoloClick(index){

    if(
        v2Selected === -1
    ){

        if(
            v2SoloBoard[index] !== "."
        ){

            v2Selected =
                index;

            v2RenderSolo();
        }

        return;
    }


    if(
        index ===
        v2Selected
    ){

        v2Selected =
            -1;

        v2RenderSolo();

        return;
    }


    const legal =
        v2GetPseudoMoves(
            v2Selected
        );


    if(
        !legal.includes(index)
    ){

        v2Selected =
            -1;

        v2RenderSolo();

        return;
    }


    const from =
        v2Selected;


    const captured =
        v2SoloBoard[index];


    v2SoloBoard[index] =
        v2SoloBoard[from];


    v2SoloBoard[from] =
        ".";


    const fromName =
        String.fromCharCode(
            97 +
            from % 8
        ) +
        (
            8 -
            Math.floor(
                from / 8
            )
        );


    const toName =
        String.fromCharCode(
            97 +
            index % 8
        ) +
        (
            8 -
            Math.floor(
                index / 8
            )
        );


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    v2SoloMoves.push(

        fromName +
        " → " +
        toName +

        (
            captured !== "."
                ? " " +
                  dictionary.ownPiece
                : ""
        )
    );


    v2Selected =
        -1;


    v2RenderSolo();
}


/* =========================================================
   8. EXACTLY 900 PUZZLES
========================================================= */

const V2_PUZZLE_TYPES = [

    "mateInOne",
    "knightFork",
    "backRank",
    "winningCapture",
    "endgameMove",
    "openingIdea",
    "sacrifice",
    "queenTactic",
    "rookAttack"

];


const V2_900_PUZZLES =
    Array.from(
        {
            length:900
        },
        (_,index) => {

            return {

                id:
                    index + 1,

                type:
                    V2_PUZZLE_TYPES[
                        index %
                        V2_PUZZLE_TYPES.length
                    ],

                rating:
                    800 +
                    Math.floor(
                        index / 100
                    ) * 50
            };
        }
    );


function v2RenderPuzzleList(){

    const container =
        document.getElementById(
            "v2PuzzleList"
        );


    if(!container){
        return;
    }


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    container.innerHTML =
        "";


    V2_900_PUZZLES
        .slice(0,120)
        .forEach(
            puzzle => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "v2-puzzle-card";


                const puzzleName =
                    dictionary[
                        puzzle.type
                    ];


                card.innerHTML = `

                    <b>
                        #${String(
                            puzzle.id
                        ).padStart(3,"0")}
                    </b>

                    <h3>
                        ${puzzleName}
                    </h3>

                    <span class="v2-muted">
                        ${dictionary.rating}
                        ${puzzle.rating}
                    </span>

                `;


                card.onclick =
                    () =>
                        v2OpenPuzzle(
                            puzzle.id
                        );


                container.appendChild(
                    card
                );
            }
        );
}


function v2OpenPuzzle(id){

    const puzzle =
        V2_900_PUZZLES[
            id - 1
        ];


    if(!puzzle){
        return;
    }


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    alert(

        "#" +
        String(id)
            .padStart(3,"0") +

        "\n\n" +

        dictionary[
            puzzle.type
        ] +

        "\n" +

        dictionary.rating +
        ": " +
        puzzle.rating
    );
}


/* =========================================================
   9. COMMUNITY
========================================================= */

window.v2CurrentCommunitySection =
    "friends";


function v2CommunityTab(section){

    window.v2CurrentCommunitySection =
        section;


    const container =
        document.getElementById(
            "v2CommunityContent"
        );


    if(!container){
        return;
    }


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    const sections = {

        friends:[
            "👥",
            dictionary.communityFriendsTitle,
            dictionary.communityFriendsText
        ],

        members:[
            "♟️",
            dictionary.communityMembersTitle,
            dictionary.communityMembersText
        ],

        coaches:[
            "🎓",
            dictionary.communityCoachesTitle,
            dictionary.communityCoachesText
        ],

        top:[
            "🏆",
            dictionary.communityTopTitle,
            dictionary.communityTopText
        ],

        rankings:[
            "📊",
            dictionary.communityRankingsTitle,
            dictionary.communityRankingsText
        ],

        today:[
            "♞",
            dictionary.communityTodayTitle,
            dictionary.communityTodayText
        ],

        news:[
            "📰",
            dictionary.communityNewsTitle,
            dictionary.communityNewsText
        ],

        blogs:[
            "✍️",
            dictionary.communityBlogsTitle,
            dictionary.communityBlogsText
        ]
    };


    const data =
        sections[section] ||
        sections.friends;


    container.innerHTML = `

        <div class="v2-card">

            <div style="font-size:40px">
                ${data[0]}
            </div>

            <h2>
                ${data[1]}
            </h2>

            <p>
                ${data[2]}
            </p>

        </div>

    `;


    if(
        section === "blogs"
    ){

        v2LoadBlogs();
    }
}


function v2LoadBlogs(){

    const container =
        document.getElementById(
            "v2CommunityContent"
        );


    if(!container){
        return;
    }


    const dictionary =
        V2_LANG[
            v2GetLanguage()
        ];


    let posts = [];


    try{

        posts =
            JSON.parse(
                localStorage.getItem(
                    "chessClubCommunityPosts"
                ) || "[]"
            );

    }catch(error){

        posts =
            [];
    }


    if(!Array.isArray(posts)){
        posts = [];
    }


    if(!posts.length){

        container.innerHTML += `

            <div class="v2-empty">

                ${dictionary.noBlogs}

            </div>

        `;

        return;
    }


    const grid =
        document.createElement(
            "div"
        );


    grid.className =
        "v2-community-grid";


    posts.forEach(
        post => {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "v2-card";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                post.title ||
                dictionary.chessClubBlog;


            const text =
                document.createElement(
                    "p"
                );


            text.textContent =
                post.text ||
                "";


            card.appendChild(
                title
            );

            card.appendChild(
                text
            );


            grid.appendChild(
                card
            );
        }
    );


    container.appendChild(
        grid
    );
}


/* =========================================================
   10. V2 NAVIGATION
========================================================= */

function v2ShowPage(id){

    document
        .querySelectorAll(
            ".v2-page"
        )
        .forEach(
            page => {

                page.classList.remove(
                    "v2-active"
                );
            }
        );


    const page =
        document.getElementById(
            id
        );


    if(page){

        page.classList.add(
            "v2-active"
        );
    }
}


function openChessClubV2Community(){

    v2ShowPage(
        "v2Community"
    );

    v2CommunityTab(
        window.v2CurrentCommunitySection ||
        "friends"
    );
}


function openChessClubV2Merch(){

    v2ShowPage(
        "v2Merch"
    );

    v2RenderMerch();
}


function openChessClubV2Solo(){

    v2ShowPage(
        "v2Solo"
    );

    v2SoloReset();
}


function openChessClubV2Puzzles(){

    v2ShowPage(
        "v2Puzzles"
    );

    v2RenderPuzzleList();
}


/* =========================================================
   11. LANGUAGE SELECTOR PROTECTION
========================================================= */

function v2SetupLanguageSelector(){

    const select =
        document.getElementById(
            "v2LanguageSelect"
        );


    if(!select){
        return;
    }


    /*
       Remove old inline onchange handlers so an old
       index.html function cannot override V2.
    */
    select.removeAttribute(
        "onchange"
    );


    /*
       Avoid attaching multiple listeners.
    */
    if(
        select.dataset.v2LanguageReady ===
        "true"
    ){

        select.value =
            v2GetLanguage();

        return;
    }


    select.dataset.v2LanguageReady =
        "true";


    select.addEventListener(
        "change",
        event => {

            V2_INTERNAL_SET_LANGUAGE(
                event.target.value
            );
        }
    );


    select.value =
        v2GetLanguage();
}


/* =========================================================
   12. STARTUP
========================================================= */

function initializeChessClubV2(){

    /*
       Save the original English text BEFORE translating.
    */
    v2CaptureStaticText();


    /*
       Protect the language selector.
    */
    v2SetupLanguageSelector();


    /*
       Translate everything.
    */
    v2Translate();


    /*
       Render dynamic V2 content.
    */
    v2RenderMerch();

    v2SoloReset();

    v2RenderPuzzleList();

    v2CommunityTab(
        "friends"
    );


    /*
       Sync selector one final time.
    */
    v2SetupLanguageSelector();
}


if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeChessClubV2
    );

}else{

    initializeChessClubV2();
}


/* =========================================================
   END OF CHESS CLUB V2
========================================================= */
/* =========================================================
   FINAL LANGUAGE BRIDGE
   Connects the original Chess Club language system
   to Chess Club V2.
========================================================= */

function v2NormalizeLanguage(value){

    const text =
        String(value || "")
            .trim()
            .toLowerCase();

    const aliases = {

        "en":"en",
        "english":"en",

        "fa":"fa",
        "persian":"fa",
        "farsi":"fa",
        "فارسی":"fa",

        "de":"de",
        "german":"de",
        "deutsch":"de",

        "no":"no",
        "norwegian":"no",
        "norsk":"no",

        "es":"es",
        "spanish":"es",
        "español":"es",

        "ar":"ar",
        "arabic":"ar",
        "العربية":"ar",

        "fr":"fr",
        "french":"fr",
        "français":"fr"
    };

    return aliases[text] || "en";
}


/* Make V2 accept any form of language value. */
window.v2SetLanguage = function(value){

    const lang =
        v2NormalizeLanguage(value);

    localStorage.setItem(
        "chessClubLanguage",
        lang
    );

    v2Translate();

    const select =
        document.getElementById(
            "v2LanguageSelect"
        );

    if(select){

        /*
           Try the language code first.
        */
        select.value =
            lang;

        /*
           If the HTML uses language names as option
           values, find that option too.
        */
        if(
            select.value !== lang
        ){

            const option =
                Array.from(
                    select.options
                ).find(
                    option =>
                        v2NormalizeLanguage(
                            option.value
                        ) === lang
                );

            if(option){

                select.value =
                    option.value;
            }
        }
    }

    const status =
        document.getElementById(
            "languageStatus"
        );

    if(status){

        const names = {

            en:"English",
            fa:"فارسی",
            de:"Deutsch",
            no:"Norsk",
            es:"Español",
            ar:"العربية",
            fr:"Français"
        };

        status.textContent =
            names[lang];
    }
};


/*
   IMPORTANT:
   Hook the ORIGINAL Chess Club language function
   so changing the main selector also changes V2.
*/
if(
    typeof window.setLanguage ===
    "function"
){

    const originalSetLanguage =
        window.setLanguage;


    window.setLanguage =
        function(value){

            const lang =
                v2NormalizeLanguage(value);

            originalSetLanguage(
                lang
            );

            window.v2SetLanguage(
                lang
            );
        };
}


/*
   Also listen directly to the V2 selector.
*/
document.addEventListener(
    "DOMContentLoaded",
    function(){

        const select =
            document.getElementById(
                "v2LanguageSelect"
            );

        if(!select){
            return;
        }

        select.addEventListener(
            "change",
            function(){

                window.v2SetLanguage(
                    this.value
                );

            }
        );

        window.v2SetLanguage(
            localStorage.getItem(
                "chessClubLanguage"
            ) || "en"
        );
    }
);
