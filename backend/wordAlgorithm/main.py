import algorithm
import word
import xml.etree.cElementTree as ET

try:
    import Queue as Q  # ver. < 3.0
except ImportError:
    import queue as Q

"""

 Main Class that gets the sorted array of word objects and translates it to an XML-file
    
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


queue = algorithm.q
tempQueue = Q.PriorityQueue()
root = ET.Element("Words")
for i in range (0, queue.qsize()):
    w = queue.get()
    doc = ET.SubElement(root, "Word")
    ET.SubElement(doc,"Language").text = w[1].language
    ET.SubElement(doc,"Word").text = w[1].original_word
    for translation in range(0, len(w[1].translations)):
        ET.SubElement(doc,"Translation").text = w[1].translations[translation]
    ET.SubElement(doc,"WordValue").text = str(w[1].word_value)
    ET.SubElement(doc,"Category").text = w[1].category
    ET.SubElement(doc,"Word_Difficulty").text = w[1].word_frequency
    ET.SubElement(doc,"Extensions").text = w[1].extensions
tree = ET.ElementTree(root)
tree.write("resultSpanish.xml", encoding="UTF-8")
