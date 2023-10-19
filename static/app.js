document.addEventListener("DOMContentLoaded", function () {
    const shortenButton = document.getElementById("shortenButton");
    const longUrlInput = document.getElementById("longUrl");
    const shortUrlOutput = document.getElementById("shortUrl");
    const longUrlsList = document.getElementById("longUrlsList");

    // Display list of URLs already generated
    function displayLongUrls() {
        fetch("/list")
            .then((response) => response.json())
            .then((data) => {
                longUrlsList.innerHTML = "<h2>List of short URL -> long URL:</h2>";
                // loop through list
                for (const shortUrl in data) {
                    const longUrl = data[shortUrl];
                    longUrlsList.innerHTML += `<p>${shortUrl} &rarr; ${longUrl}</p>`;
                }
            })
            .catch((error) => {
                console.error(error);
                longUrlsList.innerHTML = "An error occurred while fetching the list.";
            });
    }
    // Listener for button
    shortenButton.addEventListener("click", () => {
        const longUrl = longUrlInput.value;
        // check that user input isn't empty
        if (longUrl.trim() === "") {
            shortUrlOutput.innerHTML = "Please enter a non-empty URL.";
            return;
        }

        // call shorten API
        fetch("/shorten", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ longUrl }),
        })
            .then((response) => response.json())
            .then((data) => {
                shortUrlOutput.innerHTML = `<a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>`;
            })
            .catch((error) => {
                console.error(error);
                shortUrlOutput.innerHTML = "An error occurred.";
            });
        // display list after dictionary is updated
        displayLongUrls();
    });
    // display list on page load
    displayLongUrls();
});
