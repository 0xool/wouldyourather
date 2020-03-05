const config = {
    production : {
        SECRET : process.env.SECRET,
        DATABASE : process.env.MONGODB_URI
    },
    default : {
        SECRET : '12340987',
        DATABASE : 'mongodb://127.0.0.1:27017/wouldYouRatherDB'
    }
}


exports.get = function get(env){
    return config[env] || config.default
}