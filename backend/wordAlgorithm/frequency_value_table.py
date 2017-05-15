import xml.etree.ElementTree as ET

"""

 Class constructing a frequency value table of word elements and filling it according to an XML-file

    Structure of the XML-file: 
        <SpanishFrequencies>
             <cruzo>7748</cruzo>
        </SpanishFrequencies>
 
"""



class Frequency_elements(object):

    """A word with with its frequency value according to the use in a language


    Attributes:
        word: A string with the word it is all about.
        value: A double with the frequency value of the word
        language: A string with the language of the word
    """
    
    def _init_(self):
        self.word = ""
        self.value = 0.0
        self.language = ""

    def _str_(self):
        return "Word: %s\nValue: %s\nLanguage: %s\n" % (self.word, self.value, self.language)

    def set_word(self, word):
        self.word = word

    def set_value(self, value):
        self.value = value

    def set_language(self, language):
        self.language = language


    def get_value(self, word):
        if word == self.word:
            return self.value
        else:
            return 0

# initialization of the array that will contain the frequency elements
frequency_value_table = []
#XML parsing to fill the frequency table
tree = ET.parse('SpanishWordFrequencies.xml');
frequencies = tree.getroot()

for frequency in frequencies:
    word = Frequency_elements()
    Frequency_elements._init_(word)
    Frequency_elements.set_word(word, frequency.tag)
    Frequency_elements.set_value(word, frequency.text)
    Frequency_elements.set_language(word, "Spanish")
    frequency_value_table.append(word)




    