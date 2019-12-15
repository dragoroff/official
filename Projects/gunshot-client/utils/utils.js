module.exports = {
    cleanURL: function (domain) {
        const options = ["https://www.", "http://www.", "https://", "http://", "www."];
        for (let i of options) {
            if (domain.indexOf(i) !== -1) {
                return domain.split(i)[1];
            }
        }
        return domain;
    }
};