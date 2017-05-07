from files import combine_xml, xml_to_file

LANG = "Dutch"
PATH = "./" + LANG + "Translations/"
FILE_NAMES = LANG + "-English"

STEP = 100
LAST = 44


def gen_filenames(next, step, last, path):
    """Generates a list of translation filenames

    :param next:        -- int with next number of translations
    :param step:        -- int with the size of the translation batch
    :param last:        -- int with the number of files
    :param path:        -- string with the path where the translations are stored
    :return:            -- list of strings with all the translation filenames

    """

    filenames = []
    next = STEP
    for i in range(1, LAST):
        filenames.append(PATH + FILE_NAMES + str(next) + ".xml")
        next = next + STEP

    return filenames

def main():
    filenames = gen_filenames(STEP, STEP, LAST, PATH)
    total_xmls = combine_xml(filenames)

    xml_to_file(total_xmls, "Total" + LANG + "Translations")

if __name__ == "__main__":
    main()
