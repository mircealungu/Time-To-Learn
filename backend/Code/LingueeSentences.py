from query import *

BASE_URL = "http://www.linguee.com/"

SRC_LANG = "spanish"
DST_LANG = "english"

def query_by_lang(url, src_lang, dst_lang, word):
    """Adds a language to the url of the query

    :param url:         -- string with the base url of the query
    :param lang:        -- string with the language to add
    :return:            -- html object with the response to the query

    """
    params = {}
    params["source"] = src_lang
    params["query"] = word
    return query_site(url + src_lang + '-' + dst_lang + "/search", params, HTML)


def main():
    soup = query_by_lang(BASE_URL, SRC_LANG, DST_LANG, "casa")
    sentences = soup.findAll("td", {"class": "sentence left"})

    remove_list = []
    remove_list.append("\n")
    remove_list.append("[...] ")
    remove_list.append(" [...]")

    list = []
    for s in sentences:
        text = s.findAll(text=True)
        clean_text = ''.join([x.replace("\r\n", '') for x in text if x not in remove_list][:-2])
        list.append(clean_text)

    spans = soup.findAll("span", {"class": "tag_s"})[1:]

    for sentence in spans:
        list.append(sentence.text)

if __name__ == "__main__":
    main()
