import HeroSlider from "../heroslider/Heroslider"

export default function Sliders({ sliders, sliderKey }) {
  const slider = sliders.find(item => item.key === sliderKey)
  console.log("sliderKey",sliderKey);
  
  if (!slider) return null

  switch (slider.key) {
    case 'home-hero':
      return <HeroSlider slider={slider} />

    case 'product':
      return <ProductSlider slider={slider} />

    default:
      return null
  }
}
