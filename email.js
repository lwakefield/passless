const ENDPOINT = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}`
const base64 = v => (new Buffer(v)).toString('base64')

module.exports = function sendEmail ({from, to, html}) {
    const body = JSON.stringify({ from, to, html })
    const headers = {
        Authorization: `Basic: ${base64(process.env.MAILGUN_API_KEY)}`
    }
    return fetch(
        `${ENDPOINT}/messages`,
        { method: 'POST', headers, body }
    )
}
