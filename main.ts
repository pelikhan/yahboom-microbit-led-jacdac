namespace modules {
    /**
     * Yahboom LED Ring 24
     */
    //% fixedInstance whenUsed block="yahboom led ring"
    export const yahboomLedRing = new LedClient("yahboom led ring?dev=self&num_pixels=24&variant=ring")

    /**
     * Yahboom sound level
     */
    //% fixedInstance whenUsed block="yahboom sound level"
    export const yahboomSoundLevel = new SoundLevelClient("yahboom sound level?dev=self")
}

namespace servers {
    class LedServer extends jacdac.Server {
        pixels: Buffer
        numPixels: number
        pin: DigitalPin
        maxPower: number

        constructor(pin: DigitalPin, numPixels: number, variant: jacdac.LedVariant, bufferMode?: number) {
            super(jacdac.SRV_LED, { variant: variant })

            this.pin = pin
            this.numPixels = numPixels

            pins.setPull(this.pin, PinPullMode.PullNone)
            if (bufferMode)
                ws2812b.setBufferMode(this.pin, bufferMode)
            this.pixels = control.createBuffer(this.numPixels * 3)
            this.maxPower = 50
        }

        handlePacket(pkt: jacdac.JDPacket) {
            this.handleRegFormat(pkt, jacdac.LedReg.NumPixels, jacdac.LedRegPack.NumPixels, [this.numPixels])
            this.maxPower = this.handleRegUInt32(pkt, jacdac.LedReg.MaxPower, this.maxPower)

            this.handleRegBuffer(pkt, jacdac.LedReg.Pixels, this.pixels)
            this.show()
        }

        show() {
            if (this.stateUpdated) {
                ws2812b.sendBuffer(this.pixels, this.pin)
                this.stateUpdated = false
            }
        }
    }

    function start() {
        jacdac.startSelfServers(() => {
            const servers = [
                new LedServer(DigitalPin.P2, 24, jacdac.LedVariant.Ring),
                jacdac.createSimpleSensorServer(
                    jacdac.SRV_SOUND_LEVEL, 
                    jacdac.SoundLevelRegPack.SoundLevel, 
                    () => pins.analogReadPin(AnalogPin.P1) / 1024.0, 
                    {
                        streamingInterval: 100,
                    })
            ]
            return servers
        })
    }
    start()
}