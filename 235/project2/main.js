const API_KEY = "ilzCDb4pvfIUNWJWOkDTO2evNm9pYopHka9izhyC"
const API_URL = "https://api.nasa.gov/planetary/apod"
let url = "";
let count;
let data;
let startDate;
let endDate;


// url += API_URL;
// url += "?api_key=" + API_KEY;
// url += "&count=" + COUNT;

let form = document.querySelector("form");
let state = document.getElementById("status");
let gallery = document.getElementById("gallery");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
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
    // handle optional date logic
    if(count != "" && (startDate != "" || endDate != "" || date != ""))
    {
        WarnHTMLElement(document.querySelector("select"));
        state.innerHTML = "WARNING! Count cannot be used with date or start/end date"
        state.style.color = "255 0 0";
    }
    else if( data != "" && (startDate != "" || endDate != ""))
    {
        WarnHTMLElement(document.querySelector("input"));
        state.innerHTML = "WARNING! both date and start/end date cannot be used at the same time.";
        state.style.color = "255 0 0";  
    }
    else if(count === "" && startDate === "" && endDate === "" && date === "")
    {
        WarnHTMLElement(document.querySelector("select"));
        WarnHTMLElements(document.querySelectorAll("input"));
        state.innerHTML = "Please fill out some section of the form to generate images!";
        state.style.color = "255 0 0";  
    }
    else
    {
        for(element of document.querySelector("form"))
        {
            console.log(element);
            if(element.classList.contains("error"))
            {
                element.classList.remove("error");
            }
        }
        GetData(url);
    }
    url = "";
});



const GetData = (url) => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            url = "";
            for(let item of data)
            {   
                CreateHTMLElement(item);
            }
        })
    // reset url once we're done
}

const CreateHTMLElement = (content) => {
    let div = document.createElement("div");
    div.classList.add("spaceImage");

    let title = document.createElement("a");
    title.innerText = content.title;
    title.href = url;

    let date = document.createElement("i");
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