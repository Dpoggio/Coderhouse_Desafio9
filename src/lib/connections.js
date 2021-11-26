
exports.mariaDb = {
    client: 'mysql',
    connection: { 
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test'
    }
}

exports.sqlite = {
    client: 'sqlite3',
    connection: { filename: './DB/ecommerce.db'}
}