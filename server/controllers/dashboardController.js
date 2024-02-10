const Note = require("../models/Notes");
const mongoose = require("mongoose");

/* GET Dashboard */
exports.dashboard = async (req, res) => {
    
  let perPage =6;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    const noteData = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: req.user._id } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      }
      ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec(); 

    const count = await Note.countDocuments({ user: req.user._id }); 

    res.render('dashboard/index', {
      userName: req.user.firstName,
      locals,
      noteData,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (error) { console.log(error); }

};
/* GET View Note */
exports.dashboardViewNote = async(req,res)=>{
    const note = await Note.findById({_id: req.params.id}).
    where({user: req.user.id}).lean();
    if(note){
        res.render('dashboard/view-note',{
            noteId: req.params.id,
            note,
            layout:'../views/layouts/dashboard'
        });
    }else{
        const locals = { message: "Something went wrong", };
        res.render('404',locals);
    }

};

/* PUT Update Note */

exports.dashboardUpdateNote = async(req,res)=>{
  try {
    await Note.findOneAndUpdate(
      {_id: req.params.id,},
      {title:req.body.title, body: req.body.body},
      {new:true}
    ).where({user: req.user._id}); 
    res.redirect('/dashboard');
  } catch (error) { console.log(error); }
};

/* Delete Delete Note */

exports.dashboardDeleteNote = async(req,res)=>{
  try {
    await Note.deleteOne({_id: req.params.id,}).where({user: req.user._id}); 
    res.redirect('/dashboard');
  } catch (error) { console.log(error); }
};

/* GET Add Note */
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};
/* POST Add Note */
exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};