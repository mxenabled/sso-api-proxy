import readline from "readline"
import { Writable } from "stream"

const makeMutable = (dest) => {
  let muted = false

  const setMuted = (_muted) => {
    muted = _muted
  }

  const stream = new Writable({
    write: function(chunk, encoding, callback) {
      if (!muted) {
        dest.write(chunk, encoding)
      }

      callback()
    }
  })

  return { stream, setMuted }
}

export const prompt = async (message, muted = false, defaultAnswer = "") => {
  const formattedMessage = muted ? `${message} (input is hidden) ` : `${message} `
  const { stream, setMuted } = makeMutable(process.stdout)

  const rl = readline.createInterface({
    input: process.stdin,
    output: stream,
    terminal: true
  })

  let answer
  do {
    answer = await new Promise((resolve) => {
      setMuted(false)

      rl.question(formattedMessage, (answer) => {
        resolve(answer)
      })

      setMuted(muted)
    })

    answer = answer || defaultAnswer
  } while (!answer)

  if (muted) {
    process.stdout.write("\n")
  }

  rl.close()

  return answer
}

export const yesNo = async (message) => {
  const answer = await prompt(message, false, "no")
  return ["yes", "y"].includes(answer.toLowerCase())
}
