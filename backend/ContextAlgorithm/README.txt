The context algorithm, given a set of words as an input, will provide a xml output containing that word and a set of 3 most challenging sentences (sentences with the closest difficulty to the word one, but under it), and a set of 3 simplest sentences (sentences with the least difficulty)

The context algorithm functionality is already implemented. However there are a few things that still need to be implemented.

	1. For now the output will be in an XML format in a different file from the sorted words one. We need to clarify what to do with the output.

	2. To avoid the problem with linguee (it fails after some requests) we will have to use LingueeSentences.py and query.py. However they are not implemented yet in the code.

	3. Finally, the algorithm depends a lot from the input (the difficulty of each word). In the current input there are some words missing which are needed for having a better functionnality. At the moment, if the algorithm does not find a word in the input xml (result.xml) when it is looking for the difficulty of a word in a sentence, there is no value added, so it does not count to establish the difficulty of a sentence

It is important to notice that there can be words without a context because they are too simple to find a simplest sentence.

