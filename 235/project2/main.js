// api stuff
const API_KEY = "ilzCDb4pvfIUNWJWOkDTO2evNm9pYopHka9izhyC"
const API_URL = "https://api.nasa.gov/planetary/apod"
let url = "";
let data;

// html nodes
let form = document.querySelector("form");
let state = document.querySelector("#status");
let gallery = document.querySelector("#gallery");
let countElement = document.querySelector("#count");
let dateElement = document.querySelector("#date");
let startDateElement = document.querySelector("#startdate");
let endDateElement = document.querySelector("#enddate")

// calulate our today's date for future api logic
let dateToday = new Date();
let day = dateToday.getDate();
let month = dateToday.getMonth() + 1;
let year = dateToday.getFullYear();
dateToday = `${year}-${month}-${day}`; 

//data
let count;
let date;
let startDate;
let endDate;

// Load saved gallery
document.addEventListener("DOMContentLoaded", () => {
    let storedGallery = localStorage.getItem("gallery");
    if(storedGallery)
    {
        gallery.innerHTML = storedGallery;
        state.innerHTML = '';
    }
    else
    {
        gallery.innerHTML = "";
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault();
    state.innerHTML = 'Loading...';
    gallery.innerHTML = "";

    // grab all form data
    let formData = new FormData(form);
    let formArray = Object.fromEntries(formData);

    count = formArray.count;
    date = formArray.date;
    startDate = formArray.startdate;
    endDate = formArray.enddate;

    url += API_URL;
    url += "?api_key=" + API_KEY;
    if(count != "")
    {
        url +=  "&count=" + count;
    }
    else if(date != "")
    {
        url += "&date=" + date;
    }
    else if(startDate != "")
    {
        url +=  "&start_date=" + startDate;
    }
    if(endDate != "")
    {
        url +=  "&end_date=" + endDate;
    }

    /* simple error handling...realistically, none of this should happen with display: none, but it's good to be safe*/
    // if we fill out nothing
    if(count === "" && startDate === "" && endDate === "" && date === "")
    {
        state.innerHTML = "Please fill out some section of the form to generate images!";
        state.style.color = "255 0 0";  
    }
    // if we pick a falsy start date
    else if((startDate != "") && ((startDate < "1995-06-16") || (startDate > dateToday) || (startDate > endDate)))
    {
        state.innerHTML = "Please pick a valid start date, date is too early or too late!";
        state.style.color = "255 0 0";  
    }
    // if we pick a falsy end date
    else if((startDate != "") && ((startDate < "1995-06-16") || (startDate > dateToday) || (endDate < startDate)))
    {
        state.innerHTML = `please pick a valid end date.`;
        state.style.color = "255 0 0";  
    }
    // if we pick a falsy date
    else if((date != "") && ((date < "1995-06-16") || (date > dateToday)))
    {
        state.innerHTML = "Please pick a valid date!";
        state.style.color = "255 0 0";  
    }
    else
    {
        GetData(url);
    }
    url = "";
});

// fetch data from API
const GetData = (url) => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // reset url
            url = "";
            if(data != undefined)
            {
                if(data.length > 1)
                {
                    for(let item of data)
                    {   
                        CreateHTMLElement(item);
                    }
                }
                else if(data[0] != undefined)
                {
                    CreateHTMLElement(data[0]);
                }
                else 
                {
                    CreateHTMLElement(data);
                }
            }
    
            localStorage.setItem("gallery", gallery.innerHTML);
            state.innerHTML = '';
        })
}

//create HTMl element based on data we are given from API
const CreateHTMLElement = (content) => {
    let div = document.createElement("div");
    div.classList.add("spaceImage");

    let media;
    if(content.media_type === "video")
    {
        media = document.createElement("iframe");
        media.width = "320";
        media.height = "240";
        media.src = content.url;   
    }
    else {
        media = document.createElement("img");
        media.src = content.url;
    }
    
    let title = document.createElement("a");
    title.target = "_blank"
    title.innerText = content.title;
    title.href = content.url;
    
    let date = document.createElement("h4");
    date.innerHTML = content.date;
    
    let description = document.createElement("p");
    description.innerHTML = content.explanation;
    
    div.appendChild(media);
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(description);
    gallery.appendChild(div);
}

// gray out invalid options in
const HideOptions = (element) => {

    let options = document.querySelectorAll("form > select, form input:not(#submit)");
    // run through all our search options
    for(let option of options)
    { 
        // if our option isn't the one thats changed, we want to gray it out.
        if(option != element)
        {
            // ...unless it's a start or end date, because those two go together.
            if((option === startDateElement || option === endDateElement) && (element === startDateElement || element === endDateElement))
            {
                break;
            }
            else {
                option.classList.add("ignored"); 
            }
        }
    }

    // if our element is empty, un gray them out!
    if(element.value == "")
    {
            for(let option of options)
            {
                option.classList.remove("ignored");
            }
    }
}

countElement.onchange = ()=>HideOptions(countElement);
dateElement.onchange = ()=>HideOptions(dateElement);
startDateElement.onchange = ()=>HideOptions(startDateElement);
endDateElement.onchange = ()=>HideOptions(endDateElement);