import xml.etree.ElementTree as ET

"""

 Class constructing a Word object and filling it according to an XML-file

    Structure of the XML-file: 
        <Words>
            <item>
                <Language>Dutch</Language>
                <Word>ja</Word>
                <Translations>
                    <item>yes</item>
                    <item>yeah</item
                </Translations>
                <Category/></Category>
                <Word_Difficulty/></Word_Difficulty>
                <Extensions/></Extensions>
            </item>
        </Words>
 
"""

class Word(object):

    """A word with with all relevant information (that can be set) for the use of the sorting algorithm


    Attributes:
        language: A string with the language of the word.
        original_word: A string (lowercase chars) with the word it is all about.
        translation: A string array (lowercase chars) of translations to of the original_word.
        category: An integer that is representing a category the word belongs to.
            Example: original_word= "cat", Category = 5 (animals)
        word_value: A double that represents the value of a word that will be calculated in 'algorithm.py'.
        extensions: A string array (lowercase chars) with all the extensions of the original_word.
            Example: original_word= "industry", Extensions = ["industrial", "industrialized"]
        progress: A integer that keeps count of the number of times the original_word has already been learned
        word_frequency: A double that represents the frequency of the original_word per language
    """
    
    def _init_(self):
        self.language = ""
        self.original_word = ""
        self.translations = []
        self.category = 0
        self.word_value = 0.0
        self.extensions = []
        self.progress = 0
        self.word_frequency = 0.0

    def _str_(self):
        return "Language: %s\nOriginal Word: %s\nTranslation: %s\nCategory: %s\nExtensions: %s\nWord frequency: %s" % (self.language, self.original_word, self.translations, self.category, self.extensions, self.word_frequency)
    
    def set_language(self, language):
        self.language = language

    def set_original_word(self, original_word):
        self.original_word = original_word

    def set_translations(self, translation):
        self.translations.append(translation)

    def set_category(self, category):
        self.category = category

    def add_extensions(self, extension):
        self.extensions.append(extension)

    def set_word_frequency(self, word_frequency):
        self.word_frequency = word_frequency

    def set_word_value(self, word_value):
        self.word_value = word_value

    def set_progress(self, progress):
        self.progress = progress

    
# initialization of the array that will contain the word objects
words = []
#XML parsing to fill the word objects and fill words
tree = ET.parse('spanishWords.xml');
words_xml = tree.getroot()

for word_elements in words_xml:
    word = Word()
    Word._init_(word)
    for element in word_elements:
        if element.tag == "Language":
            Word.set_language(word, element.text)
            
        if element.tag == "Word":
            Word.set_original_word(word, element.text)
            
        if element.tag == "Translations":
            for item in element:
                Word.set_translations(word, item.text)
            
        if element.tag == "Category":
            Word.set_category(word, element.text)
            
        if element.tag == "Extensions":
            for item in element:
                Word.set_translations(word, item.text)
            
        if element.tag == "Word_Difficulty":
            Word.set_word_frequency(word, element.text)
    words.append(word)       


        
        
        
        
        
        
        
