const functionCargos = {
    '💬'(membro, reactionFunction) {
        if (
            (membro.roles.cache.has('808452098030829598') && reactionFunction == false) ||
            (!membro.roles.cache.has('808452098030829598') && reactionFunction == false)
        ) {
            membro.roles.remove('808452098030829598');
        } else {
            membro.roles.add('808452098030829598');
        }
    },
    '📕'(membro, reactionFunction) {
        if (
            (membro.roles.cache.has('808452094637637682') && reactionFunction == false) ||
            (!membro.roles.cache.has('808452098030829598') && reactionFunction == false)
        ) {
            membro.roles.remove('808452094637637682');
        } else {
            membro.roles.add('808452094637637682');
        }
    },
    '⛔'(membro, reactionFunction) {
        if (
            (membro.roles.cache.has('808452096419823656') && reactionFunction == false) ||
            (!membro.roles.cache.has('808452098030829598') && reactionFunction == false)
        ) {
            membro.roles.remove('808452096419823656');
        } else {
            membro.roles.add('808452096419823656');
        }
    },
    '🛠️'(membro, reactionFunction) {
        if (
            (membro.roles.cache.has('808485962161717288') && reactionFunction == false) ||
            (!membro.roles.cache.has('808452098030829598') && reactionFunction == false)
        ) {
            membro.roles.remove('808485962161717288');
        } else {
            membro.roles.add('808485962161717288');
        }
    },
};


module.exports = {
    functionCargos,
};
