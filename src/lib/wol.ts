import wol from "wake_on_lan"

function sendWol(mac: string, address?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    wol.wake(mac, { address }, (error: unknown) => {
      if (error) reject(error)
      else resolve()
    })
  })
}

export { sendWol }
