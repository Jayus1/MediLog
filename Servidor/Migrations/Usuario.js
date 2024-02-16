const Model = require("./Model");
const DB = require('../Utils/db_connect');
const Builder = require('../Utils/query_helper');

class Usuario extends Model {
    constructor() {
        super('usuarios');
        this.columns = [
            'member_id',
            'correo',
            'contrasena',
            'tipo',
            'plan',
            'metodo_pago',
            'datos_financieros',
            'cvv',
            'fecha_expiracion',
            'eliminado',
            // 'fecha'
        ];
    }
    async insert(data = {}) {
        this.data = data;
        this.values = [
            this.data.member_id,
            this.data.correo,
            this.data.contrasena,
            this.data.tipo || 'Paciente',
            this.data.plan || null,
            this.data.metodo_pago || null,
            this.data.datos_financieros || null,
            this.data.cvv || null,
            this.data.fecha_expiracion || null,
            this.data.eliminado || false,
            //this.data.fecha || '2024-05-05'
        ];
        const query = new Builder(this.table);
        const [results, fields] = await DB.execute(query.insert_query(this.columns, this.values), this.values);
    }
}

module.exports = Usuario;