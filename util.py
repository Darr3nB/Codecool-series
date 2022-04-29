from data import queries


def most_rated_shows():

    return queries.get_most_rated_shows()


def find_show(show_id):
    result = queries.get_show_by_id(show_id)

    total_minutes = result['runtime']
    hours = total_minutes // 60
    minutes = total_minutes % 60

    if hours == 0:
        time_string = f"{minutes}min"
    elif minutes == 0:
        time_string = f"{hours}h"
    else:
        time_string = f"{hours}h {minutes}min"

    result['runtime'] = time_string

    if result['trailer'] is not None:
        result['trailer'] = result['trailer'].replace('watch?v=', 'embed/')

    return result


def find_seasons_for_show(show_id):
    return queries.get_seasons_for_show(show_id)
