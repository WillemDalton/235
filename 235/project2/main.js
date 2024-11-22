// api stuff
const API_KEY = "ilzCDb4pvfIUNWJWOkDTO2evNm9pYopHka9izhyC"
const API_URL = "https://api.nasa.gov/planetary/apod"
let url = "";
let data;

// html nodes
let form = document.querySelector("form");
let state = document.getElementById("status");
let gallery = document.getElementById("gallery");
let countElement = document.getElementById("count");
let dateElement = document.getElementById("date")
let startDateElement = document.getElementById("startdate");
let endDateElement = document.getElementById("enddate");

// calulate our today's date for future api logic
let dateToday = new Date()
let day = dateToday.getDate();
let month = dateToday.getMonth() + 1;
let year = dateToday.getFullYear();
dateToday = `${year}-${month}-${day}`; 

// check our local storage to see if any values are saved, also holds some update logic for query buttons
const checkStorage = (storedData, dataKey, elementToChange) =>
{
    if(storedData)
    {
        elementToChange.value = storedData
    }
    elementToChange.onchange = e=>
    { 
        GrayOutOptions(elementToChange);
        HighlightSelected(elementToChange);
        localStorage.setItem(dataKey, e.target.value); 
    };
}

//  count of random images to create
let count;
const storedCount = localStorage.getItem("count");
checkStorage(storedCount, "count", countElement);

// date
let date;
const storedDate = localStorage.getItem("date");
checkStorage(storedDate, "date", dateElement);

// start date and end date of range
let startDate;
const storedStart = localStorage.getItem("startDate");
checkStorage(storedStart, "startDate", startDateElement);
let endDate;
const storedEnd = localStorage.getItem("endDate");
checkStorage(storedEnd, "endDate", endDateElement);

form.addEventListener("submit", (e) => {
    e.preventDefault();
    state.innerHTML = 'Loading...';

    // clear gallery beofre trying to load new images
    gallery.innerHTML = '';
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

    /* simple error handling for some scenario */
    // if we fill out count along with other data.
    if(count != "" && (startDate != "" || endDate != "" || date != ""))
    {
        WarnHTMLElement(document.querySelector("select"));
        state.innerHTML = "WARNING! Count cannot be used with date or start/end date"
        state.style.color = "255 0 0";
    }
    // if we fill out both range date and given date
    else if( date != "" && (startDate != "" || endDate != ""))
    {
        WarnHTMLElement(document.querySelector("input"));
        state.innerHTML = "WARNING! both date and start/end date cannot be used at the same time.";
        state.style.color = "255 0 0";  
    }
    // if we fill out nothing
    else if(count === "" && startDate === "" && endDate === "" && date === "")
    {
        WarnHTMLElement(document.querySelector("select"));
        WarnHTMLElements(document.querySelectorAll("input"));
        state.innerHTML = "Please fill out some section of the form to generate images!";
        state.style.color = "255 0 0";  
    }
    // if we pick a start date too early
    else if((startDate != "") && (startDate < "1995-06-16"))
    {
        WarnHTMLElement(document.getElementById("startDate"));
        state.innerHTML = "Please pick a start date after June 16th, 1995!";
        state.style.color = "255 0 0";  
    }
    // if we pick a day that hasn't happened...yet?
    else if((endDate != "") && (endDate > dateToday))
    {
        WarnHTMLElement(document.getElementById("endDate"));
        state.innerHTML = `please pick a valid date that has already occured. Use "today" for today's image.`;
        state.style.color = "255 0 0";  
    }
    else
    {
        for(element of document.querySelector("form"))
        {
            if(element.classList.contains("error"))
            {
                element.classList.remove("error");
            }
        }
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
            if(data.length > 1)
            {
                for(let item of data)
                {   
                    CreateHTMLElement(item);
                }
            }
            else 
            {
                CreateHTMLElement(data);
            }
            state.innerHTML = '';
        })
}

//create HTMl element based on data we are given from API
const CreateHTMLElement = (content) => {
    let div = document.createElement("div");
    div.classList.add("spaceImage");

    let title = document.createElement("a");
    title.target = "_blank"
    title.innerText = content.title;
    title.href = content.url;

    let date = document.createElement("h4");
    date.innerHTML = content.date;

    let description = document.createElement("p");
    description.innerHTML = content.explanation;

    let image = document.createElement("img");
    image.src = content.url;

    console.log(content)

    div.appendChild(image);
    div.appendChild(title);
    div.appendChild(date);
    div.appendChild(description);
    gallery.appendChild(div);
}

// warn an element with conflicting data that could cause an error
const WarnHTMLElement = (element) => {
    element.classList.add("error");
}

// for when we want to warn the children of an element
const WarnHTMLElements = (elements) => {
    for(let item of elements)
    {
        item.classList.add("error");
    }
}

// gray out invalid options in
const GrayOutOptions = (element) => {
    let options = document.querySelectorAll("#searchoptions > *");
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
                    console.log(option);
                    option.classList.remove("ignored");
                }
    }
}

const HighlightSelected = (element) => {

} 