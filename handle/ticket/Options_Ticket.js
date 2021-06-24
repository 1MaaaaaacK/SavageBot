const { TicketTypeChoosed } = require('./embed');

const Options = {
    1(m, user, roles) {
        //bugs
        m.overwritePermissions([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.send(TicketTypeChoosed(user, 'Bugs', roles.servidor)).then((m) => {
            m.react('<:lock_savage:856224681136226314>');
        });
    },
    2(m, user, roles) {
        //Denuncia
        m.overwritePermissions([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.send(TicketTypeChoosed(user, 'Denúncia', roles.servidor)).then((m) =>
            m.react('<:lock_savage:856224681136226314>')
        );
    },
    3(m, user, roles) {
        //Banimento
        m.overwritePermissions([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.send(TicketTypeChoosed(user, 'Banimento', roles.servidor)).then((m) =>
            m.react('<:lock_savage:856224681136226314>')
        );
    },
    4(m, user, roles) {
        //Compra de Cargo
        m.overwritePermissions([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.send(TicketTypeChoosed(user, 'Compras', roles.servidor)).then((m) =>
            m.react('<:lock_savage:856224681136226314>')
        );
    },
    5(m, user, roles) {
        //Dúvidas
        m.overwritePermissions([
            {
                id: '780582159731130378', //manager
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaff,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleGerente,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: roles.roleStaffComprado,
                allow: ['VIEW_CHANNEL'],
            },
            {
                id: user.id,
                allow: ['VIEW_CHANNEL'], //user
            },
            {
                id: '343532544559546368', //everyone
                allow: ['SEND_MESSAGES'],
                deny: ['VIEW_CHANNEL'],
            },
        ]);
        m.send(TicketTypeChoosed(user, 'Dúvidas', roles.servidor)).then((m) =>
            m.react('<:lock_savage:856224681136226314>')
        );
    },
};

module.exports = { Options };
