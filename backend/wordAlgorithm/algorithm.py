import word
import wordValueTable
import frequency_value_table

try:
    import Queue as Q  # ver. < 3.0
except ImportError:
    import queue as Q

"""

 Class that makes an array of word objects and creates a sorted array of the words.
 The sorting is based on assigning a value to a word
    
    Attributes for word values:
        1. number of letters in a word
        2. frequency of letters in a language (according to the letter value table) compared with the word
        3. the correlation of the word with its translation (the translation with the highest correlation)
        4. how common a word is (yet to be implemented)

 
"""

def correlation(original_word, translation):
    """Correlation calculation of a word and its translation 
    according to the Levenshtein-Algorithm (multiplied with the correct factor)

    Keyword arguments:
    original_word -- the word it is all about 
    translation -- translations of the original_word.
    """

    original_word = list(original_word)
    translation = list(translation)
    len_original_word = len(original_word)+1
    len_translation = len(translation)+1
    #Initialization of the matrix
    matrix = [[0 for x in range(len_translation)] for y in range(len_original_word)]
    for i in range(1, len_original_word):
        matrix[i][0] = i
    for j in range(1, len_translation):
        matrix[0][j] = j
    
    #Levenshtein-Algorithm 
    for j in range (1, len_translation):
        for i in range (1, len_original_word):
            cost = int(original_word[i-1] != translation[j-1])
            matrix[i][j] = min(matrix[i-1][j]+1, matrix[i][j-1]+1, matrix[i-1][j-1] + cost)

    return 10*matrix[i][j] 

def letter_frequency(original_word, language):
    """Calculation of the letter frequency value of the word 
    according to the letter value table (multiplied with the correct factor)

    Keyword arguments:
    original_word -- the word it is all about 
    language -- the language of the word
    """

    frequency_value = 0.0
    letter_value_table = wordValueTable.letter_value_table
    for letter in original_word:
        for letter_value in range(0, len(letter_value_table)):
            value = wordValueTable.Letter_elements.get_value(letter_value_table[letter_value], language, letter)
            if value > 0 :
                frequency_value += float(value)
                break

    return frequency_value/len(original_word)

def word_frequency(original_word):
    """Retrieving the frequency value of the word on how often it is used in a language 
    according to the frequency value table (multiplied with the correct factor)

    Keyword arguments:
    original_word -- the word it is all about 
    language -- the language of the word
    """

    value = 0.0
    table = frequency_value_table.frequency_value_table
    for i in range(0, len(table)):
        value = float(frequency_value_table.Frequency_elements.get_value(table[i], original_word))
        if value > 0:
            break

    if value == 0:
        value = 10000

    return value/100

def accum_value(original_word, language, translation):
    """Accumulates the word value  
    
    Attributes:
    letter_frequency
    correlation

    Keyword arguments:
    original_word -- the word it is all about 
    language -- the language of the word
    translation -- the (first) translation of the word
    """
    value = len(original_word)
    value += letter_frequency(original_word, language)
    value += correlation(original_word, translation) 
    value += word_frequency(original_word)

    return value

words = word.words
for word in words:
    if word.translations == []:
        continue
    else:
        word.word_value = accum_value(word.original_word, word.language, word.translations[0])

q = Q.PriorityQueue()    
# Put the word objects in the queue in increasing order of the word value (insertion sort)   
for w in words:
    if w.translations == []:
        continue
    else:
        q.put((w.word_value, w))
