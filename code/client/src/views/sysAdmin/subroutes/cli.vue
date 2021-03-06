<template>
    <div>
        <button class="doc-btn" @click="toggleDocs()">
            {{ showDocs ? '📖' : '📘' }} {{ showDocs ? 'Close' : 'Read'}} Docs
        </button>
        <div v-show="showDocs" class="docs-container">
            <docs />
        </div>
        <div class="outputBox">
            <div class="output">
                <p 
                    v-for="(info, index) in output" 
                    :key="index"
                    :class="info.status"
                >
                    {{ `[ ${index} ]` }} 
                    <span :class="prefix(info.from, false)">
                        {{ prefix(info.from) }}
                    </span>  
                    {{ info.msg }}
                </p>
            </div>
        </div>
        <div class="inputContainer">
            <button class="silver" @click="execute(input)">Execute</button><br>
            <input type="text" v-model="input">
        </div>
    </div>
</template>

<script>
import docs from '@/components/staticHTML/docs.vue' // temp for now

export default {
    name: "cloudCLI",
    components: {
        docs
    },
    data() {
        return {
            input: '',
            output: [],
            outputQueue: [],
            commandHistory: [],
            historySelector: -1,
            name: this.$store.getters.decodedJWT.firstName,
            outputMutator: window.setInterval(() => {
                if (this.outputQueue.length > 0) {
                    const output = this.outputQueue.shift()
                    this.output.push(output)
                }
            }, 300),
            icons: {
                ser: '📡',
                usr: '⌨️',
                sys: '☁️'
            },
            showDocs: false
        }
    },
    methods:{
        prefix(from, display=true) {
            let val
            switch(from) {
                case 's':
                    val = 'sys'
                    break
                case 'u':
                    val = 'usr'
                    break
                case 'a':
                    val = 'ser'
                    break
            }
            if (display)
                val = `[ ${this.icons[val]} ${val} ] : `
            return val
        },
        addToOutput(msg, status="okay", from="s") {
            this.outputQueue.push({ from, status, msg })
        },
        toggleDocs() {
            this.showDocs = !this.showDocs
        },
        keyBindings($event) {
            const enter = 13
            if ($event.keyCode === enter)
                this.execute(this.input)
            const upKey = 38
            if ($event.keyCode === upKey)
                this.retrieveCommandHistory(1)
            const downKey = 40
            if ($event.keyCode === downKey)
                this.retrieveCommandHistory(-1)
            const escapeKey = 27
            if ($event.keyCode === escapeKey && this.showDocs)
                this.showDocs = false
        },
        retrieveCommandHistory(incrementSelector) {
            if (incrementSelector === 1)
                this.historySelector++
            else
                this.historySelector--
            const command = this.commandHistory[this.historySelector]
            if (typeof command !== 'undefined')
                this.input = command
            else
                this.input = ''
        },
        exit() {
            window.setTimeout(() => {
                this.$router.push('/sysAdmin')
            }, 2_300)
        },
        async cloudCommands(command) {
            switch(command) {
                case 'ping':
                case 'p':
                case '-p':
                    const ping = await this.$API.sysAdmin.executeCommand({ command: ["__PING__"] })
                    return ping[0]
                case '-c':
                case 'cls':
                case 'clear':
                    this.output = []
                    this.outputQueue = []
                    return
                case '-t':
                case 'test':
                    return {
                        msg: `👋 I'm still here! 👋`,
                        status: `success`
                    }
                case '-h':
                case 'help':
                case '--help':
                    return { 
                        msg: `Available Cloud Commands. Clear: clear screen. All Other Commands Are Sent to server. Check documentation for more info`,
                        status: 'extraInfo' 
                    }
                case "bye":
                case "exit":
                    this.exit()
                    return { msg: `cya later ${this.name} 👋`, status: 'okay' }
                case "docs":
                case '-d':
                    this.showDocs = !this.showDocs
                    break
                default:
                    return { msg: 'Command Not Found', status: 'fail' }
            }
        },
        async cli(command) {
            let cmd = this.preprocessCommand(command)
            if (cmd.length === 1) {
                const res = await this.cloudCommands(cmd[0])
                return [res]
            }
            try {
                const res = await this.$API.sysAdmin.executeCommand({ command: cmd })
                return res
            } catch(err) {
                console.log(err)
            return [{ msg: `A problem was encounter when executing command. Err: ${err}`, status: 'fail' }]
            }
        },
        preprocessCommand(command) {
            let cmd = command.trim()
            cmd = cmd.replace(/ +/g, ' ')
            cmd = cmd.split(' ')
            const lowerCaseRange = cmd.length > 2 ? 2 : cmd.length
            for (let i = 0; i < lowerCaseRange; i++) {
                cmd[i] = cmd[i].toLowerCase()
            }
            return cmd
        },
        async execute(input) {
            this.addToOutput(this.input, 'okay', 'u')
            this.commandHistory.unshift(input)
            this.historySelector = -1
            if (input === '' || input.trim() === '')
                this.addToOutput(`Empty`, 'fail')
            else {
                try {
                    const cliResponse = await this.cli(this.input)
                    cliResponse.forEach(res => {
                        if (res)
                            this.addToOutput(res.msg, res.status, res.from ? res.from : 's') 
                    })
                } catch(err) {
                    console.log(err)
                    this.addToOutput(`A problem occurred when executing command. Err: ${err}`, 'fail')
                }
            }
            this.input = ''
        }
    },
    async created() {
        this.outputMutator
        window.addEventListener('keyup', this.keyBindings)
        this.addToOutput(`Asalam Alaikoum ${this._.stringFormat(this.name)} 😀`)
        this.addToOutput(`System is ready for commands 👍`, 'success')
        const ping = await this.$API.sysAdmin.executeCommand({ command: ["__PING__"] })
        this.addToOutput(ping[0].msg, ping[0].status, ping[0].from)
    },
    destroyed() {
        window.clearInterval(this.outputMutator)
    }
}
</script>

<style lang="scss" scoped>
.outputBox {
    background: getColor('grey');
    height: 50vh;
    max-height: 450px;
    width: 80%;
    max-width: 1100px;
    margin-left: auto;
    margin-right: auto;
    overflow: auto;
    text-align: left;
    margin-top: 10px;
    margin-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    scroll-padding: 10%;
}

.docs-container {
    background: getColor("lightGrey");
    padding-top: 10px;
    height: 50vh;
    max-height: 450px;
    width: 80%;
    max-width: 1090px;
    margin-left: auto;
    margin-right: auto;
    overflow: auto;
    margin-bottom: 0;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

.doc-btn {
    margin-top: 10px;
    margin-bottom: 0;
    height: 6vh;
    max-height: 60px;
    &:focus {
        animation: none;
        background: themeRGBA("green", 0.9) !important;
    }
}

.output {
    padding-top: 6px;
    height: 10000px;
    width: 99%;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
}

.inputContainer {
    margin-top: 6vh;
}

p {
    margin-left: 1vw;
    line-height: 17px;
    font-weight: bold;
    margin-bottom: 0;
    font-size: 16px;
    width: 90%;
    &.okay {
        color: getColor("offWhite")
    }
    &.success {
        color: getColor("green")
    }
    &.fail {
        color: getColor("red")
    }
    &.concern {
        color: getColor("yellow")
    }
    &.extraInfo {
        color: getColor("blue")
    }
}

span {
    &.ser {
        color: getColor("purple");
    }
    &.usr {
        color: getColor("orange");
    }
    &.sys {
        color: getColor("turquoise");
    }
}

input {
    width: 80%;
    max-width: 1090px;
    color: getColor("offWhite");
    font-weight: bold;
    height: 5vh;
    max-height: 35px;
    outline: none;
    border: none;
    background-color: getColor("grey");
    font-size: 15px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

button {
    color: black;
    height: 5vh;
    width: 80%;
    max-height: 35px;
    font-size: 15px;
    max-width: 1090px;
    border-radius: 0;
    font-weight: bold;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

@media screen and (max-width: $phoneWidth) {
    p {
        line-height: 3.4vh;
        margin-top: 1vh;
        margin-left: 1vh;
        font-size: 2.2vh;
    }
    .outputBox {
        background: getColor('grey');
        height: 70vh;
        width: 90%;
    }
    .docs-container {
        height: 60vh;
        width: 90%;
    }
    input {
        width: 89%;
        height: 5vh;
    }
    button {
        margin-top: 0;
        font-size: 2vh;
        width: 90%;
    }
    .inputContainer {
        margin-bottom: 10vh;
    }
}


</style>