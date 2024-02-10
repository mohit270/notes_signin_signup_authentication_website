// GET/ HOMEPAGE

exports.homePage = async(req,res)=>{
    const locals = {
        title: "Notes App",
        description: "Free NodeJs Notes APP"
    };
    res.render("index",{
        locals,
        layout: '../views/layouts/front-page',
    });
};

exports.about = async(req,res)=>{
    const locals = {
        heading:"welecome to about section",
    };
    res.render("about",locals);
};
