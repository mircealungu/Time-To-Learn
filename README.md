# Time-To-Learn
Tizen watch App for reminding people of things!
Used to learn words and other interesting things

# Running

remember to run `r.js -o build.js` from the `build` folder.

# Running on the emulator/smart watch
The line:
<tizen:category name="com.samsung.wmanager.WATCH_CLOCK"/>
in config.xml determines whether the app is a 'normal' application or a watch face.
When running the app on the emulator comment this line, because with the line it doesn't run on the emulator.
For a code ready to go on the watch, uncomment this line, so the watch will install the app as a watchface.
