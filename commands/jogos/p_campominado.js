module.exports = {
    name: 'campominado',
    description: 'Jogar campo minado',
    usage: '',
    cooldown: 0,
    permissions: false,
    args: 0,
    async execute(client, message, args) {
        const canalFind = () => client.channels.cache.find((m) => m.name === `campominado→${message.author.id}`);
        let channel;
        if (!canalFind()) {
            channel = await message.guild.channels.create(`campominado→${message.author.id}`, {
                type: 'text',
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL'],
                    },
                    {
                        id: message.author.id,
                        allow: ['VIEW_CHANNEL'],
                    },
                ],
                parent: '841003382521069590',
            });
        } else {
            return message.channel.send('Voce já tem um jogo em aberto');
        }

        let matriz = Array(5)
            .fill(null)
            .map(() => Array(5).fill('<a:warning_savage:856210165338603531>'));

        function BombaChoosed(lin, col, bombs) {
            let bomb = GenerateBombs(bombs).find((m) => m.position1 == lin && m.position2 == col);

            if (bomb != undefined) {
                matriz[lin][col] = '<a:fogo_savage:779863770843447316>';
            } else {
                matriz[lin][col] = '<a:diamante:650792674248359936>';
            }

            return BombToString(matriz);
        }

        function GenerateBombs(bombs) {
            let Bomb = [];
            for (let i = 0; i < bombs; i++) {
                Bomb[i] = {
                    position1: Math.floor(Math.random() * matriz.length),
                    position2: Math.floor(Math.random() * matriz.length),
                };

                let BombFilter = () => {
                    let BombLength = Bomb.filter(
                        (m) => m.position1 == Bomb[i].position1 && m.position2 == Bomb[i].position2
                    );
                    if (BombLength.length > 1) {
                        return true;
                    } else {
                        return false;
                    }
                };

                while (BombFilter()) {
                    Bomb[i] = {
                        position1: Math.floor(Math.random() * matriz.length),
                        position2: Math.floor(Math.random() * matriz.length),
                    };
                    BombFilter();
                }
            }

            return Bomb;
        }

        function BombToString(matrizParam) {
            let result = '';
            for (let i = -1; i < 5; i++) {
                for (let j = -1; j < 5; j++) {
                    if (j == -1) {
                        switch (i) {
                            case 0:
                                result += '🇦';
                                break;
                            case 1:
                                result += '🇧';
                                break;
                            case 2:
                                result += '🇨';
                                break;
                            case 3:
                                result += '🇩';
                                break;
                            case 4:
                                result += '🇪';
                                break;
                            default:
                                break;
                        }
                    }
                    if (i == -1) {
                        switch (j) {
                            case 0:
                                result += '<a:savage_1:839189109943042097>';
                                break;
                            case 1:
                                result += '<a:savage_2:839189111172628550>';
                                break;
                            case 2:
                                result += '<a:savage_3:839189110165995570>';
                                break;
                            case 3:
                                result += '<a:savage_4:839189110630776863>';
                                break;
                            case 4:
                                result += '<a:savage_5:839189110480306186>';

                                break;
                            default:
                                break;
                        }
                    }

                    if (i !== -1 && j !== -1) {
                        result += matrizParam[i][j];
                    }
                    if (i == -1 && j == -1) {
                        result += '<:blank:773345106525683753>';
                    }
                    if (j == 4) {
                        result += '\n';
                    }
                }
            }

            return result;
        }
        channel.send('Quer jogar com quantas bombas? \n**3, 5 ou 10?**');

        const filter1 = (m) =>
            (m.author == message.author && m.content == '3') || m.content == '5' || m.content == '10';

        let bombs;

        await channel.awaitMessages(filter1, { max: 1, time: 100000, errors: ['time'] }).then(async (m) => {
            m = m.first();
            bombs = m.content;
        });
        channel.bulkDelete(20);

        let msg = await channel.send(BombToString(matriz));

        let gameOver = true;
        while (gameOver) {
            const filter = (m) =>
                m.author == message.author &&
                m.content.length > 1 &&
                ['A', 'B', 'C', 'D', 'E', '1', '2', '3', '4', '5'].filter((a) => {
                    let newM = m.content.split('');

                    return a.includes(newM[0]) && a.includes(newM[1].toUpperCase());
                });
            await channel.awaitMessages(filter, { max: 1, time: 100000, errors: ['time'] }).then(async (m) => {
                m = m.first();
                m.delete();
                m = m.content.split('');

                switch (m[1].toUpperCase()) {
                    case 'A':
                        m[1] = 0;
                        break;
                    case 'B':
                        m[1] = 1;
                        break;
                    case 'C':
                        m[1] = 2;
                        '';
                        break;
                    case 'D':
                        m[1] = 3;
                        break;
                    case 'E':
                        m[1] = 4;
                        break;
                    default:
                        break;
                }
                await msg.edit(BombaChoosed(m[1], m[0] - 1, bombs));
                if (msg.content.includes('<a:fogo_savage:779863770843447316>')) {
                    channel.send('***GAME OVER***');
                    gameOver = false;
                }
            });
        }
    },
};
