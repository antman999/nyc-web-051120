console.log("objects are cool I guess")

/*-----------------------------------------------------------------------*/

document.addEventListener('DOMContentLoaded', function(e){
  const baseUrl = "http://localhost:3000/api/v1/movies"
  const movieList = document.getElementById('movie-list')

  
  function clickHandler(){
    document.addEventListener("click", function(e){
      if(e.target.matches(".up-vote")){
        const button = e.target
        const id = parseInt(button.parentNode.dataset.id)

        const scoreSpan = button.parentNode.querySelector("span")
        const newScore = parseInt(scoreSpan.textContent) + 1

        fetch(`${baseUrl}/${id}`,{
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            "accept": "application/json"
          },
          body: JSON.stringify({ score: newScore })
        })
        .then(response => response.json())
        .then(movieObj => {
          // scoreSpan.textContent = newScore
          const movie = Movie.find(id)
          movie.increaseScore()
        })

      } else if(e.target.textContent === "×"){

        const movieLi = e.target.parentNode
        const id = movieLi.dataset.id

        // movieLi.remove() // optimistic rendering

        fetch(`${baseUrl}/${id}`,{
          method: "DELETE"
        })
        .then(response => response.json())
        .then(() => {
          // instantiate a movie
          // call movie.remove

          const movie = Movie.find(id)
          movie.remove()
        })
        
      } else if(e.target.matches("#show-form")){
        const button = e.target
        button.textContent = 'Hide Form'
        button.id = 'hide-form'

        const newMovieForm = document.createElement('form')
        newMovieForm.innerHTML = `
          <label>Title: </label>
          <input type="text" name="title">
          <br>
          <label>Year: </label>
          <input type="text" name="year">
          <br>
          <label>Genre: </label>
          <input type="text" name="genre">
          <br>
          <label>Image URL: </label>
          <input type="text" name="imageUrl">
          <br>
          <input type="submit" value="Add Movie">
        `

        button.insertAdjacentElement("afterend", newMovieForm)
      } else if(e.target.matches("#hide-form")){
        const button = e.target
        const newMovieForm = document.querySelector('form')
        newMovieForm.remove()

        button.textContent = 'Show Form'
        button.id = 'show-form'
      }
    })
  }
  
  const submitHandler = () => {
    document.addEventListener('submit', e => {
      e.preventDefault()
      const form = e.target
      
      const title = form.title.value
      const genre = form.genre.value
      const year = form.year.value
      const imageUrl = form.imageUrl.value
      const score = 0

      const movieObj = {
        title: title,
        genre: genre,
        year: year,
        imageUrl: imageUrl,
        score: score
      }

      form.reset()

      // fetch request
      fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(movieObj)
      })
      .then(response => response.json())
      .then(movie => {
        // pessimistic rendering
        const movieLi = createMovieLi(movie)
        renderMovie(movieLi)
      })
      .catch(error => {
        console.log("There was an error: \n", error)
      })
    })
  }
  

  const getMovies = () => {
    fetch(baseUrl)
    .then(response => response.json())
    .then(movieCollection => {
      // renderMovies(movieCollection)
      // 1. turn each object into a proper Movie instance
      // 2. iterate over those Movie instances and call "render" on them

      const movies = Movie.instantiateMovies(movieCollection) // => rudimentary ORM
      Movie.renderMovies(movies, movieList)
    })
    .catch(error => {
      console.log("There was an error: \n", error)
    })
  }
  
  
  // renderMovies(movies)
  getMovies()
  clickHandler()
  submitHandler()
})

// As a user, when I see the page load I should see all the movies from the db on the DOM

// 1. create a function to do a fetch request to get all the movies
// 2. when that function is invoked, it should render all the movie data to the DOM


// As a user, when I enter movie data into the new movie form and click "Add Movie", that movie should appear on the DOM and it should persist across page reloads