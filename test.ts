const colors = [
    0xff0000,
    0x0ff000,
    0x00ff00,
    0x000ff0,
    0x0000ff,
    0xf0000f,
]

let k = 0
forever(() => {
    modules.yahboomLedRing.setMaxPower(50)
    k ++
    const sl = modules.yahboomSoundLevel.soundLevel()
    const b = 20 + sl / 100 * 80
    modules.yahboomLedRing.setBrightness(b)
    for(let i = 0; i < 24; ++i) {
        modules.yahboomLedRing.setPixelColor(i, colors[(k + i) % colors.length])
    }
    pause(100)
})