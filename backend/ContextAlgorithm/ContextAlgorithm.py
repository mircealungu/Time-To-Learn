import requests
import xml.etree.cElementTree as ET
import string
import os
import operator
import time
import LingueeSentences


"""

Structure of the output XML file

        <Contexts>
            <Word>idea</Word>
                <Challenging_sentences>
                    <Sentence>Los informes nacionales apoyan esta idea abrumadoramente.</Sentence>
                </Challenging_sentences>
                <Simplest_sentences>
                    <Sentence>Los informes nacionales apoyan esta idea abrumadoramente.</Sentence>
                </Simplest_sentences>
        </Contexts>

"""


OUTPUT_LANG = 'en'

# These three values are filled by the sorted word list (result.xml).
INPUT_LANG = ''
WORD = ''
WORD_DIFFICULTY = 0

POSSIBLE_LANGUAGES = ['es', 'nl', 'de']
TITLE_FREQ = 'SpanishWordFrequencies.xml'
TITLE_SORTED_WORDS = 'result.xml'
PATH_INPUT_WORDS = ''
MAX_LENGTH_SENTENCE = 15


# Class sentence which contains:
#   -the sentence(self.sentence_string)
#   -words in the sentence(self.words)
#   -values of each word(self.word_values)
#   -total difficulty of the sentence(self.difficulty)

class Sentence:
    def __init__(self, sentence_string, words):
        self.sentence_string = sentence_string
        self.words = words
        self.words_values = []
        self.difficulty = 0

    def add_values(self, values):
        self.words_values = values

    def set_difficulty(self, difficulty):
        self.difficulty = difficulty

    def __str__(self):
        return self.sentence_string


def choose_language(language):
    global INPUT_LANG, TITLE_FREQ
    if language == 'Spanish':
        INPUT_LANG = POSSIBLE_LANGUAGES[0]
    elif language == 'Dutch':
        INPUT_LANG = POSSIBLE_LANGUAGES[1]
    else:
        INPUT_LANG = POSSIBLE_LANGUAGES[2]
    return


# Delete inneccesary symbols
def clean_sentence(sentence):
    sentence = sentence.replace('[...] ', '')
    sentence = sentence.replace('"', '')
    sentence = sentence.replace('/', '')
    return sentence


# Delete the punctuation of a sentence
def delete_punctuation(sentence):
    punctuation_deleter = str.maketrans('', '', string.punctuation)
    sentence = sentence.translate(punctuation_deleter)
    sentence = sentence.replace('¿', '')
    sentence = sentence.replace('¡', '')
    sentence = sentence.replace('‘', '')
    sentence = sentence.replace('’', '')
    return sentence


# Calculates the error regarding the word difficulty. If no word is found, return the word difficulty so that the
# sentence won't be included
def error_calculation(words_values):
    error = 0
    for x in range(0, len(words_values)):
        error += words_values[x] - WORD_DIFFICULTY

    if len(words_values) == 0:
        return WORD_DIFFICULTY

    return error / len(words_values)


# Calculates the difficult value for each word in a sentence. If it is a proper name difficulty will be 0. If it is not
# found no value will be added
def calculate_sentence_words_value(root, sentence):
    word_values = []
    for j in range(0, len(sentence.words)):
            if sentence.words[j][0].isupper() and j != 0:
                word_values.append(0)

            else:
                for word in root.findall('Word'):
                    if word.find('Word').text == sentence.words[j].lower():
                        word_values.append(float(word.find('WordValue').text))
                        break

    return word_values


# Returns the simpler and the most challenging sentences
def better_sentences(possible_sentences):
    challenging_sentence = []
    simplest_sentence = []
    count = 0

    possible_sentences.sort(key=operator.attrgetter('difficulty'))

    while count < 3 and count < len(possible_sentences):
        challenging_sentence.append(possible_sentences[len(possible_sentences) - 1 - count])
        simplest_sentence.append(possible_sentences[count])
        count += 1

    return {"chall_sntnc": challenging_sentence, "smpl_sntnc": simplest_sentence}


# Writes in the XML file the word and the contexts of that word
def writing_xml_file(root_output, useful_sentences):
    global WORD
    ET.SubElement(root_output, 'Word').text = WORD

    challenging_sentences = ET.SubElement(root_output, 'Challenging_sentences')

    for x in useful_sentences["chall_sntnc"]:
        ET.SubElement(challenging_sentences, 'Sentence').text = x.sentence_string

    simplest_sentences = ET.SubElement(root_output, 'Simplest_sentences')

    for x in useful_sentences["smpl_sntnc"]:
        ET.SubElement(simplest_sentences, 'Sentence').text = x.sentence_string

    tree = ET.ElementTree(root_output)
    tree.write("contexts.xml")


def main():
    global PATH_INPUT_WORDS, WORD, WORD_DIFFICULTY

    PATH_INPUT_WORDS = os.path.realpath(
        os.path.join(os.getcwd(), os.path.dirname(TITLE_SORTED_WORDS))) + '/' + TITLE_SORTED_WORDS

    root_input = ET.parse(PATH_INPUT_WORDS).getroot()

    root_output = ET.Element('Contexts')

    for word in root_input.findall('Word'):
        WORD = word.find('Word').text
        WORD_DIFFICULTY = float(word.find('WordValue').text)
        language = word.find('Language').text

        print("The word is: " + WORD)

        choose_language(language)
        time.sleep(10)
        sentences = LingueeSentences.obtain_sentences(WORD, INPUT_LANG, OUTPUT_LANG)

        possible_sentences = []

        for i in range(0, len(sentences)):
            sentence_words = delete_punctuation(sentences[i]).split()
            sentence = Sentence(sentences[i], sentence_words)
            sentence.add_values(calculate_sentence_words_value(root_input, sentence))
            sentence.set_difficulty(error_calculation(sentence.words_values))

            if len(sentence.words) <= MAX_LENGTH_SENTENCE and (int(sentence.difficulty)) <= WORD_DIFFICULTY:
                possible_sentences.append(sentence)

        useful_sentences = better_sentences(possible_sentences)
        writing_xml_file(root_output, useful_sentences)

if __name__ == "__main__":
    main()
