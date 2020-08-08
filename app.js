var exp = require("express"),
    db = require("mongoose"),
    bp = require("body-parser"),
    es = require("express-sanitizer"),
    mo = require("method-override"),
    a = exp();
db.set('useUnifiedTopology',true);
db.connect("mongodb://localhost:27017/blogpost1",{useNewUrlParser: true});
a.use(exp.static("public"));
a.use(bp.urlencoded({extended:true}));
a.set("view engine","ejs");
a.use(es());
a.use(mo("_method"));

var nsch =  new db.Schema({
    title:String,
    img : String,
    body: String,
    created: { type: Date , default:Date.now }
});

var blog = db.model("blog",nsch);

//Uncomment the below lines to seed the database with test data.
// var newobj = {  title:"First blog Post",
//                 img:"https://www.incimages.com/uploaded_files/image/970x450/getty_883231284_200013331818843182490_335833.jpg",
//                 body:"A brief description is given in the main page. Rest of the information is provided in the inside pages."};    
// blog.create(newobj,function(err,res){
//     if(err){
//         console.log(err);
//     }
//     else{
//         console.log(res);
//     }
// });

a.get("/",function(req,res){
    res.redirect("/blogs");
})
a.get("/blogs",function(req,res){
    blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blogs:blogs});
        }    
    });
});
a.get("/blogs/new",function(req,res){
    res.render("new");
});
a.post("/blogs",function(req,res){
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});
a.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id,function(err,blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog:blog});
        }
    })
});
a.get("/blogs/:id/update",function(req,res){
    blog.findById(req.params.id,function(err,blog){
        if(err){
            res.redirect("/");
        }
        else{
            res.render("update",{blog:blog});
        }
    });    
});
a.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }  else {
            res.redirect("/blogs/" + req.params.id);
        }
     });
});

a.delete("/blogs/:id",function(req,res){
    blog.findByIdAndDelete(req.params.id,function(err,ans){
        if(err){
            res.render("show"+ req.params.id);
        }
        else{
            res.redirect("/");
        }
    });
});
a.listen(3000,function(req,res){
    console.log("server started port 3000");
})
