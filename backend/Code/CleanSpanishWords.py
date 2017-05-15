import csv
from query import query_site
from files import dict_to_xml_file

PATH = "/Users/PhoenixQoH/Desktop/freqSpanish.csv"
BASE_URL = "https://dle.rae.es/data/search"
HEADERS = {"Authorization": "Basic cDY4MkpnaFMzOmFHZlVkQ2lFNDM0"}
LANG = "Spanish"

def query_by_word(url, headers, word):
    # This adds a page name to the query parameters before making
    # an API call to the function above.
    params = {}
    params['w'] = word
    return query_site(url, params, headers)

def main():
    with open(PATH, 'r') as file:
        reader = csv.reader(file)
        word_set = set()

        for row in reader:
            result = query_by_word(BASE_URL, HEADERS, row[1])["res"]

            if result != []:
                word = result[0]["header"]
                word = word[:word.find('<')]
                word_set.add(word)

    word_dict = dict()
    word_dict["words"] = word_set

    dict_to_xml_file(word_dict, LANG)