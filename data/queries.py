from data import data_manager


def get_shows():
    return data_manager.execute_select('SELECT id, title FROM shows;')


def get_most_rated_shows():
    return data_manager.execute_select(
        """
        SELECT shows.id as id, title, year, ROUND(AVG(runtime), 1) as runtime, ROUND(rating, 1) as rating, 
        STRING_AGG(g.name, ', ') AS genre, trailer, homepage
        FROM shows 
        INNER JOIN show_genres sg on shows.id = sg.show_id
        INNER JOIN genres g on g.id = sg.genre_id
        GROUP BY shows.id, title, runtime, rating
        ORDER BY rating DESC, genre
        LIMIT 15
        """)


def get_show_by_id(show_id):
    return data_manager.execute_select(
        """
        SELECT shows.id as id, title, runtime as runtime, ROUND(rating, 1) as rating, trailer, 
        STRING_AGG(DISTINCT g.name, ', ') AS genre, overview, array_to_string((array_agg(DISTINCT a.name))[1:3], ', ') AS actors
        FROM shows
        JOIN show_genres sg on shows.id = sg.show_id
        JOIN genres g on g.id = sg.genre_id
        JOIN show_characters sc on shows.id = sc.show_id
        JOIN actors a on a.id = sc.actor_id
        WHERE shows.id=%(id)s
        GROUP BY shows.id
        """, {'id': show_id}, fetchall=False)


def get_seasons_for_show(show_id):
    return data_manager.execute_select(
        """
            SELECT seasons.season_number, seasons.title, seasons.overview
            FROM seasons
            JOIN shows s on seasons.show_id = s.id
            WHERE s.id=%(id)s
        """, {'id': show_id})
