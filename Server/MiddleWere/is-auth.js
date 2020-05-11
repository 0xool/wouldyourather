
module.exports = (req,res,next) => {
    if(req.isLoggedIn == 'false') {
        return res.status(200).json({
            message: 'User is not authenticated to view',
            auth:false,
        })
    }
    next()
}