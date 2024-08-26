import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

class Post {
    #post;
    #date;
    #id;

    constructor(post, date ,id) {
        this.#post = post;
        this.#date = date;
        this.#id = id;
    }

    // Getter for post
    get post() {
        return this.#post;
    }

    // Setter for post
    set post(newPost) {
        this.#post = newPost;
    }

    // Getter for date
    get date() {
        return this.#date;
    }

    // Setter for date
    set date(newDate) {
        this.#date = newDate;
    }

    get id(){
        return this.#id;
    }
}
function isValidPost(post){
    if(post.length > 0){
        return true;
    }
    return false;

}
function formatDate(date) {
    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of year

    // Extract time components
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    // Convert hours from 24-hour to 12-hour format
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, '0') : '12'; // Hour '0' should be '12'

    // Format the date and time strings
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
}


 
const app = express();
const port = 3000;
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}));
var posts = [];
var postId = 0;



app.get('/', (req,res)=>{
    res.render('index.ejs',
        {
            posts:posts
        }
    );
})

app.post('/createpost', (req,res)=>{
    if(isValidPost(req.body['post'])){
        const date = new Date();
        const formattedDateTime = formatDate(date);
        const post = new Post(req.body['post'], formattedDateTime, ++postId);
        posts.push(post);
    }
    res.redirect('/' );
})


app.get('/edit', (req, res) => {
    var post;
    console.log(req.query.id);
    console.log(posts[0].id)
    for (let i =0; i<posts.length;i++){
        if(posts[i].id == req.query.id){
            console.log('found!')
            post = posts[i].post;
        }
    }
    res.render('edit.ejs',
        {
            post:post,
            id:req.query.id
        }
    )
});


app.post('/edit', (req, res) => {
    const newPost = req.body.post;
    const postId = req.body.id;

    for(let i=0;i<posts.length;i++){
        if(posts[i].id == postId){
            posts[i].post = newPost;
            console.log("Found and edited!")
        }
    }
    res.redirect('/')
});


app.post('/deletepost', (req,res)=>{
    const id = req.body.id;
    for(let i=0;i<posts.length;i++){
        if(posts[i].id == id){
            posts.splice(i,1);
            res.redirect('/');
        }
    }
})







app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });



