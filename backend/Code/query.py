import requests
from bs4 import BeautifulSoup

"""Query module

This module contains a function to make calls to an API.

"""

JSON = 0
HTML = 1

def query_site(url, params, fmt=JSON):
    """Makes a query to an API.

    :param url:     -- string with base url for the query
    :param params:  -- dictionary with the params for the query (default empty dictionary)
    :param fmt:     -- the format in which the response has to be returned (default JSON)
    :return:        -- a format object with the response to the query

    :raises:        -- HTTPError if the HTTP request returned an unsuccessful status code.

    """
    r = requests.get(url, params=params)
    #print ("requesting", r.url)
    if r.status_code == requests.codes.ok:
        return {
            JSON: __get_json,
            HTML: __get_html
        }[fmt](r)
    else:
        r.raise_for_status()

def __get_json(response):
    return response.json()

def __get_html(response):
    return BeautifulSoup(response.text, "html.parser")