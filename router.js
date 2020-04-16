const router = require('express').Router();
const db = require("./data/db");

// ROOT = /api/posts

// When the client makes a POST request to /api/posts:
router.post('/', (req, res) => {
    const post = req.body;
    console.log("new post:", post);
    // If the request body is missing the title or contents property:
    if (!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
   } 
    db.insert(post)
    // If the information about the post is valid:
    .then(response => {
        res.status(201).json(response);
    })
    // If there's an error while saving the post:
    .catch(err => {
        console.log('Error!', err);
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    });
});

// When the client makes a POST request to /api/posts/:id/comments:
router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const comment = { ...req.body, post_id: id };
    // If the request body is missing the text property:
    if (!comment.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    }

    db.findById(id)
    .then(post => {
        // If the post with the specified id is not found:
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
        db.insertComment(comment)
        .then(response => {
            res.status(201).json(comment)
        })
        .catch(err => {
            console.log("Error!", err);
            res.status(500).json({ error: "There was an error while saving the comment to the database" });
        })
    })
});

// When the client makes a GET request to /api/posts:
router.get('/', (req, res) => {
    db.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    // If there's an error in retrieving the posts from the database:
    .catch(err => {
        console.log("Error!", err);
        res.status(500).json({ error: "The posts information could not be retrieved." });
    })
})

// When the client makes a GET request to /api/posts/:id:
router.get('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        // If the _post_ with the specified `id` is not found:
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
        res.status(200).json(post)
    })
    // If there's an error in retrieving the post from the database:
    .catch(err => {
        console.log("Error!", err);
        res.status(500).json({ error: "The post information could not be retrieved." });
    });
});

// When the client makes a `GET` request to `/api/posts/:id/comments`:
router.get('/:id/comments', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        // If the _post_ with the specified `id` is not found:
        if (!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        };
        db.findPostComments(id)
        .then(comments => {
            res.status(200).json(comments);
        })
        // If there's an error in retrieving the comments from the database:
        .catch(err => {
            console.log("Error!", err);
            res.status(500).json({ error: "The comments information could not be retrieved." });
        });
    });
});

// When the client makes a `DELETE` request to `/api/posts/:id`:
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(post => {
        db.remove(id)
        .then(num => {
            if (num > 0) {
                res.status(200).json(post);
            } else {
                // If the post with the specified id is not found:
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        // If there's an error in removing the post from the database:
        .catch(err => {
            console.log("Error!", err)
            res.status(500).json({ error: "The post could not be removed." })
        })
    })
})

// When the client makes a `PUT` request to `/api/posts/:id`:

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const update = req.body;
    // If the request body is missing the `title` or `contents` property:
    if (!update.title || !update.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
    };
    db.findById(id)
    .then(post => {
        // If the _post_ with the specified `id` is not found:
        if(!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        } else {
        db.update(id, update)
        .then(data => {
            db.findById(id)
            .then(post => {
                res.status(200).json(post);
            })
            .catch(err => {
                console.log(err)
            })
        })
        .catch(err => {
            console.log("Error!", err);
            res.status(500).json({ error: "The post information could not be modified." });
        });
    }});
});

module.exports = router;