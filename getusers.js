const   http = require('http');
const   config = require('./config.js')
const   request	= require('superagent');

class apiCall {
    constructor() {
        this.ft_uid = config.ft_uid,
        this.ft_secret = config.ft_secret,
        this.client_type = config.credentials,
        this.user = "",
        this.res = []
    }

    authorize() {
        return new Promise ((resolve, reject) => {
            request
                .post('https://api.intra.42.fr/oauth/token')
                .send(
                    {
                        grant_type: this.client_type,
                        client_id: this.ft_uid,
                        client_secret: this.ft_secret
                    })
                .then((res) => {
                        console.log('Successfully Authenticated')
                        resolve(res.body);
                    })
                    .catch((err) => {
                        console.log('Rejected Token')
                        reject(err)
                    })
        });
    }

    fetchApi(token) {
        return (
            request
            .get('https://api.intra.42.fr/v2/users/' + this.user)
            .send({ access_token: token.access_token })
            .then((res) => {
                var temp = res
                this.res.push(temp)
            })
            .catch((err) => {
                console.log('user not found :/')
            })
        )
    }

    getResult() {
        console.log(this.res)
    }

    init(user) {
        this.user = user
        this.authorize()
        .then((token) => {
            this.fetchApi(token)
        })
        .catch((err) => {
            console.log('Error in authentication')
        })
    }
}

var api = new apiCall()
api.init('ckrommen')
api.getResult()
