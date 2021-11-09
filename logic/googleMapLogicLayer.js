const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

function getMapLoader() {
    const loader = new mapLoader({
        apiKey: GOOGLE_API_KEY,
        version: 'weekly',
    });
    return loader
}

module.exports = {
    getMapLoader
};