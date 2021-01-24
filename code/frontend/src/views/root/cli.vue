<template>
    <div>
        <div class="outputBox">
            <p 
                v-for="(info, index) in output" 
                :key="index"
                :class="info.status"
            >
                {{ `[ ${index} ]` }} {{ prefix(info.from) }}  {{ info.msg }}
            </p>
        </div>
        <div class="inputContainer">
            <input type="text" v-model="input"><br>
            <button class="silver" @click="execute()">Execute</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "cloudCLI",
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
            }, 300)
        }
    },
    methods:{
        prefix(from) {
            switch(from) {
                case 's':
                    return '[ sys ] : '
                case 'u':
                    return '[ usr ] : '
                case 'a':
                    return '[ ser ] : '
            }
        },
        addToOutput(msg, status="okay", from="s") {
            this.outputQueue.push({ from, status, msg })
        },
        keyBindings($event) {
            const enter = 13
            if ($event.keyCode === enter)
                this.execute()
            const upKey = 38
            if ($event.keyCode === upKey)
                this.retrieveCommandHistory()
        },
        retrieveCommandHistory() {
            this.historySelector++
            const command = this.commandHistory[this.historySelector]
            if (typeof command !== 'undefined')
                this.input = command
            else
                this.input = ''
        },
        exit() {
            window.setTimeout(() => {
                this.$router.push('/root/')
            }, 2_300)
        },
        cloudCommands(command) {
            switch(command[0]) {
                case 'clear':
                    this.output = []
                    this.outputQueue = []
                    return
                case 'test':
                    console.log('hi')
                    break
                case '--help':
                    return { 
                        msg: `Available Cloud Commands. Clear: clear screen. All Other Commands Are Sent to server. Check documentation for more info`,
                        status: 'extraInfo' 
                    }
                case "bye":
                    this.exit()
                    return { msg: `cya later ${this.name}`, status: 'okay' }
                default:
                    return { msg: 'Command Not Found', status: 'fail' }
            }
            return { msg: 'Valid command', status: 'success' }
        },
        cloudCommand(command) {
            const cloudCommands = ["clear", "--help", "bye"]
            return !! cloudCommands.find(cmd => cmd === command)
        },
        async cli(command) {
            try {
                let cmd = this.preprocessCommand(command)
                if (this.cloudCommand(cmd[0]))
                    return this.cloudCommands(cmd)
                else {
                    const res = await this.$API.root.executeCommand({ command: cmd })
                    res.forEach(msg => { this.addToOutput(msg.msg, msg.status, msg.from) })
                }
            } catch(err) {
                console.log(err)
                return { msg: `A problem was encounter when executing command. Err: ${err}`, status: 'fail' }
            }
        },
        preprocessCommand(command) {
            let cmd = command.trim()
            cmd = cmd.toLowerCase()
            return cmd.split(' ')
        },
        execute() {
            this.addToOutput(this.input, 'okay', 'u')
            this.commandHistory.unshift(this.input)
            this.historySelector = -1
            const cliResponse = this.cli(this.input)
            if (cliResponse)
                this.addToOutput(cliResponse.msg, cliResponse.status)
            this.input = ''
        }
    },
    created() {
        this.outputMutator
        window.addEventListener('keyup', this.keyBindings)
        this.addToOutput(`Asalam Alaikoum ${this._.stringFormat(this.name)} 😀`)
        this.addToOutput(`System is ready for commands 👍`, 'success')
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
    width: 80%;
    margin-left: auto;
    margin-right: auto;
    overflow: auto;
    text-align: left;
    border: getColor("blue") solid 2px;
}

.inputContainer {
    margin-top: 6vh;
}

p {
    margin-left: 1vw;
    line-height: 2vh;
    font-weight: bold;
    width: 80%;
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

input {
    width: 79%;
    color: getColor("offWhite");
    font-weight: bold;
}

button {
    color: black;
}

</style>