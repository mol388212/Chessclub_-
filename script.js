
"use strict";

/* =========================================================
   CHESS CLUB — FULL SCRIPT
   Fixed:
   - Broken Supabase key declaration
   - 7-language compatibility
   - V2 language synchronization
   - Arabic/Persian RTL
   - Missing isKingInCheck alias
   - Duplicate updatePlayers logic
   - Safer online initialization
========================================================= */


/* =========================================================
   SHORTCUT
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   CHESS PIECES
========================================================= */

const PIECES = {
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


/* =========================================================
   STANDARD BOARD
========================================================= */

const START_BOARD = [
    ["br","bn","bb","bq","bk","bb","bn","br"],
    ["bp","bp","bp","bp","bp","bp","bp","bp"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["wp","wp","wp","wp","wp","wp","wp","wp"],
    ["wr","wn","wb","wq","wk","wb","wn","wr"]
];


/* =========================================================
   BOT LIST
========================================================= */

const BOTS = [
    {name:"Liam",elo:100},
    {name:"Noah",elo:200},
    {name:"Mohammed",elo:300},
    {name:"Oliver",elo:400},
    {name:"Leo",elo:500},
    {name:"Adam",elo:600},
    {name:"Daniel",elo:700},
    {name:"Ethan",elo:800},
    {name:"James",elo:900},
    {name:"Alex",elo:1000},
    {name:"Seal",elo:1250},
    {name:"Turtle",elo:1300},
    {name:"Falcon",elo:1350},
    {name:"Knight",elo:1400},
    {name:"Storm",elo:1450},
    {name:"Wave",elo:1500},
    {name:"Dragon",elo:1800},
    {name:"Stockfish",elo:2200},
    {name:"Gukesh D",elo:2755},
    {name:"Magnus Carlsen",elo:2860}
];

const GENERAL_HUX = {
    name:"General Hux",
    elo:3400
};


/* =========================================================
   PROFILE
========================================================= */

const DEFAULT_PROFILE = {
    username:"Player",
    password:"",
    avatar:"♟",

    elo:3400,
    blitz:3400,
    rapid:3400,
    daily:3400,

    puzzleRating:1000,

    wins:0,
    losses:0,
    draws:0,
    games:0,

    streak:0,
    bestStreak:0,

    captures:0,
    moves:0,
    checks:0,
    checkmates:0,
    castles:0,
    promotions:0,

    puzzles:0,
    puzzleWins:0,
    lessons:0,

    communityPosts:0,

    botsPlayed:[],
    botWins:[],

    friends:[],

    liveWatch:0,
    liveGamesWatched:0,
    tournaments:0,

    advancements:{},
    flags:{},

    recentMoves:[],

    analysisOpened:0,
    settingsChanged:0,
    themeChanges:0,

    friendGames:0,
    chestOpened:0,

    rookSacrifices:0,
    queenSacrifices:0,
    pawnSacrifices:0,

    tacticalMoves:0,

    materialHistory:[],

    pieceMoves:{
        p:0,
        n:0,
        b:0,
        r:0,
        q:0,
        k:0
    }
};

let profile = loadProfile();


function structuredCloneSafe(obj){
    return JSON.parse(JSON.stringify(obj));
}


function loadProfile(){

    let saved = null;

    try{
        saved = JSON.parse(
            localStorage.getItem("chessClubProfile") || "null"
        );
    }catch(e){
        saved = null;
    }

    const result =
        structuredCloneSafe(DEFAULT_PROFILE);

    if(saved && typeof saved === "object"){

        Object.assign(result,saved);

        result.pieceMoves = Object.assign(
            {},
            DEFAULT_PROFILE.pieceMoves,
            saved.pieceMoves || {}
        );

        result.advancements =
            Object.assign(
                {},
                saved.advancements || {}
            );

        result.flags =
            Object.assign(
                {},
                saved.flags || {}
            );

        result.botsPlayed =
            Array.isArray(saved.botsPlayed)
                ? saved.botsPlayed
                : [];

        result.botWins =
            Array.isArray(saved.botWins)
                ? saved.botWins
                : [];

        result.friends =
            Array.isArray(saved.friends)
                ? saved.friends
                : [];

        result.recentMoves =
            Array.isArray(saved.recentMoves)
                ? saved.recentMoves
                : [];
    }

    result.elo =
        Math.max(3400,Number(result.elo) || 3400);

    result.blitz =
        Math.max(3400,Number(result.blitz) || 3400);

    result.rapid =
        Math.max(3400,Number(result.rapid) || 3400);

    result.daily =
        Math.max(3400,Number(result.daily) || 3400);

    return result;
}


function saveProfile(){

    try{
        localStorage.setItem(
            "chessClubProfile",
            JSON.stringify(profile)
        );
    }catch(e){}
}


/* =========================================================
   LANGUAGE
========================================================= */

const SUPPORTED_LANGUAGES = [
    "en",
    "fa",
    "de",
    "no",
    "es",
    "ar",
    "fr"
];

const LANGUAGE_NAMES = {
    en:"English",
    fa:"فارسی",
    de:"Deutsch",
    no:"Norsk",
    es:"Español",
    ar:"العربية",
    fr:"Français"
};

let language =
    localStorage.getItem("chessClubLanguage") || "en";

if(!SUPPORTED_LANGUAGES.includes(language)){
    language = "en";
}


function setLanguage(lang){

    language =
        SUPPORTED_LANGUAGES.includes(lang)
            ? lang
            : "en";

    localStorage.setItem(
        "chessClubLanguage",
        language
    );

    document.body.classList.toggle(
        "rtl",
        language === "fa" ||
        language === "ar"
    );

    updateLanguageStatus();
    updateSettingsUI();
    renderAchievements();
    updateAllProfileDisplays();

    /*
       Keep the V2 system synchronized.
    */
    if(
        typeof window.v2SetLanguage === "function"
    ){

        try{
            window.v2SetLanguage(language);
        }catch(error){
            console.warn(
                "V2 language synchronization failed:",
                error
            );
        }
    }
}


function toggleLanguage(){

    setLanguage(
        language === "en"
            ? "fa"
            : "en"
    );

    profile.settingsChanged++;

    saveProfile();

    unlock("language");
}


function updateLanguageStatus(){

    const el =
        $("languageStatus");

    if(!el) return;

    el.textContent =
        LANGUAGE_NAMES[language] || "English";
}


/* =========================================================
   SETTINGS
========================================================= */

let soundEnabled =
    localStorage.getItem("chessSound") !== "off";

let animationsEnabled =
    localStorage.getItem("chessAnimations") !== "off";

let soundTheme =
    localStorage.getItem("chessSoundTheme") || "Classic";


function updateSettingsUI(){

    const soundStatus =
        $("soundStatus");

    if(soundStatus){

        soundStatus.textContent =
            soundEnabled
                ? "Sounds are ON."
                : "Sounds are OFF.";
    }


    const animationStatus =
        $("animationStatus");

    if(animationStatus){

        animationStatus.textContent =
            animationsEnabled
                ? "Animations are ON."
                : "Animations are OFF.";
    }


    updateLanguageStatus();


    const soundThemeStatus =
        $("soundThemeStatus");

    if(soundThemeStatus){

        soundThemeStatus.textContent =
            soundTheme;
    }
}


function openSettings(){

    showPage("settingsPage");

    updateSettingsUI();

    profile.settingsChanged++;

    saveProfile();

    unlock("settings");
}


function toggleSound(){

    soundEnabled =
        !soundEnabled;

    localStorage.setItem(
        "chessSound",
        soundEnabled ? "on" : "off"
    );

    updateSettingsUI();

    profile.settingsChanged++;

    saveProfile();

    unlock("settings");
}


function toggleAnimations(){

    animationsEnabled =
        !animationsEnabled;

    localStorage.setItem(
        "chessAnimations",
        animationsEnabled ? "on" : "off"
    );

    document.body.classList.toggle(
        "noAnimations",
        !animationsEnabled
    );

    updateSettingsUI();

    profile.settingsChanged++;

    saveProfile();

    unlock("settings");
}


function chooseSoundTheme(){

    const choice =
        prompt(
            "Choose sound theme:\n\n" +
            "1. Classic\n" +
            "2. Soft\n" +
            "3. Arcade"
        );

    if(!choice) return;

    const themes = {
        "1":"Classic",
        "2":"Soft",
        "3":"Arcade"
    };

    if(!themes[choice]){

        alert(
            "Please choose 1, 2 or 3."
        );

        return;
    }

    soundTheme =
        themes[choice];

    localStorage.setItem(
        "chessSoundTheme",
        soundTheme
    );

    profile.settingsChanged++;

    saveProfile();

    updateSettingsUI();

    unlock("settings");
}


function openPrivacySettings(){

    alert(
        "Privacy & Chat Controls\n\n" +
        "Chess Club is family-friendly.\n" +
        "Community posts are stored locally on this device."
    );
}


function openRules(){

    showPage("rulesPage");
}


/* =========================================================
   GAME STATE
========================================================= */

let board =
    cloneBoard(START_BOARD);

let turn = "w";
let selectedSquare = null;
let legalTargets = [];
let capturedWhite = [];
let capturedBlack = [];
let moveHistory = [];
let positionHistory = [];

let castlingRights = {
    wK:true,
    wQ:true,
    bK:true,
    bQ:true
};

let enPassantTarget = null;
let gameOver = false;
let playingBot = false;
let currentBot = null;
let botThinking = false;
let soloChess = false;


/* =========================================================
   HELPERS
========================================================= */

function cloneBoard(input){
    return input.map(row => row.slice());
}


function inside(r,c){

    return (
        r >= 0 &&
        r < 8 &&
        c >= 0 &&
        c < 8
    );
}


function opponent(color){
    return color === "w" ? "b" : "w";
}


function pieceColor(piece){
    return piece ? piece[0] : null;
}


function pieceType(piece){
    return piece ? piece[1] : null;
}


function coordName(r,c){

    return (
        String.fromCharCode(97 + c) +
        (8 - r)
    );
}


function copyMove(move){
    return Object.assign({},move);
}


/* =========================================================
   KING SEARCH
========================================================= */

function findKing(state,color){

    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            if(state[r][c] === color + "k"){
                return {r,c};
            }
        }
    }

    return null;
}


/* =========================================================
   ATTACK DETECTION
========================================================= */

function isSquareAttacked(
    state,
    r,
    c,
    byColor
){

    const pawnRow =
        byColor === "w"
            ? r + 1
            : r - 1;

    for(const dc of [-1,1]){

        const pc =
            c + dc;

        if(
            inside(pawnRow,pc) &&
            state[pawnRow][pc] ===
                byColor + "p"
        ){

            return true;
        }
    }


    const knightOffsets = [
        [-2,-1],
        [-2,1],
        [-1,-2],
        [-1,2],
        [1,-2],
        [1,2],
        [2,-1],
        [2,1]
    ];


    for(
        const [dr,dc]
        of knightOffsets
    ){

        const nr = r + dr;
        const nc = c + dc;

        if(
            inside(nr,nc) &&
            state[nr][nc] ===
                byColor + "n"
        ){

            return true;
        }
    }


    for(let dr=-1;dr<=1;dr++){

        for(let dc=-1;dc<=1;dc++){

            if(!dr && !dc) continue;

            const nr = r + dr;
            const nc = c + dc;

            if(
                inside(nr,nc) &&
                state[nr][nc] ===
                    byColor + "k"
            ){

                return true;
            }
        }
    }


    const diagonals = [
        [-1,-1],
        [-1,1],
        [1,-1],
        [1,1]
    ];


    for(
        const [dr,dc]
        of diagonals
    ){

        let nr = r + dr;
        let nc = c + dc;

        while(inside(nr,nc)){

            const piece =
                state[nr][nc];

            if(piece){

                if(
                    pieceColor(piece) === byColor &&
                    (
                        pieceType(piece) === "b" ||
                        pieceType(piece) === "q"
                    )
                ){

                    return true;
                }

                break;
            }

            nr += dr;
            nc += dc;
        }
    }


    const lines = [
        [-1,0],
        [1,0],
        [0,-1],
        [0,1]
    ];


    for(
        const [dr,dc]
        of lines
    ){

        let nr = r + dr;
        let nc = c + dc;

        while(inside(nr,nc)){

            const piece =
                state[nr][nc];

            if(piece){

                if(
                    pieceColor(piece) === byColor &&
                    (
                        pieceType(piece) === "r" ||
                        pieceType(piece) === "q"
                    )
                ){

                    return true;
                }

                break;
            }

            nr += dr;
            nc += dc;
        }
    }

    return false;
}


function isInCheck(state,color){

    const king =
        findKing(state,color);

    if(!king){
        return true;
    }

    return isSquareAttacked(
        state,
        king.r,
        king.c,
        opponent(color)
    );
}


/*
   Compatibility alias for online code.
*/
function isKingInCheck(state,color){

    return isInCheck(
        state,
        color
    );
}


/* =========================================================
   PSEUDO MOVES
========================================================= */

function pseudoMoves(
    state,
    r,
    c,
    includeCastling = true
){

    const piece =
        state[r][c];

    if(!piece) return [];

    const color =
        pieceColor(piece);

    const type =
        pieceType(piece);

    const moves = [];


    if(type === "p"){

        const direction =
            color === "w" ? -1 : 1;

        const startRow =
            color === "w" ? 6 : 1;

        const oneR =
            r + direction;


        if(
            inside(oneR,c) &&
            !state[oneR][c]
        ){

            moves.push({
                fromR:r,
                fromC:c,
                toR:oneR,
                toC:c
            });


            const twoR =
                r + direction * 2;


            if(
                r === startRow &&
                !state[twoR][c]
            ){

                moves.push({
                    fromR:r,
                    fromC:c,
                    toR:twoR,
                    toC:c,
                    doublePawn:true
                });
            }
        }


        for(
            const dc of [-1,1]
        ){

            const nr =
                r + direction;

            const nc =
                c + dc;

            if(!inside(nr,nc)){
                continue;
            }

            const target =
                state[nr][nc];


            if(
                target &&
                pieceColor(target) !== color
            ){

                moves.push({
                    fromR:r,
                    fromC:c,
                    toR:nr,
                    toC:nc,
                    capture:true
                });
            }


            if(
                enPassantTarget &&
                enPassantTarget.r === nr &&
                enPassantTarget.c === nc
            ){

                moves.push({
                    fromR:r,
                    fromC:c,
                    toR:nr,
                    toC:nc,
                    enPassant:true
                });
            }
        }
    }


    if(type === "n"){

        const offsets = [
            [-2,-1],
            [-2,1],
            [-1,-2],
            [-1,2],
            [1,-2],
            [1,2],
            [2,-1],
            [2,1]
        ];


        for(
            const [dr,dc]
            of offsets
        ){

            const nr =
                r + dr;

            const nc =
                c + dc;

            if(!inside(nr,nc)){
                continue;
            }

            const target =
                state[nr][nc];


            if(
                !target ||
                pieceColor(target) !== color
            ){

                moves.push({
                    fromR:r,
                    fromC:c,
                    toR:nr,
                    toC:nc,
                    capture:!!target
                });
            }
        }
    }


    if(type === "k"){

        for(let dr=-1;dr<=1;dr++){

            for(let dc=-1;dc<=1;dc++){

                if(!dr && !dc) continue;

                const nr =
                    r + dr;

                const nc =
                    c + dc;

                if(!inside(nr,nc)){
                    continue;
                }

                const target =
                    state[nr][nc];


                if(
                    !target ||
                    pieceColor(target) !== color
                ){

                    moves.push({
                        fromR:r,
                        fromC:c,
                        toR:nr,
                        toC:nc,
                        capture:!!target
                    });
                }
            }
        }


        if(includeCastling){

            const enemy =
                opponent(color);


            if(
                color === "w" &&
                r === 7 &&
                c === 4 &&
                !isInCheck(state,"w")
            ){

                if(
                    castlingRights.wK &&
                    state[7][5] === null &&
                    state[7][6] === null &&
                    state[7][7] === "wr" &&
                    !isSquareAttacked(
                        state,
                        7,
                        5,
                        enemy
                    ) &&
                    !isSquareAttacked(
                        state,
                        7,
                        6,
                        enemy
                    )
                ){

                    moves.push({
                        fromR:7,
                        fromC:4,
                        toR:7,
                        toC:6,
                        castle:"K"
                    });
                }


                if(
                    castlingRights.wQ &&
                    state[7][3] === null &&
                    state[7][2] === null &&
                    state[7][1] === null &&
                    state[7][0] === "wr" &&
                    !isSquareAttacked(
                        state,
                        7,
                        3,
                        enemy
                    ) &&
                    !isSquareAttacked(
                        state,
                        7,
                        2,
                        enemy
                    )
                ){

                    moves.push({
                        fromR:7,
                        fromC:4,
                        toR:7,
                        toC:2,
                        castle:"Q"
                    });
                }
            }


            if(
                color === "b" &&
                r === 0 &&
                c === 4 &&
                !isInCheck(state,"b")
            ){

                if(
                    castlingRights.bK &&
                    state[0][5] === null &&
                    state[0][6] === null &&
                    state[0][7] === "br" &&
                    !isSquareAttacked(
                        state,
                        0,
                        5,
                        enemy
                    ) &&
                    !isSquareAttacked(
                        state,
                        0,
                        6,
                        enemy
                    )
                ){

                    moves.push({
                        fromR:0,
                        fromC:4,
                        toR:0,
                        toC:6,
                        castle:"K"
                    });
                }


                if(
                    castlingRights.bQ &&
                    state[0][3] === null &&
                    state[0][2] === null &&
                    state[0][1] === null &&
                    state[0][0] === "br" &&
                    !isSquareAttacked(
                        state,
                        0,
                        3,
                        enemy
                    ) &&
                    !isSquareAttacked(
                        state,
                        0,
                        2,
                        enemy
                    )
                ){

                    moves.push({
                        fromR:0,
                        fromC:4,
                        toR:0,
                        toC:2,
                        castle:"Q"
                    });
                }
            }
        }
    }


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


    if(directions.length){

        for(
            const [dr,dc]
            of directions
        ){

            let nr =
                r + dr;

            let nc =
                c + dc;


            while(inside(nr,nc)){

                const target =
                    state[nr][nc];


                if(!target){

                    moves.push({
                        fromR:r,
                        fromC:c,
                        toR:nr,
                        toC:nc
                    });

                }else{

                    if(
                        pieceColor(target) !==
                        color
                    ){

                        moves.push({
                            fromR:r,
                            fromC:c,
                            toR:nr,
                            toC:nc,
                            capture:true
                        });
                    }

                    break;
                }


                nr += dr;
                nc += dc;
            }
        }
    }


    return moves;
}


/* =========================================================
   APPLY MOVE
========================================================= */

function applyMoveToBoard(state,move){

    const next =
        cloneBoard(state);

    const piece =
        next[move.fromR][move.fromC];

    next[move.fromR][move.fromC] =
        null;


    if(move.enPassant){

        const captureR =
            move.fromR;

        next[captureR][move.toC] =
            null;
    }


    let placedPiece =
        piece;


    if(
        pieceType(piece) === "p" &&
        (
            move.toR === 0 ||
            move.toR === 7
        )
    ){

        placedPiece =
            pieceColor(piece) + "q";
    }


    next[move.toR][move.toC] =
        placedPiece;


    if(move.castle === "K"){

        next[move.toR][5] =
            next[move.toR][7];

        next[move.toR][7] =
            null;
    }


    if(move.castle === "Q"){

        next[move.toR][3] =
            next[move.toR][0];

        next[move.toR][0] =
            null;
    }


    return next;
}


/* =========================================================
   LEGAL MOVES
========================================================= */

function legalMovesFrom(state,r,c){

    const piece =
        state[r][c];

    if(!piece) return [];

    if(pieceColor(piece) !== turn){
        return [];
    }

    const pseudo =
        pseudoMoves(
            state,
            r,
            c,
            true
        );

    const legal = [];


    for(const move of pseudo){

        const next =
            applyMoveToBoard(
                state,
                move
            );


        if(
            !isInCheck(
                next,
                pieceColor(piece)
            )
        ){

            legal.push(move);
        }
    }


    return legal;
}


function allLegalMoves(state,color){

    const oldTurn =
        turn;

    turn =
        color;

    const result = [];


    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            if(
                pieceColor(state[r][c]) ===
                color
            ){

                result.push(
                    ...legalMovesFrom(
                        state,
                        r,
                        c
                    )
                );
            }
        }
    }


    turn =
        oldTurn;

    return result;
}


/* =========================================================
   RENDER BOARD
========================================================= */

function renderBoard(){

    const boardEl =
        $("chessBoard");

    if(!boardEl) return;

    boardEl.innerHTML = "";


    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement("div");

            square.className =
                "chessSquare " +
                (
                    (r+c)%2 === 0
                        ? "light"
                        : "dark"
                );


            square.dataset.row =
                r;

            square.dataset.col =
                c;


            if(
                selectedSquare &&
                selectedSquare.r === r &&
                selectedSquare.c === c
            ){

                square.classList.add(
                    "selected"
                );
            }


            const target =
                legalTargets.find(
                    m =>
                        m.toR === r &&
                        m.toC === c
                );


            if(target){

                if(board[r][c]){

                    const capture =
                        document.createElement("div");

                    capture.className =
                        "captureDot";

                    square.appendChild(
                        capture
                    );

                }else{

                    const dot =
                        document.createElement("div");

                    dot.className =
                        "legalDot";

                    square.appendChild(
                        dot
                    );
                }
            }


            const piece =
                board[r][c];


            if(piece){

                const pieceEl =
                    document.createElement("div");

                pieceEl.className =
                    "chessPiece " +
                    (
                        pieceColor(piece) === "w"
                            ? "whitePiece"
                            : "blackPiece"
                    );

                pieceEl.textContent =
                    PIECES[
                        pieceColor(piece)
                    ][
                        pieceType(piece)
                    ];


                square.appendChild(
                    pieceEl
                );
            }


            square.addEventListener(
                "click",
                () =>
                    handleSquareClick(r,c)
            );


            boardEl.appendChild(
                square
            );
        }
    }


    updateCaptured();

    updateGameStatus();
}


/* =========================================================
   BOARD CLICK
========================================================= */

function handleSquareClick(r,c){

    /*
       Online turn protection.
    */
    if(
        onlineGameId &&
        onlineColor &&
        turn !== onlineColor
    ){

        return;
    }


    if(gameOver) return;


    if(
        playingBot &&
        turn === "b"
    ){

        return;
    }


    const piece =
        board[r][c];


    if(selectedSquare){

        const move =
            legalTargets.find(
                m =>
                    m.toR === r &&
                    m.toC === c
            );


        if(move){

            makeMove(move);

            return;
        }
    }


    if(
        piece &&
        pieceColor(piece) === turn
    ){

        selectedSquare =
            {r,c};

        legalTargets =
            legalMovesFrom(
                board,
                r,
                c
            );

        renderBoard();

        return;
    }


    selectedSquare =
        null;

    legalTargets =
        [];

    renderBoard();
}


/* =========================================================
   GAME STATUS
========================================================= */

function updateGameStatus(){

    const status =
        $("gameStatus");

    if(!status) return;

    if(gameOver) return;


    if(
        onlineGameId &&
        onlineColor &&
        turn !== onlineColor
    ){

        status.textContent =
            "Waiting for opponent...";

        return;
    }


    const check =
        isInCheck(
            board,
            turn
        );


    let text =
        turn === "w"
            ? "White to move"
            : "Black to move";


    if(check){
        text += " — CHECK!";
    }


    if(
        playingBot &&
        botThinking
    ){

        text =
            "Bot is thinking...";
    }


    status.textContent =
        text;
}


/* =========================================================
   MAKE MOVE
========================================================= */

function makeMove(move){

    if(gameOver) return;

    if(
        onlineGameId &&
        onlineColor &&
        turn !== onlineColor
    ){

        return;
    }


    const movingColor =
        turn;

    const movingPiece =
        board[
            move.fromR
        ][
            move.fromC
        ];

    const capturedPiece =
        board[
            move.toR
        ][
            move.toC
        ];


    const beforeState = {
        board:
            cloneBoard(board),

        turn,

        castling:
            structuredCloneSafe(
                castlingRights
            ),

        enPassant:
            enPassantTarget
                ? {...enPassantTarget}
                : null,

        capturedWhite:
            [...capturedWhite],

        capturedBlack:
            [...capturedBlack],

        moveHistory:
            [...moveHistory]
    };


    moveHistory.push({
        before:
            beforeState,

        move:
            copyMove(move),

        piece:
            movingPiece
    });


    let actualCaptured =
        capturedPiece;


    if(move.enPassant){

        const captureR =
            move.fromR;

        actualCaptured =
            board[
                captureR
            ][
                move.toC
            ];

        board[
            captureR
        ][
            move.toC
        ] =
            null;
    }


    if(actualCaptured){

        profile.captures++;

        if(
            pieceColor(actualCaptured) === "w"
        ){

            capturedWhite.push(
                actualCaptured
            );

        }else{

            capturedBlack.push(
                actualCaptured
            );
        }
    }


    board[
        move.toR
    ][
        move.toC
    ] =
        movingPiece;


    board[
        move.fromR
    ][
        move.fromC
    ] =
        null;


    if(
        pieceType(movingPiece) === "p" &&
        (
            move.toR === 0 ||
            move.toR === 7
        )
    ){

        board[
            move.toR
        ][
            move.toC
        ] =
            movingColor + "q";

        profile.promotions++;

        unlock("promotion");
    }


    if(move.castle){

        if(move.castle === "K"){

            board[
                move.toR
            ][5] =
                board[
                    move.toR
                ][7];

            board[
                move.toR
            ][7] =
                null;

        }else if(
            move.castle === "Q"
        ){

            board[
                move.toR
            ][3] =
                board[
                    move.toR
                ][0];

            board[
                move.toR
            ][0] =
                null;
        }


        profile.castles++;

        unlock("castling");
    }


    updateCastlingRights(
        movingPiece,
        move,
        actualCaptured
    );


    enPassantTarget =
        null;


    if(
        pieceType(movingPiece) === "p" &&
        Math.abs(
            move.toR -
            move.fromR
        ) === 2
    ){

        enPassantTarget = {
            r:
                (
                    move.toR +
                    move.fromR
                ) / 2,

            c:
                move.fromC
        };
    }


    profile.moves++;


    const movingType =
        pieceType(
            movingPiece
        );


    if(
        profile.pieceMoves[
            movingType
        ] !== undefined
    ){

        profile.pieceMoves[
            movingType
        ]++;
    }


    if(
        actualCaptured &&
        pieceType(actualCaptured) === "q"
    ){

        unlock("queenCapture");
    }


    if(
        actualCaptured &&
        pieceType(actualCaptured) === "r"
    ){

        unlock("rookCapture");
    }


    if(
        actualCaptured &&
        pieceType(actualCaptured) === "n"
    ){

        unlock("knightCapture");
    }


    if(
        actualCaptured &&
        pieceType(actualCaptured) === "b"
    ){

        unlock("bishopCapture");
    }


    if(
        actualCaptured &&
        pieceType(actualCaptured) === "p"
    ){

        unlock("pawnCapture");
    }


    if(
        isInCheck(
            beforeState.board,
            movingColor
        )
    ){

        unlock("checkEscape");
    }


    turn =
        opponent(turn);


    selectedSquare =
        null;

    legalTargets =
        [];


    const opponentInCheck =
        isInCheck(
            board,
            turn
        );


    if(opponentInCheck){

        profile.checks++;

        unlock("check");
    }


    profile.recentMoves.unshift({
        from:
            coordName(
                move.fromR,
                move.fromC
            ),

        to:
            coordName(
                move.toR,
                move.toC
            )
    });


    profile.recentMoves =
        profile.recentMoves.slice(
            0,
            20
        );


    positionHistory.push(
        positionKey(
            board,
            turn
        )
    );


    const possibleMoves =
        allLegalMoves(
            board,
            turn
        );


    if(possibleMoves.length === 0){

        gameOver =
            true;


        if(opponentInCheck){

            profile.checkmates++;

            unlock("checkmate");


            if(onlineGameId){

                finishOnlineMove(
                    move
                );

            }else{

                finishGame(
                    movingColor,
                    "checkmate"
                );
            }

        }else{

            if(onlineGameId){

                finishOnlineMove(
                    move
                );

            }else{

                finishGame(
                    null,
                    "stalemate"
                );
            }
        }
    }


    updateMoveList();

    saveProfile();

    renderBoard();

    checkAdvancements();


    /*
       Online synchronization.
    */
    if(
        onlineGameId &&
        supabaseClient
    ){

        const onlineState = {

            board:
                cloneBoard(board),

            turn:
                turn,

            castlingRights:
                structuredCloneSafe(
                    castlingRights
                ),

            enPassantTarget:
                enPassantTarget
                    ? {
                        ...enPassantTarget
                    }
                    : null
        };


        sendOnlineMove(
            move,
            onlineState
        );
    }


    if(
        playingBot &&
        !gameOver &&
        turn === "b"
    ){

        botThinking =
            true;

        updateGameStatus();


        setTimeout(
            () => {

                botMove();

            },
            350
        );
    }
}


function finishOnlineMove(move){

    if(
        onlineGameId &&
        supabaseClient
    ){

        sendOnlineMove(
            move,
            {
                board:
                    cloneBoard(board),

                turn,

                castlingRights:
                    structuredCloneSafe(
                        castlingRights
                    ),

                enPassantTarget:
                    enPassantTarget
                        ? {
                            ...enPassantTarget
                        }
                        : null
            }
        );
    }
}


/* =========================================================
   CASTLING RIGHTS
========================================================= */

function updateCastlingRights(
    piece,
    move,
    captured
){

    if(piece === "wk"){

        castlingRights.wK =
            false;

        castlingRights.wQ =
            false;
    }


    if(piece === "bk"){

        castlingRights.bK =
            false;

        castlingRights.bQ =
            false;
    }


    if(piece === "wr"){

        if(
            move.fromR === 7 &&
            move.fromC === 0
        ){

            castlingRights.wQ =
                false;
        }

        if(
            move.fromR === 7 &&
            move.fromC === 7
        ){

            castlingRights.wK =
                false;
        }
    }


    if(piece === "br"){

        if(
            move.fromR === 0 &&
            move.fromC === 0
        ){

            castlingRights.bQ =
                false;
        }

        if(
            move.fromR === 0 &&
            move.fromC === 7
        ){

            castlingRights.bK =
                false;
        }
    }


    if(captured === "wr"){

        if(
            move.toR === 7 &&
            move.toC === 0
        ){

            castlingRights.wQ =
                false;
        }

        if(
            move.toR === 7 &&
            move.toC === 7
        ){

            castlingRights.wK =
                false;
        }
    }


    if(captured === "br"){

        if(
            move.toR === 0 &&
            move.toC === 0
        ){

            castlingRights.bQ =
                false;
        }

        if(
            move.toR === 0 &&
            move.toC === 7
        ){

            castlingRights.bK =
                false;
        }
    }
}


/* =========================================================
   POSITION KEY
========================================================= */

function positionKey(state,side){

    return (
        state
            .map(
                row =>
                    row
                        .map(
                            x => x || "--"
                        )
                        .join("")
            )
            .join("/") +
        "|" +
        side
    );
}


/* =========================================================
   MOVE LIST
========================================================= */

function updateMoveList(){

    const el =
        $("moveList");

    if(!el) return;

    el.innerHTML =
        "";


    moveHistory.forEach(
        (item,index) => {

            const div =
                document.createElement("div");

            div.className =
                "moveItem";

            div.textContent =
                `${index + 1}. ` +
                `${coordName(
                    item.move.fromR,
                    item.move.fromC
                )} → ` +
                `${coordName(
                    item.move.toR,
                    item.move.toC
                )}`;

            el.appendChild(
                div
            );
        }
    );
}


/* =========================================================
   CAPTURE DISPLAY
========================================================= */

function updateCaptured(){

    const whiteEl =
        $("capturedWhite");

    const blackEl =
        $("capturedBlack");


    if(whiteEl){

        whiteEl.textContent =
            capturedWhite
                .map(
                    p =>
                        PIECES[p[0]][p[1]]
                )
                .join(" ");
    }


    if(blackEl){

        blackEl.textContent =
            capturedBlack
                .map(
                    p =>
                        PIECES[p[0]][p[1]]
                )
                .join(" ");
    }
}


/* =========================================================
   RESTART
========================================================= */

function resetBoard(){

    board =
        cloneBoard(
            START_BOARD
        );

    turn =
        "w";

    selectedSquare =
        null;

    legalTargets =
        [];

    capturedWhite =
        [];

    capturedBlack =
        [];

    moveHistory =
        [];

    positionHistory = [
        positionKey(
            board,
            turn
        )
    ];


    castlingRights = {
        wK:true,
        wQ:true,
        bK:true,
        bQ:true
    };


    enPassantTarget =
        null;

    gameOver =
        false;

    botThinking =
        false;


    renderBoard();

    updateMoveList();

    updatePlayers();

    unlock("restart");
}


/* =========================================================
   TAKE BACK
========================================================= */

function takeBack(){

    if(!moveHistory.length){
        return;
    }


    const last =
        moveHistory.pop();

    const state =
        last.before;


    board =
        cloneBoard(
            state.board
        );

    turn =
        state.turn;


    castlingRights =
        structuredCloneSafe(
            state.castling
        );


    enPassantTarget =
        state.enPassant
            ? {...state.enPassant}
            : null;


    capturedWhite =
        [...state.capturedWhite];

    capturedBlack =
        [...state.capturedBlack];

    gameOver =
        false;

    selectedSquare =
        null;

    legalTargets =
        [];

    botThinking =
        false;


    renderBoard();

    updateMoveList();

    unlock("takeback");
}


/* =========================================================
   HINT
========================================================= */

function giveHint(){

    if(gameOver) return;


    const moves =
        allLegalMoves(
            board,
            turn
        );


    if(!moves.length) return;


    const captures =
        moves.filter(
            m =>
                board[
                    m.toR
                ][
                    m.toC
                ]
        );


    const move =
        captures.length
            ? captures[
                Math.floor(
                    Math.random() *
                    captures.length
                )
            ]
            : moves[
                Math.floor(
                    Math.random() *
                    moves.length
                )
            ];


    selectedSquare = {
        r:move.fromR,
        c:move.fromC
    };


    legalTargets =
        legalMovesFrom(
            board,
            move.fromR,
            move.fromC
        );


    renderBoard();

    unlock("hint");
}


/* =========================================================
   START SOLO GAME
========================================================= */

function startGame(){

    playingBot =
        false;

    currentBot =
        null;

    soloChess =
        true;

    showPage(
        "game"
    );

    resetBoard();

    updatePlayers();

    unlock("firstGame");
}


function startSoloChess(){

    playingBot =
        false;

    currentBot =
        null;

    soloChess =
        true;

    showPage(
        "game"
    );

    resetBoard();

    updatePlayers();

    unlock("solo");
}


/* =========================================================
   BOT PAGE
========================================================= */

function openBotPage(){

    showPage(
        "botPage"
    );

    renderBotGrid();
}


function renderBotGrid(){

    const grid =
        $("botGrid");

    if(!grid) return;

    grid.innerHTML =
        "";


    const bots =
        [
            ...BOTS
        ];


    if(
        profile.botWins.length >=
        BOTS.length
    ){

        bots.push(
            GENERAL_HUX
        );
    }


    bots.forEach(
        bot => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "botButton";


            button.innerHTML = `
                <span>
                    <span class="botName">
                        🤖 ${escapeHtml(bot.name)}
                    </span>
                    <br>
                    <span class="botElo">
                        ${bot.elo} Elo
                    </span>
                </span>
                <span>▶</span>
            `;


            button.onclick =
                () =>
                    startBotGame(bot);


            grid.appendChild(
                button
            );
        }
    );
}


/* =========================================================
   BOT GAME
========================================================= */

function startBotGame(bot){

    if(
        bot.name === "General Hux" &&
        !(
            profile.botWins.length >=
            BOTS.length
        )
    ){

        alert(
            "General Hux is locked.\n\n" +
            "Beat every normal bot first."
        );

        return;
    }


    currentBot =
        bot;

    playingBot =
        true;

    soloChess =
        false;


    showPage(
        "game"
    );


    resetBoard();


    profile.botsPlayed.push(
        bot.name
    );


    profile.botsPlayed =
        [
            ...new Set(
                profile.botsPlayed
            )
        ];


    updatePlayers();

    saveProfile();
}


/* =========================================================
   BOT ENGINE
========================================================= */

const PIECE_VALUES = {
    p:100,
    n:320,
    b:330,
    r:500,
    q:900,
    k:20000
};


function evaluateBoard(state){

    let score = 0;


    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const piece =
                state[r][c];

            if(!piece){
                continue;
            }


            const value =
                PIECE_VALUES[
                    pieceType(piece)
                ];


            if(
                pieceColor(piece) === "b"
            ){

                score +=
                    value;

            }else{

                score -=
                    value;
            }
        }
    }


    return score;
}


/* =========================================================
   REAL STOCKFISH 18 LITE BOT
========================================================= */

let stockfishEngine = null;
let stockfishReady = false;
let stockfishSearching = false;


/* =========================================================
   START STOCKFISH
========================================================= */

function initStockfish(){

    if(stockfishEngine){
        return;
    }

    try{

        stockfishEngine =
            new Worker(
                "stockfish/stockfish-18-lite.js#stockfish/stockfish-18-lite.wasm"
            );


        stockfishEngine.onmessage =
            function(event){

                const line =
                    String(event.data || "").trim();


                if(!line){
                    return;
                }


                console.log(
                    "[Stockfish]",
                    line
                );
                /* -----------------------------
                   UCI INITIALIZATION
                ----------------------------- */

                if(line === "uciok"){

                    stockfishEngine.postMessage(
                        "isready"
                    );

                    return;
                }


                if(line === "readyok"){

                    stockfishReady =
                        true;

                    return;
                }


                /* -----------------------------
                   BEST MOVE
                ----------------------------- */

                if(
                    line.startsWith(
                        "bestmove "
                    )
                ){

                    stockfishSearching =
                        false;


                    const parts =
                        line.split(/\s+/);


                    const uciMove =
                        parts[1];


                    if(
                        !uciMove ||
                        uciMove === "(none)"
                    ){

                        botThinking =
                            false;

                        return;
                    }


                    const move =
                        stockfishUciToGameMove(
                            uciMove
                        );


                    if(!move){

                        console.error(
                            "Invalid Stockfish move:",
                            uciMove
                        );

                        botThinking =
                            false;

                        return;
                    }


                    botThinking =
                        false;


                    /*
                       USE YOUR EXISTING MOVE SYSTEM.
                    */

                    makeMove(
                        move
                    );
                }
            };


        stockfishEngine.onerror =
            function(error){

                console.error(
                    "Stockfish error:",
                    error
                );


                stockfishReady =
                    false;


                stockfishSearching =
                    false;


                botThinking =
                    false;


                alert(
                    "Stockfish failed to start.\n\n" +
                    "Check the browser console for the error."
                );
            };


        stockfishEngine.postMessage(
            "uci"
        );


    }catch(error){

        console.error(
            "Could not create Stockfish:",
            error
        );
    }
}


/* =========================================================
   BOARD → FEN
========================================================= */

function boardToFEN(){

    const files =
        "abcdefgh";


    let placement =
        "";


    for(
        let r = 0;
        r < 8;
        r++
    ){

        let empty =
            0;


        for(
            let c = 0;
            c < 8;
            c++
        ){

            const piece =
                board[r][c];


            if(!piece){

                empty++;
                continue;
            }


            if(empty > 0){

                placement +=
                    empty;

                empty =
                    0;
            }


            const type =
                pieceType(
                    piece
                );


            const color =
                pieceColor(
                    piece
                );


            let letter =
                type;


            if(color === "w"){

                letter =
                    letter.toUpperCase();
            }


            placement +=
                letter;
        }


        if(empty > 0){

            placement +=
                empty;
        }


        if(r < 7){

            placement +=
                "/";
        }
    }


    /* -----------------------------
       SIDE TO MOVE
    ----------------------------- */

    const side =
        turn;


    /* -----------------------------
       CASTLING
    ----------------------------- */

    let castling =
        "";


    if(castlingRights.wK){
        castling += "K";
    }

    if(castlingRights.wQ){
        castling += "Q";
    }

    if(castlingRights.bK){
        castling += "k";
    }

    if(castlingRights.bQ){
        castling += "q";
    }


    if(!castling){

        castling =
            "-";
    }


    /* -----------------------------
       EN PASSANT
    ----------------------------- */

    let ep =
        "-";


    if(enPassantTarget){

        ep =
            files[
                enPassantTarget.c
            ] +
            (
                8 -
                enPassantTarget.r
            );
    }


    /* -----------------------------
       MOVE COUNTERS
    ----------------------------- */

    const halfmove =
        0;


    const fullmove =
        Math.floor(
            moveHistory.length / 2
        ) + 1;


    return (
        placement +
        " " +
        side +
        " " +
        castling +
        " " +
        ep +
        " " +
        halfmove +
        " " +
        fullmove
    );
}


/* =========================================================
   UCI MOVE → YOUR GAME MOVE
========================================================= */

function stockfishUciToGameMove(
    uci
){

    if(
        !uci ||
        uci.length < 4
    ){

        return null;
    }


    const files =
        "abcdefgh";


    const fromC =
        files.indexOf(
            uci[0]
        );


    const fromR =
        8 -
        Number(
            uci[1]
        );


    const toC =
        files.indexOf(
            uci[2]
        );


    const toR =
        8 -
        Number(
            uci[3]
        );


    if(
        fromC < 0 ||
        toC < 0 ||
        fromR < 0 ||
        fromR > 7 ||
        toR < 0 ||
        toR > 7
    ){

        return null;
    }


    const movingPiece =
        board[fromR][fromC];


    if(!movingPiece){

        return null;
    }


    const move = {

        fromR:
            fromR,

        fromC:
            fromC,

        toR:
            toR,

        toC:
            toC
    };


    /* -----------------------------
       BLACK CASTLING
    ----------------------------- */

    if(
        movingPiece === "bk" &&
        fromR === 0 &&
        fromC === 4
    ){

        if(
            toR === 0 &&
            toC === 6
        ){

            move.castle =
                "K";
        }


        if(
            toR === 0 &&
            toC === 2
        ){

            move.castle =
                "Q";
        }
    }


    /* -----------------------------
       BLACK EN PASSANT
    ----------------------------- */

    if(
        movingPiece === "bp" &&
        fromC !== toC &&
        !board[toR][toC] &&
        enPassantTarget &&
        enPassantTarget.r === toR &&
        enPassantTarget.c === toC
    ){

        move.enPassant =
            true;
    }


    return move;
}


/* =========================================================
   BOT STRENGTH
========================================================= */
function stockfishDepthForBot(elo){

    if(elo >= 3400){
        return 10;
    }

    if(elo >= 2800){
        return 10;
    }

    if(elo >= 2200){
        return 9;
    }

    if(elo >= 1800){
        return 8;
    }

    if(elo >= 1400){
        return 7;
    }

    return 6;
}
/* =========================================================
   REAL BOT MOVE
========================================================= */

function botMove(){

    if(
        !playingBot ||
        gameOver ||
        turn !== "b"
    ){

        botThinking =
            false;

        return;
    }


    if(!stockfishEngine){

        initStockfish();
    }


    if(!stockfishReady){

        setTimeout(
            function(){

                if(
                    playingBot &&
                    !gameOver &&
                    turn === "b"
                ){

                    botMove();
                }

            },
            250
        );

        return;
    }


    if(stockfishSearching){

        return;
    }


    stockfishSearching =
        true;


    botThinking =
        true;


    const elo =
        currentBot
            ? currentBot.elo
            : 1000;


    const depth =
        stockfishDepthForBot(
            elo
        );


    const fen =
        boardToFEN();


    console.log(
        "[Stockfish FEN]",
        fen
    );


    /* -----------------------------
       NEW GAME / NEW POSITION
    ----------------------------- */

    stockfishEngine.postMessage(
        "ucinewgame"
    );


    stockfishEngine.postMessage(
        "position fen " +
        fen
    );


    /*
       Magnus and the other bots now
       actually ask Stockfish for a move.
    */

    stockfishEngine.postMessage(

        "go depth " +
        depth
    );
}


/* =========================================================
   START ENGINE
========================================================= */

initStockfish();


/* =========================================================
   FINISH GAME
========================================================= */

function finishGame(
    winner,
    reason
){

    profile.games++;

    let userWon =
        false;


    if(winner){

        if(
            winner === "w"
        ){

            userWon =
                true;
        }
    }


    if(reason === "stalemate"){

        profile.streak =
            0;

        showResult(
            "STALEMATE",
            "DRAW"
        );

    }else if(userWon){

        profile.wins++;

        profile.streak++;

        profile.bestStreak =
            Math.max(
                profile.bestStreak,
                profile.streak
            );


        updateElo(true);


        if(
            currentBot &&
            !profile.botWins.includes(
                currentBot.name
            )
        ){

            profile.botWins.push(
                currentBot.name
            );
        }


        showResult(
            "CHECKMATE!",
            "YOU WON!"
        );


        unlock(
            "firstWin"
        );

    }else{

        profile.losses++;

        profile.streak =
            0;


        updateElo(false);


        showResult(
            "CHECKMATE!",
            "YOU LOST"
        );
    }


    saveProfile();

    checkGeneralHux();

    checkAdvancements();
}


function updateElo(won){

    if(won){

        profile.elo += 8;

    }else{

        profile.elo =
            Math.max(
                3400,
                profile.elo - 5
            );
    }


    profile.blitz =
        Math.max(
            3400,
            profile.blitz
        );

    profile.rapid =
        Math.max(
            3400,
            profile.rapid
        );

    profile.daily =
        Math.max(
            3400,
            profile.daily
        );
}


/* =========================================================
   RESULT
========================================================= */

function showResult(
    title,
    outcome
){

    const overlay =
        $("resultOverlay");

    if(!overlay) return;


    const titleEl =
        $("resultTitle");

    const outcomeEl =
        $("resultOutcome");

    const myName =
        $("resultMyName");

    const myElo =
        $("resultMyElo");

    const myAvatar =
        $("resultMyAvatar");

    const opponentName =
        $("resultOpponentName");

    const opponentElo =
        $("resultOpponentElo");


    if(titleEl){
        titleEl.textContent =
            title;
    }


    if(outcomeEl){
        outcomeEl.textContent =
            outcome;
    }


    if(myName){
        myName.textContent =
            profile.username;
    }


    if(myElo){
        myElo.textContent =
            `${profile.elo} Elo`;
    }


    if(myAvatar){
        myAvatar.textContent =
            profile.avatar;
    }


    if(opponentName){

        opponentName.textContent =
            currentBot
                ? currentBot.name
                : "Player 2";
    }


    if(opponentElo){

        opponentElo.textContent =
            currentBot
                ? `${currentBot.elo} Elo`
                : `${profile.elo} Elo`;
    }


    overlay.style.display =
        "flex";
}


function closeResult(){

    const overlay =
        $("resultOverlay");

    if(overlay){

        overlay.style.display =
            "none";
    }
}


/* =========================================================
   HOME / PAGES
========================================================= */

const PAGE_IDS = [
    "menu",
    "game",
    "botPage",
    "learnPage",
    "friendsPage",
    "onlinePage",
    "profilePage",
    "advancementsPage",
    "puzzlesPage",
    "tournamentsPage",
    "collectionPage",
    "achievementsPage",
    "livePage",
    "communityPage",
    "premiumPage",
    "settingsPage",
    "rulesPage"
];


function showPage(id){

    PAGE_IDS.forEach(
        pageId => {

            const page =
                $(pageId);

            if(!page) return;

            page.style.display =
                pageId === id
                    ? "flex"
                    : "none";
        }
    );
}


function goHome(){

    playingBot =
        false;

    currentBot =
        null;

    soloChess =
        false;

    botThinking =
        false;


    closeResult();

    closeSealParty();

    showPage(
        "menu"
    );

    renderTrainingBoard();

    updateAllProfileDisplays();
}


/* =========================================================
   TRAINING BOARD
========================================================= */

function renderTrainingBoard(){

    const el =
        $("trainingBoard");

    if(!el) return;

    el.innerHTML =
        "";


    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement(
                    "div"
                );


            square.className =
                "chessSquare " +
                (
                    (r+c)%2 === 0
                        ? "light"
                        : "dark"
                );


            const piece =
                START_BOARD[r][c];


            if(piece){

                const pieceEl =
                    document.createElement(
                        "div"
                    );


                pieceEl.className =
                    "chessPiece " +
                    (
                        pieceColor(piece) === "w"
                            ? "whitePiece"
                            : "blackPiece"
                    );


                pieceEl.textContent =
                    PIECES[
                        pieceColor(piece)
                    ][
                        pieceType(piece)
                    ];


                square.appendChild(
                    pieceEl
                );
            }


            el.appendChild(
                square
            );
        }
    }
}


/* =========================================================
   PROFILE
========================================================= */

function openProfile(){

    showPage(
        "profilePage"
    );

    updateAllProfileDisplays();
}


function updateAllProfileDisplays(){

    const values = {

        homeAvatar:
            profile.avatar,

        homeUsername:
            profile.username,

        homeElo:
            `${profile.elo} Elo`,

        profileAvatar:
            profile.avatar,

        profileUsername:
            profile.username,

        profileOverall:
            profile.elo,

        profileBlitz:
            profile.blitz,

        profileRapid:
            profile.rapid,

        profileDaily:
            profile.daily,

        profilePuzzleRating:
            profile.puzzleRating,

        profileWins:
            profile.wins,

        onlineUsername:
            profile.username,

        onlineStats:
            `${profile.elo} Elo`
    };


    Object.entries(values).forEach(
        ([id,value]) => {

            const el =
                $(id);

            if(el){

                el.textContent =
                    value;
            }
        }
    );
}


/* =========================================================
   EDIT PROFILE
========================================================= */

function editProfile(){

    const name =
        prompt(
            "Choose your username:",
            profile.username
        );


    if(
        name &&
        name.trim()
    ){

        profile.username =
            name
                .trim()
                .slice(0,20);
    }


    const avatar =
        prompt(
            "Choose an avatar:",
            profile.avatar
        );


    if(
        avatar &&
        avatar.trim()
    ){

        profile.avatar =
            avatar
                .trim()
                .slice(0,2);
    }


    saveProfile();

    updateAllProfileDisplays();

    unlock("profile");
}


/* =========================================================
   LOGIN / REGISTER
========================================================= */

function openLogin(){

    const overlay =
        $("loginOverlay");

    if(!overlay) return;

    overlay.style.display =
        "flex";
}


function closeLogin(){

    const overlay =
        $("loginOverlay");

    if(overlay){

        overlay.style.display =
            "none";
    }
}


function createOrSignIn(){

    const username =
        $("loginUsername")
            ?.value
            .trim();

    const password =
        $("loginPassword")
            ?.value || "";

    const message =
        $("loginMessage");


    if(!username){

        if(message){

            message.textContent =
                "Please enter a username.";
        }

        return;
    }


    profile.username =
        username.slice(
            0,
            20
        );

    profile.password =
        password.slice(
            0,
            40
        );


    saveProfile();

    updateAllProfileDisplays();


    if(message){

        message.textContent =
            "Account saved locally!";
    }


    unlock(
        "account"
    );


    setTimeout(
        closeLogin,
        600
    );
}


function toggleAccountLanguage(){

    setLanguage(
        language === "en"
            ? "fa"
            : "en"
    );

    updateSettingsUI();
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

const ADVANCEMENTS = [

    [
        "firstGame",
        "First Game",
        "Play your first chess game."
    ],

    [
        "firstWin",
        "First Win",
        "Win your first game."
    ],

    [
        "moves10",
        "10 Moves",
        "Make 10 chess moves."
    ],

    [
        "wins3",
        "3 Wins",
        "Win 3 games."
    ],

    [
        "wins10",
        "10 Wins",
        "Win 10 games."
    ],

    [
        "games5",
        "5 Games",
        "Play 5 games."
    ],

    [
        "games10",
        "10 Games",
        "Play 10 games."
    ],

    [
        "streak3",
        "3 Win Streak",
        "Reach a 3-game win streak."
    ],

    [
        "check",
        "Check",
        "Give check."
    ],

    [
        "checkmate",
        "Checkmate",
        "Deliver checkmate."
    ],

    [
        "stalemate",
        "Stalemate",
        "Reach a stalemate."
    ],

    [
        "restart",
        "Restart",
        "Restart a chess game."
    ],

    [
        "takeback",
        "Take Back",
        "Use Take Back."
    ],

    [
        "hint",
        "Hint",
        "Use a chess hint."
    ],

    [
        "checkEscape",
        "Check Escape",
        "Escape check."
    ],

    [
        "castling",
        "Castling",
        "Castle your king."
    ],

    [
        "promotion",
        "Promotion",
        "Promote a pawn."
    ],

    [
        "queenCapture",
        "Queen Capture",
        "Capture a queen."
    ],

    [
        "rookCapture",
        "Rook Capture",
        "Capture a rook."
    ],

    [
        "knightCapture",
        "Knight Capture",
        "Capture a knight."
    ],

    [
        "bishopCapture",
        "Bishop Capture",
        "Capture a bishop."
    ],

    [
        "pawnCapture",
        "Pawn Capture",
        "Capture a pawn."
    ],

    [
        "profile",
        "Profile",
        "Edit your profile."
    ],

    [
        "settings",
        "Settings",
        "Change a setting."
    ],

    [
        "language",
        "Languages",
        "Switch language."
    ],

    [
        "community",
        "Community",
        "Publish a community post."
    ],

    [
        "puzzle",
        "Puzzle",
        "Solve a puzzle."
    ],

    [
        "lesson",
        "Learn",
        "Complete a lesson."
    ],

    [
        "solo",
        "Solo Chess",
        "Play solo chess."
    ],

    [
        "sealParty",
        "Seal Party",
        "Open Seal Party."
    ],

    [
        "account",
        "Account",
        "Create or save your local account."
    ],

    [
        "placement",
        "Placement",
        "Answer the placement test."
    ]
];


function unlock(id){

    if(!id) return;


    if(!profile.advancements[id]){

        profile.advancements[id] = {
            unlocked:true,
            date:Date.now()
        };


        saveProfile();
    }
}


function renderAchievements(){

    const grid =
        $("achievementGrid");

    if(!grid) return;

    grid.innerHTML =
        "";


    const unlocked =
        ADVANCEMENTS.filter(
            a =>
                profile.advancements[a[0]]
        ).length;


    const header =
        document.createElement(
            "div"
        );


    header.className =
        "achievementHeader";


    header.innerHTML = `
        <h2>🏆 Achievement Progress</h2>
        <p>
            ${unlocked} / ${ADVANCEMENTS.length}
            unlocked
        </p>
    `;


    grid.appendChild(
        header
    );


    const box =
        document.createElement(
            "div"
        );


    box.className =
        "achievementBox";


    ADVANCEMENTS.forEach(
        ([id,name,description]) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "achievementItem " +
                (
                    profile.advancements[id]
                        ? "unlocked"
                        : "locked"
                );


            item.innerHTML = `
                <div class="achievementIcon">
                    ${profile.advancements[id]
                        ? "🏆"
                        : "🔒"}
                </div>

                <div>
                    <strong>
                        ${escapeHtml(name)}
                    </strong>

                    <p>
                        ${escapeHtml(description)}
                    </p>
                </div>
            `;


            box.appendChild(
                item
            );
        }
    );


    grid.appendChild(
        box
    );
}


function openAchievements(){

    showPage(
        "achievementsPage"
    );

    renderAchievements();
}


function openAdvancements(){

    showPage(
        "advancementsPage"
    );

    renderAdvancementProgress();
}


function renderAdvancementProgress(){

    const el =
        $("advancementProgress");

    if(!el) return;


    const unlocked =
        ADVANCEMENTS.filter(
            a =>
                profile.advancements[a[0]]
        ).length;


    const percent =
        Math.round(
            unlocked /
            ADVANCEMENTS.length *
            100
        );


    el.innerHTML = `
        <h2>${unlocked}/${ADVANCEMENTS.length}</h2>
        <p>${percent}% complete</p>

        <div class="achievementBox">
            <p>
                Keep playing, learning,
                solving puzzles and exploring
                Chess Club!
            </p>
        </div>
    `;
}


function checkAdvancements(){

    if(profile.games >= 1){
        unlock("firstGame");
    }

    if(profile.wins >= 1){
        unlock("firstWin");
    }

    if(profile.moves >= 10){
        unlock("moves10");
    }

    if(profile.wins >= 3){
        unlock("wins3");
    }

    if(profile.wins >= 10){
        unlock("wins10");
    }

    if(profile.games >= 5){
        unlock("games5");
    }

    if(profile.games >= 10){
        unlock("games10");
    }

    if(profile.streak >= 3){
        unlock("streak3");
    }


    saveProfile();

    renderAchievements();
}


function checkGeneralHux(){

    const allNormalBotsWon =
        BOTS.every(
            bot =>
                profile.botWins.includes(
                    bot.name
                )
        );


    if(allNormalBotsWon){

        profile.flags.generalHuxUnlocked =
            true;

        saveProfile();
    }
}


/* =========================================================
   LEARN
========================================================= */

const LESSONS = {

    pawn:{
        title:"Pawn",

        steps:[
            [
                "How it moves",
                "A pawn normally moves forward one square."
            ],

            [
                "First move",
                "From its starting square, a pawn may move two squares."
            ],

            [
                "Capture",
                "A pawn captures one square diagonally forward."
            ]
        ]
    },

    knight:{
        title:"Knight",

        steps:[
            [
                "The L shape",
                "A knight moves two squares in one direction and one perpendicular."
            ],

            [
                "Jumping",
                "Knights can jump over pieces."
            ],

            [
                "Forks",
                "A knight can attack multiple pieces at once."
            ]
        ]
    },

    bishop:{
        title:"Bishop",

        steps:[
            [
                "Diagonal movement",
                "Bishops move diagonally."
            ],

            [
                "Long range",
                "A bishop can travel many squares if the path is clear."
            ]
        ]
    },

    rook:{
        title:"Rook",

        steps:[
            [
                "Straight lines",
                "Rooks move horizontally and vertically."
            ],

            [
                "Open files",
                "Rooks become powerful on open files."
            ]
        ]
    },

    queen:{
        title:"Queen",

        steps:[
            [
                "Powerful piece",
                "The queen combines rook and bishop movement."
            ],

            [
                "Safety",
                "Do not move your queen unnecessarily early."
            ]
        ]
    },

    king:{
        title:"King",

        steps:[
            [
                "One square",
                "The king normally moves one square."
            ],

            [
                "Safety",
                "The king may never move into check."
            ]
        ]
    },

    promotion:{
        title:"Promotion",

        steps:[
            [
                "Reach the end",
                "A pawn reaching the final rank can promote."
            ],

            [
                "Choose a piece",
                "A pawn can become a queen, rook, bishop or knight."
            ]
        ]
    },

    opening:{
        title:"Opening",

        steps:[
            [
                "Develop",
                "Bring your pieces into the game."
            ],

            [
                "Control the center",
                "Central squares are important."
            ],

            [
                "Castle",
                "Try to keep your king safe."
            ]
        ]
    },

    middlegame:{
        title:"Middlegame",

        steps:[
            [
                "Plans",
                "Create a plan instead of making random moves."
            ],

            [
                "Tactics",
                "Look for forks, pins and discovered attacks."
            ]
        ]
    },

    endgame:{
        title:"Endgame",

        steps:[
            [
                "Activate the king",
                "The king becomes stronger in the endgame."
            ],

            [
                "Promote pawns",
                "Passed pawns can become decisive."
            ]
        ]
    },

    tactics:{
        title:"Tactics",

        steps:[
            [
                "Look for forcing moves",
                "Checks, captures and threats deserve attention."
            ],

            [
                "Calculate",
                "Calculate the opponent's reply before moving."
            ]
        ]
    },

    strategy:{
        title:"Strategy",

        steps:[
            [
                "Improve pieces",
                "Try to make your pieces more active."
            ],

            [
                "Weaknesses",
                "Attack weaknesses in the opponent's position."
            ]
        ]
    },

    checkmate:{
        title:"Check & Checkmate",

        steps:[
            [
                "Check",
                "A king is in check when attacked."
            ],

            [
                "Checkmate",
                "Checkmate means the king is in check and has no legal escape."
            ]
        ]
    },

    castling:{
        title:"Castling",

        steps:[
            [
                "King and rook",
                "Castling moves the king two squares and the rook beside it."
            ],

            [
                "Restrictions",
                "You cannot castle through check."
            ]
        ]
    },

    enpassant:{
        title:"En Passant",

        steps:[
            [
                "Special pawn capture",
                "A pawn can sometimes capture a pawn that just moved two squares."
            ],

            [
                "Timing",
                "The opportunity exists only immediately after that double move."
            ]
        ]
    }
};

let currentLesson =
    null;

let currentLessonStep =
    0;


function openLearn(){

    showPage(
        "learnPage"
    );

    profile.lessons =
        Number(
            profile.lessons
        ) || 0;

    renderLearnLessons();
}


function renderLearnLessons(){

    const list =
        $("lessonList");

    if(!list) return;

    list.innerHTML =
        "";


    Object.entries(
        LESSONS
    ).forEach(
        ([key,lesson]) => {

            const button =
                document.createElement(
                    "button"
                );


            button.textContent =
                lesson.title;


            button.onclick =
                () =>
                    startLesson(
                        key
                    );


            list.appendChild(
                button
            );
        }
    );
}


function startLesson(key){

    if(!LESSONS[key]){
        return;
    }


    currentLesson =
        key;

    currentLessonStep =
        0;


    const popup =
        $("learnPopup");


    if(popup){

        popup.style.display =
            "flex";
    }


    renderLessonStep();

    unlock("lesson");
}


function renderLessonStep(){

    if(!currentLesson){
        return;
    }


    const lesson =
        LESSONS[
            currentLesson
        ];


    const step =
        lesson.steps[
            currentLessonStep
        ];


    const title =
        $("learnTitle");

    const stepEl =
        $("learnStep");

    const text =
        $("learnText");

    const example =
        $("learnExample");


    if(title){

        title.textContent =
            lesson.title;
    }


    if(stepEl){

        stepEl.textContent =
            `Step ${currentLessonStep + 1} / ${lesson.steps.length} — ${step[0]}`;
    }


    if(text){

        text.textContent =
            step[1];
    }


    if(example){

        example.textContent =
            "♟ Practice the idea on the chessboard.";
    }
}


function nextLessonStep(){

    if(!currentLesson){
        return;
    }


    const lesson =
        LESSONS[
            currentLesson
        ];


    if(
        currentLessonStep <
        lesson.steps.length - 1
    ){

        currentLessonStep++;

        renderLessonStep();

    }else{

        profile.lessons++;

        unlock("lesson");

        saveProfile();

        closeLesson();
    }
}


function previousLessonStep(){

    if(
        currentLessonStep > 0
    ){

        currentLessonStep--;

        renderLessonStep();
    }
}


function closeLesson(){

    const popup =
        $("learnPopup");


    if(popup){

        popup.style.display =
            "none";
    }


    currentLesson =
        null;
}


function openLesson(key){
    startLesson(key);
}


function updateLessonLanguage(){
    renderLearnLessons();
}


/* =========================================================
   PUZZLES
========================================================= */

const PUZZLES = [
    {
        name:"Mate in One — Right Corner",
        board:[
            [null,null,null,null,null,null,null,"bk"],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,"wk","wq",null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null]
        ],
        turn:"w",
        goal:"mate"
    },
    {
        name:"Mate in One — Left Corner",
        board:[
            ["bk",null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,"wq","wk",null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null]
        ],
        turn:"w",
        goal:"mate"
    },
    {
        name:"Mate in One — Bottom Corner",
        board:[
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,"wq","wk",null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            ["bk",null,null,null,null,null,null,null]
        ],
        turn:"w",
        goal:"mate"
    },
    {
        name:"Mate in One — Top Corner",
        board:[
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,"wk","wq",null],
            [null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,"bk"]
        ],
        turn:"w",
        goal:"mate"
    }
];


let currentPuzzleIndex =
    0;

let puzzleBoardState =
    null;

let puzzleTurn =
    "w";

let puzzleSolved =
    false;

let puzzleSelected =
    null;

let puzzleTargets =
    [];


function openPuzzles(){

    showPage(
        "puzzlesPage"
    );

    loadPuzzle(
        currentPuzzleIndex
    );
}


function loadPuzzle(index){

    currentPuzzleIndex =
        Math.max(
            0,
            Math.min(
                PUZZLES.length - 1,
                index
            )
        );


    const puzzle =
        PUZZLES[
            currentPuzzleIndex
        ];


    puzzleBoardState =
        puzzle.board.map(
            row =>
                row.map(
                    p =>
                        p || null
                )
        );


    puzzleTurn =
        puzzle.turn;

    puzzleSolved =
        false;
    const puzzleBoardEl = $("puzzleBoard");
    if (puzzleBoardEl) puzzleBoardEl.classList.remove("puzzle-solved");

    puzzleSelected =
        null;

    puzzleTargets =
        [];


    const title =
        $("puzzleTitle");

    const message =
        $("puzzleMessage");


    if(title){

        title.textContent =
            puzzle.name;
    }


    if(message){

        message.textContent =
            "Find the best move.";
    }


    renderPuzzleBoard();
}


function renderPuzzleBoard(){

    const el =
        $("puzzleBoard");

    if(
        !el ||
        !puzzleBoardState
    ){

        return;
    }


    el.innerHTML =
        "";


    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement(
                    "div"
                );


            square.className =
                "chessSquare " +
                (
                    (r+c)%2 === 0
                        ? "light"
                        : "dark"
                );


            if(
                puzzleSelected &&
                puzzleSelected.r === r &&
                puzzleSelected.c === c
            ){

                square.classList.add(
                    "selected"
                );
            }


            const target =
                puzzleTargets.find(
                    m =>
                        m.toR === r &&
                        m.toC === c
                );


            if(target){

                if(
                    puzzleBoardState[r][c]
                ){

                    const dot =
                        document.createElement(
                            "div"
                        );

                    dot.className =
                        "captureDot";

                    square.appendChild(
                        dot
                    );

                }else{

                    const dot =
                        document.createElement(
                            "div"
                        );

                    dot.className =
                        "legalDot";

                    square.appendChild(
                        dot
                    );
                }
            }


            const piece =
                puzzleBoardState[r][c];


            if(piece){

                const pieceEl =
                    document.createElement(
                        "div"
                    );


                pieceEl.className =
                    "chessPiece " +
                    (
                        pieceColor(piece) === "w"
                            ? "whitePiece"
                            : "blackPiece"
                    );


                pieceEl.textContent =
                    PIECES[
                        pieceColor(piece)
                    ][
                        pieceType(piece)
                    ];


                square.appendChild(
                    pieceEl
                );
            }


            square.addEventListener(
                "click",
                () =>
                    handlePuzzleClick(
                        r,
                        c
                    )
            );


            el.appendChild(
                square
            );
        }
    }
}


function handlePuzzleClick(r,c){

    if(puzzleSolved){
        return;
    }


    const piece =
        puzzleBoardState[r][c];


    if(puzzleSelected){

        const move =
            puzzleTargets.find(
                m =>
                    m.toR === r &&
                    m.toC === c
            );


        if(move){

            puzzleMakeMove(
                move
            );

            return;
        }
    }


    if(
        piece &&
        pieceColor(piece) ===
            puzzleTurn
    ){

        const oldTurn =
            turn;

        turn =
            puzzleTurn;


        puzzleSelected =
            {r,c};


        puzzleTargets =
            legalMovesFrom(
                puzzleBoardState,
                r,
                c
            );


        turn =
            oldTurn;


        renderPuzzleBoard();

        return;
    }


    puzzleSelected =
        null;

    puzzleTargets =
        [];


    renderPuzzleBoard();
}


function puzzleMakeMove(move){

    const oldTurn =
        turn;

    turn =
        puzzleTurn;


    const movingPiece =
        puzzleBoardState[
            move.fromR
        ][
            move.fromC
        ];


    const captured =
        puzzleBoardState[
            move.toR
        ][
            move.toC
        ];


    puzzleBoardState =
        applyMoveToBoard(
            puzzleBoardState,
            move
        );


    turn =
        oldTurn;


    puzzleSelected =
        null;

    puzzleTargets =
        [];


    const puzzle =
        PUZZLES[
            currentPuzzleIndex
        ];


    const previousTurn = turn;
    turn = opponent(puzzleTurn);
    const replies = allLegalMoves(puzzleBoardState, turn);
    const isMate = replies.length === 0 && isInCheck(puzzleBoardState, turn);
    turn = previousTurn;

    const message = $("puzzleMessage");
    if (isMate) {
        puzzleSolved = true;
        profile.puzzles++;
        profile.puzzleWins++;
        profile.puzzleRating += 15;
        unlock("puzzle");
        saveProfile();
        if (message) message.textContent = "🏆 Checkmate! Puzzle solved! +15 puzzle rating.";
        const boardEl = $("puzzleBoard");
        if (boardEl) boardEl.classList.add("puzzle-solved");
    } else {
        if (message) message.textContent = "Not mate yet — try again!";
        window.setTimeout(() => loadPuzzle(currentPuzzleIndex), 750);
    }


    renderPuzzleBoard();
}


function retryPuzzle(){

    loadPuzzle(
        currentPuzzleIndex
    );
}


function usePuzzleHint(){

    const message =
        $("puzzleMessage");


    if(message){

        message.textContent =
            "💡 Look for checks first.";
    }
}


function openDailyPuzzle(){

    currentPuzzleIndex =
        0;

    openPuzzles();
}


function openRatedPuzzles(){

    alert(
        "Rated puzzles use your local puzzle rating: " +
        profile.puzzleRating
    );
}


function openPuzzleStreak(){

    alert(
        `Puzzle streak: ${profile.puzzleWins}`
    );
}


function openPuzzleHistory(){

    alert(
        `Puzzles solved: ${profile.puzzleWins}`
    );
}


function openPuzzleThemes(){

    alert(
        "Available themes: Checkmate, Tactics, Openings"
    );
}


/* =========================================================
   COMMUNITY
========================================================= */

let communityPosts =
    loadCommunityPosts();


function loadCommunityPosts(){

    try{

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "chessClubCommunityPosts"
                ) || "[]"
            );


        return Array.isArray(saved)
            ? saved
            : [];

    }catch(e){

        return [];
    }
}


function saveCommunityPosts(){

    try{

        localStorage.setItem(
            "chessClubCommunityPosts",
            JSON.stringify(
                communityPosts
            )
        );

    }catch(e){}
}


function openCommunity(){

    showPage(
        "communityPage"
    );

    renderCommunityPosts();
}


function publishCommunityPost(){

    const input =
        $("communityPost");

    if(!input) return;


    const text =
        input.value.trim();


    if(!text){

        alert(
            "Write something first."
        );

        return;
    }


    const post = {

        id:
            Date.now() +
            Math.random(),

        username:
            profile.username,

        avatar:
            profile.avatar,

        text:
            text.slice(
                0,
                500
            ),

        time:
            Date.now()
    };


    communityPosts.unshift(
        post
    );


    saveCommunityPosts();

    profile.communityPosts++;

    saveProfile();

    input.value =
        "";


    renderCommunityPosts();

    unlock(
        "community"
    );
}


function renderCommunityPosts(){

    const page =
        $("communityPage");

    if(!page) return;


    let feed =
        $("communityFeed");


    if(!feed){

        feed =
            document.createElement(
                "div"
            );


        feed.id =
            "communityFeed";


        feed.className =
            "communityFeed";


        const card =
            page.querySelector(
                ".communityCard"
            );


        if(card){

            card.after(
                feed
            );

        }else{

            page.appendChild(
                feed
            );
        }
    }


    feed.innerHTML =
        "";


    if(!communityPosts.length){

        feed.innerHTML = `
            <div class="communityPost">
                <h3>🌐 Community</h3>
                <p>No posts yet.</p>
                <p>Be the first to post!</p>
            </div>
        `;

        return;
    }


    communityPosts.forEach(
        post => {

            const item =
                document.createElement(
                    "article"
                );


            item.className =
                "communityPost";


            const date =
                new Date(
                    post.time
                );


            item.innerHTML = `
                <div class="communityPostHeader">
                    <span class="communityAvatar">
                        ${escapeHtml(post.avatar)}
                    </span>

                    <strong>
                        ${escapeHtml(post.username)}
                    </strong>
                </div>

                <p>
                    ${escapeHtml(post.text)}
                </p>

                <small>
                    ${date.toLocaleString()}
                </small>
            `;


            feed.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   FRIENDS
========================================================= */

function openFriends(){

    showPage(
        "friendsPage"
    );
}


function addFriend(){

    const name =
        prompt(
            "Enter your friend's username:"
        );


    if(
        name &&
        name.trim()
    ){

        profile.friends.push(
            name.trim()
        );


        profile.friends =
            [
                ...new Set(
                    profile.friends
                )
            ];


        saveProfile();


        alert(
            `${name.trim()} added locally.`
        );
    }
}


function openFriendRequests(){

    alert(
        "No pending friend requests."
    );
}


function openFriendChat(){

    alert(
        "Friend chat is currently local/demo mode."
    );
}


function playWithFriend(){

    profile.friendGames++;

    saveProfile();

    startSoloChess();
}


function openFriendList(){

    if(!profile.friends.length){

        alert(
            "You have no saved friends yet."
        );

        return;
    }


    alert(
        "Friends:\n\n" +
        profile.friends.join("\n")
    );
}


/* =========================================================
   ONLINE / SUPABASE
========================================================= */

/*
   IMPORTANT:
   An empty key is safe for the JavaScript parser.
   Online mode will simply remain unavailable until a valid
   Supabase publishable/anon key exists.
*/
const SUPABASE_URL =
    "https://rrpiqgofokdnsbtpqonb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "";


let supabaseClient =
    null;

let onlineUserId =
    null;

let onlineGameId =
    null;

let onlineColor =
    null;

let onlineChannel =
    null;

let onlineMatchmaking =
    false;

let onlineReady =
    false;

let onlineLastUpdated =
    null;

let onlineOpponentName =
    "Opponent";

let onlineOpponentElo =
    3400;


/* =========================================================
   COMBINED PLAYER DISPLAY
========================================================= */

function updatePlayers(){

    /*
       ONLINE GAME
    */

    if(
        onlineGameId &&
        onlineColor
    ){

        const playerName =
            profile &&
            profile.username
                ? profile.username
                : "Player";


        const playerElo =
            profile &&
            Number.isFinite(
                Number(
                    profile.elo
                )
            )
                ? Math.max(
                    3400,
                    Number(
                        profile.elo
                    )
                )
                : 3400;


        if(
            $("whitePlayerName")
        ){

            $("whitePlayerName").textContent =
                onlineColor === "w"
                    ? playerName
                    : onlineOpponentName;
        }


        if(
            $("whitePlayerElo")
        ){

            $("whitePlayerElo").textContent =
                (
                    onlineColor === "w"
                        ? playerElo
                        : onlineOpponentElo
                ) +
                " Elo";
        }


        if(
            $("blackPlayerName")
        ){

            $("blackPlayerName").textContent =
                onlineColor === "b"
                    ? playerName
                    : onlineOpponentName;
        }


        if(
            $("blackPlayerElo")
        ){

            $("blackPlayerElo").textContent =
                (
                    onlineColor === "b"
                        ? playerElo
                        : onlineOpponentElo
                ) +
                " Elo";
        }


        return;
    }


    /*
       LOCAL / BOT GAME
    */

    const whiteName =
        $("gameWhiteName");

    const whiteElo =
        $("gameWhiteElo");

    const blackName =
        $("gameBlackName");

    const blackElo =
        $("gameBlackElo");


    if(whiteName){

        whiteName.textContent =
            profile.username;
    }


    if(whiteElo){

        whiteElo.textContent =
            `${profile.elo} Elo`;
    }


    if(
        playingBot &&
        currentBot
    ){

        if(blackName){

            blackName.textContent =
                currentBot.name;
        }


        if(blackElo){

            blackElo.textContent =
                `${currentBot.elo} Elo`;
        }

    }else{

        if(blackName){

            blackName.textContent =
                "Player 2";
        }


        if(blackElo){

            blackElo.textContent =
                `${profile.elo} Elo`;
        }
    }
}


/* =========================================================
   INITIALIZE SUPABASE
========================================================= */

async function initializeOnline(){

    try{

        if(
            typeof supabase === "undefined" ||
            !supabase.createClient
        ){

            console.error(
                "Supabase library was not loaded."
            );

            onlineReady =
                false;

            return;
        }


        if(
            !SUPABASE_PUBLISHABLE_KEY
        ){

            console.warn(
                "Supabase publishable key is empty. Online mode is disabled."
            );

            onlineReady =
                false;

            return;
        }


        supabaseClient =
            supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );


        const sessionResult =
            await supabaseClient.auth.getSession();


        let session =
            sessionResult.data &&
            sessionResult.data.session;


        if(!session){

            if(
                !supabaseClient.auth.signInAnonymously
            ){

                console.warn(
                    "Anonymous Supabase login is unavailable."
                );

                onlineReady =
                    false;

                return;
            }


            const signInResult =
                await supabaseClient
                    .auth
                    .signInAnonymously();


            if(signInResult.error){

                console.error(
                    "Anonymous sign-in failed:",
                    signInResult.error
                );

                onlineReady =
                    false;

                return;
            }


            session =
                signInResult.data.session;
        }


        if(
            session &&
            session.user
        ){

            onlineUserId =
                session.user.id;

            onlineReady =
                true;


            console.log(
                "Chess Club Online ready:",
                onlineUserId
            );
        }

    }catch(error){

        console.error(
            "Online initialization failed:",
            error
        );

        onlineReady =
            false;
    }
}


/* =========================================================
   OPEN ONLINE PAGE
========================================================= */

function openOnline(){

    showPage(
        "onlinePage"
    );

    updateAllProfileDisplays();


    const username =
        profile &&
        profile.username
            ? profile.username
            : "Player";


    const elo =
        profile &&
        Number.isFinite(
            Number(profile.elo)
        )
            ? Math.max(
                3400,
                Number(profile.elo)
            )
            : 3400;


    const usernameElement =
        $("onlineUsername");

    const statsElement =
        $("onlineStats");


    if(usernameElement){

        usernameElement.textContent =
            username;
    }


    if(statsElement){

        statsElement.textContent =
            `${elo} Elo`;
    }


    showOnlineStatus(
        onlineReady
            ? "🟢 Online system ready"
            : "🟡 Connecting to Online..."
    );


    if(!onlineReady){

        initializeOnline()
            .then(
                () => {

                    if(onlineReady){

                        showOnlineStatus(
                            "🟢 Online system ready"
                        );

                    }else{

                        showOnlineStatus(
                            "🔴 Online is unavailable"
                        );
                    }
                }
            );
    }
}


/* =========================================================
   ONLINE STATUS
========================================================= */

function showOnlineStatus(message){

    const status =
        $("onlineStatus");

    if(status){

        status.textContent =
            message;
    }
}


/* =========================================================
   ROOM CODE
========================================================= */

function createRoomCode(){

    return (
        Math.random()
            .toString(36)
            .substring(2,8)
            .toUpperCase()
    );
}


/* =========================================================
   START MATCHMAKING
========================================================= */

async function startMatchmaking(){

    if(onlineMatchmaking){
        return;
    }


    if(!onlineReady){

        await initializeOnline();
    }


    if(!onlineReady){

        showOnlineStatus(
            "🔴 Online is not connected."
        );

        return;
    }


    if(onlineGameId){

        showOnlineStatus(
            "⚠️ You are already in an online game."
        );

        return;
    }


    onlineMatchmaking =
        true;


    showOnlineStatus(
        "🔎 Looking for an opponent..."
    );


    try{

        const playerName =
            profile &&
            profile.username
                ? profile.username
                : "Player";


        const playerElo =
            profile &&
            Number.isFinite(
                Number(profile.elo)
            )
                ? Math.max(
                    3400,
                    Number(profile.elo)
                )
                : 3400;


        const searchResult =
            await supabaseClient
                .from("chess_games")
                .select("*")
                .eq(
                    "status",
                    "waiting"
                )
                .is(
                    "black_player_id",
                    null
                )
                .neq(
                    "white_player_id",
                    onlineUserId
                )
                .order(
                    "created_at",
                    {
                        ascending:true
                    }
                )
                .limit(1);


        if(searchResult.error){

            throw searchResult.error;
        }


        const waitingGame =
            searchResult.data &&
            searchResult.data.length
                ? searchResult.data[0]
                : null;


        if(waitingGame){

            const joinResult =
                await supabaseClient
                    .from("chess_games")
                    .update({

                        black_player_id:
                            onlineUserId,

                        black_name:
                            playerName,

                        black_elo:
                            playerElo,

                        status:
                            "playing",

                        updated_at:
                            new Date()
                                .toISOString()

                    })
                    .eq(
                        "id",
                        waitingGame.id
                    )
                    .eq(
                        "status",
                        "waiting"
                    )
                    .is(
                        "black_player_id",
                        null
                    )
                    .select()
                    .single();


            if(
                joinResult.error ||
                !joinResult.data
            ){

                onlineMatchmaking =
                    false;


                await new Promise(
                    resolve =>
                        setTimeout(
                            resolve,
                            300
                        )
                );


                return startMatchmaking();
            }


            await joinOnlineGame(
                joinResult.data,
                "b"
            );

            return;
        }


        const initialBoard =
            cloneBoard(
                START_BOARD
            );


        const insertResult =
            await supabaseClient
                .from("chess_games")
                .insert({

                    room_code:
                        createRoomCode(),

                    status:
                        "waiting",

                    white_player_id:
                        onlineUserId,

                    black_player_id:
                        null,

                    white_name:
                        playerName,

                    black_name:
                        null,

                    white_elo:
                        playerElo,

                    black_elo:
                        null,

                    board:
                        initialBoard,

                    turn:
                        "w",

                    castling_rights:{
                        wK:true,
                        wQ:true,
                        bK:true,
                        bQ:true
                    },

                    en_passant_target:
                        null,

                    winner:
                        null,

                    result_reason:
                        null,

                    last_move:
                        null

                })
                .select()
                .single();


        if(insertResult.error){

            throw insertResult.error;
        }


        await joinOnlineGame(
            insertResult.data,
            "w"
        );


        showOnlineStatus(
            "⏳ Waiting for an opponent..."
        );


    }catch(error){

        console.error(
            "Matchmaking error:",
            error
        );


        onlineMatchmaking =
            false;


        showOnlineStatus(
            "🔴 Matchmaking failed."
        );


        alert(
            "Chess Club Online could not start.\n\n" +
            (
                error &&
                error.message
                    ? error.message
                    : "Unknown error."
            )
        );
    }
}


/* =========================================================
   JOIN ONLINE GAME
========================================================= */

async function joinOnlineGame(
    game,
    color
){

    onlineGameId =
        game.id;


    onlineColor =
        color;


    onlineMatchmaking =
        false;


    onlineOpponentName =
        color === "w"
            ? (
                game.black_name ||
                "Opponent"
            )
            : (
                game.white_name ||
                "Opponent"
            );


    onlineOpponentElo =
        color === "w"
            ? Math.max(
                3400,
                Number(
                    game.black_elo ||
                    3400
                )
            )
            : Math.max(
                3400,
                Number(
                    game.white_elo ||
                    3400
                )
            );


    board =
        cloneBoard(
            game.board ||
            START_BOARD
        );


    turn =
        game.turn ||
        "w";


    castlingRights =
        structuredCloneSafe(
            game.castling_rights ||
            {
                wK:true,
                wQ:true,
                bK:true,
                bQ:true
            }
        );


    enPassantTarget =
        game.en_passant_target
            ? {
                ...game.en_passant_target
            }
            : null;


    selectedSquare =
        null;

    legalTargets =
        [];


    capturedWhite =
        [];

    capturedBlack =
        [];


    moveHistory =
        [];

    positionHistory =
        [];


    gameOver =
        game.status ===
        "finished";


    playingBot =
        false;

    currentBot =
        null;

    soloChess =
        false;


    renderBoard();

    updatePlayers();

    updateGameStatus();

    updateMoveList();

    updateCaptured();


    showPage(
        "game"
    );


    await subscribeToOnlineGame();


    if(
        game.status ===
        "waiting"
    ){

        showOnlineStatus(
            "⏳ Waiting for an opponent..."
        );


        const status =
            $("gameStatus");


        if(status){

            status.textContent =
                "⏳ Waiting for an opponent...";
        }

    }else{

        showOnlineStatus(
            "🟢 Online game started!"
        );

        updateGameStatus();
    }
}


/* =========================================================
   REALTIME SUBSCRIPTION
========================================================= */

async function subscribeToOnlineGame(){

    if(!supabaseClient){
        return;
    }


    if(onlineChannel){

        try{

            await supabaseClient
                .removeChannel(
                    onlineChannel
                );

        }catch(error){

            console.warn(
                "Could not remove old channel:",
                error
            );
        }


        onlineChannel =
            null;
    }


    onlineChannel =
        supabaseClient
            .channel(
                "chess-game-" +
                onlineGameId
            )
            .on(
                "postgres_changes",
                {
                    event:"UPDATE",
                    schema:"public",
                    table:"chess_games",
                    filter:
                        "id=eq." +
                        onlineGameId
                },
                payload => {

                    handleOnlineGameUpdate(
                        payload.new
                    );
                }
            )
            .subscribe(
                status => {

                    console.log(
                        "Online Realtime:",
                        status
                    );
                }
            );
}


/* =========================================================
   HANDLE ONLINE GAME UPDATE
========================================================= */

function handleOnlineGameUpdate(game){

    if(
        !game ||
        game.id !== onlineGameId
    ){

        return;
    }


    onlineLastUpdated =
        game.updated_at ||
        null;


    if(
        onlineColor === "w"
    ){

        onlineOpponentName =
            game.black_name ||
            "Opponent";

        onlineOpponentElo =
            Math.max(
                3400,
                Number(
                    game.black_elo ||
                    3400
                )
            );

    }else{

        onlineOpponentName =
            game.white_name ||
            "Opponent";

        onlineOpponentElo =
            Math.max(
                3400,
                Number(
                    game.white_elo ||
                    3400
                )
            );
    }


    updatePlayers();


    if(game.board){

        board =
            cloneBoard(
                game.board
            );
    }


    turn =
        game.turn ||
        "w";


    castlingRights =
        structuredCloneSafe(
            game.castling_rights ||
            castlingRights
        );


    enPassantTarget =
        game.en_passant_target
            ? {
                ...game.en_passant_target
            }
            : null;


    renderBoard();

    updateMoveList();

    updateCaptured();

    updateGameStatus();


    if(
        game.status === "finished" &&
        !gameOver
    ){

        gameOver =
            true;


        handleOnlineResult(
            game
        );

        return;
    }


    if(
        game.status === "playing"
    ){

        onlineMatchmaking =
            false;


        showOnlineStatus(
            "🟢 Opponent connected!"
        );


        updateGameStatus();
    }
}


/* =========================================================
   SEND ONLINE MOVE
========================================================= */

async function sendOnlineMove(
    move,
    state
){

    if(
        !onlineGameId ||
        !onlineColor ||
        !supabaseClient
    ){

        return;
    }


    const movingColor =
        onlineColor;


    const nextTurn =
        state.turn;


    let winner =
        null;

    let resultReason =
        null;

    let status =
        "playing";


    const opponentMoves =
        allLegalMoves(
            state.board,
            nextTurn
        );


    if(
        opponentMoves.length === 0
    ){

        const opponentInCheck =
            isKingInCheck(
                state.board,
                nextTurn
            );


        status =
            "finished";


        if(opponentInCheck){

            winner =
                movingColor;

            resultReason =
                "checkmate";

        }else{

            winner =
                "draw";

            resultReason =
                "stalemate";
        }
    }


    try{

        const updateResult =
            await supabaseClient
                .from("chess_games")
                .update({

                    board:
                        state.board,

                    turn:
                        nextTurn,

                    castling_rights:
                        state.castlingRights,

                    en_passant_target:
                        state.enPassantTarget,

                    last_move:
                        move,

                    status:
                        status,

                    winner:
                        winner,

                    result_reason:
                        resultReason,

                    updated_at:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "id",
                    onlineGameId
                );


        if(updateResult.error){

            console.error(
                "Move synchronization failed:",
                updateResult.error
            );


            showOnlineStatus(
                "🔴 Move failed to sync."
            );
        }

    }catch(error){

        console.error(
            "Online move error:",
            error
        );
    }
}


/* =========================================================
   HANDLE ONLINE RESULT
========================================================= */

function handleOnlineResult(game){

    if(!game){
        return;
    }


    const winner =
        game.winner;


    const reason =
        game.result_reason ||
        "game over";


    let playerWon =
        false;


    if(winner === "draw"){

        playerWon =
            false;

    }else if(
        winner === onlineColor
    ){

        playerWon =
            true;
    }


    const resultKey =
        "chessClubOnlineResult_" +
        game.id;


    if(
        localStorage.getItem(
            resultKey
        ) !== "done"
    ){

        localStorage.setItem(
            resultKey,
            "done"
        );


        profile.games =
            Number(
                profile.games || 0
            ) + 1;


        if(winner === "draw"){

            profile.streak =
                0;

        }else if(playerWon){

            profile.wins =
                Number(
                    profile.wins || 0
                ) + 1;


            profile.streak =
                Number(
                    profile.streak || 0
                ) + 1;


            profile.bestStreak =
                Math.max(
                    Number(
                        profile.bestStreak || 0
                    ),
                    Number(
                        profile.streak || 0
                    )
                );


            profile.elo =
                Number(
                    profile.elo || 3400
                ) + 8;


            profile.elo =
                Math.max(
                    3400,
                    profile.elo
                );

        }else{

            profile.losses =
                Number(
                    profile.losses || 0
                ) + 1;


            profile.streak =
                0;


            profile.elo =
                Math.max(
                    3400,
                    Number(
                        profile.elo || 3400
                    ) - 5
                );
        }


        profile.blitz =
            Math.max(
                3400,
                Number(
                    profile.blitz || 3400
                )
            );


        profile.rapid =
            Math.max(
                3400,
                Number(
                    profile.rapid || 3400
                )
            );


        profile.daily =
            Math.max(
                3400,
                Number(
                    profile.daily || 3400
                )
            );


        saveProfile();

        checkAdvancements();
    }


    gameOver =
        true;


    let title =
        "DRAW";


    if(
        winner !== "draw"
    ){

        title =
            playerWon
                ? "YOU WIN!"
                : "YOU LOSE";
    }


    let reasonText =
        reason;


    if(
        reason === "checkmate"
    ){

        reasonText =
            "Checkmate!";
    }


    if(
        reason === "stalemate"
    ){

        reasonText =
            "Stalemate — draw.";
    }


    showOnlineStatus(
        playerWon
            ? "🏆 You won!"
            : winner === "draw"
                ? "🤝 Draw"
                : "❌ You lost"
    );


    const previousBot =
        currentBot;


    currentBot = {

        name:
            onlineOpponentName,

        elo:
            onlineOpponentElo
    };


    showResult(
        title,
        reasonText
    );


    currentBot =
        previousBot;


    updateAllProfileDisplays();

    updateGameStatus();
}


/* =========================================================
   CANCEL MATCHMAKING
========================================================= */

async function cancelMatchmaking(){

    if(!onlineGameId){

        onlineMatchmaking =
            false;


        showOnlineStatus(
            "Search cancelled."
        );


        return;
    }


    try{

        const result =
            await supabaseClient
                .from("chess_games")
                .update({

                    status:
                        "cancelled",

                    updated_at:
                        new Date()
                            .toISOString()

                })
                .eq(
                    "id",
                    onlineGameId
                )
                .eq(
                    "status",
                    "waiting"
                );


        if(result.error){

            console.error(
                "Cancel error:",
                result.error
            );
        }

    }catch(error){

        console.error(
            "Cancel matchmaking error:",
            error
        );
    }


    await leaveOnlineGame();


    showOnlineStatus(
        "✕ Search cancelled."
    );
}


/* =========================================================
   LEAVE ONLINE GAME
========================================================= */

async function leaveOnlineGame(){

    if(
        onlineChannel &&
        supabaseClient
    ){

        try{

            await supabaseClient
                .removeChannel(
                    onlineChannel
                );

        }catch(error){

            console.warn(
                "Realtime cleanup failed:",
                error
            );
        }
    }


    onlineChannel =
        null;

    onlineGameId =
        null;

    onlineColor =
        null;

    onlineMatchmaking =
        false;

    onlineOpponentName =
        "Opponent";

    onlineOpponentElo =
        3400;

    onlineLastUpdated =
        null;
}


/* =========================================================
   ANALYSIS
========================================================= */

function openAnalysis(){

    profile.analysisOpened++;

    saveProfile();


    alert(
        "Analysis\n\n" +
        "Material evaluation:\n" +
        evaluateBoard(board)
    );
}


/* =========================================================
   TOURNAMENTS
========================================================= */

function openTournaments(){

    showPage(
        "tournamentsPage"
    );
}


function openBlitzTournament(){

    alert(
        "Blitz Tournament — local demo."
    );
}


function openRapidTournament(){

    alert(
        "Rapid Tournament — local demo."
    );
}


function openDailyTournament(){

    alert(
        "Daily Tournament — local demo."
    );
}


function createTournament(){

    alert(
        "Tournament creation is available in demo mode."
    );
}


/* =========================================================
   COLLECTION
========================================================= */

function openCollection(){

    showPage(
        "collectionPage"
    );
}


function openChests(){

    profile.chestOpened++;

    saveProfile();


    alert(
        "🎁 Chest opened!\n\n" +
        "Reward: 🦭 Seal Badge"
    );
}


/* =========================================================
   LIVE
========================================================= */

function openLive(){

    showPage(
        "livePage"
    );


    profile.liveGamesWatched++;

    saveProfile();


    const el =
        $("liveBoards");


    if(el){

        el.innerHTML = `
            <div class="liveBoardPlaceholder">
                📺 Live games will appear here.
            </div>
        `;
    }
}


function openOwnerLivePanel(){

    alert(
        "Owner Live Events panel."
    );
}


/* =========================================================
   PREMIUM
========================================================= */

function openPremium(){

    showPage(
        "premiumPage"
    );
}


function choosePremium(){

    alert(
        "Premium purchase is disabled in this local demo."
    );
}


function chooseVipPremium(){

    alert(
        "VIP Premium purchase is disabled in this local demo."
    );
}


/* =========================================================
   SEAL PARTY
========================================================= */

function sealParty(){

    let overlay =
        document.getElementById(
            "sealPartyOverlay"
        );


    if(!overlay){

        overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "sealPartyOverlay";


        Object.assign(
            overlay.style,
            {
                position:"fixed",
                inset:"0",
                zIndex:"100000",
                display:"flex",
                alignItems:"center",
                justifyContent:"center",
                background:"rgba(0,0,0,.82)",
                padding:"20px",
                pointerEvents:"auto"
            }
        );


        const content =
            document.createElement(
                "div"
            );


        Object.assign(
            content.style,
            {
                textAlign:"center",
                color:"white",
                fontFamily:
                    "Arial, sans-serif"
            }
        );


        const image =
            document.createElement(
                "img"
            );


        image.src =
            "sealParty.png";


        image.alt =
            "Seal Party";


        Object.assign(
            image.style,
            {
                display:"block",
                width:"min(520px, 85vw)",
                maxHeight:"65vh",
                objectFit:"contain",
                margin:"0 auto 20px",
                borderRadius:"15px"
            }
        );


        const title =
            document.createElement(
                "div"
            );


        title.textContent =
            "🦭 SEAL PARTY!";


        Object.assign(
            title.style,
            {
                fontSize:
                    "clamp(35px, 7vw, 70px)",
                fontWeight:"900",
                textShadow:
                    "0 5px 20px rgba(0,0,0,.6)"
            }
        );


        image.onerror =
            function(){

                image.style.display =
                    "none";


                title.textContent =
                    "🦭 SEAL PARTY!";


                const warning =
                    document.createElement(
                        "p"
                    );


                warning.textContent =
                    "Put sealParty.png next to index.html";


                Object.assign(
                    warning.style,
                    {
                        fontSize:"16px",
                        marginTop:"10px",
                        color:"#ffdddd"
                    }
                );


                content.appendChild(
                    warning
                );
            };


        content.appendChild(
            image
        );

        content.appendChild(
            title
        );


        overlay.appendChild(
            content
        );


        document.body.appendChild(
            overlay
        );
    }


    overlay.style.display =
        "flex";

    overlay.style.pointerEvents =
        "auto";


    unlock(
        "sealParty"
    );


    clearTimeout(
        window.sealPartyTimer
    );


    window.sealPartyTimer =
        setTimeout(
            function(){

                closeSealParty();

            },
            6000
        );
}


function closeSealParty(){

    const overlay =
        document.getElementById(
            "sealPartyOverlay"
        );


    if(!overlay){
        return;
    }


    overlay.style.display =
        "none";


    overlay.style.pointerEvents =
        "none";


    clearTimeout(
        window.sealPartyTimer
    );


    window.sealPartyTimer =
        null;
}


/* =========================================================
   TRAINING / COMPATIBILITY
========================================================= */

function openTraining(){

    showPage(
        "menu"
    );

    renderTrainingBoard();
}


/* =========================================================
   PLACEMENT TEST
========================================================= */

let placementLevel =
    null;


function chooseSkillLevel(level){

    placementLevel =
        level;


    const area =
        $("placementQuestionArea");


    if(!area) return;


    area.innerHTML = `
        <h2>${escapeHtml(level.toUpperCase())}</h2>

        <p>
            Which piece can jump over other pieces?
        </p>

        <button onclick="answerPlacement('knight')">
            ♘ Knight
        </button>

        <button onclick="answerPlacement('rook')">
            ♖ Rook
        </button>

        <button onclick="answerPlacement('bishop')">
            ♗ Bishop
        </button>
    `;
}


function answerPlacement(answer){

    const result =
        $("placementResult");


    if(!result){
        return;
    }


    if(
        answer === "knight"
    ){

        result.textContent =
            "Correct! ♘";


        unlock(
            "placement"
        );

    }else{

        result.textContent =
            "Not quite. Try again!";
    }
}


/* =========================================================
   MISC BUTTON COMPATIBILITY
========================================================= */

function openFriendPage(){
    openFriends();
}


function openBot(){
    openBotPage();
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value){

    return String(value)
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeChessClub(){

    document.body.classList.toggle(
        "rtl",
        language === "fa" ||
        language === "ar"
    );


    updateLanguageStatus();

    updateSettingsUI();

    document.body.classList.toggle(
        "noAnimations",
        !animationsEnabled
    );


    updateAllProfileDisplays();

    renderTrainingBoard();

    renderAchievements();

    updateMoveList();

    showPage(
        "menu"
    );


    /*
       Sync V2 after the whole page is ready.
    */
    if(
        typeof window.v2SetLanguage ===
        "function"
    ){

        try{

            window.v2SetLanguage(
                language
            );

        }catch(error){

            console.warn(
                "Could not initialize V2 language:",
                error
            );
        }
    }


    document
        .querySelectorAll(
            "[data-seal-party]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    sealParty
                );
            }
        );


    const sealButton =
        $("sealPartyButton");


    if(sealButton){

        sealButton.addEventListener(
            "click",
            sealParty
        );
    }


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key ===
                "Escape"
            ){

                closeLesson();

                closeResult();

                closeSealParty();

                closeLogin();
            }
        }
    );


    renderTrainingBoard();

    updatePlayers();
}


/* =========================================================
   START
========================================================= */

if(
    document.readyState ===
    "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeChessClub
    );

}else{

    initializeChessClub();
}


/* =========================================================
   END
========================================================= */
/* =========================================================
   CHESS CLUB — FULL TRANSLATOR + V2 POPUP
   ========================================================= */


/* =========================================================
   LANGUAGE DATA
   ========================================================= */

const CHESS_CLUB_LANGUAGES = {

    en: {

        home: "Home",
        play: "Play",
        training: "Training",
        puzzles: "Puzzles",
        learn: "Learn",
        bots: "Bots",
        community: "Community",
        collection: "Collection",
        settings: "Settings",
        rules: "Rules",
        support: "Support",
        login: "Login",
        account: "Account",
        logout: "Logout",

        newGame: "New Game",
        resign: "Resign",
        draw: "Draw",
        restart: "Restart",
        continue: "Continue",
        close: "Close",
        back: "Back",
        save: "Save",

        achievements: "Achievements",
        advancements: "Advancements",

        v2: "Chess Club V2",
        v2Community: "Community",
        v2Merch: "Merch",
        v2Solo: "Solo Chess",
        v2Puzzles: "Puzzles",

        shop: "Shop",
        buy: "Buy",
        price: "Price",

        language: "Language",
        selectLanguage: "Select Language",

        welcome: "Welcome to Chess Club",
        playLikeMaster: "Play Like A Master"

    },


    fa: {

        home: "خانه",
        play: "بازی",
        training: "تمرین",
        puzzles: "پازل‌ها",
        learn: "آموزش",
        bots: "ربات‌ها",
        community: "انجمن",
        collection: "مجموعه",
        settings: "تنظیمات",
        rules: "قوانین",
        support: "پشتیبانی",
        login: "ورود",
        account: "حساب",
        logout: "خروج",

        newGame: "بازی جدید",
        resign: "تسلیم",
        draw: "مساوی",
        restart: "شروع دوباره",
        continue: "ادامه",
        close: "بستن",
        back: "بازگشت",
        save: "ذخیره",

        achievements: "دستاوردها",
        advancements: "پیشرفت‌ها",

        v2: "چس کلاب V2",
        v2Community: "انجمن",
        v2Merch: "محصولات",
        v2Solo: "شطرنج تک‌نفره",
        v2Puzzles: "پازل‌ها",

        shop: "فروشگاه",
        buy: "خرید",
        price: "قیمت",

        language: "زبان",
        selectLanguage: "انتخاب زبان",

        welcome: "به چس کلاب خوش آمدید",
        playLikeMaster: "مثل یک استاد بازی کن"

    },


    de: {

        home: "Startseite",
        play: "Spielen",
        training: "Training",
        puzzles: "Rätsel",
        learn: "Lernen",
        bots: "Bots",
        community: "Community",
        collection: "Sammlung",
        settings: "Einstellungen",
        rules: "Regeln",
        support: "Support",
        login: "Anmelden",
        account: "Konto",
        logout: "Abmelden",

        newGame: "Neues Spiel",
        resign: "Aufgeben",
        draw: "Remis",
        restart: "Neustart",
        continue: "Weiter",
        close: "Schließen",
        back: "Zurück",
        save: "Speichern",

        achievements: "Erfolge",
        advancements: "Fortschritte",

        v2: "Chess Club V2",
        v2Community: "Community",
        v2Merch: "Merch",
        v2Solo: "Solo-Schach",
        v2Puzzles: "Rätsel",

        shop: "Shop",
        buy: "Kaufen",
        price: "Preis",

        language: "Sprache",
        selectLanguage: "Sprache auswählen",

        welcome: "Willkommen bei Chess Club",
        playLikeMaster: "Spiele wie ein Meister"

    },


    no: {

        home: "Hjem",
        play: "Spill",
        training: "Trening",
        puzzles: "Oppgaver",
        learn: "Lær",
        bots: "Boter",
        community: "Fellesskap",
        collection: "Samling",
        settings: "Innstillinger",
        rules: "Regler",
        support: "Støtte",
        login: "Logg inn",
        account: "Konto",
        logout: "Logg ut",

        newGame: "Nytt spill",
        resign: "Gi opp",
        draw: "Remis",
        restart: "Start på nytt",
        continue: "Fortsett",
        close: "Lukk",
        back: "Tilbake",
        save: "Lagre",

        achievements: "Prestasjoner",
        advancements: "Fremskritt",

        v2: "Chess Club V2",
        v2Community: "Fellesskap",
        v2Merch: "Merch",
        v2Solo: "Sjakk alene",
        v2Puzzles: "Oppgaver",

        shop: "Butikk",
        buy: "Kjøp",
        price: "Pris",

        language: "Språk",
        selectLanguage: "Velg språk",

        welcome: "Velkommen til Chess Club",
        playLikeMaster: "Spill som en mester"

    },


    es: {

        home: "Inicio",
        play: "Jugar",
        training: "Entrenamiento",
        puzzles: "Puzles",
        learn: "Aprender",
        bots: "Bots",
        community: "Comunidad",
        collection: "Colección",
        settings: "Configuración",
        rules: "Reglas",
        support: "Soporte",
        login: "Iniciar sesión",
        account: "Cuenta",
        logout: "Cerrar sesión",

        newGame: "Nueva partida",
        resign: "Rendirse",
        draw: "Tablas",
        restart: "Reiniciar",
        continue: "Continuar",
        close: "Cerrar",
        back: "Atrás",
        save: "Guardar",

        achievements: "Logros",
        advancements: "Progresos",

        v2: "Chess Club V2",
        v2Community: "Comunidad",
        v2Merch: "Merch",
        v2Solo: "Ajedrez individual",
        v2Puzzles: "Puzles",

        shop: "Tienda",
        buy: "Comprar",
        price: "Precio",

        language: "Idioma",
        selectLanguage: "Seleccionar idioma",

        welcome: "Bienvenido a Chess Club",
        playLikeMaster: "Juega como un maestro"

    },


    ar: {

        home: "الرئيسية",
        play: "العب",
        training: "التدريب",
        puzzles: "الألغاز",
        learn: "تعلم",
        bots: "الروبوتات",
        community: "المجتمع",
        collection: "المجموعة",
        settings: "الإعدادات",
        rules: "القواعد",
        support: "الدعم",
        login: "تسجيل الدخول",
        account: "الحساب",
        logout: "تسجيل الخروج",

        newGame: "لعبة جديدة",
        resign: "استسلام",
        draw: "تعادل",
        restart: "إعادة التشغيل",
        continue: "متابعة",
        close: "إغلاق",
        back: "رجوع",
        save: "حفظ",

        achievements: "الإنجازات",
        advancements: "التقدم",

        v2: "Chess Club V2",
        v2Community: "المجتمع",
        v2Merch: "المنتجات",
        v2Solo: "شطرنج فردي",
        v2Puzzles: "الألغاز",

        shop: "المتجر",
        buy: "شراء",
        price: "السعر",

        language: "اللغة",
        selectLanguage: "اختر اللغة",

        welcome: "مرحباً بك في Chess Club",
        playLikeMaster: "العب مثل الأستاذ"

    },


    fr: {

        home: "Accueil",
        play: "Jouer",
        training: "Entraînement",
        puzzles: "Énigmes",
        learn: "Apprendre",
        bots: "Bots",
        community: "Communauté",
        collection: "Collection",
        settings: "Paramètres",
        rules: "Règles",
        support: "Support",
        login: "Connexion",
        account: "Compte",
        logout: "Déconnexion",

        newGame: "Nouvelle partie",
        resign: "Abandonner",
        draw: "Nulle",
        restart: "Redémarrer",
        continue: "Continuer",
        close: "Fermer",
        back: "Retour",
        save: "Enregistrer",

        achievements: "Succès",
        advancements: "Progression",

        v2: "Chess Club V2",
        v2Community: "Communauté",
        v2Merch: "Merch",
        v2Solo: "Échecs solo",
        v2Puzzles: "Énigmes",

        shop: "Boutique",
        buy: "Acheter",
        price: "Prix",

        language: "Langue",
        selectLanguage: "Choisir la langue",

        welcome: "Bienvenue sur Chess Club",
        playLikeMaster: "Joue comme un maître"

    }

};


/* =========================================================
   CURRENT LANGUAGE
   ========================================================= */

let chessClubLanguage =
    localStorage.getItem("chessClubLanguage") || "en";


/* =========================================================
   ORIGINAL + V2 TEXT MAP
   ========================================================= */

const CHESS_CLUB_TEXT_MAP = {

    "Home": "home",
    "Play": "play",
    "Training": "training",
    "Puzzles": "puzzles",
    "Learn": "learn",
    "Bots": "bots",
    "Community": "community",
    "Collection": "collection",
    "Settings": "settings",
    "Rules": "rules",
    "Support": "support",
    "Login": "login",
    "Account": "account",
    "Logout": "logout",

    "New Game": "newGame",
    "Resign": "resign",
    "Draw": "draw",
    "Restart": "restart",
    "Continue": "continue",
    "Close": "close",
    "Back": "back",
    "Save": "save",

    "Achievements": "achievements",
    "Advancements": "advancements",

    "Chess Club V2": "v2",
    "Merch": "v2Merch",
    "Solo Chess": "v2Solo",
    "Shop": "shop",
    "Buy": "buy",
    "Price": "price",

    "Language": "language",
    "Select Language": "selectLanguage",

    "Welcome to Chess Club": "welcome",
    "Play Like A Master": "playLikeMaster"
};


/* =========================================================
   ELEMENTS THAT MUST NEVER BE TRANSLATED
   ========================================================= */

function chessClubShouldIgnore(element) {

    if (!element) return true;

    const tag = element.tagName;

    if (
        tag === "SCRIPT" ||
        tag === "STYLE" ||
        tag === "NOSCRIPT" ||
        tag === "CODE" ||
        tag === "PRE"
    ) {
        return true;
    }

    if (
        element.closest(
            "#chessBoard, #gameBoard, #trainingBoard, #puzzleBoard"
        )
    ) {
        return true;
    }

    if (
        element.closest(
            ".chess-piece, .piece, .board-piece"
        )
    ) {
        return true;
    }

    return false;
}


/* =========================================================
   TRANSLATE WHOLE ORIGINAL UI + V2
   ========================================================= */

function chessClubTranslateEverything() {

    const language =
        CHESS_CLUB_LANGUAGES[chessClubLanguage];

    if (!language) return;


    document.documentElement.lang =
        chessClubLanguage;


    /* RTL */

    if (
        chessClubLanguage === "fa" ||
        chessClubLanguage === "ar"
    ) {

        document.body.classList.add("rtl");

        document.documentElement.dir = "rtl";

    } else {

        document.body.classList.remove("rtl");

        document.documentElement.dir = "ltr";
    }


    /* Translate every visible text node */

    const walker =
        document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );


    const nodes = [];

    let node;

    while (
        node = walker.nextNode()
    ) {

        const parent =
            node.parentElement;

        if (!parent) continue;

        if (
            chessClubShouldIgnore(parent)
        ) {
            continue;
        }

        nodes.push(node);
    }


    nodes.forEach(textNode => {

        const original =
            textNode.nodeValue.trim();

        if (!original) return;


        const key =
            CHESS_CLUB_TEXT_MAP[original];

        if (!key) return;

        const translated =
            language[key];

        if (!translated) return;


        textNode.nodeValue =
            textNode.nodeValue.replace(
                original,
                translated
            );
    });


    /* Translate buttons by value */

    document
        .querySelectorAll(
            "button, input[type='button'], input[type='submit']"
        )
        .forEach(element => {

            const value =
                element.value ||
                element.textContent.trim();

            const key =
                CHESS_CLUB_TEXT_MAP[value];

            if (!key) return;

            const translated =
                language[key];

            if (!translated) return;


            if (
                element.tagName === "INPUT"
            ) {

                element.value =
                    translated;

            } else {

                element.textContent =
                    translated;
            }
        });


    /* Translate placeholders */

    document
        .querySelectorAll(
            "input[placeholder], textarea[placeholder]"
        )
        .forEach(element => {

            const placeholder =
                element.getAttribute(
                    "placeholder"
                );

            const key =
                CHESS_CLUB_TEXT_MAP[
                    placeholder
                ];

            if (!key) return;


            element.setAttribute(
                "placeholder",
                language[key]
            );
        });


    /* Translate title attributes */

    document
        .querySelectorAll("[title]")
        .forEach(element => {

            const title =
                element.getAttribute("title");

            const key =
                CHESS_CLUB_TEXT_MAP[title];

            if (!key) return;


            element.setAttribute(
                "title",
                language[key]
            );
        });


    localStorage.setItem(
        "chessClubLanguage",
        chessClubLanguage
    );
}


/* =========================================================
   MASTER LANGUAGE FUNCTION
   ========================================================= */

window.setChessClubLanguage =
function(language) {

    if (
        !CHESS_CLUB_LANGUAGES[language]
    ) {
        console.warn(
            "Chess Club: unknown language:",
            language
        );

        return;
    }


    chessClubLanguage =
        language;


    chessClubTranslateEverything();


    /* Keep V2 synced */

    if (
        typeof window.v2SetLanguage ===
        "function"
    ) {

        try {

            window.v2SetLanguage(
                language
            );

        } catch (error) {

            console.warn(
                "V2 language bridge:",
                error
            );
        }
    }


    /* Update selectors */

    document
        .querySelectorAll(
            "[data-language-selector]"
        )
        .forEach(select => {

            select.value =
                language;
        });


    document
        .querySelectorAll(
            "#languageSelect, #languageSelector"
        )
        .forEach(select => {

            select.value =
                language;
        });
};


/* =========================================================
   ALL LANGUAGE SELECTORS
   ========================================================= */

document.addEventListener(
    "change",
    function(event) {

        const element =
            event.target;

        if (
            !element.matches(
                "#languageSelect, #languageSelector, [data-language-selector]"
            )
        ) {
            return;
        }


        window.setChessClubLanguage(
            element.value
        );
    }
);


/* =========================================================
   V2 POPUP HTML
   ========================================================= */

function createV2Popup() {

    if (
        document.getElementById("v2Popup")
    ) {
        return;
    }


    const popup =
        document.createElement("div");

    popup.id =
        "v2Popup";


    popup.innerHTML = `

        <div class="v2-popup-window">

            <div class="v2-popup-header">

                <h2 class="v2-popup-title">
                    Chess Club V2
                </h2>

                <button
                    class="v2-popup-close"
                    id="v2PopupClose"
                    aria-label="Close"
                    type="button"
                >
                    ×
                </button>

            </div>

            <div class="v2-popup-content">

                <div id="v2PopupContent"></div>

            </div>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    document
        .getElementById("v2PopupClose")
        .addEventListener(
            "click",
            closeV2Popup
        );


    /* Click outside window = close */

    popup.addEventListener(
        "click",
        function(event) {

            if (
                event.target === popup
            ) {

                closeV2Popup();
            }
        }
    );


    /* ESC = close */

    document.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Escape" &&
                popup.classList.contains("open")
            ) {

                closeV2Popup();
            }
        }
    );
}


/* =========================================================
   OPEN V2 POPUP
   ========================================================= */

window.openV2Popup =
function(content) {

    createV2Popup();


    const popup =
        document.getElementById(
            "v2Popup"
        );

    const container =
        document.getElementById(
            "v2PopupContent"
        );


    if (
        typeof content === "string"
    ) {

        container.innerHTML =
            content;

    } else if (
        content instanceof HTMLElement
    ) {

        container.innerHTML = "";

        container.appendChild(
            content
        );
    }


    popup.classList.add(
        "open"
    );


    document.body.style.overflow =
        "hidden";


    /* Re-run translation for popup */

    setTimeout(
        chessClubTranslateEverything,
        20
    );
};


/* =========================================================
   CLOSE V2 POPUP
   ========================================================= */

window.closeV2Popup =
function() {

    const popup =
        document.getElementById(
            "v2Popup"
        );

    if (!popup) return;


    popup.classList.remove(
        "open"
    );


    document.body.style.overflow =
        "";
};


/* =========================================================
   MOVE EXISTING V2 INTO POPUP
   ========================================================= */

function setupV2Popup() {

    createV2Popup();


    const v2Sections = [

        "#v2Community",
        "#v2Merch",
        "#v2Solo",
        "#v2Puzzles"

    ];


    v2Sections.forEach(selector => {

        const section =
            document.querySelector(
                selector
            );

        if (!section) return;


        /* Hide original V2 location */

        section.dataset.v2OriginalDisplay =
            section.style.display;

    });
}


/* =========================================================
   V2 BUTTON HANDLER
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                "[data-open-v2]"
            );

        if (!button) return;


        event.preventDefault();


        const target =
            button.getAttribute(
                "data-open-v2"
            );


        const section =
            document.querySelector(
                target
            );


        if (!section) {

            console.warn(
                "V2 section not found:",
                target
            );

            return;
        }


        openV2Popup(
            section.cloneNode(true)
        );
    }
);


/* =========================================================
   AUTOMATIC V2 BUTTON SUPPORT
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        const text =
            event.target
                .textContent
                .trim()
                .toLowerCase();


        if (
            text === "chess club v2" ||
            text === "v2"
        ) {

            if (
                event.target.closest(
                    "button, a"
                )
            ) {

                event.preventDefault();


                const firstV2 =
                    document.querySelector(
                        "#v2Community, #v2Merch, #v2Solo, #v2Puzzles"
                    );


                if (firstV2) {

                    openV2Popup(
                        firstV2.cloneNode(true)
                    );
                }
            }
        }
    }
);


/* =========================================================
   STARTUP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        createV2Popup();

        setupV2Popup();

        setTimeout(
            function() {

                chessClubTranslateEverything();

            },
            100
        );
    }
);


/* =========================================================
   CHESS CLUB 8.1 — SAFE LOCAL ECONOMY ADD-ON
   Chests, game-coin casino, daily rewards and quests.
   No real-money betting or cash-outs. Local-first; server validation
   is required before treating rewards as secure in online play.
========================================================= */
(function ChessClubEconomy(){
  "use strict";
  const STORE_KEY = "chessClubEconomy_v1";
  const TIERS = [
    {id:"wood", name:"Wooden", icon:"🪵", color:"#8b6545", coins:40, fragments:0, weight:52},
    {id:"silver", name:"Silver", icon:"🥈", color:"#8997a8", coins:90, fragments:1, weight:27},
    {id:"gold", name:"Golden", icon:"🥇", color:"#d8a62e", coins:180, fragments:2, weight:14},
    {id:"crystal", name:"Crystal", icon:"💎", color:"#5ab8df", coins:350, fragments:4, weight:6},
    {id:"legendary", name:"Legendary", icon:"🌟", color:"#b67aff", coins:700, fragments:8, weight:1}
  ];
  const PRIZES = [
    {name:"Seal Badge", category:"Badges", icon:"🦭", fragments:1},
    {name:"Classic Board", category:"Boards", icon:"♟️", fragments:1},
    {name:"Emerald Board", category:"Boards", icon:"🟩", fragments:2},
    {name:"Ocean Piece Set", category:"Piece sets", icon:"🌊", fragments:2},
    {name:"Victory Spark", category:"Effects", icon:"✨", fragments:2},
    {name:"Seal Victory", category:"Victory animations", icon:"🦭", fragments:3},
    {name:"Classic Sound Pack", category:"Sound packs", icon:"🔊", fragments:1},
    {name:"Golden Profile Frame", category:"Profile cosmetics", icon:"🖼️", fragments:3},
    {name:"AWAWA Chat Emote", category:"Chat emotes", icon:"💬", fragments:2},
    {name:"Knight Badge", category:"Badges", icon:"♞", fragments:1}
  ];
  const MACHINES = [
    {id:"classic", name:"Classic Spin", icon:"🎰", cost:0, pool:[{name:"25 Coins",coins:25},{name:"50 Coins",coins:50},{name:"Wooden Chest",chest:"wood"},{name:"1 Fragment",fragments:1},{name:"Silver Chest",chest:"silver"}]},
    {id:"royal", name:"Royal Spin", icon:"👑", cost:120, pool:[{name:"100 Coins",coins:100},{name:"2 Fragments",fragments:2},{name:"Golden Chest",chest:"gold"},{name:"Royal Badge",prize:"Knight Badge"},{name:"Crystal Chest",chest:"crystal"}]},
    {id:"seal", name:"Seal Spin", icon:"🦭", cost:220, pool:[{name:"Seal Party Coins",coins:180},{name:"3 Fragments",fragments:3},{name:"Seal Badge",prize:"Seal Badge"},{name:"Seal Victory",prize:"Seal Victory"},{name:"Legendary Chest",chest:"legendary"}]}
  ];
  const dayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const yesterdayKey = () => {
    const d = new Date(); d.setDate(d.getDate()-1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  };
  const freshState = () => ({coins:250, fragments:0, keys:{wood:2,silver:1,gold:0,crystal:0,legendary:0}, chests:{wood:0,silver:0,gold:0,crystal:0,legendary:0}, inventory:[], spinsLeft:3, spinDay:"", claimedDay:"", questDay:"", quests:{games:0,puzzles:0,claims:0}, lastVisit:"", streak:0, history:[]});
  function loadState(){
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const s = raw ? JSON.parse(raw) : freshState();
      const base = freshState();
      if (!s || typeof s !== "object") return base;
      const out = {...base,...s,keys:{...base.keys,...(s.keys||{})},chests:{...base.chests,...(s.chests||{})},quests:{...base.quests,...(s.quests||{})},inventory:Array.isArray(s.inventory)?s.inventory:[],history:Array.isArray(s.history)?s.history:[]};
      for (const k of ["coins","fragments","spinsLeft","streak"]) out[k] = Math.max(0, Math.floor(Number(out[k])||0));
      for (const t of TIERS) { out.keys[t.id]=Math.max(0,Math.floor(Number(out.keys[t.id])||0)); out.chests[t.id]=Math.max(0,Math.floor(Number(out.chests[t.id])||0)); }
      return out;
    } catch(e) { console.warn("Economy save unavailable; using temporary state.",e); return freshState(); }
  }
  let state = loadState();
  function save(){ try { localStorage.setItem(STORE_KEY,JSON.stringify(state)); } catch(e) { console.warn("Could not save economy state.",e); } }
  function safeText(value){ return String(value == null ? "" : value); }
  function weightedTier(){
    const total = TIERS.reduce((n,t)=>n+t.weight,0); let roll=Math.random()*total;
    for (const t of TIERS) { roll-=t.weight; if(roll<0) return t; }
    return TIERS[0];
  }
  function randomPrize(tier){
    const available = tier.id === "legendary" ? PRIZES.filter(p=>["Seal Victory","Golden Profile Frame","Emerald Board"].includes(p.name)) : PRIZES;
    return available[Math.floor(Math.random()*available.length)];
  }
  function ensureStyles(){
    if(document.getElementById("ccEconomyStyles")) return;
    const style=document.createElement("style"); style.id="ccEconomyStyles";
    style.textContent=`#ccEcoOverlay{position:fixed;inset:0;z-index:1000001;background:rgba(0,0,0,.76);display:flex;align-items:center;justify-content:center;padding:12px;font-family:inherit}#ccEcoPanel{width:min(900px,96vw);max-height:92vh;overflow:auto;border-radius:22px;padding:20px;background:linear-gradient(145deg,#f6ead7,#dfc39a);color:#2b2118;box-shadow:0 25px 80px #0008}#ccEcoPanel h2{margin:0 0 12px}#ccEcoTop{display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap}#ccEcoStats{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}#ccEcoStats span{background:#fff9;padding:9px 12px;border-radius:12px;font-weight:800}#ccEcoGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;margin:14px 0}#ccEcoPanel button{border:0;border-radius:12px;padding:11px 13px;background:#244b35;color:white;font-weight:800;cursor:pointer;margin:3px}#ccEcoPanel button:disabled{opacity:.45;cursor:not-allowed}#ccEcoPanel .eco-card{padding:14px;border-radius:16px;background:#fff9;border:1px solid #7d634633}#ccEcoPanel .eco-card strong{display:block;font-size:18px;margin:7px 0}#ccEcoPanel .eco-muted{font-size:13px;opacity:.8}#ccEcoMessage{padding:12px;border-radius:12px;background:#fff9;min-height:42px;margin:10px 0;white-space:pre-wrap}#ccEcoInventory{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px}#ccEcoPanel input{padding:9px;border-radius:8px;border:1px solid #998} @media(max-width:520px){#ccEcoPanel{padding:13px}#ccEcoPanel button{padding:10px}}`;
    style.textContent +=             `#ccEcoPanel .eco-card{display:flex;flex-direction:column;align-items:stretch;gap:.45rem;min-width:0}#ccEcoPanel .eco-card button{width:100%;min-height:42px;box-sizing:border-box;margin:0;display:flex;align-items:center;justify-content:center;gap:.45rem}#ccEcoPanel button:focus-visible{outline:3px solid #f5c542;outline-offset:3px}#ccEcoReels{display:flex;justify-content:center;align-items:center;gap:.55rem;margin:18px auto;padding:12px;background:#21182c;border-radius:16px;max-width:300px;border:2px solid #c49a40}#ccEcoReels .ccEcoReel{width:66px;height:70px;display:grid;place-items:center;border-radius:10px;background:linear-gradient(#fff,#e7e2f2);font-size:32px;box-shadow:inset 0 0 0 2px #c49a40;overflow:hidden}#ccEcoReels .ccEcoReel.spinning{animation:ccEcoReelSpin .11s linear infinite}#ccEcoChestVisual{font-size:64px;text-align:center;line-height:1.2;margin:8px 0;transform-origin:center bottom}#ccEcoChestVisual.shaking{animation:ccEcoChestShake .12s linear infinite}#ccEcoChestVisual.opening{animation:ccEcoChestOpen .55s ease-out forwards}#ccEcoRewardReveal{animation:ccEcoRewardPop .45s ease-out both;font-weight:800;text-align:center;padding:8px}#ccEcoPanel .eco-card button{flex-shrink:0}@keyframes ccEcoReelSpin{0%{transform:translateY(-3px);filter:blur(1px)}50%{transform:translateY(3px);filter:blur(2px)}100%{transform:translateY(-3px);filter:blur(1px)}}@keyframes ccEcoChestShake{0%,100%{transform:translateX(0) rotate(0)}25%{transform:translateX(-5px) rotate(-4deg)}75%{transform:translateX(5px) rotate(4deg)}}@keyframes ccEcoChestOpen{0%{transform:scale(1) rotate(0)}45%{transform:scale(1.2) rotate(-8deg)}100%{transform:scale(1.08) rotate(0);filter:drop-shadow(0 0 18px #f5c542)}}@keyframes ccEcoRewardPop{from{opacity:0;transform:translateY(12px) scale(.8)}to{opacity:1;transform:translateY(0) scale(1)}}#puzzleBoard.puzzle-solved{animation:ccPuzzleWin .5s ease-out}@keyframes ccPuzzleWin{0%{box-shadow:0 0 0 0 #38b66b00}50%{box-shadow:0 0 0 7px #38b66b99}100%{box-shadow:0 0 0 0 #38b66b00}}@media(prefers-reduced-motion:reduce){#ccEcoReels .ccEcoReel.spinning,#ccEcoChestVisual.shaking,#ccEcoChestVisual.opening,#ccEcoRewardReveal,#puzzleBoard.puzzle-solved{animation:none!important}}`;
    
    document.head.appendChild(style);
  }
  function getOverlay(){
    ensureStyles(); let overlay=document.getElementById("ccEcoOverlay"); if(overlay) overlay.remove();
    overlay=document.createElement("div"); overlay.id="ccEcoOverlay";
    const panel=document.createElement("div"); panel.id="ccEcoPanel"; panel.setAttribute("role","dialog"); panel.setAttribute("aria-modal","true");
    overlay.appendChild(panel); overlay.addEventListener("click",e=>{if(e.target===overlay) overlay.remove();});
    document.addEventListener("keydown",function esc(e){if(e.key==="Escape"){overlay.remove();document.removeEventListener("keydown",esc);}});
    document.body.appendChild(overlay); return panel;
  }
  function header(panel,title){
    const top=document.createElement("div"); top.id="ccEcoTop";
    const h=document.createElement("h2"); h.textContent=title; top.appendChild(h);
    const close=document.createElement("button"); close.textContent="✕ Close"; close.onclick=()=>document.getElementById("ccEcoOverlay")?.remove(); top.appendChild(close); panel.appendChild(top);
    const stats=document.createElement("div"); stats.id="ccEcoStats";
    [["🪙 Coins",state.coins],["🧩 Fragments",state.fragments],["🎟 Spins",state.spinsLeft]].forEach(([label,value])=>{const span=document.createElement("span");span.textContent=`${label}: ${value}`;stats.appendChild(span);}); panel.appendChild(stats);
  }
  function message(panel,text){const el=document.createElement("div");el.id="ccEcoMessage";el.setAttribute("aria-live","polite");el.textContent=text;panel.appendChild(el);return el;}
  function card(grid,icon,title,desc,buttonText,action,disabled=false){
    const box=document.createElement("div");box.className="eco-card";const i=document.createElement("div");i.textContent=icon;i.style.fontSize="28px";const strong=document.createElement("strong");strong.textContent=title;const p=document.createElement("p");p.className="eco-muted";p.textContent=desc;const b=document.createElement("button");b.textContent=buttonText;b.disabled=disabled;b.onclick=action;box.append(i,strong,p,b);grid.appendChild(box);
  }
  function record(text){state.history.unshift({day:dayKey(),text});state.history=state.history.slice(0,30);save();}
  function addInventory(prize){
    const found=state.inventory.find(x=>x.name===prize.name);
    if(found){state.fragments+=Math.max(1,Number(prize.fragments)||1);return `Duplicate ${prize.name}: converted to fragments.`;}
    state.inventory.push({name:prize.name,category:prize.category,icon:prize.icon,obtained:dayKey()});return `Unlocked ${prize.icon} ${prize.name}!`;
  }
  let chestOpening = false;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function openChest(tierId,panel,msg){
    if(chestOpening) return;
    const tier=TIERS.find(t=>t.id===tierId); if(!tier)return;
    if(state.chests[tierId]>0){state.chests[tierId]--;}
    else if(state.keys[tierId]>0){state.keys[tierId]--;}
    else {msg.textContent=`You need a ${tier.name} chest or key. Earn keys from daily rewards and quests.`;save();return;}
    chestOpening = true;
    const buttons = panel.querySelectorAll('#ccEcoGrid button');
    buttons.forEach(b=>b.disabled=true);
    const visual=document.createElement('div'); visual.id='ccEcoChestVisual'; visual.className='shaking'; visual.textContent='🎁';
    const caption=document.createElement('div'); caption.textContent=`Opening the ${tier.name} chest...`; caption.style.textAlign='center';
    msg.replaceChildren(visual,caption);
    await wait(650);
    visual.classList.remove('shaking'); visual.classList.add('opening'); visual.textContent='🧰';
    caption.textContent='Unlocking your reward...';
    await wait(550);
    const prize=randomPrize(tier); state.coins+=tier.coins; state.fragments+=tier.fragments; const unlockText=addInventory(prize);
    if(tier.id==='legendary') state.fragments+=2;
    record(`${tier.name} chest: ${prize.name}`); save(); refreshStats(panel);
    const reward=document.createElement('div'); reward.id='ccEcoRewardReveal'; reward.textContent=`${prize.icon} ${prize.name}`;
    const details=document.createElement('div'); details.textContent=`${tier.icon} +${tier.coins} coins · +${tier.fragments+(tier.id==='legendary'?2:0)} fragments. ${unlockText}`; details.style.textAlign='center';
    msg.replaceChildren(visual,reward,details);
    visual.classList.remove('opening');
    renderChests(panel,msg);
    chestOpening = false;
  }
  function renderChests(panel,msg){
    const old=document.getElementById("ccEcoGrid");if(old)old.remove();const grid=document.createElement("div");grid.id="ccEcoGrid";
    TIERS.forEach(t=>card(grid,t.icon,`${t.name} Chest`,`Owned: ${state.chests[t.id]} · Keys: ${state.keys[t.id]} · Guaranteed coins: ${t.coins}`,"Open chest",()=>openChest(t.id,panel,msg),state.chests[t.id]===0&&state.keys[t.id]===0));panel.insertBefore(grid,msg.nextSibling);
  }
  function openChests(){
    const panel=getOverlay();header(panel,"🎁 Chest Vault");const msg=message(panel,"Every chest grants coins and a cosmetic reward. Duplicate cosmetics become fragments.");
    const note=document.createElement("p");note.className="eco-muted";note.textContent="Rewards are game-only. No real-money betting or cash-outs.";panel.appendChild(note);renderChests(panel,msg);
  }
  function refreshStats(panel){const old=document.getElementById("ccEcoStats");if(old){const n=document.createElement("div");n.id="ccEcoStats";[["🪙 Coins",state.coins],["🧩 Fragments",state.fragments],["🎟 Spins",state.spinsLeft]].forEach(([a,b])=>{const s=document.createElement("span");s.textContent=`${a}: ${b}`;n.appendChild(s);});old.replaceWith(n);}}
  let slotSpinning = false;
  async function spin(machineId,panel,msg){
    const machine=MACHINES.find(m=>m.id===machineId);if(!machine)return;
    if(slotSpinning)return;
    if(state.spinsLeft<=0){msg.textContent="No daily spins left. Come back tomorrow for 3 more spins.";return;}
    if(state.coins<machine.cost){msg.textContent=`You need ${machine.cost} coins for this machine.`;return;}
    slotSpinning=true;
    const spinButtons=panel.querySelectorAll('#ccEcoGrid button');spinButtons.forEach(b=>b.disabled=true);
    const reels=panel.querySelectorAll('.ccEcoReel');
    const symbols=['♟️','🪙','🧩','🎁','💎','🦭','👑','✨','🔑'];
    reels.forEach((r,i)=>{r.classList.add('spinning');r.textContent=symbols[(Math.random()*symbols.length)|0];});
    msg.textContent=`${machine.icon} ${machine.name} is spinning...`;
    await wait(450); if(reels[0]){reels[0].classList.remove('spinning');reels[0].textContent=symbols[(Math.random()*symbols.length)|0];}
    await wait(350); if(reels[1]){reels[1].classList.remove('spinning');reels[1].textContent=symbols[(Math.random()*symbols.length)|0];}
    await wait(350); if(reels[2]){reels[2].classList.remove('spinning');reels[2].textContent='🎉';}
    state.coins-=machine.cost;state.spinsLeft--;
    const prize=machine.pool[Math.floor(Math.random()*machine.pool.length)];
    if(prize.coins)state.coins+=prize.coins;
    if(prize.fragments)state.fragments+=prize.fragments;
    if(prize.chest)state.chests[prize.chest]=(state.chests[prize.chest]||0)+1;
    let cosmeticText='';
    if(prize.prize){const p=PRIZES.find(x=>x.name===prize.prize);if(p)cosmeticText=addInventory(p);}
    record(`${machine.name}: ${prize.name}`);save();
    const reveal=document.createElement('div');reveal.id='ccEcoRewardReveal';reveal.textContent=`🎉 You won: ${prize.name}!`;
    const details=document.createElement('div');details.style.textAlign='center';details.textContent=(prize.coins?'+'+prize.coins+' coins · ':'')+(prize.fragments?'+'+prize.fragments+' fragments · ':'')+(prize.chest?'+1 '+prize.chest+' chest · ':'')+cosmeticText;
    msg.replaceChildren(reveal,details);
    refreshStats(panel);
    const grid=panel.querySelector('#ccEcoGrid');if(grid)grid.querySelectorAll('button').forEach((b,i)=>{const m=MACHINES[i];b.disabled=!m||state.spinsLeft<=0||state.coins<m.cost;});
    slotSpinning=false;
  }
  function openCasino(){
    syncDailyReset();
    const panel=getOverlay();header(panel,"🎰 Chess Club Casino");const msg=message(panel,"Daily game-only spins. No real money, deposits, or cash-outs.");
    const reels=document.createElement('div');reels.id='ccEcoReels';reels.setAttribute('aria-label','Animated slot machine reels');
    ['♟️','🪙','🎁'].forEach(symbol=>{const reel=document.createElement('div');reel.className='ccEcoReel';reel.textContent=symbol;reels.appendChild(reel);});
    panel.appendChild(reels);
    const grid=document.createElement("div");grid.id="ccEcoGrid";MACHINES.forEach(m=>card(grid,m.icon,m.name,m.cost?`Spin cost: ${m.cost} coins`:`Free daily spin · ${m.pool.length} possible prizes`,"Spin",()=>spin(m.id,panel,msg),state.spinsLeft<=0||state.coins<m.cost));panel.appendChild(grid);
    const history=document.createElement("p");history.className="eco-muted";history.textContent="Recent spins and chest openings: "+(state.history.slice(0,5).map(x=>x.text).join(" · ")||"Nothing yet");panel.appendChild(history);
  }
  function claimDaily(panel,msg){
    const today=dayKey();if(state.claimedDay===today){msg.textContent="Daily reward already claimed. Come back tomorrow!";return;}
    state.streak=state.lastVisit===yesterdayKey()?state.streak+1:1;state.lastVisit=today;state.claimedDay=today;
    const coins=100+Math.min(state.streak,7)*25;state.coins+=coins;state.spinsLeft=3;state.keys.wood+=1;if(state.streak%3===0)state.keys.silver+=1;
    record(`Daily reward: ${coins} coins, 1 Wooden Key`);save();msg.textContent=`📅 Daily reward claimed!\n🪙 +${coins} coins · 🗝️ +1 Wooden Key · 🎟 3 spins refreshed\n🔥 Login streak: ${state.streak} day(s).${state.streak%3===0?" Bonus: +1 Silver Key!":""}`;refreshStats(panel);
  }
  function syncDailyReset(){
    const today=dayKey();let changed=false;
    if(state.spinDay!==today){state.spinDay=today;state.spinsLeft=3;changed=true;}
    if(state.questDay!==today){state.questDay=today;state.quests={games:0,puzzles:0,claims:0};changed=true;}
    if(changed)save();
  }
  function claimQuest(kind,panel,msg){
    const today=dayKey();syncDailyReset();
    const quests={games:{goal:1,coins:80,text:"Play one chess game"},puzzles:{goal:1,coins:60,text:"Solve one puzzle"},claims:{goal:1,coins:40,text:"Claim your daily reward"}};const q=quests[kind];if(!q)return;
    if(state.quests[kind]>=q.goal){msg.textContent="That quest has already been claimed today.";return;}
    if(kind==="claims"&&state.claimedDay!==today){msg.textContent="Claim your daily reward first.";return;}
    // Local-first quest confirmation: the player confirms they completed the activity.
    state.quests[kind]=q.goal;state.coins+=q.coins;record(`Quest reward: ${q.coins} coins`);save();msg.textContent=`Quest complete: ${q.text}! +${q.coins} coins.`;refreshStats(panel);
  }
  function openDailyHub(){
    syncDailyReset();
    const today=dayKey();
    const panel=getOverlay();header(panel,"📅 Daily Rewards & Quests");const msg=message(panel,"Claim once each day. Your streak increases when you return on consecutive days.");
    const grid=document.createElement("div");grid.id="ccEcoGrid";card(grid,"🎁","Daily Reward",state.claimedDay===today?"Already claimed today":"Coins, a key, and 3 daily spins","Claim reward",()=>{claimDaily(panel,msg);refreshStats(panel);},state.claimedDay===today);card(grid,"♟️","Play a Game","Reward: 80 coins","Claim quest",()=>claimQuest("games",panel,msg),state.quests.games>=1);card(grid,"🧩","Solve a Puzzle","Reward: 60 coins","Claim quest",()=>claimQuest("puzzles",panel,msg),state.quests.puzzles>=1);card(grid,"📅","Daily Claim Quest","Reward: 40 coins","Claim quest",()=>claimQuest("claims",panel,msg),state.quests.claims>=1);panel.appendChild(grid);
    const foot=document.createElement("p");foot.className="eco-muted";foot.textContent=`Current streak: ${state.streak} day(s). Daily reset follows your device's local calendar. Data is saved in this browser on this device.`;panel.appendChild(foot);
  }
  function openCollectionRewards(){
    const panel=getOverlay();header(panel,"🧰 My Collection — Rewards");const msg=message(panel,"Cosmetics earned from chests and spins appear here.");
    const grid=document.createElement("div");grid.id="ccEcoInventory";
    if(!state.inventory.length){const empty=document.createElement("p");empty.textContent="Your collection is empty. Open a chest to unlock your first cosmetic!";grid.appendChild(empty);}else state.inventory.forEach(p=>{const item=document.createElement("div");item.className="eco-card";const title=document.createElement("strong");title.textContent=`${p.icon} ${p.name}`;const cat=document.createElement("p");cat.className="eco-muted";cat.textContent=p.category;item.append(title,cat);grid.appendChild(item);});panel.appendChild(grid);
    const frag=document.createElement("p");frag.className="eco-muted";frag.textContent=`Fragments: ${state.fragments}. Duplicate rewards convert to fragments; fragment shop can be added next.`;panel.appendChild(frag);
  }
  function installButtons(){
    const home=document.querySelector("#menu .buttons, #menu .left .buttons");
    if(home){
      const specs=[["🎁 Chests","openChests"],["🎰 Casino","openCasino"],["📅 Daily Rewards","openDailyHub"]];
      specs.forEach(([label,fn])=>{if([...home.querySelectorAll("button")].some(b=>b.dataset.ccEco===fn))return;const b=document.createElement("button");b.type="button";b.textContent=label;b.dataset.ccEco=fn;b.addEventListener("click",()=>window[fn]());home.appendChild(b);});
    }
    const collection=document.getElementById("collectionPage");if(collection&&!document.getElementById("ccEcoCollectionButton")){const b=document.createElement("button");b.id="ccEcoCollectionButton";b.type="button";b.textContent="✨ View Earned Rewards";b.onclick=openCollectionRewards;collection.appendChild(b);}
  }
  // Preserve the original page's inline onclick entry point while replacing the placeholder chest alert.
  window.openChests=openChests;
  window.openCasino=openCasino;
  window.openDailyHub=openDailyHub;
  window.openCollectionRewards=openCollectionRewards;
  // Keep economy state available only through safe, read-only diagnostics.
  window.getChessClubEconomySummary=()=>({coins:state.coins,fragments:state.fragments,spinsLeft:state.spinsLeft,inventoryCount:state.inventory.length,streak:state.streak});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",installButtons,{once:true});else installButtons();
// Chess Club Admin Panel interface
// This UI does not enforce real online bans.

function openAdminPanel() {
    const page = document.getElementById("adminPanelPage");

    if (!page) return;

    // Only display the panel after a real admin
    // permission check has been implemented.
    if (typeof window.isVerifiedChessClubAdmin !== "function" ||
        !window.isVerifiedChessClubAdmin()) {
        alert("Admin permission could not be verified.");
        return;
    }

    if (typeof goHome === "function") {
        goHome();
    }

    document.querySelectorAll("body > section.page").forEach(section => {
        section.hidden = section.id !== "adminPanelPage";
    });

    page.hidden = false;
}

function adminBanPlayer() {
    showAdminNotice(
        "Real bans require a secure server-side moderation function."
    );
}

function adminUnbanPlayer() {
    showAdminNotice(
        "Unbanning requires a secure server-side moderation function."
    );
}

function showAdminNotice(message) {
    const output = document.getElementById("adminPanelMessage");
    if (output) output.textContent = message;


/* =====================================================
   CHESS CLUB V2 — SUPABASE CONNECTION
   Uses your existing script.js
===================================================== */

const CHESS_CLUB_SUPABASE_URL = "YOUR_PROJECT_URL";
const CHESS_CLUB_SUPABASE_KEY = "YOUR_PUBLISHABLE_KEY";

let chessClubSupabase = null;

(function initializeChessClubSupabase() {
    if (
        !CHESS_CLUB_SUPABASE_URL.startsWith("https://") ||
        CHESS_CLUB_SUPABASE_URL === "YOUR_PROJECT_URL" ||
        CHESS_CLUB_SUPABASE_KEY === "YOUR_PUBLISHABLE_KEY"
    ) {
        console.warn(
            "Chess Club: Add your Supabase URL and publishable key."
        );
        return;
    }

    const existing = document.querySelector(
        'script[data-chess-club-supabase]'
    );

    function connect() {
        if (!window.supabase?.createClient) {
            console.error("Supabase library did not load.");
            return;
        }

        chessClubSupabase = window.supabase.createClient(
            CHESS_CLUB_SUPABASE_URL,
            CHESS_CLUB_SUPABASE_KEY
        );

        console.log("Chess Club: Supabase initialized!");
    }

    if (window.supabase?.createClient) {
        connect();
        return;
    }

    if (existing) {
        existing.addEventListener("load", connect, { once: true });
        return;
    }

    const library = document.createElement("script");
    library.src =
        "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    library.dataset.chessClubSupabase = "true";
    library.onload = connect;
    library.onerror = () => {
        console.error("Could not load the Supabase library.");
    };

    document.head.appendChild(library);
})();

}
  save();
})();
