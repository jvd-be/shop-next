import DiscountPopup from "@/components/modules/popups/discountpopup/Discountpopup"

export default function Popups ({ popups, popupKey }) {

const popup = popups.find(item => item.key === popupKey);
  
  if (!popup) return null

  switch (popup.key) {
    case 'home':
      return <DiscountPopup popup={popup} />
    case 'cart':
      return <DiscountPopup popup={popup} />

    default:
      return null
  }
}
