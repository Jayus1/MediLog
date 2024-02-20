const Model = require("./Model");
const DB = require('../Utils/db_connect');
const Builder = require('../Utils/query_helper');
const bcrypt = require('bcrypt');
const salt_level = 10;

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
        ];
    }
    async insert(data = null) {
        if (!data) return [{ 'success': false, 'error': 'Campos Obligatorios.', 'status': 400 }];

        try {
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
            ];
            const salt = await bcrypt.genSalt(salt_level);
            const hashed_password = await bcrypt.hash(this.data.contrasena, salt);
            if (!hashed_password) res.json({ 'success': false, 'error': 'Por favor, Intentar Otra Contraseña', 'status': 400 });

            this.values[2] = hashed_password;

            const query = new Builder(this.table);
            const [results, fields] = await DB.execute(query.insert_query(this.columns, this.values), this.values);
            return results;
        } catch (error) {
            return [{ 'success': false, 'error': `${error}`, 'status': 500 }];
            // return [{ 'success': false, 'error': 'Campos Obligatorios o Invalidos.' }];
        }

    }
    async update(data = {}, id = null) {
        if (!id) return [{ 'success': false, 'error': 'Registro No Existe.', 'status': 400 }];

        try {
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
            ];
            const query = new Builder(this.table);
            const [results, fields] = await DB.execute(query.update_query(this.columns, this.values, id), this.values)
            return results;
        } catch (error) {
            return [{ 'success': false, 'error': `${error}`, 'status': 500 }];
            // return [{ 'success': false, 'error': 'Campos Obligatorios o Invalidos.' }];
        }

    }
    async authenticate(correo = null) {
        if (!correo) return [{ 'success': false, 'error': 'Correo de Usuario Obligatorio.', 'status': 400 }];

        try {
            this.correo = correo
            const query = new Builder(this.table);
            const [results, fields] = await DB.execute(query.select_query('contrasena', 'correo'), [this.correo]);
            return results;
        } catch (error) {
            return [{ 'success': false, 'error': `${error}`, 'status': 500 }];
            // return [{ 'success': false, 'error': 'Campos Obligatorios o Invalidos.' }];
        }

    }
}

module.exports = Usuario;