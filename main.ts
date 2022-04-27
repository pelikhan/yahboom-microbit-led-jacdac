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
    function start() {
        jacdac.startSelfServers(() => {
            const pin = DigitalPin.P2
            pins.setPull(pin, PinPullMode.PullNone)
            const sendPixels = (pixels: Buffer) => ws2812b.sendBuffer(pixels, pin)

            const servers = [
                new LedServer(24, jacdac.LedVariant.Ring, sendPixels),
                jacdac.createSimpleSensorServer(
                    jacdac.SRV_SOUND_LEVEL, 
                    jacdac.SoundLevelRegPack.SoundLevel, 
                    () => pins.analogReadPin(AnalogPin.P1) / 1024.0, 
                    {
                        streamingInterval: 100,
                        enabled: false
                    })
            ]
            return servers
        })
    }
    start()
}