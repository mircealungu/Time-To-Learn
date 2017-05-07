from query import *
from files import dict_to_xml_file
import os

"""

Class that retrieves the score of a letter or combination of letters
in a specified language according to its frequency

"""

# Base url of the requests
BASE_URL = "http://www.sttmedia.com/"
CHARS = "characterfrequency"
SYLLABLES = "syllablefrequency"

# Select the min and max score values possible for any letter
MIN_SCORE = 1
MAX_SCORE = 20

# Language from which to retrieve the letter scores (as it appears
# in the web page)
LANG = "nederlands"
FOLDER = LANG + "Scores"

def query_by_lang(url, lang):
    """Adds a language to the url of the query

    :param url:         -- string with the base url of the query
    :param lang:        -- string with the language to add
    :return:            -- html object with the response to the query

    """
    return query_site(url + '-' + lang, {}, HTML)

def find_min(list):
    """Gets the min element of a list sorted from greater to smaller

    :param list:        -- list where to get the last element
    :return:            -- last element of the list

    """
    return find_value_at(list, -1)

def find_max(list):
    """Gets the max element of a list sorted from greater to smaller

    :param list:        -- list where to get the first element
    :return:            -- first element of the list

    """
    return find_value_at(list, 0)

def find_value_at(list, indx):
    """Gets a value of a html table list

    :param list:        -- html table list in which to get the value
    :param indx:        -- int with an index of the list
    :return:            -- value at the index of the list
    """
    row = list[indx]
    val = row.find_all("td")[1].string[:-1]
    return float(val.replace(',', '.'))

def map_to_range(val, old_min, old_max, new_min, new_max):
    """Conversely maps a value in a range to a new range

    :param val:         -- a real with the value to map
    :param old_min:     -- the min value of the interval in which val is
    :param old_max:     -- the max value of the interval in which val is
    :param new_min:     -- the min value of the new interval to which val is mapped
    :param new_max:     -- the max value of the new interval to which val is mapped
    :return:            -- a real with val conversely mapped to the new interval

    """
    return new_max - (val - old_min) * (new_max - new_min) / (old_max - old_min)

def create_dict(list, old_min, old_max, new_min, new_max):
    """Creates a dictionary with the letters as keys and their scores as values

    :param list:        -- html table list in which to get the letters and frequencies
    :param old_min:     -- a real with the min frequency of the list
    :param old_max:     -- a real with the max frequency of the list
    :param new_min:     -- a real with the min score for a letter combination
    :param new_max:     -- a real with the max score for a letter combination
    :return:            -- a dictionary with the letter combinations as keys and their scores as values

    """
    d = {}
    for row in list:
        tds = row.find_all("td")
        letter = tds[0].string
        freq = tds[1].string[:-1]
        freq = float(freq.replace(',', '.'))
        d[letter] = map_to_range(freq, old_min, old_max, new_min, new_max)

    return d

def parse_scores(option, table_num, language, min_score, max_score):
    """Gets the scores of letter combinations and stores them in a dictionary

    :param option:          -- string indicating whether to query for CHARs or for SYLLABLEs
    :param table_num:       -- int with the number of the table in the html page
    :param language:        -- language for which to get the letter scores
    :param min_score:         -- int with the minimum score
    :param max_score:         -- int with the maximum score
    :return:                -- dictionary with the letter combinations as keys and their scores as values

    """
    html = query_by_lang(BASE_URL + '/' + option, language)
    table = html.find_all("table")[table_num]
    freq_list = table.find_all("tr")[2:]

    # Create the dictionary
    list_min = find_min(freq_list)
    list_max = find_max(freq_list)
    return create_dict(freq_list, list_min, list_max, min_score, max_score)

def retrieve_scores(num_letters, language, folder, min_score, max_score):
    """Gets the letter combinations of num_letters and their scores in a language and stores them in a xml file

    :param num_letters:     -- int with the letter combination length (ranges from 1 to 3)
    :param language:        -- string with the language for which compute the letter scores
    :param folder:          -- string with the folder name
    :param min_score:       -- int with the min score
    :param max_score:       -- int with the max score

    """
    if (num_letters == 1):
        return retrieve_letter_scores(1, language, folder, min_score, max_score)
    elif (num_letters == 2):
        return retrieve_syllable_scores(num_letters, 1, language, folder, min_score, max_score)
    elif (num_letters == 3):
        return retrieve_syllable_scores(num_letters, 3, language, folder, min_score, max_score)
    else:
        print("Error: incorrect number of letters. Value ranges from 1 to 3.\n")

def retrieve_letter_scores(table_num, language, folder, min_score, max_score):
    """Gets the letters and their scores in a language and stores them in a xml file

    :param table_num:       -- int with the position of the table to parse
    :param language:        -- string with the language for which compute the letter scores
    :param folder:          -- string with the folder name
    :param min_score:       -- int with the min score
    :param max_score:       -- int with the max score

    """
    letter_dict = parse_scores(CHARS, table_num, language, min_score, max_score)
    dict_to_xml_file(letter_dict, CHARS + '-' + language, folder)

def retrieve_syllable_scores(num_letters, table_num, language, folder, min_score, max_score):
    """Gets the letter combinations of num_letters and their scores in a language and stores them in a xml file

    :param num_letters:     -- int with the letter combination length (ranges from 2 to 3)
    :param table_num:       -- int with the position of the table to parse
    :param language:        -- string with the language for which compute the letter scores
    :param folder:          -- string with the folder name
    :param min_score:       -- int with the min score
    :param max_score:       -- int with the max score
    """

    syllableDict = parse_scores(SYLLABLES, table_num, language, min_score, max_score)
    dict_to_xml_file(syllableDict, SYLLABLES + str(num_letters) + '-' + language, folder)

def main():
    if not os.path.exists(FOLDER):
        os.makedirs(FOLDER)

    retrieve_scores(1, LANG, FOLDER, MIN_SCORE, MAX_SCORE)
    retrieve_scores(2, LANG, FOLDER, MIN_SCORE, MAX_SCORE)
    retrieve_scores(3, LANG, FOLDER, MIN_SCORE, MAX_SCORE)

if __name__ == "__main__":
    main()