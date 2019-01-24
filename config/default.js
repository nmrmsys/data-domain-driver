
module.exports.ddd = {
    options: {
    },
    domains: {
        other: {path: 'oth'}
    },
    databases: {
        default: 'local',
        local: {
            DriverName: 'sqlite',
            Database: 'local.sqlite'
        },
        postgres: {
            DriverName: 'postgres',
            Username: 'user',
            Password: 'password',
            Hostname: 'host',
            Port: 5432,
            Database: 'database'
        }
    }
}
