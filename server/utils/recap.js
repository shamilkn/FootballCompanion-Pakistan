const fetch = require('node-fetch');

const RECAPTCHA_SERVER_KEY = "6LdJnDYaAAAAAHbx2jZK_RfdqQrTLdZksjH95gwL";
exports.verify = async (humanKey) => {
    try {
        return await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
            },
            body: `secret=${RECAPTCHA_SERVER_KEY}&response=${humanKey}`
        })
        .then(res => res.json())
        .then(json => json.success)
        .catch(err => {
        throw new Error(`Error in Google Siteverify API. ${err.message}`)
        })
    }
    catch (err) {
        throw err;
    }
}