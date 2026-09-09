 "use strict";

/* =========================================================
   CHESS CLUB — FULL SCRIPT
   FULL CHESS ENGINE + UI + PUZZLES + COMMUNITY + ACHIEVEMENTS
   FIXED SETTINGS + FIXED SEAL PARTY
========================================================= */


/* =========================================================
   SHORTCUT
========================================================= */

const $ = id => document.getElementById(id);


/* =========================================================
   CHESS PIECES
========================================================= */

const PIECES = {
    w: {
        k: "♔",
        q: "♕",
        r: "♖",
        b: "♗",
        n: "♘",
        p: "♙"
    },
    b: {
        k: "♚",
        q: "♛",
        r: "♜",
        b: "♝",
        n: "♞",
        p: "♟"
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


function loadProfile(){

    let saved = null;

    try{
        saved = JSON.parse(
            localStorage.getItem("chessClubProfile") || "null"
        );
    }catch(e){
        saved = null;
    }

    const result = structuredCloneSafe(DEFAULT_PROFILE);

    if(saved && typeof saved === "object"){

        Object.assign(result,saved);

        result.pieceMoves = Object.assign(
            {},
            DEFAULT_PROFILE.pieceMoves,
            saved.pieceMoves || {}
        );

        result.advancements = Object.assign(
            {},
            saved.advancements || {}
        );

        result.flags = Object.assign(
            {},
            saved.flags || {}
        );

        result.botsPlayed = Array.isArray(saved.botsPlayed)
            ? saved.botsPlayed
            : [];

        result.botWins = Array.isArray(saved.botWins)
            ? saved.botWins
            : [];

        result.friends = Array.isArray(saved.friends)
            ? saved.friends
            : [];

        result.recentMoves = Array.isArray(saved.recentMoves)
            ? saved.recentMoves
            : [];
    }

    result.elo = Math.max(3400,Number(result.elo) || 3400);
    result.blitz = Math.max(3400,Number(result.blitz) || 3400);
    result.rapid = Math.max(3400,Number(result.rapid) || 3400);
    result.daily = Math.max(3400,Number(result.daily) || 3400);

    return result;
}


function structuredCloneSafe(obj){

    return JSON.parse(JSON.stringify(obj));
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

let language =
    localStorage.getItem("chessClubLanguage") || "en";


function setLanguage(lang){

    language = lang === "fa" ? "fa" : "en";

    localStorage.setItem(
        "chessClubLanguage",
        language
    );

    document.body.classList.toggle(
        "rtl",
        language === "fa"
    );

    updateLanguageStatus();

    renderAchievements();

    updateAllProfileDisplays();
}


function toggleLanguage(){

    setLanguage(
        language === "en" ? "fa" : "en"
    );

    profile.settingsChanged++;

    saveProfile();

    unlock("language");
}


function updateLanguageStatus(){

    const el = $("languageStatus");

    if(el){
        el.textContent =
            language === "fa"
                ? "فارسی"
                : "English";
    }
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

    const soundStatus = $("soundStatus");

    if(soundStatus){
        soundStatus.textContent =
            soundEnabled
                ? "Sounds are ON."
                : "Sounds are OFF.";
    }

    const animationStatus = $("animationStatus");

    if(animationStatus){
        animationStatus.textContent =
            animationsEnabled
                ? "Animations are ON."
                : "Animations are OFF.";
    }

    const languageStatus = $("languageStatus");

    if(languageStatus){
        languageStatus.textContent =
            language === "fa"
                ? "فارسی"
                : "English";
    }

    const soundThemeStatus = $("soundThemeStatus");

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

    soundEnabled = !soundEnabled;

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

    animationsEnabled = !animationsEnabled;

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

    const choice = prompt(
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

    soundTheme = themes[choice];

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

let board = cloneBoard(START_BOARD);

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

function isSquareAttacked(state,r,c,byColor){

    const pawnRow =
        byColor === "w"
            ? r + 1
            : r - 1;

    for(const dc of [-1,1]){

        const pc = c + dc;

        if(
            inside(pawnRow,pc) &&
            state[pawnRow][pc] === byColor + "p"
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

    for(const [dr,dc] of knightOffsets){

        const nr = r + dr;
        const nc = c + dc;

        if(
            inside(nr,nc) &&
            state[nr][nc] === byColor + "n"
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
                state[nr][nc] === byColor + "k"
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

    for(const [dr,dc] of diagonals){

        let nr = r + dr;
        let nc = c + dc;

        while(inside(nr,nc)){

            const piece = state[nr][nc];

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

    for(const [dr,dc] of lines){

        let nr = r + dr;
        let nc = c + dc;

        while(inside(nr,nc)){

            const piece = state[nr][nc];

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

    const king = findKing(state,color);

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


/* =========================================================
   PSEUDO MOVES
========================================================= */

function pseudoMoves(state,r,c,includeCastling=true){

    const piece = state[r][c];

    if(!piece) return [];

    const color = pieceColor(piece);
    const type = pieceType(piece);

    const moves = [];


    if(type === "p"){

        const direction =
            color === "w" ? -1 : 1;

        const startRow =
            color === "w" ? 6 : 1;

        const oneR = r + direction;

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


        for(const dc of [-1,1]){

            const nr = r + direction;
            const nc = c + dc;

            if(!inside(nr,nc)) continue;

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

        for(const [dr,dc] of offsets){

            const nr = r + dr;
            const nc = c + dc;

            if(!inside(nr,nc)) continue;

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

                const nr = r + dr;
                const nc = c + dc;

                if(!inside(nr,nc)) continue;

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
                    !isSquareAttacked(state,7,5,enemy) &&
                    !isSquareAttacked(state,7,6,enemy)
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
                    !isSquareAttacked(state,7,3,enemy) &&
                    !isSquareAttacked(state,7,2,enemy)
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
                    !isSquareAttacked(state,0,5,enemy) &&
                    !isSquareAttacked(state,0,6,enemy)
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
                    !isSquareAttacked(state,0,3,enemy) &&
                    !isSquareAttacked(state,0,2,enemy)
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

    if(type === "b" || type === "q"){

        directions.push(
            [-1,-1],
            [-1,1],
            [1,-1],
            [1,1]
        );
    }

    if(type === "r" || type === "q"){

        directions.push(
            [-1,0],
            [1,0],
            [0,-1],
            [0,1]
        );
    }

    if(directions.length){

        for(const [dr,dc] of directions){

            let nr = r + dr;
            let nc = c + dc;

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
   APPLY MOVE TO TEMP BOARD
========================================================= */

function applyMoveToBoard(state,move){

    const next = cloneBoard(state);

    const piece =
        next[move.fromR][move.fromC];

    next[move.fromR][move.fromC] = null;


    if(move.enPassant){

        const captureR =
            move.fromR;

        next[captureR][move.toC] = null;
    }


    let placedPiece = piece;

    if(
        pieceType(piece) === "p" &&
        (move.toR === 0 || move.toR === 7)
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

    const piece = state[r][c];

    if(!piece) return [];

    if(pieceColor(piece) !== turn) return [];

    const pseudo =
        pseudoMoves(state,r,c,true);

    const legal = [];

    for(const move of pseudo){

        const next =
            applyMoveToBoard(state,move);

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

    const oldTurn = turn;

    turn = color;

    const result = [];

    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            if(
                pieceColor(state[r][c]) === color
            ){

                result.push(
                    ...legalMovesFrom(state,r,c)
                );
            }
        }
    }

    turn = oldTurn;

    return result;
}


/* =========================================================
   RENDER BOARD
========================================================= */

function renderBoard(){

    const boardEl = $("chessBoard");

    if(!boardEl) return;

    boardEl.innerHTML = "";

    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement("div");

            square.className =
                "chessSquare " +
                ((r+c)%2 === 0
                    ? "light"
                    : "dark");

            square.dataset.row = r;
            square.dataset.col = c;

            if(
                selectedSquare &&
                selectedSquare.r === r &&
                selectedSquare.c === c
            ){

                square.classList.add("selected");
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

                    square.appendChild(capture);

                }else{

                    const dot =
                        document.createElement("div");

                    dot.className =
                        "legalDot";

                    square.appendChild(dot);
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

                square.appendChild(pieceEl);
            }


            square.addEventListener(
                "click",
                () => handleSquareClick(r,c)
            );

            boardEl.appendChild(square);
        }
    }

    updateCaptured();

    updateGameStatus();
}


/* =========================================================
   BOARD CLICK
========================================================= */

function handleSquareClick(r,c){

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

        selectedSquare = {r,c};

        legalTargets =
            legalMovesFrom(board,r,c);

        renderBoard();

        return;
    }


    selectedSquare = null;

    legalTargets = [];

    renderBoard();
}


/* =========================================================
   UPDATE GAME STATUS
========================================================= */

function updateGameStatus(){

    const status =
        $("gameStatus");

    if(!status) return;

    if(gameOver) return;

    const check =
        isInCheck(board,turn);

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
        text = "Bot is thinking...";
    }

    status.textContent = text;
}


/* =========================================================
   MAKE MOVE
========================================================= */

function makeMove(move){

    if(gameOver) return;

    const movingColor = turn;

    const movingPiece =
        board[move.fromR][move.fromC];

    const capturedPiece =
        board[move.toR][move.toC];


    const beforeState = {
        board:cloneBoard(board),
        turn,
        castling:structuredCloneSafe(castlingRights),
        enPassant:enPassantTarget
            ? {...enPassantTarget}
            : null,
        capturedWhite:[...capturedWhite],
        capturedBlack:[...capturedBlack],
        moveHistory:[...moveHistory]
    };


    moveHistory.push({
        before:beforeState,
        move:copyMove(move),
        piece:movingPiece
    });


    let actualCaptured =
        capturedPiece;

    if(move.enPassant){

        const captureR =
            move.fromR;

        actualCaptured =
            board[captureR][move.toC];

        board[captureR][move.toC] =
            null;
    }


    if(actualCaptured){

        profile.captures++;

        if(pieceColor(actualCaptured) === "w"){
            capturedWhite.push(actualCaptured);
        }else{
            capturedBlack.push(actualCaptured);
        }
    }


    board[move.toR][move.toC] =
        movingPiece;

    board[move.fromR][move.fromC] =
        null;


    if(
        pieceType(movingPiece) === "p" &&
        (move.toR === 0 || move.toR === 7)
    ){

        board[move.toR][move.toC] =
            movingColor + "q";

        profile.promotions++;

        unlock("promotion");
    }


    if(move.castle){

        if(move.castle === "K"){

            board[move.toR][5] =
                board[move.toR][7];

            board[move.toR][7] =
                null;
        }

        if(move.castle === "Q"){

            board[move.toR][3] =
                board[move.toR][0];

            board[move.toR][0] =
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


    enPassantTarget = null;

    if(
        pieceType(movingPiece) === "p" &&
        Math.abs(move.toR - move.fromR) === 2
    ){

        enPassantTarget = {
            r:(move.toR + move.fromR) / 2,
            c:move.fromC
        };
    }


    profile.moves++;

    const movingType =
        pieceType(movingPiece);

    if(profile.pieceMoves[movingType] !== undefined){
        profile.pieceMoves[movingType]++;
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


    turn = opponent(turn);

    selectedSquare = null;
    legalTargets = [];


    const opponentInCheck =
        isInCheck(board,turn);

    if(opponentInCheck){

        profile.checks++;

        unlock("check");
    }


    profile.recentMoves.unshift({
        from:coordName(
            move.fromR,
            move.fromC
        ),
        to:coordName(
            move.toR,
            move.toC
        )
    });

    profile.recentMoves =
        profile.recentMoves.slice(0,20);


    positionHistory.push(
        positionKey(board,turn)
    );


    const possibleMoves =
        allLegalMoves(board,turn);

    if(possibleMoves.length === 0){

        gameOver = true;

        if(opponentInCheck){

            profile.checkmates++;

            unlock("checkmate");

            finishGame(
                movingColor,
                "checkmate"
            );

        }else{

            finishGame(
                null,
                "stalemate"
            );
        }
    }


    updateMoveList();

    saveProfile();

    renderBoard();

    checkAdvancements();


    if(
        playingBot &&
        !gameOver &&
        turn === "b"
    ){

        botThinking = true;

        updateGameStatus();

        setTimeout(
            () => {
                botMove();
            },
            350
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

        castlingRights.wK = false;
        castlingRights.wQ = false;
    }

    if(piece === "bk"){

        castlingRights.bK = false;
        castlingRights.bQ = false;
    }


    if(piece === "wr"){

        if(move.fromR === 7 && move.fromC === 0){
            castlingRights.wQ = false;
        }

        if(move.fromR === 7 && move.fromC === 7){
            castlingRights.wK = false;
        }
    }


    if(piece === "br"){

        if(move.fromR === 0 && move.fromC === 0){
            castlingRights.bQ = false;
        }

        if(move.fromR === 0 && move.fromC === 7){
            castlingRights.bK = false;
        }
    }


    if(captured === "wr"){

        if(move.toR === 7 && move.toC === 0){
            castlingRights.wQ = false;
        }

        if(move.toR === 7 && move.toC === 7){
            castlingRights.wK = false;
        }
    }


    if(captured === "br"){

        if(move.toR === 0 && move.toC === 0){
            castlingRights.bQ = false;
        }

        if(move.toR === 0 && move.toC === 7){
            castlingRights.bK = false;
        }
    }
}


/* =========================================================
   POSITION KEY
========================================================= */

function positionKey(state,side){

    return (
        state
            .map(row => row.map(x => x || "--").join(""))
            .join("/") +
        "|" +
        side
    );
}


/* =========================================================
   MOVE LIST
========================================================= */

function updateMoveList(){

    const el = $("moveList");

    if(!el) return;

    el.innerHTML = "";

    moveHistory.forEach((item,index) => {

        const div =
            document.createElement("div");

        div.className = "moveItem";

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

        el.appendChild(div);
    });
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
                .map(p => PIECES[p[0]][p[1]])
                .join(" ");
    }

    if(blackEl){

        blackEl.textContent =
            capturedBlack
                .map(p => PIECES[p[0]][p[1]])
                .join(" ");
    }
}


/* =========================================================
   RESTART
========================================================= */

function resetBoard(){

    board =
        cloneBoard(START_BOARD);

    turn = "w";

    selectedSquare = null;

    legalTargets = [];

    capturedWhite = [];

    capturedBlack = [];

    moveHistory = [];

    positionHistory = [
        positionKey(board,turn)
    ];

    castlingRights = {
        wK:true,
        wQ:true,
        bK:true,
        bQ:true
    };

    enPassantTarget = null;

    gameOver = false;

    botThinking = false;

    renderBoard();

    updateMoveList();

    updatePlayers();

    unlock("restart");
}


/* =========================================================
   TAKE BACK
========================================================= */

function takeBack(){

    if(!moveHistory.length) return;

    const last =
        moveHistory.pop();

    const state =
        last.before;

    board =
        cloneBoard(state.board);

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

    gameOver = false;

    selectedSquare = null;

    legalTargets = [];

    botThinking = false;

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
        allLegalMoves(board,turn);

    if(!moves.length) return;

    const captures =
        moves.filter(
            m => board[m.toR][m.toC]
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

    playingBot = false;

    currentBot = null;

    soloChess = true;

    showPage("game");

    resetBoard();

    updatePlayers();

    unlock("firstGame");
}


function startSoloChess(){

    playingBot = false;

    currentBot = null;

    soloChess = true;

    showPage("game");

    resetBoard();

    updatePlayers();

    unlock("solo");
}


/* =========================================================
   BOT PAGE
========================================================= */

function openBotPage(){

    showPage("botPage");

    renderBotGrid();
}


function renderBotGrid(){

    const grid =
        $("botGrid");

    if(!grid) return;

    grid.innerHTML = "";

    const bots = [
        ...BOTS
    ];

    if(
        profile.botWins.length >= BOTS.length
    ){
        bots.push(GENERAL_HUX);
    }

    bots.forEach(bot => {

        const button =
            document.createElement("button");

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
            () => startBotGame(bot);

        grid.appendChild(button);
    });
}


/* =========================================================
   BOT GAME
========================================================= */

function startBotGame(bot){

    if(
        bot.name === "General Hux" &&
        !(
            profile.botWins.length >= BOTS.length
        )
    ){

        alert(
            "General Hux is locked.\n\n" +
            "Beat every normal bot first."
        );

        return;
    }

    currentBot = bot;

    playingBot = true;

    soloChess = false;

    showPage("game");

    resetBoard();

    profile.botsPlayed.push(bot.name);

    profile.botsPlayed =
        [...new Set(profile.botsPlayed)];

    updatePlayers();

    saveProfile();
}


function updatePlayers(){

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


    if(playingBot && currentBot){

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

            if(!piece) continue;

            const value =
                PIECE_VALUES[
                    pieceType(piece)
                ];

            if(pieceColor(piece) === "b"){
                score += value;
            }else{
                score -= value;
            }
        }
    }

    return score;
}


function botMove(){

    if(
        !playingBot ||
        gameOver ||
        turn !== "b"
    ){

        botThinking = false;

        return;
    }


    const moves =
        allLegalMoves(board,"b");

    if(!moves.length){

        botThinking = false;

        return;
    }


    let bestScore = -Infinity;

    let bestMoves = [];


    for(const move of moves){

        const next =
            applyMoveToBoard(
                board,
                move
            );

        let score =
            evaluateBoard(next);


        if(board[move.toR][move.toC]){

            score +=
                PIECE_VALUES[
                    pieceType(
                        board[move.toR][move.toC]
                    )
                ] * 0.5;
        }


     
  if(
            isInCheck(next,"w")
        ){

            score += 80;
        }


        score +=
            Math.random() *
            botRandomness(
                currentBot
                    ? currentBot.elo
                    : 1000
            );


        if(score > bestScore){

            bestScore = score;

            bestMoves = [move];

        }else if(
            score === bestScore
        ){

            bestMoves.push(move);
        }
    }


    const chosen =
        bestMoves[
            Math.floor(
                Math.random() *
                bestMoves.length
            )
        ];


    botThinking = false;

    makeMove(chosen);
}


function botRandomness(elo){

    if(elo >= 3400) return 2;
    if(elo >= 2800) return 6;
    if(elo >= 2200) return 12;
    if(elo >= 1800) return 25;
    if(elo >= 1400) return 45;
    if(elo >= 1000) return 70;

    return 120;
}


/* =========================================================
   FINISH GAME
========================================================= */

function finishGame(winner,reason){

    profile.games++;

    let userWon = false;

    if(winner){

        if(
            playingBot &&
            winner === "w"
        ){
            userWon = true;
        }

        if(
            !playingBot &&
            winner === "w"
        ){
            userWon = true;
        }
    }


    if(reason === "stalemate"){

        profile.streak = 0;

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

        unlock("firstWin");

    }else{

        profile.losses++;

        profile.streak = 0;

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

function showResult(title,outcome){

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
        titleEl.textContent = title;
    }

    if(outcomeEl){
        outcomeEl.textContent = outcome;
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

    PAGE_IDS.forEach(pageId => {

        const page =
            $(pageId);

        if(!page) return;

        page.style.display =
            pageId === id
                ? "flex"
                : "none";
    });
}


function goHome(){

    playingBot = false;

    currentBot = null;

    soloChess = false;

    botThinking = false;

    closeResult();

    closeSealParty();

    showPage("menu");

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

    el.innerHTML = "";

    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement("div");

            square.className =
                "chessSquare " +
                ((r+c)%2 === 0
                    ? "light"
                    : "dark");

            const piece =
                START_BOARD[r][c];

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

                square.appendChild(pieceEl);
            }

            el.appendChild(square);
        }
    }
}


/* =========================================================
   PROFILE
========================================================= */

function openProfile(){

    showPage("profilePage");

    updateAllProfileDisplays();
}


function updateAllProfileDisplays(){

    const values = {
        homeAvatar:profile.avatar,
        homeUsername:profile.username,
        homeElo:`${profile.elo} Elo`,

        profileAvatar:profile.avatar,
        profileUsername:profile.username,
        profileOverall:profile.elo,
        profileBlitz:profile.blitz,
        profileRapid:profile.rapid,
        profileDaily:profile.daily,
        profilePuzzleRating:profile.puzzleRating,
        profileWins:profile.wins,

        onlineUsername:profile.username,
        onlineStats:`${profile.elo} Elo`
    };


    Object.entries(values).forEach(
        ([id,value]) => {

            const el = $(id);

            if(el){
                el.textContent = value;
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
            name.trim().slice(0,20);
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
            avatar.trim().slice(0,2);
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
        username.slice(0,20);

    profile.password =
        password.slice(0,40);

    saveProfile();

    updateAllProfileDisplays();

    if(message){

        message.textContent =
            "Account saved locally!";
    }

    unlock("account");

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
    ["firstGame","First Game","Play your first chess game."],
    ["firstWin","First Win","Win your first game."],

    ["moves10","10 Moves","Make 10 chess moves."],
    ["wins3","3 Wins","Win 3 games."],
    ["wins10","10 Wins","Win 10 games."],
    ["games5","5 Games","Play 5 games."],
    ["games10","10 Games","Play 10 games."],
    ["streak3","3 Win Streak","Reach a 3-game win streak."],

    ["check","Check","Give check."],
    ["checkmate","Checkmate","Deliver checkmate."],
    ["stalemate","Stalemate","Reach a stalemate."],
    ["restart","Restart","Restart a chess game."],
    ["takeback","Take Back","Use Take Back."],
    ["hint","Hint","Use a chess hint."],
    ["checkEscape","Check Escape","Escape check."],
    ["castling","Castling","Castle your king."],
    ["promotion","Promotion","Promote a pawn."],
    ["queenCapture","Queen Capture","Capture a queen."],
    ["rookCapture","Rook Capture","Capture a rook."],
    ["knightCapture","Knight Capture","Capture a knight."],
    ["bishopCapture","Bishop Capture","Capture a bishop."],
    ["pawnCapture","Pawn Capture","Capture a pawn."],
    ["profile","Profile","Edit your profile."],
    ["settings","Settings","Change a setting."],
    ["language","Languages","Switch language."],
    ["community","Community","Publish a community post."],
    ["puzzle","Puzzle","Solve a puzzle."],
    ["lesson","Learn","Complete a lesson."],
    ["solo","Solo Chess","Play solo chess."],
    ["sealParty","Seal Party","Open Seal Party."],
    ["account","Account","Create or save your local account."],
    ["placement","Placement","Answer the placement test."]
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

    grid.innerHTML = "";


    const unlocked =
        ADVANCEMENTS.filter(
            a =>
                profile.advancements[a[0]]
        ).length;


    const header =
        document.createElement("div");

    header.className =
        "achievementHeader";

    header.innerHTML = `
        <h2>🏆 Achievement Progress</h2>
        <p>
            ${unlocked} / ${ADVANCEMENTS.length}
            unlocked
        </p>
    `;

    grid.appendChild(header);


    const box =
        document.createElement("div");

    box.className =
        "achievementBox";

    ADVANCEMENTS.forEach(
        ([id,name,description]) => {

            const item =
                document.createElement("div");

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

            box.appendChild(item);
        }
    );

    grid.appendChild(box);
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
            ["How it moves","A pawn normally moves forward one square."],
            ["First move","From its starting square, a pawn may move two squares."],
            ["Capture","A pawn captures one square diagonally forward."]
        ]
    },

    knight:{
        title:"Knight",
        steps:[
            ["The L shape","A knight moves two squares in one direction and one perpendicular."],
            ["Jumping","Knights can jump over pieces."],
            ["Forks","A knight can attack multiple pieces at once."]
        ]
    },

    bishop:{
        title:"Bishop",
        steps:[
            ["Diagonal movement","Bishops move diagonally."],
            ["Long range","A bishop can travel many squares if the path is clear."]
        ]
    },

    rook:{
        title:"Rook",
        steps:[
            ["Straight lines","Rooks move horizontally and vertically."],
            ["Open files","Rooks become powerful on open files."]
        ]
    },

    queen:{
        title:"Queen",
        steps:[
            ["Powerful piece","The queen combines rook and bishop movement."],
            ["Safety","Do not move your queen unnecessarily early."]
        ]
    },

    king:{
        title:"King",
        steps:[
            ["One square","The king normally moves one square."],
            ["Safety","The king may never move into check."]
        ]
    },

    promotion:{
        title:"Promotion",
        steps:[
            ["Reach the end","A pawn reaching the final rank can promote."],
            ["Choose a piece","A pawn can become a queen, rook, bishop or knight."]
        ]
    },

    opening:{
        title:"Opening",
        steps:[
            ["Develop","Bring your pieces into the game."],
            ["Control the center","Central squares are important."],
            ["Castle","Try to keep your king safe."]
        ]
    },

    middlegame:{
        title:"Middlegame",
        steps:[
            ["Plans","Create a plan instead of making random moves."],
            ["Tactics","Look for forks, pins and discovered attacks."]
        ]
    },

    endgame:{
        title:"Endgame",
        steps:[
            ["Activate the king","The king becomes stronger in the endgame."],
            ["Promote pawns","Passed pawns can become decisive."]
        ]
    },

    tactics:{
        title:"Tactics",
        steps:[
            ["Look for forcing moves","Checks, captures and threats deserve attention."],
            ["Calculate","Calculate the opponent's reply before moving."]
        ]
    },

    strategy:{
        title:"Strategy",
        steps:[
            ["Improve pieces","Try to make your pieces more active."],
            ["Weaknesses","Attack weaknesses in the opponent's position."]
        ]
    },

    checkmate:{
        title:"Check & Checkmate",
        steps:[
            ["Check","A king is in check when attacked."],
            ["Checkmate","Checkmate means the king is in check and has no legal escape."]
        ]
    },

    castling:{
        title:"Castling",
        steps:[
            ["King and rook","Castling moves the king two squares and the rook beside it."],
            ["Restrictions","You cannot castle through check."]
        ]
    },

    enpassant:{
        title:"En Passant",
        steps:[
            ["Special pawn capture","A pawn can sometimes capture a pawn that just moved two squares."],
            ["Timing","The opportunity exists only immediately after that double move."]
        ]
    }
};

let currentLesson = null;

let currentLessonStep = 0;


function openLearn(){

    showPage("learnPage");

    profile.lessons =
        Number(profile.lessons) || 0;

    renderLearnLessons();
}


function renderLearnLessons(){

    const list =
        $("lessonList");

    if(!list) return;

    list.innerHTML = "";

    Object.entries(LESSONS)
        .forEach(([key,lesson]) => {

            const button =
                document.createElement("button");

            button.textContent =
                lesson.title;

            button.onclick =
                () => startLesson(key);

            list.appendChild(button);
        });
}


function startLesson(key){

    if(!LESSONS[key]) return;

    currentLesson = key;

    currentLessonStep = 0;

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

    if(!currentLesson) return;

    const lesson =
        LESSONS[currentLesson];

    const step =
        lesson.steps[currentLessonStep];


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

    if(!currentLesson) return;

    const lesson =
        LESSONS[currentLesson];

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

    currentLesson = null;
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
        name:"Mate in One",
        board:[
            ["","","","", "bk","","",""],
            ["","","","","","","bp",""],
            ["","","","","","","",""],
            ["","","","","","wq","",""],
            ["","","","","","wk","",""],
            ["","","","","","","",""],
            ["","","","","","","",""],
            ["","","","","","","",""]
        ],
        turn:"w"
    },

    {
        name:"Opening Practice",
        board:START_BOARD,
        turn:"w"
    },

    {
        name:"Knight Practice",
        board:START_BOARD,
        turn:"w"
    }
];


let currentPuzzleIndex = 0;
let puzzleBoardState = null;
let puzzleTurn = "w";
let puzzleSolved = false;
let puzzleSelected = null;
let puzzleTargets = [];


function openPuzzles(){

    showPage("puzzlesPage");

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
        PUZZLES[currentPuzzleIndex];

    puzzleBoardState =
        puzzle.board.map(
            row =>
                row.map(
                    p => p || null
                )
        );

    puzzleTurn =
        puzzle.turn;

    puzzleSolved = false;

    puzzleSelected = null;

    puzzleTargets = [];

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

    if(!el || !puzzleBoardState) return;

    el.innerHTML = "";

    for(let r=0;r<8;r++){

        for(let c=0;c<8;c++){

            const square =
                document.createElement("div");

            square.className =
                "chessSquare " +
                ((r+c)%2 === 0
                    ? "light"
                    : "dark");


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
                        document.createElement("div");

                    dot.className =
                        "captureDot";

                    square.appendChild(dot);

                }else{

                    const dot =
                        document.createElement("div");

                    dot.className =
                        "legalDot";

                    square.appendChild(dot);
                }
            }


            const piece =
                puzzleBoardState[r][c];

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
                    handlePuzzleClick(r,c)
            );

            el.appendChild(square);
        }
    }
}


function handlePuzzleClick(r,c){

    if(puzzleSolved) return;

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

            puzzleMakeMove(move);

            return;
        }
    }


    if(
        piece &&
        pieceColor(piece) === puzzleTurn
    ){

        const oldTurn = turn;

        turn = puzzleTurn;

        puzzleSelected = {r,c};

        puzzleTargets =
            legalMovesFrom(
                puzzleBoardState,
                r,
                c
            );

        turn = oldTurn;

        renderPuzzleBoard();

        return;
    }


    puzzleSelected = null;

    puzzleTargets = [];

    renderPuzzleBoard();
}


function puzzleMakeMove(move){

    const oldTurn = turn;

    turn = puzzleTurn;

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


    turn = oldTurn;

    puzzleSelected = null;

    puzzleTargets = [];


    const puzzle =
        PUZZLES[
            currentPuzzleIndex
        ];


    if(
        puzzle.name === "Mate in One" &&
        movingPiece === "wq" &&
        move.toR === 1 &&
        move.toC === 6
    ){

        puzzleSolved = true;

        profile.puzzles++;

        profile.puzzleWins++;

        profile.puzzleRating += 15;

        unlock("puzzle");

        saveProfile();

        const message =
            $("puzzleMessage");

        if(message){
            message.textContent =
                "🎉 Puzzle solved! Great move!";
        }

    }else{

        puzzleTurn =
            opponent(puzzleTurn);

        const message =
            $("puzzleMessage");

        if(message){

            message.textContent =
                captured
                    ? "Good move. Find the next idea."
                    : "Your move.";
        }
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

    currentPuzzleIndex = 0;

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

    showPage("communityPage");

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
            text.slice(0,500),

        time:
            Date.now()
    };


    communityPosts.unshift(post);

    saveCommunityPosts();

    profile.communityPosts++;

    saveProfile();

    input.value = "";

    renderCommunityPosts();

    unlock("community");
}


function renderCommunityPosts(){

    const page =
        $("communityPage");

    if(!page) return;


    let feed =
        $("communityFeed");


    if(!feed){

        feed =
            document.createElement("div");

        feed.id =
            "communityFeed";

        feed.className =
            "communityFeed";

        const card =
            page.querySelector(
                ".communityCard"
            );

        if(card){

            card.after(feed);

        }else{

            page.appendChild(feed);
        }
    }


    feed.innerHTML = "";


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


    communityPosts.forEach(post => {

        const item =
            document.createElement("article");

        item.className =
            "communityPost";


        const date =
            new Date(post.time);


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


        feed.appendChild(item);
    });
}


/* =========================================================
   FRIENDS
========================================================= */

function openFriends(){

    showPage("friendsPage");
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
            [...new Set(
                profile.friends
            )];

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
   ONLINE — SUPABASE REALTIME MULTIPLAYER
   Uses Chess Club's existing 3400 Elo system
========================================================= */

const SUPABASE_URL =
    "https://rrpiqgofokdnsbtpqonb.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_prCylWcEGIwn00elHleGKw_Yu1_QPN6";

let supabaseClient = null;
let onlineUserId = null;
let onlineGameId = null;
let onlineColor = null;
let onlineChannel = null;
let onlineMatchmaking = false;
let onlineReady = false;
let onlineLastUpdated = null;

let onlineOpponentName = "Opponent";
let onlineOpponentElo = 3400;


/* ---------------------------------------------------------
   INITIALIZE SUPABASE
--------------------------------------------------------- */

async function initializeOnline(){

    try{

        if(
            typeof supabase === "undefined" ||
            !supabase.createClient
        ){

            console.error(
                "Supabase library was not loaded."
            );

            onlineReady = false;

            return;
        }

        supabaseClient =
            supabase.createClient(
                SUPABASE_URL,
                SUPABASE_PUBLISHABLE_KEY
            );

        let sessionResult =
            await supabaseClient.auth.getSession();

        let session =
            sessionResult.data &&
            sessionResult.data.session;

        if(!session){

            const signInResult =
                await supabaseClient.auth.signInAnonymously();

            if(signInResult.error){

                console.error(
                    "Anonymous sign-in failed:",
                    signInResult.error
                );

                onlineReady = false;

                return;
            }

            session =
                signInResult.data.session;
        }

        if(session && session.user){

            onlineUserId =
                session.user.id;

            onlineReady = true;

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

        onlineReady = false;
    }
}


/* ---------------------------------------------------------
   OPEN ONLINE PAGE
--------------------------------------------------------- */

function openOnline(){

    showPage("onlinePage");

    updateAllProfileDisplays();

    const username =
        profile &&
        profile.username
            ? profile.username
            : "Player";

    const elo =
        profile &&
        Number.isFinite(Number(profile.elo))
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

        initializeOnline().then(() => {

            if(onlineReady){

                showOnlineStatus(
                    "🟢 Online system ready"
                );

            }else{

                showOnlineStatus(
                    "🔴 Could not connect to Online"
                );
            }

        });
    }
}


/* ---------------------------------------------------------
   ONLINE STATUS
--------------------------------------------------------- */

function showOnlineStatus(message){

    const status =
        $("onlineStatus");

    if(status){

        status.textContent =
            message;
    }
}


/* ---------------------------------------------------------
   ROOM CODE
--------------------------------------------------------- */

function createRoomCode(){

    return (
        Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase()
    );
}


/* ---------------------------------------------------------
   START MATCHMAKING
--------------------------------------------------------- */

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

    onlineMatchmaking = true;

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
            Number.isFinite(Number(profile.elo))
                ? Math.max(
                    3400,
                    Number(profile.elo)
                )
                : 3400;


        /* -------------------------------------------------
           LOOK FOR AN EXISTING WAITING GAME
        ------------------------------------------------- */

        const searchResult =
            await supabaseClient
                .from("chess_games")
                .select("*")
                .eq("status", "waiting")
                .is("black_player_id", null)
                .neq("white_player_id", onlineUserId)
                .order(
                    "created_at",
                    {
                        ascending: true
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


        /* -------------------------------------------------
           JOIN WAITING GAME
        ------------------------------------------------- */

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
                            new Date().toISOString()

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

                /*
                   Someone else probably joined it first.
                   Try matchmaking again.
                */

                onlineMatchmaking = false;

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


        /* -------------------------------------------------
           CREATE NEW WAITING GAME
        ------------------------------------------------- */

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

                    castling_rights: {

                        wK: true,
                        wQ: true,
                        bK: true,
                        bQ: true

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

        onlineMatchmaking = false;

        showOnlineStatus(
            "🔴 Matchmaking failed."
        );

        alert(
            "Chess Club Online could not start.\n\n" +
            error.message
        );
    }
}


/* ---------------------------------------------------------
   JOIN ONLINE GAME
--------------------------------------------------------- */

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
                Number(game.black_elo || 3400)
            )
            : Math.max(
                3400,
                Number(game.white_elo || 3400)
            );


    /* -------------------------------------------------
       COPY SERVER GAME STATE
    ------------------------------------------------- */

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
                wK: true,
                wQ: true,
                bK: true,
                bQ: true
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
        game.status === "finished";


    /* -------------------------------------------------
       GO TO GAME BOARD
    ------------------------------------------------- */

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


    showPage("game");


    /* -------------------------------------------------
       SUBSCRIBE TO GAME
    ------------------------------------------------- */

    await subscribeToOnlineGame();


    if(game.status === "waiting"){

        showOnlineStatus(
            "⏳ Waiting for an opponent..."
        );

        $("gameStatus").textContent =
            "⏳ Waiting for an opponent...";

    }else{

        showOnlineStatus(
            "🟢 Online game started!"
        );

        updateGameStatus();
    }
}


/* ---------------------------------------------------------
   UPDATE ONLINE PLAYERS
--------------------------------------------------------- */

function updatePlayers(){

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
            Number.isFinite(Number(profile.elo))
                ? Math.max(
                    3400,
                    Number(profile.elo)
                )
                : 3400;

        if($("whitePlayerName")){

            $("whitePlayerName").textContent =
                onlineColor === "w"
                    ? playerName
                    : onlineOpponentName;
        }

        if($("whitePlayerElo")){

            $("whitePlayerElo").textContent =
                (
                    onlineColor === "w"
                        ? playerElo
                        : onlineOpponentElo
                ) + " Elo";
        }

        if($("blackPlayerName")){

            $("blackPlayerName").textContent =
                onlineColor === "b"
                    ? playerName
                    : onlineOpponentName;
        }

        if($("blackPlayerElo")){

            $("blackPlayerElo").textContent =
                (
                    onlineColor === "b"
                        ? playerElo
                        : onlineOpponentElo
                ) + " Elo";
        }

        return;
    }

    /*
       Keep the original Chess Club player updating
       for bot/local games.
    */

    if(
        typeof updateAllProfileDisplays ===
        "function"
    ){

        updateAllProfileDisplays();
    }
}


/* ---------------------------------------------------------
   REALTIME SUBSCRIPTION
--------------------------------------------------------- */

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
                    event: "UPDATE",
                    schema: "public",
                    table: "chess_games",
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


/* ---------------------------------------------------------
   HANDLE SERVER GAME UPDATE
--------------------------------------------------------- */

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


    /* -------------------------------------------------
       OPPONENT INFO
    ------------------------------------------------- */

    if(onlineColor === "w"){

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


    /* -------------------------------------------------
       GAME STATE
    ------------------------------------------------- */

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


    /* -------------------------------------------------
       GAME RESULT
    ------------------------------------------------- */

    if(
        game.status === "finished" &&
        !gameOver
    ){

        gameOver = true;

        handleOnlineResult(
            game
        );

        return;
    }


    /* -------------------------------------------------
       MATCH FOUND
    ------------------------------------------------- */

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


/* ---------------------------------------------------------
   SEND MOVE TO SUPABASE
--------------------------------------------------------- */

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
        turn;


    let winner =
        null;

    let resultReason =
        null;

    let status =
        "playing";


    /* -------------------------------------------------
       CHECK FOR CHECKMATE / STALEMATE
    ------------------------------------------------- */

    const opponentMoves =
        allLegalMoves(
            state.board,
            nextTurn
        );


    if(opponentMoves.length === 0){

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
                        new Date().toISOString()

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


/* ---------------------------------------------------------
   HANDLE ONLINE RESULT
--------------------------------------------------------- */

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

        playerWon = false;

    }else if(
        winner === onlineColor
    ){

        playerWon = true;
    }


    /* -------------------------------------------------
       UPDATE PROFILE EXACTLY ONCE
    ------------------------------------------------- */

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
            Number(profile.games || 0) + 1;


        if(winner === "draw"){

            profile.streak = 0;

        }else if(playerWon){

            profile.wins =
                Number(profile.wins || 0) + 1;

            profile.streak =
                Number(profile.streak || 0) + 1;

            profile.bestStreak =
                Math.max(
                    Number(
                        profile.bestStreak || 0
                    ),
                    Number(
                        profile.streak || 0
                    )
                );

            /*
               Existing Chess Club Elo system:
               WIN = +8
            */

            profile.elo =
                Number(profile.elo || 3400) + 8;

            profile.elo =
                Math.max(
                    3400,
                    profile.elo
                );

        }else{

            profile.losses =
                Number(profile.losses || 0) + 1;

            profile.streak = 0;

            /*
               Existing Chess Club Elo system:
               LOSS = -5, minimum 3400
            */

            profile.elo =
                Math.max(
                    3400,
                    Number(profile.elo || 3400) - 5
                );
        }


        profile.blitz =
            Math.max(
                3400,
                Number(profile.blitz || 3400)
            );

        profile.rapid =
            Math.max(
                3400,
                Number(profile.rapid || 3400)
            );

        profile.daily =
            Math.max(
                3400,
                Number(profile.daily || 3400)
            );


        if(
            typeof saveProfile ===
            "function"
        ){

            saveProfile();
        }


        if(
            typeof checkAdvancements ===
            "function"
        ){

            checkAdvancements();
        }
    }


    gameOver = true;


    let title =
        "DRAW";

    if(winner !== "draw"){

        title =
            playerWon
                ? "YOU WIN!"
                : "YOU LOSE";
    }


    let reasonText =
        reason;


    if(reason === "checkmate"){

        reasonText =
            "Checkmate!";
    }

    if(reason === "stalemate"){

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


    /*
       Use the existing result popup if available.
       Set currentBot temporarily so the existing popup
       has an opponent name to display.
    */

    const previousBot =
        currentBot;

    currentBot = {

        name:
            onlineOpponentName,

        elo:
            onlineOpponentElo
    };


    if(
        typeof showResult ===
        "function"
    ){

        showResult(
            title,
            reasonText
        );

    }else{

        alert(
            title +
            "\n\n" +
            reasonText
        );
    }


    currentBot =
        previousBot;


    updateAllProfileDisplays();

    updateGameStatus();
}


/* ---------------------------------------------------------
   CANCEL MATCHMAKING
--------------------------------------------------------- */

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
                        new Date().toISOString()

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


/* ---------------------------------------------------------
   LEAVE ONLINE GAME
--------------------------------------------------------- */

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


/* ---------------------------------------------------------
   ONLINE TURN PROTECTION
---------------------------------------------------------

   Add this check inside your existing
   handleSquareClick() function:

   if(
       onlineGameId &&
       turn !== onlineColor
   ){
       return;
   }

--------------------------------------------------------- *//* =========================================================
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

    showPage("livePage");

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
        document.getElementById("sealPartyOverlay");

    /* -----------------------------------------------------
       CREATE OVERLAY
    ----------------------------------------------------- */

    if(!overlay){

        overlay =
            document.createElement("div");

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


        /* -------------------------------------------------
           CONTENT
        ------------------------------------------------- */

        const content =
            document.createElement("div");

        Object.assign(
            content.style,
            {
                textAlign:"center",
                color:"white",
                fontFamily:"Arial, sans-serif"
            }
        );


        /* -------------------------------------------------
           IMAGE
        ------------------------------------------------- */

        const image =
            document.createElement("img");

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


        /* -------------------------------------------------
           TITLE
        ------------------------------------------------- */

        const title =
            document.createElement("div");

        title.textContent =
            "🦭 SEAL PARTY!";

        Object.assign(
            title.style,
            {
                fontSize:"clamp(35px, 7vw, 70px)",
                fontWeight:"900",
                textShadow:"0 5px 20px rgba(0,0,0,.6)"
            }
        );


        /* -------------------------------------------------
           IMAGE ERROR
        ------------------------------------------------- */

        image.onerror = function(){

            image.style.display =
                "none";

            title.textContent =
                "🦭 SEAL PARTY!";

            const warning =
                document.createElement("p");

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


        content.appendChild(image);
        content.appendChild(title);

        overlay.appendChild(content);

        document.body.appendChild(overlay);
    }


    /* -----------------------------------------------------
       SHOW
    ----------------------------------------------------- */

    overlay.style.display =
        "flex";

    overlay.style.pointerEvents =
        "auto";


    /* -----------------------------------------------------
       ACHIEVEMENT
    ----------------------------------------------------- */

    unlock("sealParty");


    /* -----------------------------------------------------
       RESET TIMER
    ----------------------------------------------------- */

    clearTimeout(
        window.sealPartyTimer
    );


    /* -----------------------------------------------------
       AUTO CLOSE AFTER 6 SECONDS
    ----------------------------------------------------- */

    window.sealPartyTimer =
        setTimeout(
            function(){

                closeSealParty();

            },
            6000
        );
}


/* =========================================================
   CLOSE SEAL PARTY
========================================================= */

function closeSealParty(){

    const overlay =
        document.getElementById(
            "sealPartyOverlay"
        );

    if(!overlay) return;


    overlay.style.display =
        "none";

    /*
       VERY IMPORTANT:
       The hidden overlay must NOT block clicks.
    */

    overlay.style.pointerEvents =
        "none";


    clearTimeout(
        window.sealPartyTimer
    );

    window.sealPartyTimer =
        null;
}/* =========================================================
   TRAINING / COMPATIBILITY
========================================================= */

function openTraining(){

    showPage("menu");

    renderTrainingBoard();
}


/* =========================================================
   PLACEMENT TEST
========================================================= */

let placementLevel = null;


function chooseSkillLevel(level){

    placementLevel = level;

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

    if(!result) return;

    if(answer === "knight"){

        result.textContent =
            "Correct! ♘";

        unlock("placement");

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
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeChessClub(){

    document.body.classList.toggle(
        "rtl",
        language === "fa"
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

    showPage("menu");


    /* =====================================================
       SEAL PARTY BUTTON SUPPORT
    ===================================================== */

    document
        .querySelectorAll(
            "[data-seal-party]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                sealParty
            );
        });


    const sealButton =
        $("sealPartyButton");

    if(sealButton){

        sealButton.addEventListener(
            "click",
            sealParty
        );
    }


    /* =====================================================
       CLOSE POPUPS WITH ESC
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if(event.key === "Escape"){

                closeLesson();

                closeResult();

                closeSealParty();

                closeLogin();
            }
        }
    );


    /* =====================================================
       INITIAL HOME BOARD
    ===================================================== */

    renderTrainingBoard();

    updatePlayers();
}


/* =========================================================
   START
========================================================= */

if(
    document.readyState === "loading"
){

    document.addEventListener(
        "DOMContentLoaded",
        initializeChessClub
    );

}else{

    initializeChessClub();
}


/* =========================================================
   END OF CHESS CLUB SCRIPT
========================================================= */
