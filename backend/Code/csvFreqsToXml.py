from files import csv_file_to_dict, dict_to_xml_file

"""

Class that transforms a csv file containing the frequencies of each word
to an xml file

"""

CSV_PATH = "/Users/PhoenixQoH/Desktop/"
LANG = "Dutch"

def main():
    csv_dict = csv_file_to_dict(CSV_PATH + "freq" + LANG + ".csv")
    dict_to_xml_file(csv_dict, LANG + "WordFrequencies")

if __name__ == "__main__":
    main()