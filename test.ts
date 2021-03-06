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
    led.toggle(2, 2)
    k ++
    modules.yahboomLedRing.setMaxPower(50)
    const sl = modules.yahboomSoundLevel.soundLevel() || 0
    const b = 2 + sl
    modules.yahboomLedRing.setBrightness(b)
    for(let i = 0; i < 24; ++i) {
        modules.yahboomLedRing.setPixelColor(i, colors[(k + i) % colors.length])
    }
    modules.yahboomLedRing.show()
    pause(20)
})