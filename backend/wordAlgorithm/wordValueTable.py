import xml.etree.ElementTree as ET

"""

 Class constructing a letter value table of Letter elements and filling it according to an XML-file

    Structure of the XML-file: 
        <LetterValues>
            <LetterValue>
                <Letter>a</Letter>
				<ValueDutch>12.3700787401575</ValueDutch>
				<ValueGerman>13.752808988764</ValueGerman>
				<ValueSpanish>3.77372262773723</ValueSpanish>
			</LetterValue>
        </LetterValues>
 
"""
# Format of letter valuetable : [alphabetArray, languagesArray, values for each language in order array]  


class Letter_elements(object):

	"""A word with with all relevant information (that can be set) for the use of the sorting algorithm


	Attributes:
		letters: A string with a letters used in a language.
		dutch_value: A double with the frequency value of how often the letter is used in Dutch.
		spanish_value: A double with the frequency value of how often the letter is used in Spanish.
		german_value: A double  with the frequency value of how often the letter is used in German.
	"""
	
	def _init_(self):
		self.letters = ""
		self.dutch_value = 0.0
		self.spanish_value = 0.0
		self.german_value = 0.0

	def _str_(self):
		return "Letter: %s\nDutch Value: %s\nSpanish Value: %s\nGerman Value: %s\n" % (self.letters, self.dutch_value, self.spanish_value, self.german_value)

	def set_letter(self, letter):
		self.letters = letter

	def set_value(self, language, value):
		if language == "Dutch":
			self.dutch_value = value
		if language == "Spanish":
			self.spanish_value = value
		if language == "German":
			self.german_value = value

	def get_value(self, language, letter):
		if letter == self.letters:
			if language == "Dutch":
				return self.dutch_value
			if language == "Spanish":
				return self.spanish_value
			if language == "German":
				return self.german_value
		else:
			return 0

# initialization of the array that will contain the letter elements
letter_value_table = []
#XML parsing to fill the letter value table
tree = ET.parse('letterValues.xml');
letter_values = tree.getroot()

for letter_value in letter_values:
	letter = Letter_elements()
	Letter_elements._init_(letter)
	for element in letter_value:
		if element.tag == 'Letter':
			Letter_elements.set_letter(letter, element.text)

		if element.tag == 'ValueDutch':
			Letter_elements.set_value(letter, "Dutch", element.text)

		if element.tag == 'ValueGerman':
			Letter_elements.set_value(letter, "German", element.text)

        if element.tag == 'ValueSpanish':
        	Letter_elements.set_value(letter, "Spanish", element.text)

	letter_value_table.append(letter)




	