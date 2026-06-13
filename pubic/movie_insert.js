const movies=[
    {
        title:'Wednesday',
        preview:'assets/prev1.jpg',
        url:'https://archive.org/embed/youtube-wedzmDfWn60?autoplay=1&mute=1',
        description:'Keanu Reeves stars as a legendary retired assassin who is dragged back into the criminal underworld. Fueled by vengeance after gangsters steal his prized car and kill the beloved puppy left...',
        img:'assets/p6.png'
    },
    {
        title:'Peaky Blinders',
        preview:'assets/prev2.jpg',
        url:'https://www.youtube.com/embed/lcvUGs3xaDM?si=wpCn9EVjKoRmXhgL?autoplay=1&mute=1',
        description:'Set during World War II in 1940, the movie Peaky Blinders: The Immortal Man follows Tommy Shelby returning to a bombed-out Birmingham. Drawn into secret wartime missions, Tommy must confront his pastSet during World War II in 1940, the movie Peaky Blinders: The Immortal Man follows Tommy Shelby returning to a bombed-out Birmingham. Drawn into secret wartime missions, Tommy must confront his past',
        img:'assets/p7.jpg'
    },
    {
        title:'Psycho',
        preview:'assets/prev3.jpg',
        url:'https://archive.org/embed/turner_video_110813?autoplay=1&mute=1',
        description:'American Psycho follows Patrick Bateman, a wealthy, narcissistic investment banker. Beneath his polished, charming exterior, Bateman hides a psychopathic alter ego. ',
        img:'assets/p8.jpg'
    },
    {
        title:'Never Give Up',
        preview:'assets/prev4.jpg',
        url:'https://www.youtube.com/embed/FWoF3lA62LM?si=ouZQgzZfmNsiVlgy?autoplay=1&mute=1',
        description:'Never give up is a powerful mindset of resilience, determination, and unyielding courage. It means pushing forward despite challenges, setbacks, or failures. Instead of viewing obstacles as endpoints',
        img:'assets/p9.jpg'
    },
    {
        title:'The Boys',
        preview:'assets/prev5.jpg',
        url:'https://archive.org/embed/IronManTrailer?autoplay=1&mute=1',
        description:'The Boys is a satirical Amazon Prime Video series where superpowered individuals are corrupted by fame and controlled by a sinister corporation. It follows a team of human vigilantes, led by Billy Butcher',
        img:'assets/p10.jpg'
    },
    {
    title: "Interstellar",
    preview: "https://i.ytimg.com/vi/zSWdZVtXT7E/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1",
    description: "A team of explorers travels through a wormhole in search of humanity's future.",
    img: "https://upload.wikimedia.org/wikipedia/en/b/bc/Interstellar_film_poster.jpg"
  },

    {
        title:'Dhurandhar',
        preview:'assets/test2.jpg',
        url:'https://archive.org/embed/IronManTrailer?autoplay=1&mute=1',
        description:'The Boys is a satirical Amazon Prime Video series where superpowered individuals are corrupted by fame and controlled by a sinister corporation. It follows a team of human vigilantes, led by Billy Butcher',
        img:'assets/test.jpg'
    },
    {
    title: "Avengers: Endgame",
    preview: "https://i.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg",
    url: "https://www.youtube.com/embed/TcMBFSGVi1c?autoplay=1&mute=1",
    description: "The Avengers unite for one final battle against Thanos to restore the universe.",
    img: "https://upload.wikimedia.org/wikipedia/en/0/0d/Avengers_Endgame_poster.jpg"
  },
  
  
]


function createCards(genre,movieContainer){
    const container = document.getElementById(movieContainer);
    genre.forEach(function(movie){
        const button = document.createElement("button");
        
        button.innerHTML=`
        <div class="card  item" data-name="${movie.title}">
        <img src="${movie.img}">
        </div>
        `
        button.onclick = function(){
            save(
                movie.title,
                movie.preview,
                movie.url,
                movie.description
            );
        }
        container.appendChild(button)
    });
}

//create movie cards
createCards(movies,'movie_Container');