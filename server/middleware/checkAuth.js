exports.isLoggedIn = function(req,res,next){
    if(req.user){
        next();
    }else{
        const locals = {message: "Access Denied"};
        return res.status(401).render('404',locals);
    }
}