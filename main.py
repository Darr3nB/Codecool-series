from flask import Flask, render_template, url_for, request
from data import queries
import math
from dotenv import load_dotenv
import util

load_dotenv()
app = Flask('codecool_series')


@app.route('/')
def index():
    shows = queries.get_shows()
    return render_template('index.html', shows=shows)


@app.route('/design')
def design():
    return render_template('design.html')


@app.route("/shows/most-rated")
def most_rated():
    if request.method == "GET":
        most_rated_shows = util.most_rated_shows()
        print(most_rated_shows)

        return render_template('most_rated_shows.html', shows=most_rated_shows)


@app.route("/show/<show_id>")
def show_selected(show_id):
    if request.method == "GET":
        show_found = util.find_show(show_id)
        season_for_show_found = util.find_seasons_for_show(show_id)

        return render_template('single_show.html', show=show_found, seasons=season_for_show_found)


def main():
    app.run(debug=False)


if __name__ == '__main__':
    main()
