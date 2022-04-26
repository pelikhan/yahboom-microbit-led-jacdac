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
    k ++
    const sl = modules.yahboomSoundLevel.soundLevel()
    modules.yahboomLedRing.setBrightness(0.2 + sl * 0.8)
    for(let i = 0; i < 24; ++i)
        modules.yahboomLedRing.setPixelColor(i, colors[(k + i) % colors.length])
    pause(100)
})