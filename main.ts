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
        jacdac.productIdentifier = 0x3a509251
        jacdac.deviceDescription = "Yahboom Microbit-LED"
        jacdac.startSelfServers(() => {
            const pin = DigitalPin.P2
            pins.setPull(pin, PinPullMode.PullNone)
            const sendPixels = (pixels: Buffer, brightness: number) => light.sendWS2812BufferWithBrightness(pixels, pin, brightness)
            const servers = [
                new jacdac.LedServer(
                    24,
                    jacdac.LedPixelLayout.RgbGrb,
                    sendPixels, {
                    variant: jacdac.LedVariant.Ring
                }),
                jacdac.createSimpleSensorServer(
                    jacdac.SRV_SOUND_LEVEL,
                    jacdac.SoundLevelRegPack.SoundLevel,
                    () => Math.clamp(0, 1, pins.analogReadPin(AnalogPin.P1) / 512),
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