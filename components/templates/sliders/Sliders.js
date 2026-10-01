import HeroSlider from "../heroslider/Heroslider"

export default function Sliders({ sliders, sliderKey }) {
  const slider = sliders.find(item => item.key === sliderKey)

  
  if (!slider) return null

  switch (slider.key) {
    case 'home-hero':
      return <HeroSlider slider={slider} />

    default:
      return null
  }
}
