const vkController = require('./vkController.js')
module.exports = {
    signin: async (req, res) => {
        await vkController.getAuthCode(req, res);
        await vkController.getAcessToken(req, res);
    },
    uploadDocument: async (req, res) => {
        if (req.session.access_token) {
            let serverUpload = await vkController.getUploadServerUrl(req.session.access_token);
            await vkController.uploadDoc(req, res, serverUpload.url);
        } else {
            res.json({status: 0, message: 'Вам необходимо авторизироваться'}).status(200);
        }
    }
}
