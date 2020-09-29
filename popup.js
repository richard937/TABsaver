var links = document.getElementById("link");

let array = [];     // array = ['0', 1', '2', '3', '4', '5', ....];
let len;
const cutoffLength = 55;

// get the how many tabs were open last time
chrome.storage.sync.get("no_of_tabs", function (data) {
    if (!chrome.runtime.lastError) {
        len = data["no_of_tabs"];
        if (len != undefined) {
            for (let index = 0; index < len; index++)
                array.push(index.toString());

            // get the last saved urls
            chrome.storage.sync.get(array, function (data) {
                if (!chrome.runtime.error) {
                    // console.log(data);
                    for (let i = 0; i < len; i++) {
                        //console.log(data[array[i]]);
                        let url = data[array[i]].url;
                        let title = data[array[i]].title;
                        let link = document.createElement("a");
                        let tr = document.createElement("tr");
                        let td = document.createElement("td");

                        link.setAttribute("href", url);
                        link.setAttribute("target", "blank");
                        if (title.length > cutoffLength)
                            link.textContent = `${title.slice(0, cutoffLength)}...`;
                        else
                            link.textContent = title;

                        td.appendChild(link);
                        tr.appendChild(td);
                        links.appendChild(tr);
                    }
                }
            })
        }
    } else {
        console.log('error');
    }
});

// get all the tabs and save
document.getElementById("save").onclick = () => {
    //console.log("save clicked");
    chrome.storage.sync.clear(function () {
        if (!chrome.runtime.lastError) {

            chrome.tabs.query({}, function (tabs) {
                len = tabs.length;
                chrome.storage.sync.set({ "no_of_tabs": len, }, () => {
                    if (!chrome.runtime.error)
                        console.log("saved it !!");
                });
                //tabs.forEach(function (tab) 
                for (let i = 0; i < len; i++) {
                    let tab = tabs[i];
                    let key = i.toString();

                    let obj = {
                        [key]: {
                            url: tab.url,
                            title: tab.title,
                        },
                    }
                    // console.log(obj);
                    chrome.storage.sync.set(obj, () => {
                        if (!chrome.runtime.error)
                            console.log("saved it !!");
                    });
                }
            });
        }
    });

};

document.getElementById("show").onclick = () => {
    console.log("show clicked");
    chrome.tabs.query({}, function (tabs) {

        tabs.forEach(function (tab) {
            let title = tab.title;
            let url = tab.url;
            let link = document.createElement("a");
            let tr = document.createElement("tr");
            let td = document.createElement("td");

            link.setAttribute("href", url);
            link.setAttribute("target", "blank");
            if (title.length > cutoffLength)
                link.textContent = `${title.slice(0, cutoffLength)}...`;
            else
                link.textContent = title;

            td.appendChild(link);
            tr.appendChild(td);
            links.appendChild(tr);

        });
    });
}

document.getElementById("remove").onclick = () => {
    console.log("remove clicked");

    chrome.storage.sync.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
    links.setAttribute("style", "display: none;");
}


// chrome.windows.getAll({ populate: true }, function (windows) {
//     windows.forEach(function (window) {
//         window.tabs.forEach(function (tab) {
//             //collect all of the urls here, I will just log them instead
//             console.log(tab.url);
//         });
//     });
// });

//TO-DO 1
/*
1. parse the url to get a proper name
2. save in local chrome storage
3. clear storage before save
4. save button
5. maybe a table
6. link not clicking
7. front-end fix

// TO-DO 2
3. checkbox to select which ones to save

*/



