import  express  from 'express'
import path from 'path';

import { title } from 'process';
import { fileURLToPath } from 'url';
const app = express();
const port = 3000;
// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

let posts = [
    {
        id: 10,
        title: "My first Post ",
        content: "This is the content of my first post.",
        timestamp: new Date().toLocaleString(),
     },   
]

app.get('/', (req, res) => {
    res.render("index", { posts });
});

app.get('/posts/new',(req,res) =>{
    res.render("new.ejs")

})

app.post("/posts",(req,res) =>{
    const { title, content } = req.body;
    posts.push({
        id: Date.now(),
        content,
        timestamp: new Date().toLocaleString()
    })
    res.redirect('/')
})

app.get('/posts/:id/edit', (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).send('Post not found try to create one');
    }
    res.render('edit.ejs', { post });
  });



  app.post('/posts/:id', (req, res) => {
    const { title, content } = req.body;
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
      return res.status(404).send('Post not found try to create one');
    }
    post.title = title;
    post.content = content;
    post.timestamp = new Date().toLocaleString(); // Update timestamp
    res.redirect('/');
  });
  app.post('/posts/:id/delete', (req, res) => {
    posts = posts.filter(p => p.id !== parseInt(req.params.id));
    res.redirect('/');
  });

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});