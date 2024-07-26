# [CircleSynth](https://circlesynth.elliotmb.dev/)

CircleSynth will be a synthesizer and .wav renderer for generating samples to use in
simple trackers and DAWs like FastTrackerII. Currently just the idea for this project is formed, 
but it will be web-based in Svelte and include such features as: 
- live audio playback for adjustment of oscillators
- custom oscillator creation with frequency-offset-amplitude sinewaves/in series i.e. fourier series
- simple oscillators such as square, sawtooth, triangle
- methods of combining simple and custom oscillators
- complex oscillators such as lerped/curved pulse-width squarewaves
- complex custom oscillators where terms in a series of sinewaves may lerp or curve their properties (frequency/offset/amplitude).

All this is in the aim of creating interesting and unique retro-sounding samples for my music and for others to use and export from this web-app too. 

# Current Features 
- [x] Squarewave generation
- [x] .wav exporting
- [ ] Include wave visualisation
- [ ] Allow user to play different notes
- [ ] Generate pure sinewaves
- [ ] Compose generated sinewaves
- [ ] Customise sinewaves
