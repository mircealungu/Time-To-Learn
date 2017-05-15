from dicttoxml import dicttoxml
import xmltodict
from xml.dom.minidom import parseString
import csv
import xml.etree.cElementTree as ET
from collections import OrderedDict, defaultdict

"""Files module

This module contains all functions related with reading from or writing to files.

"""

def dict_to_xml_file(dict, file_name, path='.', root=True):
    """Transforms a dictionary to a xml file

    :param dict:        -- the dictionary to transform
    :param file_name:   -- string with the name of the xml file
    :param path:        -- string with the path where to create the xml file (default current path)
    :param root:        -- boolean indicating whether to include a root tag in the xml file or not
    """
    if not root:
        xml = dicttoxml(dict, root=False, attr_type=False)
    else:
        xml = dicttoxml(dict, custom_root=file_name, attr_type=False)
    dom = parseString(xml)
    with open(path + '/' + file_name + ".xml", 'w') as file:
        file.write(dom.toprettyxml())

#
def xml_file_to_dict(path, root):
    """Transforms a xml file to a dictionary

    :param path:        -- string with the path to the xml file
    :param root:        -- string with the root tag name of the xml file
    :return:            -- a dictionary with the data of the xml file

    """
    with open(path, 'r') as file:
        content = file.read()
        return xmltodict.parse(content)[root]


def csv_file_to_dict(path):
    """Transforms a csv file to a dictionary

    :param path:        -- string with the path to the csv file
    :return:            -- a dictionary with the data of the csv file

    """
    with open(path, 'r') as file:
        reader = csv.reader(file)
        d = {}
        for row in reader:
            freq, word = row
            d[word] = freq

        return d

def xml_file_to_list(path):
    """Transforms a xml file to a list

    :param path:        -- string with the path to the xml file
    :return:            -- list with the contents of the xml file

    """
    with open(path, 'r') as file:
        tree = ET.ElementTree(file=file)
        return tree.getroot()[0]

def combine_xml(files):
    """Combines several xml files into one

    :param files:       -- list of strings with the file paths of the xmls to combine
    :return:            -- string with all the xml contents combined

    """
    first = None
    for filename in files:
        data = ET.parse(filename).getroot()
        if first is None:
            first = data
        else:
            first.extend(data)
    if first is not None:
        return parseString(ET.tostring(first)).toxml()

def format(language, word, translations):
    """Stores a word and its translation in a predefined format

    :param language:    -- string with the language of the word
    :param word:        -- string with a word
    :param translations:-- list with the possible translations of a word
    :return:            -- dictionary with the corresponding keys and values

    """
    d = OrderedDict()
    d["Language"] = language
    d["Word"] = word

    d["Translations"] = defaultdict(list)
    d["Translations"] = translations
    d["Category"] = " "
    d["Word_Difficulty"] = " "
    d["Extensions"] = " "

    return d

def xml_to_file(xml, file_name, path="."):
    """Writes an xml to a file

    :param xml:         -- xml file to write
    :param file_name:   -- string with the name of the new file
    :param path:        -- path where to store the xml file (default current directory)

    """
    dom = parseString(xml)
    with open(path + '/' + file_name + ".xml", 'w') as file:
        file.write(dom.toxml())