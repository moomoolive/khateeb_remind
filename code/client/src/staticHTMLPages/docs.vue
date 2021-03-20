<template>
    <div class="doc-globals">
        <h1>Khateeb Remind CLI Cheat Sheet</h1>
        <button class="yellow">📚 Go to full documentation</button>
        <h2 id="key-binding">Key Bindings ⌨️</h2>
        <h3>Enter</h3>
        <p>Execute Command</p>
        <h3>Up and Down Keys</h3>
        <p>Navigate command history</p>
        <h3>Escape</h3>
        <p>Close docs if open</p>
        <h2 id="cloud-commands">Cloud Commands☁️</h2>
        <h3>ping</h3>
        <p>Check if server is connected and taking commands<br><span>Aka: -p, p</span></p>
        <h3>clear</h3>
        <p>Clears output screen and output queue<br><span>Aka: -c, cls</span></p>
        <h3>test</h3>
        <p>Check if cloud command line is still live <br><span>Aka: -t</span></p>
        <h3>help</h3>
        <p>Display cloud commands on output screen <br><span>Aka: -h, --help</span></p>
        <h3>bye</h3>
        <p>Exit command line, redirect to admin central</p>
        <h3>docs</h3>
        <p>Toggle docs cheat sheet above command line <br><span>Aka: -d</span></p>
        <h2>Server Commands 🌐</h2>
        <h3 class="red">General Server Syntax:</h3>
        <h3 class="red notice"><u><span class="blue">'targetData'</span> <span class="green">'verb'</span> <span class="darkBlue">...options</span></u></h3>
        <h3>inst (institutions)</h3>
        <h5>view: info about an individual or a group of institutions</h5>
        <p class="default">Defaults to 'unconfirmed'</p>
        <p>Option <span class="purple"><b><u>'unconfirmed'</u></b></span>: see all institutions with pending status <br><span>Aka: -uc</span></p>
        <p>Option 'all': see all institutions <br><span>Aka: -a</span></p>
        <h5>confirm: confirms the status of given institution</h5>
        <p class="note">**Note: first parameter must be the 20 character mongoose ID of target</p>
        <p class="default">Defaults to 'setting'</p>
        <p>Option <span class="purple"><b><u>'setting'</u></b></span>: confirms given institution and it's root administrator, and also creates initial institutional settings and one default timing and location with default values. <br><span>Aka: -s</span></p>
        <p>Option 'location': confirms given institution and it's root administrator, and ONLY creates one timing and location for institution with default values. <br><span>Aka: -l</span></p>
        <p>Option 'user': confirms given institution and it's root adminstrator. <br><span>Aka: -u</span></p>
        <p>Option 'institution': only confirms institution. <br><span>Aka: -i</span></p>
        <h3>sett (settings)</h3>
        <h5>view: view root account options</h5>
        <p class="default">Defaults to 'root'</p>
        <p>option <span class="purple"><b><u>'root'</u></b></span>: returns root user settings if they exist <br><span>Aka: -r</span></p>
        <p>option 'options': returns all settings values with value type <br><span>Aka: -o</span></p>
        <h5>init: initialize settings</h5>
        <p class="default">Defaults to 'elegant'</p>
        <p>Option <span class="purple"><b><u>'elegant'</u></b></span>: creates new settings for user if they don't exit <br><span>Aka: -e</span></p>
        <p>Option 'force': creates new settings for user if they don't exist or overwrites current settings with default values <br><span>Aka: -f</span></p>
        <h3>set: set an individual settings field</h3>
        <p class="note">**Note: loops through options, odd options (1st, 3rd, etc.) are the fields to be set and the value directly after it are the setting value. Example: twilioKey 'my cool twilio key' textAllowed f </p>
        <p class="note">**Note: strings must be surrounded by backticks ``, Booleans (t, f for short) and numbers are typed in without encoding .</p>
        <p class="default">No default value</p>
        <p>Possible fields: 'twilioKey', 'twilioUser', 'textAllowed'.</p>
    </div>
</template>

<script>
export default {
    name: 'khateebRemindDocs'
}
</script>

<style lang="scss" scoped>

.red {
    color: getColor("red");
}

.doc-globals {
    text-align: left;
    margin-left: 7px !important;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 90%;
}

h1 {
    color: getColor('offWhite');
    font-size: 40px;
    margin-top: 10px;
    text-decoration: underline;
}

h2 {
    color: darken(getColor('offWhite'), 10%);
    font-size: 35px;
    margin-top: 8px;
    padding: 0;
}

h3 {
    color: getColor("blue");
    font-size: 30px;
    margin-top: 6px;
    padding: 0;
    margin-bottom: 0;
}

h5 {
    color: getColor("green");
    font-size: 25px;
    margin-top: 5px;
    margin-bottom: 20px;
    padding: 0;
    margin-bottom: 0;
}

p {
    color: getColor("darkBlue");
    font-size: 18px;
    margin-top: 4px;
    &.note {
        color: getColor("orange");
    }
    &.default {
        color: getColor("purple");
        font-weight: bold;
    }
}

h4 {
    font-size: 28px;
    margin-top: 0;
    padding-top: 0;
}

a {
    margin: 0;
    padding: 0;
}

span {
    color: getColor('red');
    &.blue {
        color: getColor('blue');
    }
    &.darkBlue{
        color: getColor('darkBlue');
    }
    &.green {
        color: getColor("green");
    }
    &.purple {
        color: getColor("purple");
        font-weight: bold;
    }
}

.table-of-contents {
    margin-bottom: 10px;
}

.notice {
        margin-bottom: 30px;
    }

button {
    width: 100%;
    height: 7vh;
    max-height: 70px;
    color: black;
    font-weight: bold;
    font-size: 22px;
}

@media screen and (max-width: $phoneWidth) {
    h1 {
        font-size: 5.5vh;
        margin-top: 1vh;
    }
    h2 {
        font-size: 4.5vh;
        margin-top: 0.8vh;
    }
    h3 {
        font-size: 3.5vh;
        margin-top: 0.6vh;
        padding: 0;
    }
    h4 {
        font-size: 4vh;
    }
    h5 {
        color: getColor("green");
        font-size: 3.5vh;
        margin-top: 0.4vh;
        padding: 0;
        margin-bottom: 0;
    }
    p {
        font-size: 2.6vh;
    }
    button {
        font-size: 2.5vh;
    }
    .notice {
        margin-bottom: 8vh;
    }
}

</style>