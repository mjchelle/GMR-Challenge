from flask import Flask, request, jsonify, redirect, render_template, url_for
import string
import random

app = Flask(__name__)

#Dictionary
dict = {}

# Generates random short url.
def generate_short_url():
    characters = string.ascii_letters + string.digits
    # loops until it finds a short url that doesn't already exist in the dictionary
    while True:
        short_url = ''.join(random.choice(characters) for _ in range(6))
        if short_url not in dict:
            return short_url

# Shorten URL
@app.route("/shorten", methods=["POST"])
def shorten_url(): 
    # get long URL
    data = request.get_json()
    long_url = data.get("longUrl")
    if not long_url:
        return jsonify({"error": "Invalid request."}), 400
    
    # make sure long URL starts with "http://" to ensure correct redirecting
    if not long_url.startswith('http://') and not long_url.startswith('https://'):
        long_url = 'http://' + long_url

    # check if long URL has already been shortened
    for short, long in dict.items():
        if long == long_url:
            return  jsonify({"shortUrl": url_for("redirect_to_long_url", short_url=short)}), 200

    short_url = generate_short_url()
    # store pairing in dict
    dict[short_url] = long_url
    return jsonify({"shortUrl": f"/{short_url}"}), 200

# Redirect short URL to long URL
@app.route("/<short_url>")
def redirect_to_long_url(short_url):
    long_url = dict.get(short_url)
    
    if long_url:
        return redirect(long_url, code=302)
    return "URL not found.", 404

# List existing pairings 
@app.route("/list")
def list_urls():
    long_urls = {short_url: long_url for short_url, long_url in dict.items()}
    return jsonify(long_urls), 200


@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()
