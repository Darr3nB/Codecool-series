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


@app.route("/shows")
@app.route("/shows/most-rated", methods=['GET', 'POST'])
def most_rated(page=1, order_by='rating', direction='DESC'):
    if request.method == "GET":
        most_rated_shows = util.most_rated_shows(page, order_by, direction)
        number_of_pages = util.number_of_pages()

        return render_template('most_rated_shows.html', shows=most_rated_shows, number_of_pages=number_of_pages, page=page)
    elif request.method == 'POST':
        number_of_pages = util.number_of_pages()

        order_by_from_js = request.json['order_by']
        direction_from_js = request.json['direction']
        page = request.json['page']

        if order_by_from_js != 'undefined':
            order_by = order_by_from_js
        if direction_from_js != 'undefined':
            direction = direction_from_js

        most_rated_shows = util.most_rated_shows(int(page), order_by, direction)

        return render_template('most_rated_shows.html', shows=most_rated_shows, number_of_pages=number_of_pages, page=page)


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
