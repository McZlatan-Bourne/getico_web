#!/usr/bin/env python

from flask import Flask
from flask import *
import urllib2
import re

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        webpage = request.form["webpage_url"]
        page_type = request.form["page_type"]
        img_format = request.form["img_format"]
        try:
            if webpage.find("http://www.") == -1:
                error = "Invalid url. Url should contain \"http://www.\" or \"https://www.\""
                return render_template("getico.html", error=error)
            elif webpage.find("http://") == 0:
                try:
                    if page_type == "other_page":
                        error = "Supports only home pages for now"
                        return render_template("getico.html", error=error)
                    elif page_type == "home_page":
                        headers = {'User-Agent': 'Mozilla/5.0'}
                        src = urllib2.urlopen(urllib2.Request(webpage, None, headers)).read()
                        pat = re.compile ('<img [^>]*src="([^"]+)')
                        img = pat.findall(src)
                        return render_template("result.html", img=img, webpage=webpage)
                    else:
                        error = "What???"
                        return render_template("getico.html", error=str(error))
                except Exception as error:
                    return render_template("getico.html", error=str(error))
            else:
                error = "What???"
                return render_template("getico.html", error=str(error))
        except Exception as error:
            return render_template("getico.html", error=str(error))
    else:
        return render_template("getico.html")


if __name__ == "__main__":
    app.run(debug=True)
