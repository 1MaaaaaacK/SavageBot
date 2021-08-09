const serversInfos = [
    {
        name: 'jb',
        canalAlvo: 'jailbreak',
        tagDoCargo: '660663407841640459',
        tagComprado: '808446311317504020',
        tagVip: '808318507170791434',
        gerenteRole: '660663793415618620',
        serverNumber: 1,
        identifier: ['f7c2e062'],
        host: '131.196.196.197',
        port: '27170'
    },
    {
        name: 'dr',
        canalAlvo: 'deathrun',
        tagDoCargo: '646379528259895336',
        tagComprado: '808446313099165726',
        tagVip: '808322142315610122',
        gerenteRole: '602832046586593289',
        serverNumber: 2,
        identifier: ['f792b1cc'],
        host: '131.196.196.197',
        port: '27080'
    },
    {
        name: 'awp',
        canalAlvo: 'awp',
        tagDoCargo: '702931995067416637',
        tagComprado: '808446309743984660',
        tagVip: '808795307747442748',
        gerenteRole: '702933096583921694',
        serverNumber: 3,
        identifier: ['3796d28b'],
        host: '131.196.196.197',
        port: '27090'
    },
    {
        name: 'retake',
        canalAlvo: 'retake',
        tagDoCargo: '710643368765423696',
        tagComprado: '808446317734264842',
        tagVip: '808795312625942568',
        gerenteRole: '710295030559932428',
        serverNumber: 4,
        identifier: ['c4366361'],
        host: '131.196.196.197',
        port: '27130'
    },
    {
        name: 'retakepistol',
        canalAlvo: 'retakepistol',
        tagDoCargo: '733531959304650784',
        tagComprado: '808446316421316668',
        tagVip: '808795310889107476',
        gerenteRole: '731681670868238397',
        serverNumber: 5,
        identifier: ['5dba26b2'],
        host: '131.196.196.197',
        port: '27150'
    },
    {
        name: 'mix',
        canalAlvo: 'mix',
        tagDoCargo: '713828540105097257',
        tagComprado: '808446314823417866',
        tagVip: '808795309076774984',
        gerenteRole: '714327236148199474',
        serverNumber: 6,
        identifier: ['8aa7a6c5'],
        host: '131.196.196.197',
        port: '27190'
    },
    
    {
        name: 'arena',
        canalAlvo: 'arena',
        tagDoCargo: '868996000746979378',
        tagComprado: '868996098717515889',
        tagVip: '868996257014755328',
        gerenteRole: '722929097491087391',
        serverNumber: 7,
        identifier: ['9844be6f'],
        host: '131.196.196.197',
        port: '27260'
    },
    {
        name: 'surf',
        canalAlvo: 'surf',
        tagDoCargo: '824083721719250984',
        tagComprado: '835155862313500773',
        tagVip: '831891181822410764',
        gerenteRole: '824083184785555486',
        serverNumber: 8,
        identifier: ['d95e6f5f'],
        host: '131.196.196.197',
        port: '27110'
    },
    
];

const cargosCertos = ['vip', 'trial', 'mod', 'modplus', 'adm', 'admplus', 'supervisor', 'gerente', 'diretor', 'fundador'];

const servidoresHoras = ['awp', 'dr', 'jb', 'mix', 'retake', 'retakepistol'];

module.exports = {
    serversInfos,
    cargosCertos,
    servidoresHoras,
};
