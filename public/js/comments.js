// making global variable to store user's name
let username 

// creating a socket.io instance... pass socket.io's url if it is on some another url
let socket = io()

// getting username
do {
    username = prompt('Enter your name: ')
} while(!username)

// Selecting DOM Elements

const textarea = document.querySelector('#textarea')
const submitBtn = document.querySelector('#submitBtn')
const commentBox = document.querySelector('.comment__box')
const ObjectID =  document.querySelector('#ObjectID').value
submitBtn.addEventListener('click', (e) => {
    e.preventDefault()
    let comment = textarea.value
    if(!comment) {
        return
    }
    
    // emitting comment with proper information to other connected sockets and saving to the database
    
    postComment(comment)
})

function postComment(comment) {

    // Append to dom

    let data = {
        ObjectID,
        username,
        comment 
    }
    
    appendToDom(data)
    textarea.value = ''
    
    // Emitting to other connected browsers
    
    broadcastComment(data)
    
    // Storing in MongoDB
    
    syncWithDb(data)

}

function appendToDom(data) {
    
    // creating a markup and appending to comments box
    
    let lTag = document.createElement('li')
    lTag.classList.add('comment', 'mb-3')

    let markup = `
                        <div class="card border-light mb-3">
                            <div class="card-body">
                                <h6>${data.username}</h6>
                                <p>${data.comment}</p>
                                <div>
                                    <img src="/img/clock.png" alt="clock">
                                    <small>${moment(data.time).format('LT')}</small>
                                </div>
                            </div>
                        </div>
    `
    lTag.innerHTML = markup

    commentBox.prepend(lTag)
}

function broadcastComment(data) {
    // Socket
    socket.emit('comment', data)
}

socket.on('comment', (data) => {
    appendToDom(data)
})

// making a debouncing function which can prevent immediately removing of 'person is typing' message from the DOM

let timerId = null
function debounce(func, timer) {
    if(timerId) {
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}

// adding text in DOM and removing it after 1 second of last emit using a method known as 'debouncing'

let typingDiv = document.querySelector('.typing')

socket.on('typing', (data) => {
    typingDiv.innerText = `${data.username} is typing...`
    debounce(function() {
        typingDiv.innerText = ''
    }, 1000)
})

// Event listner on textarea
textarea.addEventListener('keyup', (e) => {
    socket.emit('typing', { username })
})

// Api calls 

function syncWithDb(data) {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/comments', { method: 'POST', body:  JSON.stringify(data), headers})
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}
function fetchComments () {
    fetch('/api/comments')
        .then(res => res.json())
        .then(result => {
            result.forEach((comment) => {
                comment.time = comment.createdAt
                appendToDom(comment)
            })
        })
}

window.onload = fetchComments;